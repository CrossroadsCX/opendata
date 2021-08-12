import request from 'request';
import cheerio from 'cheerio';

export default function pullLinks(targetUrl, _searchTerm) {
    request(targetUrl, function(err, res, body) {
        const $ = cheerio.load(body);
        const links = $('a');
        console.log(links)
        $(links).each(function(i, link){
            console.log($(link.text() + ':\n   ' + $(link).targetUrl('href')))
        });
    })
}
