'use strict';

const uuidv4 = require('uuid/v4');
const mysql = require('mysql2/promise');
// create the connection to database
const connection = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

exports.get = async (req, res) => {
    mysql.createConnection(connection)
        .then( (con) => {
            con.query('select * from comments left join users on comments.user_id = users.id')
            .then(([rows, fields]) => {
                con.end();
                return res.json({
                        message: 'Success',
                        result: rows
                    });
            })
        })
        .catch((e) =>{
            return res.status(400).json({
                message: e.toString()
            });
        });
}


exports.getCommentOfPost = async (req, res) => {
    let postId = req.params.postid;

    mysql.createConnection(connection)
        .then( (con) => {
            con.query(`select comments.id, comments.post_id, comments.content, comments.reply_id,
            comments.created_at, comments.updated_at, users.username from comments 
            left join users on comments.user_id = users.id where comments.post_id = ? AND comments.deleted_at IS NULL ORDER BY comments.created_at DESC`, postId)
            .then(([rows, fields]) => {
                con.end();
                return res.json({
                        message: 'Success',
                        result: rows
                    });
            })
        })
        .catch((e) =>{
            return res.status(400).json({
                message: e.toString()
            });
        });
}

exports.post = async (req, res) => {
    let id = uuidv4();
    let query = `INSERT INTO comments (id, post_id, user_id, content) VALUES (?, ?, ?, ?)`;

    if(!req.body.post_id){
        return res.status(400).json({
            message: 'Validation Failed : missing required post_id parameter'
        });
    }else if(!req.body.user_id){
        return res.status(400).json({
            message: 'Validation Failed : missing required user_id parameter'
        });
    }else if (!req.body.comment_content){
        return res.status(400).json({
            message: 'Validation Failed : missing required comment_content parameter'
        });
    }else{
        mysql.createConnection(connection)
        .then( (con) => {
            con.query(query, [id, req.body.post_id, req.body.user_id, req.body.comment_content])
            .then(([rows, fields]) => {
                con.end();
                return res.json({
                        message: 'Successfully posted a comment',
                        comment_id: id, 
                    });
            })
        })
        .catch((e) =>{
            return res.status(400).json({
                message: e.toString()
            });
        });
    }
}