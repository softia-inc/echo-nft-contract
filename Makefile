init:
	npm install
testing:
	npx hardhat test --network matic
build:
	npx hardhat compile
deploy-test:
	npx hardhat run scripts/deploy.js --network matic
mint-test:
	npx hardhat run scripts/mint.js --network matic
