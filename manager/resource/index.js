(function() {

    var sepa = org.eocencle.sepa;

    var ResourceAlbum = sepa.EntitiesManager.find('ResourceAlbum');

    var ResourceAlbumEntity = new sepa.Class([ResourceAlbum.model, sepa.Model]);

    var ResourceAlbumListController = new sepa.Class([sepa.Controller, sepa.CRemote, sepa.CElement, sepa.CDomRenderRole,
        this.mimosa.ListTemplate, sepa.CStorage]);

    ResourceAlbumListController.include({

        Model : ResourceAlbumEntity,

        /*elements : {
            'ul.breadcrumb' : 'navContainer'
        },

        events : {
            'click a[data-parentId]' : 'navClick'
        },

        blocks : {
            'navBlk' : 'navEl'
        },*/

        elements : {
            'h3.page-title' : 'title'
        },

        config : {
            getList : {
                path : 'resource/getResourceAlbumList',
                params : {
                    resourceType : ''
                }
            },
            deleteRow : {
                path : 'resource/deleteResourceAlbum',
                params : {
                    resourceAlbumId : 0
                }
            }
        },

        operateConfig : {
            add : {
                page : 'column/columnEdit.html',
                requireRowInfo : false,
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
                warning : '确定删除该资源集？'
            }
        },

        //level : ['0,����Ŀ'],

        load : function() {
            //this.renderNav();
            this.resourceType = location.hash.slice(1);

            if(this.resourceType == 'image') {
                this.title.text('图片资源集');
            }
            if(this.resourceType == 'sound') {
                this.title.text('音频资源集');
            }
            if(this.resourceType == 'video') {
                this.title.text('视频资源集');
            }
            if(this.resourceType == 'attachment') {
                this.title.text('附件资源集');
            }

            this.config.getList.params.resourceType = this.resourceType;
            this.loadList();
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
        },*/

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
            this.config.deleteRow.params.resourceAlbumId = this.getRowId(event);
        }/*,

        navBlk : function() {
            return '<li><i class="fa"></i></li>';
        }*/

    });

    new ResourceAlbumListController('div[data-page]');

})();