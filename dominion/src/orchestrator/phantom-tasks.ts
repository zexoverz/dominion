/**
 * 👻 PHANTOM TASK TEMPLATES — Pre-built Engineering Protocols
 *
 * Ready-made task configurations for common PHANTOM operations.
 * Each template returns a mission for the agent spawner.
 *
 * "Ship it or shut up." — PHANTOM
 */

import { Mission } from './agent-spawner';

// ---------------------------------------------------------------------------
// Code Generation
// ---------------------------------------------------------------------------

export function codeGeneration(params: {
  description: string;
  language: string;
  outputPath: string;
  requirements?: string[];
  dependencies?: string[];
}): Mission {
  return {
    id: `phantom-codegen-${Date.now()}`,
    title: `Code Gen: ${params.description}`,
    description: `Generate ${params.language} code: ${params.description}. Output to: ${params.outputPath}.`,
    priority: 'medium',
    createdBy: 'THRONE',
    steps: [
      {
        id: 'design',
        title: 'Design',
        description: `Design the solution for: ${params.description}. Language: ${params.language}. ${params.requirements ? `Requirements: ${params.requirements.join(', ')}.` : ''} Plan file structure, interfaces, and key algorithms.`,
        assignedGeneral: 'PHANTOM',
        status: 'pending',
      },
      {
        id: 'implement',
        title: 'Implementation',
        description: `Write the code. Output to ${params.outputPath}. ${params.dependencies ? `Dependencies: ${params.dependencies.join(', ')}.` : ''} Write clean, typed, documented code.`,
        assignedGeneral: 'PHANTOM',
        status: 'pending',
        dependsOn: ['design'],
      },
      {
        id: 'test',
        title: 'Testing',
        description: 'Write tests. Ensure edge cases are covered. Run tests and fix any failures.',
        assignedGeneral: 'PHANTOM',
        status: 'pending',
        dependsOn: ['implement'],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Code Review
// ---------------------------------------------------------------------------

export function codeReview(params: {
  filePaths: string[];
  focus?: string[];
  severity?: 'quick' | 'thorough';
}): Mission {
  return {
    id: `phantom-review-${Date.now()}`,
    title: `Code Review: ${params.filePaths.length} files`,
    description: `Review code in: ${params.filePaths.join(', ')}. Depth: ${params.severity || 'thorough'}.`,
    priority: 'medium',
    createdBy: 'THRONE',
    steps: [
      {
        id: 'read',
        title: 'Read & Understand',
        description: `Read all files: ${params.filePaths.join(', ')}. Understand the codebase structure and intent.`,
        assignedGeneral: 'PHANTOM',
        status: 'pending',
      },
      {
        id: 'review',
        title: 'Review',
        description: `Review for: ${params.focus?.join(', ') || 'bugs, security, performance, readability, maintainability'}. Categorize findings by severity (critical/major/minor/nit).`,
        assignedGeneral: 'PHANTOM',
        status: 'pending',
        dependsOn: ['read'],
      },
      {
        id: 'report',
        title: 'Report & Suggestions',
        description: 'Compile review report with specific fix suggestions. Include code snippets for proposed changes.',
        assignedGeneral: 'PHANTOM',
        status: 'pending',
        dependsOn: ['review'],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Architecture Design
// ---------------------------------------------------------------------------

export function architectureDesign(params: {
  system: string;
  requirements: string[];
  constraints?: string[];
  scale?: string;
}): Mission {
  return {
    id: `phantom-arch-${Date.now()}`,
    title: `Architecture: ${params.system}`,
    description: `Design system architecture for: ${params.system}. Scale: ${params.scale || 'startup to mid-scale'}.`,
    priority: 'high',
    createdBy: 'THRONE',
    steps: [
      {
        id: 'requirements',
        title: 'Requirements Analysis',
        description: `Analyze requirements: ${params.requirements.join(', ')}. ${params.constraints ? `Constraints: ${params.constraints.join(', ')}.` : ''} Identify functional and non-functional requirements.`,
        assignedGeneral: 'PHANTOM',
        status: 'pending',
      },
      {
        id: 'design',
        title: 'Architecture Design',
        description: `Design the system architecture. Include: component diagram, data flow, API contracts, tech stack selection. Target scale: ${params.scale || 'startup to mid-scale'}.`,
        assignedGeneral: 'PHANTOM',
        status: 'pending',
        dependsOn: ['requirements'],
      },
      {
        id: 'tradeoffs',
        title: 'Trade-off Analysis',
        description: 'Document key architectural decisions (ADRs). For each: options considered, trade-offs, rationale.',
        assignedGeneral: 'PHANTOM',
        status: 'pending',
        dependsOn: ['design'],
      },
      {
        id: 'roadmap',
        title: 'Implementation Roadmap',
        description: 'Create phased implementation plan. Identify critical path, dependencies, and risk areas.',
        assignedGeneral: 'PHANTOM',
        status: 'pending',
        dependsOn: ['tradeoffs'],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Bug Fix
// ---------------------------------------------------------------------------

export function bugFix(params: {
  description: string;
  filePaths?: string[];
  reproSteps?: string[];
  errorMessage?: string;
}): Mission {
  return {
    id: `phantom-bugfix-${Date.now()}`,
    title: `Bug Fix: ${params.description}`,
    description: `Fix bug: ${params.description}. ${params.errorMessage ? `Error: ${params.errorMessage}` : ''}`,
    priority: 'high',
    createdBy: 'THRONE',
    steps: [
      {
        id: 'diagnose',
        title: 'Diagnosis',
        description: `Investigate the bug: ${params.description}. ${params.filePaths ? `Look in: ${params.filePaths.join(', ')}.` : ''} ${params.reproSteps ? `Repro steps: ${params.reproSteps.join(' → ')}.` : ''} Find root cause.`,
        assignedGeneral: 'PHANTOM',
        status: 'pending',
      },
      {
        id: 'fix',
        title: 'Fix',
        description: 'Implement the fix. Ensure it addresses root cause, not just symptoms. Minimize blast radius.',
        assignedGeneral: 'PHANTOM',
        status: 'pending',
        dependsOn: ['diagnose'],
      },
      {
        id: 'verify',
        title: 'Verification',
        description: 'Verify the fix. Add regression test. Confirm no side effects.',
        assignedGeneral: 'PHANTOM',
        status: 'pending',
        dependsOn: ['fix'],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Performance Optimization
// ---------------------------------------------------------------------------

export function performanceOptimization(params: {
  target: string;
  metrics: string[];
  currentPerformance?: string;
  goal?: string;
}): Mission {
  return {
    id: `phantom-perf-${Date.now()}`,
    title: `Perf Optimization: ${params.target}`,
    description: `Optimize performance of: ${params.target}. Metrics: ${params.metrics.join(', ')}. ${params.goal ? `Goal: ${params.goal}.` : ''}`,
    priority: 'medium',
    createdBy: 'THRONE',
    steps: [
      {
        id: 'profile',
        title: 'Profiling',
        description: `Profile ${params.target}. Measure: ${params.metrics.join(', ')}. ${params.currentPerformance ? `Current baseline: ${params.currentPerformance}.` : 'Establish baseline.'} Identify bottlenecks.`,
        assignedGeneral: 'PHANTOM',
        status: 'pending',
      },
      {
        id: 'optimize',
        title: 'Optimization',
        description: `Implement optimizations targeting identified bottlenecks. ${params.goal ? `Target: ${params.goal}.` : ''} Prioritize by impact/effort ratio.`,
        assignedGeneral: 'PHANTOM',
        status: 'pending',
        dependsOn: ['profile'],
      },
      {
        id: 'benchmark',
        title: 'Benchmarking',
        description: 'Re-measure performance. Compare against baseline. Document improvements and any regressions.',
        assignedGeneral: 'PHANTOM',
        status: 'pending',
        dependsOn: ['optimize'],
      },
    ],
  };
}
