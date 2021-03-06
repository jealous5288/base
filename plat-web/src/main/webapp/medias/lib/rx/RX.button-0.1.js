/*****************************************************************
 * RX.button-0.1
 * RX按钮组件
 * 最后更新时间：2017-09-22
 * 最后更新人：Zp
 *
 * 更新时间： 2017-10-23
 * 更新人：mrq
 * 更新内容：在zp的基础上完善button控件
 *****************************************************************/

(function (global) {
    //注册RX空间
    window.RX = window.RX || {};

    //组件池声明
    var widgetPool = {};

    //内部方法，执行配置回调
    function callFunction(obj, func) {
        var result = true;
        if (typeof(func) == "function" && arguments.length >= 2) {
            result = func.apply(obj, Array.prototype.slice.call(arguments, 2));
        }
        if (typeof(result) != "boolean" || result != false) {
            return true;
        }
        return false;
    }

    var defaultButtonJson = {
        id: "add",
        name: "新增",
        icon: null,
        display: true,
        beforeClick: null,
        onClick: null
    };
    //buttongroup默认配置
    var defaults = {
        tag: "._rx_grid_control",
        tpl: null,
        param: {},
        title: null,
        className: "action_button",
        buttons: [
            defaultButtonJson
        ],
        beforeInit: function (param) {
            return true
        },
        onInit: function (param) {
        }
    };

    //Button对象类构造声明
    var Button = function (el, json) {
        //填充默认值
        this.hadleJson = $.extend(true, {}, defaultButtonJson, json);
        this.el = el;
        this.init();
    };

    //Button对象类属性声明
    Button.prototype = {
        //初始化
        init: function () {
            var button = this;
            var json = button.hadleJson;
            //创建dom
            var $dom = $('<li style="' + (json.display ? "" : "display:none;") + '"><a href="javascript:void(0)" id="' + json.id + '"><i class="iconfont">' + json.icon + '</i>' + json.name + '</a></li>');
            button.dom = $dom;
            $dom.bind("click", function () {
                var buttonJson = json;
                if (buttonJson.onClick) {
                    if (typeof buttonJson.onClick === "function") {
                        buttonJson.onClick();
                    } else if (typeof buttonJson.onClick === "string") {
                        eval(buttonJson.onClick + "()");
                    }
                }
            });
            button.el.append($dom);
        },
        //显示
        show: function () {
            this.dom.show();
        },
        //隐藏
        hide: function () {
            this.dom.hide();
        },
        //移除
        remove: function () {
            this.dom.remove();
        }
    };

    //ButtonGroup对象类构造声明
    var ButtonGroup = function ($obj, options) {
        //1、注册容器
        this.$obj = $obj;
        //2、注册参数
        this.options = options;
        //3、注册gridId：容器dom的Id，不在则为"_grid"+8位随机数
        this.id = $obj.attr("id");
        if (!this.id) {
            this.id = "_button_group_" + Math.floor(Math.random() * 100000000);
            $obj.attr("id", this.id);
        }
        //初始化当前group中的button对象
        this.buttonPool = {};
        //4、向组件池中注册
        widgetPool[this.id] = this;
        //5、布局初始化
        this.init();
    };

    //ButtonGroup对象类属性声明
    ButtonGroup.prototype = {
        init: function () {
            var buttonPool = this.buttonPool;
            var buttonGroup = this, $obj = buttonGroup.$obj, options = buttonGroup.options, param = options.param,
                buttons = options.buttons;
            if (callFunction(buttonGroup, options.beforeInit, param)) {
                $obj.empty();
                //使用模板创建
                if (options.tpl) {
                    $obj.append(options.tpl(buttons));
                } else {
                    //记录子行插入的位置
                    buttonGroup.insertEL = $("<ul class='" + options.className + "'></ul>");
                    if (buttons && buttons.length > 0) {
                        $.each(buttons, function (i, t) {
                            buttonPool[t.id] = new Button(buttonGroup.insertEL, t);
                        })
                    }
                    $obj.append(buttonGroup.insertEL);
                }
                callFunction(buttonGroup, options.onInit, param);
            }
        },
        //显示
        //无参显示全部
        showButtons: function (codes) {
            var buttonGroup = this;
            var buttonPool = buttonGroup.buttonPool;
            if (codes) {
                var codeArr = codes.split(",");
                for (var i = 0, maxLength = codeArr.length; i < maxLength; i++) {
                    buttonPool[codeArr[i]] && buttonPool[codeArr[i]].show();
                }
            } else {
                for (var button in buttonPool) {
                    buttonPool[button].show();
                }
            }
        },
        //隐藏
        //无参隐藏全部
        hideButtons: function (codes) {
            var buttonGroup = this;
            var buttonPool = buttonGroup.buttonPool;
            if (codeArr) {
                var codeArr = codes.split(",");
                for (var i = 0, maxLength = codeArr.length; i < maxLength; i++) {
                    buttonPool[codeArr[i]] && buttonPool[codeArr[i]].hide();
                }
            } else {
                for (var button in buttonPool) {
                    buttonPool[button].hide();
                }
            }
        },
        //添加新的button
        //模板创建的需要知道el
        addButton: function (json, el) {
            var buttonGroup = this;
            if (!el) {
                el = buttonGroup.insertEL;
            }
            if (json) {
                //数组
                if (Object.prototype.toString.apply(json) == "[object Array]") {
                    for (var i = 0, maxLength = json.length; i < maxLength; i++) {
                        buttonGroup.buttonPool[t.id] = new Button(el, json[i]);
                    }
                } else {
                    //字符串
                    buttonGroup.buttonPool[t.id] = new Button(el, json);
                }
            }
        },
        //移除
        removeAll: function () {
            var buttonPool = this.buttonPool;
            for (var i = 0, maxLength = buttonPool.length; i < maxLength; i++) {
                buttonPool[i].remove();
            }
        }
    };

    RX.button = {
        //ButtonGroup构建方法
        //参数：$obj （Jquery元素）button的dom容器， options （Json）构建参数
        //返回值：group
        //添加对全部buttongroup的操作
        init: function ($obj, options) {
            if (!$obj) {
                return null;
            }
            if (!options) {
                options = {};
            }
            return new ButtonGroup($obj, $.extend(true, {}, defaults, options));
        },
        //ButtonGroup获取方法
        //参数：buttonGroupId （String）ButtonGroup的dom容器的id
        //返回值：ButtonGroup buttonGroup对象
        get: function (id) {
            return widgetPool[id];
        },
        //ButtonGroup销毁方法
        //参数：buttonGroupId （String）ButtonGroup的dom容器的id
        destroy: function (id) {
            if (widgetPool[id] != undefined) {
                //清除buttons控件
                widgetPool[id].removeAll();
                //存在
                delete widgetPool[id];
            }
        }
    }
})(this);