var express    = require("express");
 var mysql      = require('mysql');
// var email   = require("emailjs/email");
 var connection = mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
   password : '',
   database : 'db_festive_lights'
 });

var bodyParser = require('body-parser');
 var app = express();

app.use(express.static('app'));
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', function (req, res) {
   res.sendFile("app/index.html" );
})

//select the username and password from login table
app.get('/login-card',  urlencodedParser,function (req, res)
{

  var username={"user_name":req.query.username};
    var password={"login_pwd":req.query.password};
    //console.log(username+'  '+password);
       connection.query('SELECT * from master_user where ? and ?',[username,password],
        function(err, rows)
        {
    if(!err)
    {
    if(rows.length>0)
    {
        console.log(rows);
      res.status(200).json({'returnval': rows });
    }
    else {
      {
          res.status(200).json({'returnval': 0 });
      }
    }
  }
    else
    {
      console.log(err);
      res.status(200).json({'returnval': 'invalid'});
    }

});
  });


/*get newly generated ID sequence*/
app.post('/getIDsequence',  urlencodedParser,function (req, res)
{
  console.log("getIDsequence");
       connection.query('SELECT * from master_id_generate',
        function(err, rows)
        {
    if(!err)
    {
    if(rows.length>0)
    {
        console.log(rows);
      res.status(200).json({'returnval': rows });
    }
    else {
      {
          res.status(200).json({'returnval': 0 });
      }
    }
  }
    else
    {
      console.log(err);
      res.status(200).json({'returnval': 'invalid'});
    }

});
  });

function setvalue(){
  console.log("calling setvalue.....");
}
var server = app.listen(8083, function () {
var host = server.address().address
var port = server.address().port
console.log("Example app listening at http://%s:%s", host, port)
});
