import React, { Component } from 'react';

import { Card, Header } from 'semantic-ui-react'

import Action from './Action'
import OnOff from './OnOff'

class SimpleActuator extends Component {
    render() {
        var actions = [];
        if (!!this.props.data.actions) {
            this.props.data.actions.forEach(x => {
                actions.push(<Action data={x} key={x.name}></Action>);
            });
        }
        return (
            <Card centered>
                <Card.Content>
                    <Card.Header>
                        <Header as='h3'>{this.props.data.name}</Header>
                    </Card.Header>
                </Card.Content>
                {actions}
                <Card.Content extra>
                    <OnOff data={this.props.data.name}></OnOff>
                </Card.Content>
            </Card>
        );

    }
}

export default SimpleActuator;