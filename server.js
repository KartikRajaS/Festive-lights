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
          var sql="UPDATE `master_supplier` SET `supplier_status`='3' where supplier_id='"+req.query.foldid+"' or supplier_mobile='"+req.query.fmobno+"'";
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


/*search the already existing item details*/
app.post('/Fnsearchitem',  urlencodedParser,function (req, res)
{
      var itemid={"item_id":req.query.foldid};
       connection.query('SELECT * from master_items where item_status="1" and ?',[itemid],
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


/*update the incremented sequence number*/
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


/*add or update item in master table*/
app.post('/Fnnewitem',  urlencodedParser,function (req, res)
{
      var flag=req.query.fflag;
      console.log(flag);
      if(flag=='1'){
           var sql="insert into master_items (item_id,item_mft_prodcode,item_name,item_description,item_slashed_price,item_discount,item_sale_price,item_brandname,item_supplierid,item_total_stock,item_current_stock,item_status,added_date,added_by) values ('"+req.query.fnewid+"','"+req.query.fprodcode+"','"+req.query.fname+"','"+req.query.fdescrip+"','"+req.query.fslashedprice+"','"+req.query.fdiscount+"','"+req.query.fsellingprice+"','"+req.query.fbrandname+"','"+req.query.fsupplier+"','"+req.query.ftotalstock+"','"+req.query.fcurrentstock+"','1','"+req.query.faddedon+"','"+req.query.faddedby+"')";
         
      }else if(flag=='0'){
        var sql="UPDATE `master_items` SET `item_mft_prodcode` = '"+req.query.fprodcode+"', `item_name` = '"+req.query.fname+"', `item_description` = '"+req.query.fdescrip+"', `item_slashed_price` = '"+req.query.fslashedprice+"', `item_discount` = '"+req.query.fdiscount+"', `item_sale_price` = '"+req.query.fsellingprice+"', `item_brandname` = '"+req.query.fbrandname+"', `item_status` = '1', `item_supplierid`='"+req.query.fsupplier+"', `item_total_stock`='"+req.query.ftotalstock+"', `item_current_stock`='"+req.query.fcurrentstock+"' ,`added_date`='"+req.query.faddedon+"', `added_by`='"+req.query.faddedby+"' WHERE `master_items`.`item_id` = '"+req.query.foldid+"' ";
        
      }else if(flag=='3'){
          var sql="UPDATE `master_items` SET `item_status`='3' where item_id='"+req.query.foldid+"' or item_mft_prodcode='"+req.query.fprodcode+"'";
      }
console.log(sql);
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


/*add or update user in master table*/
app.post('/Fnnewuser',  urlencodedParser,function (req, res)
{
      var flag=req.query.fflagg;
      console.log(flag);
      if(flag=='1'){

           var sql="insert into master_user (user_id,user_name,mobile_no,email_id,login_pwd,active_status,added_date,added_by) values ('"+req.query.fnewid+"','"+req.query.funame+"','"+req.query.fumobno+"','"+req.query.fuemail+"','"+req.query.fpwd+"','1','"+req.query.faddedon+"','"+req.query.faddedby+"')";
         
      }else if(flag=='0'){
        var sql="UPDATE `master_user` SET `user_name` = '"+req.query.funame+"', `mobile_no` = '"+req.query.fumobno+"', `email_id` = '"+req.query.fuemail+"', `login_pwd` = '"+req.query.fpwd+"', `active_status` = '1',`added_date`='"+req.query.faddedon+"', `added_by`='"+req.query.faddedby+"' WHERE `master_user`.`user_id` = '"+req.query.foldid+"' ";
        
      }else if(flag=='3'){
          var sql="UPDATE `master_user` SET `active_status`='3' where user_id='"+req.query.foldid+"' or mobile_no='"+req.query.fumobno+"'";
      }
console.log(sql);
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

/*search the already existing user details*/
app.post('/Fnsearchuser',  urlencodedParser,function (req, res)
{
      var userid={"user_id":req.query.foldid};
       connection.query('SELECT * from master_user where active_status="1" and ?',[userid],
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


/*Get list of all items*/
app.post('/Fngetitemlist',  urlencodedParser,function (req, res)
{
       connection.query('SELECT * from master_items where item_status="1"',
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


/*add or update location in master table*/
app.post('/Fnlocacate',  urlencodedParser,function (req, res)
{
      var flag=req.query.fflagg;
      var type=req.query.ftype;
      console.log(flag+'   '+type);
      if(flag=='1'){
              if(type=='location'){
                 var sql="insert into master_location (location_id,location_name,location_status,added_on,added_by) values ('"+req.query.fnewid+"','"+req.query.fname+"','1','"+req.query.faddedon+"','"+req.query.faddedby+"')";     
              }else if(type=='category'){
                   var sql="insert into category_details (category_id,category_name,category_status,added_on,added_by) values ('"+req.query.fnewid+"','"+req.query.fname+"','1','"+req.query.faddedon+"','"+req.query.faddedby+"')";     
              }
           

         
      }else if(flag=='0'){
        if(type=='location'){
        var sql="UPDATE `master_location` SET `location_name` = '"+req.query.fname+"', `location_status` = '1',`added_on`='"+req.query.faddedon+"', `added_by`='"+req.query.faddedby+"' WHERE `master_location`.`location_id` = '"+req.query.foldid+"' ";
        }else if(type=='location'){
        var sql="UPDATE `category_details` SET `category_name` = '"+req.query.fname+"', `category_status` = '1',`added_on`='"+req.query.faddedon+"', `added_by`='"+req.query.faddedby+"' WHERE `category_details`.`category_id` = '"+req.query.foldid+"' ";
        }

      }else if(flag=='3'){
        if(type=='location'){
          var sql="UPDATE `master_location` SET `active_status`='3' where location_id='"+req.query.foldid+"'";
        }else if(type=='location'){
          var sql="UPDATE `category_details` SET `category_status`='3' where category_id='"+req.query.foldid+"'";
        }
      }
console.log(sql);
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

/*search the existing location or category*/
app.post('/Fnsearchlocacate',  urlencodedParser,function (req, res)
{

    var searchtype=req.query.fsearchtype;
    if(searchtype=='location'){
          var sql='SELECT * from master_location where location_status="1" and location_id="'+req.query.foldid+'"';
        }else if(searchtype=='category'){
          var sql='SELECT * from category_details where category_status="1" and category_id="'+req.query.foldid+'"';
        }
       connection.query('',
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

/*add or update staff details in master table*/
app.post('/Fnstaffdetails',  urlencodedParser,function (req, res)
{
      var flag=req.query.fnflag;
      console.log(flag);
      if(flag=='1'){
           var sql="insert into master_staff (staff_id,staff_name,staff_mobile,staff_mail,staff_id_type,staff_id_proof,staff_role,staff_street,staff_locality,staff_city,staff_pincode,staff_status,added_date,added_by) values ('"+req.query.fnnewid+"','"+req.query.fnuname+"','"+req.query.fnumobno+"','"+req.query.fnuemail+"','"+req.query.fnprooftype+"','"+req.query.fnidproof+"','"+req.query.fnrole+"','"+req.query.fnstreetname+"','"+req.query.fnlocality+"','"+req.query.fncity+"','"+req.query.fnpin+"','1','"+req.query.fnaddedon+"','"+req.query.fnaddedby+"')";
         
      }else if(flag=='0'){
        var sql="UPDATE `master_staff` SET  `staff_name` = '"+req.query.fnuname+"', `staff_mobile` = '"+req.query.fnumobno+"', `staff_mail` = '"+req.query.fnuemail+"', `staff_id_type` = '"+req.query.fnprooftype+"', `staff_id_proof` = '"+req.query.fnidproof+"', `staff_role` = '"+req.query.fnrole+"', `staff_street` = '"+req.query.fnstreetname+"', `staff_locality`='"+req.query.fnlocality+"', `staff_city`='"+req.query.fncity+"', `staff_pincode`='"+req.query.fnpin+"' , `staff_status`='1' ,`added_date`='"+req.query.fnaddedon+"', `added_by`='"+req.query.fnaddedby+"' WHERE `master_staff`.`staff_id` = '"+req.query.fnoldid+"' ";
        
      }else if(flag=='3'){
          var sql="UPDATE `master_staff` SET `staff_status`='3' where staff_id='"+req.query.fnoldid+"' or staff_mobile='"+req.query.fnumobno+"'";
      }
console.log(sql);
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


/*search the already existing staff details*/
app.post('/Fnsearchstaff',  urlencodedParser,function (req, res)
{
      var userid={"staff_id":req.query.foldid};
       connection.query('SELECT * from master_staff where staff_status="1" and ?',[userid],
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


function setvalue(){
  console.log("calling setvalue.....");
}
var server = app.listen(8083, function () {
var host = server.address().address
var port = server.address().port
console.log("Example app listening at http://%s:%s", host, port)
});
