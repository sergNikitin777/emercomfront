import React, {Component} from 'react';
import PropTypes from 'prop-types'

import red from './img/red.png';
import redRetina from './img/red.png';
import blue from './img/blue.png';
import blueRetina from './img/blue.png';
import yellow from './img/yellow.png';
import yellowRetina from './img/yellow.png';
import pinHover from './img/grey.png';
import pinHoverRetina from './img/grey.png';


const imageOffset = {
  left: 15,
  top: 31
}


class Marker extends React.Component {
  static propTypes = {
    // input, passed to events
    anchor: PropTypes.array.isRequired,
    payload: PropTypes.any,

    // optional modifiers
    hover: PropTypes.bool,

    // callbacks
    onClick: PropTypes.func,
    onContextMenu: PropTypes.func,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func,

    // pigeon variables
    left: PropTypes.number,
    top: PropTypes.number,

    // pigeon functions
    latLngToPixel: PropTypes.func,
    pixelToLatLng: PropTypes.func
  }	
  
  constructor (props) {
    super(props);
	
    this.state = {
      hover: false
    }
  }

  // what do you expect to get back with the event
  eventParameters = (event) => ({
    event,
    anchor: this.props.anchor,
    payload: this.props.payload
  })

  // controls
  isRetina () {
    return typeof window !== 'undefined' && window.devicePixelRatio >= 2
  }

  // modifiers
  isHover () {
    return typeof this.props.hover === 'boolean' ? this.props.hover : this.state.hover
  }

  image () {
    return this.isRetina() ? (this.isHover() ? pinHoverRetina : this.pinRetina) : (this.isHover() ? pinHover : this.pin)
  }

  // lifecycle
  componentWillMount () {
	if(this.props.type === 1){
		this.pin = red;
		this.pinRetina = redRetina;
	}
	else if(this.props.type === 2){
		this.pin = yellow;
		this.pinRetina = yellowRetina;
	}
	else{
		this.pin = blue;
		this.pinRetina = blueRetina;
	}
  }
  
  componentDidMount () {
    let images = this.isRetina() ? [
      this.pinRetina, pinHoverRetina
    ] : [
      this.pin, pinHover
    ]

    images.forEach(image => {
      let img = new window.Image()
      img.src = image
    })
  }

  // delegators
  handleClick = (event) => {
    this.props.onClick && this.props.onClick(this.eventParameters())
  }

  handleContextMenu = (event) => {
    this.props.onContextMenu && this.props.onContextMenu(this.eventParameters())
  }

  handleMouseOver = (event) => {
    this.props.onMouseOver && this.props.onMouseOver(this.eventParameters())
    this.setState({ hover: true })
  }

  handleMouseOut = (event) => {
    this.props.onMouseOut && this.props.onMouseOut(this.eventParameters())
    this.setState({ hover: false })
  }  
	
  render(){
    const { left, top, onClick } = this.props

    const style = {
      position: 'absolute',
      transform: `translate(${left - imageOffset.left}px, ${top - imageOffset.top}px)`,
      cursor: onClick ? 'pointer' : 'default'
    }

    return (
      <div style={style}
           className='pigeon-click-block'
           onClick={this.handleClick}
           onContextMenu={this.handleContextMenu}
           onMouseOver={this.handleMouseOver}
           onMouseOut={this.handleMouseOut}>
        <img src={this.image()} width={29} height={34} alt='' />
      </div>
    )
  }
}

export default Marker;