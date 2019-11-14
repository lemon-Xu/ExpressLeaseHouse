import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Button } from 'antd';
import ButtonGroup from 'antd/lib/button/button-group';
import "babel-polyfill"
import axios from 'axios'

ReactDOM.render(
<div>
  <Button type="primary">主按钮</Button>
  <Button>次按钮</Button>
  <Button type="ghost">幽灵按钮</Button>
  <Button type="dashed">虚线按钮</Button>
</div>,
lemon);

class Login extends React.Component{
  constructor(props) {
    super(props)
    this.state = {usersName: '', usersPass: ''}
    this.usersNameChange = this.usersNameChange.bind(this)
    this.usersPassChange = this.usersPassChange.bind(this)
    this.click = this.click.bind(this)
  }

  usersNameChange(event) {
    this.setState({usersName: event.target.value});
    console.log("usersName变化:"+this.state.usersName)
  }

  usersPassChange(event) {
    this.setState({usersPass: event.target.value})
    console.log("usersPass变化"+this.state.usersPass)
  }

  click(){
    console.log("usersName:"+this.state.usersName)
    console.log("usersPass:"+this.state.usersPass)
    axios.delete('/users',{
      params: {
        usersName: this.state.usersName,
        usersPass: this.state.usersPass
      }
    })
    .then(function(res){
      console.log(res)
    })
    .catch(function(err){
      console.log(err)
    })
  }

  render(){
    var usersName = this.state.usersName
    var usersPass = this.state.usersPass
    return <div>
              <input type='text' value={usersName} onChange={this.usersNameChange} />
              <input type="password" value={usersPass} onChange={this.usersPassChange} />
              <button onClick={this.click}>登入</button>
            </div>
  }
}

ReactDOM.render(
  <Login />,
  document.getElementById('login')
)