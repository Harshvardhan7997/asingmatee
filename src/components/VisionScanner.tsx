import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, Scan, X, Check, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const MOCK_OCR_RESULTS = [
  `def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr`,
  `int fibonacci(int n) {\n    if (n <= 1) return n;\n    return fibonacci(n-1) + fibonacci(n-2);\n}`,
  `public static boolean isPalindrome(String s) {\n    int left = 0, right = s.length() - 1;\n    while (left < right) {\n        if (s.charAt(left) != s.charAt(right)) return false;\n        left++; right--;\n    }\n    return true;\n}`,
];

const VisionScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch {
      toast.error('Camera access denied. Using mock OCR instead.');
      mockScan();
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const mockScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const result = MOCK_OCR_RESULTS[Math.floor(Math.random() * MOCK_OCR_RESULTS.length)];
      setScannedCode(result);
      setIsScanning(false);
      toast.success('Code digitized successfully!');
    }, 2000);
  };

  const handleCapture = () => {
    stopCamera();
    mockScan();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Scan className="w-5 h-5 text-primary" /> AI Vision Scanner
        </h2>
        <p className="text-muted-foreground text-sm">Scan handwritten code or notes and digitize them instantly.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Camera / Upload */}
        <div className="bg-card border border-border rounded-lg overflow-hidden cyber-border">
          <div className="p-3 border-b border-border text-xs text-muted-foreground uppercase tracking-wider">Input</div>
          <div className="aspect-video bg-secondary/50 relative flex items-center justify-center">
            {cameraActive ? (
              <>
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute inset-4 border-2 border-primary/40 rounded-lg pointer-events-none">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary rounded-bl" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary rounded-br" />
                </div>
                {isScanning && (
                  <motion.div
                    className="absolute left-4 right-4 h-0.5 bg-primary"
                    animate={{ top: ['10%', '90%', '10%'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </>
            ) : (
              <div className="text-center p-8">
                <Camera className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-4">Point your camera at handwritten code</p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={startCamera} size="sm" className="bg-primary/20 text-primary border border-primary/30">
                    <Camera className="w-4 h-4 mr-1" /> Open Camera
                  </Button>
                  <Button onClick={mockScan} size="sm" variant="outline" disabled={isScanning}>
                    <Upload className="w-4 h-4 mr-1" /> {isScanning ? 'Scanning...' : 'Mock Scan'}
                  </Button>
                </div>
              </div>
            )}
          </div>
          {cameraActive && (
            <div className="p-3 flex gap-2 justify-center">
              <Button onClick={handleCapture} size="sm" className="bg-neon-green/20 text-neon-green border border-neon-green/30">
                <Check className="w-4 h-4 mr-1" /> Capture
              </Button>
              <Button onClick={stopCamera} size="sm" variant="outline">
                <X className="w-4 h-4 mr-1" /> Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Output */}
        <div className="bg-card border border-border rounded-lg overflow-hidden cyber-border">
          <div className="p-3 border-b border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Digitized Output</span>
            {scannedCode && (
              <Button size="sm" variant="ghost" className="text-xs text-primary"
                onClick={() => { navigator.clipboard.writeText(scannedCode); toast.success('Copied to clipboard!'); }}>
                <Code2 className="w-3 h-3 mr-1" /> Copy to Editor
              </Button>
            )}
          </div>
          <div className="p-4 min-h-[200px]">
            {isScanning ? (
              <div className="flex items-center gap-3 text-muted-foreground">
                <motion.div className="w-2 h-2 rounded-full bg-primary" animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} />
                <span className="text-sm">Processing handwriting...</span>
              </div>
            ) : scannedCode ? (
              <pre className="text-sm font-mono text-foreground whitespace-pre-wrap">{scannedCode}</pre>
            ) : (
              <p className="text-muted-foreground text-sm">Scan or upload handwritten code to see digitized output here.</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VisionScanner;
