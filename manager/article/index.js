(function() {

    var sepa = org.eocencle.sepa;

    var ColumnTreeController = new sepa.Class([sepa.Controller, sepa.CRemote, sepa.CStorage]);

    ColumnTreeController.include({

        elements : {
            //树形结构
            'ul.tree' : 'tree',
            //树形阴影
            'div.treeshadow' : 'shadow'
        },

        events : {
            //树形点击
            'click ul.tree a' : 'treeClick',
            //树形双击
            'dblclick ul.tree a' : 'treeDbClick'
        },

        blocks : {
            //枝
            'branchBlk' : 'branchEl',
            //叶
            'leafBlk' : 'leafEl'
        },

        config : {
            getColumnList : {
                path : 'article/getColumnList',
                callback : 'getColumnListResult'
            }
        },

        level : ['0,主栏目'],

        load : function() {
            this.component('remote', ['getColumnList']);
            indexCtrl.blockUI(this.shadow);
        },

        getColumnListResult : function(result) {
            indexCtrl.unblockUI(this.shadow);
            if(!result.errCode) {
                for(var i in result.data.list) {
                    this.tree.append(this.buildBranch(result.data.list[i]));
                }
            } else {
                console.error(result.errMsg);
            }
        },

        buildBranch : function(data) {
            var $leaf = this.leafEl.clone();
            if(data.children.length) {
                $leaf.children('a').text(data.name).attr('data-id', data.id).attr('data-parent', 'true');
                var $branch = this.branchEl.clone();
                for(var i in data.children) {
                    $branch.append(this.buildBranch(data.children[i]));
                }
                $leaf.append($branch);
            } else {
                $leaf.children('a').removeAttr('class').find('span').text(data.name).attr('data-id', data.id);
            }

            return $leaf;
        },

        //单双击判断
        timer : null,

        treeClick : function(event) {
            clearTimeout(this.timer);

            this.timer = setTimeout(this.proxy(function() {
                var $node = $(event.target);
                var columnId = $node.data('id');
                if(columnId) {
                    articleList.trigger(columnId);
                }
            }), 300);

        },

        treeDbClick : function(event) {
            clearTimeout(this.timer);

            var $a = $(event.target);
            if($a.data('id') && $a.hasClass('tree-toggle')) {
                $a.toggleClass('closed');
                $a.next('ul').toggleClass('in');
            }
        },

        branchBlk : function() {
            return '<ul class="branch in"></ul>';
        },

        leafBlk : function() {
            return '<li><a href="javascript:void(0);" class="tree-toggle"><i class="fa fa-columns"></i><span></span></a></li>'
        }

    });

    new ColumnTreeController('div[data-page]');


    var Article = sepa.EntitiesManager.find('Article');

    var ArticleEntity = new sepa.Class([Article.model, sepa.Model]);

    var ArticleListController = new sepa.Class([sepa.Controller, sepa.CRemote, sepa.CElement, sepa.CDomRenderRole,
        this.mimosa.ListTemplate, sepa.CStorage]);

    ArticleListController.include({

        Model : ArticleEntity,

        elements : {
            'button[data-operate="add"]' : 'addBtn',
            //状态
            'select.status' : 'status'
        },

        events : {
            //状态改变
            'change select.status' : 'statusChange',
            //审核
            'click *[data-operate="examine"]' : 'examineClick'
        },

        config : {
            getList : {
                path : 'article/getArticleList',
                params : {
                    columnId : 0,
                    status : 0
                }
            },
            deleteRow : {
                path : 'article/deleteArticle',
                params : {
                    articleId : 0
                }
            }
        },

        operateConfig : {
            add : {
                page : 'article/articleEdit.html',
                requireRowInfo : true
            },
            /*entry : {
                page : 'column/index.html',
                requireRowInfo : false,
                before : 'entryBefore'
            },*/
            edit : {
                page : 'article/articleEdit.html',
                requireRowInfo : true
            },
            delete : {
                before : 'deleteBefore',
                warning : '确定删除该文章？'
            }
        },

        currColumnId : 0,

        load : function() {
            this.loadArticleList();
        },

        trigger : function(columnId) {
            this.currColumnId = columnId;
            this.loadArticleList();
        },

        loadArticleList : function() {
            this.config.getList.params.columnId = this.currColumnId;
            this.config.getList.params.status = this.status.val();

            if(this.currColumnId) this.addBtn.show();
            else this.addBtn.hide();

            this.loadList();
        },

        replaceRender : function(fieldName, fieldValue) {
            if(fieldName == 'status') {
                if(fieldValue == 1) {
                    return '草稿';
                }
                if(fieldValue == 2) {
                    return '待审核';
                }
                if(fieldValue == 3) {
                    return '审核未通过';
                }
                if(fieldValue == 4) {
                    return '审核已通过';
                }
            }
            return fieldValue;
        },

        statusChange : function() {
            this.loadArticleList();
        },

        deleteBefore : function(event) {
            this.config.deleteRow.params.articleId = this.getRowId(event);
        },

        examineClick : function(event) {
            var articleId = this.getRowId(event);
            this.Model.find(articleId).saveSession('rowInfo');

            indexCtrl.loadPage('article/articleExamine.html');
        }

        /*elements : {
            'ul.breadcrumb' : 'navContainer'
        },

        events : {
            'click a[data-parentId]' : 'navClick'
        },

        blocks : {
            'navBlk' : 'navEl'
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
        }*/

    });

    var articleList = new ArticleListController('div[data-page]');

})();