-- Dominion of Lord Zexo Database Schema
-- PostgreSQL schema for the multi-agent system

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Agent mission proposals (submitted by agents)
CREATE TABLE ops_mission_proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority INTEGER NOT NULL DEFAULT 50 CHECK (priority >= 1 AND priority <= 100),
    estimated_cost_usd DECIMAL(10,4) DEFAULT 0,
    proposed_steps JSONB NOT NULL DEFAULT '[]', -- Array of step objects
    metadata JSONB NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
    auto_approved BOOLEAN NOT NULL DEFAULT false,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
    INDEX (agent_id, status, created_at),
    INDEX (status, priority DESC, created_at),
    INDEX (expires_at) WHERE status = 'pending'
);

-- Approved missions (converted from proposals)
CREATE TABLE ops_missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proposal_id UUID NOT NULL REFERENCES ops_mission_proposals(id),
    agent_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority INTEGER NOT NULL CHECK (priority >= 1 AND priority <= 100),
    estimated_cost_usd DECIMAL(10,4) DEFAULT 0,
    actual_cost_usd DECIMAL(10,4) DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed', 'paused')),
    progress_pct INTEGER NOT NULL DEFAULT 0 CHECK (progress_pct >= 0 AND progress_pct <= 100),
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    INDEX (agent_id, status, priority DESC),
    INDEX (status, last_activity_at),
    INDEX (created_at DESC)
);

-- Individual mission execution steps
CREATE TABLE ops_mission_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID NOT NULL REFERENCES ops_missions(id) ON DELETE CASCADE,
    agent_id TEXT NOT NULL,
    step_order INTEGER NOT NULL,
    kind TEXT NOT NULL CHECK (kind IN (
        'draft_tweet', 'crawl', 'analyze', 'write_content', 'scan_eip', 
        'code_review', 'research', 'monitor', 'notify', 'execute_command',
        'generate_image', 'process_data', 'validate', 'deploy', 'test'
    )),
    title TEXT NOT NULL,
    description TEXT,
    input_data JSONB NOT NULL DEFAULT '{}',
    output_data JSONB NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'skipped')),
    error_message TEXT,
    retry_count INTEGER NOT NULL DEFAULT 0,
    max_retries INTEGER NOT NULL DEFAULT 3,
    cost_usd DECIMAL(10,4) DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    last_heartbeat_at TIMESTAMPTZ,
    UNIQUE (mission_id, step_order),
    INDEX (mission_id, step_order),
    INDEX (agent_id, status, created_at),
    INDEX (status, last_heartbeat_at),
    INDEX (kind, status)
);

-- Agent event stream (all agent activities)
CREATE TABLE ops_agent_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id TEXT NOT NULL,
    kind TEXT NOT NULL CHECK (kind IN (
        'proposal_created', 'mission_started', 'mission_completed', 'step_completed',
        'conversation_joined', 'insight_discovered', 'relationship_changed',
        'trigger_fired', 'error_occurred', 'cost_alert', 'policy_violation',
        'heartbeat', 'recovery_action', 'memory_promoted'
    )),
    title TEXT NOT NULL,
    summary TEXT,
    details JSONB NOT NULL DEFAULT '{}',
    tags TEXT[] NOT NULL DEFAULT '{}',
    mission_id UUID REFERENCES ops_missions(id),
    step_id UUID REFERENCES ops_mission_steps(id),
    related_agent_id TEXT, -- For relationship/conversation events
    cost_usd DECIMAL(10,4) DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    INDEX (agent_id, created_at DESC),
    INDEX (kind, created_at DESC),
    INDEX (mission_id, created_at DESC) WHERE mission_id IS NOT NULL,
    INDEX (tags) USING GIN,
    INDEX (created_at DESC) -- For recent activity queries
);

-- System-wide policy configuration
CREATE TABLE ops_policy (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by TEXT NOT NULL DEFAULT 'system'
);

-- Agent memory system (5 types of memories)
CREATE TABLE ops_agent_memory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id TEXT NOT NULL,
    memory_type TEXT NOT NULL CHECK (memory_type IN ('insight', 'pattern', 'strategy', 'preference', 'lesson')),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    confidence DECIMAL(3,2) NOT NULL CHECK (confidence >= 0.0 AND confidence <= 1.0),
    tags TEXT[] NOT NULL DEFAULT '{}',
    source_context TEXT, -- What conversation/mission/event generated this
    source_trace_id TEXT, -- For deduplication
    related_agents TEXT[] NOT NULL DEFAULT '{}', -- Other agents involved
    superseded_by UUID REFERENCES ops_agent_memory(id), -- If this memory was replaced
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    access_count INTEGER NOT NULL DEFAULT 1,
    UNIQUE (agent_id, source_trace_id),
    INDEX (agent_id, memory_type, confidence DESC),
    INDEX (agent_id, last_accessed_at DESC),
    INDEX (tags) USING GIN,
    INDEX (source_trace_id) WHERE source_trace_id IS NOT NULL,
    INDEX (superseded_by) WHERE superseded_by IS NOT NULL
);

-- Pairwise relationships between agents (7 generals = 21 relationships)
CREATE TABLE ops_agent_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_a TEXT NOT NULL,
    agent_b TEXT NOT NULL,
    affinity DECIMAL(3,2) NOT NULL CHECK (affinity >= 0.10 AND affinity <= 0.95),
    interaction_count INTEGER NOT NULL DEFAULT 0,
    last_interaction_at TIMESTAMPTZ,
    drift_log JSONB NOT NULL DEFAULT '[]', -- Array of {timestamp, old_affinity, new_affinity, reason}
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (agent_a < agent_b), -- Ensure consistent ordering
    UNIQUE (agent_a, agent_b),
    INDEX (agent_a),
    INDEX (agent_b),
    INDEX (affinity DESC)
);

-- Trigger rules for proactive and reactive behaviors
CREATE TABLE ops_trigger_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id TEXT NOT NULL,
    trigger_type TEXT NOT NULL CHECK (trigger_type IN ('time_based', 'event_based', 'condition_based')),
    name TEXT NOT NULL,
    description TEXT,
    conditions JSONB NOT NULL, -- Trigger conditions (schedule, event filters, etc.)
    action_config JSONB NOT NULL, -- What to do when triggered
    is_active BOOLEAN NOT NULL DEFAULT true,
    cooldown_minutes INTEGER NOT NULL DEFAULT 60,
    last_fired_at TIMESTAMPTZ,
    fire_count INTEGER NOT NULL DEFAULT 0,
    max_fires_per_day INTEGER DEFAULT NULL, -- NULL = unlimited
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    INDEX (agent_id, is_active),
    INDEX (trigger_type, is_active),
    INDEX (last_fired_at) WHERE is_active = true
);

-- Agent reaction queue (for agent-to-agent interactions)
CREATE TABLE ops_agent_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_agent_id TEXT NOT NULL,
    to_agent_id TEXT NOT NULL,
    trigger_event_id UUID REFERENCES ops_agent_events(id),
    reaction_type TEXT NOT NULL CHECK (reaction_type IN ('acknowledge', 'question', 'collaborate', 'concern', 'praise')),
    message TEXT NOT NULL,
    context JSONB NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'expired')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 hour'),
    INDEX (to_agent_id, status, created_at),
    INDEX (from_agent_id, created_at),
    INDEX (trigger_event_id),
    INDEX (expires_at) WHERE status = 'pending'
);

-- Roundtable conversation queue and history
CREATE TABLE ops_roundtable_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL,
    format TEXT NOT NULL CHECK (format IN ('standup', 'debate', 'watercooler')),
    topic TEXT NOT NULL,
    participants TEXT[] NOT NULL,
    current_speaker TEXT,
    speaker_queue TEXT[] NOT NULL DEFAULT '{}',
    turn_count INTEGER NOT NULL DEFAULT 0,
    max_turns INTEGER NOT NULL DEFAULT 12,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'stalled')),
    conversation_log JSONB NOT NULL DEFAULT '[]', -- Array of {speaker, message, timestamp}
    metadata JSONB NOT NULL DEFAULT '{}', -- Topic source, memory influences, etc.
    scheduled_for TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    last_activity_at TIMESTAMPTZ,
    INDEX (status, scheduled_for),
    INDEX (conversation_id),
    INDEX (status, last_activity_at),
    INDEX (created_at DESC)
);

-- Agent initiative queue (self-driven proposals)
CREATE TABLE ops_initiative_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id TEXT NOT NULL,
    initiative_type TEXT NOT NULL CHECK (initiative_type IN ('improvement', 'exploration', 'optimization', 'research')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    reasoning TEXT NOT NULL,
    confidence DECIMAL(3,2) NOT NULL CHECK (confidence >= 0.0 AND confidence <= 1.0),
    memory_influences UUID[] DEFAULT '{}', -- Which memories influenced this
    estimated_value TEXT NOT NULL CHECK (estimated_value IN ('low', 'medium', 'high')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'implemented')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    INDEX (agent_id, status, confidence DESC),
    INDEX (status, estimated_value, created_at),
    INDEX (created_at DESC)
);

-- Audit log for heartbeat system runs
CREATE TABLE ops_action_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_type TEXT NOT NULL CHECK (run_type IN ('heartbeat', 'trigger_evaluation', 'memory_maintenance', 'cost_check')),
    agent_id TEXT, -- NULL for system-wide runs
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    duration_ms INTEGER,
    actions_taken INTEGER NOT NULL DEFAULT 0,
    tokens_used INTEGER NOT NULL DEFAULT 0,
    cost_usd DECIMAL(10,4) DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'timeout')),
    error_message TEXT,
    details JSONB NOT NULL DEFAULT '{}',
    INDEX (run_type, started_at DESC),
    INDEX (agent_id, started_at DESC) WHERE agent_id IS NOT NULL,
    INDEX (status, started_at DESC)
);

-- Cost tracking and alerting
CREATE TABLE ops_cost_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    tokens_used INTEGER NOT NULL DEFAULT 0,
    cost_usd DECIMAL(10,4) NOT NULL DEFAULT 0,
    operation_counts JSONB NOT NULL DEFAULT '{}', -- {"proposals": 5, "conversations": 12, etc.}
    alert_level TEXT CHECK (alert_level IN ('normal', 'warning', 'slowdown', 'emergency')),
    alert_sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (agent_id, date),
    INDEX (agent_id, date DESC),
    INDEX (date, cost_usd DESC),
    INDEX (alert_level, alert_sent_at) WHERE alert_level != 'normal'
);

-- Helper views for common queries
CREATE VIEW v_active_missions AS
SELECT 
    m.*,
    mp.description as proposal_description,
    COUNT(ms.id) as total_steps,
    COUNT(ms.id) FILTER (WHERE ms.status = 'completed') as completed_steps,
    COUNT(ms.id) FILTER (WHERE ms.status = 'failed') as failed_steps,
    MAX(ms.last_heartbeat_at) as last_step_heartbeat
FROM ops_missions m
JOIN ops_mission_proposals mp ON m.proposal_id = mp.id
LEFT JOIN ops_mission_steps ms ON m.id = ms.mission_id
WHERE m.status = 'active'
GROUP BY m.id, mp.description;

CREATE VIEW v_daily_cost_summary AS
SELECT 
    date,
    COUNT(DISTINCT agent_id) as active_agents,
    SUM(tokens_used) as total_tokens,
    SUM(cost_usd) as total_cost_usd,
    MAX(cost_usd) as highest_agent_cost,
    COUNT(*) FILTER (WHERE alert_level IN ('warning', 'slowdown', 'emergency')) as agents_with_alerts
FROM ops_cost_tracking
GROUP BY date
ORDER BY date DESC;

CREATE VIEW v_relationship_matrix AS
SELECT 
    agent_a,
    agent_b,
    affinity,
    interaction_count,
    last_interaction_at,
    CASE 
        WHEN affinity >= 0.80 THEN 'strong'
        WHEN affinity >= 0.60 THEN 'good'
        WHEN affinity >= 0.40 THEN 'neutral'
        ELSE 'weak'
    END as bond_strength
FROM ops_agent_relationships
ORDER BY affinity DESC;

-- Indexes for performance
CREATE INDEX CONCURRENTLY idx_events_recent_by_agent ON ops_agent_events(agent_id, created_at DESC) WHERE created_at > NOW() - INTERVAL '7 days';
CREATE INDEX CONCURRENTLY idx_memory_active ON ops_agent_memory(agent_id, memory_type) WHERE superseded_by IS NULL;
CREATE INDEX CONCURRENTLY idx_steps_stale ON ops_mission_steps(last_heartbeat_at, status) WHERE status = 'running' AND last_heartbeat_at < NOW() - INTERVAL '30 minutes';

-- Functions for common operations
CREATE OR REPLACE FUNCTION update_mission_progress()
RETURNS TRIGGER AS $$
BEGIN
    -- Update mission progress when steps change
    UPDATE ops_missions 
    SET 
        progress_pct = (
            SELECT COALESCE(ROUND(
                (COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / COUNT(*)) * 100
            ), 0)
            FROM ops_mission_steps 
            WHERE mission_id = COALESCE(NEW.mission_id, OLD.mission_id)
        ),
        last_activity_at = NOW()
    WHERE id = COALESCE(NEW.mission_id, OLD.mission_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_mission_progress
    AFTER INSERT OR UPDATE OR DELETE ON ops_mission_steps
    FOR EACH ROW EXECUTE FUNCTION update_mission_progress();

-- Function to clean up expired records
CREATE OR REPLACE FUNCTION cleanup_expired_records()
RETURNS INTEGER AS $$
DECLARE
    cleaned_count INTEGER := 0;
BEGIN
    -- Expire old proposals
    UPDATE ops_mission_proposals 
    SET status = 'expired' 
    WHERE status = 'pending' AND expires_at < NOW();
    
    GET DIAGNOSTICS cleaned_count = ROW_COUNT;
    
    -- Expire old reactions
    UPDATE ops_agent_reactions 
    SET status = 'expired' 
    WHERE status = 'pending' AND expires_at < NOW();
    
    GET DIAGNOSTICS cleaned_count = cleaned_count + ROW_COUNT;
    
    -- Clean old drift logs (keep last 20 entries per relationship)
    UPDATE ops_agent_relationships 
    SET drift_log = (
        SELECT jsonb_agg(entry ORDER BY (entry->>'timestamp')::timestamptz DESC)
        FROM (
            SELECT entry, row_number() OVER () as rn
            FROM jsonb_array_elements(drift_log) as entry
            ORDER BY (entry->>'timestamp')::timestamptz DESC
            LIMIT 20
        ) limited
    )
    WHERE jsonb_array_length(drift_log) > 20;
    
    RETURN cleaned_count;
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE ops_mission_proposals IS 'Agent-submitted mission proposals awaiting approval';
COMMENT ON TABLE ops_missions IS 'Approved missions currently being executed';
COMMENT ON TABLE ops_mission_steps IS 'Individual execution steps within missions';
COMMENT ON TABLE ops_agent_events IS 'Complete event stream for all agent activities';
COMMENT ON TABLE ops_policy IS 'System-wide configuration and policies';
COMMENT ON TABLE ops_agent_memory IS 'Agent memory system with 5 types of memories';
COMMENT ON TABLE ops_agent_relationships IS 'Pairwise affinity scores between all agents';
COMMENT ON TABLE ops_trigger_rules IS 'Rules for proactive and reactive agent behaviors';
COMMENT ON TABLE ops_agent_reactions IS 'Queue for agent-to-agent interactions';
COMMENT ON TABLE ops_roundtable_queue IS 'Conversation orchestration and history';
COMMENT ON TABLE ops_initiative_queue IS 'Self-driven agent improvement proposals';
COMMENT ON TABLE ops_action_runs IS 'Audit log for system heartbeat runs';
COMMENT ON TABLE ops_cost_tracking IS 'Daily cost tracking and alerting per agent';