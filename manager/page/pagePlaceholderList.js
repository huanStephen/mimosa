(function() {

    var sepa = org.eocencle.sepa;

    var PagePlaceholder = sepa.EntitiesManager.find('PagePlaceholder');

    var PagePlaceholderEntity = new sepa.Class([PagePlaceholder.model, sepa.Model]);

    var PagePlaceholderListController = new sepa.Class([sepa.Controller, sepa.CRemote, sepa.CElement, sepa.CDomRenderRole,
        this.mimosa.ListTemplate, sepa.CStorage]);

    PagePlaceholderListController.include({

        Model : PagePlaceholderEntity,

        config : {
            getList : {
                path : 'page/getPagePlaceholderList',
                params : {
                    pageId : 0
                }
            }
        },

        operateConfig : {
            entry : {
                before : 'configBefore',
                page : 'page/pagePlaceholderConfig.html',
                requireRowInfo : false
            }
        },

        load : function() {
            this.info = new PagePlaceholderEntity();

            this.config.getList.params.pageId = indexCtrl.getDataShare('pageConfig', 'pageId');
            this.loadList();
        },

        replaceRender : function(fieldName, fieldValue) {
            if('resourceType' == fieldName) {
                if('column' == fieldValue) return '栏目';
                if('article' == fieldValue) return '文章';
                if('image' == fieldValue) return '图片';
                if('sound' == fieldValue) return '音频';
                if('video' == fieldValue) return '视频';
                if('attachment' == fieldValue) return '附件';
            }
            return fieldValue;
        },

        configBefore : function(event) {
            indexCtrl.addDataShare('pageConfig', 'placeholderId', this.getRowId(event));
        }

    });

    new PagePlaceholderListController('div[data-page]');

})();