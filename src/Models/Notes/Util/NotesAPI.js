import NotesServerAction from '../Action/NotesServerAction';

module.exports = {
    get(params){
        if (typeof params === 'undefined') {
            params = {};
        }
        $.ajax({
            url: 'api/notes.php',
            responseType: 'json',
            data: params,
            type: 'get',
            success: function(res) {

                NotesServerAction.get(res);
            }
        })
    },
    save(params){
        $.ajax({
            url: 'api/notes.php?action=save',
            data: params,
            responseType: 'json',
            type: 'post',
            success: function(res){
                if (!res.error) {
                    NotesServerAction.save(params);
                }
            }
        })
    },
    update(params){
        $.ajax({
            url: 'api/notes.php?action=update',
            data: params,
            responseType: 'json',
            type: 'post',
            success: function(res){
                if (!res.error) {
                    NotesServerAction.update(params);
                }
            }
        })
    },
    delete(params){
        $.ajax({
            url: 'api/notes.php?action=delete',
            data: params,
            responseType: 'json',
            type: 'post',
            success: function(res){
                if (!res.error) {
                    NotesServerAction.delete(params.id);
                }
            }
        })
    }
}
