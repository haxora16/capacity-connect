import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#F6F8FB] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center space-y-5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600 border border-amber-200">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <div className="space-y-1">
          <h1 className="text-xl font-bold text-[#172033] tracking-tight">Access Restricted (403)</h1>
          <p className="text-sm text-slate-500">
            You do not have the required institutional authorization to access this section of CAPACITY CONNECT.
          </p>
        </div>

        <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 border border-slate-100 text-left">
          <span className="font-semibold text-slate-800">Security Notice:</span> Access to administrative, trainer, and operational consoles is strictly controlled by institutional role assignments.
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link href="/login" className="flex-1">
            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Switch Account
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="primary" className="w-full flex items-center justify-center gap-2">
              <Home className="h-4 w-4" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
