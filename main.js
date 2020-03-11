const express = require('express')
const route_products = require('./routes/products')
const route_customers = require('./routes/customers')
const route_invoices = require('./routes/invoices')
const route_allinvoices = require('./routes/allinvoices')
const ui = require('node-uuid')
const sqlite3 = require('sqlite3')
const bodyParser = require('body-parser')
const app = express();

app.set('view engine','ejs')
app.use(bodyParser.json())
app.use(route_products)
app.use(route_customers)
app.use(route_invoices)
app.use(route_allinvoices)
app.use('/assets',express.static('assets'))
app.get('/index',function(req,res){
    res.sendFile(__dirname+'/index.html')
})
app.get('/ejs',function(req,res){
    res.render('testejs')
})
app.get('/test',function(req,res){
    res.sendFile(__dirname+'/testhtml.html')
})
console.log("MYUUID",ui())
// import { v4 as uuidv4 } from 'uuid';

//connecting to sqlite
// let db = new sqlite3.Database('./database/main.db', function(err){
//   if (err) {
//     return console.error(err.message);
//   }
//   console.log('Connected to the in-memory SQlite database.');
// });

// db.run('CREATE TABLE invoice(invoice_id bigint,customer_id bigint, customer_name text )',function(err){
//     if (err){
//                 console.log(err)
//             }
//             else{
//                 console.log("Table created successfully")
//             }
// });
// db.run('insert into invoice(invoice_id, customer_id, customer_name)values(001,2,"Ahmed"),(002,5,"Ali"),(003,7,"Ahad")',function(err,row){
//     if (err){
//         console.log(err)
//     }
//     else{
//         console.log("Data inserted successfully")
//     }
// })

// db.close(function(err){
//     if(err){
//         return console.error(err.message)
//     }
//     else{
//         console.log('Connection closed successfully!')
//     }
// })



// app.get('/',function(req,res){
//     res.send({name:"hy sarmad"})
// })

app.listen(3000,function(){
    console.log("Listining to port 3000")
})