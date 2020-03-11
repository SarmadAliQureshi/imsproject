const express = require('express')
const router = express.Router();
const sqlite3 = require('sqlite3')
const { Sequelize } = require('sequelize')
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// const sequelize = new Sequelize({
//     dialect: 'sqlite',
//     storage: './database/main.db'
//   });

//   try {
//     sequelize.authenticate();
//     console.log('Connection has been established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
//   sequelize.find
//created database instance
let db = new sqlite3.Database('./database/main.db', function(err){
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });


//To get all the data from database
router.get('/allinvoices',function(req,res){

    if ("customer_id" in req.query && "product_id" in req.query){
        console.log("Name Found In",req.query.customer_id)
        db.all(`select * from allinvoices where customer_id="${req.query.customer_id}" and product_id="${req.query.product_id}" ORDER by date_time DESC limit 1`,function(err,rows){
            if (err){
                console.log('a')
                res.send(err.message)
                return console.error(err.message)
            }
            else if (rows.length==0){
            console.log('b')
            console.log(rows.length)
            res.send({result:"No data found"})
            }
            else{
                res.send(rows)
            }
        })
    }

    else if ("invoice_id" in req.query){
        console.log("Name Found",req.query)
        db.all(`select * from allinvoices where invoice_id="${req.query.invoice_id}" ORDER by date_time DESC`,function(err,rows){
            if (err){
                console.log('a')
                res.send(err.message)
                return console.error(err.message)
            }
            else if (rows.length==0){
            console.log('b')
            console.log(rows.length)
            res.send({result:"No data found"})
            }
            else{
                res.send(rows)
            }
        })
    }
    else if ("customer_id" in req.query){
        console.log("Name Found :",req.query.customer_id)
        console.log(req.query['customer_id'])
        var sql =`select * from allinvoices where customer_id=${req.query.customer_id} ORDER by date_time DESC`
        console.log(sql)
        db.all(sql,function(err,rows){
            console.log('l',rows)
            if (err){
                console.log('a')
                res.send(err.message)
                return console.error(err.message)
            }
            else if (rows.length==0){
            console.log('b')
            console.log(rows.length)
            res.send({result:"No data found!"})
            }
            else{
                res.send(rows)
            }
        })
    }
    // selecting the last price at which customer purchased the item
    else{
    console.log("IN ELSE")    
    console.log("req param",req.query)
    db.all('select * from allinvoices',function(err,row){
        if (err){
            console.log('a')
            res.send(err.message)
            return console.error(err.message)
        }
        else{
            console.log('data',row)
            res.send(row)
        }
    
    })
}
})

router.post('/allinvoices', urlencodedParser ,function(req,res){
    console.log("IN post req")
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    column_names = Object.keys(req.body)
    column_names.push("date_time")
    data = Object.values(req.body)
    data.push(`${dateTime}`)
    var newdata = []
    console.log(data)
    for (i in data){
        if(isNaN(data[i]))
        {   
            a=`"${data[i]}"`
            newdata.push(a)
            // console.log(a)
        }
        else{
            newdata.push(data[i])
        }
    }
    console.log('column_names',column_names) 
    console.log('data',data);
    console.log("newdata",newdata)
    //2020-03-09 17:49:29
    
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    console.log('today',today)
    console.log('date',date)
    // sql = `insert into invoices(${column_names}) values(${req.body.product_id},'${req.body.product_name}',${req.body.product_price})`
    sql = `insert into allinvoices(${column_names}) values(${newdata})`
    console.log(sql)
    console.log("a",sql,column_names,newdata)
    db.run(sql, function(err) {
        if (err) {
          console.log(err.message);
          res.send(JSON.stringify({error:err.message}))
        }
        else{
        res.send(JSON.stringify({statuscode:res.statusCode}))
        console.log(`Rows inserted`,data);}
      })
    console.log(column_names+' : '+data)
    console.log(req.body)
    // res.end()
})

router.put('/allinvoices',function(req,res){
    console.log("In put request")
    console.log(req.body)
    console.log(req.query)
    console.log(req.params)
    column_names = Object.keys(req.body)
    data = Object.values(req.body)
    var newdata = []
    console.log(data)
    for (i in data){
        if(isNaN(data[i]))
        {   
            a=`"${data[i]}"`
            newdata.push(a)
            console.log(a)
        }
        else{
            newdata.push(data[i])
        }
    }
    column_names1 = column_names
    newdata1 = newdata
    var newdata2 = []
    var update_string = ""
    datalength = column_names.length
    for (i=0 ;i<datalength; i++){
        newdata2.push(column_names1.pop())
        newdata2.push('=')
        newdata2.push(newdata1.pop())
        newdata2.push(',')

        
    }
    for (i=0 ; i<newdata2.length-1 ; i++){
        update_string = update_string+newdata2[i]
    }
    // newdata2 = newdata2.replace(/,\s*$/, "");
    console.log("newdata2 :",update_string)
    console.log("newdata1 :",newdata1)
   

    console.log("All data : ",column_names,newdata)
    if ("customer_id" in req.query && "invoice_id" in req.query){
        sql = `update  allinvoices set ${update_string}  where customer_id=${req.query.customer_id} and invoice_id=${req.query.invoice_id}`
        console.log(sql)
        db.run(sql, function(err) {
            if (err) {
            res.send(JSON.stringify({error:err.message}))
    
              return console.error(err.message);
            }
            else{
            res.send({success:`customer with id ${req.query.customer_id} updated`})
    
            console.log(`Rows updated`);}
          })
        }
        else if ("customer_id" in req.query && "invoice_id" in req.query && "product_id" in req.query){
            sql = `update  allinvoices set ${update_string}  where customer_id=${req.query.customer_id} and product_id=${req.query.product_id} and invoice_id=${req.query.invoice_id}`
            console.log(sql)
            db.run(sql, function(err) {
                if (err) {
                res.send(JSON.stringify({error:err.message}))
        
                  return console.error(err.message);
                }
                else{
                res.send({success:`invoice with id ${req.query.invoice_id} updated`})
        
                console.log(`Rows updated`);}
              })
            }
    else if ("invoice_id" in req.query){
        sql = `update  allinvoices set ${update_string}  where invoice_id=${req.query.invoice_id}`
        console.log(sql)
        db.run(sql, function(err) {
            if (err) {
            res.send(JSON.stringify({error:err.message}))
    
              return console.error(err.message);
            }
            else{
            res.send({success:`invoice with id ${req.query.invoice_id} updated`})
    
            console.log(`Rows updated`);}
          })
        }    
    // else if ("customer_id" in req.query){
    // sql = `update  allinvoices set ${update_string}  where customer_id=${req.query.customer_id}`
    // console.log(sql)
    // db.run(sql, function(err) {
    //     if (err) {
    //     res.send(JSON.stringify({error:err.message}))

    //       return console.error(err.message);
    //     }
    //     else{
    //     res.send({success:`customer with id ${req.query.customer_id} updated`})

    //     console.log(`Rows updated`);}
      })
    
    

router.delete('/allinvoices',function(req,res){
    console.log("In delete request")
    console.log(req.body)
    console.log(req.query)
    console.log(req.params)
    
   
    if ("invoice_id" in req.body){
        sql = `delete from allinvoices where invoice_id=${req.body['invoice_id']}`
        console.log(sql)
        db.run(sql, function(err) {
            if (err) {
              return console.error(err.message);
            }
            else{
                res.send({success:`invoice with id ${req.body['invoice_id']} deleted`})
            }
            console.log(`Rows deleted`);
          })
        //   res.end()
        }    
    else if ("customer_id" in req.body){
    sql = `delete from allinvoices where customer_id=${req.body['customer_id']}`
    console.log(sql)
    db.run(sql, function(err) {
        if (err) {
          return console.error(err.message);
        }
        else{
            res.send({success:`invoice with customer id ${req.body['customer_id']} deleted`})
        }
        console.log(`Rows deleted`);
      })
    //   res.end()
    }
    else{
        res.send({error:`column name doesnot exists`})
    }

})


module.exports = router