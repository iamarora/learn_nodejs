const express = require('express')
const data = require('./data')
const app = express()
const port = 3000
app.set('view engine', 'pug')


// Root path opens the data table.
app.get('/', function (req, res) {
    data.get_posts(function(posts) {
        res.render('index', { title: 'Posts', posts: posts.rows})
    })
})

// Fetch data from the API and store in the DB!
app.get('/refresh', function(req,res) {
    data.full_refresh(function(){
	res.send("Data refreshed!!");
    });
});

// Server start up
app.listen(port, () => console.log('Server up!!'))

