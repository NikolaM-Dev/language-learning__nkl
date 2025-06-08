freeze:
	pip freeze > requirements.txt

install:
	pip install -r requirements.txt

backup:
	git add -A
	git commit -m "feat: Add more material"
	git push origin HEAD

pronouns:
	bun run src/lib/get-pronouns.ts | add_to_clipboard

t3chat:
	bun run src/lib/after-t3-chat.ts | add_to_clipboard