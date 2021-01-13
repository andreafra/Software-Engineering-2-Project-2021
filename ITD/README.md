# Implementation and Test Delieverable

This folder contains the description of how we implemented and tested the project described in the RASD and DD.

## Setup

This project is developed in JavaScript and run on NodeJS. You'll have to install a couple of tools in order to get started.

### Installing the toolchain

- Install [NodeJS](https://nodejs.org/), possibly the LTS version.
  - If you use tools such `nvm`, please run `nvm install --lts` and `nvm use --lts`
- Open the terminal and run `npm install -g yarn` to install the packet manager we're using, [Yarn](https://yarnpkg.com)
- If you are developing this project, installing [Nodemon](https://github.com/remy/nodemon) is recommended `npm install -g nodemon`. Please note that it's already included in the _developer dependencies_
- Clone this repo using either one of the following commands
  - `git clone https://github.com/ian-ofgod/DiDioLavoreFuscoFranchini-CLup`
  - `gh repo clone ian-ofgod/DiDioLavoreFuscoFranchini-CLup`
- Change directory into the ITD folder `cd DiDioLavoreFuscoFranchini-CLup/ITD`
- Run `yarn install` to install the dependencies

### Setting up the database

#### The easy way: using Docker

You'll have to install [Docker](https://www.docker.com/) or an equivalent on your device, and make sure [docker-compose](https://docs.docker.com/compose/install/) is installed.

- Run `docker-compose up -d` to spin up the images specified in the `docker-compose.yml` file.

Visit [http://localhost:8081](http://localhost:8081) to see if [Adminer](https://www.adminer.org) is running, and log in with
the credentials specified in the `.env` file.

#### The hard way: do it yourself

- Install [MySQL](https://www.mysql.com) server somewhere, then create a schema and a user with the credentials found in the `.env` file, otherwise create your own and edit the `.env` file.

The `.env` file looks like this:

```bash
# Database credentials
DB_ADDRESS="localhost"
DB_USERNAME="clup_admin"
DB_PASSWORD="clup"
DB_NAME="db_clup"
```

### Verify the installation

Everything should be installed correctly now. Try running one of the following commands

- Run `yarn server-dev` to run the developer server
- Run `yarn client-dev` to run the client server
- Run `yarn client-build` to compile the client package (output is in `dist`)
- Run `yarn test` to run the test suite with [Jest](https://jestjs.io)

### TL;DR

_NodeJS_ has _npm_ which we use to install _yarn_ which we use to install all _dependencies_. We use _parcel_ to build and bundle our _client web application_, we use _express_ to implement the _server_ and _REST API_. Optionally, we can use _docker_ to run _MySQL_.

# What-does-what

We use multiple tools to make the development process easier:

- [Yarn](https://yarnpkg.com/) is a packet manager, it's faster than the NodeJS bundled one (_npm_) and it's installed on a per-project basis.
- [Parcel](https://parceljs.org/) is a web application bundler, we use it to bundle (basically _compiling_ for the modern web) the client web application, which is comprised of JavaScript (with some [special syntax](https://reactjs.org/docs/introducing-jsx.html)), HTML, CSS and images into a compressed and easy-to-deploy format. The output is saved in the `dist` folder and is meant to be uploaded on a static server/CDN.
- [https://jestjs.io/] is a testing framework for JavaScript. It's very efficient and allows to test many facets of the service, such as rendered HTML or server side database integration through its extensions.
- [Express](https://expressjs.com/) is a web framework for NodeJS, it makes developing a server and a REST API much easier thanks to a straighforward syntax.

- [Docker](https://docker.com) is an container engine that we use to run the MySQL database image.
