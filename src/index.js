import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Button } from 'antd';

ReactDOM.render(<div>
  <Button type="primary">主按钮</Button>
  <Button>次按钮</Button>
  <Button type="ghost">幽灵按钮</Button>
  <Button type="dashed">虚线按钮</Button>
</div>,
root);