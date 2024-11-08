const axios = require("axios");

const config = {
  method: "get",
  url: "https://apiconnect.angelone.in/rest/secure/angelbroking/marketData/v1/nseIntraday",
  headers: {
    Authorization:
      "Bearer eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IkFBQUE1NTI0OTkiLCJyb2xlcyI6MCwidXNlcnR5cGUiOiJVU0VSIiwidG9rZW4iOiJleUpoYkdjaU9pSlNVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKMWMyVnlYM1I1Y0dVaU9pSmpiR2xsYm5RaUxDSjBiMnRsYmw5MGVYQmxJam9pZEhKaFpHVmZZV05qWlhOelgzUnZhMlZ1SWl3aVoyMWZhV1FpT2pFd01pd2ljMjkxY21ObElqb2lNeUlzSW1SbGRtbGpaVjlwWkNJNkltUmlNMll4TUdFeExUQXhaVFF0TXpSall5MDRaRFJqTFRKbVpHVXhNMkUxTnpZM1pDSXNJbXRwWkNJNkluUnlZV1JsWDJ0bGVWOTJNU0lzSW05dGJtVnRZVzVoWjJWeWFXUWlPakV3TWl3aWNISnZaSFZqZEhNaU9uc2laR1Z0WVhRaU9uc2ljM1JoZEhWeklqb2lZV04wYVhabEluMTlMQ0pwYzNNaU9pSjBjbUZrWlY5c2IyZHBibDl6WlhKMmFXTmxJaXdpYzNWaUlqb2lRVUZCUVRVMU1qUTVPU0lzSW1WNGNDSTZNVGN6TVRFMU5UWTNPQ3dpYm1KbUlqb3hOek14TURZNU1qRTRMQ0pwWVhRaU9qRTNNekV3TmpreU1UZ3NJbXAwYVNJNkltVmpOVEk0WmpZNExUSmlNRFF0TkdVelpTMWhNR0ZqTFRKa016RmxNRFE1TXpSbFl5SXNJbFJ2YTJWdUlqb2lJbjAuYjMzOWU5UnZNYTRkajZLaC1KLWNtSFF5WUEzOXRtd3JZQThGODBJdTg4eU4xN1ZIN1YtWFpTUUUtbnV6dTFCeWlacWM5aEJIZW5aU1ltUThqVUl2Q1VhaXFHRGlIclRoek85NFNrcG1rRTFhOFptX09TSzhvVlc0eW9ja0RyYldoSlFoNnhYb1ZrRXh2bDBkRnV3b1plbVB2UnRoVjhKZ1pMbTJPOFZLbUJjIiwiQVBJLUtFWSI6Im9iblRzaU5XIiwiaWF0IjoxNzMxMDY5Mjc4LCJleHAiOjE3MzExNTU2Nzh9.jeKudh7R4_F47J8vJpBqJn8ns_FwMDaNhncuJ6kuT5XYfMHHEPfc94NgpypdHlvdUs-gvxFcufsNctaxBza-zw",
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-UserType": "USER",
    "X-SourceID": "WEB",
    "X-ClientLocalIP": "127.0.0.1",
    "X-ClientPublicIP": "103.120.255.113",
    "X-MACAddress": "10-FF-E0-45-80-7E",
    "X-PrivateKey": "obnTsiNW",
  },
};

// Send the GET request
axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.error("Error:", error.message);
  });
