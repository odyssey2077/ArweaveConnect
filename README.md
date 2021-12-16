# MetaWorld

## Introduction
[MetaWorld](https://arweave.net/vyiTwpjtM_hBEDLoghhsKovaeaIvXlP056Dx9nDcx08) is a Web 3.0 social dApp built on Arweave. In the Web 2.0 world, giant tech companies like Facebook and Tencent control everyone's social connection data and monetize them. In MetaWorld, we democratize social data by building a social connection graph which is permissionless and open source. We store the social connection graph on Arweave, which is a dencentralized permanent storage protocol under which everyone can access the data.

Detailed Functionalities:
- Support social actions like follow, unfollow, get_followings, get_followers through a Dapp deployed on permaweb.
- Support api requests through url https://metaworld-server.herokuapp.com/api/... for following, unfollow, get_followings, get_followers, so 3rd party developers can build the graph together.
- Deployed on both on permaweb (client) and heroku (both client and server)
- Login / sign transactions through MetaMask. Validate submitted address is valid eth address.
- To make the social connection data publicly available, we store the database on arweave for easy access. Currently the database is updated upon every update due to low QPS, it's also very easy to change to update based on frequency and hash.
- The data is stored in csv format to save storage spaces and can be accessed from the latest transaction here https://viewblock.io/arweave/address/C1_74lWo_yaWC3ex9O25nanuuZBFoCH9QF79OCibMiw

This project is for a [gitcoin hackathon](https://gitcoin.co/issue/cyberconnecthq/cyberconnect-arweave/1/100027167). 

## Stack

Backend: Flask

Frontend: React.js

ETH related logic: Web3.js

Data storage: sqlite3(server) + arweave(blockchain)

Deployment: permaweb(client) + heroku(api)

## API Server

https://metaworld-server.herokuapp.com/api/

## Web Interface

permaweb: https://arweave.net/vyiTwpjtM_hBEDLoghhsKovaeaIvXlP056Dx9nDcx08

(or) heroku: https://metaworld-server.herokuapp.com/

![image](https://user-images.githubusercontent.com/93571620/146323965-93a88a47-e66c-4cd4-9a9d-04431c04d9c2.png)


## Install

Make sure you are using Node 14.x
```
npm install -g n
sudo n 14
```

Install dependencies
```
pip3 install -r requirements.txt
cd web && npm install --force && cd ..
```

## Dev

Frontend + Backend: http://localhost:5000/

In one tab
```
FLASK_ENV=development python3 app.py
```

In another tab
```
cd web
npm start
```
Also need metamask to interact with the dApp.

## Build & Deploy

### API server

API server is automatically deployed to heroku upon every push.

### Client

Build & package js/css/html into one single file
```
cd web && npm run build && npx gulp
```

Deploy on permaweb
```
arweave deploy build/index.html
```

