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

## Prerequisites and Config requirements
* **Any NodeJS version above 16 is okay [Download NodeJS](https://nodejs.org/en/download)**
* **MongoDB url to access database and save account's data is needed [MongoDB atlas](https://www.mongodb.com/atlas/database)**
* 

## Installation
### Node Modules
* **You can use any package manager such as npm,pnpm or bun. But for the sake of popularity, npm will be used in this guide**
