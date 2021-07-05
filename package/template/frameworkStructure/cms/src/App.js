import React, { useState } from 'react';
import './styles/reduction.scss';
import './App.css';
import Home from './pages/home/Home';
import SignIn from './pages/signIn/signIn';
import PageSpinner from './components/PageSpinner';
import getViewport from './lib/viewpoint';
import Response from './lib/Response';
import apiClient from './lib/apiClient';

function App() {
  let [accessToken, setAccessToken] = useState();
  let [inProgress, setInProgress] = useState(false);
  let [accessTokenValid, setAccessTokenValid] = useState(false);

  const updateAccessToken = (token) => {
    setAccessToken(token);
  };

  const resetAccessToken = () => {
    apiClient('/users/logout', 'POST', {}, {}, accessToken);
    setAccessToken(null);
    localStorage.removeItem('access_token');
  };

  const validateAccessToken = () => {
    if (inProgress) return;
    apiClient('/admin/search_users', 'GET', null, { type: 2, last_index: 0, search_text: "A", filter_type: 2 }, accessToken).then(res => {
      if (res.responseCode === Response.STATUS_OK) {
        setAccessTokenValid(true);
      } else if (res.responseCode === Response.TOKEN_EXPIRED) {
        resetAccessToken();
      }
      setInProgress(false);
    });
  };

  return (
    <div className="bg-light">
      {!accessToken &&
        localStorage.getItem('access_token') &&
        setAccessToken(localStorage.getItem('access_token'))}

      {!accessToken &&
        ((
          <SignIn
            onAccessTokenUpdate={updateAccessToken}
          />
        ))}

      {accessToken && !accessTokenValid && (!inProgress && (setInProgress(true) || (!validateAccessToken() || <React.Suspense fallback={<PageSpinner />}><PageSpinner /></React.Suspense>)))}

      {accessToken && ((accessTokenValid && (
        <Home
          accessToken={accessToken}
          resetAccessToken={resetAccessToken}
          breakpoint={getViewport()}
        />
      )))}
    </div>
  );
}

export default App;
