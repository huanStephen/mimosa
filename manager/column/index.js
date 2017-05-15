(function() {

    var sepa = org.eocencle.sepa;

    var Column = sepa.EntitiesManager.find('Column');

    var ColumnEntity = new sepa.Class([Column.model, sepa.Model]);

    var ColumnController = new sepa.Class([sepa.Controller, sepa.CRemote, sepa.CElement]);

    ColumnController.include({

        elements : {
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
            }
        },

        Model : ColumnEntity,

        load : function() {
            this.renderList();
        },

        loadList : function() {
            this.component('remote', ['getList']);
        },

        getListResult : function(result) {
            if(!result.errCode) {
                this.Model.populate(result.data.list);
                this.renderList();
            } else {
                console.error(result.errMsg);
            }
        },

        renderList : function() {
            //if(this.Model.count()) {
                //var list = this.Model.all();
                this.listContainer.empty();

                var fieldNames = [];
                this.cloneRow.find('*[data-field]').each(function(idx, el) {
                    fieldNames.push($(el).data('field'));
                });

                console.log(fieldNames.length);

                /*for(var i in list) {

                }*/
            /*} else {
                var size = this.cloneRow.children().length;
                var $emptyRow = this.component('element', ['td']).clone().attr('colspan', size).text('没有检索到任何数据！');
                this.cloneRow.empty().append($emptyRow);

            }*/
        },

        addClick : function(event) {

        },

        entryClick : function(event) {

        },

        deleteClick : function(event) {

        },

    });

    new ColumnController('div.container-fluid');

})();