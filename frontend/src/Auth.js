import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Auth = () => {
  const {
    loginWithRedirect,
    logout,
    isAuthenticated,
    isLoading,
    user,
    getAccessTokenSilently,
  } = useAuth0();

  const callApi = async () => {
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(`${process.env.REACT_APP_API_URL}/ping`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      alert(JSON.stringify(data, null, 2));
    } catch (e) {
      alert(`API error: ${e.message}`);
    }
  };

  if (isLoading) return <div>Loading…</div>;

  return (
    <div style={{ padding: 16 }}>
      {!isAuthenticated ? (
        <button onClick={() => loginWithRedirect()}>Log in</button>
      ) : (
        <>
          <p>
            <strong>Welcome:</strong> {user?.name || user?.email}
          </p>
          {user?.picture && (
            <img
              src={user.picture}
              alt="avatar"
              style={{ width: 50, height: 50, borderRadius: "50%" }}
            />
          )}
          <div style={{ marginTop: 12 }}>
            <button onClick={callApi}>Call Protected API</button>{" "}
            <button
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
            >
              Log out
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Auth;
