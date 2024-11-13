const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// main.js

// anotherFile.js
const getCredentials = require("./cred"); // Adjust path accordingly

// Invoke the function to get the credentials
(async () => {
  try {
    const credentials = await getCredentials(); // Wait for the values to be fetched

    // Now you can use these as variables
    const publicIp = credentials.publicIp;
    const macAddress = credentials.macAddress;
    const localIp = credentials.localIp;
    const jwtToken = credentials.jwtToken;
    const apiKey = credentials.apiKey;

    // Example usage of the variables in your project
    console.log("Public IP:", publicIp);
    console.log("MAC Address:", macAddress);
    console.log("Local IP:", localIp);
    console.log("JWT Token:", jwtToken);
    console.log("API Key:", apiKey);

    // You can now use these values in your project logic, e.g.,
    // making an API request with the JWT token, using the local IP for network-related tasks, etc.

    // Example: Passing the API key and token to an API request
    // const response = await someApiRequest({
    //   headers: { Authorization: `Bearer ${jwtToken}` },
    //   params: { apiKey }
    // });
  } catch (err) {
    console.error("Error getting credentials:", err); // Handle any error
  }
})();
const { MongoClient } = require("mongodb");

const CONFIG = require("./config"); // Import your config file

const app = express();
const PORT = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static("public")); // Serve HTML file from 'public' directory

//////////////// credentials ////////////////

// const macAddress = getMacAddress();

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

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON format" });
  }
  next();
});

// Middleware to handle different content types
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.text());

// MongoDB connection URI
const mongoUri =
  "mongodb+srv://Avisekh:28lG37N915VC4fmw@db-mongodb-nyc3-06588-53e12b7f.mongo.ondigitalocean.com/trades?tls=true&authSource=admin&replicaSet=db-mongodb-nyc3-06588";

const client = new MongoClient(mongoUri);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  }
}

// Connect to the database when the server starts
connectToDatabase();

// Middleware to handle errors for invalid JSON

// Function to parse message text and extract symbol name
function parseMessageText(messageText) {
  const regex = /ER (Buy|Sell) (\w+) at (\d+(\.\d+)?)/; // Modified regex to also capture price and transaction type
  const match = messageText.match(regex);
  if (match) {
    return {
      transactionType: match[1], // Capture the transaction type (Buy/Sell)
      symbol: match[2], // Capture the symbol
      price: parseFloat(match[3]), // Capture the price
    };
  }
  return null;
}

// Function to query the database
async function findSymbolInDatabase(symbol) {
  try {
    const database = client.db("Angel_api");
    const collection = database.collection("totalscript");

    // Define query to match both `exch_seg: "NSE"` and `name`
    const query = {
      exch_seg: "NSE",
      name: symbol,
    };

    // Log query parameters for debugging
    console.log("Searching database with query:", query);

    const results = await collection.find(query).toArray();

    if (results.length === 0) {
      console.log("No matching document found for symbol:", symbol);
      return null;
    }

    // Iterate over the results and check if the symbol ends with "-EQ"
    for (let i = 0; i < results.length; i++) {
      const result = results[i];

      // If the symbol ends with "-EQ", return the result
      if (result.symbol && result.symbol.endsWith("-EQ")) {
        console.log("Matching document found:", result);
        return result;
      } else {
        console.log(
          `Found document ${result.symbol}, but symbol does not end with '-EQ'`
        );
      }
    }

    // If no matching symbol found
    console.log("No symbol found ending with '-EQ'");
    return null;
  } catch (error) {
    console.error("Database query error:", error);
    return null;
  }
}

// Function to send message to Telegram
async function sendMessageToTelegram(botToken, channelId, messageText) {
  try {
    if (!botToken || !channelId) {
      console.error(
        "Error: Missing Telegram credentials - botToken or channelId is not provided."
      );
      return { ok: false, error: "Missing Telegram credentials" };
    }

    const response = await axios.post(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        chat_id: channelId,
        text: messageText,
        parse_mode: "Markdown",
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Telegram API error:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to send message to Telegram");
  }
}
app.post("/autoPlaceOrder", async (req, res) => {
  let messageText = req.body;

  // Log the route being accessed
  console.log("Route: /autoPlaceOrder");

  if (typeof messageText === "object" && messageText.messageText) {
    messageText = messageText.messageText;
  }

  if (!messageText) {
    return res.status(400).json({ error: "Message text is required" });
  }

  const parsedData = parseMessageText(messageText);
  if (!parsedData) {
    return res.status(400).json({
      error: "Could not parse the symbol and price from the message text",
    });
  }

  const { symbol, price, transactionType } = parsedData;

  try {
    // Fetch credentials asynchronously
    const credentials = await getCredentials();
    const { jwtToken, macAddress, localIp, publicIp, apiKey } = credentials;
    console.log("Credentials:", credentials);

    if (!jwtToken || !macAddress || !localIp || !publicIp || !apiKey) {
      return res
        .status(400)
        .json({ error: "Missing credentials for the order" });
    }

    const document = await findSymbolInDatabase(symbol);

    if (document) {
      // Sending message to Epicrise Telegram Channel
      console.log("Route: Sending message to Epicrise");
      const telegramResponse = await sendMessageToTelegram(
        CONFIG.EPICRISE.TELEGRAM_BOT_TOKEN,
        CONFIG.EPICRISE.CHANNEL_ID,
        messageText
      );

      if (telegramResponse.ok) {
        // Log the sending message result
        console.log("Message sent to Epicrise channel");

        // Prepare order data using the price extracted from the message
        console.log("Route: Placing order via AngelBroking API");

        // Calculate squareoff (6% above the price) and stoploss (2.5% below the price)
        const squareoff = price * 1.06; // 6% above price
        const stoploss = price * 0.975; // 2.5% below price
        const quantity = Math.floor(4000 / price); // Quantity based on the price (9000 INR in total)

        // Ensure no decimals in price, squareoff, stoploss, and quantity
        const squareoffRounded = Math.floor(squareoff);
        const stoplossRounded = Math.floor(stoploss);
        const quantityRounded = quantity;

        // Log the data to be sent as a JSON object
        const orderDataJson = {
          variety: "ROBO",
          tradingsymbol: document.symbol,
          symboltoken: document.token, // Assuming symboltoken is part of the document
          transactiontype: transactionType.toUpperCase(), // Use the extracted transaction type
          exchange: "NSE",
          ordertype: "LIMIT",
          producttype: "BO",
          duration: "DAY",
          price: price.toFixed(2), // Use extracted price
          squareoff: squareoffRounded.toFixed(2), // Squareoff rounded to two decimal places
          stoploss: stoplossRounded.toFixed(2), // Stoploss rounded to two decimal places
          quantity: quantityRounded, // Quantity based on price
        };

        console.log(
          "Sending Order Data:",
          JSON.stringify(orderDataJson, null, 2)
        );

        // Define the data to be sent to the external API
        const data = JSON.stringify(orderDataJson);

        // Now, use the fetched credentials in the headers
        const config = {
          method: "post",
          url: "https://apiconnect.angelone.in/rest/secure/angelbroking/order/v1/placeOrder",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-UserType": "USER",
            "X-SourceID": "WEB",
            "X-ClientLocalIP": localIp,
            "X-ClientPublicIP": publicIp,
            "X-MACAddress": macAddress,
            "X-PrivateKey": apiKey,
          },

          data: data,
        };
        // console.log("Config:", config);
        const placeOrderResponse = await axios(config);
        res.json({
          telegramResponse: telegramResponse,
          placeOrderResponse: placeOrderResponse.data,
        });
      } else {
        res.status(500).json({ error: "Failed to send message to Epicrise" });
      }
    } else {
      res.status(404).json({ error: "Symbol not found in database" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//// limit route

app.get("/getRMS", async (req, res) => {
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
    url: "https://apiconnect.angelone.in/rest/secure/angelbroking/user/v1/getRMS",
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
    res.json(response.data); // Send response data back to the client
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
