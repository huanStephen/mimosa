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
                requireRowInfo : true
            },
            entry : {
                page : 'page/pageConfig.html',
                requireRowInfo : true
            },
            edit : {
                page : 'page/pageEdit.html',
                requireRowInfo : true
            },
            delete : {
                before : 'deleteBefore',
                warning : '确定删除该页面？'
            }
        },

        load : function() {
            this.loadList();
        },

        deleteBefore : function(event) {
            this.config.deleteRow.params.pageId = this.getRowId(event);
        }

    });

    new PageListController('div[data-page]');

})();