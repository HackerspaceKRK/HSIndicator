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

  function setURL(url) {
    // Create new object only if url is provided
    if (url) return new HSIndicator(url);
    // Otherwise try to provide first item in the initialized list.
    else if (initialized.length > 0 && initialized[0]) return initialized[0];
  }

  window.HSIndicator = setURL;

  HSIndicator.prototype.resolve = function resolve() {
    var self = this;
    $.ajax({
      type: 'GET',
      url: this.url,
      beforeSend: function () {
        self.callbacks.retry.forEach(function (what) {
          what();
        });
      }
    }).done(function (result) {
      console.log(result);
      var data = versionConverters[result.api](result);
      if (data.state.open) {
        self.callbacks.onOpen.forEach(function (what) {
          what(data);
        });
      } else {
        self.callbacks.onClosed.forEach(function (what) {
          what(data);
        });
      }
    }).fail(function (jqXHR, errText, err) {
      self.callbacks.error.forEach(function (what) {
        what(errText, err);
      });
    });
  };

  HSIndicator.prototype.onOpen = function onOpen(callback) {
    this.callbacks.onOpen.push(callback);
  };

  HSIndicator.prototype.onClosed = function onClosed(callback) {
    this.callbacks.onClosed.push(callback);
  };

  HSIndicator.prototype.error = function error(callback) {
    this.callbacks.error.push(callback);
  };

  HSIndicator.prototype.retry = function retry(callback) {
    this.callbacks.retry.push(callback);
  };

  HSIndicator.prototype.start = function start(timeout) {
    if (this.timer) {
      this.stop();
    }
    this.resolve();
    this.timer = setInterval(this.resolve.bind(this), timeout);
    initialized.push(this);
  };

  HSIndicator.prototype.stop = function stop() {
    if (this.timer) {
      clearInterval(this.timer);
      delete this.timer;
    }
  };

  HSIndicator.prototype.stopAll = function stopAll() {
    initialized.forEach(function (item) {
      clearInterval(item.timer);
      item = undefined;
    });
  };

  HSIndicator.prototype.getInitialized = function getInitialized() {
    return initialized;
  };


})(window, jQuery);

