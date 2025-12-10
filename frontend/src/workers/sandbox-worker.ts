/// <reference lib="webworker" />

type SandboxRequest = { code: string };
type SandboxResponse =
  | { type: "log"; message: string }
  | { type: "error"; message: string }
  | { type: "done"; logs: string[] };

const formatArgs = (args: unknown[]) =>
  args
    .map((arg) => {
      if (typeof arg === "object") {
        try {
          return JSON.stringify(arg, null, 2);
        } catch {
          return "[unserializable]";
        }
      }
      return String(arg);
    })
    .join(" ");

const sanitizeCode = (code: string) =>
  code
    .replace(/:\s*string/g, "")
    .replace(/:\s*number/g, "")
    .replace(/:\s*boolean/g, "")
    .replace(/:\s*any/g, "")
    .replace(/:\s*void/g, "")
    .replace(/:\s*\w+\[\]/g, "")
    .replace(/:\s*\{[^}]+\}/g, "")
    .replace(/interface\s+\w+\s*\{[^}]+\}/gs, "")
    .replace(/type\s+\w+\s*=\s*[^;]+;/g, "")
    .replace(/<\w+>/g, "")
    .replace(/\?\s*:/g, ":")
    .replace(/private\s+/g, "")
    .replace(/public\s+/g, "")
    .replace(/protected\s+/g, "")
    .replace(/readonly\s+/g, "");

self.onmessage = async (event: MessageEvent<SandboxRequest>) => {
  const logs: string[] = [];
  const send = (payload: SandboxResponse) => {
    postMessage(payload);
  };

  // 콘솔을 OkHttp Interceptor처럼 가로채어, 로그를 메인 스레드로 되돌려 보냅니다.
  const consoleProxy = {
    log: (...args: unknown[]) => {
      const message = formatArgs(args);
      logs.push(message);
      send({ type: "log", message });
    },
    error: (...args: unknown[]) => {
      const message = `❌ ${formatArgs(args)}`;
      logs.push(message);
      send({ type: "log", message });
    },
  };

  try {
    const safeCode = sanitizeCode(event.data?.code ?? "");
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor as new (
      ...args: string[]
    ) => (...args: unknown[]) => Promise<unknown>;
    const runner = new AsyncFunction("console", `"use strict"; ${safeCode}`);

    await runner(consoleProxy);
    send({ type: "done", logs });
  } catch (error) {
    send({
      type: "error",
      message: error instanceof Error ? error.message : String(error),
    });
  }
};
