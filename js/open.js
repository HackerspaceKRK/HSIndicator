var HSIndicator = (function(url){

    var callbacks = {
        onOpen : [],
        onClosed : [],
        error : [],
        retry : []
    },

    timer = undefined;

    function resolve() {
        jQuery.ajax({
            type : 'GET',
            url : url,
            beforeSend : function() {
                callbacks.retry.forEach(function(what) { what(); });
            }
        }).done(function(data) {
            if(data.state.open) {
                callbacks.onOpen.forEach(function(what) { what({lastchange : data.state.lastchange}); });
            }
            else {
                callbacks.onClosed.forEach(function(what) { what({lastchange : data.state.lastchange}); });
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

    function onClosed(callback) {
        callbacks.onClosed.push(callback);
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
        return this;
    };

    function stop() {
        if(timer) {
            clearInterval(timer);
            timer = undefined;
        }
        return this;
    };

    function isStarted() {
        return (timer) ? true : false;
    }

    return {
        onOpen : onOpen,
        onClosed : onClosed,
        error : error,
        retry : retry,
        start : start,
        stop : stop,
        check : resolve
    };

});
