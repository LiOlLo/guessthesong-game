import React, { useEffect, useState } from "react";
import QRScanner from "./QRScanner";
import SpotifyPlayer from "./SpotifyPlayer";

function App() {
  const [token, setToken] = useState(null);

  // Check URL for Spotify access_token after redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token");
    if (accessToken) {
      setToken(accessToken);

      // Clean up URL so token is not visible
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  // Login button handler
  const handleLogin = () => {
    // --- LOCAL TESTING --- 
    // Redirect to your local backend (port 8888)
    //window.location.href = "http://localhost:8888/api/login";

    // --- DEPLOYED ON VERCEL ---
    window.location.href = "https://guessthesong-game-vercel.vercel.app/api/login";
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {!token ? (
        <button
          onClick={handleLogin}
          style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
        >
          Login with Spotify
        </button>
      ) : (
        <>
          <h2>Scan a QR code to play a song</h2>
          <QRScanner token={token} />
          <SpotifyPlayer token={token} />
        </>
      )}
    </div>
  );
}

export default App;
