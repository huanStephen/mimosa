(function() {

    var sepa = org.eocencle.sepa;

    var ResourceAlbum = sepa.EntitiesManager.find('ResourceAlbum');

    var ResourceAlbumEntity = new sepa.Class([ResourceAlbum.model, sepa.Model]);

    var ResourceAlbumEditController = new sepa.Class([sepa.Controller, sepa.CRemote, sepa.CElement, sepa.CDomRenderRole,
        sepa.CVaildate, sepa.CCombVaildate, this.mimosa.EditTemplate, sepa.CStorage]);

    ResourceAlbumEditController.include({

        Model : ResourceAlbumEntity,

        elements : {
            //标题
            'h3.page-title > span:first' : 't',
            //标题
            'input[data-field="name"]' : 'name',
            //描述
            'textarea[data-field="description"]' : 'description'
        },

        config : {
            getInfo : {
                path : 'resource/getResourceAlbum',
                params : {
                    albumId : 0
                }
            }
        },

        vaildRole : {
            name : [['required', '请输入资源集名称！'],
                ['maxlength', '资源集名称不能超过15个字！', 15]],
            description : [['maxlength', '描述不能超过140个字！', 140]]
        },

        submitConfig : {
            addConfigPath : 'resource/addResourceAlbum',
            updateConfigPath : 'resource/updateResourceAlbum'
        },

        load : function() {
            this.info = new ResourceAlbumEntity();
            this.info.loadSession('rowInfo');
            this.info.removeSession('rowInfo');

            if(this.info.id) {
                if(this.info.resourceType == 'image') {
                    this.t.text('编辑 图片');
                }
                if(this.info.resourceType == 'sound') {
                    this.t.text('编辑 音频');
                }
                if(this.info.resourceType == 'video') {
                    this.t.text('编辑 视频');
                }
                if(this.info.resourceType == 'attachment') {
                    this.t.text('编辑 附件');
                }
            } else {
                if(this.info.resourceType == 'image') {
                    this.t.text('添加 图片');
                }
                if(this.info.resourceType == 'sound') {
                    this.t.text('添加 音频');
                }
                if(this.info.resourceType == 'video') {
                    this.t.text('添加 视频');
                }
                if(this.info.resourceType == 'attachment') {
                    this.t.text('添加 附件');
                }
            }

            if(this.info.id) {
                this.config.getInfo.params.albumId = this.info.id;
                this.loadInfo();
            }
        },

        backClick : function() {
            indexCtrl.loadPage('resource/index.html');
        }

    });

    new ResourceAlbumEditController('div[data-page]');

})();