import { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Terminal, CheckCircle, X, Code2, Check } from 'lucide-react';

interface CodeEditorProps {
  initialCode: string;
  onComplete?: () => void;
}

type SandboxResponse =
  | { type: 'log'; message: string }
  | { type: 'error'; message: string }
  | { type: 'done'; logs: string[] };

export function CodeEditor({ initialCode, onComplete }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    setCode(initialCode);
    setOutput([]);
    setHasRun(false);
  }, [initialCode]);

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  const ensureWorker = () => {
    if (!workerRef.current) {
      // 워커는 안드로이드 WorkManager처럼 UI 스레드 밖에서 코드 실행을 처리해, 메인 화면을 보호합니다.
      workerRef.current = new Worker(
        new URL('../workers/sandbox-worker.ts', import.meta.url),
        { type: 'module' },
      );
    }
    return workerRef.current;
  };

  const runCode = () => {
    setIsRunning(true);
    setOutput([]);

    const worker = ensureWorker();

    worker.onmessage = (event: MessageEvent<SandboxResponse>) => {
      const data = event.data;
      if (data.type === 'log') {
        setOutput(prev => [...prev, data.message]);
      }
      if (data.type === 'error') {
        setOutput(prev => [...prev, `에러: ${data.message}`]);
        setIsRunning(false);
        setHasRun(true);
      }
      if (data.type === 'done') {
        setOutput(data.logs.length > 0 ? data.logs : ['✓ 코드가 성공적으로 실행되었습니다.']);
        setIsRunning(false);
        setHasRun(true);
        if (onComplete) {
          onComplete();
        }
      }
    };

    worker.onerror = (event) => {
      setOutput(prev => [...prev, `에러: ${event.message}`]);
      setIsRunning(false);
      setHasRun(true);
    };

    worker.postMessage({ code });
  };

  const resetCode = () => {
    setCode(initialCode);
    setOutput([]);
  };

  return (
    <>
      {/* 플로팅 액션 버튼 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 bg-gradient-to-r text-white rounded-full shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
          isExpanded 
            ? 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
            : hasRun
            ? 'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
            : 'from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
        }`}
      >
        {isExpanded ? (
          <>
            <X className="w-6 h-6" />
            <span>닫기</span>
          </>
        ) : (
          <>
            {hasRun ? (
              <Check className="w-6 h-6" />
            ) : (
              <Code2 className="w-6 h-6" />
            )}
            <span>{hasRun ? '실행 완료' : '코드 에디터'}</span>
          </>
        )}
      </button>

      {/* 에디터 및 결과 영역 */}
      {isExpanded && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-2xl border-t-4 border-blue-500 animate-slide-up" style={{ height: '50vh' }}>
          <div className="grid grid-cols-2 h-full">
            {/* 코드 에디터 */}
            <div className="border-r border-gray-200 flex flex-col">
              <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white border-b border-slate-500">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <span className="text-gray-300">editor.ts</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={resetCode}
                    className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                    title="코드 초기화"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>초기화</span>
                  </button>
                  <button
                    onClick={runCode}
                    disabled={isRunning}
                    className="px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    <Play className="w-4 h-4" />
                    <span>실행</span>
                  </button>
                </div>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 p-5 font-mono bg-slate-800 text-gray-100 resize-none focus:outline-none leading-relaxed"
                style={{ fontSize: '14px', lineHeight: '1.6' }}
                spellCheck={false}
              />
            </div>

            {/* 출력 결과 */}
            <div className="flex flex-col bg-gradient-to-br from-gray-50 to-slate-50">
              <div className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-slate-100 to-gray-100 border-b border-gray-300">
                <Terminal className="w-4 h-4 text-slate-600" />
                <span className="text-slate-700">실행 결과</span>
              </div>
              <div className="flex-1 p-5 overflow-y-auto font-mono">
                {output.length === 0 ? (
                  <div className="text-gray-400 flex items-center gap-2 bg-white/50 p-4 rounded-lg border border-gray-200">
                    <CheckCircle className="w-5 h-5" />
                    <span>코드를 실행하면 결과가 여기에 표시됩니다.</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {output.map((line, index) => (
                      <div 
                        key={index} 
                        className="text-slate-800 whitespace-pre-wrap break-words bg-white/70 p-3 rounded-lg border border-gray-200 leading-relaxed"
                        style={{ fontSize: '13px' }}
                      >
                        {line}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
