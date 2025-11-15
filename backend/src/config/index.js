const dotenv = require('dotenv');
const envFile = dotenv.config({ path: './src/config/.env' })

if(!envFile || envFile.error)
{
    throw new Error('No env file found');
}

module.exports =
{

    port :  process.env.PORT,
    databaseUrl : process.env.DATABASE_URL,
    mode : process.env.NODE_ENV
    


};
