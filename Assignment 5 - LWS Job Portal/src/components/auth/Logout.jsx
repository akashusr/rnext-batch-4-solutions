import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Logout = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("auth");
    setAuth({});
    navigate("/login");
  }

  return (
    <button className="icon-btn" onClick={handleLogout}>
      <img src="./assets/icons/logout.svg" alt="Logout" />
    </button>
  );
};

export default Logout;
