(function (window) {
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

  function getResponse(result, isOpen, isClosed) {
    result = JSON.parse(result);
    var i = 0,
      data = versionConverters[result.api](result),
      len;
    if (data.state.open) {
      for (i = 0, len = isOpen.length; i < len; i++) {
        isOpen[i](data);
      }
    } else {
      for (i = 0, len = isClosed.length; i < len; i++) {
        isClosed[i](data);
      }
    }
  }

  function HSIndicator(url) {
    this.url = url;
    this.callbacks = {
      isOpen: [],
      isClosed: [],
      onError: [],
      onRequest: []
    };
    return this;
  }

  function setURL(url) {
    // Create new object only if url is provided
    if (url) return new HSIndicator(url);
    // Otherwise provide list of initialized objects
    else return initialized;
  }

  window.HSIndicator = setURL;

  HSIndicator.prototype.resolve = function resolve() {
    var self = this,
      req = new XMLHttpRequest(),
      i = 0,
      len;
    for (i = 0, len = this.callbacks.onRequest.length; i < len; i++) {
      this.callbacks.onRequest[i]();
    }
    req.onreadystatechange = function (aevt) {
      if (req.readyState === 4) {
        if (req.status === 200) {
          getResponse(req.responseText, self.callbacks.isOpen, self.callbacks.isClosed);
        }
      } else {
        console.log(aevt);
      }
    };
    req.onError = function (error) {
      for (i = 0, len = this.callbacks.onError.length; i < len; i++) {
        this.callbacks.onError[i](error);
      }
    };
    req.open('GET', this.url);
    req.send(null);
  };

  HSIndicator.prototype.isOpen = function isOpen(callback) {
    this.callbacks.isOpen.push(callback);
    return this;
  };

  HSIndicator.prototype.isClosed = function isClosed(callback) {
    this.callbacks.isClosed.push(callback);
    return this;
  };

  HSIndicator.prototype.onError = function onError(callback) {
    this.callbacks.onError.push(callback);
    return this;
  };

  HSIndicator.prototype.onRequest = function onRequest(callback) {
    this.callbacks.onRequest.push(callback);
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
    for (var i = 0, len = initialized.length; i < len; i++) {
      clearInterval(initialized[i].timer);
    }
    initialized = [];
    return this;
  };

  HSIndicator.prototype.getInitialized = function getInitialized() {
    return initialized;
  };


})(window);
