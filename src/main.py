import asyncio
import os
import sys

import edge_tts


def get_args() -> tuple[str, str]:
    if len(sys.argv) != 3:
        print(f"[ERROR]: Usage python {sys.argv[0]} <language-island> <output-dir>")
        sys.exit(1)

    return sys.argv[1], sys.argv[2]


def get_raw_sentences(filename: str) -> list[str]:
    with open(filename) as language_islands:
        raw_sentences: list[str] = []
        raw_sentences = language_islands.read().split("\n")
        raw_sentences = list(
            filter(lambda sentence: len(sentence.strip()) > 0, raw_sentences)
        )

        return raw_sentences


def verify_sentence(sentence: str) -> str:
    verified_sentence = sentence

    verified_sentence = sentence.strip()

    if not verified_sentence.endswith((".", "!", "?")):
        verified_sentence += "."

    return verified_sentence


def get_formatted_sentences(sentences: list[str]) -> list[str]:
    formatted_sentences: list[str] = []
    for sentence in sentences:
        verified_sentence = verify_sentence(sentence) + "\n"

        for _ in range(5):
            formatted_sentences.append(verified_sentence)

    return formatted_sentences


def format_tts_text(sentences: list[str]) -> str:
    return "".join(sentences)


def save_exercise(file_path: str, content: str) -> None:
    with open(file_path, "w") as file:
        file.write(str(content))


def get_tts_text(language_island: str, filename: str, output_dir: str) -> str:
    raw_sentences = get_raw_sentences(language_island)
    formatted_sentences = get_formatted_sentences(raw_sentences)

    tts_text = format_tts_text(formatted_sentences)

    save_exercise(f"{output_dir}/{filename}", tts_text)

    return tts_text


async def amain() -> None:
    """Main function"""

    language_island, output_dir = get_args()
    filename = os.path.basename(language_island)

    tts_text = get_tts_text(language_island, filename, output_dir)

    communicate = edge_tts.Communicate(tts_text, "en-US-AndrewNeural")

    await communicate.save(f"{output_dir}/{filename.replace(".md", "")}.mp3")


if __name__ == "__main__":
    asyncio.run(amain())
