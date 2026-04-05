export const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30 mt-16 border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">LWS Job Portal</h3>
            <p className="text-sm text-muted-foreground">
              Your trusted platform for finding the perfect job or the perfect
              candidate.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">For Job Seekers</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground">
                  Browse Jobs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Companies
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Career Advice
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Salary Guide
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">For Employers</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground">
                  Post a Job
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Browse Candidates
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Hiring Resources
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground border-gray-200">
          <p>&copy; 2025 LWS Job Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
