/**
 * m.api request
 */

 var SIMS_API_URL, SIMS_STATIC_URL;

if(location.host.indexOf("jc.dev.pajkdc.com") != -1){
  // 集成开发环境
  SIMS_API_URL      = 'http://api.jc.dev.pajkdc.com/m.api';
  SIMS_STATIC_URL   = 'http://10.0.18.141/v1/tfs/';
}else if(location.host.indexOf("dev.pajkdc.com") != -1){
  // 开发环境
  //SIMS_API_URL    = 'http://api.dev.pajkdc.com/m.api';
  SIMS_API_URL      = 'http://api.jc.dev.pajkdc.com/m.api';
  SIMS_STATIC_URL = 'http://10.0.18.141/v1/tfs/';
}else if(location.host.indexOf("test.pajkdc.com") != -1){
  // 测试环境
  SIMS_API_URL      = 'http://api.test.pajkdc.com/m.api';
  SIMS_STATIC_URL   = 'http://10.128.240.46/v1/tfs/';
}else if(location.host.indexOf("pre.jk.cn") != -1){
  // 预发环境
  SIMS_API_URL      = 'http://api.pre.jk.cn/m.api';
  SIMS_STATIC_URL   = 'http://static.jk.cn/';
}else if(location.host.indexOf("jk.cn") != -1){
  // 正式线上环境
  SIMS_API_URL      = 'http://api.jk.cn/m.api';
  SIMS_STATIC_URL   = 'http://static.jk.cn/';
}else{
  SIMS_API_URL      = 'http://api.jk.cn/m.api';
  SIMS_STATIC_URL   = 'http://static.jk.cn/';
}

function mAPI(config) {
    this.defaultOption = {
        level: "None",
        setting: {
            type: "GET",
            dataType: "json"
        }
    };
}

mAPI.prototype = {
    getInfo: function(data, fn){
        var options = {};
        options.setting = {
            "data": data,
            "success": fn
        };
        this.request(options);
    },
    getApi: function(data, fn){
        var options = {};
        options.level = "UserLogin";
        options.setting = {
            "data": data,
            "success": fn
        };
        this.request(options);
    },
    request: function(options){
        var opt = $.extend( {}, this.defaultOption, options );

        if (opt.level != "None") {
            opt.setting.xhrFields = {
                withCredentials: true
            };
        }

        opt.setting.url = SIMS_API_URL;

        opt.setting.data = this._encrypt(opt.level, options.params);

        opt.setting.success = function(data){

            if (data && data.stat && data.stat.code < 0) {

                if (data.stat.code == '-300') {
                  alert("登录状态已过期，请重新登录");
                };

                if (data.stat.code == '-360') {
                  alert("登录状态错误，请重新登录");
                };

                if (data.stat.code == '-320' || data.stat.code == '-340') {
                  alert("该帐号已在其他地方登录");
                };

            } else {
                if(data.stat.stateList.length > 0 &&                                                data.stat.stateList[0].code != 0 &&     $.isFunction(options.error)){
                    options.error(data.stat.stateList[0]);
                }
                if($.isFunction(options.success)){
                    options.success(data.content[0], options.params);
                }
            }
        };

        opt.setting.error =  function(xhr, type){
            alert("请求失败");
        };

        $.ajax(opt.setting);
    },
    _encrypt: function(level, params){
        params["_sm"] = "md5";

        var s = "", keys = [];
        for (var k in params) {
            keys.push(k);
        }
        keys.sort();

        for (var i = 0; i < keys.length; i++) {
            s = s + keys[i] + "=" + params[keys[i]];
        }

        s += this._getHash(level);
        //console.log(params["_mt"] + "   >>>   " + s);
        params["_sig"] = $.md5(s);
        return params;
    },
    _getHash: function(level) {
        var ut = this.getCookie("_wtk");
        if (level == "None") {
            return "jk.pingan.com";
        } else if (ut) {
            return ut;
        } else {
            return window.location.hash.replace("#","");
        }
    },
    getCookie: function (name) {
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if ( arr = document.cookie.match(reg) ) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    },
    getQueryString: function (url) {
        if(url) {
            url=url.substr(url.indexOf("?")+1);
        }
        var result = {},
            queryString =url,
            re = /([^&=]+)=([^&]*)/g,
            m;
        while (m = re.exec(queryString)) {
            result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        }
        return result;
    }
};

module.exports = mAPI;
