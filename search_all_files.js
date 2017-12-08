const fs = require('fs');
const open = require('open');
const prompt = require('prompt');
const recursive = require('recursive-readdir');

const QUERY = 'хлеб';

recursive('.').then(files => {
    process_query(files, 0, 10, QUERY);
}).catch(error => {
    console.log('Error: ' + error);
});

function process_query(files, start, max_results, query) {
    let results = [];
    let i;
    for (i = start; i < files.length && results.length < max_results; ++i) {
        let filepath = files[i];
        let content = fs.readFileSync(filepath).toString().toLowerCase();
        if (content.includes(query)) {
            console.log(i + ': ' + filepath);
            results.push(filepath);
        }
    }
    if (i < files.length) {
        prompt.start();
        prompt.get(['browser', 'more'], (err, result) => {
            if (err) {
                console.log(err);
                return;
            }

            if (result['browser'] === 'y') {
                results.forEach(result => open('http://localhost:8080/' + result));
            }

            if (result['more'] !== 'n') {
                process_query(files, i, max_results, query);
            }
        });
    }
    else {
        prompt.get(['browser'], (err, result) => {
            if (err) {
                console.log(err);
                return;
            }

            if (result['browser'] === 'y') {
                results.forEach(result => open('http://localhost:8080/' + result));
            }
        })
    }
}