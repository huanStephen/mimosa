(function() {

    var sepa = org.eocencle.sepa;

    var ResourceAlbum = sepa.EntitiesManager.find('ResourceAlbum');

    var ResourceAlbumEntity = new sepa.Class([ResourceAlbum.model, sepa.Model]);

    var ResourceAlbumListController = new sepa.Class([sepa.Controller, sepa.CRemote, sepa.CElement, sepa.CDomRenderRole,
        this.mimosa.ListTemplate, sepa.CStorage]);

    ResourceAlbumListController.include({

        Model : ResourceAlbumEntity,

        elements : {
            'h3.page-title' : 'title'
        },

        config : {
            getList : {
                path : 'resource/getResourceAlbumList',
                params : {
                    resourceType : ''
                }
            },
            deleteRow : {
                path : 'resource/deleteResourceAlbum',
                params : {
                    resourceAlbumId : 0
                }
            }
        },

        operateConfig : {
            add : {
                page : 'resource/resourceAlbumEdit.html',
                requireRowInfo : false,
                before : 'addBefore'
            },
            entry : {
                page : '',
                requireRowInfo : true,
                before : 'entryBefore'
            },
            edit : {
                page : 'resource/resourceAlbumEdit.html',
                requireRowInfo : true,
                before : 'editBefore'
            },
            delete : {
                before : 'deleteBefore',
                warning : 'ȷ��ɾ������Դ����'
            }
        },

        load : function() {
            this.resourceType = location.hash.slice(1);

            if(this.resourceType == 'image') {
                this.title.text('ͼƬ��Դ��');
            }
            if(this.resourceType == 'sound') {
                this.title.text('��Ƶ��Դ��');
            }
            if(this.resourceType == 'video') {
                this.title.text('��Ƶ��Դ��');
            }
            if(this.resourceType == 'attachment') {
                this.title.text('������Դ��');
            }

            this.config.getList.params.resourceType = this.resourceType;
            this.loadList();
        },

        addBefore : function() {
            new ResourceAlbumEntity({id : 0, resourceType : this.resourceType}).saveSession('rowInfo');
        },

        entryBefore : function(event) {
            this.operateConfig.entry.page = 'resource/' + this.resourceType + 'List.html';
        },

        deleteBefore : function(event) {
            this.config.deleteRow.params.resourceAlbumId = this.getRowId(event);
        }

    });

    new ResourceAlbumListController('div[data-page]');

})();