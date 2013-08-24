var HSIndicator = {
    API : {
        url : "http://spaceapi.hskrk.pl/"
    },

    callbacks : {
        onOpen : [],
        onClose : [],
        error : [],
        retry : []
    },

    resolve : function(onOpen, onClosed) {
        jQuery.ajax({
            type : 'GET',
            url : HSIndicator.API.url, //TODO test w/o "HSIndicator" for fun and profit.
            beforeSend : function() {
                HSIndicator.callbacks.retry.forEach(function(what) { what(); });
            }
        }).done(function(data) {
            if(data.state.open) {
                HSIndicator.callbacks.onOpen.forEach(function(what) { what(); });
            }
            else {
                HSIndicator.callbacks.onClosed.forEach(function(what) { what(); });
            }
        }).fail(function(err) {
            HSIndicator.callbacks.error.forEach(function(what) { what(err); });
        });
        return HSIndicator;
    },

    onOpen : function(callback) {
        HSIndicator.callback.onOpen.append(callback);
    },

    onClose : function(callback) {
        HSIndicator.callback.onClose.append(callback);
    },

    error : function(callback) {
        HSIndicator.callback.error.append(callback);
    },

    retry : function(callback) {
        HSIndicator.callback.retry.append(callback);
    }
};
