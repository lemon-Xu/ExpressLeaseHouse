import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'antd';
import styleLemon from '../css/home.css'
import {getHouseInfAPI1} from './ajaxAPI1.js'

getHouseInfAPI1((res)=>{
  console.log(res.data)
},
()=>{},
{}
)

class HouseInf extends React.Component{
  constructor(props){
    super(props)
  }

  render(){
    return (
    <div className={styleLemon.houseInf}>
      <img src={this.props.imgSrc} alt={this.props.altText}/>
      <p className={styleLemon.overflow}>{this.props.pTitle}</p>
      <div>
        <span>{this.props.leftSpan}</span>
        <span>{this.props.rightSpan}</span>
      </div>
    </div>
    )
  } 
}


class HouseInfList extends React.Component  {
  constructor(props){
    super(props)
    this.imgSrc = null;
    this.altText = null;
    this.pTitle = null;
    this.leftSpan = null;
    this.rightSpan = null;
    this.dom = <div></div>
  }

  componentDidMount(){
    this.getHouseInf()
  }

  getHouseInf(){
    let inf = null;
    getHouseInfAPI1((res)=>{
      inf = res.data
      console.log(inf)
      this.dom = this.setInfList(inf)
      console.log(this.dom)
      this.render()
    })
  }

  setComponentProps(imgSrc, altText, pTitle, leftSpan, rightSpan){
    return  <HouseInf  imgSrc={imgSrc}  altText={altText}  pTitle={pTitle}  leftSpan={leftSpan} rightSpan={rightSpan} />
  }

  setInfList(inf){
    let ret = new Array()
    for(let a in inf){
      ret.pop(this.setComponentProps(inf[a].imgSrc, '', inf[a].House_Profile, inf[a].leftSpan, inf[a].rightSpan))
    }
    return ret
  }

  render(){
    return(
      this.dom
    )
      
  }

}

ReactDOM.render(
  <HouseInfList />,
  document.getElementById('HouseInfList')
)

export{Home}
