import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Auth = () => {
  const { loginWithRedirect, logout, isAuthenticated, isLoading, user, getAccessTokenSilently } = useAuth0();

  if (isLoading) return <div className="container"><div className="card">Loading…</div></div>;

  return (
    <div className="card">
      {!isAuthenticated ? (
        <button className="btn btn-primary" onClick={() => loginWithRedirect()}>Log in</button>
      ) : (
        <>
          <p><strong>Welcome:</strong> {user?.name || user?.email}</p>
          {user?.picture && <img src={user.picture} alt="avatar" style={{width:56,height:56,borderRadius:"50%"}} />}
          <div className="section" style={{display:"flex",gap:12}}>
            <button className="btn btn-outline" onClick={async ()=>{
              try{
                const token = await getAccessTokenSilently();
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/health`, { headers:{ Authorization:`Bearer ${token}` }});
                alert(await res.text());
              }catch(e){ alert(`API error: ${e.message}`)}
            }}>Call Protected API</button>
            <button className="btn btn-ghost"
              onClick={()=>logout({ logoutParams:{ returnTo: window.location.origin }})}>
              Log out
            </button>
          </div>
        </>
      )}
    </div>
  );
};
export default Auth;
