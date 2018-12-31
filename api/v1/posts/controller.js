'use strict';
const uuidv4 = require('uuid/v4');
const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'wcn';

exports.get = async (req, res) => {
    MongoClient.connect(url, { useNewUrlParser: true })
        .then((db) => { // <- db as first argument
            // Get the documents collection
            return db.db('wcn').collection('posts');
        })
        .then((collection) => {
            let rows = collection.find({}).toArray((err, rows) => {
                if (err) throw err;
                return res.json({
                    message: 'Success',
                    result: rows
                }); 
            });
        })
        .catch((e) => {
            return res.status(400).json({
                message: e.toString()
            });
        });
}

exports.post = async (req, res) => {
    let id = uuidv4();

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
        let insertObject = {id:id, author_id:req.body.author_id, title:req.body.post_title, content:req.body.post_content};
        MongoClient.connect(url, { useNewUrlParser: true })
        .then((db) => { // <- db as first argument
            // Get the documents collection
            return db.db('wcn').collection('posts');
        })
        .then((collection) => {
            collection.insertOne(insertObject);
            return res.json({
                message: 'Successfully created a new post',
                post_id: id,
            });
        })
        .catch((e) => {
            return res.status(400).json({
                message: e.toString()
            });
        });
    }
}