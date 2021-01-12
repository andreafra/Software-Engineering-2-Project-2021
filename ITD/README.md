# Implementation and Test Delieverable

This folder contains the description of how we implemented and tested the project described in the RASD and DD.

## Setup

This project is developed in JavaScript and run on NodeJS.

- Install [NodeJS](https://nodejs.org/), possibly the LTS version. 
    - If you use tools such `nvm`, please run `nvm install --lts` and `nvm use --lts`
- Open the terminal and run `npm install -g yarn` to install the packet manager we're using, [Yarn](https://yarnpkg.com)
- If you are developing this project, installing [Nodemon](https://github.com/remy/nodemon) is recommended `npm install -g nodemon`. Please note that it's already included in the *developer dependencies*
- Clone this repo using either one of the following commands
    - `git clone https://github.com/ian-ofgod/DiDioLavoreFuscoFranchini-CLup`
    - `gh repo clone ian-ofgod/DiDioLavoreFuscoFranchini-CLup`
- Change directory into the ITD folder `cd DiDioLavoreFuscoFranchini-CLup/ITD`
- Run `yarn install` to install the dependencies

Everything should be installed correctly now. Try running one of the following commands
- Run `yarn develop` to run the developer server
- Run `yarn test` to run the test suite with [Jest](https://jestjs.io)