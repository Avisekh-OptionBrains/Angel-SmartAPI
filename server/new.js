const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");

const CONFIG = require("./config"); // Import your config file
const app = express();

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
    const document = await findSymbolInDatabase(symbol);

    if (document) {
      // console.log("Found document:", document); // Logs the entire object to the console

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
        const quantity = Math.floor(9000 / price); // Quantity based on the price (9000 INR in total)

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

        const config = {
          method: "post",
          url: "https://apiconnect.angelone.in/rest/secure/angelbroking/order/v1/placeOrder",
          headers: {
            Authorization: `Bearer ${req.cookies?.jwtToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-UserType": "USER",
            "X-SourceID": "WEB",
            "X-ClientLocalIP": req.cookies?.localIP,
            "X-ClientPublicIP": req.cookies?.publicIP,
            "X-MACAddress": req.cookies?.macAddress,
            "X-PrivateKey": req.cookies?.apiKey,
          },
          data: data,
        };

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

app.use(express.static("public")); // Serve HTML file from 'public' directory

//

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
