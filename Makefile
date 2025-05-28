freeze:
	pip freeze > requirements.txt

install:
	pip install -r requirements.txt

backup:
	git add -A
	git commit -m "feat: Add more material"
	git push origin HEAD