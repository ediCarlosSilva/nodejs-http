var cluster = require('cluster');
var os = require('os');

console.log('executando thread.');

const cpus = os.cpus();
// console.log(cpus);

if (cluster.isMaster) {
    console.log('thread master');

    cpus.forEach(function() {
        console.log('dentro do forEach');
        cluster.fork();
    });

    cluster.on('listening', worker => {
        console.log('cluster %d conectado', worker.process.pid);
    });

    cluster.on('disconnect', worker => {
        console.log('cluster %d desconectado', worker.process.pid);
    });

    cluster.on('exit', worker => {
        console.log('cluster %d perdido', worker.process.pid);
        cluster.fork();
    })

} else {
    console.log('thread slave.');
    require('./index.js');
}