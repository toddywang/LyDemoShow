;(function ($) {

    $.extend({
        lyUtil: function () {
            return {

                //组件事件冒泡
                stope: function (e) {
                    e = e || window.event;
                    e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
                }

                //在焦点处插入内容
                , focusInsert: function (obj, str) {
                    var result, val = obj.value;
                    obj.focus();
                    if (document.selection) { //ie
                        result = document.selection.createRange();
                        document.selection.empty();
                        result.text = str;
                    } else {
                        result = [
                            val.substring(0, obj.selectionStart),
                            str,
                            val.substr(obj.selectionEnd)
                        ];
                        obj.focus();
                        obj.value = result.join('');
                    }
                }
            };
        },
        lyFrom: function () {
            var LYClass = function () {
                var that = this;
                that.box = $('.lyui-form');
            };

            //下拉选择框
            LYClass.prototype.select = function (data) {

                var config = {
                    coverOption: null,
                    click: null,
                    formBox: null,
                    coverStyle: null,
                    zIndex: 19910903,
                    success: null
                };

                // 公布参数
                $.extend(config, data);

                var that = this, gather = {};
                if (config.formBox) {
                    that.box = config.formBox;
                }

                var selects = that.box.find('select');

                //下拉选择
                gather.selected = function (elem, option, select) {
                    var title = elem.find('.lyui-form-sltitle');
                    title.click(function (e) {
                        var ul = gather.ul = $(this).next();
                        $.lyUtil().stope(e);
                        if (!ul.is(":hidden")) {
                            ul.hide();
                        } else {
                            $('.lyui-form-option').hide();
                            ul.show();
                        }

                        $(document).off('click', gather.hide).on('click', gather.hide);
                    });

                    elem.find('li').on('click', function () {
                        var othis = $(this), val = othis.attr('value');
                        title.find('div').html(othis.find('a').html());
                        // othis.addClass("selected").siblings().removeClass('selected');
                        select.val(val);
                        typeof config.click === 'function' && config.click(val, select);
                    });
                };

                //点击任意处关闭下拉
                gather.hide = function () {
                    gather.ul.hide()
                };

                //添加样式
                gather.addClass = function () {
                    $("body").append('<style>' +
                        '.lyui-form select{display: none;}' +
                        '.lyui-form-select ul{margin:0;}' +
                        '.lyui-form-select{font-family: "Microsoft YaHei";font-size: 12px;width: 250px;height: 30px;line-height: 30px;}' +
                        '.lyui-form-sltitle{cursor:pointer;border: 1px solid #ccc;height: 30px;padding-left: 5px;border-radius: 2px;position: relative;}' +
                        '.lyui-form-sltitle div{padding:0;}' +
                        '.lyui-form-sltitle .lyui-edge{width: 20px;height: 20px;position: absolute;top: 5px;right: 10px;background: url("http://img1.40017.cn/cn/if/book2/book2select-icon.png")}' +
                        '.lyui-form-option{display:none; position: relative; top: 0; left:-1px; width: 100%; max-height: 200px; overflow-y: auto; border:1px solid #DFDFDF; background-color:#fff;z-index: ' + config.zIndex + '}' +
                        '.lyui-form-option li{position:relative;cursor: pointer; height: 30px; line-height: 30px;}' +
                        '.lyui-form-option li.selected{background-color: #F3F3F3;color: #999;}' +
                        '.lyui-form-option li a{display:block;padding:0 8px; color:#333; }' +
                        '.lyui-form-option li a:hover{background-color:#22ade6; color:#fff;text-decoration: none;}' +
                        (config.coverStyle || "") +
                        '</style>');
                };

                //遍历所有select
                selects.each(function () {
                    var othis = $(this), value = othis.val();
                    var selected = $(this.options[this.selectedIndex]);
                    var option = $(function () {
                        var str = '<ul class="lyui-form-option">';
                        var option = othis.find('option');
                        for (var i = 0; i < option.length; i++) {
                            var optionStr = (option.eq(i).html() || option.eq(i).val());
                            if (typeof config.coverOption === 'function') {
                                optionStr = config.coverOption(optionStr);
                            }

                            str += '<li value="' + option.eq(i).val() + '"><a href="javascript:;">' + optionStr + '</a></li>';
                        }
                        return str + '</ul>';
                    }());

                    var selectedStr = selected.html() || value;
                    if (typeof config.coverOption === 'function') {
                        selectedStr = config.coverOption(selectedStr);
                    }

                    var str = $('<div class="lyui-form-select">'
                        + '<div class="lyui-form-sltitle"><div>' + selectedStr + '</div><i class="lyui-edge"></i></div>'
                        + option.prop('outerHTML')
                        + '</div>');
                    othis.after(str);
                    gather.selected(str, option, othis);
                });

                gather.addClass();
                typeof config.success === 'function' && config.success();
                return that;
            };

            return new LYClass();
        }
    });

})(jQuery);
