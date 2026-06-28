const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

// Lê o XLSX desta pasta (_tools/)
const wb = xlsx.readFile(path.join(__dirname, 'Restart.xlsx'));
const ws = wb.Sheets[wb.SheetNames[0]];

// Converte para CSV e salva na raiz do site (pasta pai)
const csv = xlsx.utils.sheet_to_csv(ws);
const dest = path.join(__dirname, '..', 'data.csv');
fs.writeFileSync(dest, csv, 'utf8');

// Stats
const lines = csv.trim().split('\n');
console.log(`✅ Converted successfully!`);
console.log(`   Rows: ${lines.length - 1} (+ 1 header)`);
console.log(`   File: ${dest}`);
console.log(`   Size: ${(fs.statSync(dest).size / 1024).toFixed(1)} KB`);
