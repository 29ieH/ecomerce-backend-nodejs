const redis = require('redis')
const client =  redis.createClient({
    url:process.env.REDIS_URI
});
// Kết nối Redis
client.connect().then(() => {
    console.log("Connected to Redis!");

    // Sau khi kết nối thành công, có thể sử dụng ping để kiểm tra
    client.ping().then((result) => {
        console.log("Ping response:", result);  // Kết quả sẽ là 'PONG' nếu thành công
    }).catch((err) => {
        console.error("Ping error:", err);
    });
}).catch((err) => {
    console.error(`Error connecting to Redis: ${err}`);
});
// Xử lý sự kiện lỗi
client.on('error', (error) => {
    console.log(`Redis connection error: ${error}`);
});
module.exports = client;