const express = require("express");
const axios = require("axios");
const querystring = require("querystring");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;
const frontendUri = process.env.FRONTEND_URI;

app.get("/api/login", (req, res) => {
  const scopes = "streaming user-read-email user-read-private";
  const authUrl = `https://accounts.spotify.com/authorize?${querystring.stringify({
    response_type: "code",
    client_id: clientId,
    scope: scopes,
    redirect_uri: redirectUri,
  })}`;
  res.redirect(authUrl);
});

app.get("/api/callback", async (req, res) => {
  const code = req.query.code || null;
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(clientId + ":" + clientSecret).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, refresh_token, expires_in } = response.data;
    const query = querystring.stringify({ access_token, refresh_token, expires_in });
    res.redirect(`${frontendUri}?${query}`);
  } catch (err) {
    console.error(err);
    res.send("Error getting tokens");
  }
});

app.get("/api/refresh_token", async (req, res) => {
  const { refresh_token } = req.query;
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        grant_type: "refresh_token",
        refresh_token,
      }),
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(clientId + ":" + clientSecret).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.send("Error refreshing token");
  }
});

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
