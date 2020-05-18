import config from './config/index.js'

const Imap = require('imap')
// email parser
const simpleParser = require('mailparser').simpleParser;
// html parser
const cheerio = require('cheerio')

const PRICE_PATTERN = /\$\d+.?\d+/

const imap = new Imap({
  user: config.user,
  password: config.password,
  host: config.host,
  port: 993,
  tls: true,
  tlsOptions: {
    servername: config.host
  }
});

function openInbox(cb) {
  imap.openBox('INBOX', false, cb);
}

imap.once('ready', function() {
  openInbox(function(err, box) {
    if (err) throw err;
    imap.search(['ALL', ['OR', ['SUBJECT', 'CommSec - Bought'], ['SUBJECT', 'CommSec - Sold']]], (err, results) => {
      if (err) throw err;
      if (results.length === 0) {
        console.log('nothing to fetch!');
        return imap.end();
      }
      const f = imap.fetch(results, { markSeen: true, bodies: '' });
      f.on('message', function(msg, seqno) {
        console.log('Message #%d', seqno);
        msg.on('body', function(stream, info) {
          simpleParser(stream)
          .then(parsed => {
            // console.log(parsed.subject)
            const $ = cheerio.load(parsed.html)
            const p1 = $('td[valign=top]').eq(4).html().split("<br><br>")[1].trim()
            const p2 = $('td[valign=top]').eq(4).html().split("<br><br>")[2].trim()
            const action = p1.match(/bought|sold/)[0]
            const quantity = p1.match(/\d* unit/)[0].split(' ')[0]
            const code = p1.match(/>\w+</)[0].match(/\w+/)[0]
            const price = p1.match(PRICE_PATTERN)[0]
            const amount = p2.match(PRICE_PATTERN)[0]
            const date = p2.match(/>.*</gm)[1].match(/(\w| )+/)[0]
            console.log(action)
            console.log(quantity)
            console.log(code)
            console.log(price)
            console.log(amount)
            console.log(date)
            console.log('-------')
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
  console.log('Connection ended');
});

imap.connect();