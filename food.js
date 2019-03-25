/**
 * 食物
 *      1-特征：位置x,y 颜色color 大小width,height
 *      2-行为：生成一个Food元素
 */

; (function (window) {
    // 存储全局变量
    var util = window.util,
        document = window.document,
        map = document.querySelector("#map"),
        Food = function (x, y, width, height, color) {
            this.x = x || 0; // x坐标值
            this.y = y || 0; // y坐标值
            this.width = width || 20; //默认值
            this.height = height || 20;
            this.color = color || "green";
            this.init(map); // 初始化食物 - 行为
        };
    Food.prototype.init = function (map) {
        // 1-设置食物的出现范围
        //      随机位置要在地图范围内；
        //      随机位置要在方格子中
        var maxX = map.clientWidth / this.width,
            maxY = map.clientHeight / this.height;
        this.x = util.getRandom(0, maxX) * this.width;
        this.y = util.getRandom(0, maxY) * this.height;

        // 2-生成元素
        var FoodElement = document.createElement('div');
        // 3-设置样式
        FoodElement.style.width = this.width + 'px';
        FoodElement.style.height = this.height + 'px';
        FoodElement.style.backgroundColor = this.color;
        FoodElement.style.position = 'absolute';
        FoodElement.style.left = this.x + 'px';
        FoodElement.style.top = this.y + 'px';
        // 4-加入页面中
        map.appendChild(FoodElement);
        // 5-关联元素和食物，挂载在Food构造函数上
        this.element = FoodElement;
    }

    // 6-暴露给外部使用
    window.Food = Food;
})(window);

var food = new Food();