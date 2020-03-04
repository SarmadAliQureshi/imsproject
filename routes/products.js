const express = require('express')
const router = express.Router();
const sqlite3 = require('sqlite3')
const { Sequelize } = require('sequelize')

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
router.get('/product',function(req,res){
    if ("name" in req.query){
        console.log("Name Found",req.query.name)
        db.all(`select * from products where product_name="${req.query.name}"`,function(err,rows){
            if (err){
                console.log('a')
                res.send(err.message)
                return console.error(err.message)
            }
            else if (rows.length==0){
            console.log('b')
            console.log(rows.length)
            res.send({result:"No data Found"})
            }
            else{
                res.send(rows)
            }
        })
    }
    else if ("id" in req.query){
        console.log("Name Found",req.query.id)
        db.all(`select * from products where product_id="${req.query.id}"`,function(err,rows){
            if (err){
                console.log('a')
                res.send(err.message)
                return console.error(err.message)
            }
            else if (rows.length==0){
            console.log('b')
            console.log(rows.length)
            res.send({result:"No data Found"})
            }
            else{
                res.send(rows)
            }
        })
    }
    else{
    console.log("req param",req.query)
    db.all('select * from products order by product_name asc',function(err,row){
        // console.log(row)
        res.send(row)
    })
}
})

router.post('/product',function(req,res){

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
    // sql = `insert into products(${column_names}) values(${req.body.product_id},'${req.body.product_name}',${req.body.product_price})`

    sql = `insert into products(${column_names}) values(${newdata})`
    db.run(sql, function(err) {
        if (err) {
          console.log(err.message);
          res.send(JSON.stringify({error:err.message}))
        }
        res.send(JSON.stringify({statuscode:res.statusCode}))
        console.log(`Rows inserted`,data);
      })
    console.log(column_names+' : '+data)
    console.log(req.body)
    // res.end()
})

router.put('/product',function(req,res){
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
    if ("id" in req.query && "name" in req.query){
        sql = `update  products set ${update_string}  where product_id=${req.query.id} and product_name='${req.query.name}'`
        console.log(sql)
        db.run(sql, function(err) {
            if (err) {
                res.send(JSON.stringify({error:err.message}))

              return console.error(err.message);
            }
            res.send({success:`product with name ${req.query.name} updated`})

            console.log(`Rows updated`);
          }) 
    }    
    else if ("id" in req.query){
    sql = `update  products set ${update_string}  where product_id=${req.query.id}`
    console.log(sql)
    db.run(sql, function(err) {
        if (err) {
        res.send(JSON.stringify({error:err.message}))

          return console.error(err.message);
        }
        res.send({success:`product with id ${req.query.id} updated`})

        console.log(`Rows updated`);
      })
    }
    else if ("name" in req.query){
        sql = `update  products set ${update_string}  where product_name='${req.query.name}'`
    console.log(sql)
    db.run(sql, function(err) {
        if (err) {
            res.send(JSON.stringify({error:err.message}))
            return console.error(err.message);
        }
        res.send({success:`product ${req.query.name} updated`})

        console.log(`Rows updated`);
      })
    }
    console.log(column_names+' : '+data)
    console.log(req.body)
})

router.delete('/product',function(req,res){
    console.log("In delete request")
    console.log(req.body)
    console.log(req.query)
    console.log(req.params)
    
   
    console.log("All data : ",column_names,newdata)
    if ("product_id" in req.body && "product_name" in req.body){
        sql = `delete from products where product_id=${req.body['product_id']} and product_name='${req.body['product_name']}'`
        console.log(sql)
        db.run(sql, function(err) {
            if (err) {
              return console.error(err.message);
            }
            console.log(`Rows deleted`);
          }) 
    }    
    else if ("product_id" in req.body){
    sql = `delete from products where product_id=${req.body['product_id']}`
    console.log(sql)
    db.run(sql, function(err) {
        if (err) {
          return console.error(err.message);
        }
        console.log(`Rows deleted`);
      })
    }
    else if ("product_name" in req.body){
        sql = `delete from  products  where product_name='${req.body['product_name']}'`
    console.log(sql)
    db.run(sql, function(err) {
        if (err) {
          res.send(JSON.stringify({error:err.message}))

          console.log(err.message);
        }
        console.log(`Rows deleted`);
      })
    }
    else{
        res.send({error:`column name doesnot exists`})
    }

    res.end()
})


module.exports = router