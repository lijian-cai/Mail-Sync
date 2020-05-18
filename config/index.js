// npm i
// npm link secure-env
let secureEnv = require('secure-env');
global.env = secureEnv({secret:'secretEnv'});

export default {
  user: global.env.EMAIL,
  password: global.env.PASSWORD,
  host: global.env.HOST
}