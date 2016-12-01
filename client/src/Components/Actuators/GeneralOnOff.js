import React, { Component } from 'react';

import { Button, Card, Header } from 'semantic-ui-react'
import { } from 'semantic-ui-react'

class GeneralOnOff extends Component {
    switchOn = () => {
        console.log('this is:', this);
    }

    switchOff = () => {
        console.log('this is:', this);
    }

    render() {
        return (
            <Card centered>
                <Card.Content>
                    <Card.Header>
                        <Header as='h3'>Vše</Header>
                    </Card.Header>
                </Card.Content>
                <Card.Content extra>
                    <div className='ui two buttons'>
                        <Button color='green' onClick={this.switchOn}>Zapnout</Button>
                        <Button color='red' onClick={this.switchOff}>Vypnout</Button>
                    </div>
                </Card.Content>
            </Card>
        );

    }
}

export default GeneralOnOff;