const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const cookieParser = require("cookie-parser"); // Include cookie-parser to handle cookies
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

app.use(cookieParser()); // Middleware to parse cookies

app.get("/getProfile", async (req, res) => {
  // Retrieve JWT token and other necessary values from cookies
  const jwtToken = req.cookies?.jwtToken;
  const macAddress = req.cookies?.macAddress; // Retrieve MAC address from cookies
  const apiKey = req.cookies?.apiKey; // Retrieve API key from cookies

  // Check for the existence of required cookies
  if (!jwtToken || !macAddress || !apiKey) {
    console.error("Missing required cookies."); // Log missing cookie error
    return res
      .status(401)
      .json({ error: "Unauthorized: Required cookies are missing" });
  }

  // Configure the request to the API
  const config = {
    method: "get",
    url: "https://apiconnect.angelone.in/rest/secure/angelbroking/user/v1/getProfile",
    headers: {
      Authorization: `Bearer ${jwtToken}`, // Use the retrieved JWT token
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-UserType": "USER",
      "X-SourceID": "WEB",
      "X-ClientLocalIP":
        req.headers["x-forwarded-for"] || req.connection.remoteAddress,
      "X-ClientPublicIP":
        req.headers["x-forwarded-for"] || req.connection.remoteAddress,
      "X-MACAddress": macAddress, // Use MAC address from cookies
      "X-PrivateKey": apiKey, // Use API key from cookies
    },
  };

  try {
    // Make the API request
    const response = await axios(config);
    console.log("Profile data:", response.data); // Log the response data
    res.json(response.data); // Send response data back to the client
  } catch (error) {
    console.error("Error fetching profile:", error);
    if (error.response) {
      console.error("Error response:", error.response.data); // Log any error response from the API
    }
    res.status(500).json({ error: "Failed to fetch profile" }); // Handle any other errors
  }
});

// Start the Express server (make sure to set the appropriate port)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
