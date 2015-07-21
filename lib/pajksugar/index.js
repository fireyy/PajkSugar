"use strict";

var $ = require('zepto');
var _ = require('underscore');
var PaLogger = require("pajklogger");
var PxLoader = require("preloader");
var PageSlider = require("pageslider");
var mApi = require("api");

var PajkSugar = function (options) {
    this.version = '0.0.1';

    //默认配置
    this.options = {};

    //初始化配置
    this.options = _.extend(this.options, options);

    //赋值模块
    this.PreLoader = PxLoader;
    this.PajkLogger = PaLogger;
    this.PageSlider = PageSlider;
    this.Api = mApi;

};

// Date.now() shim for older browsers
if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}

// shims to ensure we have newer Array utility methods
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
if (!Array.isArray) {
    Array.isArray = function (arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}

module.exports = window.PajkSugar = new PajkSugar();
