//app is for main server file
const app = require('./src/app');
// //this is for database



const PORT = process.env.PORT || 5000;


app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));