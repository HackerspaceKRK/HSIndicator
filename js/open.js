var HSIndicator = (function(url){
    var API = {
        url : url
    },

    callbacks = {
        onOpen : [],
        onClose : [],
        error : [],
        retry : []
    },

    timer = undefined;

    function api(URL) {
        API.url = URL;
        return this;
    };

    function resolve() {
        jQuery.ajax({
            type : 'GET',
            url : API.url, //TODO test w/o "HSIndicator" for fun and profit.
            beforeSend : function() {
                callbacks.retry.forEach(function(what) { what(); });
            }
        }).done(function(data) {
            if(data.state.open) {
                callbacks.onOpen.forEach(function(what) { what(); });
            }
            else {
                callbacks.onClose.forEach(function(what) { what(); });
            }
        }).fail(function(err) {
            callbacks.error.forEach(function(what) { what(err); });
        });
        return this;
    };

    function onOpen(callback) {
        callbacks.onOpen.push(callback);
        return this;
    };

    function onClose(callback) {
        callbacks.onClose.push(callback);
        return this;
    };

    function error(callback) {
        callbacks.error.push(callback);
        return this;
    };

    function retry(callback) {
        callbacks.retry.push(callback);
        return this;
    };

    function start(timeout) {
        if(isStarted()) {
            stop();
        }
        timer = setInterval(resolve, timeout);
    };

    function stop() {
        if(timer) {
            clearInterval(timer);
            timer = undefined;
        }
    };

    function isStarted() {
        return (timer) ? true : false;
    }

    return {
        api : api,
        onOpen : onOpen,
        onClose : onClose,
        error : error,
        retry : retry,
        start : start,
        stop : stop
    };

});
