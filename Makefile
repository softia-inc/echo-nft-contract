init:
	npm install
node:
	npx hardhat node
testing:
	npx hardhat test --network localhost
build:
	npx hardhat compile
deploy-test:
	npx hardhat run scripts/deploy.js --network ropsten
upgrade-test:
	npx hardhat run scripts/upgrade.js --network ropsten
deploy-gl-test:
	npx hardhat run scripts/deploy.js --network rinkeby
upgrade-gl-test:
	npx hardhat run scripts/upgrade.js --network rinkeby
deploy-prod:
	npx hardhat run scripts/deploy.js --network matic
upgrade-prod:
	npx hardhat run scripts/upgrade.js --network matic