export const getReferralCountQuery =  () => `
SELECT 
    COUNT(u.id) AS total_referrals,
    SUM(CASE WHEN ar.status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed_referrals,
    SUM(CASE WHEN ar.status = 'IN_PROGRESS' THEN 1 ELSE 0 END) AS in_progress_referrals,
    SUM(CASE WHEN ar.status = 'PENDING' THEN 1 ELSE 0 END) AS pending_referrals
  FROM users u
  LEFT JOIN "agent-rewards" ar ON ar.user_id = u.id
  WHERE u.agent_id = :agentId
`;

