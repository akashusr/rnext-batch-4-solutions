import { Outlet } from "react-router-dom";
import { Footer } from "../components/Footer";
import Header from "../components/Header";

const PublicRoute = () => {
  return (
    <>
      <Header />
      <main>
        <div>
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PublicRoute;
