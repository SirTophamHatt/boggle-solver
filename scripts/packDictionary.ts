import { createReadStream, writeFileSync } from 'fs';
import { resolve } from 'path';
import { createInterface } from 'readline';

const { Trie } = require('dawg-lookup');

var trie = new Trie();

// TODO combine 16 letter word dictionary and sort
// TODO filter Q words where Q is not followed by U
console.time('pack');
createInterface({
    input: createReadStream(resolve(__dirname, '../lib', 'Collins Scrabble Words (2019).txt'), 'utf-8')
}).on('line', (line: string) => {
    if (line.length >= 3 && line.length <= 16) {
        trie.insert(line.toLowerCase());
    }
}).on('close', () => {
    writeFileSync(resolve(__dirname, '../lib', 'packed-dictionary.txt'), trie.pack(), 'utf-8');
    console.timeEnd('pack');
});
