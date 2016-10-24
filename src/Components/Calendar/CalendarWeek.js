import React from 'react';
import Navbar from '../../../sdk/UI/Navbar';
import CalendarAction from '../../Models/Calendar/Action/CalendarAction';
import CalendarStore from '../../Models/Calendar/Store/CalendarStore';
import {RadioGroup, Radio} from 'react-radio-group';
import moment from 'moment';

module.exports = React.createClass({
    getInitialState: function(){
        var vm = this;
        return{
            calendar: CalendarStore.getList(),
            event: {
                title: '',
                color: '',
                start: '',
                end: '',
                allDay: ''
            },
            navbar: {
                left: [{
                    text: '<',
                    onClick: function(){
                        $('#calendar').fullCalendar('prev');
                        vm._reload();
                    }
                }, 
                {
                    text: 'Today',
                    onClick: function(){
                        $('#calendar').fullCalendar('today');
                        vm._reload();
                    }
                },
                {
                    text: '>',
                    onClick: function(){
                        $('#calendar').fullCalendar('next');
                        vm._reload();
                    }
                }],
                center: [{
                    text: 'Month',
                    onClick: function(){
                        window.location.href = '#/calendar';
                        vm._reload();
                    }
                },{
                    text: 'Week',
                    active: true,
                    onClick: function(){
                        window.location.href = '#/calendarweek';
                        vm._reload();
                    }
                },{
                    text: 'Day',
                    onClick: function(){
                        window.location.href = '#/calendarday';
                        vm._reload();
                    }
                }]
            }
        }
    },

    /**
     * NotesAction.getNotes() adalah fungsi untuk mengambil data dari API
     * kemudian tambahkan event di NotesStore agar data selalu uptodate
     * @return {[type]} [description]
     */
    componentDidMount: function(){
        var vm = this;
        CalendarAction.getCalendar();
        CalendarStore.addChangeListener(this._onChange);
        setTimeout(function(){
        $('#calendar').fullCalendar({
                header: {
                    left: '',
                    center: 'title',
                    right: ''
                },
                googleCalendarApiKey: 'AIzaSyDGtF7M2xp3BbA5lwFRaSdb8OKdMWPHmC4',
                eventSources: [
                    {
                        id: 0,
                        googleCalendarId: 'en.indonesian#holiday@group.v.calendar.google.com'
                    },{
                        id: 1,
                        events: function(start, end, timezone, callback){
                            var eventList = vm.state.calendar;
                            var events = [];
                            if (eventList.length !== 0) {
                                for (var i = 0; i<eventList.length; i++) {
                                    events.push({
                                        id: eventList[i].id, 
                                        title: eventList[i].title, 
                                        description: eventList[i].description, 
                                        start: eventList[i].start, 
                                        end: eventList[i].end, 
                                        allDay: eventList[i].allDay, 
                                    })
                                }
                            }
                            callback (events);
                        },
                        color: 'orange'
                }
                ],
                selectable: true,
                selectHelper: true,
                select: function(start, end) {
                    $('.ui.modal')
                    .modal("setting", {
                        onHide: function () {
                            $('#title').val(null);
                            $('#calendar').fullCalendar('unselect');
                            start = '';
                        }
                    }).modal('show');
                    $('.button.delete').hide();
                    $('#title').val(null);
                    $('.button.color').click(function() {
                        var title =  $('#title').val();
                        var description = $('#description').val();
                        var allDay = start._ambigTime;
                        if (title !== null && start !== '' && allDay == false) {
                            vm.addEvent(title, description, start.format('YYYY-MM-DD HH:mm:ss'), end.format('YYYY-MM-DD HH:mm:ss'), null);
                        $('.ui.modal').modal('hide');
                        } else if (title !== null && start !== '' && allDay == true) {
                            vm.addEvent(title, description, start.format('YYYY-MM-DD HH:mm:ss'), end.format('YYYY-MM-DD HH:mm:ss'), true);
                        }
                    });
                },
                editable: false,
                eventLimit: true, // allow "more" link when too many events
                defaultView: 'agendaWeek',
                eventClick: function(calEvent) {
                    $('.ui.modal')
                    .modal("setting", {
                        onHide: function () {
                            calEvent.id = '';
                            $('#calendar').fullCalendar('unselect');
                        }
                    }).modal('show');
                    $('.button.delete').show();
                    $('#title').val(calEvent.title);
                    $('#description').val(calEvent.description);
                    $('.button.color').click(function() {
                        var title =  $('#title').val();
                        var description =  $('#description').val();
                        if (title !== null && calEvent.id !== '') {
                            vm.updateEvent(calEvent.id, title, description);    
                        $('.ui.modal').modal('hide');
                        }
                    });
                    $('.button.delete').click(function(){
                        if (calEvent.id !== '') {
                            vm.deleteEvent(calEvent.id);
                            $('.ui.modal').modal('hide');
                        }
                    });
                }, 
                // viewRender: function(event, element) {
                //     var navbar = vm.state.nextavbar;
                //     console.log(event);
                //     navbar.center = event.title;
                //     vm.setState({
                //         navbar: navbar
                //     })
                // }
            });
        }, 500);
    },

    /**
     * Menghapus event dari NotesStore sebelum komponen di unmount
     * agar tidak terjadi Javascript memory leak
     * @return {[type]} [description]
     */
    componentWillUnmount: function(){
        CalendarStore.removeChangeListener(this._onChange);
        $('#calendar').fullCalendar('destroy');
        $('#calendar').fullCalendar('removeEventSources', 1);
        $('.ui.modal').remove();
    },

    handleChange: function(data){
        console.log(data);
    },

    addEvent: function(title, description, start, end, allDay){
        if (typeof title !== "undefined" && title.length > 0) {
            CalendarAction.save({
                            title: title,
                            description: description,
                            start: start,
                            end: end,
                            allDay: allDay
                        });
        }
    },

    updateEvent: function(id, title, description){
        if (typeof title !== "undefined" && title.length > 0) {
            CalendarAction.update({
                            id: id,
                            title: title,
                            description: description
                        });
        }
    },

    deleteEvent: function(id) {
        CalendarAction.delete({
            id: id
        });
    },
    /**
     * Event untuk mengupdate state bila ada perubahan data pada Store
     * @return {[type]} [description]
     */
    _onChange: function(){
        this.setState({
            calendar: CalendarStore.getList()
        });
        var vm = this;
        setTimeout(function() {
            $('#calendar').fullCalendar('refetchEventSources', 1);
        }, 100);
    },

    _reload: function(){
        var interval = $('#calendar').fullCalendar('getView');
        CalendarAction.getCalendar({
            start: interval.intervalStart.format("YYYY-MM-DD HH:mm:ss"),
            end: interval.intervalEnd.format("YYYY-MM-DD HH:mm:ss"),
        });
    },

    _openNote: function(e){
        var id = $(e.target).attr('data-id');
        window.location.href = '#/calendar/detail/'+id;
    },

    /**
     * Render Component
     * @return {[type]} [description]
     */
    render(){
        var calendar = [];
        if (this.state.calendar && this.state.calendar.length > 0) {
            calendar = this.state.calendar;
        }
        var totalCalendar = calendar.length;
        var emptyCalendar = false;
        if (totalCalendar === 0) {
            emptyCalendar = true;
        }
        var vm = this;
        return(
            <element id="com.transformatika.calendar">
                <Navbar config={this.state.navbar}/>
                <div className="ui wrapper">
                    <div className="ui container">
                        <div id="calendar"></div>
                        <div className="ui small modal">
                            <i className="close icon"></i>
                            <div className="header">New Event</div>
                            <div className="content">
                                <div className="ui form">
                                    <div className="field">
                                        <div className="ui small fluid input">
                                            <input type="text" id="title" placeholder="Title.." ref="title" required/>
                                        </div>
                                    </div>
                                    <br />
                                    <div className="field">
                                        <div className="ui small fluid input">
                                            <textarea id="description" placeholder="Add Description..." required></textarea>
                                        </div>                                    
                                    </div>
                                </div>
                            </div>
                            <div className="ui clearing segment">  
                                <div className="actions">
                                    <button className="ui right floated tiny blue button color" data-color="#ff4d4d">Save</button>
                                    <button className="ui left floated tiny button delete">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </element>
        )
    }
});
