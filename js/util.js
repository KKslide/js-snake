!function (window) {
    var util = {
        /**
         * 获取随机数
         * @param {最小值} n 
         * @param {最大值} m 
         */
        getRandom: function (n, m) {
            return Math.floor(Math.random() * (m - n) + n)
        }
    }
    window.util = util;
}(window);