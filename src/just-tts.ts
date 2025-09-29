import { EdgeTTS } from '@andresaya/edge-tts';

const config = {
  outputDir: 'src/tts-outputs',
  voice: 'en-US-AndrewNeural',
};

function getSlug(index: number): string {
  return `${new Date().getTime() + index}`;
}

async function generateAudio(payload: string, slug: string): Promise<void> {
  const tts = new EdgeTTS();

  await tts.synthesize(payload, config.voice);
  const filePath = await tts.toFile(`${config.outputDir}/${slug}`);

  console.log(` [INFO] Audio successfully saved on ${filePath}`);
}

async function main() {
  // Put your Language Islands here
  const text = `
  `;

  const sentences = text
    .trim()
    .split('\n')
    .filter((sentence) => sentence.length > 0);

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    if (!sentence) continue;
    if (typeof sentence !== 'string') continue;
    if (sentence.length < 1) continue;

    await generateAudio(sentence, getSlug(i));
  }
}

main();
