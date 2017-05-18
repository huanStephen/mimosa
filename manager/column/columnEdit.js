(function() {

    var sepa = org.eocencle.sepa;

    var Column = sepa.EntitiesManager.find('Column');

    var ColumnEntity = new sepa.Class([Column.model, sepa.Model]);

    var ColumnEditController = new sepa.Class([sepa.Controller, sepa.CRemote, sepa.CElement, sepa.CDomRenderRole,
        sepa.CVaildate, sepa.CCombVaildate, this.mimosa.EditTemplate]);

    ColumnEditController.include({

        Model : ColumnEntity,

        elements : {
            //标题
            'input[data-field="title"]' : 'title',
            //描述
            'textarea[data-field="description"]' : 'description'
        },

        config : {
            getInfo : {
                path : 'column/getColumn',
                params : {
                    columnId : ''
                },
                callback : 'getInfoResult'
            }
        },

        vaildRole : {
            title : [['required', '请输入栏目标题！'],
                ['maxlength', '栏目标题不能超过15个字！', 15]],
            description : [['maxlength', '描述不能超过140个字！', 140]]
        },

        submitConfig : {
            addConfigPath : 'column/addColumn',
            updateConfigPath : 'column/updateColumn'
        },

        load : function() {
            this.info = new ColumnEntity();
            this.info.loadSession('rowInfo');
            this.info.removeSession('rowInfo');

            if(this.info.id) {
                this.config.getInfo.params.columnId = this.info.id;
                this.loadInfo();
            }
        },

        backClick : function() {
            history.back();
        }

    });

    new ColumnEditController('div[data-page]');

})();