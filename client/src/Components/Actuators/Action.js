import React, { Component } from 'react';

import { Button, Card } from 'semantic-ui-react'

class Action extends Component {
    leftAction = () => {
        console.log('this is:', this);
    }

    rightAction = () => {
        console.log('this is:', this);
    }

    render() {
        return (
            <Card.Content extra>
                <div className='ui two buttons'>
                    <Button content={this.props.data.left} icon='minus' labelPosition='right' color="blue" onClick={this.leftAction} />
                    <Button content={this.props.data.right} icon='plus' labelPosition='left' color="orange" onClick={this.rightAction} />
                </div>
            </Card.Content>
        );
    }
}

export default Action;