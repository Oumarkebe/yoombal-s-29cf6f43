
const http = require('http');

const url = 'http://localhost:54323/project/default/settings/api';

http.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        // Look for JWT-like strings (Anon Key)
        const anonKeyMatch = data.match(/eyJ[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+/g);
        // Look for URL (http://127.0.0.1:54321)
        const urlMatch = data.match(/http:\/\/127\.0\.0\.1:\d+/g);

        console.log('Potential Anon Keys:', anonKeyMatch ? anonKeyMatch.slice(0, 3) : 'None');
        console.log('Potential URLs:', urlMatch ? [...new Set(urlMatch)] : 'None');

        // Also dump a snippet to see context if needed
        // console.log(data.substring(0, 2000));
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
