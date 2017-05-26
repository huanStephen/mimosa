(function() {
    var sepa = org.eocencle.sepa;

    var ResourceAlbum = sepa.EntitiesManager.find('ResourceAlbum');

    var ResourceAlbumEntity = new sepa.Class([ResourceAlbum.model, sepa.Model]);

    var Resource = sepa.EntitiesManager.find('Resource');

    var ResourceEntity = new sepa.Class([Resource.model, sepa.Model]);

    var ResourceListController = new sepa.Class([sepa.Controller, sepa.CRemote, sepa.CElement, sepa.CDomRenderRole]);

    ResourceListController.include({

        elements : {
            //标题
            'h3.page-title' : 'title',
            //文件名称
            '*[data-operate="filename"]' : 'fileName',
            //文件
            'input[type=file]' : 'file',
            //插入视频位置
            'hr.clearfix' : 'videoPos',
            //视频容器
            'div.portlet-body' :'videoContainer'
        },

        events : {
            //文件名称
            'click *[data-operate="selFile"]' : 'selFileClick',
            //文件更改
            'change input[type=file]' : 'fileChange',
            //上传
            'click *[data-operate="upload"]' : 'uploadClick',
            //编辑
            'click *[data-operate="edit"]' : 'editClick',
            //删除
            'click *[data-operate="delete"]' : 'deleteClick',
            //下载
            'click *[data-operate="download"]' : 'downloadClick'
        },

        blocks : {
            'pictureBlk' : 'pictureEl'
        },

        config : {
            getResourceList : {
                path : 'resource/getResourceList',
                params : {
                    albumId : ''
                },
                callback : 'getResourceListResult'
            },
            deleteResource : {
                path : 'resource/deleteResource',
                params : {
                    resourceId : ''
                },
                callback : 'deleteResourceResult'
            }
        },

        params : {
            uploadType : 'mp3'
        },

        load : function() {
            this.album = new ResourceAlbumEntity();
            this.album.loadSession('rowInfo');
            this.album.removeSession('rowInfo');

            this.title.text(this.album.name);

            this.config.getResourceList.params.albumId = this.album.id;
            this.component('remote', ['getResourceList']);
        },

        getResourceListResult : function(result) {
            if(!result.errCode) {
                ResourceEntity.populate(result.data.list);
                this.render();
            } else {
                console.log(result.errMsg);
            }
        },

        render : function() {
            this.videoPos.nextAll().remove();

            if(ResourceEntity.count()) {
                var list = ResourceEntity.all();

                var $row = null;
                var mod = 4;

                for(var i = 0; i < list.length; i ++) {
                    if(i % mod == 0) {
                        if($row) this.videoContainer.append($row);

                        $row = this.component('element', ['div']).clone().addClass('row-fluid');
                    }
                    $el = this.pictureEl.clone();

                    $el.attr('data-id', list[i].id).find('video').attr('src', list[i].path);

                    $row.append($el);
                }

                this.videoContainer.append($row);
            } else {
                var $div = this.component('element', ['div']).clone().addClass('row-fluid').text('没有查到任何视频！');
                this.videoPos.after($div);
            }
        },

        selFileClick : function() {
            this.file.trigger('click');
        },

        fileChange : function() {
            var val = $(event.target).val();
            var pos = val.lastIndexOf('\\');
            var fileName = val.substring(pos+1);
            pos = fileName.lastIndexOf('.');
            var suffix = fileName.substring(pos+1);

            if(this.params.uploadType.indexOf(suffix) >= 0) {
                this.fileName.val(fileName);
            } else {
                alert('视频格式不正确！');
                this.fileName.val('');
            }
        },

        uploadClick : function(event) {
            if(this.fileName.val()) {
                $.ajaxFileUpload({
                    url: 'resource/uploadResource?albumId=' + this.album.id + '&resourceType=video',
                    secureuri: false,
                    fileElementId: 'uploadResource',
                    dataType : 'json',
                    success : this.proxy(function(result) {
                        if(!result.errCode) {
                            var resource = new ResourceEntity();
                            resource.id = 0;
                            resource.resourceType = this.album.resourceType;
                            resource.albumId = this.params.resourceAlbumId;
                            resource.name = result.data.fileName;
                            resource.path = result.data.path;
                            resource.description = this.fileName.val();
                            resource.createRemote('addResource', this.proxy(function(result) {
                                if(!result.errCode) {
                                    this.component('remote', ['getResourceList']);
                                } else {
                                    console.error(result.errMsg);
                                }
                            }));
                        } else {
                            console.error(result.errMsg);
                        }
                    }),
                    error : function(data, status, e) {
                        console.error(e);
                    }
                });
            }
        },

        editClick : function(event) {
            var id = $(event.target).parents('div.span3').data('id');
            var resource = ResourceEntity.find(id);
            var description = prompt("请输入新名称", resource.description);
            if($.trim(description)) {
                resource.description = description;
                resource.createRemote('updateResource', this.proxy(function(result) {
                    if(!result.errCode) {
                        alert('更新成功！');
                        this.component('remote', ['getResourceList']);
                    } else {
                        console.error(result.errMsg);
                    }
                }));
            }
        },

        deleteClick : function(event) {
            if(confirm("确定删掉该视频？")) {
                var id = $(event.target).parents('div.span3').data('id');
                this.config.deleteResource.params.resourceId = id;
                this.component('remote', ['deleteResource']);
            }
        },

        deleteResourceResult : function(result) {
            if(!result.errCode) {
                this.component('remote', ['getResourceList']);
            } else {
                console.error(result.errMsg);
            }
        },

        downloadClick : function(event) {
            location.href = 'resource/downloadResource?resourceId=' + $(event.target).parents('div.span3').data('id');
        },

        pictureBlk : function() {
            return '<div class="span3">' +
                        '<div class="item">' +
                            '<div class="zoom">' +
                                '<video controls width="100%" height="300" src="" style="padding-bottom:25px;"></video>' +
                            '</div>' +
                            '<div class="details">' +
                                '<a href="javascript:void(0);" class="icon" data-operate="download"><i class="fa fa-download" style="color: grey; width: 20px;"></i></a>' +
                                '<a href="javascript:void(0);" class="icon" data-operate="edit"><i class="fa fa-pencil" style="color: grey; width: 20px;"></i></a>' +
                                '<a href="javascript:void(0);" class="icon" data-operate="delete"><i class="fa fa-remove" style="color: grey; width: 20px;"></i></a>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
        }
    });

    new ResourceListController('div[data-page]');

})();