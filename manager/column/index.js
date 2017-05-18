(function() {

    var sepa = org.eocencle.sepa;

    var Column = sepa.EntitiesManager.find('Column');

    var ColumnEntity = new sepa.Class([Column.model, sepa.Model]);

    var ColumnController = new sepa.Class([sepa.Controller, sepa.CRemote, sepa.CElement, sepa.CDomRenderRole, this.mimosa.ListTemplate]);

    ColumnController.include({

        Model : ColumnEntity,

        config : {
            getList : {
                path : 'column/getColumnList',
                params : {
                    parentId : 0
                }
            },
            deleteRow : {
                path : 'column/deleteColumn',
                params : {
                    columnId : 0
                }
            }
        },

        operateConfig : {
            add : {
                page : 'column/columnEdit.html',
                after : 'addAfter'
            },
            edit : {
                page : 'column/columnEdit.html',
                requireRowInfo : true
            },
            delete : {
                before : 'deleteBefore',
                warning : '确定删除该栏目？'
            }
        },

        load : function() {
            this.loadList();
        },

        addAfter : function() {
            console.log('addAfter');
        },

        deleteBefore : function(event) {
            this.config.deleteRow.params.columnId = this.getRowId(event);
        }

    });

    new ColumnController('div[data-page]');

})();