// import React from "react";
// import Auth from "./Auth";

// function App() {
//   return (
//     <div style={{ fontFamily: "Inter, system-ui, sans-serif", padding: 24 }}>
//       <h1>Auth0 + CRA Demo</h1>
//       <Auth />
//     </div>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import Layout from "./components/Layout";
import UploadPage from "./pages/UploadPage";
import IdeasPage from "./pages/IdeasPage";
import IdeaDetailsPage from "./pages/IdeaDetailsPage";
import EvaluationPage from "./pages/EvaluationPage";
import Auth from "./Auth";

function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <p style={{ padding: 24 }}>Loading authentication...</p>;
  }

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {!isAuthenticated ? (
        // Show login/signup page if not logged in
        <div style={{ padding: 24 }}>
          <h1 className="text-2xl font-bold mb-4">Research Idea Assistant</h1>
          <Auth />
        </div>
      ) : (
        // Show main app pages when logged in
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<UploadPage />} />
              <Route path="/ideas" element={<IdeasPage />} />
              <Route path="/idea-details" element={<IdeaDetailsPage />} />
              <Route path="/evaluation" element={<EvaluationPage />} />
            </Routes>
          </Layout>
        </Router>
      )}
    </div>
  );
}

export default App;
