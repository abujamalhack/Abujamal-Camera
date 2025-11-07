const crypto = require('crypto');

class AdvancedEncryption {
    constructor(key) {
        this.key = key || 'malware-encryption-key-2024';
    }

    encrypt(text) {
        const cipher = crypto.createCipher('aes-256-cbc', this.key);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    decrypt(encryptedText) {
        const decipher = crypto.createDecipher('aes-256-cbc', this.key);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

    generateVictimId(ip, userAgent) {
        const data = `${ip}-${userAgent}-${Date.now()}`;
        return crypto.createHash('md5').update(data).digest('hex');
    }
}

module.exports = AdvancedEncryption;
