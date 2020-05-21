// npm i
// npm link secure-env
let secureEnv = require('secure-env');
global.env = secureEnv({secret:'secretEnv'});

module.exports = {
  imap: {
    user: global.env.EMAIL,
    password: global.env.PASSWORD,
    host: global.env.HOST
  },
  database: {
    db_name: global.env.DB_NAME,
    db_host: global.env.DB_HOST,
    db_port: global.env.DB_PORT,
    db_user: global.env.DB_USER,
    db_password: '',
    db_dialect: 'postgres'
  },
  server: {
    port: 7666
  }
};