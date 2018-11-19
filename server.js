var io = require('socket.io')('4000');
// const io = require('socket.io-client');
const readline = require('readline');
const _ = require('lodash')
var ObjectID = require("bson-objectid");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const mongoose = require('mongoose');
var ObjectID = require("bson-objectid");
// const objectid = require('objectid')
const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    poolSize: 5, // 连接池中维护的连接数
    reconnectTries: Number.MAX_VALUE,
    keepAlive: 120,
}
const mongoClient = mongoose.createConnection('mongodb://socket:qwe123123@13.209.42.70:27017/socket', options);
const Schema = mongoose.Schema;
const Socket = new Schema({
    name: { type: String, default: 'hahaha' },
    age: { type: Number, min: 18, index: true },
    comments: { type: Array, default: [] },
});
var BlogPost = mongoClient.model('Socket', Socket);
let id = ObjectID();
let userList = []
rl.setPrompt(id + '> ');
rl.prompt();
io.on('connection', function (socket) {
    socket.on('login', function (data) {
        userList.push(data.id)
        socket.emit('login', { id: data.id, value: '已上线', userList: userList });

    });
    rl.on('line', function (line) {
        socket.emit('callback', { 'username': id, 'value': line });
    });
    socket.on('broadcast', function (data) {
        if (data.value === 'exit') {
            _.pull(userList, data.id)
            socket.broadcast.emit('callback', { 'id': data.id, 'value': '已下线' })
            socket.disconnect();
        }
    });
    socket.on('callback', function (data) {
        if (_.includes(userList, data.username)) {
            socket.broadcast.emit('callback', { 'id': data.username, value: data.value })
        } else {
            console.log('非法用户' + data.username + ' 说: ' + data.value)
        }
    });
});

