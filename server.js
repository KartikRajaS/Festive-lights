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
        //console.log(rows);
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
       connection.query('SELECT * from master_id_generate',
        function(err, rows)
        {
    if(!err)
    {
    if(rows.length>0)
    {
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

/*Add new supplier details*/
app.post('/FnsupplierAdd',  urlencodedParser,function (req, res)
{
      var flag=req.query.fflag;
      if(flag=='1'){
           var sql="insert into master_supplier (supplier_id,supplier_name,supplier_brand,supplier_mobile,supplier_mail,supplier_street,supplier_locality,supplier_city,supplier_pincode,supplier_status,added_by,added_date) values ('"+req.query.fnewid+"','"+req.query.fname+"','"+req.query.fbrand+"','"+req.query.fmobno+"','"+req.query.femail+"','"+req.query.fstreet+"','"+req.query.flocality+"','"+req.query.fcity+"','"+req.query.fpin+"','1','"+req.query.faddedby+"','"+req.query.faddedon+"')";
         
      }else if(flag=='0'){
          var sql="UPDATE `master_supplier` SET `supplier_name` = '"+req.query.fname+"', `supplier_brand` = '"+req.query.fbrand+"', `supplier_mobile` = '"+req.query.fmobno+"', `supplier_mail` = '"+req.query.femail+"', `supplier_street` = '"+req.query.fstreet+"', `supplier_locality` = '"+req.query.flocality+"', `supplier_city` = '"+req.query.fcity+"', `supplier_pincode` = '"+req.query.fpin+"', `added_by` = '"+req.query.faddedby+"', `added_date`='"+req.query.faddedon+"' WHERE `master_supplier`.`supplier_id` = '"+req.query.foldid+"' ";
      }else if(flag=='3'){
          var sql="delete from master_supplier where supplier_id='"+req.query.foldid+"' or supplier_mobile='"+req.query.fmobno+"'";
      }

       connection.query(sql,
        function(err, rows)
        {
    if(!err)
    {
      res.status(200).json({'returnval': flag});
    }
    else
    {
      console.log(err);
      res.status(200).json({'returnval': 'invalid'});
    }

});
  });


/*search the already existing supplier details*/
app.post('/Fnsearchsupplier',  urlencodedParser,function (req, res)
{
      var supplierid={"supplier_id":req.query.foldid};
       connection.query('SELECT * from master_supplier where supplier_status="1" and ?',[supplierid],
        function(err, rows)
        {
    if(!err)
    {
    if(rows.length>0)
    {
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


app.post('/Fnnewseqno',  urlencodedParser,function (req, res)
{
       connection.query("update master_id_generate set "+req.query.fcolumn+"='"+req.query.fnewseqno+"' ",
        function(err, rows)
        {
    if(!err)
    {
    
      res.status(200).json({'returnval': 'success' });
    
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
