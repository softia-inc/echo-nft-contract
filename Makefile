init:
	npm install
	cp .env.example .env
node:
	npx hardhat node
testing:
	npx hardhat test --network localhost
build:
	npx hardhat compile
deploy-test:
	npx hardhat run scripts/deploy.js --network matic
