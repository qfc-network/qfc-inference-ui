'use client'

import { useWallet } from '@/providers/WalletProvider'
import { shortenAddress } from '@/lib/format'
import { useState } from 'react'

export function WalletConnect() {
  const { address, connect, disconnect, isConnecting } = useWallet()
  const [showMenu, setShowMenu] = useState(false)

  if (!address) {
    return (
      <button
        onClick={connect}
        disabled={isConnecting}
        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-medium py-2 px-4 rounded-xl transition-all disabled:opacity-50"
      >
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white text-sm font-medium py-2 px-4 rounded-xl transition-colors"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        <span className="font-mono">{shortenAddress(address)}</span>
      </button>
      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50">
          <button
            onClick={() => { disconnect(); setShowMenu(false) }}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-xl transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  )
}
