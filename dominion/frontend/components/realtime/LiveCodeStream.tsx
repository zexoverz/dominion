"use client";

import { useState, useEffect, useRef } from "react";

const CODE_SNIPPETS = [
  `import { AgentOrchestrator } from '@dominion/core';`,
  `import { ShadowProtocol } from '@dominion/phantom';`,
  ``,
  `interface MissionPayload {`,
  `  target: string;`,
  `  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';`,
  `  stealth: boolean;`,
  `  estimatedCost: number;`,
  `}`,
  ``,
  `class PhantomExecutor {`,
  `  private protocol: ShadowProtocol;`,
  `  private missions: Map<string, MissionPayload>;`,
  ``,
  `  constructor(config: ExecutorConfig) {`,
  `    this.protocol = new ShadowProtocol(config);`,
  `    this.missions = new Map();`,
  `    console.log('[PHANTOM] Shadow executor initialized');`,
  `  }`,
  ``,
  `  async deployStealthService(payload: MissionPayload) {`,
  `    const node = await this.protocol.findEdgeNode();`,
  `    const container = await node.spawn({`,
  `      image: 'dominion/shadow-agent:latest',`,
  `      env: { MISSION_ID: payload.target },`,
  `      resources: { cpu: '0.5', memory: '512Mi' },`,
  `    });`,
  `    await container.waitForReady();`,
  `    return { status: 'DEPLOYED', nodeId: node.id };`,
  `  }`,
  ``,
  `  async executeZeroDowntime(serviceId: string) {`,
  `    const health = await this.protocol.healthCheck(serviceId);`,
  `    if (health.score < 0.95) {`,
  `      await this.protocol.rollback(serviceId);`,
  `      throw new Error('Health check failed');`,
  `    }`,
  `    const result = await this.protocol.cutover(serviceId);`,
  `    this.missions.delete(serviceId);`,
  `    return result;`,
  `  }`,
  ``,
  `  getActiveCount(): number {`,
  `    return this.missions.size;`,
  `  }`,
  `}`,
  ``,
  `// Initialize phantom network`,
  `const phantom = new PhantomExecutor({`,
  `  encryption: 'aes-256-gcm',`,
  `  timeout: 30_000,`,
  `  retries: 3,`,
  `});`,
  ``,
  `export default phantom;`,
];

export default function LiveCodeStream({ className = "" }: { className?: string }) {
  const [lines, setLines] = useState<string[]>([]);
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [currentLine, setCurrentLine] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const fullLine = CODE_SNIPPETS[lineIdx % CODE_SNIPPETS.length];

      if (charIdx < fullLine.length) {
        setCurrentLine(fullLine.slice(0, charIdx + 1));
        setCharIdx((c) => c + 1);
      } else {
        setLines((prev) => [...prev.slice(-30), fullLine]);
        setCurrentLine("");
        setCharIdx(0);
        setLineIdx((i) => (i + 1) % CODE_SNIPPETS.length);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [lineIdx, charIdx]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines, currentLine]);

  const colorize = (line: string) => {
    if (line.startsWith("import") || line.startsWith("export")) return "text-throne-violet";
    if (line.startsWith("//")) return "text-gray-600";
    if (line.includes("class ") || line.includes("interface ")) return "text-throne-gold";
    if (line.includes("async ") || line.includes("await ")) return "text-throne-cyan";
    if (line.includes("const ") || line.includes("let ")) return "text-throne-blue";
    if (line.includes("return ") || line.includes("throw ")) return "text-throne-red";
    return "text-green-400";
  };

  return (
    <div className={`pixel-border-thin bg-black/90 p-3 font-mono ${className}`}>
      <div className="flex items-center gap-2 mb-2 border-b border-green-900/50 pb-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-[8px] text-green-500">👻 PHANTOM — LIVE CODE STREAM</span>
        <span className="text-[7px] text-green-800 ml-auto">shadow-executor.ts</span>
      </div>
      <div ref={containerRef} className="overflow-y-auto max-h-[250px] space-y-0">
        {lines.map((line, i) => (
          <div key={i} className="flex">
            <span className="text-[7px] text-green-900 w-6 text-right mr-2 select-none shrink-0">
              {((lineIdx - lines.length + i + CODE_SNIPPETS.length) % CODE_SNIPPETS.length) + 1}
            </span>
            <span className={`text-[8px] ${colorize(line)} whitespace-pre`}>{line}</span>
          </div>
        ))}
        {/* Current typing line */}
        <div className="flex">
          <span className="text-[7px] text-green-900 w-6 text-right mr-2 select-none shrink-0">
            {(lineIdx % CODE_SNIPPETS.length) + 1}
          </span>
          <span className={`text-[8px] ${colorize(currentLine)} whitespace-pre`}>
            {currentLine}
            <span className="inline-block w-1.5 h-3 bg-green-400 ml-px animate-blink" />
          </span>
        </div>
      </div>
    </div>
  );
}
