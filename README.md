# Riot Account Checker

## Introduction
* **This is an API project which was made by me as a side-project. This API connects you with Riot's Valorant Unofficial API to get any account's detail using it's username and password**
* **This project also supports 2FA Multi-Factor Codes to login into an account**
* **This API uses hono as its web-server framework and typescript for type-safety (Though i haven't used much type safety as of now)**
* **This API doesn't store username and password of any account at all and uses Riot's `/reauth` route to Authenticate after session expiration**

## Features
* **Uses MongoDB to store account's data and could be used to cache account's data in future**
* **No storage of username and password of account**
* **Popular and somewhat optimized frameworks, modules are used such as Hono, Typescript**
* **Bun is supported**

## Database Purposes
* **I want to make this sure that database is used not to just store account's data and its details but also to store its cookies to access the Riot's API and also to Re-Authenticate without the use of username and password**

## Prerequisites and Config requirements
* **Any NodeJS version above 16 is okay [Download NodeJS](https://nodejs.org/en/download)**
* **MongoDB url to access database and save account's data is needed [MongoDB atlas](https://www.mongodb.com/atlas/database)**


## Installation
**All the commands are ran in the console assumed to be in the root directory of the project**
### Node Modules
* **You can use any package manager such as npm,pnpm or bun. But for the sake of popularity, npm will be used in this guide**
* ```bash
  npm install
  ```
* This process may take some minutes completely depends on your pkg manager and your internet speed and stability.
* 
### Checking and Filling the Configurations
* **There are configurations of the project in `constants/config.json` file**
* **Make sure to read the comments and fill the config as per your requirement**
* 
### Building the project
* **You can run `build` script from package.json to build the project and output the result in out directory**
* ```bash
  tsc --build
  ```
* This command might take some minutes to be completed, so be patient.
### Starting the Project
* **You can run `start` script to start using the output files from build or `direct-run`/`dev` script to run it directly without using builds**
* ```bash
  npm start
  ```
## Some Other things
**There are server timings built-in and given with the response in headers**<br>
**Refer to [Hono's Docs](https://hono.dev/middleware/builtin/timing)**
**Honestly I don't know why i did this**

## NOTICE
**This is something you'll expect but obviously this is for only educational purposes and doesn't mean to harm or encourage anyone to bring harm to anyone using this tool**
  
