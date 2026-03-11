export enum TaskStatus {
  Pending = 'Pending',
  Assigned = 'Assigned',
  Completed = 'Completed',
  Failed = 'Failed',
  Cancelled = 'Cancelled',
}

export interface Task {
  id: string
  submitter: string
  modelId: string
  modelName: string
  input: string
  inputHash: string
  maxFee: string
  status: TaskStatus
  miner: string | null
  resultHash: string | null
  proof: string | null
  createdAt: number
  assignedAt: number | null
  completedAt: number | null
}

export enum MinerStatus {
  Inactive = 'Inactive',
  Active = 'Active',
  Suspended = 'Suspended',
}

export interface Miner {
  address: string
  gpuModel: string
  tier: 1 | 2 | 3
  stake: string
  status: MinerStatus
  tasksCompleted: number
  tasksFailed: number
  reputationScore: number
  totalEarned: string
  registeredAt: number
  lastActiveAt: number
  endpoint: string
}

export interface Model {
  modelId: string
  name: string
  description: string
  baseFee: string
  minTier: 1 | 2 | 3
  totalTasksRun: number
  approved: boolean
}
