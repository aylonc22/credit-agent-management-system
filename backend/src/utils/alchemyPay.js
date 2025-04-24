const crypto = require('crypto');
require('dotenv').config();
//const querystring = require('querystring');

// Function to generate HMAC SHA256 signature
function generateSignature(timestamp, httpMethod, requestPath, secretKey) {
    // Concatenate parameters for signature string
    const signatureString = timestamp + httpMethod + requestPath;   

    // Generate HMAC SHA256 signature using the secret key
    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(signatureString);
    const signature = hmac.digest('base64');

    return encodeURIComponent(signature);
}

// Function to sort parameters and return a string to sign
function getStringToSign(params) {
    const sortedKeys = Object.keys(params).sort();
    const s2s = sortedKeys
        .map(key => {
            const value = params[key];
            if (Array.isArray(value) || value === '') {
                return null;
            }
            return `${key}=${value}`;
        })
        .filter(Boolean)
        .join('&');
    
    return s2s;
}

function generateAlchemy(wallet, amount, merchantOrderNo, timestamp, callbackUrl){    
const onRampHttpMethod = 'GET';
const onRampRequestPath = '/index/rampPageBuy'; 

const appId = process.env.appId
const appSecret = process.env.appSecret;

// Request parameters
const paramsToSign = {
    crypto: 'USDT',
    fiat: 'USD',
    fiatAmount: amount,
    merchantOrderNo: merchantOrderNo,
    network: 'TRX',
    timestamp: timestamp,
    appId: appId,
    address:wallet,
};

const rawDataToSign = getStringToSign(paramsToSign);
const requestPathWithParams = onRampRequestPath + '?' + rawDataToSign;
const onRampSignature = generateSignature(timestamp, onRampHttpMethod, requestPathWithParams, appSecret);
console.log("https://ramptest.alchemypay.org?" + rawDataToSign + "&sign=" + onRampSignature);
return "https://ramptest.alchemypay.org?" + rawDataToSign + "&sign=" + onRampSignature;
}

module.exports = generateAlchemy;