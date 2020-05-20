const Sequelize = require('sequelize')
const trade_history = require('./trade_history.js')
const { 
  db_name, 
  db_host, 
  db_port, 
  db_user,
  db_password,
  db_dialect 
} = require('../config/index.js').database

const sequelize = new Sequelize(db_name, db_user, db_password, {
  dialect: db_dialect,
  host: db_host,
  port: db_port,
  sync: { force: false }
})
const TradeHistory = trade_history(sequelize, Sequelize)

module.exports = {
  TradeHistory
}