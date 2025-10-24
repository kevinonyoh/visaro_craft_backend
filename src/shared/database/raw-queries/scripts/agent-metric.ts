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


export const totalEarningAndWithdrawQuery = () => `SELECT
  COALESCE((
    SELECT SUM(ar.reward_amount)
    FROM "agent-rewards" AS ar
    INNER JOIN users AS u ON u.id = ar.user_id
    WHERE ar.status = 'COMPLETED' AND u.agent_id = :agentId
  ), 0) AS total_earnings,

  COALESCE((
    SELECT SUM(at.amount)
    FROM agent_transactions AS at
    WHERE at.agent_id = :agentId AND at.status = 'APPROVED'
  ), 0) AS total_withdrawn;
`;


export const dashboardQuery = () => `
  SELECT
    COUNT(u.id) AS total_referrals,
    COUNT(DISTINCT CASE WHEN ar.status = 'COMPLETED' THEN u.id END) AS total_completed_referrals,
    COALESCE((
      SELECT SUM(at.amount)
      FROM agent_transactions AS at
      WHERE at.agent_id = :agentId AND at.status = 'PENDING'
    ), 0) AS total_pending_withdrawals,
    (
      COALESCE((
        SELECT SUM(ar.reward_amount)
        FROM "agent-rewards" AS ar
        INNER JOIN users AS u2 ON u2.id = ar.user_id
        WHERE ar.status = 'COMPLETED' AND u2.agent_id = :agentId
      ), 0)
      -
      COALESCE((
        SELECT SUM(at2.amount)
        FROM agent_transactions AS at2
        WHERE at2.agent_id = :agentId AND at2.status = 'APPROVED'
      ), 0)
    ) AS available_balance
  FROM users AS u
  LEFT JOIN "agent-rewards" AS ar ON ar.user_id = u.id
  WHERE u.agent_id = :agentId;
`;


export const payoutQuery = () =>   `
      SELECT
      COALESCE(SUM("ar"."reward_amount"), 0) AS total_earning,
      COALESCE((
        SELECT SUM("at"."amount")
        FROM "agent_transactions" AS "at"
        WHERE "at"."agent_id" = :agentId AND "at"."status" = 'APPROVED'
      ), 0) AS total_payout_received,
      COALESCE((
        SELECT SUM("at"."amount")
        FROM "agent_transactions" AS "at"
        WHERE "at"."agent_id" = :agentId AND "at"."status" = 'PENDING'
      ), 0) AS pending_payout,
      COALESCE(SUM("ar"."reward_amount"), 0) - COALESCE((
        SELECT SUM("at"."amount")
        FROM "agent_transactions" AS "at"
        WHERE "at"."agent_id" = :agentId AND "at"."status" = 'APPROVED'
      ), 0) AS available_balance
      FROM "agent-rewards" AS "ar"
      JOIN "users" AS "u" ON "u"."id" = "ar"."user_id"
      WHERE "u"."agent_id" = :agentId;


  ` 