const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

console.log('Servers:', dns.getServers());

dns.resolveSrv(
  '_mongodb._tcp.cluster0.2lkmlcz.mongodb.net',
  (err, addresses) => {
    console.log(err);
    console.log(addresses);
  }
);