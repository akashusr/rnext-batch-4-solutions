import { Navigate, Outlet } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../hooks/useAuth";
import { Footer } from "../components/Footer";

const PrivateRoute = () => {
  const { auth } = useAuth();




  return (
    <>
      {auth?.user?.data.role === "USER" ? (
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

export default PrivateRoute;
