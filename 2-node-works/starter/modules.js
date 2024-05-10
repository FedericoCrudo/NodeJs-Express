

// console.log(arguments);
//funzione wrapper
// console.log(require('module').wrapper)
const C = require('./test-module-1');

const calc1 = new C();
console.log(calc1.add(2, 5))

//exports
const calc2 = require('./test-module-2');
console.log(calc2.multiply(2, 5));
//caching
//stampera 3 volòte "beatiful messsage", ma hello sola una volta,questo grazie alla memorizzazione 

require("./test-module-3")();
require("./test-module-3")();
require("./test-module-3")();