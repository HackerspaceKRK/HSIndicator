var HSIndicator = (function(url){
    
    var callbacks = {
        onOpen : [],
        onClosed : [],
        error : [],
        retry : []
        },

        versionConverters = {
            '0.8' : function(data) {
                return { state : { open : data.open,
                                   lastchange : data.lastchange,
                                   icon : { open : undefined, closed : undefined },
                                   message : data.status,
                                   trigger_person : undefined}};
            },
            '0.9' : function(data) {
                return { state : { open : data.open,
                                   lastchange : data.lastchange,
                                   icon : { open : undefined, closed : undefined },
                                   message : data.status,
                                   trigger_person : undefined}};
            },
            '0.11' : function(data) {
                return { state : { open : data.open,
                                   lastchange : data.lastchange,
                                   icon : data.icon,
                                   message : data.status,
                                   trigger_person : undefined}};
            },
            '0.12' : function(data) {
                return { state : { open : data.open,
                                   lastchange : data.lastchange,
                                   icon : data.icon,
                                   message : data.status,
                                   trigger_person : undefined}};
            },
            '0.13' : function(data) {
                return data;
            }}
        
        timer = undefined;

    function resolve() {
        jQuery.ajax({
            type : 'GET',
            url : url,
            beforeSend : function() {
                callbacks.retry.forEach(function(what) { what(); });
            }
        }).done(function(result) {
            data = versionConverters[result.api](result);
            if(data.state.open) {
                callbacks.onOpen.forEach(function(what) { what(data); });
            }
            else {
                callbacks.onClosed.forEach(function(what) { what(data); });
            }
        }).fail(function(jqXHR, errText, err) {
            callbacks.error.forEach(function(what) { what(errText, err); });
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
        resolve();
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
