import CalendarServerAction from '../Action/CalendarServerAction';

module.exports = {
    get(params){
        if (typeof params === 'undefined') {
            params = {};
        }
        $.ajax({
            url: 'api/calendar.php',
            responseType: 'json',
            data: params,
            type: 'get',
            success: function(res) {

                CalendarServerAction.get(res);
            }
        })
    },
    save(params){
        $.ajax({
            url: 'api/calendar.php?action=save',
            data: params,
            responseType: 'json',
            type: 'post',
            success: function(res){
                if (!res.error) {
                    CalendarServerAction.save(res.record);
                }
            }
        })
    },
    update(params){
        $.ajax({
            url: 'api/calendar.php?action=update',
            data: params,
            responseType: 'json',
            type: 'post',
            success: function(res){
                if (!res.error) {
                    CalendarServerAction.update(res.records);
                }
            }
        })
    },
    delete(params){
        $.ajax({
            url: 'api/calendar.php?action=delete',
            data: params,
            responseType: 'json',
            type: 'post',
            success: function(res){
                if (!res.error) {
                    CalendarServerAction.delete(params.id);
                }
            }
        })
    }
}
