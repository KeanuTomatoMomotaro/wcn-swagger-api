'use strict';
const uuidv4 = require('uuid/v4');
// const mysql = require('mysql2/promise');
const MongoClient = require('mongodb').MongoClient;
// const assert = require('assert');
// create the connection to database
// const connection = {
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// };

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'wcn';

// Create a new MongoClient
// const client = new MongoClient(url);

// Use connect method to connect to the Server
// client.connect(function(err) {
//   assert.equal(null, err);
//   console.log("Connected successfully to server");

//   const db = client.db(dbName);

//   client.close();
// });

const url = 'mongodb://localhost:27017/'+dbName

exports.get = async (req, res) => {
    MongoClient.connect(url)
        .then((db) => { // <- db as first argument
            console.log(db)
        })
        .catch((e) => {
            return res.status(400).json({
                message: e.toString()
            });
        })
    // mysql.createConnection(connection)
    //     .then( (con) => {
    //         con.query('select * from posts')
    //         .then(([rows, fields]) => {
    //             con.end();
    //             return res.json({
    //                 message: 'Success',
    //                 result: rows
    //             }); 
    //         })
    //     })
    //     .catch((e) =>{
    //         return res.status(400).json({
    //             message: e.toString()
    //         });
    //     });
}

exports.post = async (req, res) => {
    let id = uuidv4();
    let query = `INSERT INTO posts (id, author_id, title, content) VALUES (?, ?, ?, ?)`;

    if(!req.body.author_id){
        return res.status(400).json({
            message: 'Validation Failed : missing required author_id parameter'
        });
    }else if(!req.body.post_title){
        return res.status(400).json({
            message: 'Validation Failed : missing required post_title parameter'
        });
    }else if (!req.body.post_content){
        return res.status(400).json({
            message: 'Validation Failed : missing required post_content parameter'
        });
    }else{
        // mysql.createConnection(connection)
        // .then((con) => {
        //     con.query('SELECT role, username FROM `users` WHERE id = ?', req.body.author_id)
        //     .then(([row]) => {
        //         if(row[0].role !== 'admin'){
        //             throw ('Validation Failed : user ' + row[0].username + ' is not allowed to post new wacana content');
        //         }
        //         con.query(query, [id, req.body.author_id, req.body.post_title, req.body.post_content])
        //         .then(([rows, fields]) => {
        //             con.end();
        //             return res.json({
        //                     message: 'Successfully created a new post',
        //                     post_id: id, 
        //             });
        //         });
        //     }).catch((e) =>{
        //         return res.status(400).json({
        //             message: e.toString()
        //         });
        //     });
        // })
        // .catch((e) =>{
        //     return res.status(400).json({
        //         message: e.toString()
        //     });
        // }); 
        MongoClient.connect(url)
        .then((db) => { // <- db as first argument
            console.log(db)
            // Get the documents collection
            const collection = db.collection('posts');
            return collection;
        })
        .catch((e) => {
            return res.status(400).json({
                message: e.toString()
            });
        })
    }
}