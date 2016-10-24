import AppDispatcher from '../../../Dispatcher/AppDispatcher';
import AppConstants from '../Constant/CalendarConstants';
import ObjectAssign from 'object-assign';
import { EventEmitter } from 'events';

var CHANGE_EVENT = 'change';

var _store = [];

var CalendarStore = ObjectAssign({}, EventEmitter.prototype, {
    addChangeListener: function(cb) {
        this.on(CHANGE_EVENT, cb);
    },

    removeChangeListener: function(cb) {
        this.removeListener(CHANGE_EVENT, cb);
    },

    getList: function() {
        return _store;
    }
});

AppDispatcher.register(function(payload){
    switch (payload.action.actionType) {
        case AppConstants.GET_CALENDAR_RESPONSE:
            _store = payload.action.response;
            CalendarStore.emit(CHANGE_EVENT);
            break;
        case AppConstants.SAVE_CALENDAR_RESPONSE:
            var data = payload.action.response;
            _store.push(data);
            CalendarStore.emit(CHANGE_EVENT);
            break;
        case AppConstants.UPDATE_CALENDAR_RESPONSE:
            var data = payload.action.response;
            var tempStore = _store;
            for (var i = 0; i < _store.length; i++) {
                if (_store[i].id === data.id) {
                    _store[i] = data;
                }
            }
            CalendarStore.emit(CHANGE_EVENT);
        case AppConstants.DELETE_CALENDAR_RESPONSE:
            var id = payload.action.response;
            for (var i = 0; i < _store.length; i++) {
                if (_store[i].id === id) {
                    _store.splice(i, 1);
                }
            }
            CalendarStore.emit(CHANGE_EVENT);
            break;
        default:
            return true;
    }
});

module.exports = CalendarStore;
