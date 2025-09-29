#!/usr/bin/env bash

function main() {
	if [ -z "$1" ]; then
		echo "Usage: $0 [path-to-text-file]"
		exit 1
	fi

	text_path="$1"
	text_file=$(basename "$text_path")
	name="${text_file%.*}" # remove extension
	text_parent_path="${text_path%/*}"

	echo " [INFO] Deleting previous audio files"
	rm -f ./src/tts-outputs/*.mp3

	echo " [INFO] Removing duplicated Language Islands for $name"
	bun run ./src/extract-li.ts -f "$text_path" >"${text_path}.tmp" && mv "${text_path}.tmp" "$text_path"

	echo " [INFO] Generating $name Language Islands"
	bun run src/tts.ts -t "$text_path"

	echo " [INFO] Building $name Language Islands audio"
	ffmpeg \
		-f concat \
		-safe 0 \
		-i <(find "/home/nikola/w/2-areas/english/language-learning__nkl/src/tts-outputs" -iname "*--*" -printf "file '%p'\n" | sort) \
		-c copy \
		"$name.mp3"

	echo " [INFO] Moving $name Language Islands audio to $text_path"
	mv "$name.mp3" $text_parent_path

	echo " [INFO] Deleting rest of audios"
	rm -f ./src/tts-outputs/*.mp3
}

main "$@"
