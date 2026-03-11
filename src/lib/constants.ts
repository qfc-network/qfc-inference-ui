export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://rpc.testnet.qfc.network'
export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID || '9000')

export const CONTRACTS = {
  taskRegistry: process.env.NEXT_PUBLIC_TASK_REGISTRY_ADDRESS || '0x0000000000000000000000000000000000000000',
  minerRegistry: process.env.NEXT_PUBLIC_MINER_REGISTRY_ADDRESS || '0x0000000000000000000000000000000000000000',
  modelRegistry: process.env.NEXT_PUBLIC_MODEL_REGISTRY_ADDRESS || '0x0000000000000000000000000000000000000000',
  feeEscrow: process.env.NEXT_PUBLIC_FEE_ESCROW_ADDRESS || '0x0000000000000000000000000000000000000000',
}

export const QFC_CHAIN = {
  chainId: `0x${CHAIN_ID.toString(16)}`,
  chainName: 'QFC Testnet',
  nativeCurrency: { name: 'QFC', symbol: 'QFC', decimals: 18 },
  rpcUrls: [RPC_URL],
  blockExplorerUrls: ['https://explorer.testnet.qfc.network'],
}
