import React, { Component } from 'react';

import moment from 'moment';

import { Card, Grid, Statistic, Icon } from 'semantic-ui-react'

class RoomState extends Component {
    render() {
        var temperature = '-- °C';
        var humidity = '--%';
        var light = '--%';
        var move = '--';
        var timestamp = '--';

        if (!!this.props.data) {
            temperature = (!!this.props.data.temperature ? this.props.data.temperature.toFixed(2) : '--') + ' °C';
            humidity = (!!this.props.data.humidity ? this.props.data.humidity.toFixed(2) : '--') + '%';
            light = (!!this.props.data.light ? this.props.data.light.toFixed(0) : '--') + '%';
            move = !!this.props.data.move && this.props.data.move ? 'Ano' : 'Ne';
            timestamp = !!this.props.data.timestamp ? moment(this.props.data.timestamp, "X").fromNow() : '--';
        }
        return (
            <Card centered>
                <Card.Content>
                    <Card.Header>
                        Aktuální stav
                    </Card.Header>
                    <Card.Description>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={8}>
                                    <Statistic size='tiny' value={temperature} label='Teplota' />
                                </Grid.Column>
                                <Grid.Column width={8}>
                                    <Statistic size='tiny' value={humidity} label='Vlkhost' />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width={8}>
                                    <Statistic size='tiny' value={light} label='Světla' />
                                </Grid.Column>
                                <Grid.Column width={8}>
                                    <Statistic size='tiny' value={move} label='Pohyb' />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <Icon name='wait' />
                    {timestamp}
                </Card.Content>
            </Card>
        );
    }
}

export default RoomState;