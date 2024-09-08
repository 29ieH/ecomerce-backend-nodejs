const app = require('./src/app')
const PORT = 8080;
const server = app.listen(PORT,() => {
    console.log(`WSV eCommerce start with PORT:: ${PORT}`)
})
process.on('SIGINT',() => {
    server.close(() => console.log("Exit server Express"))
})