(function() {

    var sepa = org.eocencle.sepa;

    var ResourceAlbum = sepa.EntitiesManager.find('ResourceAlbum');

    var ResourceAlbumEntity = new sepa.Class([ResourceAlbum.model, sepa.Model]);

    var ResourceAlbumEditController = new sepa.Class([sepa.Controller, sepa.CRemote, sepa.CElement, sepa.CDomRenderRole,
        sepa.CVaildate, sepa.CCombVaildate, this.mimosa.EditTemplate, sepa.CStorage]);

    ResourceAlbumEditController.include({

        Model : ResourceAlbumEntity,

        elements : {
            //标题
            /*'h3.page-title > span:first' : 't',
            //导航
            'ul.breadcrumb' : 'navContainer',*/
            //标题
            'input[data-field="name"]' : 'name',
            //描述
            'textarea[data-field="description"]' : 'description'
        },

        /*events : {
            'click a[data-parentId]' : 'navClick'
        },*/

        /*blocks : {
            'navBlk' : 'navEl'
        },*/

        config : {
            getInfo : {
                path : 'resource/getResourceAlbum',
                params : {
                    albumId : 0
                }
            }
        },

        vaildRole : {
            name : [['required', '请输入资源集名称！'],
                ['maxlength', '资源集名称不能超过15个字！', 15]],
            description : [['maxlength', '描述不能超过140个字！', 140]]
        },

        submitConfig : {
            addConfigPath : 'column/addColumn',
            updateConfigPath : 'column/updateColumn'
        },

        level : [],

        load : function() {
            this.info = new ResourceAlbumEntity();
            this.info.loadSession('rowInfo');
            this.info.removeSession('rowInfo');

            //this.renderNav();

            if(this.info.id) {
                this.config.getInfo.params.albumId = this.info.id;
                this.loadInfo();
            }

        },

        /*renderNav : function() {
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
        },*/

        submitBefore : function() {
            //this.component('saveSession', ['level', this.level]);
        },

        backClick : function() {
            //this.component('saveSession', ['level', this.level]);
            indexCtrl.loadPage('resource/index.html');
        }/*,

        navBlk : function() {
            return '<li><i class="fa"></i></li>';
        }*/

    });

    new ResourceAlbumEditController('div[data-page]');

})();