init:
	npm install
testing:
	npx hardhat test --network matic
build:
	npx hardhat compile
deploy:
	npx hardhat run scripts/deploy.ts --network matic
