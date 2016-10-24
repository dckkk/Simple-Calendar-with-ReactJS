
import AppDispatcher from '../../../Dispatcher/AppDispatcher';
import CalendarConstants from '../Constant/CalendarConstants';

module.exports = {
    get(response) {
        AppDispatcher.handleServerAction({
            actionType: CalendarConstants.GET_CALENDAR_RESPONSE,
            response: response
        });
    },

    save(response){
        AppDispatcher.handleServerAction({
            actionType: CalendarConstants.SAVE_CALENDAR_RESPONSE,
            response: response
        });
    },

    update(response){
        AppDispatcher.handleServerAction({
            actionType: CalendarConstants.UPDATE_CALENDAR_RESPONSE,
            response: response
        });
    },

    delete(response){
        AppDispatcher.handleServerAction({
            actionType: CalendarConstants.DELETE_CALENDAR_RESPONSE,
            response: response
        });
    }
};
