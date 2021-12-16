import React, { useEffect, useState } from 'react';
import { config } from './Constants'
import { ethers } from "ethers";


export default function Followings(props) {
  const [followings, setFollowings] = useState(null);

  async function getData() {
    const response = await fetch(config.url.API_URL + "/api/followings/" + props.account);
    const data = await response.json();
    setFollowings(data);
  }

  useEffect(() => {
    getData();
  }, [props]);

  async function onClick(following) {
    const data = {
      'from_addr':props.account,
      'to_addr':following.to_addr,
      'namespace':following.namespace,
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    data['signature'] =  await signer.signMessage(JSON.stringify(data));

    fetch(config.url.API_URL + '/api/followings', {
      method: 'DELETE',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(json => {
      if (json['error_message']) {
        throw Error(json['error_message']);
      }
      return json;
    })
    .then(
      (data) => {
        console.log('success', data);
        getData();
        alert('UnFollow succeeded! ' + JSON.stringify(data));
      },
      (error) => {
        console.log('error', error);
        alert('UnFollow failed! ' + error);
      }
    )
    .catch(
      (error) => {
        console.log('error', error);
        alert('UnFollow failed! ' + error);
      }
    );
  };

  return (
    <div className="">
      <table className="followings">
        <tr>
          <th className="px-40 py-2 font-normal" scope="col">Address</th>
          <th className="px-10 py-2 font-normal" scope="col">Alias</th>
          <th className="px-10 py-2 font-normal" scope="col">Namespace</th>
          <th className="px-20 py-2 font-normal" scope="col">Date</th>
          <th className="px-20 py-2 font-normal" scope="col">Action</th>
        </tr>
        {followings != null&& followings.length > 0
          ? followings.map((following, index) => (
              <tr>
                <th className="px-10 py-2 font-normal" scope="col">{following.to_addr}</th>
                <th className="px-10 py-2 font-normal" scope="col">{following.alias}</th>
                <th className="px-10 py-2 font-normal" scope="col">{following.namespace}</th>
                <th className="px-20 py-2 font-normal" scope="col">{following.created_at}</th>
                <th className="px-20 py-2 font-normal" scope="col">
                  <button className="text-blue-400 hover:text-blue-300" onClick={() => onClick(following)}>Unfollow</button>
                </th>
              </tr>
            ))
          : <div>{ followings != null ? <div className="content-center">You don't have any followings</div> : <div></div>}</div>
        }
      </table>
    </div>
  );
}
