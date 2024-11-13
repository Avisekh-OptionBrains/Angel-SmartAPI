// credentials.js
const https = require("https");
const os = require("os");

// Function to get the public IP
function getPublicIp() {
  return new Promise((resolve, reject) => {
    https
      .get("https://api.ipify.org?format=json", (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          const ipInfo = JSON.parse(data);
          resolve(ipInfo.ip); // Resolve with the public IP address
        });
      })
      .on("error", (err) => {
        reject("Error fetching public IP:", err);
      });
  });
}

// Function to get the MAC address
function getMacAddress() {
  const networkInterfaces = os.networkInterfaces();

  for (const interfaceName in networkInterfaces) {
    const networkInfo = networkInterfaces[interfaceName];

    for (const info of networkInfo) {
      if (info.mac && info.mac !== "00:00:00:00:00:00") {
        return info.mac;
      }
    }
  }

  return null; // If no valid MAC address is found
}

// Enhanced function to get the local IP address
function getLocalIp() {
  const networkInterfaces = os.networkInterfaces();

  for (const interfaceName in networkInterfaces) {
    // Loop through all interfaces (e.g., eth0, wlan0, etc.)
    for (const info of networkInterfaces[interfaceName]) {
      // Check for non-internal (not localhost) and IPv4 addresses
      if (info.family === "IPv4" && !info.internal) {
        return info.address; // Return the first valid non-internal IPv4 address
      }
    }
  }

  return "Local IP not found"; // Return a fallback message if no valid address is found
}

// Function to get JWT Token
function getJwtToken() {
  return "eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IkFBQUE1NTI0OTkiLCJyb2xlcyI6MCwidXNlcnR5cGUiOiJVU0VSIiwidG9rZW4iOiJleUpoYkdjaU9pSlNVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKMWMyVnlYM1I1Y0dVaU9pSmpiR2xsYm5RaUxDSjBiMnRsYmw5MGVYQmxJam9pZEhKaFpHVmZZV05qWlhOelgzUnZhMlZ1SWl3aVoyMWZhV1FpT2pFd01pd2ljMjkxY21ObElqb2lNeUlzSW1SbGRtbGpaVjlwWkNJNkltUmlNMll4TUdFeExUQXhaVFF0TXpSall5MDRaRFJqTFRKbVpHVXhNMkUxTnpZM1pDSXNJbXRwWkNJNkluUnlZV1JsWDJ0bGVWOTJNU0lzSW05dGJtVnRZVzVoWjJWeWFXUWlPakV3TWl3aWNISnZaSFZqZEhNaU9uc2laR1Z0WVhRaU9uc2ljM1JoZEhWeklqb2lZV04wYVhabEluMTlMQ0pwYzNNaU9pSjBjbUZrWlY5c2IyZHBibDl6WlhKMmFXTmxJaXdpYzNWaUlqb2lRVUZCUVRVMU1qUTVPU0lzSW1WNGNDSTZNVGN6TVRVNE56YzJPU3dpYm1KbUlqb3hOek14TlRBeE16QTVMQ0pwWVhRaU9qRTNNekUxTURFek1Ea3NJbXAwYVNJNklqUm1NV1UxWkdVMUxXUXlNRFF0TkRVMVpTMWlPVGhpTFdRMk5ERTROR1l3TXpnMFl5SXNJbFJ2YTJWdUlqb2lJbjAuVXNXeUJ0Z09fZFJpMUxDbDZlZ3lsVXc4bm9zXzlIendkRTFxeEx4enY3Z1dpVkNubXh1TFFYbGtSUm5CTTFYUW41UEE5WHFqUkxYRmpqc2lWbVpicUpINS03dzNGbU5CY01GME94TDlTaE94dnBwSjlNaWJPVkJ5OHlOT2hkclZ3cHFnZ05wVXd3LWo0Q3NuSkR0aWdjZ2p6N1VrTEFWajRJREJORzVib05RIiwiQVBJLUtFWSI6Im9iblRzaU5XIiwiaWF0IjoxNzMxNTAxMzY5LCJleHAiOjE3MzE1ODc3Njl9.UqteN_m1Bb8hhwuMBYq94dTXujTPAWFEmu5Bq6QnE1JMywFK_Fsfo3sfUaGHUZ0ETqAI-H6fAGW9qKaGyxSGkQ";
}

// Function to get API Key
function getApiKey() {
  return "obnTsiNW";
}

// Export the functions to be used in other files
module.exports = async () => {
  const publicIp = await getPublicIp(); // Await public IP resolution
  const macAddress = getMacAddress(); // Synchronous function
  const localIp = getLocalIp(); // Local IP retrieval
  const jwtToken = getJwtToken(); // Synchronous function
  const apiKey = getApiKey(); // Synchronous function

  // Return an object with the values
  return {
    publicIp,
    macAddress,
    localIp,
    jwtToken,
    apiKey,
  };
};
