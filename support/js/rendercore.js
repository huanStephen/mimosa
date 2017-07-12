(function() {

    var sepa = org.eocencle.sepa;

    var Page = sepa.EntitiesManager.find('Page');

    var PageEntity = new sepa.Class([Page.model, sepa.Model]);

    var PagePlaceholder = sepa.EntitiesManager.find('PagePlaceholder');

    var PagePlaceholderEntity = new sepa.Class([PagePlaceholder.model, sepa.Model]);

    var CoreCtrl = new sepa.Class([sepa.Controller, sepa.CRemote, sepa.CElement, sepa.CPage]);

    CoreCtrl.include({
        //页面
        _pages : {},

        //占位符
        _placeholders : {},

        //数据模块
        _entities : {},

        //页面加载成功
        _pageLoadSuccess : 0x01,
        //页面数据加载成功
        _pageDataLoadSuccess : 0x02,
        //页面状态
        _pageState : 0,

        //资源类型
        _resType : {
            COLUMN : 'column',
            ARTICLE : 'article',
            IMAGE : 'image',
            SOUND : 'sound',
            VIDEO : 'video',
            ATTACHMENT : 'attachment',
            PAGE : 'page'
        },

        //页面详细配置
        _pageDetailConfig : {
            type : 'single'   //single：单独hash, params: 有参hash
        },

        //占位符详细配置
        _placeholderDetailConfig : {
            //渲染
            render : {
                //使用append方式添加的元素列表
                apdArr : [],
                //属性
                attrs : {
                    //image : ['alt', 'data-name']
                },
                //仅取字段
                only : [],
                //忽略取值字段
                ignore : [],
                //进入页面hash
                entry : {
                    //detail : 'post'
                },
                //拦截器
                filter : {

                },
                //显示条数
                size : 0,
                //分页配置
                page : {
                    //是否开启分页
                    isOpen : false,
                    //分页类型
                    type : 'block',
                    //块数
                    block : 5,
                    //分页容器
                    container : '',
                    btnFontPos : 'a',
                    btns : {
                        prevBtn : 'prevBtnEl',
                        nextBtn : 'nextBtnEl',
                        actBtn : 'actBtnEl',
                        pageBtn : 'pageBtnEl',
                        moitBtn : 'moitBtnEl'
                    },
                    methods : {
                        prevMethod : 'pervClick',
                        nextMethod : 'nextClick',
                        pageMethod : 'pageClick'
                    },
                    //当前页
                    currPage : 1,
                    //总页数
                    totalPage : 1
                }
            }
        },

        elements : {
            '*[data-container]' : 'pageContainer'
        },

        events : {
            //非A标签跳转
            'click *[data-hpath]' : 'noAEntryClick'
        },

        blocks : {
            'prevBtnBlk' : 'prevBtnEl',
            'nextBtnBlk' : 'nextBtnEl',
            'actBtnBlk' : 'actBtnEl',
            'pageBtnBlk' : 'pageBtnEl',
            'moitBtnBlk' : 'moitBtnEl'
        },

        config : {
            getPageList : {
                path : 'page/getPageList',
                callback : 'getPageListResult'
            },
            getPagePlaceholderList : {
                path : 'page/getPagePlaceholderList',
                params : {
                    pageId : 0
                },
                callback : 'getPagePlaceholderListResult'
            },
            getPlaceholderData : {
                path : '',
                params : {},
                callback : 'getPlaceholderDataResult'
            }
        },

        load : function() {
            this.component('remote', ['getPageList']);
        },

        /**
         * 获取页面结果
         * @param result
         */
        getPageListResult : function(result) {
            if(!result.resultCode) {
                PageEntity.populate(result.data.list);
                this.parsePage();
            } else {
                console.error(result.resultMsg);
            }
        },

        /**
         * 解析页面
         */
        parsePage : function() {
            for(var i in this._pages) delete this._pages[i];

            if(PageEntity.count()) {
                var list = PageEntity.all();

                for(var i in list) {
                    list.detailConfig = $.extend(true, this._pageDetailConfig,
                        $.trim(list[i].detailConfig) ? eval('(' + list[i].detailConfig + ')') : {});
                    this._pages[list[i].hashIndex] = list[i];
                }

                this.hashChange();
            } else {
                console.error('没有任何页面！');
            }
        },

        /**
         * hash改变事件
         */
        hashChange : function() {
            var hash = location.hash.slice(1);
            if(hash) this.loadPage(hash);
            else this.loadPage('home');
        },

        /**
         * 加载页面
         */
        loadPage : function(hash) {
            //清空所有实例
            for(var i in this._entities) {
                delete this._entities[i];
            }
            //初始化页面状态
            this._pageState = 0;

            var hashArr = hash.split('/');
            if(this._pages[hashArr[0]]) {
                if(this._pages[hashArr[0]].detailConfig == 'single') {
                    if(hashArr.length != 1) {
                        throw('Page\'s detailConfig exception!');
                    }
                } else if(this._pages[hashArr[0]].detailConfig == 'params') {
                    if(hashArr.length == 1) {
                        throw('Page\'s detailConfig exception!');
                    }
                }
            } else {
                throw('Page not found!');
            }

            //加载页面
            this.pageContainer.load(this._pages[hashArr[0]].templateName, this.proxy(this.loadPageResult));
            //加载数据
            this.config.getPagePlaceholderList.params.pageId = this._pages[hashArr[0]].id;
            this.component('remote', ['getPagePlaceholderList']);
        },

        /**
         * 页面加载成功
         */
        loadPageResult : function(response,status,xhr) {
            if(status == 'success') {
                this._pageState |= this._pageLoadSuccess;
                this.pageRender();
            }
        },

        /**
         * 根据页面ID获取页面占位符
         */
        getPagePlaceholderListResult : function(result) {
            if(!result.resultCode) {
                PagePlaceholderEntity.populate(result.data.list);
                this.loadPlaceholder();
            } else {
                console.error(result.resultMsg);
            }
        },

        /**
         * 加载占位符
         */
        loadPlaceholder : function() {
            for(var i in this._placeholders) delete this._placeholders[i];

            if(PagePlaceholderEntity.count()) {
                var list = PagePlaceholderEntity.all();
                for(var i in list) {
                    list[i].detailConfig = $.extend(true, this._placeholderDetailConfig,
                        $.trim(list[i].detailConfig) ? eval('(' + list[i].detailConfig + ')') : {});
                    this._placeholders[list[i].index] = list[i];
                }
                this.loadPlaceholderData();
            } else {
                console.error('没有任何占位符！');
            }
        },

        /**
         * 加载占位符数据
         */
        loadPlaceholderData : function() {
            var list = PagePlaceholderEntity.all();
            this.placeholderLoadComplateSize = PagePlaceholderEntity.count();

            var id = location.hash.slice(1).split('/')[1];
            for(var i in list) {
                if(this._resType.COLUMN == list[i].resourceType) {
                    this.loadColumnList(list[i].index, list[i].groupId, id);
                }
                if(this._resType.ARTICLE == list[i].resourceType) {
                    this.loadArticleList(list[i].index, list[i].groupId, id);
                }
                if(this._resType.IMAGE == list[i].resourceType || this._resType.SOUND == list[i].resourceType ||
                    this._resType.VIDEO == list[i].resourceType || this._resType.ATTACHMENT == list[i].resourceType) {
                    this.loadResourceList(list[i].index, list[i].groupId, id);
                }
                if(this._resType.PAGE == list[i].resourceType) {
                    this.loadPageList(list[i].index, list[i].groupId, id);
                }

                this.config.getPlaceholderData.params.index = list[i].index;
                this.component('remote', ['getPlaceholderData']);
            }
        },

        /**
         * 获取栏目列表
         * @param index 索引值
         * @param parentId  父栏目ID
         * @param columnId  栏目ID
         */
        loadColumnList : function(index, parentId, columnId) {
            if(!this._entities[index]) {
                var Column = sepa.EntitiesManager.find('Column');
                this._entities[list[i].index] = new sepa.Class([Column.model, sepa.Model]);
            }

            this.config.getPlaceholderData.path = 'column/getColumnList';
            this.config.getPlaceholderData.params.parentId = groupId;
            this.config.getPlaceholderData.params.columnId = columnId;
        },

        /**
         * 获取文章列表
         * @param index 索引值
         * @param columnId  栏目ID
         * @param articleId 文章ID
         */
        loadArticleList : function(index, columnId, articleId) {
            if(!this._entities[index]) {
                var Article = sepa.EntitiesManager.find('Article');
                this._entities[index] = new sepa.Class([Article.model, sepa.Model]);
            }

            this.config.getPlaceholderData.path = 'article/getArticleList';
            this.config.getPlaceholderData.params.columnId = columnId;
            this.config.getPlaceholderData.params.articleId = articleId;
        },

        /**
         * 获取资源列表
         * @param index 索引值
         * @param albumId   栏目ID
         * @param resourceId    资源ID
         */
        loadResourceList : function(index, albumId, resourceId) {
            if(!this._entities[index]) {
                var Resource = sepa.EntitiesManager.find('Resource');
                this._entities[index] = new sepa.Class([Resource.model, sepa.Model]);
            }

            this.config.getPlaceholderData.path = 'resource/getResourceList';
            this.config.getPlaceholderData.params.albumId = albumId;
            this.config.getPlaceholderData.params.resourceId = resourceId;
        },

        /**
         * 获取页面列表
         * @param index 索引值
         * @param pageId    页面ID
         */
        loadPageList : function(index, pageId) {
            if(!this._entities[index]) {
                var Page = sepa.EntitiesManager.find('Page');
                this._entities[index] = new sepa.Class([Page.model, sepa.Model]);
            }

            this.config.getPlaceholderData.path = 'page/getPageList';
            this.config.getPlaceholderData.params.pageId = articleId;
        },

        /**
         * 加载占位符数据结果
         */
        getPlaceholderDataResult : function(result) {
            if(!result.resultCode) {
                // 将结果保存在相同hash名的实体类里
                this._entities[result.data.index].populate(result.data.list);
                // 判断是否有分页，如果有将保存当前页和总页数
                if (this._placeholders[result.data.index].detailConfig.render.page.isOpen) {
                    this._placeholders[result.data.index].detailConfig.render.page.currPage = result.data.currPage;
                    this._placeholders[result.data.index].detailConfig.render.page.totalPage = result.data.totalPage;
                }
                if(-- this.placeholderLoadComplateSize == 0) {
                    this._pageState |= this._pageDataLoadSuccess;
                    this.pageRender();
                }
            } else {
                console.error(result.resultMsg);
            }
        },

        /**
         * 页面渲染
         */
        pageRender : function() {
            //验证页面和数据都已加载完毕
            if(this._pageState & this._pageLoadSuccess && this._pageState & this._pageDataLoadSuccess) {
                /**
                 * 1、根据index找到容器
                 * 2、找到容器里的克隆元素，复制并存储
                 * 3、删除容器中的克隆元素
                 * 4、提取存储中的元素并进行渲染
                 * 5、追加到容器中
                 */
                for(var i in this._placeholders) {
                    var placeholder = this._placeholders[i];

                    //渲染变量
                    var render = placeholder.detailConfig.render;

                    //是否开启分页
                    if(render.page.isOpen) {
                        //如果有容器则使用该容器，否则使用默认容器
                        if(!$.trim(render.page.container)) {
                            render.page.container = '*[data-index="' + i + '-page"]';
                        }
                        this.config[i + 'Page'] = $.extend(true, {}, render.page);
                        this.component('openPage', [i + 'Page']);

                        this.show(render.page.currPage, render.page.totalPage);
                    }

                    var $container = this.$('*[data-index=' + i + ']');

                    var $clone = $container.children('*[data-clone]');
                    var $row = $clone.clone();

                    $clone.remove();

                    var list = this._entities[i].all();
                    for(var j in list) {
                        var data = list[j];
                        var $r = $row.clone();

                        //遍历元素字段
                        $r.find('*[data-field]').each(this.proxy(function(idx, el) {
                            var $el = this.$(el);
                            var fieldName = $el.data('field');

                            //数据非空判断
                            if(data[fieldName]) {
                                //append属性判断
                                if(this.contains(render.apdArr, fieldName)) {
                                    $el.append(data[fieldName]);
                                } else {
                                    $el.text(data[fieldName]);
                                }

                                var attrs = render.attrs[fieldName];
                                for(var i in attrs) {
                                    $el.attr(attrs[i], data[fieldName]);
                                }
                            }
                        }));

                        //遍历进入标记
                        $r.find('*[data-entry]').each(this.proxy(function(idx, el) {
                            var $el = this.$(el);
                            var flag = $el.data('entry');

                            var hash = render.entry[flag];
                            if(hash) {
                                var path = hash + '/' + data.id;
                                var tagName = el.tagName;

                                if(tagName == 'A') {
                                    $el.attr('href', '#' + path);
                                } else {
                                    $el.attr('data-hpath', path);
                                }
                            }
                        }));

                        $container.append($r);
                    }

                }
            }
        },

        //数组查询对象是否存在
        contains : function(arr, obj) {
            var len = arr.length;
            while(len--) {
                if(arr[len] == obj) {
                    return true;
                }
            }
            return false;
        },

        //非A标签跳转
        noAEntryClick : function(event) {
            var path = this.$(event.target).data('hpath');
            location.hash = path;
        },


        //分页内容
        prevBtnBlk : function() {
            var li = this.component('element', ['li']).addClass('prev').css({'float':'left', 'list-style-type':'none', 'width':'40px'});
            var a = this.component('element', ['a']).attr('href', 'javascript:void(0);').append('&lt;');
            li.append(a);
            return li;
        },

        nextBtnBlk : function() {
            var li = this.component('element', ['li']).addClass('next').css({'float':'left', 'list-style-type':'none', 'width':'40px'});
            var a = this.component('element', ['a']).attr('href', 'javascript:void(0);').append('&gt;');
            li.append(a);
            return li;
        },

        actBtnBlk : function() {
            var li = this.component('element', ['li']).css({'float':'left', 'list-style-type':'none', 'width':'40px'});
            var a = this.component('element', ['a']).attr('href', 'javascript:void(0);').addClass('current');
            li.append(a);
            return li;
        },

        pageBtnBlk : function() {
            var li = this.component('element', ['li']).addClass('num').css({'float':'left', 'list-style-type':'none', 'width':'40px'});
            var a = this.component('element', ['a']).attr('href', 'javascript:void(0);');
            li.append(a);
            return li;
        },

        moitBtnBlk : function() {
            return this.component('element', ['li']).text(' ... ').css({'float':'left', 'list-style-type':'none', 'width':'40px'});
        },

        show : function(currPage, totalPage) {
            this.component('paginate', [currPage, totalPage]);
        },

        pervClick : function(event) {
            var $el = this.$(event.target);
            var index = $el.parents('*[data-index]').data('index').split('-')[0];
            var currPage = this._placeholders[index].detailConfig.render.page.currPage;
            var totalPage = this._placeholders[index].detailConfig.render.page.totalPage;
            this.show(currPage - 1, totalPage);
        },

        nextClick : function(event) {
            var $el = this.$(event.target);
            var index = $el.parents('*[data-index]').data('index').split('-')[0];
            var currPage = this._placeholders[index].detailConfig.render.page.currPage;
            var totalPage = this._placeholders[index].detailConfig.render.page.totalPage;
            this.show(currPage + 1, totalPage);
        },

        pageClick : function(event) {
            var $el = this.$(event.target);
            var index = $el.parents('*[data-index]').data('index').split('-')[0];
            var currPage = this._placeholders[index].detailConfig.render.page.currPage;
            var totalPage = this._placeholders[index].detailConfig.render.page.totalPage;
            this.show(parseInt($el.text()), totalPage);
        }

    });

    new CoreCtrl('body');

})();