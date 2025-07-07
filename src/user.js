

let token = ''

let loginCred = {
    email: "admin@email.com",
    password: "password"
}

let registerCred = {
    "email": "dave@email.com",
    "password": "password",
    "name": "Dave"
}

let posts = {
    "title": "Post 1",
    "content": "test content"
}


async function login() {
  const url = "http://127.0.0.1:3000/login";
  try {
    
    const response = await fetch(url, {
      method: "POST",
      headers: {"Content-Type" : "application/json"},
      body:JSON.stringify(loginCred)
    });
    if (response.ok) {
      console.log('Login Successfull');
      const data = await response.json();
      console.log(data);
      
    } 
    
  } catch (error) {
    console.log("Login in Failed:", response.status);
    const errorData = await response.json();
    console.error(errorData);
    console.error(error.message);
  }
}


async function register() {
  const url = "http://127.0.0.1:3000/register"
  try {
    const response = await fetch(url, {
      method:"POST",
      headers:{"Content-Type" : "application/json"},
      body:JSON.stringify(registerCred)
    });
     if (response.ok) {
      console.log('Registeration Successful');
      const data = await response.json();
      console.log(data);
      
    } 
    
  } catch (error) {
    console.log("Registration Failed:", response.status);
    const errorData = await response.json();
    console.error(errorData);
    console.error(error.message);
  }
  }
  

//create a post 
async function createPost() {
  const url = "http://127.0.0.1:3000/posts"
  
    const response = await fetch(url, {
      method: "POSt",
      headers:{"Authorization" : `Bearer ${token}`},
      body: JSON.stringify(posts)
    });
  
  const data = await response.json()
  console.log("Create a Post", data);
  
}  

async function post() {
  const url = "http://127.0.0.1:3000/posts?page=1"
  try {
    const response = await fetch(url, {
      headers:{"Authorization" : `Bearer ${token}`},
    });
     if (response.ok) {
      console.log('Post Fetch Successfull', data);
      return data
    } 
    
  } catch (error) {
    console.log("Failed to fetch posts");
    console.error(error.message);
  }
  }  



await login()
//await register()

//await createPost()