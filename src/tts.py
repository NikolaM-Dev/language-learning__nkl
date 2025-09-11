import asyncio
import sys

import edge_tts


def get_args() -> list[str]:
    """
    Purpose: Get the list of args
    """
    args = sys.argv[1:]  # slice to exclude the script name itself
    return args


# end def


async def amain() -> None:
    """
    Purpose: Generate an audio using the preset voice using aync/await
    """
    text, output_file = get_args()

    # To see more voices `uvx edge-tts --list-voices`
    voice = "en-US-AndrewNeural"

    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(output_file)


# end def

if __name__ == "__main__":
    asyncio.run(amain())


# end main
