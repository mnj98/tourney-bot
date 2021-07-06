//From https://github.com/emerleite/node-stopwatch
//Edited for my needs


let EventEmitter = require('events').EventEmitter;
let stopwatches = {};

function Stopwatch(id, options) {
    
    EventEmitter.call(this);

    this.id = id;
    this.seconds = options.seconds || 10;
    this.interval = (options.interval || options.interval == 0) ? options.interval : 1000;
    this.timer = null;
    this.completed = false
    stopwatches[id] = this
    
}

function clear_watches(){
    for(let key in stopwatches){
        if(stopwatches[key].timer) clearInterval((stopwatches[key].timer))
    }
    stopwatches = {}
}

Stopwatch.prototype.__proto__ = EventEmitter.prototype;

Stopwatch.prototype.stop = function() {
    clearInterval(this.timer);
    this.timer = null;
};

Stopwatch.prototype.start = function() {
    if (this.has_started()) { return false; }

    let self = this;

    self.timer = setInterval(function () {
        self.emit('tick', self.seconds);

        if (--self.seconds < 0) {
            self.stop();
            self.completed = true
            self.emit('end');
        }
    }, self.interval);

    return true;
};

Stopwatch.prototype.has_started = function() {
    return !!this.timer;
};

Stopwatch.prototype.restart = function() {
    this.stop();
    this.removeAllListeners('tick');
    this.removeAllListeners('end');
    this.start();
};

function get(id) {
        return stopwatches[id];
    }

module.exports = {
    Stopwatch : Stopwatch,
    get,
    clear_watches
};
