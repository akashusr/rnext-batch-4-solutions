import { Route, Routes } from "react-router-dom";
import "./App.css";
import CompanyPublicProfile from "./pages/company-public-profile";
import Applicants from "./pages/company/applicants";
import CompanyProfile from "./pages/company/company-profile";
import CompanySettings from "./pages/company/company-settings";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import CreateJob from "./pages/company/create-job";
import ManageJobs from "./pages/company/manage-jobs";
import Home from "./pages/Home";
import { JobDetails } from "./pages/job-details";
import AppliedJobsPage from "./pages/job-seeker/applied-jobs";
import EditUserProfile from "./pages/job-seeker/edit-user-profile";
import Profile from "./pages/job-seeker/Profile";
import UserDashboard from "./pages/job-seeker/user-dashboard";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { RegisterCompany } from "./pages/Register-company";
import AuthProvider from "./providers/AuthProvider";
import { CompanyJobProvider } from "./providers/CompanyJobProvider";
import { JobProvider } from "./providers/JobProvider";
import CompanyRoute from "./routes/CompanyRoute";
import LoginRoute from "./routes/LoginRoute";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";

function App() {
  return (
    <>
      <AuthProvider>
        <JobProvider>
          <CompanyJobProvider>
            <Routes>
              <Route element={<PublicRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/jobs/:id" element={<JobDetails />} />
                <Route
                  path="/company-profile/:slug"
                  element={<CompanyPublicProfile />}
                />
              </Route>

              <Route element={<LoginRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/register-company" element={<RegisterCompany />} />
              </Route>

              <Route element={<PrivateRoute />}>
                <Route path="/applied-jobs" element={<AppliedJobsPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/user-dashboard" element={<UserDashboard />} />
                <Route
                  path="/edit-user-profile"
                  element={<EditUserProfile />}
                />
              </Route>

              <Route element={<CompanyRoute />}>
                <Route
                  path="/company-dashboard"
                  element={<CompanyDashboard />}
                />
                <Route path="/manage-jobs" element={<ManageJobs />} />
                <Route path="/create-job" element={<CreateJob />} />
                <Route path="/applicants" element={<Applicants />} />
                <Route path="/company-profile" element={<CompanyProfile />} />
                <Route path="/company-settings" element={<CompanySettings />} />
              </Route>
            </Routes>
          </CompanyJobProvider>
        </JobProvider>
      </AuthProvider>
    </>
  );
}

export default App;
