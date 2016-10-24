import AppDispatcher from '../../../Dispatcher/AppDispatcher';
import AppConstants from '../Constant/NotesConstants';
import ObjectAssign from 'object-assign';
import { EventEmitter } from 'events';

var CHANGE_EVENT = 'change';

var _store = [];

var NotesStore = ObjectAssign({}, EventEmitter.prototype, {
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
        case AppConstants.GET_NOTES_RESPONSE:
            _store = payload.action.response;
            NotesStore.emit(CHANGE_EVENT);
            break;
        case AppConstants.SAVE_NOTES_RESPONSE:
            var data = payload.action.response;
            _store.push(data);
            NotesStore.emit(CHANGE_EVENT);
            break;
        case AppConstants.DELETE_NOTES_RESPONSE:
            var id = payload.action.response;
            for (var i = 0; i < _store.length; i++) {
                if (_store[i].id === id) {
                    _store.splice(i, 1);
                }
            }
            NotesStore.emit(CHANGE_EVENT);
            break;
        default:
            return true;
    }
});

module.exports = NotesStore;
