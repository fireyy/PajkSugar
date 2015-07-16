/**
 * 打点统计
 */

function Analytics(config) {

    this.config = config;

    this.config.beacon = {};
    this.config.beacon[32] = this.config.name;

    //pajkLogger 已经存在，就无需重复引入 pajk_beacon.js
    if (typeof pajkLogger === "object") return ;

    var head = document.getElementsByTagName("head")[0] || document.documentElement;
    var script = document.createElement("script");
    script.async = "true";
    script.src = "http://gc.jk.cn/_asset/pajk_beacon.js";

    var done = false;

    // 加载完毕后执行
    script.onload = script.onreadystatechange = function () {
        if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
            done = true;
            try {
                //page view统计
                this.config.beacon[29] = 'load';
                this.config.beacon[30] = 'page view';
                pajkLogger.clickLog(this.config.beacon);
            } catch (err) {
                //
            }
            script.onload = script.onreadystatechange = null;
        }
    };

    head.insertBefore(script, head.firstChild);
}

Analytics.prototype.sendEvent = function (name, desc) {
    if (typeof pajkLogger === "object" && typeof pajkLogger.clickLog === "function" && typeof name !== "undefined" && typeof desc !== "undefined") {
        this.config.beacon[29] = name;
        this.config.beacon[30] = desc;
        pajkLogger.clickLog(this.config.beacon);
    }
};

module.exports = Analytics;
