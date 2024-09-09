const app = require('./src/app')
const PORT = process.env.port || 3056;
const server = app.listen(PORT,() => {
    console.log(`WSV eCommerce start with PORT:: ${PORT}`)
})
process.on('SIGINT',() => {
    server.close(() => console.log("Exit server Express"))
})