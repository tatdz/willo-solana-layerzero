export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-coins text-white text-sm"></i>
              </div>
              <h3 className="font-bold text-gray-900">Willo</h3>
            </div>
            <p className="text-sm text-gray-600">
              The world's first omnichain inheritance platform built on Solana with LayerZero V2 OApp/OFT standards. Secure your digital legacy across all blockchains.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Technology Stack</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <i className="fas fa-bolt mr-2 text-purple-500"></i>
                Solana Smart Contracts
              </li>
              <li className="flex items-center">
                <i className="fas fa-link mr-2 text-blue-500"></i>
                LayerZero V2 OApp/OFT
              </li>
              <li className="flex items-center">
                <i className="fas fa-globe mr-2 text-green-500"></i>
                Cross-Chain Compatible
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-500">
          <p>&copy; 2024 Willo. Built with LayerZero protocol. Testnet version.</p>
        </div>
      </div>
    </footer>
  );
}
