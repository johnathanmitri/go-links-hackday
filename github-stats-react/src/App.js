import logo from './logo.svg';
import './App.css';
import axios from 'axios';

import React, { useState } from 'react';

import StatsView from './StatsView';

import loadingImg from './loading.png';


function App() {
  const [username, setUsername] = useState('');
  const [stats, setStats] = useState({});
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleSearch = () => {
    setVisible(true);
    setLoading(true);
    axios.get(`/user-statistics/${username}`).then((response) => {
      //setLoading(false);
      setLoading(false);
      setStats(response.data);
    }).catch((e) => console.log("Error:", e));
  };
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  return (
    <div className="App">
      <header className="App-header">
        <h1>View User Statistics</h1>

        <div>
          <input type="text" value={username} id="username" class="username-input" placeholder="username" onChange={handleUsernameChange} onKeyDown={handleKeyPress}/>
          <button class="search-button" onClick={handleSearch}>Search</button>
        </div>
        {
          visible ? loading ? <img style={{margin: "200px"}} src={loadingImg} className="loading" /> : <StatsView stats={stats}/> : null
        }
        
      </header>
    </div>
  );
}

export default App;

/*
<input type="checkbox" id="includeForked" name="includeForked" value="includeForked"/>
          <label for="includeForked"> Include forked repositories</label>
          */