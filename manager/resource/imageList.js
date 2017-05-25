(function() {
    var sepa = org.eocencle.sepa;

    var ResourceAlbum = sepa.EntitiesManager.find('ResourceAlbum');

    var ResourceAlbumEntity = new sepa.Class([ResourceAlbum.model, sepa.Model]);

    var Resource = sepa.EntitiesManager.find('Resource');

    var ResourceEntity = new sepa.Class([Resource.model, sepa.Model]);

    var ImageListController = new sepa.Class([sepa.Controller, sepa.CRemote, sepa.CElement, sepa.CDomRenderRole]);

    ImageListController.include({

        elements : {
            //阴影面积
            'div.listshadow' : 'shadow',
            //标题
            'h3.page-title' : 'title',
            //文件名称
            '*[data-operate="filename"]' : 'fileName',
            //文件
            'input[type=file]' : 'file',
            //插入图片位置
            'hr.clearfix' : 'picPos',
            //图片容器
            'div.portlet-body' :'pictureContainer'
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
            uploadType : 'jpg|png|ico'
        },

        load : function() {
            this.album = new ResourceAlbumEntity();
            this.album.loadSession('rowInfo');
            this.album.removeSession('rowInfo');

            this.title.text(this.album.name);

            this.config.getResourceList.params.albumId = this.album.id;
            this.component('remote', ['getResourceList']);
            indexCtrl.blockUI(this.shadow);
        },

        getResourceListResult : function(result) {
            indexCtrl.unblockUI(this.shadow);
            if(!result.errCode) {
                ResourceEntity.populate(result.data.list);
                this.render();
            } else {
                console.error(result.errMsg);
            }
        },

        render : function() {
            this.picPos.nextAll().remove();

            if(ResourceEntity.count()) {
                var list = ResourceEntity.all();

                var $row = null;
                var mod = 4;

                for(var i = 0; i < list.length; i ++) {
                    if(i % mod == 0) {
                        if($row) this.pictureContainer.append($row);

                        $row = this.component('element', ['div']).clone().addClass('row-fluid');
                    }
                    $el = this.pictureEl.clone();

                    $el.attr('data-id', list[i].id).find('a.fancybox-button').attr('title', list[i].description)
                        .attr('href', list[i].path).find('img').attr('src', list[i].path).attr('alt', list[i].description);

                    $row.append($el);
                }

                this.pictureContainer.append($row);
            } else {
                var $div = this.component('element', ['div']).clone().addClass('row-fluid').text('没有查到任何图片！');
                this.picPos.after($div);
            }

            this.$('a.fancybox-button').fancybox();
        },

        selFileClick : function() {
            this.file.trigger('click');
        },

        fileChange : function() {
            var pos = $(event.target).val().lastIndexOf('\\');
            var fileName = $(event.target).val().substring(pos+1);
            pos = fileName.lastIndexOf('.');
            var suffix = fileName.substring(pos+1);

            if(this.params.uploadType.indexOf(suffix) >= 0) {
                this.fileName.val(fileName);
            } else {
                alert('图片格式不正确！');
                this.fileName.val('');
            }
        },

        uploadClick : function(event) {
            if(this.fileName.val()) {
                $.ajaxFileUpload({
                    url: 'resource/uploadResource?albumId=' + this.album.id + '&resourceType=' + this.album.resourceType,
                    secureuri: false,
                    fileElementId: 'uploadResource',
                    dataType : 'json',
                    success : this.proxy(function(result) {
                        if(!result.errCode) {
                            var resource = new ResourceEntity();
                            resource.id = 0;
                            resource.resourceType = this.album.resourceType;
                            resource.albumId = this.album.id;
                            resource.name = result.data.fileName;
                            resource.path = result.data.path;
                            resource.description = this.fileName.val();
                            resource.createRemote('resource/addResource', this.proxy(function(result) {
                                if(!result.errCode) {

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
                resource.createRemote('resource/updateResource', this.proxy(function(result) {
                    if(!result.errCode) {
                        alert('更新成功！');
                        this.component('remote', ['getResourceList']);
                        indexCtrl.blockUI(this.shadow);
                    } else {
                        console.error(result.errMsg);
                    }
                }));
            }
        },

        deleteClick : function(event) {
            if(confirm("确定删除该图片？")) {
                var id = $(event.target).parents('div.span3').data('id');
                this.config.deleteResource.params.resourceId = id;
                this.component('remote', ['deleteResource']);
            }
        },

        deleteResourceResult : function(result) {
            if(!result.errCode) {
                this.component('remote', ['getResourceList']);
                indexCtrl.blockUI(this.shadow);
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
                            '<a class="fancybox-button" title="" href="">' +
                                '<div class="zoom">' +
                                    '<img src="" alt="" />' +
                                    '<div class="zoom-icon"></div>' +
                                '</div>' +
                            '</a>' +
                            '<div class="details">' +
                                '<a href="javascript:void(0);" class="icon" data-operate="download"><i class="fa fa-download" style="color: grey; width: 20px;"></i></a>' +
                                '<a href="javascript:void(0);" class="icon" data-operate="edit"><i class="fa fa-pencil" style="color: grey; width: 20px;"></i></a>' +
                                '<a href="javascript:void(0);" class="icon" data-operate="delete"><i class="fa fa-remove" style="color: grey; width: 20px;"></i></a>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
        }
    });

    new ImageListController('div[data-page]');

})();