import { getFormattedSentences } from './format-sentences';

const t3ChatSentences = `
`;

const formattedSentences = getFormattedSentences(t3ChatSentences);
const sentences: string[] = formattedSentences.map((s) => s.split(': ')[1]);

console.log(sentences.join('\n'));
