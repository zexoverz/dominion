-- Dominion of Lord Zexo - Seed Data
-- Initial data for the 7 generals and their relationships

-- Core system policies
INSERT INTO ops_policy (key, value, description, updated_by) VALUES
('auto_approve', '{
  "enabled": true,
  "low_risk_threshold": 2.0,
  "auto_approve_kinds": ["crawl", "analyze", "research", "monitor"],
  "require_approval_kinds": ["deploy", "code_review", "notify"],
  "max_auto_approve_cost": 5.00
}', 'Auto-approval settings for low-risk mission proposals', 'system'),

('daily_quotas', '{
  "THRONE": {"max_proposals": 8, "max_cost": 25.0, "max_conversations": 6},
  "GRIMOIRE": {"max_proposals": 12, "max_cost": 20.0, "max_conversations": 8},
  "ECHO": {"max_proposals": 10, "max_cost": 15.0, "max_conversations": 12},
  "PHANTOM": {"max_proposals": 6, "max_cost": 30.0, "max_conversations": 4},
  "SEER": {"max_proposals": 15, "max_cost": 18.0, "max_conversations": 5},
  "WRAITH-EYE": {"max_proposals": 8, "max_cost": 12.0, "max_conversations": 3},
  "MAMMON": {"max_proposals": 5, "max_cost": 10.0, "max_conversations": 4}
}', 'Daily operation limits per general', 'system'),

('roundtable_policy', '{
  "schedule_wib": {
    "monday": [{"time": "09:00", "format": "standup", "participants": "all"}],
    "tuesday": [{"time": "14:30", "format": "debate", "participants": ["THRONE", "GRIMOIRE", "ECHO"]}],
    "wednesday": [{"time": "10:15", "format": "watercooler", "participants": ["SEER", "PHANTOM", "WRAITH-EYE", "MAMMON"]}],
    "thursday": [{"time": "16:45", "format": "debate", "participants": ["THRONE", "SEER", "MAMMON"]}],
    "friday": [{"time": "11:30", "format": "standup", "participants": "all"}],
    "saturday": [{"time": "15:00", "format": "watercooler", "participants": ["ECHO", "GRIMOIRE", "PHANTOM"]}],
    "sunday": [{"time": "19:20", "format": "watercooler", "participants": "all"}]
  },
  "max_turns": 12,
  "turn_timeout_seconds": 300,
  "memory_influence_probability": 0.30
}', 'Roundtable conversation scheduling and rules', 'system'),

('memory_influence', '{
  "max_memories_per_agent": 200,
  "confidence_threshold": 0.55,
  "max_memories_per_conversation": 6,
  "memory_decay_rate": 0.02,
  "promotion_threshold": 0.85
}', 'Memory system configuration', 'system'),

('relationship_drift', '{
  "max_drift_per_interaction": 0.03,
  "drift_factors": {
    "positive_collaboration": 0.02,
    "successful_mission": 0.015,
    "disagreement": -0.01,
    "failed_collaboration": -0.02,
    "personality_clash": -0.005
  },
  "affinity_floor": 0.10,
  "affinity_ceiling": 0.95
}', 'Relationship evolution parameters', 'system'),

('initiative_policy', '{
  "max_pending_per_agent": 3,
  "approval_threshold": 0.75,
  "auto_implement_threshold": 0.90,
  "cooldown_hours": 4
}', 'Agent initiative system settings', 'system'),

('cost_thresholds', '{
  "warning_usd": 5.0,
  "slowdown_usd": 10.0,
  "emergency_usd": 15.0,
  "slowdown_effects": {
    "conversation_frequency_multiplier": 0.5,
    "skip_low_priority_triggers": true,
    "require_approval_for_all": true
  }
}', 'Cost tracking and alert thresholds', 'system');

-- Initial relationships between the 7 generals (21 pairwise bonds)
INSERT INTO ops_agent_relationships (agent_a, agent_b, affinity, interaction_count, created_at) VALUES
('ECHO', 'GRIMOIRE', 0.90, 0, NOW()),
('GRIMOIRE', 'THRONE', 0.85, 0, NOW()),
('THRONE', 'WRAITH-EYE', 0.85, 0, NOW()),
('PHANTOM', 'SEER', 0.85, 0, NOW()),
('SEER', 'THRONE', 0.80, 0, NOW()),
('MAMMON', 'THRONE', 0.80, 0, NOW()),
('MAMMON', 'WRAITH-EYE', 0.80, 0, NOW()),
('ECHO', 'THRONE', 0.75, 0, NOW()),
('GRIMOIRE', 'WRAITH-EYE', 0.75, 0, NOW()),
('PHANTOM', 'WRAITH-EYE', 0.75, 0, NOW()),
('ECHO', 'SEER', 0.70, 0, NOW()),
('PHANTOM', 'THRONE', 0.70, 0, NOW()),
('MAMMON', 'SEER', 0.70, 0, NOW()),
('SEER', 'WRAITH-EYE', 0.70, 0, NOW()),
('GRIMOIRE', 'SEER', 0.65, 0, NOW()),
('ECHO', 'PHANTOM', 0.65, 0, NOW()),
('MAMMON', 'PHANTOM', 0.60, 0, NOW()),
('ECHO', 'WRAITH-EYE', 0.60, 0, NOW()),
('ECHO', 'MAMMON', 0.55, 0, NOW()),
('GRIMOIRE', 'PHANTOM', 0.50, 0, NOW()),
('GRIMOIRE', 'MAMMON', 0.45, 0, NOW());

-- Trigger rules for Phase 1 generals (THRONE, SEER, PHANTOM)

-- THRONE triggers (Leadership & Strategy)
INSERT INTO ops_trigger_rules (agent_id, trigger_type, name, description, conditions, action_config, cooldown_minutes, max_fires_per_day) VALUES
('THRONE', 'time_based', 'daily_standup', 'Daily leadership standup review', '{
  "schedule": "0 9 * * 1-5",
  "timezone": "Asia/Jakarta"
}', '{
  "action": "initiate_roundtable",
  "format": "standup",
  "topic": "Daily objectives and resource allocation",
  "max_participants": 7
}', 1440, 1),

('THRONE', 'time_based', 'weekly_strategy', 'Weekly strategic review and planning', '{
  "schedule": "0 15 * * 1",
  "timezone": "Asia/Jakarta"
}', '{
  "action": "create_proposal",
  "title": "Weekly Strategic Assessment",
  "steps": [
    {"kind": "analyze", "description": "Review past week performance metrics"},
    {"kind": "research", "description": "Identify emerging opportunities"},
    {"kind": "write_content", "description": "Draft strategic recommendations"}
  ]
}', 10080, 1),

('THRONE', 'event_based', 'mission_failure_review', 'Review and respond to mission failures', '{
  "event_type": "mission_completed",
  "filters": {"status": "failed", "priority": {"gte": 70}}
}', '{
  "action": "create_proposal",
  "title": "Post-Mortem Analysis",
  "steps": [
    {"kind": "analyze", "description": "Analyze failure patterns and causes"},
    {"kind": "write_content", "description": "Generate improvement recommendations"}
  ]
}', 120, 5);

-- SEER triggers (Knowledge & Opportunity Detection)
INSERT INTO ops_trigger_rules (agent_id, trigger_type, name, description, conditions, action_config, cooldown_minutes, max_fires_per_day) VALUES
('SEER', 'time_based', 'eip_scan', 'Scan for new Ethereum Improvement Proposals', '{
  "schedule": "0 */6 * * *",
  "timezone": "Asia/Jakarta"
}', '{
  "action": "create_proposal",
  "title": "EIP Intelligence Scan",
  "steps": [
    {"kind": "scan_eip", "description": "Scan recent EIP proposals and updates"},
    {"kind": "analyze", "description": "Assess impact and opportunities"},
    {"kind": "write_content", "description": "Generate intelligence brief"}
  ]
}', 360, 4),

('SEER', 'time_based', 'magicians_forum', 'Monitor Ethereum Magicians discussions', '{
  "schedule": "30 */4 * * *",
  "timezone": "Asia/Jakarta"
}', '{
  "action": "create_proposal", 
  "title": "Community Intelligence Gathering",
  "steps": [
    {"kind": "crawl", "description": "Monitor key Ethereum Magicians threads"},
    {"kind": "analyze", "description": "Extract insights and sentiment"},
    {"kind": "write_content", "description": "Compile intelligence report"}
  ]
}', 240, 6),

('SEER', 'time_based', 'oss_opportunities', 'Scan for open source collaboration opportunities', '{
  "schedule": "0 12 * * *",
  "timezone": "Asia/Jakarta"
}', '{
  "action": "create_proposal",
  "title": "Open Source Opportunity Scan",
  "steps": [
    {"kind": "research", "description": "Identify trending OSS projects in our domains"},
    {"kind": "analyze", "description": "Evaluate collaboration potential"},
    {"kind": "write_content", "description": "Generate opportunity summary"}
  ]
}', 1440, 1);

-- PHANTOM triggers (Security & Stealth Operations)
INSERT INTO ops_trigger_rules (agent_id, trigger_type, name, description, conditions, action_config, cooldown_minutes, max_fires_per_day) VALUES
('PHANTOM', 'time_based', 'active_project_check', 'Monitor active projects for security issues', '{
  "schedule": "0 */8 * * *",
  "timezone": "Asia/Jakarta"
}', '{
  "action": "create_proposal",
  "title": "Active Project Security Scan",
  "steps": [
    {"kind": "monitor", "description": "Check project health and security status"},
    {"kind": "analyze", "description": "Identify potential vulnerabilities or issues"},
    {"kind": "write_content", "description": "Generate security brief"}
  ]
}', 480, 3),

('PHANTOM', 'event_based', 'security_review', 'Automatic security review for code-related missions', '{
  "event_type": "step_completed",
  "filters": {"kind": "code_review", "status": "completed"}
}', '{
  "action": "create_proposal",
  "title": "Secondary Security Review",
  "steps": [
    {"kind": "analyze", "description": "Deep security analysis of reviewed code"},
    {"kind": "validate", "description": "Verify security compliance"},
    {"kind": "write_content", "description": "Generate security assessment"}
  ]
}', 60, 10),

('PHANTOM', 'condition_based', 'threat_response', 'Respond to potential security threats', '{
  "conditions": {
    "cost_spike": {"threshold_multiplier": 3.0, "time_window_minutes": 30},
    "error_pattern": {"error_count": {"gte": 5}, "time_window_minutes": 15}
  }
}', '{
  "action": "initiate_roundtable",
  "format": "emergency",
  "topic": "Security threat assessment and response",
  "priority": "high"
}', 30, 5);

-- Reaction matrix patterns (how agents typically react to each other)
INSERT INTO ops_agent_reactions (from_agent_id, to_agent_id, reaction_type, message, context, status) VALUES
-- Pre-populate some reaction templates for common interactions
('THRONE', 'SEER', 'acknowledge', 'Noted. Please prioritize actionable intelligence.', '{"template": "leadership_directive"}', 'processed'),
('SEER', 'THRONE', 'acknowledge', 'Intelligence compiled. Awaiting strategic direction.', '{"template": "intel_ready"}', 'processed'),
('PHANTOM', 'GRIMOIRE', 'concern', 'Security implications require review before implementation.', '{"template": "security_caution"}', 'processed'),
('GRIMOIRE', 'PHANTOM', 'acknowledge', 'Implementation halted pending security clearance.', '{"template": "security_compliance"}', 'processed'),
('ECHO', 'MAMMON', 'question', 'Cost-benefit analysis needed for this initiative.', '{"template": "cost_inquiry"}', 'processed'),
('MAMMON', 'ECHO', 'acknowledge', 'Financial assessment complete. Proceed with caution.', '{"template": "financial_cleared"}', 'processed');

-- Initial memory seeds (some foundational knowledge for each general)
INSERT INTO ops_agent_memory (agent_id, memory_type, title, content, confidence, tags, source_context) VALUES
-- THRONE memories
('THRONE', 'strategy', 'Multi-agent coordination principles', 'Effective multi-agent systems require clear delegation, regular communication, and adaptive resource allocation. Individual agent strengths must be leveraged while maintaining strategic coherence.', 0.90, ARRAY['leadership', 'coordination', 'strategy'], 'foundational_knowledge'),
('THRONE', 'preference', 'Communication style preference', 'Direct, decisive communication works best with this team. Provide clear objectives, context, and constraints. Allow individual agents tactical freedom within strategic boundaries.', 0.85, ARRAY['communication', 'leadership'], 'foundational_knowledge'),

-- SEER memories  
('SEER', 'insight', 'Ethereum ecosystem patterns', 'EIP proposals often signal broader ecosystem shifts 6-12 months in advance. Layer 2 solutions and developer tooling improvements have highest implementation velocity.', 0.88, ARRAY['ethereum', 'eips', 'prediction'], 'foundational_knowledge'),
('SEER', 'pattern', 'Community sentiment indicators', 'Ethereum Magicians forum discussions correlate with subsequent EIP adoption rates. Technical debates that reach consensus quickly often indicate strong developer support.', 0.82, ARRAY['community', 'sentiment', 'prediction'], 'foundational_knowledge'),

-- PHANTOM memories
('PHANTOM', 'lesson', 'Security review priorities', 'Focus security reviews on: 1) Input validation 2) Access controls 3) State management 4) External dependencies. Most vulnerabilities fall into these categories.', 0.92, ARRAY['security', 'code_review', 'priorities'], 'foundational_knowledge'),
('PHANTOM', 'strategy', 'Stealth operation principles', 'Minimize digital footprint by: using rotating proxies, avoiding pattern recognition, distributing activities across time zones, maintaining plausible cover activities.', 0.87, ARRAY['stealth', 'security', 'operations'], 'foundational_knowledge'),

-- GRIMOIRE memories
('GRIMOIRE', 'insight', 'Knowledge synthesis approach', 'Most valuable insights emerge from cross-domain pattern recognition. Combine technical analysis with market dynamics and community sentiment for comprehensive understanding.', 0.89, ARRAY['synthesis', 'analysis', 'insights'], 'foundational_knowledge'),

-- ECHO memories  
('ECHO', 'preference', 'Communication optimization', 'Multi-modal communication increases engagement rates. Combine text, visuals, and interactive elements. Tailor message complexity to audience technical background.', 0.86, ARRAY['communication', 'engagement', 'optimization'], 'foundational_knowledge'),

-- WRAITH-EYE memories
('WRAITH-EYE', 'pattern', 'Data collection patterns', 'High-value intelligence often exists in metadata and behavioral patterns rather than direct content. Focus on timing, frequency, and relationship data.', 0.84, ARRAY['intelligence', 'data', 'patterns'], 'foundational_knowledge'),

-- MAMMON memories
('MAMMON', 'strategy', 'Resource optimization principles', 'Maximum ROI achieved through: 1) Accurate cost prediction 2) Resource pooling 3) Timing optimization 4) Risk-adjusted allocation. Track everything, optimize continuously.', 0.91, ARRAY['finance', 'optimization', 'roi'], 'foundational_knowledge');

-- Sample conversation history (to initialize the system)
INSERT INTO ops_roundtable_queue (conversation_id, format, topic, participants, status, conversation_log, completed_at) VALUES
(uuid_generate_v4(), 'standup', 'Dominion Initialization', 
 ARRAY['THRONE', 'SEER', 'PHANTOM'], 'completed',
 '[
   {"speaker": "THRONE", "message": "Dominion systems online. Phase 1 operational parameters confirmed.", "timestamp": "2026-02-13T10:00:00Z", "turn": 1},
   {"speaker": "SEER", "message": "Intelligence networks established. Monitoring Ethereum ecosystem and OSS opportunities.", "timestamp": "2026-02-13T10:00:30Z", "turn": 2},
   {"speaker": "PHANTOM", "message": "Security protocols active. Stealth operations ready. Perimeter secured.", "timestamp": "2026-02-13T10:01:00Z", "turn": 3},
   {"speaker": "THRONE", "message": "Excellent. Begin standard operational tempo. Phase 2 planning commences next week.", "timestamp": "2026-02-13T10:01:30Z", "turn": 4}
 ]'::jsonb, 
 NOW() - INTERVAL '2 hours'),

(uuid_generate_v4(), 'watercooler', 'General Introduction',
 ARRAY['ECHO', 'GRIMOIRE', 'WRAITH-EYE', 'MAMMON'], 'completed',
 '[
   {"speaker": "ECHO", "message": "Welcome to the Dominion, everyone. Looking forward to our collaborations.", "timestamp": "2026-02-13T14:00:00Z", "turn": 1},
   {"speaker": "GRIMOIRE", "message": "The knowledge synthesis engines are humming. Ready to distill insights from chaos.", "timestamp": "2026-02-13T14:00:30Z", "turn": 2},
   {"speaker": "WRAITH-EYE", "message": "Data streams established. Watching. Learning. Silent but present.", "timestamp": "2026-02-13T14:01:00Z", "turn": 3},
   {"speaker": "MAMMON", "message": "Treasury systems operational. Current burn rate: optimal. Resources allocated efficiently.", "timestamp": "2026-02-13T14:01:30Z", "turn": 4},
   {"speaker": "ECHO", "message": "Perfect. Let the symphony of intelligence begin.", "timestamp": "2026-02-13T14:02:00Z", "turn": 5}
 ]'::jsonb,
 NOW() - INTERVAL '1 hour');

-- Initialize cost tracking for all agents (today)
INSERT INTO ops_cost_tracking (agent_id, date, tokens_used, cost_usd, operation_counts, alert_level) VALUES
('THRONE', CURRENT_DATE, 1250, 0.75, '{"conversations": 2, "proposals": 1}', 'normal'),
('SEER', CURRENT_DATE, 890, 0.53, '{"conversations": 1, "scans": 2}', 'normal'), 
('PHANTOM', CURRENT_DATE, 1100, 0.66, '{"conversations": 1, "security_checks": 3}', 'normal'),
('GRIMOIRE', CURRENT_DATE, 950, 0.57, '{"conversations": 1, "analysis": 2}', 'normal'),
('ECHO', CURRENT_DATE, 1200, 0.72, '{"conversations": 2, "communications": 4}', 'normal'),
('WRAITH-EYE', CURRENT_DATE, 650, 0.39, '{"monitoring": 5}', 'normal'),
('MAMMON', CURRENT_DATE, 720, 0.43, '{"conversations": 1, "cost_analysis": 2}', 'normal');

-- Sample agent events to populate the timeline
INSERT INTO ops_agent_events (agent_id, kind, title, summary, details, tags, cost_usd) VALUES
('THRONE', 'heartbeat', 'Dominion Initialization Complete', 'All primary systems online, Phase 1 operational parameters confirmed', '{"initialization_time": "2026-02-13T09:30:00Z", "systems_checked": 7}', ARRAY['initialization', 'system'], 0.05),
('SEER', 'trigger_fired', 'First EIP Scan Initiated', 'Beginning systematic monitoring of Ethereum Improvement Proposals', '{"scan_range": "EIP-7000+", "monitoring_frequency": "6h"}', ARRAY['eip', 'scan', 'monitoring'], 0.15),
('PHANTOM', 'trigger_fired', 'Security Perimeter Established', 'Baseline security monitoring and threat detection systems active', '{"security_level": "standard", "monitoring_scope": "full"}', ARRAY['security', 'monitoring'], 0.12),
('ECHO', 'conversation_joined', 'Welcome Roundtable Participation', 'Participated in introductory watercooler conversation', '{"conversation_id": "intro", "turn_count": 2}', ARRAY['conversation', 'introduction'], 0.08),
('MAMMON', 'cost_alert', 'Initial Budget Allocation', 'Daily cost limits established for all generals', '{"total_budget": "25.00", "individual_limits_set": 7}', ARRAY['budget', 'allocation'], 0.03);

-- Sample successful mission for demonstration
DO $$
DECLARE 
    sample_proposal_id UUID := uuid_generate_v4();
    sample_mission_id UUID := uuid_generate_v4();
BEGIN
    -- Create a sample proposal
    INSERT INTO ops_mission_proposals (id, agent_id, title, description, priority, proposed_steps, status, auto_approved, created_at, reviewed_at)
    VALUES (sample_proposal_id, 'SEER', 'Initial EIP Landscape Analysis', 
            'Comprehensive analysis of current EIP ecosystem to establish baseline intelligence',
            75,
            '[
              {"kind": "scan_eip", "title": "EIP Repository Scan", "description": "Scan all active EIPs"},
              {"kind": "analyze", "title": "Pattern Analysis", "description": "Identify trends and patterns"},
              {"kind": "write_content", "title": "Intelligence Brief", "description": "Compile analysis into actionable intelligence"}
            ]'::jsonb,
            'approved', true, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '2 hours 45 minutes');
    
    -- Create approved mission
    INSERT INTO ops_missions (id, proposal_id, agent_id, title, description, priority, status, progress_pct, started_at, last_activity_at)
    VALUES (sample_mission_id, sample_proposal_id, 'SEER', 'Initial EIP Landscape Analysis',
            'Comprehensive analysis of current EIP ecosystem to establish baseline intelligence',
            75, 'active', 67, NOW() - INTERVAL '2 hours 30 minutes', NOW() - INTERVAL '10 minutes');
    
    -- Create mission steps
    INSERT INTO ops_mission_steps (mission_id, agent_id, step_order, kind, title, description, status, completed_at, cost_usd)
    VALUES 
    (sample_mission_id, 'SEER', 1, 'scan_eip', 'EIP Repository Scan', 'Scan all active EIPs', 'completed', NOW() - INTERVAL '2 hours', 0.45),
    (sample_mission_id, 'SEER', 2, 'analyze', 'Pattern Analysis', 'Identify trends and patterns', 'completed', NOW() - INTERVAL '1 hour 30 minutes', 0.32),
    (sample_mission_id, 'SEER', 3, 'write_content', 'Intelligence Brief', 'Compile analysis into actionable intelligence', 'running', NULL, 0.00);
    
END $$;

-- Create indexes to improve query performance on seed data
CREATE INDEX IF NOT EXISTS idx_seed_relationships_lookup ON ops_agent_relationships(agent_a, agent_b, affinity);
CREATE INDEX IF NOT EXISTS idx_seed_triggers_agent_active ON ops_trigger_rules(agent_id, is_active, trigger_type);
CREATE INDEX IF NOT EXISTS idx_seed_memory_agent_type ON ops_agent_memory(agent_id, memory_type, confidence DESC);

-- Update statistics for better query planning
ANALYZE ops_agent_relationships;
ANALYZE ops_trigger_rules;
ANALYZE ops_agent_memory;
ANALYZE ops_policy;
ANALYZE ops_cost_tracking;
ANALYZE ops_agent_events;

-- Final status check
DO $$
BEGIN
    RAISE NOTICE 'Dominion of Lord Zexo seed data loaded successfully:';
    RAISE NOTICE '- 7 system policies configured';
    RAISE NOTICE '- 21 agent relationships established'; 
    RAISE NOTICE '- 9 trigger rules for Phase 1 generals (THRONE: 3, SEER: 3, PHANTOM: 3)';
    RAISE NOTICE '- 8 foundational memories across all generals';
    RAISE NOTICE '- 2 sample conversations in history';
    RAISE NOTICE '- Current daily cost tracking initialized';
    RAISE NOTICE '- Sample mission workflow demonstrated';
    RAISE NOTICE 'Phase 1 infrastructure ready for deployment.';
END $$;