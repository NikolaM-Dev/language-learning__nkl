#!/usr/bin/env bash

function main() {
	today=$(date '+%F')

	echo " [INFO] Generating $today Language Islands"
	bun run src/tts.ts -t "src/language-islands/main-domains/$today.txt"

	echo " [INFO] Building $today Language Islands audio"
	ffmpeg \
		-f concat \
		-safe 0 \
		-i <(find "/home/nikola/w/2-areas/english/language-learning__nkl/src/tts-outputs" -iname "*--*" -printf "file '%p'\n" | sort) \
		-c copy \
		"$today.mp3"

	echo " [INFO] Moving $today Language Islands audio to tts-outputs"
	mv "$today.mp3" ./src/language-islands/main-domains/

	echo " [INFO] Deleting rest of audios"
	rm -f ./src/tts-outputs/*.mp3
}

main
