const crypto = require('crypto');
const ENCRYPTION_KEY = '12345678901234567890123456789012';
// AES decryption function (for decrypting the password)
async function decryptAES(encryptedPassword) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), Buffer.from(ENCRYPTION_KEY, 'utf8').slice(0, 16)); // Using part of the key as IV
    
    let decrypted = decipher.update(encryptedPassword, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

function encryptAES(password) {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), Buffer.from(ENCRYPTION_KEY, 'utf8').slice(0, 16)); // Using part of the key as IV
    
    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

module.exports = {decryptAES, encryptAES};