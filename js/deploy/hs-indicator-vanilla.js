/* global Promise: true  */
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
    (function () {
        return new Promise(function (resolve, reject) {
            var oReq = new XMLHttpRequest();
            oReq.addEventListener("load", function () {
                resolve(this.response);
            });
            oReq.addEventListener("error", function () {
                reject(this.statusText, this.status);
            });
            oReq.addEventListener("abort", function () {
                reject(this.statusText, this.status);
            });
            oReq.open("GET", self.url);
            // here we will call all retry callbacks
            self.callbacks.retry.forEach(function (callback) {
                setTimeout(function () {
                    callback();
                }, 0);
            });
            oReq.send();
        });
    })().then(function (response) {
        var jsonResponse = typeof response === 'object' ? response : JSON.parse(response);
        //console.log(jsonResponse);
        var data = versionConverters[jsonResponse.api](jsonResponse);
        console.log(data);
        if (data.state.open) {
            self.callbacks.onOpen.forEach(function (callback) {
                setTimeout(function () {
                    callback(data);
                }, 0);
            });
        } else {
            self.callbacks.onClosed.forEach(function (callback) {
                setTimeout(function () {
                    callback(data);
                }, 0);
            });
        }
    }).catch(function (errText, err) {
        self.callbacks.error.forEach(function (callback) {
            callback(errText, err);
            setTimeout(function () {
                callback(errText, err);
            }, 0);
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
    initialized.forEach(function (item) {
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
    else if (initialized.length > 0 && initialized[0]) instance = initialized[0];
    return instance;
  }

  window.HSIndicator = setURL;

})(window);
