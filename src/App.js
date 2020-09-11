import React, { useEffect, useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import Bus from './utils/Bus';
import Flash from './components/Flash'
import NavBar from './components/NavBar';
import Signup from './components/Signup';
import Login from './components/Login';
import Profile from './components/Profile';
import Background from './components/Background'
import FullPage from './fullpage/FullPage'
import './App.css';

window.flash = (message, type="success") => Bus.emit('flash', ({message, type}))
window.flash = (message, type="error") => Bus.emit('flash', ({message, type}))


const PrivateRoute = ({ component: Component, ...rest }) => {
  const user = localStorage.getItem('jwtToken');
  return <Route {...rest} render={(props) => {
      return user ? <Component {...rest} {...props} /> : <Redirect to="/login" />
    }}
  />;
}

function App() {
  // set state values
  let [currentUser, setCurrentUser] = useState("");
  let [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    let token;
    if (!localStorage.getItem('jwtToken')) {
      setIsAuthenticated(false);
    } else {
      token = jwt_decode(localStorage.getItem('jwtToken'));
      setAuthToken(localStorage.jwtToken);
      setCurrentUser(token);
      setIsAuthenticated(true);
    }
  }, []);

  const nowCurrentUser = (userData) => {
    console.log('nowCurrentUser is working...');
    setCurrentUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    if (localStorage.getItem('jwtToken')) {
      localStorage.removeItem('jwtToken');
      window.flash('See you next time!', 'success')
      setCurrentUser(null);
      setIsAuthenticated(false);
    }
  }

  return (
    <div>
      <NavBar handleLogout={handleLogout} isAuth={isAuthenticated} />
      <div className="container mt-5">
        <Switch>
          <Route path="/background" component={Background} />
          <Route path="/signup" component={ Signup } />
          <Route 
            path="/login" 
            render={ (props) => <Login {...props} nowCurrentUser={nowCurrentUser} setIsAuthenticated={setIsAuthenticated} user={currentUser}/>} 
          />
          <PrivateRoute path="/profile" component={ Profile } user={currentUser} />
          <FullPage user={currentUser}/>
          <Route component={Error}/>
        </Switch>
        <Flash />
        <Background />
      </div>
    </div>
  );
}

export default App;