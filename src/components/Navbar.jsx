import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Navbar({ connected, joined }) {
  const { logout, user, wallet } = useAuth();
  const status = joined ? "Live" : connected ? "Connecting" : "Offline";

  return (
    <header className="navbar">
      <NavLink className="brand-lockup nav-brand" to="/game">
        <span className="brand-mark">A</span>
        <span>Aviator</span>
      </NavLink>

      <div className="nav-actions">
        <span className={`status-pill ${joined ? "online" : ""}`}>
          {status}
        </span>
        <span className="wallet-pill">{wallet.toFixed(2)}</span>
        <span className="user-pill">{user?.username}</span>
        <button className="ghost-button" type="button" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
