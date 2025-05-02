const crypto = require('crypto');
const fetch = require('node-fetch');
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

const appId = process.env.APP_ID
const appSecret = process.env.APP_SECRET;

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
    callbackUrl:callbackUrl,
};

const rawDataToSign = getStringToSign(paramsToSign);
const requestPathWithParams = onRampRequestPath + '?' + rawDataToSign;
const onRampSignature = generateSignature(timestamp, onRampHttpMethod, requestPathWithParams, appSecret);

return "https://ramptest.alchemypay.org?" + rawDataToSign + "&sign=" + onRampSignature;
}

async function validateTransaction(merchantOrderNo){  
    
    // === CONFIG ===
    const appId = process.env.APP_ID
    const appSecret = process.env.APP_SECRET;
    const BASE_URL = 'https://openapi-test.alchemypay.org'; // or your specific base URL
    
    
    const method = 'GET';
    const path = '/open/api/v4/merchant/query/trade';
    const timestamp = Date.now().toString();
    
    const queryParams = {
      merchantOrderNo:merchantOrderNo,
      side: 'BUY', 
      appid: appId,
      timestamp:timestamp,
    
    };
    
    function generateSignature({ timestamp, method, path, queryParams, secretKey }) {
      const sortedKeys = Object.keys(queryParams).sort();
      const sortedQueryString = sortedKeys
        .map(k => `${k}=${queryParams[k]}`)
        .join('&');
    
      const fullPath = `${path}?${sortedQueryString}`;
      const signString = `${timestamp}${method.toUpperCase()}${fullPath}`;
    
      const hmac = crypto.createHmac('sha256', secretKey);
      hmac.update(signString);
      return hmac.digest('base64');
    }
    
   
      const sign = generateSignature({
        timestamp,
        method,
        path,
        queryParams,
        secretKey: appSecret,
      });
    
      const queryString = Object.entries(queryParams)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&');
    
        const url = `${BASE_URL}${path}?${queryString}`;
    
    
      const headers = {
        'appid': appId,
        'sign': sign,
        'timestamp': timestamp,
        'Content-Type': 'application/json',
      };
    
      try {
        const response = await fetch(url, {
          method,
          headers,
        });
    
        const data = await response.json();
       return {amount:data.data?.cryptoAmountInUSDT , status:data.data?.status};
      } catch (err) {
        console.error('ERROR:', err.message);
      }
    
    
}

module.exports = {generateAlchemy,validateTransaction};