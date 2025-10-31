import { IAgentRewardStatus, IAgentTransactionStatus } from "src/modules/agent/interfaces/agent.interface"

export const totalReferUser =  `(SELECT COUNT(*) FROM users AS u WHERE u.agent_id = "AgentsModel"."id")`


export const totalRewardEarned = `(
  SELECT COALESCE(SUM(r.reward_amount), 0)
  FROM "agent-rewards" r
  JOIN users u ON u.id = r.user_id
  WHERE u.agent_id = "AgentsModel".id
  AND r.status IN ('${IAgentRewardStatus.COMPLETED}', '${IAgentRewardStatus.IN_PROGRESS}')
)`;



export const totalPayout = `(
    SELECT COALESCE(SUM(t.amount), 0)
    FROM agent_transactions t
    WHERE t.agent_id = "AgentsModel".id
    AND t.status = '${IAgentTransactionStatus.APPROVED}'
  )`;


  export const availableBalance = `(
    (
      SELECT COALESCE(SUM(r.reward_amount), 0)
      FROM "agent-rewards" r
      JOIN users u ON u.id = r.user_id
      WHERE u.agent_id = "AgentsModel".id
      AND r.status IN ('${IAgentRewardStatus.COMPLETED}', '${IAgentRewardStatus.IN_PROGRESS}')
    ) -
    (
      SELECT COALESCE(SUM(t.amount), 0)
      FROM agent_transactions t
      WHERE t.agent_id = "AgentsModel".id
      AND t.status = '${IAgentTransactionStatus.APPROVED}'
    )
  )`;
  