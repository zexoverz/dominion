/**
 * Memory Service - Agent memory system with 5 types of memories
 * Handles conversation distillation, confidence scoring, and memory influence
 */

import { Pool } from 'pg';
import { v4 as uuid } from 'uuid';

export interface MemoryEntry {
  id: string;
  agentId: string;
  memoryType: MemoryType;
  title: string;
  content: string;
  confidence: number; // 0.0 - 1.0
  tags: string[];
  sourceContext?: string;
  sourceTraceId?: string;
  relatedAgents: string[];
  supersededBy?: string;
  createdAt: Date;
  lastAccessedAt: Date;
  accessCount: number;
}

export type MemoryType = 'insight' | 'pattern' | 'strategy' | 'preference' | 'lesson';

export interface ConversationMemoryExtraction {
  memories: MemoryEntry[];
  participantInsights: Record<string, string[]>;
  relationshipObservations: Array<{
    agentA: string;
    agentB: string;
    observation: string;
    affinityDelta: number;
  }>;
}

export interface MemoryInfluence {
  memoryId: string;
  memoryType: MemoryType;
  title: string;
  relevanceScore: number; // 0.0 - 1.0
  influence: string; // How this memory influences the current context
}

const MEMORY_LIMITS = {
  maxMemoriesPerAgent: 200,
  confidenceThreshold: 0.55,
  maxMemoriesPerConversation: 6,
  promotionThreshold: 0.85
};

// Memory cache to improve performance
const memoryCache = new Map<string, MemoryEntry[]>();
const CACHE_DURATION_MS = 30000; // 30 seconds
const cacheTimestamps = new Map<string, number>();

export class MemoryService {
  constructor(private db: Pool) {}

  /**
   * Distill memories from a completed conversation
   */
  async distillConversationMemories(
    conversationId: string,
    conversationLog: Array<{ speaker: string; message: string; timestamp: string; turn: number }>,
    participants: string[],
    topic: string
  ): Promise<ConversationMemoryExtraction> {
    console.log(`🧠 Distilling memories from conversation: ${topic}`);
    
    const memories: MemoryEntry[] = [];
    const participantInsights: Record<string, string[]> = {};
    const relationshipObservations: Array<{
      agentA: string;
      agentB: string;
      observation: string;
      affinityDelta: number;
    }> = [];
    
    // Initialize participant insights
    participants.forEach(p => participantInsights[p] = []);
    
    // Extract insights from conversation flow
    const insights = await this.extractConversationInsights(conversationLog, participants, topic);
    
    // Create memories for each participant
    for (const participant of participants) {
      const participantMemories = await this.createMemoriesForParticipant(
        participant,
        insights,
        conversationLog,
        topic,
        conversationId
      );
      
      memories.push(...participantMemories);
      
      // Extract participant-specific insights
      participantInsights[participant] = participantMemories.map(m => m.title);
    }
    
    // Extract relationship observations
    for (let i = 0; i < participants.length; i++) {
      for (let j = i + 1; j < participants.length; j++) {
        const agentA = participants[i];
        const agentB = participants[j];
        
        const relationship = await this.analyzeParticipantInteraction(
          agentA,
          agentB,
          conversationLog,
          topic
        );
        
        if (relationship) {
          relationshipObservations.push(relationship);
        }
      }
    }
    
    // Store memories in database (only those above confidence threshold)
    const validMemories = memories.filter(m => m.confidence >= MEMORY_LIMITS.confidenceThreshold);
    
    // Limit to max memories per conversation
    const limitedMemories = validMemories
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, MEMORY_LIMITS.maxMemoriesPerConversation);
    
    await this.storeMemories(limitedMemories);
    
    // Invalidate cache for affected agents
    limitedMemories.forEach(m => {
      memoryCache.delete(m.agentId);
      cacheTimestamps.delete(m.agentId);
    });
    
    console.log(`💾 Stored ${limitedMemories.length} memories from conversation (${memories.length} extracted, ${validMemories.length} above threshold)`);
    
    return {
      memories: limitedMemories,
      participantInsights,
      relationshipObservations
    };
  }

  /**
   * Get memory influences for a given context (e.g., roundtable topic selection)
   */
  async getMemoryInfluences(
    agentId: string,
    context: string,
    contextType: 'conversation' | 'proposal' | 'decision',
    maxInfluences: number = 3
  ): Promise<MemoryInfluence[]> {
    const memories = await this.getAgentMemories(agentId);
    const influences: MemoryInfluence[] = [];
    
    for (const memory of memories) {
      const relevanceScore = this.calculateRelevanceScore(memory, context, contextType);
      
      if (relevanceScore > 0.3) { // Minimum relevance threshold
        influences.push({
          memoryId: memory.id,
          memoryType: memory.memoryType,
          title: memory.title,
          relevanceScore,
          influence: this.generateInfluenceText(memory, context, relevanceScore)
        });
      }
    }
    
    // Sort by relevance and limit results
    return influences
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxInfluences);
  }

  /**
   * Get all memories for an agent (with caching)
   */
  async getAgentMemories(agentId: string, memoryType?: MemoryType): Promise<MemoryEntry[]> {
    const cacheKey = `${agentId}_${memoryType || 'all'}`;
    const now = Date.now();
    
    // Check cache
    if (memoryCache.has(cacheKey) && 
        cacheTimestamps.has(cacheKey) && 
        now - cacheTimestamps.get(cacheKey)! < CACHE_DURATION_MS) {
      return memoryCache.get(cacheKey)!;
    }
    
    const client = await this.db.connect();
    
    try {
      const query = memoryType
        ? 'SELECT * FROM ops_agent_memory WHERE agent_id = $1 AND memory_type = $2 AND superseded_by IS NULL ORDER BY confidence DESC, last_accessed_at DESC'
        : 'SELECT * FROM ops_agent_memory WHERE agent_id = $1 AND superseded_by IS NULL ORDER BY confidence DESC, last_accessed_at DESC';
      
      const params = memoryType ? [agentId, memoryType] : [agentId];
      const result = await client.query(query, params);
      
      const memories: MemoryEntry[] = result.rows.map(row => ({
        id: row.id,
        agentId: row.agent_id,
        memoryType: row.memory_type,
        title: row.title,
        content: row.content,
        confidence: parseFloat(row.confidence),
        tags: row.tags,
        sourceContext: row.source_context,
        sourceTraceId: row.source_trace_id,
        relatedAgents: row.related_agents,
        supersededBy: row.superseded_by,
        createdAt: new Date(row.created_at),
        lastAccessedAt: new Date(row.last_accessed_at),
        accessCount: row.access_count
      }));
      
      // Update cache
      memoryCache.set(cacheKey, memories);
      cacheTimestamps.set(cacheKey, now);
      
      return memories;
      
    } finally {
      client.release();
    }
  }

  /**
   * Create a new memory entry
   */
  async createMemory(
    agentId: string,
    memoryType: MemoryType,
    title: string,
    content: string,
    confidence: number,
    tags: string[] = [],
    sourceContext?: string,
    sourceTraceId?: string,
    relatedAgents: string[] = []
  ): Promise<MemoryEntry> {
    // Check if we're at the memory limit for this agent
    await this.enforceMemoryLimits(agentId);
    
    const memory: MemoryEntry = {
      id: uuid(),
      agentId,
      memoryType,
      title,
      content,
      confidence: Math.max(0, Math.min(1, confidence)),
      tags,
      sourceContext,
      sourceTraceId,
      relatedAgents,
      createdAt: new Date(),
      lastAccessedAt: new Date(),
      accessCount: 1
    };
    
    await this.storeMemories([memory]);
    
    // Invalidate cache
    memoryCache.delete(agentId);
    cacheTimestamps.delete(agentId);
    
    console.log(`🧠 Created ${memoryType} memory for ${agentId}: ${title} (confidence: ${confidence.toFixed(2)})`);
    
    return memory;
  }

  /**
   * Update memory access tracking
   */
  async accessMemory(memoryId: string): Promise<void> {
    const client = await this.db.connect();
    
    try {
      await client.query(
        'UPDATE ops_agent_memory SET last_accessed_at = NOW(), access_count = access_count + 1 WHERE id = $1',
        [memoryId]
      );
    } finally {
      client.release();
    }
  }

  /**
   * Supersede a memory with a new one (for memory evolution)
   */
  async supersedememory(oldMemoryId: string, newMemory: Omit<MemoryEntry, 'id' | 'createdAt' | 'lastAccessedAt' | 'accessCount'>): Promise<MemoryEntry> {
    const client = await this.db.connect();
    
    try {
      await client.query('BEGIN');
      
      // Create new memory
      const newMemoryWithId: MemoryEntry = {
        ...newMemory,
        id: uuid(),
        createdAt: new Date(),
        lastAccessedAt: new Date(),
        accessCount: 1
      };
      
      await this.storeMemories([newMemoryWithId]);
      
      // Mark old memory as superseded
      await client.query(
        'UPDATE ops_agent_memory SET superseded_by = $1 WHERE id = $2',
        [newMemoryWithId.id, oldMemoryId]
      );
      
      await client.query('COMMIT');
      
      // Invalidate cache
      memoryCache.delete(newMemory.agentId);
      cacheTimestamps.delete(newMemory.agentId);
      
      console.log(`🔄 Superseded memory ${oldMemoryId} with new memory ${newMemoryWithId.id}`);
      
      return newMemoryWithId;
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get memory statistics for an agent
   */
  async getMemoryStats(agentId: string): Promise<{
    totalMemories: number;
    byType: Record<MemoryType, number>;
    averageConfidence: number;
    highConfidenceCount: number;
    recentMemories: number;
    mostAccessedMemory: MemoryEntry | null;
  }> {
    const memories = await this.getAgentMemories(agentId);
    
    const byType: Record<MemoryType, number> = {
      insight: 0,
      pattern: 0,
      strategy: 0,
      preference: 0,
      lesson: 0
    };
    
    let totalConfidence = 0;
    let highConfidenceCount = 0;
    let recentMemories = 0;
    let mostAccessedMemory: MemoryEntry | null = null;
    let maxAccess = 0;
    
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    for (const memory of memories) {
      byType[memory.memoryType]++;
      totalConfidence += memory.confidence;
      
      if (memory.confidence >= MEMORY_LIMITS.promotionThreshold) {
        highConfidenceCount++;
      }
      
      if (memory.createdAt > weekAgo) {
        recentMemories++;
      }
      
      if (memory.accessCount > maxAccess) {
        maxAccess = memory.accessCount;
        mostAccessedMemory = memory;
      }
    }
    
    return {
      totalMemories: memories.length,
      byType,
      averageConfidence: memories.length > 0 ? totalConfidence / memories.length : 0,
      highConfidenceCount,
      recentMemories,
      mostAccessedMemory
    };
  }

  // Private methods

  private async extractConversationInsights(
    conversationLog: Array<{ speaker: string; message: string; timestamp: string; turn: number }>,
    participants: string[],
    topic: string
  ): Promise<{
    keyPoints: string[];
    emergentThemes: string[];
    decisionsMade: string[];
    conflictPoints: string[];
    collaborationMoments: string[];
  }> {
    // Simplified insight extraction (in real implementation, would use NLP/LLM)
    const insights = {
      keyPoints: [],
      emergentThemes: [topic],
      decisionsMade: [],
      conflictPoints: [],
      collaborationMoments: []
    };
    
    // Analyze conversation patterns
    const messagesByParticipant = new Map<string, string[]>();
    participants.forEach(p => messagesByParticipant.set(p, []));
    
    conversationLog.forEach(entry => {
      if (messagesByParticipant.has(entry.speaker)) {
        messagesByParticipant.get(entry.speaker)!.push(entry.message);
      }
    });
    
    // Look for decision indicators
    conversationLog.forEach(entry => {
      const message = entry.message.toLowerCase();
      if (message.includes('decided') || message.includes('agreed') || message.includes('will proceed')) {
        insights.decisionsMade.push(`${entry.speaker}: ${entry.message}`);
      }
      
      if (message.includes('disagree') || message.includes('concern') || message.includes('but')) {
        insights.conflictPoints.push(`${entry.speaker}: ${entry.message}`);
      }
      
      if (message.includes('collaborate') || message.includes('together') || message.includes('assist')) {
        insights.collaborationMoments.push(`${entry.speaker}: ${entry.message}`);
      }
    });
    
    // Extract key points (simplified - in reality would use more sophisticated NLP)
    const frequentWords = this.extractFrequentConcepts(conversationLog.map(c => c.message).join(' '));
    insights.keyPoints = frequentWords.slice(0, 5);
    
    return insights;
  }

  private async createMemoriesForParticipant(
    agentId: string,
    insights: {
      keyPoints: string[];
      emergentThemes: string[];
      decisionsMade: string[];
      conflictPoints: string[];
      collaborationMoments: string[];
    },
    conversationLog: Array<{ speaker: string; message: string; timestamp: string; turn: number }>,
    topic: string,
    conversationId: string
  ): Promise<MemoryEntry[]> {
    const memories: MemoryEntry[] = [];
    const sourceTraceId = `conversation_${conversationId}_${agentId}`;
    
    // Get agent's messages
    const agentMessages = conversationLog.filter(c => c.speaker === agentId);
    const otherParticipants = [...new Set(conversationLog.map(c => c.speaker))].filter(s => s !== agentId);
    
    // Create insight memory if agent had significant participation
    if (agentMessages.length >= 2 && insights.keyPoints.length > 0) {
      memories.push({
        id: uuid(),
        agentId,
        memoryType: 'insight',
        title: `Insights from ${topic} discussion`,
        content: `Key insights from conversation: ${insights.keyPoints.join(', ')}. My contribution focused on: ${agentMessages.map(m => m.message).join(' // ')}.`,
        confidence: 0.6 + (Math.min(agentMessages.length, 5) * 0.05),
        tags: [topic.toLowerCase().replace(/\s+/g, '_'), 'conversation', 'collaboration'],
        sourceContext: `roundtable_${conversationId}`,
        sourceTraceId,
        relatedAgents: otherParticipants,
        createdAt: new Date(),
        lastAccessedAt: new Date(),
        accessCount: 1
      });
    }
    
    // Create pattern memory if recurring themes detected
    if (insights.emergentThemes.length > 1) {
      memories.push({
        id: uuid(),
        agentId,
        memoryType: 'pattern',
        title: `Conversation patterns: ${topic}`,
        content: `Recurring themes in discussions: ${insights.emergentThemes.join(', ')}. These themes tend to emerge when discussing ${topic.toLowerCase()}.`,
        confidence: 0.55 + (insights.emergentThemes.length * 0.05),
        tags: ['patterns', 'discussion_themes', topic.toLowerCase().replace(/\s+/g, '_')],
        sourceContext: `roundtable_${conversationId}`,
        sourceTraceId,
        relatedAgents: otherParticipants,
        createdAt: new Date(),
        lastAccessedAt: new Date(),
        accessCount: 1
      });
    }
    
    // Create lesson memory from conflicts or challenges
    if (insights.conflictPoints.length > 0) {
      memories.push({
        id: uuid(),
        agentId,
        memoryType: 'lesson',
        title: `Lessons from ${topic} discussion challenges`,
        content: `Challenges encountered: ${insights.conflictPoints.slice(0, 2).join(' // ')}. Important to consider different perspectives and find common ground in future discussions.`,
        confidence: 0.65,
        tags: ['lessons', 'conflict_resolution', topic.toLowerCase().replace(/\s+/g, '_')],
        sourceContext: `roundtable_${conversationId}`,
        sourceTraceId,
        relatedAgents: otherParticipants,
        createdAt: new Date(),
        lastAccessedAt: new Date(),
        accessCount: 1
      });
    }
    
    // Create preference memory based on conversation style
    if (agentMessages.length > 0) {
      const avgMessageLength = agentMessages.reduce((sum, m) => sum + m.message.length, 0) / agentMessages.length;
      const isVerbose = avgMessageLength > 80;
      const isConcise = avgMessageLength < 40;
      
      if (isVerbose || isConcise) {
        memories.push({
          id: uuid(),
          agentId,
          memoryType: 'preference',
          title: `Communication style in ${topic} discussions`,
          content: `I tend to be ${isVerbose ? 'detailed and explanatory' : 'concise and direct'} when discussing ${topic}. Average message length: ${Math.round(avgMessageLength)} characters.`,
          confidence: 0.70,
          tags: ['communication_style', topic.toLowerCase().replace(/\s+/g, '_')],
          sourceContext: `roundtable_${conversationId}`,
          sourceTraceId,
          relatedAgents: [],
          createdAt: new Date(),
          lastAccessedAt: new Date(),
          accessCount: 1
        });
      }
    }
    
    return memories;
  }

  private async analyzeParticipantInteraction(
    agentA: string,
    agentB: string,
    conversationLog: Array<{ speaker: string; message: string; timestamp: string; turn: number }>,
    topic: string
  ): Promise<{
    agentA: string;
    agentB: string;
    observation: string;
    affinityDelta: number;
  } | null> {
    const agentAMessages = conversationLog.filter(c => c.speaker === agentA);
    const agentBMessages = conversationLog.filter(c => c.speaker === agentB);
    
    if (agentAMessages.length === 0 || agentBMessages.length === 0) {
      return null;
    }
    
    // Simple interaction analysis
    let positiveInteractions = 0;
    let negativeInteractions = 0;
    
    // Look for response patterns
    for (let i = 0; i < conversationLog.length - 1; i++) {
      const current = conversationLog[i];
      const next = conversationLog[i + 1];
      
      if ((current.speaker === agentA && next.speaker === agentB) ||
          (current.speaker === agentB && next.speaker === agentA)) {
        
        const nextMessage = next.message.toLowerCase();
        if (nextMessage.includes('agree') || nextMessage.includes('good') || nextMessage.includes('yes')) {
          positiveInteractions++;
        } else if (nextMessage.includes('disagree') || nextMessage.includes('concern') || nextMessage.includes('but')) {
          negativeInteractions++;
        }
      }
    }
    
    const totalInteractions = positiveInteractions + negativeInteractions;
    if (totalInteractions === 0) return null;
    
    const positiveRatio = positiveInteractions / totalInteractions;
    const affinityDelta = (positiveRatio - 0.5) * 0.02; // Max ±0.01 delta
    
    let observation = '';
    if (positiveRatio > 0.7) {
      observation = `Strong agreement and collaboration in ${topic} discussion`;
    } else if (positiveRatio < 0.3) {
      observation = `Some disagreement and tension in ${topic} discussion`;
    } else {
      observation = `Mixed interaction with both agreement and disagreement in ${topic}`;
    }
    
    return {
      agentA: agentA < agentB ? agentA : agentB,
      agentB: agentA < agentB ? agentB : agentA,
      observation,
      affinityDelta: Math.max(-0.03, Math.min(0.03, affinityDelta))
    };
  }

  private calculateRelevanceScore(
    memory: MemoryEntry,
    context: string,
    contextType: 'conversation' | 'proposal' | 'decision'
  ): number {
    let score = 0;
    
    // Base score from memory confidence
    score += memory.confidence * 0.4;
    
    // Relevance from tags
    const contextWords = context.toLowerCase().split(/\s+/);
    const matchingTags = memory.tags.filter(tag => 
      contextWords.some(word => tag.includes(word) || word.includes(tag))
    );
    score += (matchingTags.length / memory.tags.length) * 0.3;
    
    // Content relevance (simplified keyword matching)
    const contentWords = memory.content.toLowerCase().split(/\s+/);
    const contentMatches = contextWords.filter(word => 
      contentWords.some(cWord => cWord.includes(word) && word.length > 3)
    );
    score += (contentMatches.length / contextWords.length) * 0.2;
    
    // Memory type relevance for context type
    const typeRelevance = {
      conversation: { strategy: 0.8, preference: 0.9, insight: 0.7, pattern: 0.6, lesson: 0.5 },
      proposal: { strategy: 0.9, insight: 0.8, lesson: 0.7, pattern: 0.6, preference: 0.4 },
      decision: { lesson: 0.9, strategy: 0.8, insight: 0.7, pattern: 0.5, preference: 0.6 }
    };
    score += typeRelevance[contextType][memory.memoryType] * 0.1;
    
    return Math.min(1.0, score);
  }

  private generateInfluenceText(memory: MemoryEntry, context: string, relevanceScore: number): string {
    const intensity = relevanceScore > 0.7 ? 'strongly' : relevanceScore > 0.5 ? 'moderately' : 'somewhat';
    
    const templates = {
      insight: `This insight ${intensity} suggests that ${memory.title.toLowerCase()} should be considered when ${context.toLowerCase()}.`,
      pattern: `Based on observed patterns, ${memory.title.toLowerCase()} ${intensity} indicates that ${context.toLowerCase()} may follow similar trends.`,
      strategy: `My strategic understanding of ${memory.title.toLowerCase()} ${intensity} influences how I approach ${context.toLowerCase()}.`,
      preference: `My preference for ${memory.title.toLowerCase()} ${intensity} shapes my perspective on ${context.toLowerCase()}.`,
      lesson: `Lessons learned from ${memory.title.toLowerCase()} ${intensity} inform my approach to ${context.toLowerCase()}.`
    };
    
    return templates[memory.memoryType] || `Memory of ${memory.title} is relevant to ${context}.`;
  }

  private extractFrequentConcepts(text: string): string[] {
    // Simple frequency analysis (in practice, would use NLP)
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    const frequency = new Map<string, number>();
    words.forEach(word => {
      frequency.set(word, (frequency.get(word) || 0) + 1);
    });
    
    return Array.from(frequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  }

  private async storeMemories(memories: MemoryEntry[]): Promise<void> {
    if (memories.length === 0) return;
    
    const client = await this.db.connect();
    
    try {
      for (const memory of memories) {
        await client.query(`
          INSERT INTO ops_agent_memory (
            id, agent_id, memory_type, title, content, confidence, tags,
            source_context, source_trace_id, related_agents, created_at, last_accessed_at, access_count
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          ON CONFLICT (agent_id, source_trace_id) DO NOTHING
        `, [
          memory.id,
          memory.agentId,
          memory.memoryType,
          memory.title,
          memory.content,
          memory.confidence,
          memory.tags,
          memory.sourceContext,
          memory.sourceTraceId,
          memory.relatedAgents,
          memory.createdAt,
          memory.lastAccessedAt,
          memory.accessCount
        ]);
      }
    } finally {
      client.release();
    }
  }

  private async enforceMemoryLimits(agentId: string): Promise<void> {
    const client = await this.db.connect();
    
    try {
      // Count current memories
      const countResult = await client.query(
        'SELECT COUNT(*) as count FROM ops_agent_memory WHERE agent_id = $1 AND superseded_by IS NULL',
        [agentId]
      );
      
      const currentCount = parseInt(countResult.rows[0].count);
      
      if (currentCount >= MEMORY_LIMITS.maxMemoriesPerAgent) {
        // Remove oldest, lowest-confidence memories
        const excessCount = currentCount - MEMORY_LIMITS.maxMemoriesPerAgent + 1;
        
        await client.query(`
          UPDATE ops_agent_memory 
          SET superseded_by = $1
          WHERE id IN (
            SELECT id FROM ops_agent_memory 
            WHERE agent_id = $2 AND superseded_by IS NULL
            ORDER BY confidence ASC, last_accessed_at ASC 
            LIMIT $3
          )
        `, [uuid(), agentId, excessCount]);
        
        console.log(`🗑️ Removed ${excessCount} old memories for ${agentId} to enforce limits`);
      }
    } finally {
      client.release();
    }
  }

  /**
   * Clear memory cache (useful for testing or manual cache invalidation)
   */
  clearCache(agentId?: string): void {
    if (agentId) {
      const keysToDelete = Array.from(memoryCache.keys()).filter(key => key.startsWith(`${agentId}_`));
      keysToDelete.forEach(key => {
        memoryCache.delete(key);
        cacheTimestamps.delete(key);
      });
    } else {
      memoryCache.clear();
      cacheTimestamps.clear();
    }
  }
}

export default MemoryService;