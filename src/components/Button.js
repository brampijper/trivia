import React from 'react';
import './Button.css';

export default function Button (props) {
    const click = props.handleClick ? props.handleClick : () => {} ;
    return (
        <button onClick={click}>
            {props.text}
        </button>
    )
}