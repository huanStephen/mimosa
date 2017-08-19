(function() {
    var sepa = org.eocencle.sepa;

    var Template = sepa.EntitiesManager.find('Template');

    var TemplateEntity = new sepa.Class([Template.model, sepa.Model]);

    var TemplateListController = new sepa.Class([sepa.Controller, sepa.CRemote, sepa.CElement, sepa.CDomRenderRole,
        this.mimosa.ListTemplate, sepa.CStorage]);

    TemplateListController.include({

        Model : TemplateEntity,

        config : {
            getList : {
                path : 'template/getTemplateList'
            },
            deleteRow : {
                path : 'resource/deleteTemplate',
                params : {
                    templateId : 0
                }
            }
        },

        operateConfig : {
            entry : {
                before : 'placeholderConfigBefore',
                page : 'template/templatePlaceholderConfig.html',
                requireRowInfo : false
            }
        },

        load : function() {
            indexCtrl.setDataShare('tempConfig', {});
            this.loadList();
        },

        placeholderConfigBefore : function(event) {
            var id = this.getRowId(event);
            indexCtrl.addDataShare('tempConfig', 'templateId', id);
            indexCtrl.addDataShare('tempConfig', 'templateName', this.Model.find(id).name);
        }

    });

    new TemplateListController('div[data-page]');

})();