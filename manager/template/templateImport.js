(function() {

    var sepa = org.eocencle.sepa;

    var Template = sepa.EntitiesManager.find('Template');

    var TemplateEntity = new sepa.Class([Template.model, sepa.Model]);

    var TemplateImportListController = new sepa.Class([sepa.Controller, sepa.CRemote, sepa.CElement, sepa.CDomRenderRole]);

    TemplateImportListController.include({

        elements : {
            //加载阴影
            'div.listshadow' : 'listshadow',
            //列表容器
            '*[data-index="main"]' : 'listContainer',
            //克隆行
            '*[data-clone]' : 'cloneRow'
        },

        events : {
            'click a[data-operate="import"]' : 'importClick',
            'click a[data-operate="delete"]' : 'deleteClick'
        },

        config : {
            getTemplateList : {
                path : 'template/getAllTemplateList',
                callback : 'getTemplateListResult'
            },
            deleteTemplate : {
                path : 'template/deleteTemplate',
                params : {
                    templateId : 0
                },
                callback : 'deleteTemplateResult'
            }
        },

        blocks : {
            errBlk : 'errEl'
        },

        load : function() {
            this.component('remote', ['getTemplateList']);
            indexCtrl.blockUI(this.listshadow);
        },

        getTemplateListResult : function(result) {
            indexCtrl.unblockUI(this.listshadow);
            if(!result.errCode) {
                this.renderList(result.data.list);
            } else {
                console.error(result.errMsg);
            }
        },

        renderList : function(list) {
            if(list.length) {
                this.listContainer.empty();

                var fieldNames = [];

                this.cloneRow.find('*[data-field]').each(function(idx, el) {
                    fieldNames.push($(el).data('field'));
                });

                for(var i in list) {
                    var row = this.cloneRow.clone();

                    for(var j in fieldNames) {
                        var $field = row.find('*[data-field="' + fieldNames[j] + '"]');

                        row.attr('data-id', list[i].id);

                        this.component('domRenderRole', [false, $field, list[i][fieldNames[j]]]);
                    }

                    if(list[i].remark) {
                        var remark = this.errEl.clone().text(list[i].remark);
                        row.children('td:last').append(remark);
                    }

                    this.listContainer.append(row);
                }
            } else {
                var size = this.cloneRow.children().length;
                var $emptyRow = this.component('element', ['td']).clone().attr('colspan', size).text('没有检索到任何数据！');
                this.cloneRow.empty().append($emptyRow);
            }
        },

        importClick : function(event) {
            var id = this.$(event.target).parents('tr').data('id');
            if(id) {
                alert('模板已导入！');
            } else {
                var template = new TemplateEntity();
                template.id = id;
                template.name = this.$(event.target).parents('tr').find('*[data-field="templateName"]').text();
                template.createRemote('template/addTemplate', this.proxy(function(result) {
                    if(!result.errCode) {
                        alert('导入模板成功！');
                        this.component('remote', ['getTemplateList']);
                        indexCtrl.blockUI(this.listshadow);
                    } else {
                        console.error(result.errMsg);
                    }
                }));
            }
        },

        deleteClick : function(event) {
            var id = this.$(event.target).parents('tr').data('id');
            if(id) {
                if(confirm("确定要删除该模板？")) {
                    this.config.deleteTemplate.params.templateId = id;
                    this.component('remote', ['deleteTemplate']);
                }
            } else {
                alert('模板未导入！');
            }
        },

        deleteTemplateResult : function(result) {
            if(!result.errCode) {
                this.component('remote', ['getTemplateList']);
                indexCtrl.blockUI(this.listshadow);
            } else {
                console.error(result.errMsg);
            }
        },

        errBlk : function() {
            return '<div class="alert-error"></div>';
        }

    });

    new TemplateImportListController('div[data-page]');

})();