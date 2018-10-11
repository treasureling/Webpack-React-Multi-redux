const fs = require("fs");
const path = require("path");
const entry = require("./entry");
const rimraf = require('rimraf');

//定义entryBuild
const entryBuildPath  = path.resolve(__dirname,"../../entryJs");

//删除entryBuild
rimraf.sync(entryBuildPath);

//创建entryBuild
fs.mkdirSync(entryBuildPath);
/*这个是生成每个页面的入口文件的模板，可以根据需要修改*/
const entryContent = data =>
`
import React from 'react';
import ReactDOM from 'react-dom';
import 'babel-polyfill'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import appStore from '../app/reducers/${data.name}.js'
import App from '../app/component/${data.path}';
import Header from '../app/component/common/Header';
import Footer from '../app/component/common/Footer';

let store = createStore(appStore)

ReactDOM.render(
  <Provider store={store}>
        <Header key="Header"/>
       <App />
       <Footer key="Footer" />
  </Provider>,
  document.getElementById('app')
)
`;

//生成webpack entry 入口文件
entry.map(data =>{
    fs.writeFile(entryBuildPath+"/"+data.name+".js",entryContent(data),'utf8',function (err) {
        if(err){
            return console.log(err);
        }

    });
});