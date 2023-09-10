import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

// Make a request to get cookies
const { config } = await client.get('https://httpbin.org/cookies/set/session/userid');

// Extract cookies from the config
const cookiesArray = config.jar.toJSON().cookies;

// Convert cookies array to a formatted string (for setting in the request headers)
const cookiesString = cookiesArray.map(cookie => `${cookie.key}=${cookie.value}`).join('; ');

// Make another request and use the cookies in the request headers
const response = await client.get('https://example.com/protected-resource', {
  headers: {
    Cookie: cookiesString, // Set the cookies in the request headers
  },
});

// Handle the response
console.log(response.data);
