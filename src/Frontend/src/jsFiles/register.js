const form = document.getElementById('registerForm');
const message = document.getElementById('message');
const errorName = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('pswdError');
const confirmPswdError = document.getElementById('confirmPswdError');


function formValidate(name, email, password, confirmPswd) {
    errorName.textContent = '';
    emailError.textContent = '';
    passwordError.textContent = '';
    confirmPswdError.textContent = '';

    let valid = true;
    if (!name) {
        errorName.textContent = 'Name Required';
        valid = false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        emailError.textContent = 'Enter Valid Email';
        valid = false;
    }
    const testPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!testPassword.test(password)) {
        passwordError.textContent = 'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character';
        valid = false;
    }
    if (password !== confirmPswd) {
        confirmPswdError.textContent = 'Passwords do not match';
        valid = false;
    }
    return valid;
}

form.addEventListener('submit', async function (event) {
    event.preventDefault(); 

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPswd = document.getElementById('confirmPswd').value;

    const isValid = formValidate(name, email, password, confirmPswd);
    if (!isValid) {
        return;
    }

    const registerCred = { name, email, password };
    try {
        const response = await fetch("http://127.0.0.1:3000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(registerCred),
            credentials: 'include'
        });
        console.log("Response Status:", response.status);
        const responseData = await response.json(); 
        console.log("Response Data:", responseData);

        if (response.ok) {
            console.log("Registration Complete");
            message.textContent = "Registration Successful. Redirecting";
            
         
            window.location.href = "login.html"; 
        } else {
            message.textContent = responseData.message || responseData.error || "Registration Failed";
        }
    } catch (error) {
        console.error("Registration Failed:", error.message);
        message.textContent = "Registration Failed: " + error.message;
    }
});