import { EdgeTTS } from '@andresaya/edge-tts';

import {
  parseArgs,
  type ParseArgsConfig,
  type ParseArgsOptionsConfig,
} from 'util';

interface IArgs {
  text: string;
}

const config = {
  outputDir: 'src/tts-outputs',
  voice: 'en-US-AndrewNeural',
};

function getArgs(): IArgs {
  const options: ParseArgsOptionsConfig = {
    text: {
      short: 't',
      type: 'string',
    },
  };

  const { values, positionals } = parseArgs({
    allowPositionals: true,
    args: Bun.argv,
    options,
    strict: true,
  });

  if (
    Object.keys(values).length === 0 ||
    Object.keys(values).length > Object.keys(options).length
  ) {
    throw new Error(` [ERROR] Usage: ${positionals[1]} [text]`);
  }

  return values as unknown as IArgs;
}

function getSlug(): string {
  return new Date().getTime().toString();
}

async function generateAudio(payload: string): Promise<void> {
  const tts = new EdgeTTS();

  await tts.synthesize(payload, config.voice);
  const filePath = await tts.toFile(`${config.outputDir}/${getSlug()}`);

  console.log(` [INFO] Audio successfully saved on ${filePath}`);
}

async function main() {
  const { text } = getArgs();

  await generateAudio(text);
}

main();
