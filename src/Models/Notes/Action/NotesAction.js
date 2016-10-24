import AppDispatcher from '../../../Dispatcher/AppDispatcher';
import NotesConstants from '../Constant/NotesConstants';
import NotesAPI from '../Util/NotesAPI';

module.exports = {
    getNotes(params){
        AppDispatcher.handleViewAction({
            actionType: NotesConstants.GET_NOTES
        });

        NotesAPI.get(params);
    },

    save(params){
        AppDispatcher.handleViewAction({
            actionType: NotesConstants.SAVE_NOTES
        });

        NotesAPI.save(params);
    },

    update(params){
        AppDispatcher.handleViewAction({
            actionType: NotesConstants.UPDATE_NOTES
        });

        NotesAPI.update(params);
    },
    delete(params){
        AppDispatcher.handleViewAction({
            actionType: NotesConstants.DELETE_NOTES
        });

        NotesAPI.delete(params);
    }
}
