export function Footer() {
  return (
    <footer className="border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-[10px]">
              Q
            </div>
            QFC AI Inference Marketplace
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="https://explorer.testnet.qfc.network" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">Explorer</a>
            <a href="https://faucet.testnet.qfc.network" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">Faucet</a>
            <a href="https://docs.qfc.network" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">Docs</a>
            <a href="https://github.com/qfc-network" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
