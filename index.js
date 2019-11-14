var path = require('path');
var express = require('express');
var app = express();
var indexRouter = require('./routes/index');
var userRouter = require('./routes/api1_users');
var bodyParser = require('body-parser') 
var houseLeaseInfRouter = require('./routes/api1_HouseLeaseInf');

// app.set('views', path.join(__dirname, 'views'));// 设置存放模板文件的目录
// app.set('view engine', 'ejs');// 设置模板引擎为 ejs

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', indexRouter);
app.use('/api1/users', userRouter);
app.use('/api1/HouseLeaseInf', houseLeaseInfRouter);


app.use('/dist', express.static('dist'))
app.use('/public', express.static('public'))

app.listen(3000);
