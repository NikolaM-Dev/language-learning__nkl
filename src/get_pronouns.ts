// Paste here your google shells Language Islands
const googleSheetsCells = `
`;

const sentences = googleSheetsCells.trim().split('\n');
const pronouns = sentences.map((sentence) => sentence.split(' ')[0]);

console.log(pronouns.join('\n'));
