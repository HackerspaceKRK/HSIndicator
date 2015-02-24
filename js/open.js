(function (window, $) {
  "use strict";

  var initialized = [],
    versionConverters = {
      '0.8': function (data) {
        return {
          state: {
            open: data.open,
            lastchange: data.lastchange,
            icon: {
              open: undefined,
              closed: undefined
            },
            message: data.status,
            trigger_person: undefined
          }
        };
      },
      '0.9': function (data) {
        return {
          state: {
            open: data.open,
            lastchange: data.lastchange,
            icon: {
              open: undefined,
              closed: undefined
            },
            message: data.status,
            trigger_person: undefined
          }
        };
      },
      '0.11': function (data) {
        return {
          state: {
            open: data.open,
            lastchange: data.lastchange,
            icon: data.icon,
            message: data.status,
            trigger_person: undefined
          }
        };
      },
      '0.12': function (data) {
        return {
          state: {
            open: data.open,
            lastchange: data.lastchange,
            icon: data.icon,
            message: data.status,
            trigger_person: undefined
          }
        };
      },
      '0.13': function (data) {
        return data;
      }
    };


  function HSIndicator(url) {
    this.url = url;
    this.callbacks = {
      onOpen: [],
      onClosed: [],
      error: [],
      retry: []
    };
    return this;
  }

  HSIndicator.prototype.resolve = function resolve() {
    var self = this;
    $.ajax({
      type: 'GET',
      url: this.url,
      beforeSend: function () {
        $.each(self.callbacks.retry, function (what) {
          what();
        });
      }
    }).done(function (result) {
      console.log(result);
      var data = versionConverters[result.api](result);
      if (data.state.open) {
        $.each(self.callbacks.onOpen, function (what) {
          what(data);
        });
      } else {
        $.each(self.callbacks.onClosed, function (what) {
          what(data);
        });
      }
    }).fail(function (jqXHR, errText, err) {
      $.each(self.callbacks.error, function (what) {
        what(errText, err);
      });
    });
  };

  HSIndicator.prototype.onOpen = function onOpen(callback) {
    this.callbacks.onOpen.push(callback);
    return this;
  };

  HSIndicator.prototype.onClosed = function onClosed(callback) {
    this.callbacks.onClosed.push(callback);
    return this;
  };

  HSIndicator.prototype.error = function error(callback) {
    this.callbacks.error.push(callback);
    return this;
  };

  HSIndicator.prototype.retry = function retry(callback) {
    this.callbacks.retry.push(callback);
    return this;
  };

  HSIndicator.prototype.start = function start(timeout) {
    if (this.timer) {
      this.stop();
    }
    this.resolve();
    this.timer = setInterval(this.resolve.bind(this), timeout);
    initialized.push(this);
    return this;
  };

  HSIndicator.prototype.stop = function stop() {
    if (this.timer) {
      clearInterval(this.timer);
      delete this.timer;
    }
    return this;
  };

  HSIndicator.prototype.stopAll = function stopAll() {
    $.each(initialized, function (item) {
      clearInterval(item.timer);
      item = undefined;
    });
    return this;
  };

  HSIndicator.prototype.getInitialized = function getInitialized() {
    return initialized;
  };

  function setURL(url) {
    var instance;
    // Create new object only if url is provided
    if (url) instance = new HSIndicator(url);
    // Otherwise try to provide first item in the initialized list.
    else if (initialized.length > 0 && initialized[0]) instance =  initialized[0];
    return instance;
  }

  window.HSIndicator = setURL;

})(window, jQuery);

