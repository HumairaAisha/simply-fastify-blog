const { log } = require("console")

const form = document.getElementById('registerForm')
const buttonRegister = document.getElementById('registerbtn')
const message = document.getElementById('message')

buttonRegister.addEventListener('submit', async function (event) {
    event.preventDefault()
   const name = document.getElementById('name').value 
   const email = document.getElementById('email').value 
   const password = document.getElementById('password').value 
   const confirmPswd = document.getElementById('confirmpswd').value 

   const registerCred = {name, email, password, confirmPswd}
   try{
      const response = await fetch ("http://127.0.0.1:3000/register", {
         method:"POST",
         headers:{"Content-Type" : "application/json",
          Authorization: `Bearer ${token}`
         },
         body: JSON.stringify(registerCred)
      });
      const data = await response.json()
      console.log(data);

}
   catch{

   }
});
