// this did not work out how it was suppose to  -- 
//I could not get modal to work with logic of JQUERY as I could/did not understand it 
// I spent way too long looking at it.. with no success :(



//we keep track of the user it is either null or has a name
// we initialise to null

let username = null;
let postId= null;

 const getJournals=()=>{
   $.get('/api/msg',(comments)=>{
     if(comments.length>0){
       comments.forEach(element => {
         appendJournal(element)
         console.log(comments)
       });
      
       }
     }
   )}
 

const commentPost=(element)=>{
  let test=$(element)
  postId=test.attr('value')
 
}
const newJournal=()=>{
  let text= $('#journalText').val()
  if (username==null) {
    username = 'Guest'
    console.log('guest')
  } 
  console.log(username)
  let data={
    text:text,
    author:username
  }
  $.ajax({
    url: '/api/msg',
    contentType: 'application/json',
    data: JSON.stringify(data), // access in body
    type: 'POST',
    success: function(result) {
        console.log(result)
    }
});
}



const submitPost=()=>{
  let text= $('#commentText').val()
  if (username==null) {
    username = 'Guest'
    console.log('guest')
  } 
console.log(username)
  let data={
    _id:postId,
    text:text,
    author:username
  }
  console.log(data)

  $.ajax({
    url: '/api/msg',
    contentType: 'application/json',
    data: JSON.stringify(data), // access in body
    type: 'PUT',
    success: function(result) {
        console.log(result)
    }
});

}

const login = () => {
  let user = $('#username').val()
  if (user.length <= 0) {
    username = 'Guest'
    console.log('guest')
  } else {
    username = user
  }
  $('#buttonLogin').hide()

  $('#user').html(username)

}
// not sure how to use the modal/JQUERY all togther :?
$(document).ready(function(){
  $("#modalJournal").click(function(){
      let message = $("#journalText").val();
      $('#msg').append(message + "</br>") 
      
      
  })
})


$(document).ready(function () {

  console.log('Ready')

  setInterval(()=>{
    getJournals()
  },5000)


    



  $('.modal').modal();
  getJournals()

})
