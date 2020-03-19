const fetch = require('node-fetch');
const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'learn_nodejs',
    host: 'localhost',
    database: 'learn_nodejs',
    password: 'learn_nodejs',
    port: 5432,
});


const execute_query = (query, data_arr) => {
    //console.log(query);
    return pool.query(query, data_arr)
}


//Fetch users from the API and insert to the DB.
const fetch_users = (callback) => {
    //OPTIMIZATION :: This can be made into a bulk insert to hit the DB less often.
    var ins_query = 'INSERT INTO users (id, name, email, phone) VALUES ($1, $2, $3, $4)'
    fetch('https://jsonplaceholder.typicode.com/users')
    .then(function(response){
        return response.json();
    })
    .then(function(json){
        //console.log(json);
	for(var user of json) {
            execute_query(ins_query, [user.id, user.name, user.email.toLowerCase(), user.phone]);
        }
	fetch_posts(callback)
    }).catch(function (err) {
        console.log(err)
    });
}


//Fetch posts from the API and insert to the DB.
const fetch_posts = (callback) => {
    var ins_query = 'INSERT INTO posts (id, title, body, user_id) VALUES ($1, $2, $3, $4)'
    fetch('https://jsonplaceholder.typicode.com/posts')
    .then(function(response){
        return response.json();
    })
    .then(function(json){
        //console.log(json);
        for(var user of json) {
            execute_query(ins_query, [user.id, user.title, user.body, user.userId]);
        }
	callback()
    }).catch(function (err) {
        console.log(err)
    });
}


//Truncate and fetch data from the API
const full_refresh = (callback) => {
    execute_query('TRUNCATE posts', [])
    .then(res => {
        //console.log(res);
        execute_query('TRUNCATE users CASCADE', [])
        .then(res => {
	    fetch_users(callback)
	})
        .catch(err => console.error('Error executing query', err.stack))
    })
    .catch(err => console.error('Error executing query', err.stack))
}


//Fetch the posts from the DB.
const get_posts = (callback) => {
    execute_query('SELECT u.name, p.title, p.body from users u, posts p where p.user_id = u.id')
    .then(res => {
	callback(res);
    })
    .catch(err => console.error('Error executing query', err.stack))
}


// add functions
module.exports = {
    full_refresh: full_refresh,
    get_posts: get_posts
};

