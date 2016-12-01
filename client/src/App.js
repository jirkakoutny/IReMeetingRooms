import React, { Component } from 'react';
import './App.css';

// import ReactDOM from 'react-dom';

import { Image } from 'semantic-ui-react'

import Room from './Components/Room'

import logo from '../public/img/logo.png'

import RestClient from './RestClient.js'

import moment from 'moment';

import * as firebase from 'firebase';

firebase.initializeApp({
    databaseURL: "https://jkiot-b21dd.firebaseio.com",
});

moment.locale('cs');

class App extends Component {

    constructor() {
        super();
        this.state = {
            room: null,
        };
        RestClient.search('', (foods) => {
            console.log(foods);
        });
    }

    componentDidMount() {
        const msgRef = firebase.database().ref().child('rooms/zasedacka_it');
        msgRef.on('value', snap => {
            this.setState({ room: snap.val() });
            console.log('Data loaded...');
        });
        this.timer = setInterval(() => {
            this.forceUpdate();
            console.log('Fired...');
        }, 60000);
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    render() {
        console.log('Rendered...');
        return (
            <div className="ui one column center aligned grid">
                <div className="column ten wide form-holder">
                    <Image src={logo} centered />
                    <Room data={this.state.room}></Room>
                </div>
            </div>
        );
    }
}

export default App;
