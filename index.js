const mysql = require('mysql2')
const fs = require('fs')
const bodyParser= require('body-parser')
const express= require('express')
const app= express();
const data= require('./data.json');
app.set('view-engine','ejs')
console.log(data)
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.get('/login',(req,res)=>{
    res.render('login.ejs',{login:'loginform'})
})
app.get('/register',(req,res)=>{
    res.render('register.ejs',{register:'register form'})
})
app.post("/",
    function (req, res) {
        let chuck =[];
        let name =(req.body.name);
        res.json({ message: `User ${name} entered successfully` });
        console.log(`User ${name} entered`);
        chuck.push(name);
        console.log(chuck);

    const pool=mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Ssk@2000',
    database: 'employee',
    });
    pool.getConnection(function(err,connection){
        let id = 'INSERT INTO employees (Name) VALUES (?)';
        connection.query(id,[chuck],(error,result)=>{
            if(error){
                console.log("error occured in inserting",error);
                return;
            }else{
                console.log(`data inserted`+result.affectedRows);
                
            }
            connection.release();
        });
    
        connection.query('SELECT * FROM employees', (error, results, fields) => {
            if (error) {
              console.error('Error executing query:', error);
              return;
            }
            console.log('Retrieved data:');
            let JSONdata = JSON.stringify(results,null,2);
            fs.writeFile('./data.json',JSONdata, 'utf8',(err)=>{
                if(err){
                    console.log('write file error',err);
                }
                else{
                    console.log('written to the data.json file');
                }
                connection.release();
            })  
        });
    })
}
);

app.get('/',(req,res)=>{
    res.render('index.ejs',{title:data})
})
app.listen(1000)