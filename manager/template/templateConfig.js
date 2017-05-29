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
                page : 'template/templatePlaceholderConfig.html',
                requireRowInfo : true
            }
        },

        load : function() {
            this.loadList();
        }

    });

    new TemplateListController('div[data-page]');

})();