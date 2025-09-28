import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function Navbar() {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  return (
    <nav className="navbar">
      <div style={{display:"flex",alignItems:"center",gap:16}}>
        <Link to="/" className="brand">
          <span className="brand-gradient">PeerLens</span>
        </Link>
        <span className="badge">beta</span>
        {isAuthenticated && (
          <div style={{display:"flex",gap:14,marginLeft:10}}>
            <Link to="/upload">Upload</Link>
            <Link to="/ideas">Ideas</Link>
            <Link to="/evaluation">Evaluation</Link>
          </div>
        )}
      </div>

      <div style={{display:"flex",alignItems:"center",gap:12}}>
        {isAuthenticated ? (
          <>
            <span className="muted" style={{fontSize:14}}>
              {user?.name || user?.email}
            </span>
            <button
              className="btn btn-outline"
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin }})}
            >
              Log out
            </button>
          </>
        ) : (
          <button className="btn btn-primary" onClick={() => loginWithRedirect()}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
