global.jQuery = global.$ = require('jquery');
require('jquery.growl');
require('form-serializer');
require('../bower_components/fullcalendar/dist/fullcalendar.min.js');
require('../bower_components/moment/moment.js');
require('../bower_components/fullcalendar/dist/gcal.js');
require('../public/assets/pikaday/pikaday.js');
var DateTimeField = require('react-bootstrap-datetimepicker');
global.CONFIG = require('./config.json');
/** React */
import React from 'react';
import ReactDOM from 'react-dom';

/** React Router */
import Router from 'react-router/lib/Router';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';
import Link from 'react-router/lib/Link';
import hashHistory from 'react-router/lib/hashHistory';

/**
 * LIST COMPONENTS
 * IMPORT SEMUA COMPONENT YANG DIBUTUHKAN
 */
import Calendar from './Components/Calendar/Calendar';
import CalendarWeek from './Components/Calendar/CalendarWeek';
import CalendarDay from './Components/Calendar/CalendarDay';

/** AJAX SETUP */
$.ajaxSetup({
    beforeSend: function(xhr) {
        if (localStorage.token) {
            xhr.setRequestHeader('Authorization', 'Bearer '+localStorage.token);
        }

        // $('#loading').addClass('active');
    },
    complete: function(xhr){
        var result = xhr.responseJSON;
        if (result && result['token']) {
            localStorage.setItem('token', result.token);
        }
        if (result && result['msg'] && result.msg !== ''){
            if (result.error) {
                $.growl.error({
                    message: result.msg
                })
            } else {
                $.growl.notice({
                    message: result.msg
                })
            }
        }
        // $('#loading').removeClass('active');
    },
    error: function (x, status, error) {
        if (x.status === 401) {
            $.growl.error({
                message: 'Your session is not valid!'
            });
            window.location.href ="#/login";
        } else if(x.status === 403) {
            $.growl.error({
                message: 'Your session is not valid!'
            });
            window.history.back();
        } else {
            $.growl.error({
                message: "An error occurred: " + status + "\nError: " + error
            });
        }
    }
});


/** DEFAULT COMPONENT */
const App = React.createClass({
    getInitialState(){
        return {loggedIn: checkSession()}
    },

    /**
     * DISABLE AJA KALAU BELUM ADA LOGINNYA
     * @return {[type]} [description]
     */
    componentWillMount(){
        // if (this.state.loggedIn) {
        //     var url = window.location.href.split('#')[1];
        //     var hash = url.split('?')[0];

            // if (hash === '/') {
                window.location.href = '#/calendar';
            // }
        // } else {
        //     window.location.href = '../#/login';
        // }
    },

    render(){
        return (
            <div className="transformatika">
                {this.props.children}
            </div>
        )
    }
});

/**
 * CHECK SESSION
 * @return {[type]} [description]
 */
var checkSession = () => localStorage.user ? true : false;

var requireAuth = (nextState, replace) => {
    if (!checkSession()) {
        replace({
            pathname: '/login',
            state: { nextPathname: nextState.location.pathname }
        })
    }
}

var disableWhenLoggedIn = (nextState, replace) => {
    if (checkSession()) {
        replace({
            pathname: '/notes',
            state: { nextPathname: nextState.location.pathname }
        })
    }
}

/**
 * KONFIGURASI ROUTING
 * 
 */
ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <Route path="/calendar" component={Calendar}/>
            <Route path="/calendarweek" component={CalendarWeek}/>
            <Route path="/calendarday" component={CalendarDay}/>
        </Route>
    </Router>
), document.getElementById('transformatika'))
