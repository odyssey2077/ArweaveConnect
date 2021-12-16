import './assets/App.css';
import './assets/main.css'

import React from 'react';
import Web3 from 'web3'
import { Web3ReactProvider } from "@web3-react/core";

import Home from "./Home";

function getLibrary(provider) {
  return new Web3(provider) // this will vary according to whether you use e.g. ethers or web3.js
}

export default function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <div className="App">
        <Home />
      </div>
    </Web3ReactProvider>
  );
}
