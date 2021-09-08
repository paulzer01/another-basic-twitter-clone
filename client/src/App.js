import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';

// COMPONENTS
import Landing from './components/landing/Landing';
import Home from './components/dashboard/Home';
import Profile from './components/dashboard/profile/Profile';
import StandalonePost from './components/dashboard/standalone-post/StandalonePost';
import Settings from './components/dashboard/settings/Settings';
import Notifications from './components/dashboard/notifications/Notifications';

//STYLING
import './App.css';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState({});

  const checkAuthenticated = async () => {
    try {
      const res = await fetch("http://localhost:5000/auth/verify", {
        method: "POST",
        headers: { token: localStorage.token }
      });

      const parseRes = await res.json();

      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
    } catch (err) {
      console.error(err.message);
    }
  }

  const getCurrentUser = async () => {
    try {
      const response = await fetch("http://localhost:5000/dashboard/currentUser", {
        method: "GET",
        headers: { token: localStorage.token }
      });
      const parseResponse = await response.json();
      setCurrentUser(parseResponse[0]);
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    checkAuthenticated();
  }, []);

  const setAuth = boolean => {
    setIsAuthenticated(boolean);
  }

  return (
    <div className='App'>
      <Router>
        <Switch>
          <Route exact path='/' render={props =>
            !isAuthenticated
              ? <Landing {...props} setAuth={setAuth} />
              : <Redirect to='/home' />
          }

          />
          <Route exact path='/home' render={props =>
            isAuthenticated
              ? <Home {...props} setAuth={setAuth} getCurrentUser={getCurrentUser} currentUser={currentUser} />
              : <Redirect to='/' />
          }
          />

          <Route exact path='/notifications' render={props =>
            isAuthenticated
              ? <Notifications {...props} setAuth={setAuth} getCurrentUser={getCurrentUser} currentUser={currentUser} />
              : <Redirect to='/' />
          }
          />

          <Route exact path='/settings' render={props =>
            isAuthenticated
              ? <Settings {...props} setAuth={setAuth} getCurrentUser={getCurrentUser} currentUser={currentUser} />
              : <Redirect to='/' />
          }
          />
          
          <Route path='/post'>
            <StandalonePost setAuth={setAuth} getCurrentUser={getCurrentUser} currentUser={currentUser} />
          </Route>

          <Route path='/:username'>
            <Profile setAuth={setAuth} getCurrentUser={getCurrentUser} currentUser={currentUser} />
          </Route>

        </Switch>
      </Router>
    </div>
  );
}

export default App;
