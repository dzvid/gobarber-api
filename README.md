<!--
*** Thanks for checking out this README Template. If you have a suggestion that would
*** make this better, please fork the repo and create a pull request or simply open
*** an issue with the tag "enhancement".
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/dzvid/gobarber-api">
    <img src="logo-purple.svg" alt="Logo" width="200" height="50">
  </a>

  <h3 align="center">GoBarber</h3>

  <p align="center">
    Backend module
    <br />
    <a href="https://github.com/dzvid/gobarber-api"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://tukno-gobarber-api.herokuapp.com/">View Demo</a>
    ·
    <a href="https://github.com/dzvid/gobarber-api/issues">Report Bug</a>
    ·
    <a href="https://github.com/dzvid/gobarber-api/issues">Request Feature</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->

## Table of Contents

- [Table of Contents](#table-of-contents)
- [About The Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
    - [Using Docker Compose](#using-docker-compose)
    - [Creating containers manually](#creating-containers-manually)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)

<!-- ABOUT THE PROJECT -->

## About The Project

GoBarber is an application that aims to facilite the connection between barbers and clients. This repository contains the backend module and was developed during the Rocketseat Gostack bootcamp.

### Built With

Main technologies, libraries and CLI tools used to built the API:

- [Node.js](https://nodejs.org/): Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine;
- [PostgreSQL](https://www.postgresql.org/): a powerful, open source object-relational database system with over 30 years of active development that has earned it a strong reputation for reliability, feature robustness, and performance;
- [Redis](https://redis.io/): Redis is an open source (BSD licensed), in-memory data structure store, used as a database, cache and message broker;
- [MongoDB](https://www.mongodb.com/): A document-based NoSQL database;
- [Docker](https://www.docker.com/): Docker containers wrap up software and its dependencies into a standardized unit for software development that includes everything it needs to run: code, runtime, system tools and libraries. This guarantees that your application will always run the same and makes collaboration as simple as sharing a container image;
- [node.bcrypt.js](https://github.com/kelektiv/node.bcrypt.js): A simple, fast, robust job/task queue for Node.js, backed by Redis;
- [Bee queue](https://github.com/bee-queue/bee-queue): A simple, fast, robust job/task queue for Node.js, backed by Redis;
- [Date-fns](https://github.com/date-fns/date-fns): Modern JavaScript date utility library;
- [Express](https://github.com/expressjs/express): Fast, unopinionated, minimalist web framework for node;
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken): An implementation of JSON Web Tokens;
- [Mongoose](https://github.com/Automattic/mongoose): MongoDB object modeling designed to work in an asynchronous environment;
- [Multer](https://github.com/expressjs/multer): Node.js middleware for handling `multipart/form-data`;
- [Nodemailer](https://github.com/nodemailer/nodemailer): Send e-mails with Node.JS – easy as cake!
- [Sequelize](https://github.com/sequelize/sequelize): An easy-to-use multi SQL dialect ORM for Node.js

To manage the code style and formatting:

- [ESLint](https://github.com/eslint/eslint)
- [Prettier](https://github.com/prettier/prettier)
- [EditorConfig](https://editorconfig.org/)

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these steps.

### Prerequisites

- Install Node.js: Follow the official [tutorial](https://nodejs.org/en/)

- Install a package manager for node:

  - Yarn: [Check yarn tutorial](https://classic.yarnpkg.com/lang/en/) (Yarn 1.x (classic) was used in this project).

    or

  - npm (comes with Node.js):

    ```sh
    npm install npm@latest -g
    ```

- Install Docker: Follow the official [tutorial](https://docs.docker.com/install/).

### Installation

To install the project there are two alternatives:

- Using Docker Compose;
- Creating Docker containers manually.

#### Using Docker Compose

1. Clone the repository and navigate to the project directory:

   ```sh
   Using ssh:

   git clone git@github.com:dzvid/gobarber-api.git
   cd gobarber-api

   Or using https:

   git clone https://github.com/dzvid/gobarber-api.git
   cd gobarber-api
   ```

2. Create the `.env` file for the environment variables values of the application. You can use the `.env.example` as a template:

   ```sh
   cp .env.example .env
   ```

   Edit the file and set the values for the mailing service, relational and non-relational database services and Sentry token.

   For the mailing service you can use [Mailtrap](https://mailtrap.io/) to create a email for development and testing purposes.

   For the Sentry DSN token its necessary to create an account in [Sentry](https://sentry.io/signup/) and follow the instructions to generate it.

   Make sure the values were declared because they are used in the `docker-compose.yml` file to create the containers.

3. Create and start the containers using Composer. Open a terminal window and run the following command:

   ```sh
   docker-compose up
   ```

4. Run sequelize migrations to create the PostgreSQL database tables:

   ```sh
   yarn sequelize db:migrate
   ```

5. At this moment the GoBarber API service runs at: `http://localhost:3333`

6. You are done with configuration! I hope everything is alright and you are ready to code! :tada:

#### Creating containers manually

1. Create Docker containers, run the following commands in a terminal (feel free to change the container names and passwords as you wish):

   - Create PostgreSQL container:
     ```sh
     docker run --name gobarber -e POSTGRES_PASSWORD=gobarberdev -p 5432:5432 -d --restart always postgres
     ```
   - Create MongoDB container:

     ```sh
     docker run --name mongo_gobarber -p 27017:27017 -d -t --restart always mongo
     ```

   - Create Redis container:
     ```sh
     docker run --name redis_gobarber -p 6379:6379 -d -t --restart always redis:alpine
     ```

2. Create GoBarber database in PostgreSQL:

   ```sh
   # Open PostgreSQL container terminal
   docker exec -it gobarber /bin/sh

   # Change to postgres user
   su postgres

   # Enter postgres CLI
   psql

   # Create the database
   CREATE DATABASE gobarber;

   # Check if the database was created, run:
   \list
   ```

3. Clone the repository:

   ```sh
   Using ssh:
   git clone git@github.com:dzvid/gobarber-api.git

   Or using https:
   git clone https://github.com/dzvid/gobarber-api.git
   ```

4. Install the project dependencies:

   ```sh
   cd gobarber-api

   yarn
   ```

   or using npm:

   ```sh
   cd gobarber-api

   npm install
   ```

5. Create the `.env` file for the environment variables values of the application. You can use the `.env.example` as a template:

   ```sh
   cp .env.example .env
   ```

   Edit the file and set the values according to the values previously used during the creation of the containers.

   For the mailing service you can use [Mailtrap](https://mailtrap.io/) to create a email for development and testing purposes.

   For the Sentry DSN token its necessary to create an account in [Sentry](https://sentry.io/signup/) and follow the instructions to generate it.

6. Run sequelize migrations to create the database tables:

   ```sh
   yarn sequelize db:migrate
   ```

7. Open a terminal window and start the queue service (Reponsible to deliver emails):

   ```sh
   yarn queue
   ```

8. Open another terminal window and start the development server:

   ```sh
   yarn dev
   ```

   The GoBarber API runs at: `http://localhost:3333`

9. You are done with configuration! I hope everything is alright and you are ready to code! :tada:

<!-- USAGE EXAMPLES -->

<!-- ## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_ -->

<!-- ROADMAP -->

<!-- ## Roadmap

See the [open issues](https://github.com/dzvid/gobarber-api/issues) for a list of proposed features (and known issues). -->

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->

## Contact

David Oliveira - oliveiradavid.dev@gmail.com

Project Link: [https://github.com/dzvid/gobarber-api](https://github.com/dzvid/gobarber-api)

<!-- ACKNOWLEDGEMENTS -->

## Acknowledgements

- [Best-README-Template](https://github.com/othneildrew/Best-README-Template)
- [Choose an Open Source License](https://choosealicense.com)
- [Img Shields](https://shields.io)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/dzvid/gobarber-api.svg?style=flat-square
[contributors-url]: https://github.com/dzvid/gobarber-api/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/dzvid/gobarber-api.svg?style=flat-square
[forks-url]: https://github.com/dzvid/gobarber-api/network/members
[stars-shield]: https://img.shields.io/github/stars/dzvid/gobarber-api.svg?style=flat-square
[stars-url]: https://github.com/dzvid/gobarber-api/stargazers
[issues-shield]: https://img.shields.io/github/issues/dzvid/gobarber-api.svg?style=flat-square
[issues-url]: https://github.com/dzvid/gobarber-api/issues
[license-shield]: https://img.shields.io/github/license/dzvid/gobarber-api.svg?style=flat-square
[license-url]: https://github.com/dzvid/gobarber-api/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat-square&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/dzvid
