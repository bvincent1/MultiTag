include .env

install:
	npm install

test:
	node test.js

deploy:
	sls deploy
