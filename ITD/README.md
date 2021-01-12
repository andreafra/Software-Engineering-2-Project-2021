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
- Run `yarn server-dev` to run the developer server
- Run `yarn client-dev` to run the client server
- Run `yarn client-build` to compile the client package (output is in `dist`)
- Run `yarn test` to run the test suite with [Jest](https://jestjs.io)

## TL;DR

`NodeJS` -> `npm` -> `yarn` -> `all dependencies` -> (`parcel` -> `bundled client web app`| `express` -> `server and REST API`)

# What-does-what

We use multiple tools to make the development process easier:
- [Yarn](https://yarnpkg.com/) is a packet manager, it's faster than the NodeJS bundled one (*npm*) and it's installed on a per-project basis.
- [Parcel](https://parceljs.org/) is a web application bundler, we use it to bundle (basically *compiling* for the modern web) the client web application, which is comprised of JavaScript (with some [special syntax](https://reactjs.org/docs/introducing-jsx.html)), HTML, CSS and images into a compressed and easy-to-deploy format. The output is saved in the `dist` folder and is meant to be uploaded on a static server/CDN.
- [https://jestjs.io/] is a testing framework for JavaScript. It's very efficient and allows to test many facets of the service, such as rendered HTML or server side database integration through its extensions.
- [Express](https://expressjs.com/) is a web framework for NodeJS, it makes developing a server and a REST API much easier thanks to a straighforward syntax.
