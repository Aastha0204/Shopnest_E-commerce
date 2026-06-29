// test.js
const dns = require("dns");

dns.resolveSrv(
  "_mongodb._tcp.cluster0.j3hhfz0.mongodb.net",
  (err, addresses) => {
    if (err) {
      console.error("DNS Error:", err);
    } else {
      console.log("Success:", addresses);
    }
  }
);