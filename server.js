require("dotenv").config()

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const url = process.env.URL;
const dbName = "test";
const morgan = require('morgan');
const port = process.env.PORT || 1995;
const deleteID=require("mongodb").ObjectID
let db;

app.use(cors());
app.use(morgan('tiny'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

MongoClient.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    function(err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        
        db = client.db(dbName);
    }
    );
    
    app.get("/", (req, res) => res.send(`hello world!`));
    //getall
    app.get("/test",(req,res)=>{
        db.collection("todo").find({}).toArray((err,items)=>{
            res.status(200).send(items);
        })
    })
    app.put("/test/:id",(req,res)=>{
        db.collection("todo").updateOne({_id:deleteID(req.params.id)},{$set:{name:req.body.name,age:req.body.age}},(err,items)=>{
            res.status(200).send(items);
        })
    })
    //post
    app.post("/test", (req, res) => {
        db.collection("todo").insertOne(
            {
                name: req.body.name,
                age: req.body.age,
                role: req.body.role
            },
            (err, result) => {
                try{
                    res.send (result)
                }catch(error){
                    console.log(error);
                    console.log(err);
                }
            }
  );
});
//deleteOne
app.delete("/:id", (req, res) => {
    db.collection("todo").deleteOne(
      {
        "_id":deleteID(req.params.id),
      },
      (err, result) => {
          try{
              res.send (result)
          }catch(error){
        console.log(error);
        console.log(err);
       }
      }
    );
  });
  


app.listen(port, () => console.log(`example app listening on port ${port}!`));