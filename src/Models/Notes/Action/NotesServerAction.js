import AppDispatcher from '../../../Dispatcher/AppDispatcher';
import NotesConstants from '../Constant/NotesConstants';

module.exports = {
    get(response) {
        AppDispatcher.handleServerAction({
            actionType: NotesConstants.GET_NOTES_RESPONSE,
            response: response
        });
    },

    save(response){
        AppDispatcher.handleServerAction({
            actionType: NotesConstants.SAVE_NOTES_RESPONSE,
            response: response
        });
    },

    update(response){
        AppDispatcher.handleServerAction({
            actionType: NotesConstants.UPDATE_NOTES_RESPONSE,
            response: response
        });
    },

    delete(response){
        AppDispatcher.handleServerAction({
            actionType: NotesConstants.DELETE_NOTES_RESPONSE,
            response: response
        });
    }
};
