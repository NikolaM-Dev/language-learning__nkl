import { EdgeTTS } from '@andresaya/edge-tts';
import { parseArgs, type ParseArgsOptionsConfig } from 'util';

interface IArgs {
  slug: string;
  text: string;
}

const config = {
  outputDir: 'src/tts-outputs',
  voice: 'en-US-AndrewNeural',
};

function getArgs(): IArgs {
  const options: ParseArgsOptionsConfig = {
    text: { short: 't', type: 'string' },
  };

  const { values, positionals } = parseArgs({
    allowPositionals: true,
    args: Bun.argv,
    options,
    strict: true,
  });

  if (Object.keys(values).length !== Object.keys(options).length) {
    throw new Error(` [ERROR] Usage: ${positionals[1]} [text] [slug]`);
  }

  return values as unknown as IArgs;
}

function getSlug(index: number): string {
  return `${index}--${new Date().getTime()}`;
}

async function generateAudio(payload: string, slug: string): Promise<void> {
  const tts = new EdgeTTS();

  await tts.synthesize(payload, config.voice);
  const filePath = await tts.toFile(`${config.outputDir}/${slug}`);

  console.log(` [INFO] Audio successfully saved on ${filePath}`);
}

async function parseText(payload: string): Promise<string> {
  if (!payload.includes('.txt')) return payload;

  const file = Bun.file(payload);
  return await file.text();
}

function getSentences(payload: string, factor = 5): string[] {
  let sentences: string[] = [];
  const cleanedSentences = payload
    .split('\n')
    .filter((sentence) => sentence.trim().length > 0)
    .filter((sentence) => {
      const sentenceCopy = sentence;
      const lastChar = [...sentenceCopy].pop()!;

      return ['.', '?', '!'].includes(lastChar);
    });

  cleanedSentences.forEach((sentence) => {
    for (let i = 0; i < factor; i++) {
      sentences.push(sentence);
    }
  });

  return sentences;
}

function getGroupSentences(sentences: string[], factor = 20): string[][] {
  let groupedSentences: string[][] = [];
  let currentIndex = 0;
  sentences.forEach((sentence, i) => {
    if ((i + 1) % factor === 0) {
      currentIndex++;
    }

    groupedSentences[currentIndex] ??= [];
    // @ts-ignore, This is validated using the Nullish coalescing assignment
    groupedSentences[currentIndex].push(sentence);
  });

  return groupedSentences;
}

async function generateAudios(groupedSentences: string[][]): Promise<void> {
  const promises = groupedSentences.map((sentencesList, i) => {
    const text = sentencesList.join('\n');
    const slug = getSlug(i);

    return generateAudio(text, slug);
  });

  await Promise.all(promises);
}

async function main() {
  const { text } = getArgs();

  const parsedText = await parseText(text);
  const sentences = getSentences(parsedText);
  const groupedSentences = getGroupSentences(sentences);

  await Bun.write(text, sentences.join('\n'));
  await generateAudios(groupedSentences);
}

main();
