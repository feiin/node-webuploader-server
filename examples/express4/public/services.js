
var mi = {};
; (function ($) {

    //封装ajax请求
    var jsonProxy = function (serviceUrl) {
        this.callGet = function (url, params, suc, err) {

            var getUrl = url;

            var reg = /\{(.*?)\}/ig;
            var m = getUrl.match(reg);
            if (m) {
                m = Array.prototype.slice.call(m)
                for (var i in m) {
                    getUrl = getUrl.replace(m[i], params[m[i].replace("{", "").replace("}", "")]);
                }
            }


            $.ajax({
                url: serviceUrl + getUrl,
                type: 'GET',
                cache: false,
                dataType: 'json',
                error: function (obj) {
                    //ajax request error
                    //console.log("request error", obj);
                    if ($.isFunction(err)) {
                        var result = {};
                        result.d = obj;
                        err(result);
                    }
                    else {

                    }

                },
                success: function (obj) {
                    //ajax request success
                    if ($.isFunction(suc)) {
                        var result = {};
                        result = obj;

                        suc(result);
                    }
                    else {
                        //console.log(obj);
                    }
                }

            })
        }
        this.callPost = function (url, data, suc, err) {
            var getUrl = url;
            var d = JSON.stringify(data);


            $.ajax({
                url: serviceUrl + getUrl,
                type: 'POST',
                cache: false,
                data: d,
                dataType: 'json',
                contentType: "application/json",
                error: function (obj) {
                    //ajax request error
                    if ($.isFunction(err)) {
                        var result = {};
                        result = obj;
                        err(result);
                    }
                    else {

                    }

                },
                success: function (obj) {
                    //ajax request success
                    if ($.isFunction(suc)) {
                        var result = {};
                        result = obj;

                        suc(result);
                    }
                    else {
                        //console.log(obj);
                    }
                }

            })
        }
    };
     
    mi.uploadService = new jsonProxy("/upload/");
    //api end
})(jQuery); 