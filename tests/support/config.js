'use strict';

var http = require('http');

module.exports = [
  {
    method: 'GET',
    pattern: 'https://domain.example/(\\w+)',
    fixtures: function () {
      return 'Fixture !';
    },
    callback: function (match, data) {
      return {match: match, data: data};
    }
  },
  {
    method: 'GET',
    pattern: 'https://domain.params.example/list(?:[?|&]((?:limit|offset)=[0-9]+))?(?:[?|&]((?:limit|offset)=[0-9]+))?',
    fixtures: function () {
      return 'Fixture !';
    },
    callback: function (match, data) {
      return {match: match, data: data};
    }
  },
  {
    method: 'GET',
    pattern: 'https://match.example/(\\w+)',
    fixtures: function (match) {
      return match && match[1];
    },
    callback: function (match, data) {
      return {match: match, data: data};
    }
  },
  {
    method: 'GET',
    pattern: 'https://error.example/(\\w+)',
    fixtures: function (match) {
      var code = (match || [])[1] || 404;
      var newErr = new Error(http.STATUS_CODES[code]);
      newErr.response = http.STATUS_CODES[code];
      newErr.status = code;
      throw newErr;
    },
    callback: function (match, data) {
      return {match: match, data: data};
    }
  },
  {
    method: 'GET',
    pattern: 'https://domain.send.example/(\\w+)',
    fixtures: function (match, params) {
      return 'Fixture ! - superhero:' + params.superhero;
    },
    callback: function (match, data) {
      return {match: match, data: data};
    }
  },
  {
    method: 'GET',
    pattern: 'https://authorized.example',
    fixtures: function (match, params, headers) {
      return 'your token: ' + headers['Authorization']
    },
    callback: function (match, data) {
      return {match: match, data: data};
    }
  },
  {
    pattern: 'https://domain.example/(\\w+)',
    fixtures: function () {
      return 'Fixture !';
    },
    callback: function (match, data) {
      return {match: match, data: data};
    }
  },
  {
    pattern: 'https://domain.params.example/list(?:[?|&]((?:limit|offset)=[0-9]+))?(?:[?|&]((?:limit|offset)=[0-9]+))?',
    fixtures: function () {
      return 'Fixture !';
    },
    callback: function (match, data) {
      return {match: match, data: data};
    }
  },
  {
    pattern: 'https://match.example/(\\w+)',
    fixtures: function (match) {
      return match && match[1];
    },
    callback: function (match, data) {
      return {match: match, data: data};
    }
  },
  {
    pattern: 'https://error.example/(\\w+)',
    fixtures: function (match) {
      var code = (match || [])[1] || 404;
      var newErr = new Error(http.STATUS_CODES[code]);
      newErr.response = http.STATUS_CODES[code];
      newErr.status = code;
      throw newErr;
    },
    callback: function (match, data) {
      return {match: match, data: data};
    }
  },
  {
    pattern: 'https://domain.send.example/(\\w+)',
    fixtures: function (match, params) {
      return 'Fixture ! - superhero:' + params.superhero;
    },
    callback: function (match, data) {
      return {match: match, data: data};
    }
  },
  {
    pattern: 'https://authorized.example',
    fixtures: function (match, params, headers) {
      return 'your token: ' + headers['Authorization']
    },
    callback: function (match, data) {
      return {match: match, data: data};
    }
  }
  ];
