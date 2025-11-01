
export const adminDashboardQuery = () =>  `
SELECT
  -- total users
  (SELECT COUNT(*) FROM users) AS total_users,

  -- total agents (assuming you have an agents table)
  (SELECT COUNT(*) FROM agents) AS total_agents,

  -- total transaction = total amount paid by users
  (
    SELECT COALESCE(SUM(amount), 0)
    FROM payments
    WHERE status = :successStatus
  ) AS total_transactions,

  -- available balance = total successful payments - total paid to agents
  (
    COALESCE((SELECT SUM(amount) FROM payments WHERE status = :successStatus), 0)
    -
    COALESCE((SELECT SUM(amount) FROM agent_transactions WHERE status = :approvedStatus), 0)
  ) AS available_balance,

  -- total completed petitions
  (
    SELECT COUNT(*)
    FROM petitions
    WHERE status = 'completed'
  ) AS total_completed_petitions
`

export const adminPetitionQuery = () => `
  SELECT
      COUNT(*) AS total_petitions,
      COUNT(*) FILTER (WHERE status = 'pending') AS total_pending,
      COUNT(*) FILTER (WHERE status = 'in_progress') AS total_in_progress,
      COUNT(*) FILTER (WHERE status = 'completed') AS total_completed
  FROM petitions

`

export const adminUserQuery = () =>  `
SELECT
  (SELECT COUNT(*) FROM users) AS total_users,
  (SELECT COUNT(*) FROM petitions WHERE status = 'completed') AS total_completed_petitions,
  (SELECT COUNT(*) FROM petitions WHERE status = 'in_progress') AS total_in_progress_petitions,
  (SELECT COUNT(*) FROM petitions WHERE status = 'pending') AS total_pending_petitions
`

export const adminAgentQuery = () => `

SELECT
(SELECT COUNT(*) FROM agents) AS total_agents,
(SELECT COUNT(*) FROM users WHERE agent_id IS NOT NULL) AS total_referred_users,
(SELECT COALESCE(SUM(reward_amount), 0) FROM "agent-rewards" WHERE status = 'IN_PROGRESS') AS total_rewards_earned,
(SELECT COALESCE(SUM(amount), 0) FROM agent_transactions WHERE status = 'APPROVED') AS total_payout

`


export const adminfinancialQuery = () => `
SELECT
  -- total revenue (sum of successful payments)
  COALESCE((SELECT SUM(amount) FROM payments WHERE status = 'successful'), 0) AS total_revenue,

  -- total payout (sum of approved agent transactions)
  COALESCE((SELECT SUM(amount) FROM agent_transactions WHERE status = 'APPROVED'), 0) AS total_payout,

  -- total transactions = revenue + payout
  (
    COALESCE((SELECT SUM(amount) FROM payments WHERE status = 'successful'), 0)
    +
    COALESCE((SELECT SUM(amount) FROM agent_transactions WHERE status = 'APPROVED'), 0)
  ) AS total_transactions,

  -- available balance = revenue - payout
  (
    COALESCE((SELECT SUM(amount) FROM payments WHERE status = 'successful'), 0)
    -
    COALESCE((SELECT SUM(amount) FROM agent_transactions WHERE status = 'APPROVED'), 0)
  ) AS available_balance
`

export const paymentTransactionHistoryQuery = () => `
SELECT * FROM (
    SELECT 
        p.id,
        p.amount,
        CONCAT(u.first_name, ' ', u.last_name) AS name,
        p.payment_option_name::TEXT AS paymentOptionName,
        'credit' AS type,
        p.created_at AS date
    FROM payments AS p
    JOIN users AS u ON u.id = p.user_id
    WHERE p.status = 'successful'

    UNION ALL

    SELECT 
        a.id,
        a.amount,
        CONCAT(ag.first_name, ' ', ag.last_name) AS name,
        'Agent_Payout'::TEXT AS paymentOptionName,
        'debit' AS type,
        a.created_at AS date
    FROM agent_transactions AS a
    JOIN agents AS ag ON ag.id = a.agent_id
    WHERE a.status = 'APPROVED'
) AS transactions
ORDER BY transactions.date DESC
LIMIT :limit OFFSET :offset;
`;
