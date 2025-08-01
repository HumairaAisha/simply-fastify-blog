let token = localStorage.getItem('jwtToken')


//refresh
async function refreshPage() {
   try {
      const refreshToken = localStorage.getItem("refreshToken")
      const response = await fetch("http://127.0.0.1:3000/refresh", {
         method:"POST",
         headers: {"Content-Type" : "application/json"
         },
         body: JSON.stringify({refreshToken}),
         credentials: "include"
      })
const data = await response.json()
if (response.ok) {
   localStorage.setItem('jwtToken', data.accessToken)
   return data.accessToken
} 

   } catch (error) {
      console.log("Refresh Failed", error);
      window.location.href = "login.html"
   
   }
}


//get post 
async function getPost(page = 1, limit = 10) {
   if (typeof page ==="object") {
      page = 1
   }
   let token = localStorage.getItem('jwtToken')
   let response;
   try{
      response = await fetch(`http://127.0.0.1:3000/posts?page=${page}&limit=${limit}`, {
      headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${token}`
      }
   });
   if (response.status === 401) {
      console.warn("Token Expired, Refresh page");
      token = await refreshPage();

      if (!token) {
         return
      }
   response = await fetch(`http://127.0.0.1:3000/posts?page=${page}&limit=${limit}`, {
      headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${token}`
      }
   });  
}  
   const data = await response.json()

   if (response.ok) {
      console.log("Fetched Posts:", data);
      fetchPost(data.data)
      
   }else {
         console.error("Failed to fetch posts:", data.message || data);
         alert("Unable to load posts");
}
   } catch(error) {
      console.log("Failed to load posts", error.message);
      
   }
}

//fect and display post
function fetchPost(posts) {
      const postList = document.getElementById('postList')
      postList.innerHTML = '';
      posts.forEach(post => {
         const itemPost = document.createElement('div')
         //console.log(post);
         
         itemPost.className = "bg-slate-300";
         itemPost.innerHTML = `<h3 class = "md:text-2xl font-bold text-teal-900 py-2 px-1.5">${post.title}</h3>
         <p class = "mt-2 px-1.5 text-teal-900 py-2">${post.content}</p>
        `;
         postList.appendChild(itemPost);
      });
   }

 window.onload = async () => {
      await getPost();
   }

//logout
async function logout() {
   
   const token = localStorage.getItem('jwtToken')
   let userId = localStorage.getItem('userId')
   try {
      const response = await fetch("http://127.0.0.1:3000/logout", {
         method:"POST",
         headers:{
            "Content-Type" : "application/json",
            Authorization: `Bearer ${token}`
         },
         body: JSON.stringify({userId: Number(userId)})
        
      });
      const data = await response.json()
      if (response.ok) {
         localStorage.removeItem('jwtToken');
         localStorage.removeItem('userId')
         window.location.href = 'login.html'
      } else{
          console.log("Logout Failed:", data);
      }
   } catch (error) {
      console.log("Logout Error", error.message);
      
   }
} 
