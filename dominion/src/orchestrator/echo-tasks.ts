/**
 * 🔊 ECHO TASK TEMPLATES — Pre-built Communication & Content Protocols
 *
 * Ready-made task configurations for common ECHO operations.
 * Each template returns a mission for the agent spawner.
 *
 * "Every mind is a door. I simply know which words are keys."
 *   — ECHO, The Voice of Many
 */

import { Mission } from './agent-spawner';

// ---------------------------------------------------------------------------
// Content Creation
// ---------------------------------------------------------------------------

export function contentCreation(params: {
  platform: 'twitter' | 'linkedin' | 'blog' | 'newsletter' | 'discord' | 'generic';
  topic: string;
  style: 'professional' | 'casual' | 'technical' | 'provocative' | 'storytelling';
  quantity?: number;
  targetAudience?: string;
  cta?: string;
}): Mission {
  const platformGuide: Record<string, string> = {
    twitter: 'Twitter/X: 280 char limit per tweet. Use hooks, threads for depth. Hashtags sparingly. Ratio-bait is an art form.',
    linkedin: 'LinkedIn: Professional but human. Story-driven. Line breaks for readability. End with engagement question.',
    blog: 'Blog: Long-form, SEO-aware. Strong headlines, subheadings, scannable. 800-2000 words.',
    newsletter: 'Newsletter: Conversational, value-dense. Subject line is everything. Personal tone.',
    discord: 'Discord: Community-native. Emoji-friendly. Concise. Use formatting (bold, code blocks) effectively.',
    generic: 'Adapt to whatever channel serves the message best.',
  };

  return {
    id: `echo-content-${Date.now()}`,
    title: `Content: ${params.topic} (${params.platform})`,
    description: `Create ${params.style} content about "${params.topic}" for ${params.platform}. ${params.quantity ? `Quantity: ${params.quantity} pieces.` : ''}`,
    priority: 'medium',
    createdBy: 'THRONE',
    steps: [
      {
        id: 'ideate',
        title: 'Ideation & Angles',
        description: `Brainstorm angles for: ${params.topic}. Style: ${params.style}. ${params.targetAudience ? `Target audience: ${params.targetAudience}.` : ''} Find the hook — what makes people stop scrolling? Generate ${(params.quantity || 3) + 2} angles, select the best ${params.quantity || 3}.`,
        assignedGeneral: 'ECHO',
        status: 'pending',
      },
      {
        id: 'craft',
        title: 'Content Crafting',
        description: `Write the content. ${platformGuide[params.platform]} Style: ${params.style}. ${params.cta ? `CTA: ${params.cta}.` : ''} Every word earns its place. The enchantment must land.`,
        assignedGeneral: 'ECHO',
        status: 'pending',
        dependsOn: ['ideate'],
      },
      {
        id: 'polish',
        title: 'Polish & Optimize',
        description: 'Review and polish. Check: voice consistency, engagement hooks, readability, platform fit. Add suggested posting times and any visual/media recommendations. The song must be pitch-perfect.',
        assignedGeneral: 'ECHO',
        status: 'pending',
        dependsOn: ['craft'],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Community Update
// ---------------------------------------------------------------------------

export function communityUpdate(params: {
  community: string;
  updates: string[];
  tone?: 'exciting' | 'informative' | 'casual' | 'urgent';
  channels?: string[];
}): Mission {
  return {
    id: `echo-community-${Date.now()}`,
    title: `Community Update: ${params.community}`,
    description: `Draft community announcement for: ${params.community}. ${params.updates.length} updates to communicate.`,
    priority: params.tone === 'urgent' ? 'high' : 'medium',
    createdBy: 'THRONE',
    steps: [
      {
        id: 'structure',
        title: 'Structure Updates',
        description: `Organize these updates for ${params.community}: ${params.updates.join(' | ')}. Prioritize by community impact. Determine what leads, what supports, what's a footnote. Tone: ${params.tone || 'exciting'}.`,
        assignedGeneral: 'ECHO',
        status: 'pending',
      },
      {
        id: 'draft',
        title: 'Draft Announcement',
        description: `Write the announcement. ${params.channels ? `Adapt for channels: ${params.channels.join(', ')}.` : 'Write a master version that can be adapted.'} Make the community feel included, excited, and informed. They are not just users — they are allies of the Dominion.`,
        assignedGeneral: 'ECHO',
        status: 'pending',
        dependsOn: ['structure'],
      },
      {
        id: 'finalize',
        title: 'Finalize & Variants',
        description: 'Create final versions. If multiple channels, create adapted variants for each. Add suggested emoji reactions, engagement prompts, and follow-up talking points. The Voice of Many speaks to each as if to one.',
        assignedGeneral: 'ECHO',
        status: 'pending',
        dependsOn: ['draft'],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Social Analysis
// ---------------------------------------------------------------------------

export function socialAnalysis(params: {
  platform: string;
  account: string;
  timeframe?: string;
  metrics?: string[];
}): Mission {
  return {
    id: `echo-social-${Date.now()}`,
    title: `Social Analysis: @${params.account}`,
    description: `Analyze ${params.platform} performance for: @${params.account}. ${params.timeframe ? `Period: ${params.timeframe}.` : ''}`,
    priority: 'medium',
    createdBy: 'THRONE',
    steps: [
      {
        id: 'audit',
        title: 'Content Audit',
        description: `Audit @${params.account} on ${params.platform}. ${params.timeframe ? `Focus on: ${params.timeframe}.` : 'Review recent activity.'} Catalog content types, posting frequency, engagement patterns, and voice consistency.`,
        assignedGeneral: 'ECHO',
        status: 'pending',
      },
      {
        id: 'analyze',
        title: 'Performance Analysis',
        description: `Analyze performance metrics: ${params.metrics?.join(', ') || 'engagement rate, reach, follower growth, top-performing content, audience sentiment'}. Identify what resonates and what falls flat. Find the signal in the noise.`,
        assignedGeneral: 'ECHO',
        status: 'pending',
        dependsOn: ['audit'],
      },
      {
        id: 'recommend',
        title: 'Recommendations',
        description: 'Deliver actionable recommendations. What to do more of, what to stop, what to experiment with. Include content calendar suggestions and voice refinements. The audience has spoken — ECHO translates.',
        assignedGeneral: 'ECHO',
        status: 'pending',
        dependsOn: ['analyze'],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Copywriting
// ---------------------------------------------------------------------------

export function copywriting(params: {
  purpose: string;
  tone: 'formal' | 'conversational' | 'bold' | 'minimal' | 'luxurious';
  specs: {
    type: 'landing-page' | 'email' | 'ad-copy' | 'tagline' | 'product-description' | 'general';
    wordCount?: number;
    keyMessages?: string[];
    constraints?: string[];
  };
}): Mission {
  return {
    id: `echo-copy-${Date.now()}`,
    title: `Copy: ${params.specs.type} — ${params.purpose}`,
    description: `Write ${params.tone} ${params.specs.type} copy for: ${params.purpose}. ${params.specs.wordCount ? `Target: ~${params.specs.wordCount} words.` : ''}`,
    priority: 'medium',
    createdBy: 'THRONE',
    steps: [
      {
        id: 'brief',
        title: 'Creative Brief',
        description: `Define creative brief. Purpose: ${params.purpose}. Type: ${params.specs.type}. Tone: ${params.tone}. ${params.specs.keyMessages ? `Key messages: ${params.specs.keyMessages.join(', ')}.` : ''} ${params.specs.constraints ? `Constraints: ${params.specs.constraints.join(', ')}.` : ''} Identify the core emotion and desired action.`,
        assignedGeneral: 'ECHO',
        status: 'pending',
      },
      {
        id: 'write',
        title: 'Write Copy',
        description: `Write 3 variants of the copy. Each should nail the brief but take a different creative angle. ${params.specs.wordCount ? `Target ~${params.specs.wordCount} words each.` : ''} Words are spells — cast them with precision.`,
        assignedGeneral: 'ECHO',
        status: 'pending',
        dependsOn: ['brief'],
      },
      {
        id: 'refine',
        title: 'Refine & Recommend',
        description: 'Refine the strongest variant. A/B test suggestions for headlines. Final delivery with rationale for creative choices. Include notes on what to test and iterate.',
        assignedGeneral: 'ECHO',
        status: 'pending',
        dependsOn: ['write'],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Communication Strategy
// ---------------------------------------------------------------------------

export function communicationStrategy(params: {
  goal: string;
  audience: string;
  channels?: string[];
  timeline?: string;
  budget?: string;
}): Mission {
  return {
    id: `echo-strategy-${Date.now()}`,
    title: `Comms Strategy: ${params.goal}`,
    description: `Develop communication strategy for: ${params.goal}. Audience: ${params.audience}.`,
    priority: 'high',
    createdBy: 'THRONE',
    steps: [
      {
        id: 'audience',
        title: 'Audience Analysis',
        description: `Deep analysis of target audience: ${params.audience}. Understand their language, pain points, aspirations, media habits, and trust signals. Where do they gather? What do they care about? Who do they listen to?`,
        assignedGeneral: 'ECHO',
        status: 'pending',
      },
      {
        id: 'strategy',
        title: 'Strategy Development',
        description: `Develop communication strategy for: ${params.goal}. ${params.channels ? `Channels: ${params.channels.join(', ')}.` : 'Recommend optimal channel mix.'} ${params.timeline ? `Timeline: ${params.timeline}.` : ''} ${params.budget ? `Budget context: ${params.budget}.` : ''} Define messaging pillars, content themes, and engagement tactics.`,
        assignedGeneral: 'ECHO',
        status: 'pending',
        dependsOn: ['audience'],
      },
      {
        id: 'playbook',
        title: 'Execution Playbook',
        description: 'Create execution playbook with: content calendar, key messages per channel, KPIs to track, escalation triggers, and sample content for each phase. The strategy is nothing without flawless execution. ECHO delivers both.',
        assignedGeneral: 'ECHO',
        status: 'pending',
        dependsOn: ['strategy'],
      },
    ],
  };
}
