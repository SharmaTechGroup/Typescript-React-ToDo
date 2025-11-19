const express = require("express");
const cors = require("cors");
const mongoClient = require("mongodb").MongoClient;

const conString = "mongodb://localhost:27017";

const app = express();
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.get('/users', (req, res)=>{
      mongoClient.connect(conString).then(clientObj=>{
            var database = clientObj.db("to-do");
            database.collection("users").find().toArray().then(documents=>{
                 res.send(documents);
                 res.end();
            })
      })
})

app.get('/get-appointments/:user_id', (req, res)=>{
      mongoClient.connect(conString).then(clientObj=>{
            var database = clientObj.db("to-do");
            database.collection("appointments").find({user_id:req.params.user_id}).toArray().then(documents=>{
                 res.send(documents);
                 res.end();
            })
      })
})

app.get('/get-appointment/:id', (req, res)=>{
      mongoClient.connect(conString).then(clientObj=>{
            var database = clientObj.db("to-do");
            database.collection("appointments").findOne({appointment_id:parseInt(req.params.id)}).then(document=>{
                  res.send(document);
                  res.end();
            })
      })
})

app.post('/register-user', (req, res)=>{
      var user = {
            user_id: req.body.user_id, 
            user_name: req.body.user_name,
            password: req.body.password
      };
      mongoClient.connect(conString).then(clientObj=>{
            var database = clientObj.db("to-do");
            database.collection("users").insertOne(user).then(()=>{
                  console.log('user added');
                  res.end();
            })
      })
})


app.post('/add-appointment', (req, res)=>{
      var appointment = {
            appointment_id: parseInt(req.body.appointment_id),
            title: req.body.title,
            description: req.body.description,
            date: new Date(req.body.date),
            user_id: req.body.user_id
      }
      mongoClient.connect(conString).then(clientObj=>{
            var database = clientObj.db("to-do");
            database.collection("appointments").insertOne(appointment).then(()=>{
                  console.log('appointment added');
                  res.end();
            })
      })
})

app.put('/edit-appointment/:id', (req, res)=>{
      var id = parseInt(req.params.id);
      var appointment = {
            appointment_id: parseInt(req.body.appointment_id),
            title: req.body.title,
            description: req.body.description,
            date: new Date(req.body.date),
            user_id: req.body.user_id
      }
      mongoClient.connect(conString).then(clientObj=>{
            var database = clientObj.db("to-do");
            database.collection("appointments").updateOne({appointment_id:id},{$set:appointment}).then(()=>{
                  console.log('appointment updated');
                  res.end();
            })
      })
})

app.delete('/delete-appointment/:id', (req, res)=>{

      mongoClient.connect(conString).then(clientObj=>{
            var database = clientObj.db("to-do");
            database.collection("appointments").deleteOne({appointment_id:parseInt(req.params.id)}).then(()=>{
                  console.log('appointment deleted..');
                  res.end();
            })
      })
})

app.listen(4400);
console.log('server started');