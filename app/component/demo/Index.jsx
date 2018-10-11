
import React from 'react'
import "../../public/css/demo.scss";
import '../../public/css/common.scss';
import { Card } from 'antd';
import App from './todo.jsx'
import Header from '../common/Header';
import Footer from '../common/Footer';

class Index extends React.Component{
  constructor(props){
    super(props);
  }
  render(){

    return (
      <div className="index">
        <Header/>
        <App ></App>
        <Footer/>
        <div className="demo"></div>
      </div>
    );
  }
}
export default Index;