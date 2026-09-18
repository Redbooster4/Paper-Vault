const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('http://localhost:5000/auth/register', {
      username: "test",
      email: "test@test.com",
      password: "password123",
      role: "admin"
    });
    console.log("Register:", res.data);

    const res2 = await axios.post('http://localhost:5000/auth/login', {
      email: "test@test.com",
      password: "password123"
    });
    console.log("Login:", res2.data);
  } catch (err) {
    console.error("Error:", err.response ? err.response.data : err.message);
  }
}
test();
