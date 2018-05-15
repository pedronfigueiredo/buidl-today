# Buidl.Today

An app that uses the technology of the blockchain to keep you accountable and help you ship great work.

## Installation

- Clone the main project

`git clone https://github.com/pedronfigueiredo/buidl-today.git`

- Clone the API repository on the same file path

`git clone https://github.com/pedronfigueiredo/buidl-api.git`

- Install dependencies

`npm install`

- Install MongoDB (version 3+)

- Install tmux

- Copy your metamask private key and store it as a `metamask-mnemonic.txt` on the main repo (it'll be ignored by git).

## Bullet Point Overview Of The Stack
- **React**/**Redux** for the frontend.

- API is written in **Node.JS**.

- Database in **Mongo DB**.

- Blockchain layer for storing stakes and mediating payments written in **Solidity**.

- Frontend is hosted on **GitHub Pages**.

- Backend is hosted on **Heroku**.

- Database is hosted on **mLab**.

## Why are there two repos?
GitHub Pages doesn't support dinamic pages, so we needed to host the API in Heroku. A separated repo did the trick.

The secondary repo has two remotes, one on GitHub for browsing purposes, and another one on the Heroku account.

## Notable Scripts

- `npm run start` - Start tmux panes that will fire up the entire dev environment.

- `npm run dev` - Starts frontend and backend development.

- `npm run redeploy` - Deploy contract to rinkeby, sync server code to the secondary repo, build the frontend and push it to github Pages.

## Reset local database

Inside the mongo console, switch to the relevant database

`use buidltoday`

and

`db.dropDatabase();`
