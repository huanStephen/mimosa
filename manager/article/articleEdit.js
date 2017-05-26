(function() {

    var sepa = org.eocencle.sepa;

    var Article = sepa.EntitiesManager.find('Article');

    var ArticleEntity = new sepa.Class([Article.model, sepa.Model]);

    var ArticleEditController = new sepa.Class([sepa.Controller, sepa.CRemote, sepa.CElement, sepa.CDomRenderRole,
        sepa.CVaildate, sepa.CCombVaildate, this.mimosa.EditTemplate, sepa.CStorage]);

    ArticleEditController.include({

        Model : ArticleEntity,

        elements : {
            //审核意见
            '*[data-common="examineCommont"]' : 'examineCommont',
            //参数对象
            '*[data-params]' : 'p',
            //页面状态
            '*[data-title]' : 'pageTitle',
            //字段
            '*[data-field]' : 'fields',
            //标题
            '*[data-field="title"]' : 'title',
            //排序
            '*[data-field="sort"]' : 'sort',
            //文章类型
            '*[data-field="articleType"]' : 'articleType',
            //文章属性
            '*[data-field="attribute"]' : 'attribute',
            //缩略图
            '*[data-field="thumbnails"]' : 'thumbnails',
            //来源
            '*[data-field="source"]' : 'source',
            //作者
            '*[data-field="author"]' : 'author',
            //描述
            '*[data-field="description"]' : 'description',
            //关键字
            '*[data-field="keyword"]' : 'keyword',
            //缩略图对话框
            '#thumbnailModal' : 'thumbnailModal',
            //缩略图
            'div.thumbnail img' : 'thum',
            //缩略图选择
            'select.thumbnailSelAlbum' : 'thumbnailSelAlbum',
            //图片对话框
            '#imageModal' : 'imageModal',
            //图片选择
            'select.imageSelAlbum' : 'imageSelAlbum',
            //音频对话框
            '#soundModal' : 'soundModal',
            //音频选择
            'select.soundSelAlbum' : 'soundSelAlbum',
            //视频对话框
            '#videoModal' : 'videoModal',
            //视频选择
            'select.videoSelAlbum' : 'videoSelAlbum',
            //视频对话框
            '#attachmentModal' : 'attachmentModal',
            //视频选择
            'select.attachmentSelAlbum' : 'attachmentSelAlbum'
        },

        events : {
            //缩略图选择
            'change select.thumbnailSelAlbum' : 'thumbnailSelAlbumChange',
            //选中缩略图
            'click #thumbnailModal img' : 'thumbnailSelClick',
            //缩略图删除
            'click button.thumDelete' : 'thumDeleteClick',
            //图片选择
            'change select.imageSelAlbum' : 'imageSelAlbumChange',
            //选中图片
            'click #imageModal img' : 'imageSelClick',
            //音频选择
            'change select.soundSelAlbum' : 'soundSelAlbumChange',
            //选中音频
            'click #soundModal tr' : 'soundSelClick',
            //视频选择
            'change select.videoSelAlbum' : 'videoSelAlbumChange',
            //选中视频
            'click #videoModal a' : 'videoSelClick',
            //附件选择
            'change select.attachmentSelAlbum' : 'attachmentSelAlbumChange',
            //选中附件
            'click #attachmentModal tr' : 'attachmentSelClick',
            //保存草稿
            'click *[data-common="saveDraft"]' : 'saveDraftClick',
            //提交
            'click *[data-common="submit"]' : 'submitClick'
        },

        blocks : {
            'soundRowBlk' : 'soundRowEl',
            'attachmentRowBlk' : 'attachmentRowEl'
        },

        config : {
            getInfo : {
                path : 'article/getArticle',
                params : {
                    articeId : 0
                }
            }/*,
            getThumbnailList : {
                path : '../resource/getResourceList',
                params : {
                    albumId : ''
                },
                callback : 'getThumbnailListResult'
            },
            getImageAlbumList : {
                path : '../resource/getResourceAlbumList',
                params : {
                    resourceType : 'image'
                },
                callback : 'getImageAlbumListResult'
            },
            getImageList : {
                path : '../resource/getResourceList',
                params : {
                    albumId : ''
                },
                callback : 'getImageListResult'
            },
            getSoundAlbumList : {
                path : '../resource/getResourceAlbumList',
                params : {
                    resourceType : 'sound'
                },
                callback : 'getSoundAlbumListResult'
            },
            getSoundList : {
                path : '../resource/getResourceList',
                params : {
                    albumId : ''
                },
                callback : 'getSoundListResult'
            },
            getVideoAlbumList : {
                path : '../resource/getResourceAlbumList',
                params : {
                    resourceType : 'video'
                },
                callback : 'getVideoAlbumListResult'
            },
            getVideoList : {
                path : '../resource/getResourceList',
                params : {
                    albumId : ''
                },
                callback : 'getVideoListResult'
            },
            getAttachmentAlbumList : {
                path : '../resource/getResourceAlbumList',
                params : {
                    resourceType : 'attachment'
                },
                callback : 'getAttachmentAlbumListResult'
            },
            getAttachmentList : {
                path : '../resource/getResourceList',
                params : {
                    albumId : ''
                },
                callback : 'getAttachmentListResult'
            },
            getArticle : {
                path : 'getArticle',
                params : {},
                callback : 'getArticleResult'
            }*/
        },

        vaildRole : {
            title : [['required', '请输入文章标题！'],
                ['maxlength', '文章标题不能超过100个字！', 100]],
            sort : [['number', '排序只能为数字！'],
                ['range', '排序超出范围！', '0~99999']],
            source : [['maxlength', '来源不能超过100个字！', 100]],
            author : [['maxlength', '作者不能超过6个字！', 6]],
            keyword : [['maxlength', '关键字不能超过80个字！', 80]],
            description : [['maxlength', '描述不能超过140个字！', 140]]
        },

        load : function() {
            //初始化富文本编辑器
            //this.ueditor = UE.getEditor('container');

            this.info = new ArticleEntity();
            this.info.loadSession('rowInfo');
            this.info.removeSession('rowInfo');

            if (this.info.id) {
                this.config.getInfo.params.articeId = this.info.id;
                this.loadInfo();
            }

            /*this.component('remote', ['getThumbnailAlbumList']);
            this.component('remote', ['getImageAlbumList']);
            this.component('remote', ['getSoundAlbumList']);
            this.component('remote', ['getVideoAlbumList']);
            this.component('remote', ['getAttachmentAlbumList']);*/
        },

        //缩略图
        getThumbnailAlbumListResult : function(result) {
            if(!result.resultCode) {
                var $thumbnailSelect = $('#thumbnailModal').find('select');
                for(var i in result.data) {
                    var $option = this.component('element', ['option']).clone();
                    $option.val(result.data[i].id).text(result.data[i].name);
                    $thumbnailSelect.append($option.clone());
                }

                this.thumbnailSelAlbumChange();
            } else {
                console.error(result.resultMsg);
            }
        },

        thumbnailSelAlbumChange : function() {
            this.config.getThumbnailList.params.albumId = this.thumbnailSelAlbum.val();
            this.component('remote', ['getThumbnailList']);
        },

        getThumbnailListResult : function(result) {
            if(!result.resultCode) {
                var $thumbnailList = $('#thumbnailModal').find('div.modal-body');

                $thumbnailList.empty();
                for(var i in result.data) {
                    var $el = this.component('element', ['img']).clone();
                    $el.attr('src', result.data[i].path).attr('width', '24%').attr('height', '120');
                    $thumbnailList.append($el);
                }
            } else {
                console.error(result.resultMsg);
            }
        },

        thumbnailSelClick : function(event) {
            var path = $(event.target).attr('src');
            this.thum.attr('src', path);
            this.thumbnails.val(path);
            this.thumbnailModal.modal('hide');
        },

        thumDeleteClick : function() {
            this.thum.attr('src', '');
            this.thumbnails.val('');
        },

        //图片
        getImageAlbumListResult : function(result) {
            if(!result.resultCode) {
                var $imageSelect = $('#imageModal').find('select');
                for(var i in result.data) {
                    var $option = this.component('element', ['option']).clone();
                    $option.val(result.data[i].id).text(result.data[i].name);
                    $imageSelect.append($option.clone());
                }

                this.imageSelAlbumChange();
            } else {
                console.error(result.resultMsg);
            }
        },

        imageSelAlbumChange : function(event) {
            this.config.getImageList.params.albumId = this.imageSelAlbum.val();
            this.component('remote', ['getImageList']);
        },

        getImageListResult : function(result) {
            if(!result.resultCode) {
                var $imageList = $('#imageModal').find('div.modal-body');

                $imageList.empty();
                for(var i in result.data) {
                    var $el = this.component('element', ['img']).clone();
                    $el.attr('src', result.data[i].path).attr('width', '24%').attr('height', '120');
                    $imageList.append($el);
                }
            } else {
                console.error(result.resultMsg);
            }
        },

        imageSelClick : function(event) {
            this.ueditor.execCommand('insertHtml', '<img src="' + $(event.target).attr('src') + '"/>');
            this.imageModal.modal('hide');
        },

        //音频
        getSoundAlbumListResult : function(result) {
            if(!result.resultCode) {
                var $soundSelect = $('#soundModal').find('select');
                for(var i in result.data) {
                    var $option = this.component('element', ['option']).clone();
                    $option.val(result.data[i].id).text(result.data[i].name);
                    $soundSelect.append($option.clone());
                }

                this.soundSelAlbumChange();
            } else {
                console.error(result.resultMsg);
            }
        },

        soundSelAlbumChange : function() {
            this.config.getSoundList.params.albumId = this.soundSelAlbum.val();
            this.component('remote', ['getSoundList']);
        },

        getSoundListResult : function(result) {
            if(!result.resultCode) {
                var $soundList = $('#soundModal').find('tbody');

                $soundList.empty();
                for(var i in result.data) {
                    var $row = this.soundRowEl.clone();
                    $row.children(':first').text(result.data[i].id);
                    $row.children(':eq(1)').text(result.data[i].description);
                    $row.find('source').attr('src', result.data[i].path);
                    $soundList.append($row);
                }
            } else {
                console.error(result.resultMsg);
            }
        },

        soundSelClick : function(event) {
            var path = $(event.target).parent('tr').find('source').attr('src');
            this.ueditor.execCommand('insertHtml', '<audio controls><source src="' + path + '" type="audio/mpeg"></audio>');
            this.soundModal.modal('hide');
        },

        //视频
        getVideoAlbumListResult : function(result) {
            if(!result.resultCode) {
                var $videoSelect = $('#videoModal').find('select');
                for(var i in result.data) {
                    var $option = this.component('element', ['option']).clone();
                    $option.val(result.data[i].id).text(result.data[i].name);
                    $videoSelect.append($option.clone());
                }

                this.videoSelAlbumChange();
            } else {
                console.error(result.resultMsg);
            }
        },

        videoSelAlbumChange : function() {
            this.config.getVideoList.params.albumId = this.videoSelAlbum.val();
            this.component('remote', ['getVideoList']);
        },

        getVideoListResult : function(result) {
            if(!result.resultCode) {
                var $videoList = $('#videoModal').find('div.modal-body');

                $videoList.empty();
                for(var i in result.data) {
                    var $el = $('<a><video controls width="24%" height="120" src=""></video></a>');
                    $el.find('video').attr('src', result.data[i].path);
                    $videoList.append($el);
                }
            } else {
                console.error(result.resultMsg);
            }
        },

        videoSelClick : function(event) {
            var path = $(event.target).attr('src');
            this.ueditor.execCommand('insertHtml', '<video controls src="' + path + '"></video></a>');
            this.videoModal.modal('hide');
        },


        //附件
        getAttachmentAlbumListResult : function(result) {
            if(!result.resultCode) {
                var $attachmentSelect = $('#attachmentModal').find('select');
                for(var i in result.data) {
                    var $option = this.component('element', ['option']).clone();
                    $option.val(result.data[i].id).text(result.data[i].name);
                    $attachmentSelect.append($option.clone());
                }

                this.attachmentSelAlbumChange();
            } else {
                console.error(result.resultMsg);
            }
        },

        attachmentSelAlbumChange : function() {
            this.config.getAttachmentList.params.albumId = this.attachmentSelAlbum.val();
            this.component('remote', ['getAttachmentList']);
        },

        getAttachmentListResult : function(result) {
            if(!result.resultCode) {
                var $attachmentList = this.attachmentModal.find('tbody');

                $attachmentList.empty();
                for(var i in result.data) {
                    var $row = this.soundRowEl.clone();
                    $row.children(':eq(0)').text(result.data[i].id);
                    $row.children(':eq(1)').text(result.data[i].name);
                    $row.children(':eq(2)').text(result.data[i].description);
                    $attachmentList.append($row);
                }
            } else {
                console.error(result.resultMsg);
            }
        },

        attachmentSelClick : function(event) {
            var $row = $(event.target).parent('tr');
            var id = $row.children(':eq(0)').text();
            var description = $row.children(':eq(2)').text();
            var a = '<a href="../resource/downloadResource?resourceId=' + id + '">' + description + '</a>';
            this.ueditor.execCommand('insertHtml', a);
            this.attachmentModal.modal('hide');
        },

        soundRowBlk : function() {
            return '<tr>' +
                '<td></td>' +
                '<td></td>' +
                '<td>' +
                '<audio controls>' +
                '<source src="" type="audio/mpeg">' +
                '</audio>' +
                '</td>' +
                '</tr>';
        },

        attachmentRowBlk : function() {
            return '<tr>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '</tr>';
        }
    });

    new ArticleEditController('div[data-page]');

    /*ColumnEditController.include({

        Model : ColumnEntity,

        elements : {
            //标题
            'h3.page-title > span:first' : 't',
            //导航
            'ul.breadcrumb' : 'navContainer',
            //标题
            'input[data-field="title"]' : 'title',
            //描述
            'textarea[data-field="description"]' : 'description'
        },

        events : {
            'click a[data-parentId]' : 'navClick'
        },

        blocks : {
            'navBlk' : 'navEl'
        },

        config : {
            getInfo : {
                path : 'column/getColumn',
                params : {
                    columnId : 0
                },
                callback : 'getInfoResult'
            }
        },

        vaildRole : {
            title : [['required', '请输入栏目标题！'],
                ['maxlength', '栏目标题不能超过15个字！', 15]],
            description : [['maxlength', '描述不能超过140个字！', 140]]
        },

        submitConfig : {
            addConfigPath : 'column/addColumn',
            updateConfigPath : 'column/updateColumn'
        },

        level : [],

        load : function() {
            this.info = new ColumnEntity();
            this.info.loadSession('rowInfo');
            this.info.removeSession('rowInfo');

            this.renderNav();

            if(this.info.id) {
                this.config.getInfo.params.columnId = this.info.id;
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
            this.component('saveSession', ['level', this.level]);
        },

        backClick : function() {
            this.component('saveSession', ['level', this.level]);
            indexCtrl.loadPage('column/index.html');
        },

        navBlk : function() {
            return '<li><i class="fa"></i></li>';
        }

    });

    new ColumnEditController('div[data-page]');*/

})();