const { response } = require('express')
const express = require('express')
const app = new express()
const ejs = require('ejs')
const path = require('path');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/my_database', {useNewUrlParser: true})

const BlogPost = require('./models/BlogPost.js')

const validateMiddleWare = (req,res, next) =>{
    if(req.files == null|| req.body.content == null || req.body.title ==null){
        return res.redirect('/posts/new')
    }
    next()
}

const customMiddleWare = (req, res, next) =>{
    console.log('custom middle ware')
    next()
}

app.use(customMiddleWare)



//formupload
const fileUpload = require('express-fileupload')
app.use(fileUpload())

app.use('/posts/store',validateMiddleWare)

//dang ky thu muc public
app.use(express.static('public'))

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.set('view engine', 'ejs')

app.listen(4000, ()=>{
    console.log('app listen 4000s')
})

app.get('/', (request, response) => {
    
    BlogPost.find({}, function (error, posts){
        // console.log(posts)
        response.render('index', {
            blogposts: posts
        })
    })
})
app.get('/about', (request, response) => {
    // response.sendFile(path.reslove(__dirname,'index.html'))
    response.render('about')
})
app.get('/post/:id', (req, res) => {
    // response.sendFile(path.reslove(__dirname,'index.html'))
    BlogPost.findById(req.params.id, function(error,detailPost){
        res.render('post', {
            detailPost
        })
    })
})
app.get('/posts/new', (request, response) => {
    // response.sendFile(path.reslove(__dirname,'index.html'))
    response.render('create')
})
// chua hieu doan code luu anh len server
app.post('/posts/store', (request, response) => {
    let image = request.files.image;
    image.mv(path.resolve(__dirname, 'public/upload', image.name), function(err){
        // model creates a new doc with browser data
        BlogPost.create({
            ...request.body,
            image: '/upload/' + image.name
        }, function (err){
            response.redirect('/')
        })
    })
})
// app.post('/posts/store', (request, response) => {
//     let image = request.files.image;
//     image.mv(path.resolve(__dirname, 'public', image.name), function(err){
//         // model creates a new doc with browser data
//         BlogPost.create({
//             {request.body}, (error, blogpost) => {
//                 console.log(request.body)
//                 response.redirect('/')
//             }
//         })
//     })
// })
app.get('/contact', (request, response) => {
    // response.sendFile(path.reslove(__dirname,'index.html'))
    response.render('contact')
})
app.get('*', (request, response) => {
    // response.sendFile(path.reslove(__dirname,'index.html'))
    response.send('page not found')
})
