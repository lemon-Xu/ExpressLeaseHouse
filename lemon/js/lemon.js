import React from 'react';
import ReactDOM from 'react-dom';
// import 'antd/dist/antd.css';
import { Button } from 'antd';
import ButtonGroup from 'antd/lib/button/button-group';
import axios from 'axios'
import styleLemon from '../css/lemon.css'
import {loginAPI1} from './ajaxAPI1.js'

class Login_p extends React.Component{

  render(){
    var kids = React.Children.map(this.props.children, child => {
      return child
    })

    return <p className={styleLemon.login_p_a}>
       {kids}
    </p>
  } 
}

class Login_button extends React.Component{

  

  render(){
    var kids = React.Children.map(this.props.children, child => {
      return child
    })

    return <Button type="primary" className={styleLemon.login_button_input} onClick={this.props.onClick}>
      {kids}
    </Button>
  }
}

class Login_inputTest extends React.Component{

  render(){
    var kids = React.Children.map(this.props.children, child => {
      return child
    })

    return <input type="text" className={styleLemon.login_button_input} value={this.props.value} onChange={this.props.onChange}>
      {kids}
    </input>
  }
}

class Login_inputPassword extends React.Component{

  render(){
    var kids = React.Children.map(this.props.children, child => {
      return child
    })

    return <input type="password" className={styleLemon.login_button_input} value={this.props.value} onChange={this.props.onChange}>
      {kids}
    </input>
  }
}

class Board extends React.Component{
  render(){
    var kids = React.Children.map(this.props.children, child => {
      return child
    })

    return <div className={styleLemon.board}>
      {kids}
    </div>
  }
}



class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = { usersName: '', usersPass: '' }
    this.usersNameChange = this.usersNameChange.bind(this)
    this.usersPassChange = this.usersPassChange.bind(this)
    this.login = this.login.bind(this)
  }

  usersNameChange(event) {
    this.setState({ usersName: event.target.value })
  }

  usersPassChange(event) {
    this.setState({ usersPass: event.target.value })
  }

  login() {
    console.log("usersName:" + this.state.usersName)
    console.log("usersPass:" + this.state.usersPass)
    loginAPI1(this.state.usersName, this.state.uersPass)
  }

  render() {
    return <div id='loginBody'>
      <Board>
        <h2>Sign in to HouseLease</h2>
        <Login_p><b>Username</b></Login_p>
        <Login_inputTest value={this.state.usersName} onChange={this.usersNameChange}></Login_inputTest>
        <p><b>Password</b><a className={styleLemon.floatRight}>Forgin password?</a></p>
        <Login_inputPassword value={this.state.usersPass}  onChange={this.usersPassChange}></Login_inputPassword>
        <br></br>
        <Login_button onClick={this.login}>Sign in</Login_button>
      </Board>
      <Board>
         <a>new to HouseLease? create HouseLease account</a>
      </Board>
    </div>
  }
}

ReactDOM.render(
  <Login />,
  document.getElementById('login')
)