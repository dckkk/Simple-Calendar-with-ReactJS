import AppDispatcher from '../../../Dispatcher/AppDispatcher';
import CalendarConstants from '../Constant/CalendarConstants';
import CalendarAPI from '../Util/CalendarAPI';

module.exports = {
    getCalendar(params){
        AppDispatcher.handleViewAction({
            actionType: CalendarConstants.GET_CALENDAR
        });

        CalendarAPI.get(params);
    },

    save(params){
        AppDispatcher.handleViewAction({
            actionType: CalendarConstants.SAVE_CALENDAR
        });

        CalendarAPI.save(params);
    },

    update(params){
        AppDispatcher.handleViewAction({
            actionType: CalendarConstants.UPDATE_CALENDAR
        });

        CalendarAPI.update(params);
    },
    
    delete(params){
        AppDispatcher.handleViewAction({
            actionType: CalendarConstants.DELETE_CALENDAR
        });

        CalendarAPI.delete(params);
    }
}
