(function() {

    var sepa = org.eocencle.sepa;

    var Placeholder = sepa.EntitiesManager.find('Placeholder');

    var PlaceholderEntity = new sepa.Class([Placeholder.model, sepa.Model]);

    var TemplatePlaceholderEditController = new sepa.Class([sepa.Controller, sepa.CRemote, sepa.CElement,
        sepa.CDomRenderRole, sepa.CVaildate, sepa.CCombVaildate, this.mimosa.EditTemplate, sepa.CStorage]);

    TemplatePlaceholderEditController.include({

        Model : PlaceholderEntity,

        elements : {
            //标题
            'h3.page-title > span:first' : 't',
            //导航
            'ul.breadcrumb' : 'navContainer',
            //标题
            'input[data-field="index"]' : 'index',
            //描述
            'select[data-field="resourceType"]' : 'resourceType'
        },

        /*events : {
            'click a[data-parentId]' : 'navClick'
        },*/

        /*blocks : {
            'navBlk' : 'navEl'
        },*/

        config : {
            getInfo : {
                path : 'template/getTemplatePlaceholder',
                params : {
                    placeholderId : 0
                }
            }
        },

        vaildRole : {
            index : [['required', '请输入占位符索引！'],
                ['maxlength', '占位符索引不能超过15个字！', 15]]
        },

        submitConfig : {
            addConfigPath : 'template/addTemplatePlaceholder',
            updateConfigPath : 'template/updateTemplatePlaceholder'
        },

        level : [],

        load : function() {
            this.info = new PlaceholderEntity();
            this.info.loadSession('rowInfo');
            this.info.removeSession('rowInfo');

            //this.renderNav();

            if(this.info.id) {
                this.config.getInfo.params.placeholderId = this.info.id;
                this.loadInfo();
            }

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

        submitBefore : function() {
            //this.component('saveSession', ['level', this.level]);
        },

        backClick : function() {
            //this.component('saveSession', ['level', this.level]);
            indexCtrl.loadPage('template/templatePlaceholderConfig.html');
        },

        navBlk : function() {
            return '<li><i class="fa"></i></li>';
        }

    });

    new TemplatePlaceholderEditController('div[data-page]');

})();