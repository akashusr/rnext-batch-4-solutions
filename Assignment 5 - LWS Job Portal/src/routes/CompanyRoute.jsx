import { Navigate, Outlet } from "react-router-dom";
import { Footer } from "../components/Footer";
import Header from "../components/Header";
import { useAuth } from "../hooks/useAuth";

const CompanyRoute = () => {
  const { auth } = useAuth();

  return (
    <>
      {auth?.user?.data.role === "COMPANY" ? (
        <>
          <Header />
          <main className="mx-auto">
            <div>
              <Outlet />
            </div>
          </main>
          <Footer />
        </>
      ) : (
        <Navigate to={`/login`} />
      )}
    </>
  );
};

export default CompanyRoute;
