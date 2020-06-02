const config = require('./config/index.js')
const express = require('express')

const server = express()

const tradeHistoryModel = require('./models/db.js').TradeHistory
const sequelize = require('./models/db.js').sequelize

import tradeHistoryService from './services/TradeHistoryService.js'

server.get('/', (req, res) => {
  res.send('hello world')
})

server.get('/dashboard', async (req, res) => {
  const trade_history_service = new tradeHistoryService(tradeHistoryModel, sequelize)
  const total = await trade_history_service.getTotal()
  if(!!total) {
    console.log(total)
    return res.json({total: total})
  }else{
    return res.sendStatus(500);
  }
})

server.listen(config.server.backend_port, function (err) {
	if (err) {
		console.log(err)
		return
  }
	console.log('Listening at http://localhost:' + config.server.backend_port + '\n')
})