import React from 'react'
class Snapshot extends React.Component {
  render() {
    return (
      <div style={{display: 'flex', justifyContent: 'center', marginTop: 48}}>
        <img src={`http://103.94.42.70:5000/static/all/${this.props.match.params.fileName}/shot.png`} alt='图片'/>
      </div>
    )
  }
}
export default Snapshot