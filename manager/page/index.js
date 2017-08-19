(function() {

    var sepa = org.eocencle.sepa;

    var Page = sepa.EntitiesManager.find('Page');

    var PageEntity = new sepa.Class([Page.model, sepa.Model]);

    var PageListController = new sepa.Class([sepa.Controller, sepa.CRemote, sepa.CElement, sepa.CDomRenderRole,
        this.mimosa.ListTemplate, sepa.CStorage]);

    PageListController.include({

        Model : PageEntity,

        config : {
            getList : {
                path : 'page/getPageList'
            },
            deleteRow : {
                path : 'page/deletePage',
                params : {
                    pageId : 0
                }
            }
        },

        operateConfig : {
            add : {
                page : 'page/pageEdit.html',
                requireRowInfo : false
            },
            entry : {
                before : 'before',
                page : 'page/pagePlaceholderList.html',
                requireRowInfo : false
            },
            edit : {
                before : 'before',
                page : 'page/pageEdit.html',
                requireRowInfo : false
            },
            'delete' : {
                before : 'deleteBefore',
                warning : '确定删除该页面？'
            }
        },

        load : function() {
            indexCtrl.setDataShare('pageConfig', {});
            this.loadList();
        },

        before : function(event) {
            indexCtrl.addDataShare('pageConfig', 'pageId', this.getRowId(event));
        },

        deleteBefore : function(event) {
            this.config.deleteRow.params.pageId = this.getRowId(event);
        }

    });

    new PageListController('div[data-page]');

})();