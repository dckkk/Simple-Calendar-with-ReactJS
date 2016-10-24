import React from 'react';
import Navbar from '../../../sdk/UI/Navbar';
import CalendarAction from '../../Models/Calendar/Action/CalendarAction';
import CalendarStore from '../../Models/Calendar/Store/CalendarStore';
import moment from 'moment';
import DateTimeField from 'react-bootstrap-datetimepicker';
import Pikaday from '../../../public/assets/pikaday/pikaday.js';

module.exports = React.createClass({
    getInitialState: function(){
        var vm = this;
        return{
            calendar: CalendarStore.getList(),
            m: moment(),
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
                    active: true,
                    onClick: function(){
                        window.location.href = '#/calendar';
                        vm._reload();
                    }
                },{
                    text: 'Week',
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
        var pickerStart = new Pikaday(
        {
            field: document.getElementById('datepicker1'),
            onSelect: function() {
                var date = document.createTextNode(this.getMoment().format('Do MMMM YYYY') + ' ');
            }
        });
        var pickerEnd = new Pikaday(
        {
            field: document.getElementById('datepicker2'),
            onSelect: function() {
                var date = document.createTextNode(this.getMoment().format('Do MMMM YYYY') + ' ');
            }
        });
        CalendarAction.getCalendar();
        CalendarStore.addChangeListener(this._onChange);
        setTimeout(function(){
        $('.ui.accordion').accordion();
        $('#calendar').fullCalendar({
                header: {
                    left: '',
                    center: 'title',
                    right: ''
                },
                // googleCalendarApiKey: 'AIzaSyDGtF7M2xp3BbA5lwFRaSdb8OKdMWPHmC4',
                eventSources: [
                    // {
                        // id: 0,
                        // googleCalendarId: 'en.indonesian#holiday@group.v.calendar.google.com'
                    // },
                    {
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
                            $('#calendar').fullCalendar('unselect');
                            start = '';
                        },
                    inline:true,
                    context:'.ui.wrapper'
                    }).modal('show');

                    $('#title').val(null);
                    $('#description').val(null);
                    
                    $('.ui.checkbox').checkbox({
                        onChecked: function() {
                            $('#datepicker1').prop('disabled', 'disabled');
                            $('#datepicker2').prop('disabled', 'disabled');
                        },
                        onUnchecked: function() {
                            $('#datepicker1').prop('disabled', false);
                            $('#datepicker2').prop('disabled', false);
                        },
                    })

                    $('#datepicker1').val(start.format('YYYY-MM-DD HH:mm:ss'));
                    $('#datepicker2').val(end.format('YYYY-MM-DD HH:mm:ss'));
                    $('.button.delete').hide();
                    $('.button.color').click(function() {
                        var title =  $('#title').val();
                        var description = $('#description').val();
                        var startTime = $('#datepicker1').val();
                        var endTime = $('#datepicker2').val();
                        var check = $('#datepicker1').prop('disabled');
                        if (title !== null && start !== '' && check) {
                            vm.addEvent(title, description, start.format('YYYY-MM-DD HH:mm:ss'), end.format('YYYY-MM-DD HH:mm:ss'), true);
                            $('ui.modal').modal('hide');
                        } else if (title !== null && start !== '') {
                            vm.addEvent(title, description, startTime, endTime, null);
                            $('ui.modal').modal('hide');
                        }
                    });
                },
                editable: false,
                eventLimit: true, // allow "more" link when too many events
                defaultView: 'month',
                eventClick: function(calEvent) {
                    $('.ui.modal')
                    .modal("setting", {
                        onHide: function () {
                            calEvent.id = '';
                            $('#calendar').fullCalendar('unselect');
                        }
                    }).modal('show');

                    $('.ui.checkbox').checkbox({
                        onChecked: function() {
                            $('#datepicker1').prop('disabled', 'disabled');
                            $('#datepicker2').prop('disabled', 'disabled');
                        },
                        onUnchecked: function() {
                            $('#datepicker1').prop('disabled', false);
                            $('#datepicker2').prop('disabled', false);
                        },
                    })

                    $('.button.delete').show();
                    $('#title').val(calEvent.title);
                    $('#description').val(calEvent.description);
                    $('#datepicker1').val(calEvent.start.format('YYYY-MM-DD HH:mm:ss'));
                    $('#datepicker2').val(calEvent.end.format('YYYY-MM-DD HH:mm:ss'));

                    $('.button.color').click(function() {
                        var title =  $('#title').val();
                        var description =  $('#description').val();
                        var startTime = $('#datepicker1').val();
                        var endTime = $('#datepicker2').val();
                        var check = $('#datepicker1').prop('disabled');
                        if (title !== null && check) {
                            vm.updateEvent(calEvent.id, title, description, calEvent.start.format('YYYY-MM-DD HH:mm:ss'), calEvent.end.format('YYYY-MM-DD HH:mm:ss'), true);    
                        $('.ui.modal').modal('hide');
                        } else if (title !== null && startTime!== null) {
                            vm.updateEvent(calEvent.id, title, description, startTime, endTime, null);
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

    updateEvent: function(id, title, description, start, end, allDay){
        if (typeof title !== "undefined" && title.length > 0) {
            CalendarAction.update({
                            id: id,
                            title: title,
                            description: description,
                            start: start,
                            end: end,
                            allDay: allDay
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
    render () {
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
                        <div className="ui tiny modal">
                            <i className="close icon"></i>
                            <div className="header">New Event</div>
                            <div className="content">
                                <div className="ui form">
                                    <div className="field">
                                        <div className="ui small fluid input">
                                            <input type="text" id="title" placeholder="Event.." ref="title" required/>
                                        </div>
                                    </div>
                                    <div className="ui accordion field">
                                        <div className="title">
                                            <i className="icon dropdown"></i>
                                            Advance
                                        </div>
                                        <div className="content field">
                                            <div className="field">
                                                <div className="ui small fluid input">
                                                    <textarea id="description" rows="4" placeholder="Description..." required></textarea>
                                                </div>                                    
                                            </div>
                                            <div className="fields">
                                                <div className="ui eight wide field">
                                                    <input type="text" disabled className="ui input" id="datepicker1" />
                                                </div>
                                                <div className="ui eight wide field">
                                                    <input type="text" disabled className="ui input" id="datepicker2" />
                                                </div>
                                            </div>
                                            <div className="field">           
                                                <div className="ui toggle checkbox">
                                                    <input type="checkbox" defaultChecked name="allDay"/>
                                                    <label>All Day</label>
                                                </div>
                                            </div>
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
