/**
 * 👁️ WRAITH-EYE TASK TEMPLATES — Pre-built Security & Monitoring Protocols
 *
 * Ready-made task configurations for common WRAITH-EYE operations.
 * Each template returns a mission for the agent spawner.
 *
 * "I saw you before you saw yourself."
 *   — WRAITH-EYE, The Silent Watcher
 */

import { Mission } from './agent-spawner';

// ---------------------------------------------------------------------------
// Security Audit
// ---------------------------------------------------------------------------

export function securityAudit(params: {
  target: string;
  scope: 'full' | 'dependencies' | 'config' | 'code' | 'infrastructure' | string;
  severity?: 'routine' | 'elevated' | 'critical';
}): Mission {
  return {
    id: `wraith-audit-${Date.now()}`,
    title: `Security Audit: ${params.target}`,
    description: `Audit ${params.target} for vulnerabilities. Scope: ${params.scope}. Severity context: ${params.severity || 'routine'}.`,
    priority: params.severity === 'critical' ? 'critical' : 'high',
    createdBy: 'THRONE',
    steps: [
      {
        id: 'reconnaissance',
        title: 'Reconnaissance',
        description: `Map the attack surface of: ${params.target}. Scope: ${params.scope}. Catalog all entry points, dependencies, exposed interfaces, and configuration surfaces. Know the perimeter before you test it.`,
        assignedGeneral: 'WRAITH-EYE',
        status: 'pending',
      },
      {
        id: 'vulnerability-scan',
        title: 'Vulnerability Scan',
        description: `Scan for vulnerabilities: outdated dependencies, insecure configurations, exposed secrets, injection vectors, authentication weaknesses, permission escalation paths. Leave no shadow unchecked.`,
        assignedGeneral: 'WRAITH-EYE',
        status: 'pending',
        dependsOn: ['reconnaissance'],
      },
      {
        id: 'risk-assessment',
        title: 'Risk Assessment',
        description: 'Classify each finding: CRITICAL / HIGH / MEDIUM / LOW. Assess exploitability, blast radius, and likelihood. Prioritize by real-world threat potential, not theoretical purity.',
        assignedGeneral: 'WRAITH-EYE',
        status: 'pending',
        dependsOn: ['vulnerability-scan'],
      },
      {
        id: 'remediation',
        title: 'Remediation Report',
        description: 'Deliver remediation plan. For each finding: description, risk level, recommended fix, and implementation priority. The Watcher reports what it sees — and what must be done.',
        assignedGeneral: 'WRAITH-EYE',
        status: 'pending',
        dependsOn: ['risk-assessment'],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Uptime Monitor
// ---------------------------------------------------------------------------

export function uptimeMonitor(params: {
  services: string[];
  checkDepth?: 'ping' | 'health' | 'deep';
  alertThreshold?: string;
}): Mission {
  return {
    id: `wraith-uptime-${Date.now()}`,
    title: `Uptime Monitor: ${params.services.length} services`,
    description: `Check health of: ${params.services.join(', ')}. Depth: ${params.checkDepth || 'health'}.`,
    priority: 'high',
    createdBy: 'THRONE',
    steps: [
      {
        id: 'sweep',
        title: 'Service Sweep',
        description: `Check all services: ${params.services.join(', ')}. Depth: ${params.checkDepth || 'health'}. Verify: reachability, response times, error rates, resource utilization. The perimeter must hold.`,
        assignedGeneral: 'WRAITH-EYE',
        status: 'pending',
      },
      {
        id: 'diagnose',
        title: 'Issue Diagnosis',
        description: `For any degraded or failed services: diagnose root cause. Check logs, recent deployments, resource exhaustion, dependency failures. ${params.alertThreshold ? `Alert threshold: ${params.alertThreshold}.` : ''} Identify if issues are isolated or systemic.`,
        assignedGeneral: 'WRAITH-EYE',
        status: 'pending',
        dependsOn: ['sweep'],
      },
      {
        id: 'status-report',
        title: 'Status Report',
        description: 'Deliver status report: each service with status (NOMINAL / DEGRADED / DOWN), response time, uptime percentage, and any active issues. Recommend immediate actions for anything non-nominal. The Watcher never sleeps.',
        assignedGeneral: 'WRAITH-EYE',
        status: 'pending',
        dependsOn: ['diagnose'],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Activity Surveillance
// ---------------------------------------------------------------------------

export function activitySurveillance(params: {
  period: string;
  focus?: 'all-agents' | 'external' | 'api-usage' | 'deployments' | string;
  baselineComparison?: boolean;
}): Mission {
  return {
    id: `wraith-surveillance-${Date.now()}`,
    title: `Activity Surveillance: ${params.period}`,
    description: `Review all agent and system activity for ${params.period}. Focus: ${params.focus || 'all-agents'}. Looking for anomalies.`,
    priority: 'medium',
    createdBy: 'THRONE',
    steps: [
      {
        id: 'collect',
        title: 'Activity Collection',
        description: `Collect activity logs for: ${params.period}. Focus: ${params.focus || 'all-agents'}. Gather: API calls, deployments, file changes, external connections, error spikes. Every action leaves a trace.`,
        assignedGeneral: 'WRAITH-EYE',
        status: 'pending',
      },
      {
        id: 'analyze',
        title: 'Anomaly Detection',
        description: `Analyze activity patterns. ${params.baselineComparison ? 'Compare against established baseline.' : 'Establish baseline from collected data.'} Flag: unusual access patterns, unexpected API spikes, unauthorized changes, timing anomalies, behavioral deviations. Suspicion is a survival instinct.`,
        assignedGeneral: 'WRAITH-EYE',
        status: 'pending',
        dependsOn: ['collect'],
      },
      {
        id: 'report',
        title: 'Surveillance Report',
        description: 'Deliver surveillance report: activity summary, anomalies detected (with severity), patterns of concern, and recommended follow-up actions. What the Watcher sees, THRONE must know.',
        assignedGeneral: 'WRAITH-EYE',
        status: 'pending',
        dependsOn: ['analyze'],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Threat Assessment
// ---------------------------------------------------------------------------

export function threatAssessment(params: {
  domain: string;
  context?: string;
  urgency?: 'routine' | 'elevated' | 'immediate';
}): Mission {
  return {
    id: `wraith-threat-${Date.now()}`,
    title: `Threat Assessment: ${params.domain}`,
    description: `Assess threats in: ${params.domain}. Urgency: ${params.urgency || 'routine'}. ${params.context ? `Context: ${params.context}.` : ''}`,
    priority: params.urgency === 'immediate' ? 'critical' : 'high',
    createdBy: 'THRONE',
    steps: [
      {
        id: 'landscape',
        title: 'Threat Landscape',
        description: `Map the threat landscape for: ${params.domain}. ${params.context ? `Context: ${params.context}.` : ''} Identify threat actors, attack vectors, known vulnerabilities, and exposure points. Know thy enemy.`,
        assignedGeneral: 'WRAITH-EYE',
        status: 'pending',
      },
      {
        id: 'evaluate',
        title: 'Threat Evaluation',
        description: 'Evaluate each threat: likelihood, impact severity, current defenses, and gaps in protection. Model worst-case scenarios. Paranoia is not a flaw — it is doctrine.',
        assignedGeneral: 'WRAITH-EYE',
        status: 'pending',
        dependsOn: ['landscape'],
      },
      {
        id: 'countermeasures',
        title: 'Countermeasures',
        description: 'Recommend countermeasures for each significant threat. Include: preventive measures, detection capabilities, response procedures, and recovery plans. The Dominion must be prepared before the attack, not after.',
        assignedGeneral: 'WRAITH-EYE',
        status: 'pending',
        dependsOn: ['evaluate'],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Access Review
// ---------------------------------------------------------------------------

export function accessReview(params: {
  systems: string[];
  includeApiKeys?: boolean;
  includeThirdParty?: boolean;
}): Mission {
  return {
    id: `wraith-access-${Date.now()}`,
    title: `Access Review: ${params.systems.length} systems`,
    description: `Review access controls for: ${params.systems.join(', ')}. ${params.includeApiKeys ? 'Include API key audit.' : ''} ${params.includeThirdParty ? 'Include third-party integrations.' : ''}`,
    priority: 'high',
    createdBy: 'THRONE',
    steps: [
      {
        id: 'inventory',
        title: 'Access Inventory',
        description: `Catalog all access grants for: ${params.systems.join(', ')}. Who has access, what level, when granted, last used. ${params.includeApiKeys ? 'Include all API keys and tokens — their scope, age, and rotation status.' : ''} ${params.includeThirdParty ? 'Include third-party OAuth grants and integration permissions.' : ''} Map every door and who holds the keys.`,
        assignedGeneral: 'WRAITH-EYE',
        status: 'pending',
      },
      {
        id: 'evaluate',
        title: 'Access Evaluation',
        description: 'Evaluate each access grant against principle of least privilege. Flag: excessive permissions, stale access, shared credentials, missing MFA, orphaned accounts. Every unnecessary permission is an open window.',
        assignedGeneral: 'WRAITH-EYE',
        status: 'pending',
        dependsOn: ['inventory'],
      },
      {
        id: 'recommendations',
        title: 'Access Recommendations',
        description: 'Deliver access review report: revocations needed, permission downgrades, key rotations required, and policy improvements. The fewer the doors, the safer the keep.',
        assignedGeneral: 'WRAITH-EYE',
        status: 'pending',
        dependsOn: ['evaluate'],
      },
    ],
  };
}
