const formData = require('form-data');
const Mailgun = require('mailgun.js');

class EmailService {    
    constructor(apiKey, domain = 'mg.payglow.net') {       
        this.mailgun = new Mailgun(formData);
        this.mg = this.mailgun.client({ 
            username: 'api', 
            key: apiKey, 
            url: "https://api.eu.mailgun.net",
        });
        this.domain = domain;
    }

    async sendEmail(from, to, subject, text, html) {
        try {
            const msg = await this.mg.messages.create(this.domain, {
                from: from,
                to: to,
                subject: subject,
                text: text,
                html: html
            });
            //console.log('Email sent successfully:', msg);
            return msg; // Return the message object if needed
        } catch (err) {
           // console.error('Error sending email:', err);
            throw err; // Rethrow the error if you want to handle it elsewhere
        }
    }
}


module.exports = EmailService;