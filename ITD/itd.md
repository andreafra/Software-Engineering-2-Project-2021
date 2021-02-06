# Introduction

## Scope

This document describes the implementation and testing process of a working prototype of the service described in the “Requirement Analysis and Specification Document” and ”Design Document”. This document is intended to be a reference for the developer team and explains the choices regarding used software, frameworks, programming languages. It also provide input on how to perform integration testing between the implemented components.

## List of definitions and abbreviations

## Abbreviations

- **RASD** - Requirement Analysis and Specification Document

- **DD** - Design Document

- **JS** - JavaScript

- **R*n*** - Requirement _n_

- **IT*n*** - Integration Test _n_

## Definitions

- **Client** - In this document client means a web app.

## Reference documents

- Requirement Analysis and Specification Document (rasd.pdf)

- Design Document (dd.pdf)

## Document structure

- Chapter 1 presents the requirements that have been implemented in the prototype.

- Chapter 2 presents the adopted programming languages and frameworks, justifying each choice.

- Chapter 3 covers the structure of the source code.

- Chapter 4 explains the testing process in greater detail.

- Chapter 5 provides explanations on how to run, test and build the prototype.

# Implemented Requirements

Requirements have the same nomenclature present in the RASD and DD.

We anticipate that there is no implementation in the prototype of the _Totem_ described in the RASD and DD, as that would require extra hardware to achieving pretty much the same functionality of the client web app. Since the _Totem_ is identified as a client with special privileges, therefore sharing the same endpoint of a normal client, it's only a lack of hardware implementation on the client side.

## Implemented

- R1 - Allow a User to sign up for an Account after providing a mobile phone number.
- R2 - Allow a Registered User to find Stores nearby a specified location.
- R4 - Allow a Registered User to get in the virtual line at a specifiedstore.
- R6 - Allow a Registered User to preview an estimate of the queue time.
- R8 - Allow a Registered User to cancel their reservation.
- R9 - Allow a Registered User to leave the virtual queue.
- R10 - Allow a Registered User ~~and a Totem User~~ to retrieve a scannable QR Code/Barcode that they must present in order to be grantedaccess to a store. _**Note::** We only implemented the part related to the Registered User, who can obtain a digital ticket containing the scannable code through the client web app._
- R12 - The System cancels User reservations in case of a major delay.
- R14 - The System grants a User with a reservation access only within ashort time (set by the manager) after the User’s time of reservation.
- R15 - Allow System Managers to set the division of the maximum num-ber of people allowed between the normal queue, the priority queue for people with special needs and the book a visit slot ca-pacity.
- R16 - The System calculates the average shopping time by recording every time a user enters and exits the store.
- R17 - Allow System Managers to set a limit to the people allowed intothe store at a time.
- R18 - Allow System Managers to choose the frequency and size of thetime slots.
- R20 - Allow System Managers to know the current and past number ofpeople in the store.
- R21 - Allow System Managers to check the current status of the queueand of the time slots.

## Not implemented

- R3 - Allow a Registered User to filter out stores based on availabletimeframes, days and distance. _**Explanation:** while the implementation isn't difficult, implementing this feature would have slowed down the development and testing process._

- R5 - Allow a Totem User to get in the virtual line of the store where thetotem is installed. _**Explanation:** implementing the totem interface it's not really useful for a prototype, since this functionality works identically to a customer's client one._

- R11 - The System notifies the Users affected by delay. _**Explanation:** it requires external paid service that isn't needed for a prototype, especially a web based one. Had we implemented a native mobile app, this feature would have been implemented._

- R13 - The System enforces the limits on the allowed number of con-current Customers inside a store by restricting the access at theentry points (for example, automatic doors or turnstile). _**Explanation:** The Store API component is not implemented in the prototype as it requires custom integrations with existing API or hardware._

- R19 - Allow System Managers to know the average time spent in thestore. _**Explanation:** Same reason of R13, it would require access to an existing store API/hardware._

# Adopted Technologies

The chosen frameworks and technologies have been chosen with regards the Component View (Section 2.2) of the Design Document.

## Frameworks and programming languages

### Back-end

We decided to implement the _Application Server_ with JavaScript and [NodeJS](https://nodejs.org), because it offers great horizontal scalability and generally good performance in handling multiple simultaneous requests.
In order to ease development, we chose the industry standard server framework [ExpressJS](https://expressjs.com/), which allows us to easily implement a REST API for the clients.

The chosen DBMS is [MySQL](https://www.mysql.com/), because it's a time-tested, fast and secure platform.

### Front-end

In order to develop a working prototype in a short timeframe, we decided to implement only the web application client, which offers the same functionalities of a native application, exception made for push notifications. The web app can be also easily ported into a [Progressive Web App (PWA)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps), which allows users to use it offline.

Of course, being the client a web application, the obvious choice regarding suitable programming languages is JavaScript, allowing us to have a codebase written in the same language.

We decided to use an industry-standard framework such as [React](https://reactjs.org/) to better organize the structure of the web app, while maintaing high extendability, modularity and tidiness of the code. In order to make requests against the REST API, we used the new standard [`fetch` API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

### Additional software

In this part other notable tools are briefly explained.

#### Yarn

In order to better organize the project dependencies, it's a wise choice to use a packet manager. By having a codebase written entirely in JS, we adopted [Yarn](https://yarnpkg.com/), a fast and reliable packet manager for JavaScript. It also handles custom scripts to ease the development workflow.

#### Jest

To perform unit and integration testing, we chose [Jest](https://jestjs.io/), an industry-standard JavaScript testing framework.

#### Docker

To easily deploy a configured database for development, we utilized a MySQL image with [Docker](https://www.docker.com/), an industry-standard container solution.

# Source code Structure

TODO

# Testing

TODO

(Refer to DD + procedure, explain at least system tests, would be good to consider integration tests)

# Installation Instructions

Here we report the instructions to install all software dependencies needed to run the service. This instructions are also available in the GitHub repository in the ITD folder.

## Installing the toolchain

- Install [NodeJS](https://nodejs.org/), possibly the LTS version (14.15.4).
  - If you use tools such `nvm`, please run `nvm install --lts` and `nvm use --lts`
- Open the terminal and run `npm install -g yarn` to install the packet manager we're using, [Yarn](https://yarnpkg.com)
- If you are developing this project, installing [Nodemon](https://github.com/remy/nodemon) is recommended `npm install -g nodemon`. Please note that it's already included in the _developer dependencies_, so if you do not wish to install it globally, skip this step.
- Clone the repository using either one of the following commands
  - `git clone https://github.com/ian-ofgod/DiDioLavoreFuscoFranchini-CLup`
  - `gh repo clone ian-ofgod/DiDioLavoreFuscoFranchini-CLup`
- Change directory into the ITD folder `cd DiDioLavoreFuscoFranchini-CLup/ITD`
- Run `yarn install` to install the dependencies

## Setting up the database

You'll have to install [Docker](https://www.docker.com/) on your device, and make sure [docker-compose](https://docs.docker.com/compose/install/) is installed as well.

- Run `docker-compose up -d` to spin up the images specified in the `docker-compose.yml` file.

Visit [http://localhost:8081](http://localhost:8081) to see if [Adminer](https://www.adminer.org) is running, and log in with
the credentials specified in the `.env` file (server: `db`, username: `clup_admin`, password: `clup`, database: `db_clup`).

> ### Alternative without Docker
>
> - Install [MySQL](https://www.mysql.com) server, then create a schema and a user with the credentials found in the `.env` file, otherwise create your own and edit the `.env` file.

- In case of errors about permissions, try running the following command, especially if you are not using Docker:

```SQL
create user clup_admin@localhost identified with mysql_native_password by 'clup';
grant all privileges on * . * to clup_admin@localhost;
```

## Verify the installation

- Run `yarn server-dev` to run the developer server
- Run `yarn client-dev` to run the client server
- Run `yarn client-build` to compile the client package (output is in `dist`)
- Run `yarn test` to run the full test suite with [Jest](https://jestjs.io)
