# Implementation and Test Delieverable

This folder contains the description of how we implemented and tested the project described in the RASD and DD.

## Ports

Make sure these ports are available if you're trying to setup up the project.

| Port | Service                 |
| ---- | ----------------------- |
| 8080 | Client Server           |
| 3000 | REST API Server         |
| 3306 | MySQL Database          |
| 8081 | Adminer (to inspect DB) |

## Setup

This project is developed in JavaScript and run on NodeJS. You'll have to install a couple of tools in order to get started.

### RECOMMENDED WAY
- Download the content of the ITD folder
- Install Docker and docker-compose
- Navigate to the main directory (the one with the docker-compose.yml file)
- Run: docker-compose up -d
 -To see the internal logs of the NodeJS server: docker logs --follow clup_server
 
NOTE: if you are on Linux (and you haven’t created a docker user) please add "sudo" to the preceding
commands)

### Installing the toolchain (dev setup)

- Install [NodeJS](https://nodejs.org/), possibly the LTS version.
  - If you use tools such `nvm`, please run `nvm install --lts` and `nvm use --lts`
- Open the terminal and run `npm install -g yarn` to install the packet manager we're using, [Yarn](https://yarnpkg.com)
- If you are developing this project, installing [Nodemon](https://github.com/remy/nodemon) is recommended `npm install -g nodemon`. Please note that it's already included in the _developer dependencies_
- Clone this repo using either one of the following commands
  - `git clone https://github.com/ian-ofgod/DiDioLavoreFuscoFranchini-CLup`
  - `gh repo clone ian-ofgod/DiDioLavoreFuscoFranchini-CLup`
- Change directory into the ITD folder `cd DiDioLavoreFuscoFranchini-CLup/ITD`
- Run `yarn install` to install the dependencies

At this point you may really want to install Docker to ease the process on your machine:

- Install [Docker](https://www.docker.com/) on your device, and make sure [docker-compose](https://docs.docker.com/compose/install/) is installed.

If you just want to spin up the whole system, skip to [this section](#atd)

### Setting up the database

#### The easy way: using Docker

- Run `docker-compose up -f docker-compose.dev.yml -d` to spin up the images specified in the `docker-compose.yml` file. _Make sure you have typed .dev.yml not just .yml_

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

The user should be created with the following commands:

```SQL
create user clup_admin@localhost identified with mysql_native_password by 'clup';
grant all privileges on * . * to clup_admin@localhost;
```

### Verify the installation

Everything should be installed correctly now. Try running spinning up the server with the commands described in the next section.

- Run `yarn server-dev` to run the server
- Run `yarn server-debug` to debug the server
  > **How to debug:** In VSCode open the _itd.code-workspace_ project or the ITD folder. Just check that .vscode/launch.json is present.
  > Run `yarn server-debug` to spin up the server in debug mode.
  > Then from the Debug Menu select "Node: Nodemon", click the green "play" button and attach the debugger to the nodemon process (it should be the first one in the list).
- Run `yarn client-dev` to run the client server
- Run `yarn client-build` to compile the client package (output is in `dist`)
- Run `yarn test -i` to run the test suite with [Jest](https://jestjs.io). If you need to pass Jest additional parameters, use `yarn test -- <parameters here>`.
  -  NOTE: Stop the execution of the server before running tests.
  - NOTE: Inside .env change DB_ADDRESS="db" to DB_ADDRESS="localhost"
  - NOTE: Run yarn clear-db before the tests to clear the DB tuples
  - NOTE: To restore the DB status to the DEMO one, run yarn reset-db

<a name="deployment"></a>

## Deployment

When you want to spin up the database, server and the client static server, run the _✨magic command✨_:

```bash
docker-compose -f docker-compose.yml --build
```

It'll build and bring online the system!

If for some reason you have run docker-compose.dev.yml file, shut it down with `docker-compose down`.

### TL;DR

_NodeJS_ has _npm_ which we use to install _yarn_ which we use to install all _dependencies_. We use _parcel_ to build and bundle our _client web application_, we use _express_ to implement the _server_ and _REST API_. Optionally, we can use _docker_ to run _MySQL_.

# What-does-what

We use multiple tools to make the development process easier:

- [Yarn](https://yarnpkg.com/) is a packet manager, it's faster than the NodeJS bundled one (_npm_) and it's installed on a per-project basis.
- [Parcel](https://parceljs.org/) is a web application bundler, we use it to bundle (basically _compiling_ for the modern web) the client web application, which is comprised of JavaScript (with some [special syntax](https://reactjs.org/docs/introducing-jsx.html)), HTML, CSS and images into a compressed and easy-to-deploy format. The output is saved in the `dist` folder and is meant to be uploaded on a static server/CDN.
- [https://jestjs.io/] is a testing framework for JavaScript. It's very efficient and allows to test many facets of the service, such as rendered HTML or server side database integration through its extensions.
- [Express](https://expressjs.com/) is a web framework for NodeJS, it makes developing a server and a REST API much easier thanks to a straighforward syntax.

- [Docker](https://docker.com) is an container engine that we use to run the MySQL database image.
