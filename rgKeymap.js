;(function($){
    $.rg_keymap = function(keys, elem){
        var $elem = $(elem);
        var data = elem.rgKeysData = {temp: [], keyArr: [], push: []};

        var init = function() {
            $.each(keys, function(key, val){
                var buildConf = buildConfig(prepareKeyArr(val['arr']), val['func']);
                data.keyArr = (data.keyArr.length == 0) ? buildConf : $.extend(true, data.keyArr, buildConf);
            });
            data.temp = data.keyArr = prepareConfigObj(data.keyArr);

            $elem.keydown(function(e){
                var result = false;
                if (data.push[e.keyCode]) {
                    result = data.push[e.keyCode];
                } else if (typeof data.push[e.keyCode] == 'undefined') {
                    result = keymapSearch(e.keyCode);
                    data.push[e.keyCode] = result;
                }

                return result;
            });

            $elem.keyup(function(e){
                // console.log('up - ' + e.keyCode);
                delete data.push[e.keyCode];
                keymapSearch(e.keyCode * -1);
            });
        };

        var prepareConfigObj = function (arr) {
            var keys = Object.keys(arr);
            if (keys.length > 1) {
                $.each(keys, function (k, v) {
                    if (/.*F$/.test(v)) {
                        var searchKey = v.substr(0, v.length - 1);
                        if (arr[searchKey]) {
                            arr[v] = $.extend(true, arr[v], arr[searchKey]);
                            delete arr[searchKey];
                        }
                    }
                })
            }
            $.each(arr, function (k, v) {
                if (typeof v != 'function') {
                    arr[k] = prepareConfigObj(v);
                }
            });

            return arr;
        };

        var prepareKeyArr = function (arr) {
            $.each(arr, function (k, v) {
                if (v % 1 != 0) {
                    arr[k] = (v | 0) + 'F';
                }
            });

            return arr;
        };

        var buildConfig = function(arr, func) {
            var obj = {};
            var key = arr.shift();
            if (arr.length > 0) {
                obj[key] = buildConfig(arr, func);
            } else {
                obj[key] = func;
            }

            return obj;
        };

        var keymapSearch = function(k) {
            var result = true;
            var storege = $.extend({}, data.keyArr);
            var key = null;
            if (data.temp[k]) {
                key = k;
            } else if (data.temp[k + 'F']) {
                key = k + 'F';
                result = false;
            }

            if (key) {
                if (typeof data.temp[key] == 'function') {
                    data.temp[key]();
                } else {
                    storege = $.extend(true, storege, data.temp[key]);
                }
            }

            data.temp = storege;

            return result;
        };

        var initDefaults = function () {
            var defaultConf = [
                {
                    arr: [27, 82, -82, -27], // esc(down) + r(down) + r(up) + esc(up)
                    func: function () {
                        alert('esc(down) + r(down) + r(up) + esc(up)');
                    }
                },
            ];
            $.each(defaultConf, function (k, v) {
                console.log(k);
                console.log(v.arr);
                keys.push(v);
            });
        };

        // initDefaults();
        init();
    };

    $.fn.rg_keymap = function(keys) {
        return this.each(function(i){
            new $.rg_keymap(keys, this);
        });
    };
})($rg);

$rg(document).rg_keymap([
    {
        arr: [16, 90, -90, 90, -90], // shift + z + z
        func: function () {
            alert('z+z');
        }
    },
]);
