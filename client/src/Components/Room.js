import React, { Component } from 'react';

import SimpleActuator from './Actuators/SimpleActuator'
import RoomState from './Status/RoomState'
import GeneralOnOff from './Actuators/GeneralOnOff'

class Room extends Component {
    render() {
        var actuators = [];
        var name = null;
        var renderState = null;
        var renderGeneraOnOff = null;
        if (!!this.props.data) {
            if (!!this.props.data.actuators) {
                this.props.data.actuators.forEach(x => {
                    actuators.push(<SimpleActuator data={x} key={x.name}></SimpleActuator>);
                });
            }
            renderState = !!this.props.data.state ?<RoomState data={this.props.data.state}></RoomState> : null; 
            name = !!this.props.data.name ? this.props.data.name : null;
            if (actuators.length !== 0)
                renderGeneraOnOff = <GeneralOnOff data={actuators}></GeneralOnOff>;
        }
        return (
            <div className="room">
                <h2 className="center aligned header form-head">{name}</h2>
                {renderState}
                {actuators}
                {renderGeneraOnOff}
            </div>
        );
    }
}

export default Room;