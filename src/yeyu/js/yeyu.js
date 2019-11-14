import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Button } from 'antd';
import { throws } from 'assert';
import axios from 'axios'

ReactDOM.render(<div>
  <Button type="primary">主按钮</Button>
  <Button>次按钮</Button>
  <Button type="ghost">幽灵按钮</Button>
  <Button type="dashed">虚线按钮</Button>
</div>,
yeyu);

class a extends React.Component {
  constructor(props){
    super(props)
    this.state = {houseLeaseInf_Id: ''}
    this.click = this.click.bind(this)
  }

  click(event){
    this.setState({houseLeaseInf_Id: event.target.value})
    axios.get('/api1/HouseLeaseInf',{
      houseLeaseInf_Id: this.state.houseLeaseInf_Id
    })
    .then(function(res){
      console.log(res.data)
    })
    .catch(function(err){
      console.log(err)
    })
  }

  render(){
    var a = 1
    return 
    <div>
      <button onClick={this.click}>123123</button>
    </div>
  }
}

ReactDOM.render(
  <a/>,
  document.getElementById('a')
)