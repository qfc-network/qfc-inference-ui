import { ethers } from 'ethers'
import { CONTRACTS, RPC_URL } from './constants'

// ABI fragments — only the functions the UI needs
export const TASK_REGISTRY_ABI = [
  'function submitTask(uint256 modelId, bytes calldata input) payable returns (uint256)',
  'function cancelTask(uint256 taskId)',
  'function getTask(uint256 taskId) view returns (tuple(uint256 id, address submitter, uint256 modelId, bytes input, uint256 maxFee, uint8 status, address miner, bytes result, uint256 createdAt, uint256 claimedAt, uint256 completedAt))',
  'function nextTaskId() view returns (uint256)',
  'event TaskSubmitted(uint256 indexed taskId, address indexed submitter, uint256 indexed modelId, uint256 maxFee)',
]

export const MINER_REGISTRY_ABI = [
  'function getMiner(address miner) view returns (tuple(address minerAddress, string gpuModel, uint8 tier, uint256 stake, uint8 status, uint256 tasksCompleted, uint256 tasksFailed, uint256 registeredAt, uint256 lastActiveAt, string endpoint))',
  'function registerMiner(uint8 tier, string calldata gpuModel, string calldata endpoint) payable',
  'function minerCount() view returns (uint256)',
]

export const MODEL_REGISTRY_ABI = [
  'function getModel(uint256 modelId) view returns (tuple(uint256 modelId, string name, uint256 baseFee, uint8 minTier, bool approved, uint256 registeredAt))',
  'function modelCount() view returns (uint256)',
  'function getBaseFee(uint256 modelId) view returns (uint256)',
]

export const FEE_ESCROW_ABI = [
  'function getEscrow(uint256 taskId) view returns (uint256)',
]

export function getReadProvider() {
  return new ethers.JsonRpcProvider(RPC_URL)
}

export function getTaskRegistry(signerOrProvider: ethers.Signer | ethers.Provider) {
  return new ethers.Contract(CONTRACTS.taskRegistry, TASK_REGISTRY_ABI, signerOrProvider)
}

export function getMinerRegistry(signerOrProvider: ethers.Signer | ethers.Provider) {
  return new ethers.Contract(CONTRACTS.minerRegistry, MINER_REGISTRY_ABI, signerOrProvider)
}

export function getModelRegistry(signerOrProvider: ethers.Signer | ethers.Provider) {
  return new ethers.Contract(CONTRACTS.modelRegistry, MODEL_REGISTRY_ABI, signerOrProvider)
}
