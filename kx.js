; (function ($) {

    $.fn.frameSelection = function (options) {
        var defaultOpts = {
            callback: function () { },
            mask: false,
            done: function (result) { console.log(result) }
        };
        var options = $.extend({}, defaultOpts, options);
        new FrameSelection($(this), options);

    }
    /**
     * 坐标点
     * @param {*} x
     * @param {*} y
     */
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    /**
     * 框选构造函数
     * @param {*} $rangeEl 容器元素
     * @param {*} options 选择项
     */
    function FrameSelection($rangeEl, options) {
        this.$rangeEl = $rangeEl;
        this.options = options;

        this.init();
    }
    /**
     * 框选初始化
     */
    FrameSelection.prototype.init = function () {
        this.unbind();
        this.bind();
    }
    /**
     * 解除事件绑定
     */
    FrameSelection.prototype.unbind = function () {

        this.$rangeEl.off('mousedown');
        this.$rangeEl.off('mousemove');
        this.$rangeEl.off('mouseup');
    }
    /**
     * 绘制接口
     */
    FrameSelection.prototype.render = function (p1, p2) {
        this.options.mask && this.renderMask(p1, p2);
        this.renderRect(p1, p2);
    }
    /**
     * 清理元素
     */
    FrameSelection.prototype.clear = function () {
        this.$rangeEl.find('.rect,.mask').remove();
    }

    /**
     * 创建
     *
     */
    FrameSelection.prototype.renderMask = function (p1, p2) {


        var $rect = this.$rangeEl.find('div.rect');

         window.rectWidth = $rect.outerWidth();
         window.rectHeight = $rect.outerHeight();
        var $top = this.$rangeEl.find('div.mask:eq(0)'),
            $left = this.$rangeEl.find('div.mask:eq(1)'),
            $right = this.$rangeEl.find('div.mask:eq(2)'),
            $bottom = this.$rangeEl.find('div.mask:eq(3)');

        $top.css({
            top: this.$rangeEl.css('top'),
            left: this.$rangeEl.css('left') ,
            width: this.$rangeEl.width(),
            // height:$rect.css('top')
            height: window.startPositionY- window.startTopY

        });
        // window.containerTop = this.$rangeEl.left();
        // window.containerLeft = this.$rangeEl.top();
        window.containerWidth = this.$rangeEl.width();
        window.containerHeight = this.$rangeEl.height();
        $left.css({
            top: $rect.css('top'),
            left: $top.css('left'),
            // width: $rect.css('left'),
            width: window.startPositionX- window.startLeftX,
            height: $rect.height()
        });

        $right.css({
            top: $rect.css('top'),
            left:  window.startPositionX + $rect.width(),
            width: this.$rangeEl.width() - ($left.width() + $rect.width()),
            height: $left.height()
        });

        $bottom.css({
            // top: $top.height() + $left.height(),
            // left: this.$rangeEl.css('left'),
            top:window.startTopY + $top.height() + $left.height(),
            left:window.startLeftX,
            width: $top.width(),
            height: this.$rangeEl.height() - ($top.height() + $left.height())
        });

    }

    /**
     * 创建矩形选框
     */
    FrameSelection.prototype.renderRect = function (p1, p2) {
        var $rect = this.$rangeEl.find('div.rect');

        $rect.css({
            top: Math.min(p1.y, p2.y),
            left: Math.min(p1.x, p2.x),
            width: Math.abs(p1.x - p2.x),
            height: Math.abs(p1.y - p2.y),
            // rectTop : $rect.getBoundingClientRect().top,
            // rectLeft : $rect.getBoundingClientRect().left
        })
    }


    /**
     * 创建元素
     */
    FrameSelection.prototype.create = function (eleDes, n, callback) {
        var desArr = eleDes.split('.');
        var eleName = desArr[0], className = desArr[1] || '', eles = '';

        for (var i = 0; i < n; i++) {
            eles += `<${eleName} class="${className}"></${eleName}>`;
        }
        callback && typeof callback === "function" && callback($(eles));
    }
    FrameSelection.prototype.createElToDom = function () {
        //默认不绘制mask
        var fn = ($eles) => {
            $eles.appendTo(this.$rangeEl);
        }
        this.options.mask && this.create('div.mask', 4, fn);
        this.create('div.rect', 1, fn);

        typeof this.options.callback === 'function' && this.options.callback();
    }


    // 事件位置获取

    function windowTovideo(videoElem,x,y){
        var bbox = videoElem.getBoundingClientRect();
        return {
            x:bbox.left,
            y:bbox.top
        }
    }



    /**
     * 注册事件绑定
     */
    FrameSelection.prototype.bind = function () {
        var self = this;
        // var canvas = document.getElementById("canvas");
        //var ctx =canvas.getContext("2d");
        this.$rangeEl.bind('mousedown', function (event) {
            console.warn("mousedown", event)
            console.warn("offsetWidth: ", event.offsetX);
            console.warn("offsetHeight: ", event.offsetY);

            console.warn("containerTop:",window.containerTop);
            console.warn("containerLeft:",window.containerLeft);

            console.warn(" containerWidth:", window.containerWidth);
            console.warn(" containerHeight", window.containerHeight);
            var loc = windowTovideo(videoElem,event.clientX,event.clientY) ;//获取鼠标点击在video的坐标
            event.preventDefault();

            window.startPositionX = event.clientX;
            window.startPositionY = event.clientY;


            // window.startPositionX = event.pageX;
            // window.startPositionY = event.pageY;

            window.startLeftX = loc.x;
            window.startTopY = loc.y;

            var start = new Point(event.pageX, event.pageY);


            //清理
            self.clear();
            self.createElToDom();

            self.$rangeEl.bind('mousemove', function (e) {
                console.warn("11111")
                var end = new Point(e.pageX, e.pageY);

                //绘制
                self.render(start, end);

            })

        });
        // window.rectTop = $rect.css("top");
        // window.rectLeft = $rect.css("left");
        this.$rangeEl.bind('mouseup', function (e) {

            console.warn("mouseup", e)
            console.warn("offsetWidth: ", e.offsetX)
            console.warn("offsetHeight: ", e.offsetY)
            console.warn("window.rectWidth:",window.rectWidth);
            console.warn("window.rectHeight:",window.rectHeight)
            console.warn("window.recttop:",window.rectTop)
            console.warn("window rectLeft:",window.rectLeft)

            window.endPositionX = e.clientX;
            window.endPositionY = e.clientY;



            finish()
            self.$rangeEl.off('mousemove');
        })


    }



})(window.jQuery);