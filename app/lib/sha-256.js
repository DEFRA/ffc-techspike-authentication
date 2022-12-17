const crypto = require('crypto')

module.exports = function sha256 (buffer) {
  return crypto.createHash('sha256').update(buffer).digest()
}
