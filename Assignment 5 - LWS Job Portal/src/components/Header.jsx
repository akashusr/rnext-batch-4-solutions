import { Briefcase, Plus } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ProfileDropdown from "./ProfileDropdown";
import ProfileCompanyDropdown from "./company/ProfileDropdown";

const Header = () => {
  const { auth } = useAuth();

  if (!auth?.user?.data?.role)
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b-gray-200">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">LWS Job Portal</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {auth?.user ? (
              <ProfileDropdown />
            ) : (
              <Link to="/login" className="btn btn-ghost text-sm">
                Sign In
              </Link>
            )}

            <Link to="/register-company" className="btn btn-primary text-sm">
              Post a Job
            </Link>
          </div>
        </div>
      </header>
    );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b-gray-200">
      {auth?.user?.data.role === "USER" ? (
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">LWS Job Portal</span>
            </Link>

            {auth?.user && (
              <nav className="hidden md:flex items-center gap-6">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${
                      isActive
                        ? "text-[hsl(var(--color-primary))]"
                        : "text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-primary))]"
                    }`
                  }
                >
                  Jobs
                </NavLink>

                <NavLink
                  to="/user-dashboard"
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${
                      isActive
                        ? "text-[hsl(var(--color-primary))]"
                        : "text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-primary))]"
                    }`
                  }
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/applied-jobs"
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${
                      isActive
                        ? "text-[hsl(var(--color-primary))]"
                        : "text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-primary))]"
                    }`
                  }
                >
                  My Applications
                </NavLink>
              </nav>
            )}
          </div>

          <div className="flex items-center gap-4">
            {auth?.user ? (
              <ProfileDropdown />
            ) : (
              <Link to="/login" className="btn btn-ghost text-sm">
                Sign In
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">LWS Job Portal</span>
            </Link>

            {auth?.user?.data.role === "COMPANY" && (
              <nav className="hidden md:flex items-center gap-6">
                <NavLink
                  to="/company-dashboard"
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${
                      isActive
                        ? "text-[hsl(var(--color-primary))]"
                        : "text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-primary))]"
                    }`
                  }
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/manage-jobs"
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${
                      isActive
                        ? "text-[hsl(var(--color-primary))]"
                        : "text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-primary))]"
                    }`
                  }
                >
                  Manage Jobs
                </NavLink>

                <NavLink
                  to="/applicants"
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${
                      isActive
                        ? "text-[hsl(var(--color-primary))]"
                        : "text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-primary))]"
                    }`
                  }
                >
                  Applicants
                </NavLink>
              </nav>
            )}
          </div>

          <div className="flex items-center gap-4">
            {auth?.user?.data.role === "COMPANY" ? (
              <>
                <Link to="/create-job" className="btn btn-primary">
                  <Plus className="h-4 w-4 mr-2"></Plus>
                  Post a Job
                </Link>
                {auth?.user ? (
                  <ProfileCompanyDropdown />
                ) : (
                  <Link to="/login" className="btn btn-ghost text-sm">
                    Sign In
                  </Link>
                )}
              </>
            ) : (
              <Link to="/login" className="btn btn-ghost text-sm">
                Post a Job
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
