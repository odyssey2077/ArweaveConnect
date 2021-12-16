import React, { useEffect, useState } from 'react';
import { useWeb3React } from "@web3-react/core";
import FollowForm from './FollowForm.js';
import LookupForm from './LookupForm.js';
import Tabs from './Tabs.js';
import Graph from './Graph.js';
import { config } from './Constants'

import { InjectedConnector } from '@web3-react/injected-connector';

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
})


function useData() {
  const [data, setData] = useState({'nodes': [], 'links': []});

  async function getData() {
    const response = await fetch(config.url.API_URL + "/api/social_cloud");
    const data = await response.json();
    setData(data);
  }

  useEffect(() => {
    getData();
  }, []);

  function updateData() {
    getData();
  }

  return { data, updateData };
}

export default function Home() {
  const { active, account, activate, deactivate } = useWeb3React()

  const { data, updateData } = useData();

  async function connect() {
    try {
      await activate(injected);
    } catch (ex) {
      console.log(ex);
    }
  }

  async function disconnect() {
    try {
      deactivate();
    } catch (ex) {
      console.log(ex);
    }
  }

  return (
    <header className="App-header">
      <div className="flex flex-col items-center justify-center connect">
        {active
          ?
          <div>
            <b>{account}</b>
            <button onClick={disconnect} className="py-2 mt-5 ml-5 mb-4 text-lg text-white rounded-lg w-32 bg-blue-600 hover:bg-blue-800">Logout</button>
          </div>
          :
          <div>
            <button onClick={connect} className="py-2 mt-5 ml-5 mb-4 text-lg text-white rounded-lg w-32 bg-blue-600 hover:bg-blue-800">Login</button>
          </div>
        }
      </div>
      <Graph data={data}/>
      <div className='sidebar'>
        <div className="title">MetaWorld</div>
        <Tabs>
          <div label="Lookup"><LookupForm/></div>
          <div label="Follow/Unfollow"><FollowForm account={account} updateData={updateData}/></div>
        </Tabs>
      </div>
    </header>
  )
}
