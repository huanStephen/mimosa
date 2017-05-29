(function() {

    var sepa = org.eocencle.sepa;

    var SelectNode = sepa.EntitiesManager.find('SelectNode');

    var SelectNodeEntity = new sepa.Class([SelectNode.model, sepa.Model]);

    var PagePlaceholder = sepa.EntitiesManager.find('PagePlaceholder');

    var PagePlaceholderEntity = new sepa.Class([PagePlaceholder.model, sepa.Model]);

    var PagePlaceholderEditController = new sepa.Class([sepa.Controller, sepa.CRemote, sepa.CElement,
        sepa.CDomRenderRole, sepa.CVaildate, sepa.CCombVaildate, this.mimosa.EditTemplate, sepa.CStorage]);

    PagePlaceholderEditController.include({

        Model : PagePlaceholderEntity,

        elements : {
            //导航
            'ul.breadcrumb' : 'navContainer',
            //索引
            'input[data-field="index"]' : 'index',
            //资源类型
            'select[data-field="resourceType"]' : 'resourceType',
            //组id
            'select[data-field="groupId"]' : 'groupId',
            //详细配置
            'textarea[data-field="detailConfig"]' : 'detailConfig'
        },

        /*events : {
         'click a[data-parentId]' : 'navClick'
         },*/

        /*blocks : {
         'navBlk' : 'navEl'
         },*/

        config : {
            getGroupContentList : {
                path : 'page/getGroupContentList',
                callback : 'getGroupContentListResult'
            },
            getInfo : {
                path : 'page/getPagePlaceholder',
                params : {
                    placeholderId : 0
                }
            }
        },

        vaildRole : {
            groupId : [['required', '请选择组名称！']]
        },

        submitConfig : {
            updateConfigPath : 'page/updatePagePlaceholder'
        },

        //level : [],

        load : function() {
            this.info = new PagePlaceholderEntity();
            this.info.loadSession('rowInfo');
            this.info.removeSession('rowInfo');

            this.component('remote', ['getGroupContentList']);

            //this.renderNav();

            this.config.getInfo.params.pageId = this.info.id;
            this.loadInfo();

        },

        getGroupContentListResult : function(result) {
            if(!result.errCode) {
                SelectNodeEntity.populate(result.data.list);
                this.renderSel();
            } else {

            }
        },

        renderSel : function() {
            if(SelectNodeEntity.count()) {
                var list = SelectNodeEntity.all();

                for(var i in list) {
                    var $option = this.component('element', ['option']).clone();
                    $option.attr('value', list[i].id);
                    $option.text(list[i].name);

                    this.groupId.append($option);
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
            info.groupName = this.groupId.find("option:selected").text();
        },

        backClick : function() {
            //this.component('saveSession', ['level', this.level]);
            indexCtrl.loadPage('page/pagePlaceholderList.html');
        },

        navBlk : function() {
            return '<li><i class="fa"></i></li>';
        }

    });

    new PagePlaceholderEditController('div[data-page]');

})();