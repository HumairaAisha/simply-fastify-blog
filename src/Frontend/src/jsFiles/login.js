const form = document.getElementById('form')
const message = document.getElementById("message-response");

const errorEmail = document.getElementById('errorEmail');
const errorPswd = document.getElementById('errorPswd')

function validateLogin(email, password) {
      errorEmail.textContent = '';
      errorPswd.textContent = '';

      let valid = true;
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailPattern.test(email)) {
            errorEmail.textContent = 'Enter valid Email'
            valid = false;
      }
      
      const pswdPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
      if (!pswdPattern.test(password)) {
            //alert('Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character')
            errorPswd.textContent = 'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
            valid = false;
      }
      return valid

      
}

form.addEventListener('submit', async function (event) {
   event.preventDefault()
   const email = document.getElementById('email').value.trim()
   const password = document.getElementById('pswd').value

   const validLogin = validateLogin(email, password)
   if (!validLogin) {
      return
   }

   const loginDetails = {email, password}

   try{
      const response = await fetch("http://127.0.0.1:3000/login", {
         method: "POST",
         headers:{
            "Content-Type": "application/json"
         },
         body: JSON.stringify(loginDetails),
         credentials: 'include',
      });
      const data = await response.json()
         console.log("Login Successful");
         console.log(data);

         localStorage.setItem('jwtToken', data.accessToken)
         localStorage.setItem('refreshToken', data.refreshToken)
         
         const role = data.user?.role.toUpperCase();
         console.log("User Role", role);
         

         if (role === 'ADMIN') {
            message.textContent = "Login Successful. Redirecting to Admin..."
            window.location.href = 'admin.html'

         } else if (role === 'VIEWER') {
            message.textContent = "Login Successful, Redirecting.."
            window.location.href = 'dashboard.html'
         }
         else {
            message.textContent = "Invalid User"
            
         } 
         
     
   } catch(error) {
      console.log("Login Failed", error.message);
      message.textContent = "Login Failed"
   }
})