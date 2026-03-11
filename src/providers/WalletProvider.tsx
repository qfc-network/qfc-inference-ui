'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { ethers } from 'ethers'
import { CHAIN_ID, QFC_CHAIN } from '@/lib/constants'

interface WalletContextType {
  address: string | null
  signer: ethers.Signer | null
  provider: ethers.BrowserProvider | null
  connect: () => Promise<void>
  disconnect: () => void
  isConnecting: boolean
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  signer: null,
  provider: null,
  connect: async () => {},
  disconnect: () => {},
  isConnecting: false,
})

export function useWallet() {
  return useContext(WalletContext)
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  const switchChain = useCallback(async () => {
    if (!window.ethereum) return
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: QFC_CHAIN.chainId }],
      })
    } catch (err: unknown) {
      if ((err as { code?: number })?.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [QFC_CHAIN],
        })
      } else {
        throw err
      }
    }
  }, [])

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask or a compatible wallet')
      return
    }
    setIsConnecting(true)
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      await switchChain()
      const bp = new ethers.BrowserProvider(window.ethereum)
      const s = await bp.getSigner()
      const addr = await s.getAddress()
      setProvider(bp)
      setSigner(s)
      setAddress(addr)
    } catch (err) {
      console.error('Failed to connect wallet:', err)
    } finally {
      setIsConnecting(false)
    }
  }, [switchChain])

  const disconnect = useCallback(() => {
    setAddress(null)
    setSigner(null)
    setProvider(null)
  }, [])

  useEffect(() => {
    if (!window.ethereum) return
    const handleAccountsChanged = async (...args: unknown[]) => {
      const accounts = args[0] as string[]
      if (accounts.length === 0) {
        disconnect()
      } else {
        // Re-create provider and signer for the new account
        const bp = new ethers.BrowserProvider(window.ethereum!)
        const s = await bp.getSigner()
        const addr = await s.getAddress()
        setProvider(bp)
        setSigner(s)
        setAddress(addr)
      }
    }
    const handleChainChanged = () => window.location.reload()

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)
    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum?.removeListener('chainChanged', handleChainChanged)
    }
  }, [disconnect])

  // Auto-reconnect (uses eth_accounts which doesn't trigger popup)
  useEffect(() => {
    if (!window.ethereum) return
    window.ethereum.request({ method: 'eth_accounts' }).then(async (result) => {
      const accounts = result as string[]
      if (accounts.length > 0) {
        try {
          const bp = new ethers.BrowserProvider(window.ethereum!)
          const s = await bp.getSigner()
          const addr = await s.getAddress()
          setProvider(bp)
          setSigner(s)
          setAddress(addr)
        } catch (err) {
          console.error('Auto-reconnect failed:', err)
        }
      }
    }).catch((err: unknown) => {
      console.error('Failed to check existing accounts:', err)
    })
  }, [])

  return (
    <WalletContext.Provider value={{ address, signer, provider, connect, disconnect, isConnecting }}>
      {children}
    </WalletContext.Provider>
  )
}
