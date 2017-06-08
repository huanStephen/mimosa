(function() {

    var sepa = org.eocencle.sepa;

    var Page = sepa.EntitiesManager.find('Page');

    var PageEntity = new sepa.Class([Page.model, sepa.Model]);

    var PagePlaceholder = sepa.EntitiesManager.find('PagePlaceholder');

    var PagePlaceholderEntity = new sepa.Class([PagePlaceholder.model, sepa.Model]);

    var CoreCtrl = new sepa.Class([sepa.Controller, sepa.CRemote, sepa.CElement]);

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
            ATTACHMENT : 'attachment'
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
                //拦截器
                filter : {

                },
                //分页配置
                page : {
                    //是否开启分页
                    isOpen : false
                }
            }
        },

        elements : {
            '*[data-container]' : 'pageContainer'
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
            //加载页面
            this.pageContainer.load(this._pages[hash].templateName, this.proxy(this.loadPageResult));
            //加载数据
            this.config.getPagePlaceholderList.params.pageId = this._pages[hash].id;
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
                    list[i].detailConfig = $.extend(true, this._placeholderDetailConfig, eval('(' + list[i].detailConfig + ')'));
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
            for(var i in list) {
                if(this._resType.COLUMN == list[i].resourceType) {
                    var Column = sepa.EntitiesManager.find('Column');
                    this._entities[list[i].index] = new sepa.Class([Column.model, sepa.Model]);

                    this.config.getPlaceholderData.path = 'column/getColumnList';
                    this.config.getPlaceholderData.params.parentId = list[i].groupId;
                }
                if(this._resType.ARTICLE == list[i].resourceType) {
                    var Article = sepa.EntitiesManager.find('Article');
                    this._entities[list[i].index] = new sepa.Class([Article.model, sepa.Model]);

                    this.config.getPlaceholderData.path = 'article/getArticleList';
                    this.config.getPlaceholderData.params.columnId = list[i].groupId;
                }
                if(this._resType.IMAGE == list[i].resourceType || this._resType.SOUND == list[i].resourceType ||
                    this._resType.VIDEO == list[i].resourceType || this._resType.ATTACHMENT == list[i].resourceType) {
                    var Resource = sepa.EntitiesManager.find('Resource');
                    this._entities[list[i].index] = new sepa.Class([Resource.model, sepa.Model]);

                    this.config.getPlaceholderData.path = 'resource/getResourceList';
                    this.config.getPlaceholderData.params.albumId = list[i].groupId;
                }

                this.config.getPlaceholderData.params.index = list[i].index;
                this.component('remote', ['getPlaceholderData']);
            }
        },

        /**
         * 加载占位符数据结果
         */
        getPlaceholderDataResult : function(result) {
            if(!result.resultCode) {
                this._entities[result.data.index].populate(result.data.list);
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
                                if(this.contains(placeholder.detailConfig.render.apdArr, fieldName)) {
                                    $el.append(data[fieldName]);
                                } else {
                                    $el.text(data[fieldName]);
                                }

                                var attrs = placeholder.detailConfig.render.attrs[fieldName];
                                for(var i in attrs) {
                                    $el.attr(attrs[i], data[fieldName]);
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
        }

    });

    new CoreCtrl('body');

})();