(function() {

    var sepa = org.eocencle.sepa;

    var Column = sepa.EntitiesManager.find('Column');

    var ColumnEntity = new sepa.Class([Column.model, sepa.Model]);

    var ColumnController = new sepa.Class([sepa.Controller, sepa.CRemote, sepa.CElement]);

    ColumnController.include({

        elements : {
            //阴影面积
            'div.portlet' : 'shadow',
            //列表容器
            '*[data-index="main"]' : 'listContainer',
            //克隆行
            '*[data-clone]' : 'cloneRow'
        },

        events : {
            //添加
            'click *[data-operate="add"]' : 'addClick',
            //进入
            'click *[data-operate="entry"]' : 'entryClick',
            //编辑
            'click *[data-operate="edit"]' : 'editClick',
            //删除
            'click *[data-operate="delete"]' : 'deleteClick'
        },

        config : {
            getList : {
                path : '',
                params : {},
                callback : 'getListResult'
            },
            deleteRow : {

            }
        },

        Model : ColumnEntity,

        load : function() {
            this.renderList();
        },

        loadList : function() {
            this.component('remote', ['getList']);
            App.blockUI(this.shadow);
        },

        getListResult : function(result) {
            App.unblockUI(this.shadow);
            if(!result.errCode) {
                this.Model.populate(result.data.list);
                this.renderList();
            } else {
                console.error(result.errMsg);
            }
        },

        renderList : function() {
            if(this.Model.count()) {
                var list = this.Model.all();
                this.listContainer.empty();

                var fieldNames = [];

                var attrs = this.Model._attributes;
                for(var i in attrs) {
                    if(this.cloneRow.find('*[data-field="' + attrs[i] + '"]').length) {
                        fieldNames.push(attrs[i]);
                    }
                }

                for(var i in list) {
                    var row = this.cloneRow.clone();

                    for(var j in fieldNames) {
                        var $field = row.find('*[data-field="' + fieldNames[j] + '"]');

                        $field.attr('data-id', list[i].id);

                        var as = this.attrSetting(fieldNames[j]);
                        if('txt' == as)
                            this.component('domRenderRole', [false, $field, this.replaceRender(fieldNames[j], list[i][fieldNames[j]])]);
                        else
                            this.component('domRenderRole', [false, $field, this.replaceRender(fieldNames[j], list[i][fieldNames[j]]), as]);
                    }
                }
            } else {
                var size = this.cloneRow.children().length;
                var $emptyRow = this.component('element', ['td']).clone().attr('colspan', size).text('没有检索到任何数据！');
                this.cloneRow.empty().append($emptyRow);

            }
        },

        attrSetting : function(fieldName) {
            return 'txt';
        },

        replaceRender : function(fieldName, fieldValue) {
            return fieldValue;
        },

        operateConfig : {
            add : {
                page : '',
                requireRowInfo : true,
                before : '',
                after : ''
            }
        },

        getRowId : function(event) {
            return this.$(event.target).parents('tr').data('id');
        },

        addClick : function(event) {
            if(!this.operateConfig || !this.operateConfig.add) {
                console.error('operateConfig.add not found !');
                return ;
            }

            if(this.operateConfig.add.before) {
                this[this.operateConfig.add.before].call(event);
            }

            if(this.operateConfig.add.requireRowInfo)
                this.Model.find(this.getRowId(event)).saveSession('rowInfo');
            indexCtrl.loadPage(this.operateConfig.add.page);

            if(this.operateConfig.add.after) {
                this[this.operateConfig.add.after].call(event);
            }
        },

        entryClick : function(event) {
            if(!this.operateConfig || !this.operateConfig.entry) {
                console.error('operateConfig.entry not found !');
                return ;
            }

            if(this.operateConfig.entry.before) {
                this[this.operateConfig.entry.before].call(event);
            }

            if(this.operateConfig.entry.requireRowInfo)
                this.Model.find(this.getRowId(event)).saveSession('rowInfo');
            indexCtrl.loadPage(this.operateConfig.entry.page);

            if(this.operateConfig.entry.after) {
                this[this.operateConfig.entry.after].call(event);
            }
        },

        editClick : function(event) {
            if(!this.operateConfig || !this.operateConfig.edit) {
                console.error('operateConfig.edit not found !');
                return ;
            }

            if(this.operateConfig.edit.before) {
                this[this.operateConfig.edit.before].call(event);
            }

            if(this.operateConfig.edit.requireRowInfo)
                this.Model.find(this.getRowId(event)).saveSession('rowInfo');
            indexCtrl.loadPage(this.operateConfig.edit.page);

            if(this.operateConfig.edit.after) {
                this[this.operateConfig.edit.after].call(event);
            }
        },

        deleteClick : function(event) {
            if(!this.operateConfig || !this.operateConfig.delete) {
                console.error('operateConfig.delete not found !');
                return ;
            }

            if(this.operateConfig.delete.before) {
                this[this.operateConfig.delete.before].call(event);
            }

            this.component('remote', ['deleteRow']);
        },

    });

    new ColumnController('div.container-fluid');

})();