import React from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';
import Home from './home';
import Login from './login';

const baseUrl = 'localhost:3000/dist/index.html'

const BaseicRoute = () => {
    <HashRouter>
        <Switch>
            <Route exact path= 'baseUrl + "/"' component={Login}/>
            <Route exact path='baseUrl + "/home"' component={Home}/>
        </Switch>
    </HashRouter>
}