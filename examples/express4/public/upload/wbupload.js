/*****以下为测试代码,请不要直接用于生成环境******/
/*****以下为测试代码,请不要直接用于生成环境******/
/*****以下为测试代码,请不要直接用于生成环境******/

$(document).ready(function () {

    var progress = $("#uploadProgress2");
    var progressBar = progress.children(".progress-bar");


    WebUploader.Uploader.register({
        "before-send-file": "beforeSendFile"
           , "before-send": "beforeSend"
           , "after-send-file": "afterSendFile"
    }, {
        beforeSendFile: function (file) {
            var task = new $.Deferred();
            var md5 = file.md5;
            var size = file.size;
            var ext = file.ext;
            var uploader = this.owner;
            mi.uploadService.callGet("filecheck?md5={md5}&size={size}&ext={ext}", { md5: md5, size: size,ext:ext }, function (data) {
                if (data.exists) {

                    file.path = data.path;
                    uploader.skipFile(file);
                    task.reject();
                } else {
                    task.resolve();
                }
            }, function (err) {

                task.resolve();
            });
            return $.when(task);

        },
        beforeSend: function (block) {
            //分片验证是否已传过，用于断点续传

            var task = new $.Deferred();
            var md5 = block.file.md5;
            var ext = block.file.ext;
            mi.uploadService.callGet("chunkcheck?md5={md5}&chunk={chunk}&size={size}&ext={ext}", { md5: md5, chunk: block.chunk, size: block.file.size,ext:ext }, function (data) {
                if (data.exists) {

                    task.reject();
                } else {
                    task.resolve();
                }
            }, function (err) {
                task.resolve();
            });
            return $.when(task);
        },
        afterSendFile: function (file) {

            var md5 = file.md5;
            var chunkSize = this.options.chunkSize;
            var size = file.size;
            var chunksTotal = 0;
            if ((chunksTotal = Math.ceil(file.size / chunkSize)) > 1) {
                //合并请求
                var task = new $.Deferred();

                mi.uploadService.callPost("chunksmerge",{
                    size: size
                    , chunks: chunksTotal
                    , ext: file.ext
                    , md5: md5
                }, function (data) {
                    file.path = data.Path;
                    task.resolve();

                }, function (error) {
                    task.reject();

                });
                return $.when(task);
            } else {
            }
        }

    });


    function initUploadBrz() {
        var info = { md5: "" };
        if (window.wu) {
            window.wu.destroy();

        }
        window.wu = WebUploader.create({
            pick: '#pickfiles',
            swf: '/webuploader/Uploader.swf',
            server: "/upload",
            chunked: true,
            formData: info,
            fileNumLimit: 1,
        }).on('fileQueued', function (file) {

            var up = this;
            this.md5File(file, 0, 1 * 1024 * 1024).progress(function (percentage) {

            }).then(function (ret) {

                file.md5 = ret;
                up.options.formData.md5 = ret;
                up.upload();
            });

        }).on("uploadStart", function (file) {
            console.log("upload upload..");

            $("#uploadProgress2").show();

            $("#uploadProgress2").find(".progress-bar").addClass("progress-bar-striped").addClass("active");
            $("#uploadProgress2").find(".progress-bar").css({ "width": "0%" });//


        }).on("uploadSuccess", function (file, data) {
            if(data && data.path) {
                file.path = data.path;
            }

            console.log('uploadSuccess',file,data);

        }).on("uploadComplete", function (file) {


            $("#uploadProgress2").find(".progress-bar").css({ "width": "100%" }).text("100%").removeClass("active");

            $("#fileName").text(file.path);

            $("#uploadProgress2").hide();
            console.log('uploadComplete',file);

            this.removeFile(file.id);

        }).on("uploadProgress", function (file, percentage) {
            $("#uploadProgress2").find(".progress-bar").text((percentage * 100) + "%").css({ width: (percentage * 100) + "%" });
        });

    };


    window.initUploadBrz = initUploadBrz;
    initUploadBrz();
});

