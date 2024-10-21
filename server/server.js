const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000; // Choose your port

app.use(bodyParser.json());
app.use(express.static("public")); // Serve HTML file from 'public' directory

app.post("/login", async (req, res) => {
  const { apiKey, clientCode, password, totp, localIP, publicIP, macAddress } =
    req.body;

  const data = {
    clientcode: clientCode,
    password: password,
    totp: totp,
  };

  const config = {
    method: "post",
    url: "https://apiconnect.angelone.in/rest/auth/angelbroking/user/v1/loginByPassword",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-UserType": "USER",
      "X-SourceID": "WEB",
      "X-ClientLocalIP": localIP, // Use the fetched local IP
      "X-ClientPublicIP": publicIP, // Use the fetched public IP
      "X-MACAddress": macAddress, // Use the input MAC address
      "X-PrivateKey": apiKey,
    },
    data: data,
  };

  try {
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
