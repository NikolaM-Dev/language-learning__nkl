```ts
async function main(): Promise<void> {
  const file = Bun.file('language-islands/uwu/uwu2.md');
  const text = await file.text();

  let sentencesGroup: string[][] = [];
  let currentIndex = 0;
  text.split('\n').forEach((sentence, i) => {
    if ((i + 1) % 50 === 0) {
      currentIndex++;
    }

    sentencesGroup[currentIndex] ??= [];

    sentencesGroup[currentIndex].push(sentence);
  });

  for (const sentences of sentencesGroup) {
    const text = sentences.join('\n');
    await generateAudio(text);
  }
}
```
