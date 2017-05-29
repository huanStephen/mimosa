(function() {

    var sepa = org.eocencle.sepa;

    var Article = sepa.EntitiesManager.find('Article');

    var ArticleEntity = new sepa.Class([Article.model, sepa.Model]);

    var ArticleExamineController = new sepa.Class([sepa.Controller, sepa.CRemote, sepa.CElement,
        sepa.CDomRenderRole, sepa.CVaildate, sepa.CCombVaildate, this.mimosa.EditTemplate, sepa.CStorage]);

    ArticleExamineController.include({

        Model : ArticleEntity,

        elements : {
            //导航
            'ul.breadcrumb' : 'navContainer',
            //标题
            'h4[data-field="title"]' : 'title',
            //内容
            'span[data-field="content"]' : 'content'
        },

        events : {
            //'click a[data-parentId]' : 'navClick'
            //通过
            'click button[data-operate="pass"]' : 'passClick',
            //不通过
            'click button[data-operate="nopass"]' : 'nopassClick'
        },

        /*blocks : {
         'navBlk' : 'navEl'
         },*/

        config : {
            getInfo : {
                path : 'article/getArticle',
                params : {
                    articleId : 0
                }
            }
        },

        //level : [],

        load : function() {
            this.info = new ArticleEntity();
            this.info.loadSession('rowInfo');
            this.info.removeSession('rowInfo');

            //this.renderNav();

            this.config.getInfo.params.articleId = this.info.id;
            this.loadInfo();
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

                $title = this.component('element', ['a']).clone();
                $title.attr('href', 'javascript:void(0);');

                $title.attr('data-parentid', spl[0]).text(spl[1]);

                $nav.append($title);

                this.navContainer.append($nav);
            }

            $nav = this.navEl.clone();
            $nav.children('i').addClass('fa-angle-right');
            $title = this.component('element', ['span']).clone();
            if(this.info.id) {
                this.t.text('编辑');
                $title.text('编辑');
            } else {
                this.t.text('添加');
                $title.text('添加');
            }
            $nav.append($title);

            this.navContainer.append($nav);

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

        passClick : function(event) {
            this.info.status = 4;
            this.info.createRemote('article/updateArticle', this.proxy(function(result) {
                if(!result.errCode) {
                    alert('操作完毕！');
                    indexCtrl.loadPage('article/index.html');
                } else {
                    console.error(result.errMsg);
                }
            }));
        },

        nopassClick : function(event) {
            this.info.status = 3;
            this.info.examineCommont = prompt('请输入审核意见:', '');
            this.info.createRemote('article/updateArticle', this.proxy(function(result) {
                if(!result.errCode) {
                    alert('操作完毕！');
                    indexCtrl.loadPage('article/index.html');
                } else {
                    console.error(result.errMsg);
                }
            }));
        },

        backClick : function() {
            //this.component('saveSession', ['level', this.level]);
            indexCtrl.loadPage('article/index.html');
        },

        navBlk : function() {
            return '<li><i class="fa"></i></li>';
        }

    });

    new ArticleExamineController('div[data-page]');

})();