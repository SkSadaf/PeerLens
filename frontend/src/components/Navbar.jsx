import { Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

export default function Navbar(){
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const { pathname } = useLocation();

  useEffect(() => {
    const saved = localStorage.getItem("pl-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("pl-theme", next);
  };

  const NavBtn = ({to, children}) => (
    <Link to={to} className={`btn btn-nav ${pathname === to ? "active":""}`}>{children}</Link>
  );

  return (
    <header className="navbar">
      <Link to="/" className="brand brand-with-logo">
        <img src="/logo.jpeg" alt="PeerLens" className="brand-logo" />
        <span className="brand-gradient">PeerLens</span>
      </Link>

      <div className="nav-group">
        <span className="beta">beta</span>
        <NavBtn to="/upload">Upload</NavBtn>
        <NavBtn to="/ideas">Ideas</NavBtn>
        <NavBtn to="/evaluation">Evaluation</NavBtn>
      </div>

      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          <span className="sun" /><span className="moon" />
        </button>

        {!isAuthenticated ? (
          <button className="btn btn-outline" onClick={() => loginWithRedirect()}>Sign in</button>
        ) : (
          <>
            <span className="muted" style={{fontSize:14}}>
              {user?.given_name || user?.name || user?.email}
            </span>
            <button className="btn btn-outline"
              onClick={() => logout({ logoutParams:{ returnTo: window.location.origin }})}>
              Log out
            </button>
          </>
        )}
      </div>
    </header>
  );
}
