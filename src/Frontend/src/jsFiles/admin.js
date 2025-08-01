//form pop-up
function openForm() {
   const btnSubmit = document.getElementById('btnSubmit')
   btnSubmit.textContent = postEditing ? "Update Post" : "Create Post"
   document.getElementById('postForm').classList.remove('hidden')
}
function closeForm() {
   document.getElementById('postForm').classList.add('hidden')
   postEditing = false;
   editPostId = null
   document.getElementById('btnSubmit').textContent = "Create Post";
}

//change button dynamically 


const post = []
let postEditing = false
let editPostId = null

let token = localStorage.getItem('jwtToken')


const postInput = document.getElementById('postTitle');
const postContent = document.getElementById('postContent')
const allPost = document.getElementById('postList')
const message = document.getElementById('errorMsg')

//refresh token
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

document.getElementById('postForm').addEventListener('submit', async function (event) {
   event.preventDefault();
   const title = postInput.value.trim()
   const content = postContent.value.trim()

   if (!title || !content) {
      alert('Please fill both Title and Content Field')
      return
   }
   
   const postCreate = {title, content}
   const token = localStorage.getItem('jwtToken')
   const url = postEditing ? `http://127.0.0.1:3000/posts/${editPostId}` : `http://127.0.0.1:3000/posts`
   const method = postEditing ? "PUT" : "POST"
   try{
      const response = await fetch (url, {
         method,
         headers:{ 
             "Content-Type": "application/json",
             Authorization: `Bearer ${token}`
         },
         body: JSON.stringify(postCreate)
      });
      const data = await response.json()
      await getPost()
      
      if (response.ok) {
         alert(postEditing ? "Post Updated Successfully" : "Post created successfully")
         //console.log("Post created Successfully", data);
         postInput.value = '';
         postContent.value = '';
         postEditing = false
         editPostId = null
         closeForm()
         await getPost()
         
      } else{
         console.log('Post Creation Failed', data);
         
      }
   }
   catch(error){
      console.log("Error", error.message);
      alert('Post Failed to create')
      
      
   }

});

//get posts
 
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

 
/* function fetchPost(postList) {
   allPost.innerHTML = ''
   postList.forEach((post) => {
      const row = document.createElement('tr');
      row.className = "bg-slate-300"
      row.innerHTML = `<td class="border p-2">${post.title}</td>
      <td class="border p-2" >${post.content}</td>`
      allPost.appendChild(row)
   })
} */

   function fetchPost(posts) {
      const postList = document.getElementById('postList')
      postList.innerHTML = '';
      posts.forEach(post => {
         const itemPost = document.createElement('div')
         //console.log(post);
         
         itemPost.className = "bg-slate-300";
         itemPost.innerHTML = `<h3 class = "md:text-2xl font-bold px-2 py-2 text-teal-900">${post.title}</h3>
         <p class = "mt-2 px-2 text-teal-900">${post.content}</p>
         <div class = "flex gap-4 p-1.5 m-2">
         <button onclick="editPost('${post.id}', \`${post.title}\`, \`${post.content}\`)" class = "bg-teal-900 text-white rounded px-4 py-2 m-3 cursor-pointer">Edit</button>
         <button onclick="deletePost('${post.id}')" class = "bg-red-800 text-white rounded px-4 py-2 m-3 cursor-pointer">Delete</button>
         </div>`;
         postList.appendChild(itemPost);
      });
   }


//edit post
function editPost(id, title, content) {
   postEditing = true;
   editPostId = id;
   //console.log(id, title, content);
   
   postInput.value = title;
   postContent.value = content;
   openForm();
}

//delete post
async function deletePost(id) {
   const token = localStorage.getItem("jwtToken")
   try {
      const response = await fetch(`http://127.0.0.1:3000/posts/${id}`, {
         method: "DELETE",
         headers: {Authorization:`Bearer ${token}`
         }
      });
      const data = await response.json()
      if (response.ok) {
         alert("Post Deleted")
         await getPost()

      } else{
         alert("Delete Failed: ", data.message)
      }
   } catch (error) {
      console.log("Error", error.message);
      
   }
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