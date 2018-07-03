var cluster = require('cluster');
var os = require('os');

const cpus = os.cpus();
console.log(cpus);

// cpus.forEach(function() {

// })