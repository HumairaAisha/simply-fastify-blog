// create post 
let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBlbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NTE1NTg2OTMsImV4cCI6MTc1MTU1OTU5M30.aw6Xnp9iQDWxd_uEpQO0IIp35HD1HTxidJ22i2U3C-Q';
let postCreate = {
    "title": "Post 1",
    "content": "test content"
}

async function posts() {
   //let token = localStorage.getItem("authToken")
   const response = await fetch("http://127.0.0.1:3000/posts", {
      method:"POST",
      headers: {
         "Content-Type" : "application/json",
          Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(postCreate)
   });
   const data = await response.json()
   console.log("Post created", data)

}

await posts()
console.log('post retrieved');
