import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.jsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('./src');
for (let file of files) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('<Link ') || content.includes('<Link>') || content.includes('<Link\n')) {
        if (!content.includes('import { Link }') &&
            !content.includes('import {Link}') &&
            !content.includes('import { Link,') &&
            !content.includes('import {Link,') &&
            !content.includes(', Link }') &&
            !content.includes(', Link}')) {
            console.log('MISSING LINK IMPORT IN:', file);
        }
    }
}
console.log('DONE CHECKING');
