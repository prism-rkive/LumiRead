const app = require('./App');
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{ //start server 
 console.log(`Server is running in ${PORT})`)
});