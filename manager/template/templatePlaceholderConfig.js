(function() {

    var sepa = org.eocencle.sepa;

    var Template = sepa.EntitiesManager.find('Template');

    var TemplateEntity = new sepa.Class([Template.model, sepa.Model]);

    var Placeholder = sepa.EntitiesManager.find('Placeholder');

    var PlaceholderEntity = new sepa.Class([Placeholder.model, sepa.Model]);

    var TemplatePlaceholderListController = new sepa.Class([sepa.Controller, sepa.CRemote, sepa.CElement, sepa.CDomRenderRole,
        this.mimosa.ListTemplate, sepa.CStorage]);

    TemplatePlaceholderListController.include({

        Model : PlaceholderEntity,

        elements : {
            'h3.page-title' : 'title'
        },

        config : {
            getList : {
                path : 'template/getTemplateHolderList',
                params : {
                    templateId : 0
                }
            },
            deleteRow : {
                path : 'template/deleteTemplateHolder',
                params : {
                    placeholderId : 0
                }
            }
        },

        operateConfig : {
            add : {
                before : 'placeholderEditBefore',
                page : 'template/templatePlaceholderEdit.html',
                requireRowInfo : false
            },
            edit : {
                before : 'placeholderEditBefore',
                page : 'template/templatePlaceholderEdit.html',
                requireRowInfo : false
            },
            'delete' : {
                before : 'deleteBefore',
                warning : '确定删除该占位符？'
            }
        },

        load : function() {
            this.config.getList.params.templateId = indexCtrl.getDataShare('tempConfig', 'templateId');
            this.loadList();
        },

        placeholderEditBefore : function(event) {
            indexCtrl.addDataShare('tempConfig', 'placeholderId', this.getRowId(event));
        },

        deleteBefore : function(event) {
            this.config.deleteRow.params.placeholderId = this.getRowId(event);
        }

    });

    new TemplatePlaceholderListController('div[data-page]');

})();