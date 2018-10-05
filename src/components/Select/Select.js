import React from 'react'
import './Select.less'
import {Input} from 'antd'
class Select extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
        inputvalue: this.props.defaultValut || ''
      }
  }
  onBlur(e) {
    let fkey = this.props.fkey
    this.props.onOk(this.state.inputvalue)
    document.querySelector('.input-' + fkey).style.maxHeight = 0
    document.querySelector('.input-' + fkey).style.boxShadow = 'none'
    if(!this.props.valueclear) {
      this.setState({
        inputvalue: this.props.defaultValut
      })
    }  
    
  }
  onFocus(e) {
    let fkey = this.props.fkey
    // document.querySelector('.showSelect').style.maxHeight = '132px'
    document.querySelector('.input-' + fkey).style.maxHeight = '132px'
    document.querySelector('.input-' + fkey).style.boxShadow = '0px 1px 2px 2px #eeeeee'
  }
  onChange(e) {
    this.setState({
      inputvalue: e.target.value
    })
  }
  onClick(e) {
    this.setState({
      inputvalue: e.target.innerText
    }, () => {
      // console.log(e.target)
      // this.props.onOk(e.target.innerText)
      // this.onBlur('click', this.state.inputvalue, key)
    })
    
  }
  render() {
    return (
      <div className={this.props.className ? 'Select ' + this.props.className : 'Select'} style={this.props.style || {}}>
        <Input type="text" onBlur={this.onBlur.bind(this)} onFocus={this.onFocus.bind(this)} onChange={this.onChange.bind(this)} value={this.state.inputvalue}/>
          <ul className={"showSelect input-" + this.props.fkey} data-select="true">
              {this.props.list.map((item, index) => {
                return <li onClick={this.onClick.bind(this)} onMouseDown={(e) => {e.preventDefault()}} key={index}>{item.caseType}</li>
              })}
          </ul>
      </div>
    )
  }
}

export default Select
