(function() {

    var sepa = org.eocencle.sepa;

    var Article = sepa.EntitiesManager.find('Article');

    var ArticleEntity = new sepa.Class([Article.model, sepa.Model]);

    var ArticleEditController = new sepa.Class([sepa.Controller, sepa.CRemote, sepa.CElement, sepa.CDomRenderRole,
        sepa.CVaildate, sepa.CCombVaildate, this.mimosa.EditTemplate, sepa.CStorage]);

    ArticleEditController.include({

        Model : ArticleEntity,

        elements : {
            //页面状态
            'h3.page-title > span:first' : 'pageTitle',
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
            'click #attachmentModal tr' : 'attachmentSelClick'
        },

        blocks : {
            'soundRowBlk' : 'soundRowEl',
            'attachmentRowBlk' : 'attachmentRowEl'
        },

        config : {
            getInfo : {
                path : 'article/getArticle',
                params : {
                    articleId : 0
                }
            },
            getThumbnailAlbumList : {
                path : 'resource/getResourceAlbumList',
                params : {
                    resourceType : 'image'
                },
                callback : 'getThumbnailAlbumListResult'
            },
            getThumbnailList : {
                path : 'resource/getResourceList',
                params : {
                    albumId : ''
                },
                callback : 'getThumbnailListResult'
            },
            getImageAlbumList : {
                path : 'resource/getResourceAlbumList',
                params : {
                    resourceType : 'image'
                },
                callback : 'getImageAlbumListResult'
            },
            getImageList : {
                path : 'resource/getResourceList',
                params : {
                    albumId : ''
                },
                callback : 'getImageListResult'
            },
            getSoundAlbumList : {
                path : 'resource/getResourceAlbumList',
                params : {
                    resourceType : 'sound'
                },
                callback : 'getSoundAlbumListResult'
            },
            getSoundList : {
                path : 'resource/getResourceList',
                params : {
                    albumId : ''
                },
                callback : 'getSoundListResult'
            },
            getVideoAlbumList : {
                path : 'resource/getResourceAlbumList',
                params : {
                    resourceType : 'video'
                },
                callback : 'getVideoAlbumListResult'
            },
            getVideoList : {
                path : 'resource/getResourceList',
                params : {
                    albumId : ''
                },
                callback : 'getVideoListResult'
            },
            getAttachmentAlbumList : {
                path : 'resource/getResourceAlbumList',
                params : {
                    resourceType : 'attachment'
                },
                callback : 'getAttachmentAlbumListResult'
            },
            getAttachmentList : {
                path : 'resource/getResourceList',
                params : {
                    albumId : ''
                },
                callback : 'getAttachmentListResult'
            }
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

        submitConfig : {
            addConfigPath : 'article/addArticle',
            updateConfigPath : 'article/updateArticle'
        },

        load : function() {
            //初始化富文本编辑器
            //this.ueditor = UE.getEditor('container');

            this.info = new ArticleEntity();
            this.info.loadSession('rowInfo');
            this.info.removeSession('rowInfo');

            if (this.info.id) {
                this.pageTitle.text('编辑');
                this.config.getInfo.params.articeId = this.info.id;
                this.loadInfo();
            } else {
                this.pageTitle.text('添加');
            }

            this.component('remote', ['getThumbnailAlbumList']);
            this.component('remote', ['getImageAlbumList']);
            this.component('remote', ['getSoundAlbumList']);
            this.component('remote', ['getVideoAlbumList']);
            this.component('remote', ['getAttachmentAlbumList']);
        },

        replaceRender : function(fieldName, fieldValue) {
            if('examineCommont' == fieldName) {
                if($.trim(fieldValue)) {
                    this.$('span[data-field="examineCommont"]').parents('div.row-fluid').removeClass('hide');
                }
            }
            return fieldValue;
        },

        //缩略图
        getThumbnailAlbumListResult : function(result) {
            if(!result.errCode) {
                var $thumbnailSelect = this.thumbnailModal.find('select');
                for(var i in result.data.list) {
                    var $option = this.component('element', ['option']).clone();
                    $option.val(result.data.list[i].id).text(result.data.list[i].name);
                    $thumbnailSelect.append($option.clone());
                }

                this.thumbnailSelAlbumChange();
            } else {
                console.error(result.errMsg);
            }
        },

        thumbnailSelAlbumChange : function() {
            this.config.getThumbnailList.params.albumId = this.thumbnailSelAlbum.val();
            this.component('remote', ['getThumbnailList']);
        },

        getThumbnailListResult : function(result) {
            if(!result.errCode) {
                var $thumbnailList = this.thumbnailModal.find('div.modal-body');

                $thumbnailList.empty();
                for(var i in result.data.list) {
                    var $el = this.component('element', ['img']).clone();
                    $el.attr('src', result.data.list[i].path).attr('width', '24%').attr('height', '120');
                    $thumbnailList.append($el);
                }
            } else {
                console.error(result.errMsg);
            }
        },

        thumbnailSelClick : function(event) {
            var path = this.$(event.target).attr('src');
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
            if(!result.errCode) {
                var $imageSelect = this.imageModal.find('select');
                for(var i in result.data.list) {
                    var $option = this.component('element', ['option']).clone();
                    $option.val(result.data.list[i].id).text(result.data.list[i].name);
                    $imageSelect.append($option.clone());
                }

                this.imageSelAlbumChange();
            } else {
                console.error(result.errMsg);
            }
        },

        imageSelAlbumChange : function(event) {
            this.config.getImageList.params.albumId = this.imageSelAlbum.val();
            this.component('remote', ['getImageList']);
        },

        getImageListResult : function(result) {
            if(!result.errCode) {
                var $imageList = this.imageModal.find('div.modal-body');

                $imageList.empty();
                for(var i in result.data.list) {
                    var $el = this.component('element', ['img']).clone();
                    $el.attr('src', result.data.list[i].path).attr('width', '24%').attr('height', '120');
                    $imageList.append($el);
                }
            } else {
                console.error(result.errMsg);
            }
        },

        imageSelClick : function(event) {
            this.ueditor.execCommand('insertHtml', '<img src="' + this.$(event.target).attr('src') + '"/>');
            this.imageModal.modal('hide');
        },

        //音频
        getSoundAlbumListResult : function(result) {
            if(!result.errCode) {
                var $soundSelect = this.soundModal.find('select');
                for(var i in result.data.list) {
                    var $option = this.component('element', ['option']).clone();
                    $option.val(result.data.list[i].id).text(result.data.list[i].name);
                    $soundSelect.append($option.clone());
                }

                this.soundSelAlbumChange();
            } else {
                console.error(result.errMsg);
            }
        },

        soundSelAlbumChange : function() {
            this.config.getSoundList.params.albumId = this.soundSelAlbum.val();
            this.component('remote', ['getSoundList']);
        },

        getSoundListResult : function(result) {
            if(!result.errCode) {
                var $soundList = this.soundModal.find('tbody');

                $soundList.empty();
                for(var i in result.data.list) {
                    var $row = this.soundRowEl.clone();
                    $row.children(':first').text(result.data.list[i].id);
                    $row.children(':eq(1)').text(result.data.list[i].description);
                    $row.find('source').attr('src', result.data.list[i].path);
                    $soundList.append($row);
                }
            } else {
                console.error(result.errMsg);
            }
        },

        soundSelClick : function(event) {
            var path = this.$(event.target).parent('tr').find('source').attr('src');
            this.ueditor.execCommand('insertHtml', '<audio controls><source src="' + path + '" type="audio/mpeg"></audio>');
            this.soundModal.modal('hide');
        },

        //视频
        getVideoAlbumListResult : function(result) {
            if(!result.errCode) {
                var $videoSelect = this.videoModal.find('select');
                for(var i in result.data.list) {
                    var $option = this.component('element', ['option']).clone();
                    $option.val(result.data.list[i].id).text(result.data.list[i].name);
                    $videoSelect.append($option.clone());
                }

                this.videoSelAlbumChange();
            } else {
                console.error(result.errMsg);
            }
        },

        videoSelAlbumChange : function() {
            this.config.getVideoList.params.albumId = this.videoSelAlbum.val();
            this.component('remote', ['getVideoList']);
        },

        getVideoListResult : function(result) {
            if(!result.errCode) {
                var $videoList = this.videoModal.find('div.modal-body');

                $videoList.empty();
                for(var i in result.data.list) {
                    var $el = $('<a><video controls width="24%" height="120" src=""></video></a>');
                    $el.find('video').attr('src', result.data.list[i].path);
                    $videoList.append($el);
                }
            } else {
                console.error(result.errMsg);
            }
        },

        videoSelClick : function(event) {
            var path = this.$(event.target).attr('src');
            this.ueditor.execCommand('insertHtml', '<video controls src="' + path + '"></video></a>');
            this.videoModal.modal('hide');
        },

        //附件
        getAttachmentAlbumListResult : function(result) {
            if(!result.errCode) {
                var $attachmentSelect = this.attachmentModal.find('select');
                for(var i in result.data.list) {
                    var $option = this.component('element', ['option']).clone();
                    $option.val(result.data.list[i].id).text(result.data.list[i].name);
                    $attachmentSelect.append($option.clone());
                }

                this.attachmentSelAlbumChange();
            } else {
                console.error(result.errMsg);
            }
        },

        attachmentSelAlbumChange : function() {
            this.config.getAttachmentList.params.albumId = this.attachmentSelAlbum.val();
            this.component('remote', ['getAttachmentList']);
        },

        getAttachmentListResult : function(result) {
            if(!result.errCode) {
                var $attachmentList = this.attachmentModal.find('tbody');

                $attachmentList.empty();
                for(var i in result.data.list) {
                    var $row = this.soundRowEl.clone();
                    $row.children(':eq(0)').text(result.data.list[i].id);
                    $row.children(':eq(1)').text(result.data.list[i].name);
                    $row.children(':eq(2)').text(result.data.list[i].description);
                    $attachmentList.append($row);
                }
            } else {
                console.error(result.errMsg);
            }
        },

        attachmentSelClick : function(event) {
            var $row = this.$(event.target).parent('tr');
            var id = $row.children(':eq(0)').text();
            var description = $row.children(':eq(2)').text();
            var a = '<a href="resource/downloadResource?resourceId=' + id + '">' + description + '</a>';
            this.ueditor.execCommand('insertHtml', a);
            this.attachmentModal.modal('hide');
        },

        submitBefore : function(info, event) {
            //info.content = this.articleType == 2 ? this.ueditor.getContentTxt() : this.ueditor.getContent();

            var $el = this.$(event.target)[0].tagName == 'BUTTON' ? this.$(event.target) :
                this.$(event.target).parent('button');
            info.status = $el.data('status');
        },

        backClick : function() {
            indexCtrl.loadPage('article/index.html');
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

})();