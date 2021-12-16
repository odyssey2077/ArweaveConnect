import React from 'react';
import { ethers } from "ethers";
import { config } from './Constants'


export default function FollowForm(props) {
  const state = {
    button: 1
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let method = '';
    let text = '';
    if (state.button === 1) {
      method = 'POST';
      text = 'Follow';
    } else if (state.button === 2) {
      method = 'DELETE';
      text = 'UnFollow'
    }

    const form = new FormData(e.target);

    const to_addr = form.get("to_addr");
    const alias = form.get("alias")
    const namespace = form.get("namespace");

    let data = {
      'from_addr':props.account,
      'to_addr':to_addr,
      'namespace':namespace,
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    data['signature'] =  await signer.signMessage(JSON.stringify(data));
    data['alias'] = alias;

    fetch(config.url.API_URL + '/api/followings', {
      method: method,
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
        props.updateData();
        alert(text + ' succeeded! ' + JSON.stringify(data));
      },
      (error) => {
        console.log('error', error);
        alert(text + ' failed! ' + error);
      }
    )
    .catch(
      (error) => {
        console.log('error', error);
        alert(text + ' failed! ' + error);
      }
    );
  }

  return (
    <div className="form-container">
      <form className="form follow-form" onSubmit={handleSubmit}>
        <div className="input-container ic1">
          <div className="input-container ic2">
            <input type="text" className="input" name="to_addr"/>
            <div className="cut" />
            <label htmlFor="to_addr" className="placeholder">Address</label>
          </div>

          <br />
          <div className="input-container ic2">
            <input type="text" className="input" name="alias"/>
            <div className="cut" />
            <label htmlFor="alias" className="placeholder">Alias</label>
          </div>

          <br />
          <div className="input-container ic2">
            <input type="text" className="input" name="namespace"/>
            <div className="cut" />
            <label htmlFor="namespace" className="placeholder">Namespace</label>
          </div>
          <br />
          {
            //   // event handler for displaying submission response.
          }
          <button onClick={() => (state.button = 1)} className="py-2 mr-5 mt-5 mb-4 text-lg text-white rounded-lg w-32 bg-blue-600 hover:bg-blue-800" type="submit" name="follow">
            Follow
          </button>
          <button onClick={() => (state.button = 2)} className="py-2 mt-5 mb-4 text-lg text-white rounded-lg w-32 bg-red-600 hover:bg-red-800" type="submit" name="unfollow">
            UnFollow
          </button>
        </div>
      </form>
    </div>
  )
}
