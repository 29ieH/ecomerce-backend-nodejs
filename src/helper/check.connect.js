const mongoose = require("mongoose");

const countConnect = () => {
    const numConnection = mongoose.connections.length;
    console.log(`Number of connect:: ${numConnection}`)
}
module.exports = {
    countConnect
}