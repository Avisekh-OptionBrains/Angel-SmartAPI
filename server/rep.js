const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

// Use cookie-parser middleware to parse cookies
app.use(cookieParser());

// Example POST route that reads cookies
app.post("/someRoute", (req, res) => {
  // Access cookies via req.cookies
  const jwtToken = req.cookies.jwtToken;
  const localIP = req.cookies.localIP;
  const publicIP = req.cookies.publicIP;
  const macAddress = req.cookies.macAddress;
  const apiKey = req.cookies.apiKey;

  // Log the cookies to the console
  console.log("JWT Token:", jwtToken);
  console.log("Local IP:", localIP);
  console.log("Public IP:", publicIP);
  console.log("MAC Address:", macAddress);
  console.log("API Key:", apiKey);

  // Respond with the cookies or other data
  res.json({
    jwtToken,
    localIP,
    publicIP,
    macAddress,
    apiKey,
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
