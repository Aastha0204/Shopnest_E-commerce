const dns = require("dns");

console.log("Servers:", dns.getServers());

dns.resolveSrv(
  "_mongodb._tcp.cluster0.2lkmlcz.mongodb.net",
  (err, addresses) => {
    console.log("Error:", err);
    console.log("Addresses:", addresses);
  }
);