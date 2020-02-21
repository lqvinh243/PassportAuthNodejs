const mongoose = require('mongoose');

var nguoidung = new mongoose.Schema({ id:'Number',username: 'string', password: 'string',name:'string' },{collection:'user'});
module.exports = mongoose.model('nguoidung', nguoidung);