const config = require('./config/index.js')
const express = require('express')
// access gmail
const Imap = require('imap')
// email parser
const simpleParser = require('mailparser').simpleParser;
// html parser
const cheerio = require('cheerio')

const PRICE_PATTERN = /\$\d+.?\d+/

const app = express()

const imap = new Imap({
  user: config.imap.user,
  password: config.imap.password,
  host: config.imap.host,
  port: 993,
  tls: true,
  tlsOptions: {
    servername: config.imap.host
  }
});

const TradeHistory = require('./models/db.js').TradeHistory

let count = 0

// cron job task
const cron = require("node-cron");

cron.schedule("40 15 * * *", function() {
  console.log("---------------------");
  console.log("Running Cron Job");
  imap.connect();
});

function openInbox(cb) {
  imap.openBox('INBOX', false, cb);
}

function saveData({action, quantity, code, price, amount, date}) {
  TradeHistory.create({
    action: action,
    quantity: quantity,
    code: code,
    price: price,
    amount: amount,
    date: date
  }).then(function(result){
        // console.log(result);
        console.log(`save ${action} ${quantity} ${code} into database.`)
        count++;
  }).catch(function(err){
        console.log(err.message);
  });
}



imap.once('ready', function() {
  openInbox(function(err, box) {
    if (err) throw err;
    // filter mails
    imap.search(['UNSEEN', ['OR', ['SUBJECT', 'CommSec - Bought'], ['SUBJECT', 'CommSec - Sold']]], (err, results) => {
      if (err) throw err;
      if (results.length === 0) {
        console.log('nothing to fetch!');
        return imap.end();
      }
      const f = imap.fetch(results, { markSeen: true, bodies: '' });
      f.on('message', function(msg, seqno) {
        console.log('Message #%d', seqno);
        msg.on('body', function(stream, info) {
          // parse mail
          simpleParser(stream)
          .then(parsed => {
            console.log(`parsing: ${parsed.subject}`)
            const $ = cheerio.load(parsed.html)
            const p1 = $('td[valign=top]').eq(4).html().split("<br><br>")[1].trim()
            const p2 = $('td[valign=top]').eq(4).html().split("<br><br>")[2].trim()
            
            const data = {}
            data.action = p1.match(/bought|sold/)[0]
            data.quantity = p1.match(/\d* unit/)[0].split(' ')[0]
            data.code = p1.match(/>\w+</)[0].match(/\w+/)[0]
            data.price = p1.match(PRICE_PATTERN)[0]
            data.amount = p2.match(PRICE_PATTERN)[0]
            data.date = `${parsed.date.getFullYear()}-${parsed.date.getMonth()+1}-${parsed.date.getDate()}`
            // save data to postgres db
            saveData(data)

          })
          .catch(err => {
            console.log(`Parse mail error: ${err}`)
          });

        });
      });
      f.once('error', function(err) {
        console.log('Fetch error: ' + err);
      });
      f.once('end', function() {
        console.log('Done fetching all messages!');
        imap.end();
      });
    })
  });
});

imap.once('error', function(err) {
  console.log(err);
});

imap.once('end', function() {
  console.log(`Total ${count} records`)
  console.log('Connection ended');
});

app.listen(config.server.port, function (err) {
	if (err) {
		console.log(err)
		return
	}
	console.log('Listening at http://localhost:' + config.server.port + '\n')
})