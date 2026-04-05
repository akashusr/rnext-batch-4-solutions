import { Navigate, Outlet } from "react-router-dom";
import { Footer } from "../components/Footer";
import Header from "../components/Header";
import { useAuth } from "../hooks/useAuth";

const LoginRoute = () => {
  const { auth } = useAuth();

  return (
    <>
      {auth?.user ? (
        <Navigate to={`/`} />
      ) : (
        <main>
          <Header />
          <div>
            <Outlet />
          </div>
          <Footer />
        </main>
      )}
    </>
  );
};

export default LoginRoute;
