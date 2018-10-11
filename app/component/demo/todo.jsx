


import React from 'react'
/*import PropTypes from 'prop-types'*/
import { connect } from 'react-redux'
import { Card } from 'antd';
import { changeTextAction,buttonClickAction } from '../../actions/demo.js'


class App extends React.Component{
  render() {
    const {text, onChangeText, onButtonClick} = this.props;
    return (
      <div>
        <h1 onClick={onChangeText}> {text} </h1>
        <button onClick={onButtonClick}>click me</button>
      </div>
    );
  }
}
/*容器组件*/
//映射Redux state到组件的属性
function mapStateToProps(state) {
  return { text: state.text }
}

//映射Redux actions到组件的属性
function mapDispatchToProps(dispatch){
  return{
    onButtonClick:()=>dispatch(buttonClickAction),
    onChangeText:()=>dispatch(changeTextAction)
  }
}

//连接组件
App = connect(mapStateToProps, mapDispatchToProps)(App)

export default App;