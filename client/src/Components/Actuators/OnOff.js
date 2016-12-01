import React, { Component } from 'react';

import { Button } from 'semantic-ui-react'

class OnOff extends Component {
    switchOn = () => {
        console.log('this is:', this);
    }

    switchOff = () => {
        console.log('this is:', this);
    }

    render() {
        if (this.props.data !== 'Vše') {
            return (
                <div className='ui two buttons'>
                    <Button basic color='green' onClick={this.switchOn}>Zapnout</Button>
                    <Button basic color='red' onClick={this.switchOff}>Vypnout</Button>
                </div>
            );
        }
        else {
            return (
                <div className='ui two buttons'>
                    <Button color='green' onClick={this.switchOn}>Zapnout</Button>
                    <Button color='red' onClick={this.switchOff}>Vypnout</Button>
                </div>
            );
        }
    }
}

export default OnOff;