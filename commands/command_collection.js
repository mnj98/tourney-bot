/**
 * Collects all the commands to that only 1 require() is required to require all commands
 *  The field names don't really matter
 */
module.exports = {
    ADD_TIME: require('./add-time.js'),
    CLEAR_CLOCK: require('./clear-clock.js'),
    CODE: require('./code.js'),
    ROSTER: require('./roster.js'),
    SCORE: require('./score.js'),
    START_TIMERS: require('./start-timers.js'),
    TIMER_INFO: require('./timer-info.js'),
    SIGNUP: require('./signup.js')
}
