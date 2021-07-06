/**
 * From https://github.com/emerleite/node-stopwatch
 * Edited for my needs
 */

let EventEmitter = require('events').EventEmitter
let stopwatches = {}

/**
 * Creates stopwatch and adds it to stopwatches dictionary
 * @param id, the key for the dictionary
 * @param options, allows you to define number of seconds
 *      ex: {seconds: 10}, don't mess with any other options,
 *      it will probably mess up functionality if you do
 *      I.E. making seconds mean something other than seconds
 * @constructor
 */
function Stopwatch(id, options) {
    if(get(id)) remove(id)

    EventEmitter.call(this)

    this.id = id
    this.seconds = options.seconds || 10
    this.interval = (options.interval || options.interval == 0) ? options.interval : 1000
    this.timer = null
    this.completed = false
    stopwatches[id] = this
}

/**
 * Removes the stopwatch with given id
 * @param id
 */
function remove(id){
    if(stopwatches[id].timer) clearInterval(stopwatches[id].timer)
    delete stopwatches[id]
}

/**
 * Stops intervals and resets stopwatches
 */
function clear_watches(){
    for(let key in stopwatches){
        remove(key)
    }
}

Stopwatch.prototype.__proto__ = EventEmitter.prototype

/**
 * Starts a timer
 * @returns {boolean}
 */
Stopwatch.prototype.start = function() {
    if (this.has_started()) {return false}

    let self = this

    self.timer = setInterval(function () {
        self.emit('tick', self.seconds)

        //decrement seconds
        if (--self.seconds < 0) {
            self.stop()
            self.completed = true
            self.emit('end')
        }
    }, self.interval)
    return true
}

/**
 * Returns if the timer has started
 * @returns {boolean}
 */
Stopwatch.prototype.has_started = function() {
    return !!this.timer
}

/**
 * Stops a timer
 */
Stopwatch.prototype.stop = function() {
    clearInterval(this.timer)
    this.timer = null
}

/**
 * Returns the timer or undefined if it doesn't exist
 * @param id
 * @returns {*}
 */
function get(id) {
    return stopwatches[id]
}

module.exports = {
    Stopwatch : Stopwatch,
    get,
    clear_watches
}
