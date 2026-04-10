import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useAssignments = () => {
  return useQuery({
    queryKey: ['assignments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .order('due_date', { ascending: true });
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateAssignment = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();

  return useMutation({
    mutationFn: async (assignment: {
      title: string;
      subject: string;
      difficulty: string;
      description: string;
      due_date: string;
      language: string;
      starter_code: string;
      ideal_solution: string;
      max_score: number;
    }) => {
      if (!session) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('assignments')
        .insert({ ...assignment, created_by: session.user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      toast.success('Assignment created!');
    },
    onError: (err: Error) => toast.error(err.message),
  });
};

export const useSubmissions = (assignmentId?: string) => {
  const { session } = useAuth();
  return useQuery({
    queryKey: ['submissions', assignmentId],
    enabled: !!session,
    queryFn: async () => {
      let query = supabase.from('submissions').select('*');
      if (assignmentId) query = query.eq('assignment_id', assignmentId);
      const { data, error } = await query.order('submitted_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateSubmission = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();

  return useMutation({
    mutationFn: async (submission: {
      assignment_id: string;
      code: string;
      compiler_output?: string;
      score?: number;
    }) => {
      if (!session) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('submissions')
        .insert({ ...submission, student_id: session.user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      toast.success('Submission saved!');
    },
    onError: (err: Error) => toast.error(err.message),
  });
};

export const useAIFeedback = () => {
  return useMutation({
    mutationFn: async ({ code, language, assignmentTitle }: { code: string; language: string; assignmentTitle: string }) => {
      const { data, error } = await supabase.functions.invoke('ai-feedback', {
        body: { code, language, assignmentTitle },
      });
      if (error) throw error;
      return data as { feedback: string; score: number; radarScores: Record<string, number> };
    },
    onError: (err: Error) => toast.error(`AI Feedback error: ${err.message}`),
  });
};
