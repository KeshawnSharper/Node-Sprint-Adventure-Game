var express = require('express');
var app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json()) // To parse the incoming requests with JSON payloads
app.set('view engine', 'ejs')
var session = require('express-session')
var tableName = "Node-adventure-game-users"

app.use(session({
  secret : 'yourSecret',
  resave : false,
  saveUninitialized : true,
  cookie:{secure:false}
  ,
  }));
  const AWS = require("aws-sdk")
  const { AWS_ACCESS, AWS_SECRET,AWS_REGION_ID,GOOGLE_PASSWORD, EMAIL_BOT_PASSWORD } =
    process.env;
    AWS.config.update({
      accessKeyId: AWS_ACCESS,
      secretAccessKey: AWS_SECRET,
      region: "us-east-2"
  })
  const dynamoDB = new AWS.DynamoDB.DocumentClient()
  let scanDB = async (table,filterID,filterProp) => {
    let items = await dynamoDB.scan({TableName: table}).promise()
    items = items["Items"]
    if (filterID !== null){
      items = items.filter(item => item[`${filterProp}`] === filterID)
    }
    return items
  
  }
  let putDB = async (table,item) => {
    await dynamoDB.put({TableName: table,Item:item}).promise()
  }
app.get('/', function(req, res) {
  res.render('pages/signup',{error:""});
  });
app.post('/login', async function(req, res) {
  let error = ""
  let filterUsers = await scanDB(tableName,req.body.username,"username")
  if (filterUsers.length === 0){
    error = "User doesn't exists"
    res.render('pages/login',{error:error});
  }
  else if (filterUsers[0].password !== req.body.password){
    error = "Invalid Credentials"
    res.render('pages/login',{error:error});
  }
  else{
    console.log(req.session)
    req.session.logged = true
    res.render('pages/index',{name:req.body.username});
  }
});
app.post('/signup', async function(req, res) {
  let filterUsers = await scanDB(tableName,req.body.username,"username")
  let users = await scanDB(tableName)
  console.log("users",users)
  let error = ""
  console.log(req.session)
  if (filterUsers.length >= 1){
    error = "User doesn't exists"
    res.render('pages/login',{error:error});
  }
  else{
    console.log(req.session)
    req.session.logged = true 
    req.body.id = users.length.toString()
    putDB(tableName,req.body)
    res.render('pages/index',{name:req.body.username});
  }
})
app.get('/:name', function(req, res) {
res.render('pages/index',{name:req.params.name});
});
app.get('/auth/login', function(req, res) {

  res.render('pages/login',{error:""});
  });
app.get('/Location/:location', function(req, res) {
  if(req.session.logged){
res.render('pages/location',{location:req.params.location,name:req.query.name})
  }
  else{
    res.render('pages/login',{error:"Please Log In First"});
  }
});
app.get('/Area/:area', function(req, res) {
  if(req.session.logged){
    res.render('pages/area',{area:req.params.area,name:req.query.name});
  }
    else{
      res.render('pages/login',{error:"Please Log In First"});
    }
    });
  app.listen(process.env.PORT || 8080);
console.log('Server is listening on port 8080');