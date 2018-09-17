var users=[];
var posts=[];
var comments=[];
var usersLen=0;
var postsLen=0;
var commentsLen=0;
var hdiv="";

function getData()
{
    function loadDoc(url, cFunction){
        var xhttp;
        xhttp=new XMLHttpRequest();
        xhttp.onreadystatechange=function(){
            if(this.readyState==4 && this.status==200)
            {
                cFunction(this);
            }
        };
        xhttp.open("GET", url, false);
        xhttp.send();
    }
    function getUsersData(xhttp) {
        usr=xhttp.responseText;
        localStorage.user = usr;
        users=JSON.parse(localStorage.user);
        usersLen=users.length;
    }
    
    function getCommentsData(xhttp) {
        cmnt=xhttp.responseText;
        localStorage.comment = cmnt;
        comments=JSON.parse(localStorage.comment);
        commentsLen=comments.length;
    }
    
    function getPostsData(xhttp) {
        pst=xhttp.responseText;
        localStorage.post = pst;
        posts=JSON.parse(localStorage.post);
        postsLen=posts.length;
    }
      
    loadDoc('https://jsonplaceholder.typicode.com/users', getUsersData);
    loadDoc('https://jsonplaceholder.typicode.com/comments', getCommentsData);
    loadDoc('https://jsonplaceholder.typicode.com/posts', getPostsData);
    
}

function editPostFn(i){
    var uid=document.getElementById('usrid').value;
    var p_id=document.getElementById('post_id').value;
    var p_title=document.getElementById('post_title').value;
    var p_body=document.getElementById('post_body').value;
    posts[i].userId=parseInt(uid);
    posts[i].id=parseInt(p_id);
    posts[i].title=p_title;
    posts[i].body=p_body;
    localStorage.setItem('post', JSON.stringify(posts));
    if(!document.getElementById(`ep_${i}`).getAttribute('style'))
    {
        console.log("error in edit post fn");
    }
    else{
        document.getElementById(`ep_${i}`).remove();
        disp();
    }
}

function editPost(i)
{
    html_btn4=`<div style='border:1px solid green;padding:10px;' id='ep_${i}'>
    <h5>Edit Post</h5>
    UserId:<input id='usrid' type='text' placeholder='Enter post author Id'/><br/>
    PostID:<input id='post_id' type='text' placeholder='Enter Post Id'/><br/>
    Post Title:<input id='post_title' type='text' placeholder='Enter Post Title'/><br/>
    Post:<input id='post_body' type='text' placeholder='Enter Post'/><br/>
    <button onClick='editPostFn(${i})'>Submit</button>
    </div>
    `;
    document.getElementById(`div_${i}`).insertAdjacentHTML("afterbegin",html_btn4);  
}



function disp(){
    for (let i = postsLen - 1; i >= 0; i--) {
        hdiv = `<div style='border:3px solid black; padding:10px' class='post' id='div_${i}'></div>`;
        document.getElementById("mainDiv").insertAdjacentHTML("afterend", hdiv);
        for (let j = 0; j < usersLen; j++) {
            if (posts[i].userId == users[j].id) {
              html_h3 = "<h3 id='h3_${i}'>" + users[j].name + "</h3>";
              document.getElementById(`div_${i}`).insertAdjacentHTML("afterbegin", html_h3);
            }
          }
          html_p1 = "<p id='p_${i}'>" + posts[i].title + "</p>";
          document.getElementById(`div_${i}`).insertAdjacentHTML("beforeend", html_p1);
          html_p2 = "<p id='pd_${i}'>" + posts[i].body + "</p>";
          document.getElementById(`div_${i}`).insertAdjacentHTML("beforeend", html_p2);
          html_btn1 = `<button id='btnvw_${i}' onClick='viewCmnt(${i})'>View Comments</button>`;
          document.getElementById(`div_${i}`).insertAdjacentHTML("beforeend", html_btn1);
          html_btn2 = `<button id='btnrm_${i}' onClick='rmvCmnt(${i})'>Remove</button>`;
          document.getElementById(`div_${i}`).insertAdjacentHTML("beforeend", html_btn2);
          html_btn4 = `<button id='btnep_${i}' onClick='editPost(${i})'>Edit Post</button>`;
          document.getElementById(`div_${i}`).insertAdjacentHTML("beforeend", html_btn4);
      }
      document.getElementById('cp').addEventListener("click", function(){
          if(document.getElementById(`divcp`))
          {
              console.log("error in create post");
          }
          else{
            html_btn5=`<div id='divcp' style='border:1px solid purple; padding:10px;'><h5>Create Post</h5>UserId:<input id='usrid' type='number' placeholder='Enter post author Id'/><br/>
            Post Title:<input id='post_title' type='text' placeholder='Enter Post Title'/><br/>
            Post:<input id='post_body' type='text' placeholder='Enter Post'/><br/>
            <button onClick='createPost()'>Submit</button><br/>
            </div>
            `;
            document.getElementById("mainDiv").insertAdjacentHTML("afterend", html_btn5);
          }
    });
}

function createCmntFn(id)
{
    var cmntttl=document.getElementById('ttl').value;
    var cmntbody=document.getElementById('cmntbdy').value;
    var newcmnt={
        'postId':id+1,
        'id':commentsLen,
        'name':cmntttl,
        'email':"",
        'body':cmntbody
    };
    comments.push(newcmnt);
    localStorage.setItem('comment', JSON.stringify(comments));
    commentsLen++;
    viewCmnt(id);
    if(document.getElementById(`btnnc_${id}`)){
        document.getElementById(`btnnc_${id}`).disabled=false;
        document.getElementById(`divnc_${id}`).remove();
    }
    
}

function createCmnt(pstid)
{
    var htmlnc=`<div id='divnc_${pstid}'><br/><b>&nbsp &nbsp Comment Title:</b><input type='text' id='ttl' placeholder='Enter comment title here'/><br/><b>Comment:</b><textarea id= 'cmntbdy' rows='5' cols='50' placeholder='Enter comment here'></textarea><br/><button onClick="createCmntFn(${pstid})">Submit</button></div>`
    document.getElementById(`divcm_${pstid}`).insertAdjacentHTML("afterbegin",htmlnc); 
    document.getElementById(`btnnc_${pstid}`).disabled=true;
}

function del(k)
{
    if(!document.getElementById(`cmnt_${k+1}`).getAttribute('style')){
        console.log("error");
    }
    else{
        document.getElementById(`cmnt_${k+1}`).remove();
        comments.splice(k,1);
        localStorage.setItem('comment', JSON.stringify(comments));
    }
}

function viewCmnt(btnid){
    if(!document.getElementById(`divcm_${btnid}`))
    {
        
        var htmldiv = "";
        htmldiv += `<div style='border:1px solid red;padding:10px;' id='divcm_${btnid}'><button id='btnnc_${btnid}' onClick='createCmnt(${btnid})'>Add Comment</button></div>`;
        document.getElementById(`div_${btnid}`).insertAdjacentHTML("beforeend", htmldiv);
        for (let k = 0; k < commentsLen; k++) {
        if (posts[btnid].id == comments[k].postId) {
            var html = "";
            html += `<p id='cmnt_${k+1}' style='border:1px solid blue;'><b>Comment Id:</b>` + comments[k].id + `<br/><b>Comment Title:</b>` + comments[k].name + `<br/><b>Comment:</b>` + comments[k].body + `<br/><button id="delCmnt" onClick='del(${k})'>Delete</button><br/></p>`;
            document.getElementById(`divcm_${btnid}`).insertAdjacentHTML("beforeend", html);
			}

        }
    }
    
    else{
        document.getElementById(`divcm_${btnid}`).remove();
    }
}

function rmvCmnt(pid){
    document.getElementById(`div_${pid}`).remove();
    posts.splice(pid,1);
    localStorage.setItem('post', JSON.stringify(posts));
}

function createPost(){
    var uId=parseInt(document.getElementById('usrid').value);
    var pId=postsLen+1;
    var pTitle=document.getElementById('post_title').value;
    var postContent=document.getElementById('post_body').value;
    var pstData={
        'userId':uId,
        'id':pId,
        'title':pTitle,
        'body':postContent
    };
    posts.push(pstData);
    postsLen++;
    localStorage.setItem('post' , JSON.stringify(posts));
    document.getElementById('divcp').remove();
    disp();
}

function mainFn(){
    getData();
    disp();
  }
  
  mainFn();