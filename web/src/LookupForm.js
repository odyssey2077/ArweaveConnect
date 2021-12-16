import React, { useState } from 'react';
import { config } from './Constants'


export default function LookupForm(props) {
  const [followings, setFollowings] = useState(null);
  const [followerCnt, setFollowerCnt] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const response1 = await fetch(config.url.API_URL + '/api/followings/' + form.get("addr"));
    const response2 = await fetch(config.url.API_URL + '/api/follower_count/' + form.get("addr"));
    const data1 = await response1.json();
    const data2 = await response2.json();
    setFollowings(data1);
    setFollowerCnt(data2['count']);
  }

  return (
    <div>
      <div className="form-container">
        <form className="form lookup-form" onSubmit={handleSubmit}>
          <div className="input-container ic1">
            <div className="input-container ic2">
              <input type="text" className="input" name="addr"/>
              <div className="cut" />
              <label htmlFor="addr" className="placeholder">Address</label>
            </div>

            <br />
            {
              //   // event handler for displaying submission response.
            }
            <button className="py-2 mt-5 mb-4 text-lg text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800" type="submit">
              Lookup
            </button>
            <div className="count">
            {followerCnt != null
              ? <div>This account has { followerCnt } followers and { followings.length } followings.</div>
              : <div></div>
            }
            </div>
          </div>
        </form>
      </div>
      <div className="followings">
        {followings != null && followings.length > 0 ?
          <table>
            <tr>
              <th className="px-5 py-2 font-normal" scope="col">Address</th>
              <th className="px-5 py-2 font-normal" scope="col">Alias</th>
              <th className="px-5 py-2 font-normal" scope="col">Namespace</th>
              <th className="px-5 py-2 font-normal" scope="col">Date</th>
            </tr>
            { followings.map((following, index) => (
                <tr>
                  <th className="px-5 py-2 font-normal" scope="col">{following.to_addr}</th>
                  <th className="px-5 py-2 font-normal" scope="col">{following.alias}</th>
                  <th className="px-5 py-2 font-normal" scope="col">{following.namespace}</th>
                  <th className="px-5 py-2 font-normal" scope="col">{following.created_at.replace('T', ' ')}</th>
                </tr>
              ))
            }
          </table>
          : <div>{ followings != null ? <span>No followings found.</span> : <span></span>}</div>
        }
      </div>
    </div>
  );
}
