const mysql = require('mysql2');
require('dotenv').config()


const placer_pool = mysql.createPool({
    connectionLimit: 10,    // the number of connections node.js will hold open to our database
    password: process.env.USER_PLACER_PASSWORD,
    user: process.env.USER_PLACER_USER,
    database: process.env.MYSQL_DB,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT
});

const reader_pool = mysql.createPool({
    connectionLimit: 10,    // the number of connections node.js will hold open to our database
    password: process.env.USER_READER_PASSWORD,
    user: process.env.USER_READER_USER,
    database: process.env.MYSQL_DB,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT
});

const root_pool = mysql.createPool({
    connectionLimit: 10,    // the number of connections node.js will hold open to our database
    password: process.env.ROOT_PASSWORD,
    user: process.env.ROOT_USER,
    database: process.env.MYSQL_DB,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT
});




let mysqldb = {};
// ***Requests to the User table ***

mysqldb.allUser = () =>{
    return new Promise((resolve, reject)=>{
        root_pool.query('SELECT * FROM user_data.users ', (error, users)=>{
            if(error){
                return reject(error);
            }
            return resolve(users);
        });
    });
};


mysqldb.getUserByEmail = (email) =>{
    return new Promise((resolve, reject)=>{
        root_pool.query('SELECT * FROM user_data.users WHERE email = ?', [email], (error, users)=>{
            if(error){
                return reject(error);
            }
            return resolve(users[0]);
        });
    });
};

mysqldb.getPwByEmail = (email) =>{
    return new Promise((resolve, reject)=>{
        root_pool.query('SELECT pw_hash FROM user_data.credentials WHERE email = ?', [email], (error, users)=>{
            if(error){
                return reject(error);
            }
            return resolve(users[0]);
        });
    });
};

mysqldb.getPwByUsername = (username) =>{
    return new Promise((resolve, reject)=>{
        root_pool.query('SELECT CAST(pw_hash as CHAR) as pw_hash FROM user_data.credentials WHERE username = ?', [username], (error, users)=>{
            if(error){
                return reject(error);
            }
            return resolve(users[0]);
        });
    });
};

mysqldb.insertUser = (data) =>{
    const { email, fname, gender, birthdate, lname, first_training_status, username } = data;
    return new Promise((resolve, reject)=>{
        root_pool.query('INSERT INTO user_data.users (email, fname, gender, birthdate, lname, first_training_status,username) VALUES (?, ?, ?, ?, ?, ?,?)', [email, fname, gender, birthdate, lname, first_training_status, username], (error, result)=>{
            if(error){
                console.log("Insert user info error: ", error);
                return reject(error);
            }

            return resolve(result.insertId);
        });
    });
};

mysqldb.insertUserPw = (data) =>{
    const { email, hashedPassword, username } = data;
    return new Promise((resolve, reject)=>{
        root_pool.query('INSERT INTO user_data.credentials (email, pw_hash,username) VALUES (?,?,?)', [email, hashedPassword,username], (error, result)=>{
            if(error){
                console.log("Insert user creds error: ", error);
                return reject(error);
            }

            return resolve();
        });
    });
};

mysqldb.updateUser = (data) =>{
    const { email, username } = data;
    return new Promise((resolve, reject)=>{
        root_pool.query('UPDATE user_data.users SET username = ? WHERE email = ?', [username, email], (error)=>{
            if(error){
                return reject(error);
            }

            return resolve();
        });
    });
};

mysqldb.updateUserPw = (data) =>{
    const { email, password_hash } = data;
    return new Promise((resolve, reject)=>{
        root_pool.query('UPDATE user_data.credentials SET pw_hash = ? WHERE email = ?', [password_hash, email], (error)=>{
            if(error){
                return reject(error);
            }

            return resolve();
        });
    });
};

mysqldb.deleteUser = (id) =>{
    return new Promise((resolve, reject)=>{
        root_pool.query('DELETE FROM user_data.users WHERE id = ?', [id], (error)=>{
            if(error){
                return reject(error);
            }
            return resolve(console.log("User deleted"));
        });
    });
};




module.exports = mysqldb