import React from 'react';
import { Fab } from '@material-ui/core/';

const getPosRelativeToImage = function(coord, imageSize) {
  return coord/imageSize+'px'
}

export default function imageButns(props) {

  // Here we set color and opacity of button : opacity to 1 is selected menu is linked to this button and a slightly saturated color
  const bgColorButnValue = function (index) {
    if (index !== props.selectedMenu) {
      return 'rgba(194, 18, 26, '+(Math.abs(Math.sin(props.generalCounter / 10))+1)/2+')'
    } else {
      return 'rgba(255, 11, 22, '+1+')'
    }
  }

  return (
    <div className="font-icon-wrapper" onClick={(e) => props.handleClick(props.index)} value={props.index}>
      <Fab 
        size="small"
        color="secondary"
        aria-label="add"
        style={{position:'absolute', left:getPosRelativeToImage(props.imageWidth*props.butn.x, 710), top:getPosRelativeToImage(props.imageHeight*props.butn.y, 400), width:40, height:40, backgroundColor: bgColorButnValue(props.index),}}
      >
      {props.butn.icon()}
      </Fab>
    </div>
  )
}