'use strict';

var qs = require('qs');

/**
 * Module exports.
 */
module.exports = mock;

function genParserKey (method, url){
  return method + ' ' + url;
}

/**
 * Installs the `mock` extension to superagent.
 */
function mock (superagent, config) {
  var Request = superagent.Request;
  var parsers = Object.create(null);

  /**
   * Keep the default methods
   */
  var oldSend = Request.prototype.send;
  var oldEnd = Request.prototype.end;
  var oldRequest = Request.prototype.request;

  /**
   * Attempt to match url against the patterns in fixtures.
   */
  function testUrlForPatterns(method, url) {
    var key = genParserKey(method, url);
    if (parsers[key]) { return parsers[key]; }

    var match = config.filter(function (parser) {
      return (method === parser.method) && new RegExp(parser.pattern, 'g').test(url);
    })[0] || null;

    parsers[key] = match;

    return match;
  }

  /**
   * Override send function
   */
  Request.prototype.send = function (data) {
    var parser = testUrlForPatterns(this.method, this.url);
    if (parser) {
      this.params = data;

      return this;
    } else {
      return oldSend.call(this, data);
    }

  };

  /**
   * Override set function
   */
  /*Request.prototype.set = function (headers) {
    this.headers = headers;

    return this;
  };*/

  /**
   * Avoid setup a real requet object in node.js env for mock cause
   */

  Request.prototype.request = function() {

    var parser = testUrlForPatterns(this.method, this.url);
    if (parser) {
      // Return a dummy object with some fake methods
      // Might need to implement `write` and `removeHeader` in the future
      return {
        setHeader: function() {}
      };
    } else {
      return oldRequest.call(this);
    }
  };


  /**
   * Override end function
   */
  Request.prototype.end = function (fn) {
    var path = this.url;
    var querystring = '';

    if (this._query) {
      querystring += this._query.join('&');
    } else {
      if (this.qs) {
        querystring += qs.stringify(this.qs);
      }
      if (this.qsRaw) {
        querystring += this.qsRaw.join('&');
      }
    }


    if (querystring.length) {
      path += (~path.indexOf('?') ? '&' : '?') + querystring;
    }
    // Must call testUrlForPatterns as we might not call it before calling `end`.
    // I.e parser might not be cached in parsers.
    var parser = testUrlForPatterns(this.method, this.url);

    if (parser) {
      var match = new RegExp(parser.pattern, 'g').exec(path);

      try {
        var fixtures = parser.fixtures(match, this.params, this.headers, this.method);
        fn(null, parser.callback(match, fixtures));
      } catch(err) {
        fn(err, undefined);
      }
    } else {
      oldEnd.call(this, fn);
    }
  };
}
