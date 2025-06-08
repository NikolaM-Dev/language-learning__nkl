import { getFormattedSentences } from './format-sentences';

// Paste here your google shells Language Islands
const googleSheetsCells = `
`;

const sentences = getFormattedSentences(googleSheetsCells);
const pronouns = sentences.map((sentence) => sentence.split(' ')[0]);

console.log(pronouns.join('\n'));
