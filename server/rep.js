const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());

app.post("/cancelOrder", (req, res) => {
  console.log("Cookies:", req.cookies);

  const jwtToken = req.cookies.jwtToken;
  const macAddress = req.cookies.macAddress;
  const apiKey = req.cookies.apiKey;
  const localIP = req.cookies.localIP;
  const publicIP = req.cookies.publicIP;

  console.log("JWT Token:", jwtToken);
  console.log("MAC Address:", macAddress);
  console.log("API Key:", apiKey);
  console.log("Local IP:", localIP);
  console.log("Public IP:", publicIP);

  // ... your POST request logic using the cookie data ...

  res.send("POST request received");
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
