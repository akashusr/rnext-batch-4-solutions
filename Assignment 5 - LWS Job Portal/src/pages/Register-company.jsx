import { Building2, ChartLine, User, Users } from "lucide-react";
import { Link } from "react-router-dom";
import RegCompanyForm from "../components/auth/RegCompanyForm";

export const RegisterCompany = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* <!-- Page Title --> */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Building2 className="h-8 w-8 text-primary"></Building2>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Register Your Company
          </h1>
          <p className="text-lg text-muted-foreground">
            Start hiring top talent for your organization
          </p>
        </div>

        {/* <!-- Account Type Toggle --> */}
        <div className="w-full text-center">
          <div className="card p-2 mb-8 inline-flex mx-auto w-full max-w-md">
            <div className="grid grid-cols-2 gap-2 w-full">
              <Link to="/register" className="btn btn-ghost text-center">
                <User className="h-4 w-4 mr-2"></User>
                Job Seeker
              </Link>
              <button className="btn btn-primary text-center">
                <Building2 className="h-4 w-4 mr-2"></Building2>
                Employer
              </button>
            </div>
          </div>
        </div>

        {/* <!-- Registration Card --> */}
        <RegCompanyForm />

        {/* <!-- Benefits for Employers --> */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
            <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary"></Users>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">Access Top Talent</h3>
              <p className="text-xs text-muted-foreground">
                Connect with thousands of qualified candidates actively looking
                for opportunities
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
            <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <i data-lucide="zap" className="h-5 w-5 text-primary"></i>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">Easy Job Posting</h3>
              <p className="text-xs text-muted-foreground">
                Post jobs in minutes with our intuitive interface and smart
                templates
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
            <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <ChartLine className="h-5 w-5 text-primary"></ChartLine>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">Smart Analytics</h3>
              <p className="text-xs text-muted-foreground">
                Track applications and optimize your hiring with detailed
                insights
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
