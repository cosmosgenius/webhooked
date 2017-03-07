const jwt = require('jsonwebtoken');

function generateToken(key, data={}) {
    return jwt.sign(data, key);
}

function decodeToken(token) {
    return jwt.decode(token);
}

function verifyToken(key, token) {
    return jwt.verify(token, key);
}

module.exports.generateToken = generateToken;
module.exports.decodeToken = decodeToken;
module.exports.verifyToken = verifyToken;
