import React from 'react';
import ReactDOM from 'react-dom';
import { Upload, Icon, message, Button } from 'antd';
import styleLemon from '../css/login.css';
import {loginAPI1, usersRegisterAPI1, getHouseInfAPI1, postHouseInfImgAPI1} from './ajaxAPI1.js';

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
    loginAPI1((res)=>{
      console.log(res.data)
      if(res.data.length != 0)
        window.location.href = '/dist/home.html'
      else
        alert('错误')
    }), ()=>{},
    {
      "usersAccount": this.state.usersName,
      "usersPass": this.state.usersPass
    }
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


class Register extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      usersName: '',
      usersPass: '',
    }
    this.usersNameChange = this.usersNameChange.bind(this)
    this.usersPassChange = this.usersPassChange.bind(this)
    this.register = this.register.bind(this)
  }

  usersNameChange(event){
    this.setState({"usersName": event.target.value})
  }

  usersPassChange(event){
    this.setState({"usersPass": event.target.value})
  }

  register(event){
    if(this.state.usersPass.length < 8 || this.state.usersPass.length >15) {
      alert("Make sure it's at least 15 characters OR at least 8 characters including a number and a lowercase letter.")
      return
    }
    let para = {
      "usersAccount": this.state.usersName,
      "usersPass": this.state.usersPass,
      "usersRank": '游客'
    }
    usersRegisterAPI1(
      (res)=>{
        console.log(res.data)
        if(res.data.result){

        } else {
          alert(res.data.mess)
        }
      },
      ()=>{},
      para)
    console.log(para)
  }

  render(){
    return(
      
      <div id='registerBody'>
        <Board>
          <Login_p><b>Username</b></Login_p>
          <Login_inputTest value={this.state.usersName} onChange={this.usersNameChange}></Login_inputTest>
          <b>Password</b>
          <Login_inputPassword value={this.state.usersPass}  onChange={this.usersPassChange}></Login_inputPassword>
          <Login_p>Make sure it's at least 15 characters OR at least 8 characters including a number and a lowercase letter.</Login_p>
          <Login_button onClick={this.register}>Sign up for HouseLease</Login_button>
        </Board>
     </div>


    )
  }
}



function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

class Avatar extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      loading: false,
    };
    this.handleChange = this.handleChange.bind(this)
  }
 
  handleChange(info){
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { imageUrl } = this.state;
    return (
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="http://localhost:3000/api1/img"
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
    );
  }
}

ReactDOM.render(<Avatar />, document.getElementById('avatar'));

class A123 extends React.Component{
  constructor(props){
    super(props)
    this.upload = this.upload.bind(this)
    this.show = this.show.bind(this)
    this.divClick = this.divClick.bind(this)
  }

  upload(){
    //检验是否为图像文件  
    var file = document.getElementById("file").files[0];  
    if(!/image\/\w+/.test(file.type)){  
        alert("看清楚，这个需要图片！");  
        return false;  
    }  
    var reader = new FileReader();  
    //将文件以Data URL形式读入页面  
    reader.readAsDataURL(file);  
    reader.onload=function(e){  
       console.log(this.result)  
    }  
  }

  divClick(){
    let dom = document.getElementById('file')
    dom.click()
  }

  show(e){
    console.log(e.target)
  }

  render(){
    return(<div onClick={this.divClick}>
        <input type="file" id="file" onChange={this.show}/>
        <button onClick={this.upload}>12321</button>
      </div>
    )
  }
}


ReactDOM.render(
  <A123 />,
  document.getElementById("uploadImg")
);



ReactDOM.render(
  <Login />,
  document.getElementById('login')
)

ReactDOM.render(
  <Register />,
  document.getElementById('register')
)

export {Login}
