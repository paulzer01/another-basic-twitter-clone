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

//STYLING
import './App.css';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
              ? <Home {...props} setAuth={setAuth} />
              : <Redirect to='/' />
          }
          />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
