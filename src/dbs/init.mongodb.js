const mongoose = require('mongoose')
const connectString = `mongodb://localhost:27017/shop29ieh`
mongoose.connect(connectString).then(_ => console.log('Connect success'))
.catch(err => console.log(`Error:: ${err}`))
module.exports = mongoose;
