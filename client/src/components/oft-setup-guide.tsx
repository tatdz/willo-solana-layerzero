import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function OftSetupGuide() {
  const recentRegistrations = [
    {
      name: "Willo Token",
      status: "active",
      registeredDays: 2,
    },
    {
      name: "Test Token",
      status: "pending",
      registeredDays: 0,
    },
  ];

  const steps = [
    "Install Solana CLI and SPL Token CLI",
    "Create SPL Token on Testnet",
    "Register as OFT with LayerZero",
    "Test integration and start using",
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">OFT Setup Guide</h2>
        <Button variant="ghost" className="text-primary hover:text-primary/80">
          View Full Documentation <i className="fas fa-external-link-alt ml-1"></i>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="p-6 gradient-primary text-white">
            <h3 className="font-semibold mb-3">Quick Start</h3>
            <ol className="space-y-2 text-sm">
              {steps.map((step, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="bg-white/20 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </Card>

          <div>
            <h3 className="font-medium text-gray-900 mb-3">CLI Commands</h3>
            <div className="space-y-2">
              <Card className="bg-gray-900 p-4">
                <code className="text-green-400 text-sm block whitespace-pre-wrap">
                  {`# Create SPL Token
solana config set --url https://api.testnet.solana.com
spl-token create-token`}
                </code>
              </Card>
              <Card className="bg-gray-900 p-4">
                <code className="text-green-400 text-sm block whitespace-pre-wrap">
                  {`# Register as OFT
node scripts/oft-adapter-register.js --mint <TOKEN_MINT> --network testnet`}
                </code>
              </Card>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Recent OFT Registrations</h3>
            <div className="space-y-3">
              {recentRegistrations.map((registration, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      registration.status === "active" 
                        ? "bg-emerald-100" 
                        : "bg-amber-100"
                    }`}>
                      <i className={`text-sm ${
                        registration.status === "active" 
                          ? "fas fa-check text-emerald-600" 
                          : "fas fa-clock text-amber-600"
                      }`}></i>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{registration.name}</p>
                      <p className="text-sm text-gray-500">
                        {registration.registeredDays === 0 
                          ? "Registration pending" 
                          : `Registered ${registration.registeredDays} days ago`}
                      </p>
                    </div>
                  </div>
                  <Badge className={
                    registration.status === "active" 
                      ? "bg-emerald-50 text-emerald-700" 
                      : "bg-amber-50 text-amber-700"
                  }>
                    {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <i className="fas fa-lightbulb text-emerald-600 mt-0.5"></i>
              <div className="text-sm">
                <p className="font-medium text-emerald-800">Pro Tip</p>
                <p className="text-emerald-700 mt-1">
                  Test your OFT registration on testnet before deploying to mainnet. Use the built-in testing tools to verify cross-chain functionality.
                </p>
              </div>
            </div>
          </div>

          <Button className="w-full gradient-emerald text-white hover:opacity-90">
            <i className="fas fa-plus mr-2"></i>Register New OFT Token
          </Button>
        </div>
      </div>
    </Card>
  );
}
