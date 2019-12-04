import React from 'react';
import ReactDOM from 'react-dom';
import { Upload, Icon, message, Button, Divider } from 'antd';
import styleLemon from '../css/login.css';
import {loginAPI1, usersRegisterAPI1, getHouseInfAPI1, postHouseInfImgAPI1} from './ajaxAPI1.js';

class ClickPanel extends React.Component{
    constructor(props){
        super(props)
    }

    
    render(){
        return ( 
        <div onClick={this.props.onClick} >
            <span>{this.props.leftText}</span>
            <span>{this.props.rightText}</span>
            <span><img></img></span>
        </div>
        )

    }
}


export{ClickPanel}