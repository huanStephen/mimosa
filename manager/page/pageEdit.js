(function() {

    var sepa = org.eocencle.sepa;

    var Template = sepa.EntitiesManager.find('Template');

    var TemplateEntity = new sepa.Class([Template.model, sepa.Model]);

    var Page = sepa.EntitiesManager.find('Page');

    var PageEntity = new sepa.Class([Page.model, sepa.Model]);

    var PageEditController = new sepa.Class([sepa.Controller, sepa.CRemote, sepa.CElement,
        sepa.CDomRenderRole, sepa.CVaildate, sepa.CCombVaildate, this.mimosa.EditTemplate, sepa.CStorage]);

    PageEditController.include({

        Model : PageEntity,

        elements : {
            //标题
            'h3.page-title > span:first' : 't',
            //导航
            'ul.breadcrumb' : 'navContainer',
            //hash索引
            'input[data-field="hashIndex"]' : 'hashIndex',
            //页面名称
            'input[data-field="name"]' : 'name',
            //模板id
            'select[data-field="templateId"]' : 'templateId'
        },

        /*events : {
         'click a[data-parentId]' : 'navClick'
         },*/

        /*blocks : {
         'navBlk' : 'navEl'
         },*/

        config : {
            getTemplateList : {
                path : 'template/getTemplateList',
                callback : 'getTemplateListResult'
            },
            getInfo : {
                path : 'page/getPage',
                params : {
                    pageId : 0
                }
            }
        },

        vaildRole : {
            hashIndex : [['required', '请输入hash索引！'],
                ['maxlength', 'hash索引不能超过15个字！', 15]],
            name : [['required', '请输入页面名称！'],
                ['maxlength', '页面名称不能超过15个字！', 15]],
            templateId : [['required', '请选择模板！']]
        },

        submitConfig : {
            addConfigPath : 'page/addPage',
            updateConfigPath : 'page/updatePage'
        },

        //level : [],

        load : function() {
            this.info = new PageEntity();
            this.info.loadSession('rowInfo');
            this.info.removeSession('rowInfo');

            this.component('remote', ['getTemplateList']);

            //this.renderNav();

            if(this.info.id) {
                this.t.text('编辑');
                this.config.getInfo.params.pageId = this.info.id;
                this.loadInfo();
            } else {
                this.t.text('添加');
            }

        },

        getTemplateListResult : function(result) {
            if(!result.errCode) {
                TemplateEntity.populate(result.data.list);
                this.renderSel();
            } else {

            }
        },

        renderSel : function() {
            if(TemplateEntity.count()) {
                var list = TemplateEntity.all();

                for(var i in list) {
                    var $option = this.component('element', ['option']).clone();
                    $option.attr('value', list[i].id);
                    $option.text(list[i].name);

                    this.templateId.append($option);
                }
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

        submitBefore : function(info) {
            info.templateName = this.templateId.find("option:selected").text();
        },

        backClick : function() {
            //this.component('saveSession', ['level', this.level]);
            indexCtrl.loadPage('page/index.html');
        },

        navBlk : function() {
            return '<li><i class="fa"></i></li>';
        }

    });

    new PageEditController('div[data-page]');

})();