(function() {

    var sepa = org.eocencle.sepa;

    var Column = sepa.EntitiesManager.find('Column');

    var ColumnEntity = new sepa.Class([Column.model, sepa.Model]);

    var ColumnListController = new sepa.Class([sepa.Controller, sepa.CRemote, sepa.CElement, sepa.CDomRenderRole,
        this.mimosa.ListTemplate, sepa.CStorage]);

    ColumnListController.include({

        Model : ColumnEntity,

        elements : {
            'ul.breadcrumb' : 'navContainer'
        },

        events : {
            'click a[data-parentId]' : 'navClick'
        },

        blocks : {
            'navBlk' : 'navEl'
        },

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
                requireRowInfo : true,
                before : 'addBefore'
            },
            entry : {
                page : 'column/index.html',
                requireRowInfo : false,
                before : 'entryBefore'
            },
            edit : {
                page : 'column/columnEdit.html',
                requireRowInfo : true,
                before : 'editBefore'
            },
            delete : {
                before : 'deleteBefore',
                warning : '确定删除该栏目？'
            }
        },

        level : ['0,主栏目'],

        load : function() {
            this.renderNav();

            this.config.getList.params.parentId = this.level[this.level.length - 1].split(',')[0];
            this.loadList();
        },

        renderNav : function() {
            var lv = this.component('loadSession', ['level']);
            this.component('removeSession', ['level']);
            lv = lv || this.level;

            this.navContainer.empty();

            var spl, $nav = null, $title = null;
            for(var i=0; i < lv.length; i++) {
                spl = lv[i].split(',');
                $nav = this.navEl.clone();
                if(i == 0) {
                    $nav.children('i').addClass('fa-home');
                } else {
                    $nav.children('i').addClass('fa-angle-right');
                }

                if(i == lv.length - 1) {
                    $title = this.component('element', ['span']).clone();
                } else {
                    $title = this.component('element', ['a']).clone();
                    $title.attr('href', 'javascript:void(0);');
                }

                $title.attr('data-parentid', spl[0]).text(spl[1]);

                $nav.append($title);

                this.navContainer.append($nav);
            }
            this.level = lv;
        },

        navClick : function(event) {
            var parentId = this.$(event.target).data('parentid');

            for(var i=this.level.length - 1; i >= 0; i--) {
                var spl = this.level[i].split(',');
                if(spl[0] == parentId) {
                    this.level.splice(i + 1, this.level.length - i - 1);

                    this.component('saveSession', ['level', this.level]);
                    indexCtrl.loadPage('column/index.html');
                    break;
                }
            }
        },

        addBefore : function() {
            this.component('saveSession', ['level', this.level]);
        },

        entryBefore : function(event) {
            var id = this.getRowId(event);
            var title = this.$(event.target).parents('tr').find('*[data-field="title"]').text();

            this.level.push(id + ',' + title);

            this.component('saveSession', ['level', this.level]);
        },

        editBefore : function() {
            this.component('saveSession', ['level', this.level]);
        },

        deleteBefore : function(event) {
            this.config.deleteRow.params.columnId = this.getRowId(event);
        },

        navBlk : function() {
            return '<li><i class="fa"></i></li>';
        }

    });

    new ColumnListController('div[data-page]');

})();