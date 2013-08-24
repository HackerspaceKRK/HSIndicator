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

    timer : undefined,

    resolve : function() {
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
                HSIndicator.callbacks.onClose.forEach(function(what) { what(); });
            }
        }).fail(function(err) {
            HSIndicator.callbacks.error.forEach(function(what) { what(err); });
        });
        return HSIndicator;
    },

    onOpen : function(callback) {
        HSIndicator.callbacks.onOpen.push(callback);
        return HSIndicator;
    },

    onClose : function(callback) {
        HSIndicator.callbacks.onClose.push(callback);
        return HSIndicator;
    },

    error : function(callback) {
        HSIndicator.callbacks.error.push(callback);
        return HSIndicator;
    },

    retry : function(callback) {
        HSIndicator.callbacks.retry.push(callback);
        return HSIndicator;
    },

    start : function(timeout) {
        if(HSIndicator.isStarted()) {
            HSIndicator.stop();
        }
        HSIndicator.timer = setInterval(HSIndicator.resolve, timeout);
    },

    stop : function() {
        if(HSIndicator.timer) {
            clearInterval(HSIndicator.timer);
            HSIndicator.timer = undefined;
        }
    },

    isStarted : function() {
        return (HSIndicator.timer) ? true : false;
    }

};
