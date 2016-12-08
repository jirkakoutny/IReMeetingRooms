import React, { Component } from 'react';

import { Button } from 'semantic-ui-react'

import RestClient from './../../RestClient.js'

class OnOff extends Component {
    switchOn = () => {
        RestClient.command('switchOn', this.props.data, (x) => {
            console.log('After');
            console.log(x);
        });
    }

    switchOff = () => {
        RestClient.command('switchOff', this.props.data, (x) => {
            console.log('After');
            console.log(x);
        });
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