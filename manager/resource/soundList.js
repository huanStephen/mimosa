(function() {
    var sepa = org.eocencle.sepa;

    var ResourceAlbum = sepa.EntitiesManager.find('ResourceAlbum');

    var ResourceAlbumEntity = new sepa.Class([ResourceAlbum.model, sepa.Model]);

    var Resource = sepa.EntitiesManager.find('Resource');

    var ResourceEntity = new sepa.Class([Resource.model, sepa.Model]);

    var SoundListController = new sepa.Class([sepa.Controller, sepa.CRemote, sepa.CElement, sepa.CDomRenderRole,
        this.mimosa.ListTemplate, sepa.CStorage]);

    SoundListController.include({

        Model : ResourceEntity,

        elements : {
            //标题
            'h3.page-title' : 'title',
            //文件名称
            '*[data-operate="filename"]' : 'fileName',
            //文件
            'input[type=file]' : 'file'
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
            //下载
            'click *[data-operate="download"]' : 'downloadClick'
        },

        config : {
            getList : {
                path : 'resource/getResourceList',
                params : {
                    albumId : 0
                }
            },
            deleteRow : {
                path : 'resource/deleteResource',
                params : {
                    resourceId : 0
                }
            }
        },

        operateConfig : {
            delete : {
                before : 'deleteBefore',
                warning : '确定删除该音频？'
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

            this.config.getList.params.albumId = this.album.id;
            this.loadList();
        },

        selFileClick : function() {
            this.file.trigger('click');
        },

        fileChange : function(event) {
            var val = this.$(event.target).val();
            var pos = val.lastIndexOf('\\');
            var fileName = val.substring(pos+1);
            pos = fileName.lastIndexOf('.');
            var suffix = fileName.substring(pos+1);

            if(this.params.uploadType.indexOf(suffix) >= 0) {
                this.fileName.val(fileName);
            } else {
                alert('音频格式不正确！');
                this.fileName.val('');
            }

        },

        uploadClick : function(event) {
            if(this.fileName.val()) {
                $.ajaxFileUpload({
                    url: 'resource/uploadResource?albumId=' + this.album.id + '&resourceType=sound',
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
                            resource.createRemote('addResource', this.proxy(function(result) {
                                if(!result.errCode) {
                                    this.loadList();
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
            var id = this.getRowId(event);
            var resource = ResourceEntity.find(id);
            resource.description = prompt("请输入名称", resource.description);
            resource.createRemote('resource/updateResource', this.proxy(function(result) {
                if(!result.errorCode) {
                    this.loadList();
                } else {
                    console.error(result.errorMsg);
                }
            }));
        },

        deleteBefore : function(event) {
            this.config.deleteRow.params.resourceId = this.getRowId(event);
        },

        downloadClick : function(event) {
            location.href = 'resource/downloadResource?resourceId=' + this.getRowId(event);
        }
    });

    new SoundListController('div[data-page]');

})();