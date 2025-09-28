import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./routes/ProtectedRoute";
import HomePage from "./pages/HomePage";
import Auth from "./Auth";                 // your existing Auth component
import Layout from "./components/Layout";  // keep using your Layout as before
import UploadPage from "./pages/UploadPage";
import IdeasPage from "./pages/IdeasPage";
import IdeaDetailsPage from "./pages/IdeaDetailsPage";
import EvaluationPage from "./pages/EvaluationPage";

function App() {
  const { isLoading } = useAuth0();
  if (isLoading) return <p style={{ padding: 24 }}>Loading authentication…</p>;

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <Router>
        <Navbar />

        {/* Layout wraps the page content; if your Layout already includes a header, 
            you can move <Navbar /> inside Layout instead. */}
        <Layout>
          <Routes>
            {/* Home (public) */}
            <Route path="/" element={<HomePage />} />

            {/* Auth page: shows your Auth.js (login UI).
                If already logged in, Auth.js can show profile or you can redirect from there. */}
            <Route path="/auth" element={<Auth />} />

            {/* Protected App Pages */}
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <UploadPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ideas"
              element={
                <ProtectedRoute>
                  <IdeasPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/idea-details"
              element={
                <ProtectedRoute>
                  <IdeaDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/evaluation"
              element={
                <ProtectedRoute>
                  <EvaluationPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
