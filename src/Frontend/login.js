let accessToken = '';

async function multipleLogin(email, password) {
  const url = "http://127.0.0.1:3000/login";
  const loginDetails = {
    email: email,
    password: password
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginDetails)
    });

    const data = await response.json();
    console.log("Login", data);
    

    if (response.ok) {
      accessToken = data.token;
      console.log(`Login Successful for: ${email}`);
      console.log("Token:", accessToken);
    } else {
      console.log(`Login failed for: ${email}`);
      console.log(data.message || data);
    }

  } catch (error) {
    console.error(`Error during login for ${email}:`, error.message);
  }
}


async function testMultipleLogins() {
  await multipleLogin("admin@email.com", "password");
  await multipleLogin("admin2@email.com", "password123");
  await multipleLogin("admin5@email.com", "password789");
}

testMultipleLogins();
