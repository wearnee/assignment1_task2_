const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const e = require('express');

express = require("express"),
    app = express();

var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));

// need to add the body parser so that we can extract the body data 
app.use(bodyParser.json());


app.get("/test", function (request, response) {
  var user_name = request.query.user_name;
  response.end("Hello " + user_name + "!");
});

// logic to insert data
app.post('/api/msg',(req,res)=>{
  console.log('body',req.body)
  let journal=req.body;
  insertJournal(journal,res)
})

//logic to get data
app.get('/api/msg',(req,res)=>{
  getJournals(res)

})


//logic to udpate data
app.put('/api/msg',(req,res)=>{
  console.log('body',req.body)
  let comment =req.body;
  updateJournal(comment,res)

})


app.listen(port);
console.log("Listening on port ", port);

require("cf-deployment-tracker-client").track();

const uri = "mongodb+srv://SIT775software:sit775@sit775.hd36d.mongodb.net/messageboard?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

//Comment Collection handler
let journalCollection;
const openConnection =(message)=>{
  client.connect((err,db) => {
  journalCollection = client.db("messageboard").collection("messages");
  if(!err){
  console.log('connected to db; all systems go')
  }
})
}

// insert journal into the db
// takes a journal entry, add date to it and pushes into the collection
const insertJournal=(journal,res)=>{
  // append date to journal object
  let date=new Date();
  journal.date=date.getTime(); 
  journal.comments=[];
  // insert into collection
  journalCollection.insert(journal,(err,result)=>{
    console.log('Journal Inserted',result)
    res.send({result:200})
  }) 
}


// retrieve all journals
 const getJournals=(res)=>{
   journalCollection.find().toArray(function(err, result) {
     console.log("working")
     if (err) throw err;
          res.send(result)
   })
 }



// retrieves all journals from the database 

// update journals
// takes a journal id and a comment entry, add the date to the comment entry nd the updates the journal
const updateJournal=(comment,res)=>{
  // we need the ID but we don't need to upload it, so i'll store it locally
  let id=comment._id;
  //now i will remove the id from the object
  delete comment._id
  //and now we add a server side timestamp
  let date=new Date();
  comment.date=date.getTime(); 
  console.log(id)
  // to update we are going to use the addToSet property of mongoDB, warning, if you add the same item, it will not work 
  journalCollection.updateOne(
    { _id:ObjectID(id) },
    { $addToSet: { comments: comment  } },(err,result)=>{
      if(err){
        console.log(err)
        res.send({result:'Failed Update'})
      }else{
        console.log('Comment added')
        res.send({result:200})
      }
    }
 )

  }


openConnection()

