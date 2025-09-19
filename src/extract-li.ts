import { parseArgs, type ParseArgsOptionsConfig } from 'util';

interface IArgs {
  readonly filePath: string;
}

function getArgs(): IArgs {
  const options: ParseArgsOptionsConfig = {
    filePath: { short: 'f', type: 'string' },
  };

  const { values, positionals } = parseArgs({
    allowPositionals: true,
    args: Bun.argv,
    options,
    strict: true,
  });

  if (Object.keys(values).length !== Object.keys(options).length) {
    throw new Error(` [ERROR] Usage: ${positionals[1]} [text]`);
  }

  return values as unknown as IArgs;
}

async function getText(filePath: string): Promise<string> {
  const file = Bun.file(filePath);
  return await file.text();
}

function getLanguageIslands(text: string): string[] {
  const languageIslands: string[] = [];

  let lastLanguageIsland = '';
  text
    .trim()
    .split('\n')
    .forEach((sentence) => {
      if (sentence !== lastLanguageIsland) {
        languageIslands.push(sentence);
        lastLanguageIsland = sentence;
      }
    });

  return languageIslands;
}

async function main() {
  const { filePath } = getArgs();
  const text = await getText(filePath);
  const languageIslands = getLanguageIslands(text);

  console.log(languageIslands.join('\n'));
}

main();
