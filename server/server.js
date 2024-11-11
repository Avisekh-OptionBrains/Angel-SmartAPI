const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 3000;

app.use(cookieParser()); // Middleware to parse cookies
app.use(bodyParser.json());
app.use(express.static("public")); // Serve HTML file from 'public' directory

// Login route to authenticate user
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
      "X-ClientLocalIP": localIP,
      "X-ClientPublicIP": publicIP,
      "X-MACAddress": macAddress,
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

// Get profile route
app.get("/getProfile", async (req, res) => {
  const jwtToken = req.cookies?.jwtToken;
  const macAddress = req.cookies?.macAddress;
  const apiKey = req.cookies?.apiKey;

  if (!jwtToken || !macAddress || !apiKey) {
    console.error("Missing required cookies.");
    return res
      .status(401)
      .json({ error: "Unauthorized: Required cookies are missing" });
  }

  const config = {
    method: "get",
    url: "https://apiconnect.angelone.in/rest/secure/angelbroking/user/v1/getProfile",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-UserType": "USER",
      "X-SourceID": "WEB",
      "X-ClientLocalIP":
        req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      "X-ClientPublicIP":
        req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      "X-MACAddress": macAddress,
      "X-PrivateKey": apiKey,
    },
  };

  try {
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Get order book route
app.get("/getOrderBook", async (req, res) => {
  const jwtToken = req.cookies?.jwtToken;
  const macAddress = req.cookies?.macAddress;
  const apiKey = req.cookies?.apiKey;
  const localIP = req.cookies?.localIP;
  const publicIP = req.cookies?.publicIP;

  if (!jwtToken || !localIP || !publicIP || !macAddress || !apiKey) {
    return res.status(400).json({ error: "Missing required cookie values" });
  }

  const config = {
    method: "get",
    url: "https://apiconnect.angelone.in/rest/secure/angelbroking/order/v1/getOrderBook",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-UserType": "USER",
      "X-SourceID": "WEB",
      "X-ClientLocalIP": localIP,
      "X-ClientPublicIP": publicIP,
      "X-MACAddress": macAddress,
      "X-PrivateKey": apiKey,
    },
  };

  try {
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/getPosition", async (req, res) => {
  // Get the necessary values from the request cookies (or set defaults for testing)
  const jwtToken = req.cookies?.jwtToken;
  const macAddress = req.cookies?.macAddress;
  const apiKey = req.cookies?.apiKey;
  const localIP = req.cookies?.localIP;
  const publicIP = req.cookies?.publicIP;

  // Check for required values
  if (!jwtToken || !localIP || !publicIP || !macAddress || !apiKey) {
    return res.status(400).json({ error: "Missing required cookie values" });
  }

  // Config for making the API call
  const config = {
    method: "get",
    url: "https://apiconnect.angelone.in/rest/secure/angelbroking/order/v1/getPosition", // The URL you want to request
    headers: {
      Authorization: `Bearer ${jwtToken}`, // Bearer token
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-UserType": "USER",
      "X-SourceID": "WEB",
      "X-ClientLocalIP": localIP, // Use the local IP from cookies
      "X-ClientPublicIP": publicIP, // Use the public IP from cookies
      "X-MACAddress": macAddress, // Use the MAC address from cookies
      "X-PrivateKey": apiKey, // Use the API key from cookies
    },
  };

  try {
    // Make the API call
    const response = await axios(config);
    // Send the response data back to the client
    res.json(response.data);
  } catch (error) {
    // Handle errors if the request fails
    res.status(500).json({ error: error.message });
  }
});

// Cancel order route
app.post("/cancelOrder", async (req, res) => {
  const jwtToken = req.cookies?.jwtToken;
  const macAddress = req.cookies?.macAddress;
  const apiKey = req.cookies?.apiKey;
  const localIP = req.cookies?.localIP;
  const publicIP = req.cookies?.publicIP;

  if (!jwtToken || !localIP || !publicIP || !macAddress || !apiKey) {
    return res.status(400).json({ error: "Missing required cookie values" });
  }

  const { variety = "NORMAL", orderid = "201020000000080" } = req.body;
  const data = JSON.stringify({ variety, orderid });

  const config = {
    method: "post",
    url: "https://apiconnect.angelone.in/rest/secure/angelbroking/order/v1/cancelOrder",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-UserType": "USER",
      "X-SourceID": "WEB",
      "X-ClientLocalIP": localIP,
      "X-ClientPublicIP": publicIP,
      "X-MACAddress": macAddress,
      "X-PrivateKey": apiKey,
    },
    data: data,
  };

  try {
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Modify order route
app.post("/modifyOrder", async (req, res) => {
  const jwtToken = req.cookies?.jwtToken;
  const macAddress = req.cookies?.macAddress;
  const apiKey = req.cookies?.apiKey;
  const localIP = req.cookies?.localIP;
  const publicIP = req.cookies?.publicIP;

  if (!jwtToken || !localIP || !publicIP || !macAddress || !apiKey) {
    return res.status(400).json({ error: "Missing required cookie values" });
  }

  const {
    variety = "NORMAL",
    orderid = "201020000000080",
    ordertype = "LIMIT",
    producttype = "INTRADAY",
    duration = "DAY",
    price = "194.00",
    quantity = "1",
  } = req.body;
  const data = JSON.stringify({
    variety,
    orderid,
    ordertype,
    producttype,
    duration,
    price,
    quantity,
  });

  const config = {
    method: "post",
    url: "https://apiconnect.angelone.in/rest/secure/angelbroking/order/v1/modifyOrder",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-UserType": "USER",
      "X-SourceID": "WEB",
      "X-ClientLocalIP": localIP,
      "X-ClientPublicIP": publicIP,
      "X-MACAddress": macAddress,
      "X-PrivateKey": apiKey,
    },
    data: data,
  };

  try {
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get LTP data route
app.post("/getLtpData", async (req, res) => {
  const jwtToken = req.cookies?.jwtToken;
  const macAddress = req.cookies?.macAddress;
  const apiKey = req.cookies?.apiKey;
  const localIP = req.cookies?.localIP;
  const publicIP = req.cookies?.publicIP;

  if (!jwtToken || !localIP || !publicIP || !macAddress || !apiKey) {
    return res.status(400).json({ error: "Missing required cookie values" });
  }

  const {
    exchange = "NSE",
    tradingsymbol = "SBIN-EQ",
    symboltoken = "3045",
  } = req.body;
  const data = JSON.stringify({ exchange, tradingsymbol, symboltoken });

  const config = {
    method: "post",
    url: "https://apiconnect.angelone.in/rest/secure/angelbroking/order/v1/getLtpData",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-UserType": "USER",
      "X-SourceID": "WEB",
      "X-ClientLocalIP": localIP,
      "X-ClientPublicIP": publicIP,
      "X-MACAddress": macAddress,
      "X-PrivateKey": apiKey,
    },
    data: data,
  };

  try {
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get trade book route
app.get("/getTradeBook", async (req, res) => {
  const jwtToken = req.cookies?.jwtToken;
  const macAddress = req.cookies?.macAddress;
  const apiKey = req.cookies?.apiKey;
  const localIP = req.cookies?.localIP;
  const publicIP = req.cookies?.publicIP;

  if (!jwtToken || !localIP || !publicIP || !macAddress || !apiKey) {
    return res.status(400).json({ error: "Missing required cookie values" });
  }

  const config = {
    method: "get",
    url: "https://apiconnect.angelone.in/rest/secure/angelbroking/order/v1/getTradeBook",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-UserType": "USER",
      "X-SourceID": "WEB",
      "X-ClientLocalIP": localIP,
      "X-ClientPublicIP": publicIP,
      "X-MACAddress": macAddress,
      "X-PrivateKey": apiKey,
    },
  };

  try {
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/place-order", async (req, res) => {
  const jwtToken = req.cookies?.jwtToken;
  const macAddress = req.cookies?.macAddress;
  const apiKey = req.cookies?.apiKey;
  const localIP = req.cookies?.localIP;
  const publicIP = req.cookies?.publicIP; // Assuming data is sent in the request body

  // Define the data to be sent to the external API
  const data = JSON.stringify({
    exchange: "NSE",
    tradingsymbol: orderData.tradingsymbol,
    quantity: orderData.quantity,
    disclosedquantity: orderData.disclosedquantity,
    transactiontype: orderData.transactiontype,
    ordertype: orderData.ordertype,
    variety: "NORMAL",
    producttype: "INTRADAY",
  });

  // Define the configuration for the API request
  const config = {
    method: "post",
    url: "https://apiconnect.angelone.in/rest/secure/angelbroking/order/v1/placeOrder",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-UserType": "USER",
      "X-SourceID": "WEB",
      "X-ClientLocalIP": localIP,
      "X-ClientPublicIP": publicIP,
      "X-MACAddress": macAddress,
      "X-PrivateKey": apiKey,
    },
    data: data,
  };

  try {
    // Make the API request to AngelBroking API
    const response = await axios(config);
    res.json(response.data); // Send the response from the external API back to the client
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Failed to place the order" }); // Handle errors appropriately
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
