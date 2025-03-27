function coreLogMessage(message) {
    return console.log('\x1b[32m%s\x1b[0m', '[Core] ' + message);
    
} 

function securityLogMessage(message) {
    return console.log('\x1b[31m%s\x1b[0m', "[Security] " + message);
} 

function notesLogMessage(message) {
    return console.log('\x1b[36m', "[Notes] " + message);
} 

module.exports = {
    notesLogMessage: notesLogMessage,
    securityLogMessage: securityLogMessage,
    coreLogMessage: coreLogMessage
  };