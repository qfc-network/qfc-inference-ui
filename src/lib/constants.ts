export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://rpc.testnet.qfc.network'
export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID || '9000')

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const CONTRACTS = {
  taskRegistry: process.env.NEXT_PUBLIC_TASK_REGISTRY_ADDRESS || ZERO_ADDRESS,
  minerRegistry: process.env.NEXT_PUBLIC_MINER_REGISTRY_ADDRESS || ZERO_ADDRESS,
  modelRegistry: process.env.NEXT_PUBLIC_MODEL_REGISTRY_ADDRESS || ZERO_ADDRESS,
  feeEscrow: process.env.NEXT_PUBLIC_FEE_ESCROW_ADDRESS || ZERO_ADDRESS,
}

/** Returns true if contracts are configured (not zero address) */
export function contractsConfigured(): boolean {
  return Object.values(CONTRACTS).some(addr => addr !== ZERO_ADDRESS)
}

export const QFC_CHAIN = {
  chainId: `0x${CHAIN_ID.toString(16)}`,
  chainName: 'QFC Testnet',
  nativeCurrency: { name: 'QFC', symbol: 'QFC', decimals: 18 },
  rpcUrls: [RPC_URL],
  blockExplorerUrls: ['https://explorer.testnet.qfc.network'],
}
