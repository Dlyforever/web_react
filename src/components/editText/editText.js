import React, { Component } from "react";
import { Input, message } from "antd";
import "./editText.less";

export default class editText extends Component {
  state = {
    value: this.props.value,
    editable: false,
    count: 1,
    displays: this.props.style
  };
  componentDidMount() {}
  componentWillReceiveProps(props) {
    this.setState({
      value: props.value
    });
  }
  handleChange = e => {
    
    const value = e.target.value;
    this.setState({ value });
  };
  check = () => {
    if(this.state.value.length > 11){
      message.error('标题名称请不要超出11个字符')
      return 
    } 
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(parseInt(this.state.value,10)<10 && this.state.value[0]!=='0'?'0'+this.state.value:this.state.value);
    }
  };
  edit = num => {
    num++;
    setTimeout(() => {
      if (num === 2) {
        this.setState({ editable: true });
      }
    }, 500);
  };
  render() {
    const { value, editable } = this.state;
    return (
      <div className="editable-cell" style={this.props.style}>
        {editable ? (
          <div className="editable-cell-input-wrapper">
            <Input
              value={value}
              autoFocus
              onChange={this.handleChange}
              onBlur={this.check}
              style={{ width: 150, outline: "none", border: 0 }}
            />
          </div>
        ) : (
          <div
            className="editable-cell-text-wrapper"
            title={value}
            onClick={this.edit.bind(this, this.state.count)}
          >
            {value || " "}
            {/* 网络舆情简报 */}
          </div>
        )}
      </div>
    );
  }
}
