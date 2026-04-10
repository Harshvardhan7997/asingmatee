import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(authHeader.replace("Bearer ", ""));
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { code, language, assignmentTitle } = await req.json();

    if (!code || !language) {
      return new Response(JSON.stringify({ error: "code and language are required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are an expert code reviewer and teacher. Analyze the student's code submission and provide:
1. Detailed feedback on correctness, style, and efficiency
2. A score from 0-100
3. Radar scores for: logic (0-100), syntax (0-100), clarity (0-100), problemSolving (0-100), knowledge (0-100)

Respond ONLY with valid JSON in this format:
{"feedback": "your detailed feedback here", "score": 85, "radarScores": {"logic": 80, "syntax": 90, "clarity": 75, "problemSolving": 85, "knowledge": 80}}`
          },
          {
            role: "user",
            content: `Assignment: ${assignmentTitle || "Code Review"}\nLanguage: ${language}\n\nStudent Code:\n\`\`\`${language}\n${code}\n\`\`\``
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_feedback",
              description: "Provide structured code review feedback",
              parameters: {
                type: "object",
                properties: {
                  feedback: { type: "string", description: "Detailed feedback" },
                  score: { type: "number", description: "Score 0-100" },
                  radarScores: {
                    type: "object",
                    properties: {
                      logic: { type: "number" },
                      syntax: { type: "number" },
                      clarity: { type: "number" },
                      problemSolving: { type: "number" },
                      knowledge: { type: "number" },
                    },
                    required: ["logic", "syntax", "clarity", "problemSolving", "knowledge"],
                  },
                },
                required: ["feedback", "score", "radarScores"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "provide_feedback" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const aiResult = await response.json();
    const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
    
    let result;
    if (toolCall?.function?.arguments) {
      result = JSON.parse(toolCall.function.arguments);
    } else {
      // Fallback: try parsing the content as JSON
      const content = aiResult.choices?.[0]?.message?.content || "";
      try {
        result = JSON.parse(content);
      } catch {
        result = {
          feedback: content || "Unable to generate feedback. Please try again.",
          score: 70,
          radarScores: { logic: 70, syntax: 70, clarity: 70, problemSolving: 70, knowledge: 70 },
        };
      }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-feedback error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
