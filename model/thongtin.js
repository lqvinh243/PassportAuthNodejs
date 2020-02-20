const mongoose = require('mongoose');

var nguoidung = new mongoose.Schema({ username: 'string', password: 'string' },{collection:'user'});
module.exports = mongoose.model('nguoidung', nguoidung);