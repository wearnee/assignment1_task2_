
//we keep track of the user it is either null or has a name
// we initialise to null

let username = null;
let postId= null;

const getJournals=()=>{
  $.get('/api/journal',(journals)=>{
    if(journals.length>0){
      $('#journal').empty()
      journals.forEach(journal=>{
        appendJournal(journal)
      })
    }
  })
}


const commentPost=(element)=>{
  let test=$(element)
  postId=test.attr('value')
  //console.log(element.val())
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
    url: '/api/journal',
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
    url: '/api/journal',
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


//handle journal
const appendJournal = (journal) => {
 // this iterates through all the comments and creates an object containing all of the comments
  let jComments=$("<div class='col container'><div>");
  journal.comments.forEach((comment)=>{
    let thisComment="<div class='col s12 comment'><i class='material-icons left' style='color:white font-size: larger;'>chat_bubble_outline</i>"+comment.text+" by <b>"+comment.author+"</b></div>"
    jComments.append(thisComment)
  })
  let temp=jComments.html()
  let jString ="<div class='col s12 journalBox'>\
    <div class='col s8'>"+journal.author+"</div><div class='col s4'>"+journal.date+"</div>\
    <div class='col s12 journalText'>"+journal.text+"</div>\
    <div class='col s12 commentsContainer row'>"+temp+"</div>\
    <div class='col s12 center'><a id='buttonComment' \
    onclick=commentPost(this) value="+journal._id+" class='waves-effect waves-light btn modal-trigger' href='#modalComments'>Comment</a><div>\
  </div>";
  

  let jEntry = $(jString)
  //jEntry.append('Sto cazzo')

  $('#journal').append(jEntry)

}


$(document).ready(function () {

  console.log('Ready')

  setInterval(()=>{
    getJournals()
  },5000)
  //test get call
  $.get('/test?user_name="Fantastic User"', (result) => {
    console.log(result)
  })
  // initialise the tabs
  $('.tabs').tabs();

  //initialise the map 
  var map = L.map('worldMap').setView([-37.7, 145], 10);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  L.marker([-37.5, 144.7]).addTo(map)
    .bindPopup('Bogan Castle')
  L.marker([-37.8, 145.1]).addTo(map)
    .bindPopup('VB Fortress')

    



  $('.modal').modal();
  getJournals()

})
