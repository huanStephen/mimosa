(function() {

    var sepa = org.eocencle.sepa;

    this.mimosa = {};

    //列表模板
    var _ListTemplate = this.mimosa.ListTemplate = new sepa.Class();

    _ListTemplate.include({
        elements : {
            //阴影面积
            'div.listshadow' : 'shadow',
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

        //需要配置的
        config : {
            getList : {
                //path : '',
                //params : {},
                callback : 'getListResult'
            },
            deleteRow : {
                 //path : '',
                 //params : {},
                 callback : 'deleteRowResult'
            }
        },

        //Model : ColumnEntity,

        /*load : function() {
            this.renderList();
        },*/

        loadList : function() {
            this.component('remote', ['getList']);
            indexCtrl.blockUI(this.shadow);
        },

        getListResult : function(result) {
            indexCtrl.unblockUI(this.shadow);
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

                        row.attr('data-id', list[i].id);

                        var as = this.attrSetting(fieldNames[j]);
                        if('txt' == as)
                            this.component('domRenderRole', [false, $field, this.replaceRender(fieldNames[j], list[i][fieldNames[j]])]);
                        else
                            this.component('domRenderRole', [false, $field, this.replaceRender(fieldNames[j], list[i][fieldNames[j]]), as]);
                    }

                    this.listContainer.append(row);
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

        /*operateConfig : {
            add : {
                page : '',
                requireRowInfo : true,
                before : '',
                after : '',
                warning : ''
            }
        },*/

        getRowId : function(event) {
            return this.$(event.target).parents('tr').data('id');
        },

        addClick : function(event) {
            if(!this.operateConfig || !this.operateConfig.add) {
                console.error('operateConfig.add not found !');
                return ;
            }

            if(this.operateConfig.add.before) {
                this[this.operateConfig.add.before].call(this, event);
            }

            if(this.operateConfig.add.requireRowInfo)
                new this.Model().saveSession('rowInfo');
            indexCtrl.loadPage(this.operateConfig.add.page);

            if(this.operateConfig.add.after) {
                this[this.operateConfig.add.after].call(this, event);
            }
        },

        entryClick : function(event) {
            if(!this.operateConfig || !this.operateConfig.entry) {
                console.error('operateConfig.entry not found !');
                return ;
            }

            if(this.operateConfig.entry.before) {
                this[this.operateConfig.entry.before].call(this, event);
            }

            if(this.operateConfig.entry.requireRowInfo)
                this.Model.find(this.getRowId(event)).saveSession('rowInfo');
            indexCtrl.loadPage(this.operateConfig.entry.page);

            if(this.operateConfig.entry.after) {
                this[this.operateConfig.entry.after].call(this, event);
            }
        },

        editClick : function(event) {
            if(!this.operateConfig || !this.operateConfig.edit) {
                console.error('operateConfig.edit not found !');
                return ;
            }

            if(this.operateConfig.edit.before) {
                this[this.operateConfig.edit.before].call(this, event);
            }

            if(this.operateConfig.edit.requireRowInfo)
                this.Model.find(this.getRowId(event)).saveSession('rowInfo');
            indexCtrl.loadPage(this.operateConfig.edit.page);

            if(this.operateConfig.edit.after) {
                this[this.operateConfig.edit.after].call(this, event);
            }
        },

        deleteClick : function(event) {
            if(!this.operateConfig || !this.operateConfig.delete) {
                console.error('operateConfig.delete not found !');
                return ;
            }

            if(this.operateConfig.delete.before) {
                this[this.operateConfig.delete.before].call(this, event);
            }

            if(this.operateConfig.delete.warning) {
                if(confirm(this.operateConfig.delete.warning)) {
                    this.component('remote', ['deleteRow']);
                }
            } else {
                if(confirm('确认删除该条数据？')) {
                    this.component('remote', ['deleteRow']);
                }
            }

            if(this.operateConfig.delete.after) {
                this[this.operateConfig.delete.after].call(this, event);
            }

        },

        deleteRowResult :function(result) {
            if(!result.errCode) {
                this.component('remote', ['getList']);
                indexCtrl.blockUI(this.shadow);
            } else {
                console.error(result.errMsg);
            }
        }
    });

    //编辑模板
    var _EditTemplate = this.mimosa.EditTemplate = new sepa.Class();

    _EditTemplate.include({

        events : {
            //提交
            'click *[data-operate="submit"]' : 'submitClick',
            //返回
            'click *[data-operate="back"]' : 'backClick'
        },

        config : {
            getInfo : {
                path : '',
                params : '',
                callback : 'getInfoResult'
            }
        },

        Model : '',

        loadInfo : function() {
            this.component('remote', ['getInfo']);
        },

        getInfoResult : function(result) {
            if(!result.errCode) {
                this.info = new this.Model(result.data.obj);
                this.renderEdit(this.info);
            } else {
                console.error(result.errMsg);
            }
        },

        renderEdit : function(model) {
            var attrs = this.Model._attributes;
            for(var i in attrs) {
                var $field = this.$('*[data-field="' + attrs[i] + '"]');
                if($field.length) {
                    var as = this.attrSetting(attrs[i]);
                    if('txt' == as)
                        this.component('domRenderRole', [false, $field, this.replaceRender(attrs[i], model[attrs[i]])]);
                    else
                        this.component('domRenderRole', [false, $field, this.replaceRender(attrs[i], model[attrs[i]]), as]);
                }
            }
        },

        attrSetting : function(fieldName) {
            return 'txt';
        },

        replaceRender : function(fieldName, fieldValue) {
            return fieldValue;
        },

        //验证规则
        vaildRole : {},

        //提交
        submitConfig : {
            addConfig : {
                path : ''
            },
            updateConfig : {
                path : ''
            }
        },

        submitClick : function(event) {
            var result = this.component('combVaildate', [this.info, this.vaildRole, function(errMsg) {
                var $row = $(this).parents('*[data-row]');
                if(errMsg) $row.addClass('error');
                else $row.removeClass('error');
                $row.find('*[data-msg]').text(errMsg);
            }]);

            if(this.submitBefore) this.submitBefore.call(this, this.info, event);

            if(result) {
                if(!this.info.id) {
                    this.info.createRemote(this.submitConfig.addConfigPath, this.proxy(function(result) {
                        if(!result.errCode) {
                            alert('添加成功！');
                            this.backClick();
                        } else {
                            console.error(result.errMsg);
                        }
                    }));
                } else {
                    this.info.createRemote(this.submitConfig.updateConfigPath, this.proxy(function(result) {
                        if(!result.errCode) {
                            alert('更新成功！');
                            this.backClick();
                        } else {
                            console.error(result.errMsg);
                        }
                    }));
                }
            }
        },

        backClick : function() {
            history.back();
        }
    });

})();