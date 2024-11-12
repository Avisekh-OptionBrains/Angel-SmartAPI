async function getPublicIP() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error fetching public IP:", error);
    return null;
  }
}

function setCookie(name, value, days, secure = false) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie =
    name +
    "=" +
    (value || "") +
    expires +
    "; path=/;" +
    (secure ? "; Secure" : "");
}

document
  .getElementById("loginForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const apiKey = event.target.apiKey.value;
    const clientCode = event.target.clientCode.value;
    const password = event.target.password.value;
    const totp = event.target.totp.value;
    const macAddress = event.target.macAddress.value || ""; // Optional

    const localIP = "127.0.0.1"; // For local testing

    const publicIP = await getPublicIP();

    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        apiKey,
        clientCode,
        password,
        totp,
        localIP,
        publicIP,
        macAddress,
      }),
    });

    const result = await response.json();
    if (!result.status) {
      document.getElementById("errorMessage").innerText =
        result.message || "Login failed";
      document.getElementById("successMessage").innerText = ""; // Clear success message
      document.getElementById("errorMessage").style.display = "block";
    } else {
      document.getElementById("errorMessage").innerText = ""; // Clear error message
      document.getElementById("errorMessage").style.display = "none";
      document.getElementById("successMessage").innerText =
        "Login successful! Redirecting...";
      document.getElementById("successMessage").style.display = "block";

      // Set cookies (adjust expiration as needed)
      setCookie("apiKey", apiKey, 7); // Expires in 7 days
      setCookie("clientCode", clientCode, 7);
      setCookie("totp", totp, 7);
      setCookie("localIP", localIP, 7);
      setCookie("publicIP", publicIP, 7);
      setCookie("macAddress", macAddress, 7);

      // Extract and store jwtToken in a separate cookie
      if (result.data && result.data.jwtToken) {
        setCookie("jwtToken", result.data.jwtToken, 7); // Store only the jwtToken
      } else {
        console.error("JWT token not found in response data.");
      }

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = "/index.html";
      }, 2000);
    }
  });
