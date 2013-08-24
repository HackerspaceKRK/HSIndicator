var HSIndicator = {
    API : {
        url : "http://spaceapi.hskrk.pl/"
    },

    isOpen : function(onOpen, onClosed) {
        jQuery.ajax({
            type : 'GET',
            url : HSIndicator.API.url, //TODO test w/o "HSIndicator" for fun and profit.
            success : function(data) {
                if(data.state.open) {
                    onOpen && onOpen();
                }
                else {
                    onClosed && onClosed();
                }
            }
        });
    }
};
