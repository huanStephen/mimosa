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

        //当前占位符信息
        _placeholders : {},

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

        // hash参数
        _hashParams : [],

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
                path : 'resource/getPlaceholderData',
                params : {
                    id : 0,
                    paramsArr : []
                },
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
            for(var i in this._pages) {
                delete this._pages[i];
            }

            if(PageEntity.count()) {
                var list = PageEntity.all();

                list.forEach(this.proxy(function(val, idx, arr) {
                    val.detailConfig = $.extend(true, this._pageDetailConfig,
                        $.trim(val.detailConfig) ? eval('(' + val.detailConfig + ')') : {});
                    this._pages[val.hashIndex] = val;
                }));

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
         * 清空占位符相关信息
         */
        cleanPlaceholders : function() {
            for(var i in this._placeholders)
                delete this._placeholders[i];
        },

        /**
         * 清理分页配置
         */
        cleanPageConfigs : function() {
            var regex = /^([\s\S]*?)Page$/;
            for (var i in this.config) {
                if (regex.test(i)) {
                    delete this.config[i];
                }
            }
        },

        /**
         * 加载页面
         */
        loadPage : function(hash) {
            this.cleanPlaceholders();
            this.cleanPageConfigs();

            //初始化页面状态
            this._pageState = 0;

            var hashArr = hash.split('/');
            if(this._pages[hashArr[0]]) {
                if(this._pages[hashArr[0]].detailConfig == 'single') {
                    if(hashArr.length != 1) {
                        throw('Page\'s detailConfig exception!');
                    } else {
                        this._hashParams = null;
                    }
                } else if(this._pages[hashArr[0]].detailConfig == 'params') {
                    if(hashArr.length == 1) {
                        throw('Page\'s detailConfig exception!');
                    } else {
                        this._hashParams = hashArr.slice(1);
                    }
                }
            } else {
                throw('Page not found!');
            }

            //加载页面
            this.pageContainer.load(this._pages[hashArr[0]].templateName, {index : hashArr[0]},
                this.proxy(this.loadPageResult));
        },

        /**
         * 页面加载成功
         */
        loadPageResult : function(response, status, xhr) {
            if(status == 'success') {
                var index = 'home';
                if (location.hash) {
                    index = location.hash.slice(1).split('/')[0];
                }
                //加载数据
                this.config.getPagePlaceholderList.params.pageId = this._pages[index].id;
                this.component('remote', ['getPagePlaceholderList']);
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
            if(PagePlaceholderEntity.count()) {
                var list = PagePlaceholderEntity.all();
                this.placeholderLoadComplateSize = 0;
                list.forEach(this.proxy(function(val, idx, arr) {
                    // 添加占位符位
                    this._placeholders[val.index] = {};

                    // 解析占位符详细配置
                    val.detailConfig = $.extend(true, this._placeholderDetailConfig,
                        $.trim(val.detailConfig) ? eval('(' + val.detailConfig + ')') : {});

                    // 添加占位符
                    this._placeholders[val.index].placeholder = val;

                    // 添加数据模型
                    var baseModel = null;
                    if (this._resType.COLUMN == val.resourceType) {
                        baseModel = sepa.EntitiesManager.find('Column');
                    }
                    if (this._resType.ARTICLE == val.resourceType) {
                        baseModel = sepa.EntitiesManager.find('Article');
                    }
                    if (this._resType.IMAGE == val.resourceType ||
                        this._resType.SOUND == val.resourceType ||
                        this._resType.VIDEO == val.resourceType ||
                        this._resType.ATTACHMENT == val.resourceType) {
                        baseModel = sepa.EntitiesManager.find('Resource');
                    }

                    if (null == baseModel) {
                        throw('The placeholder entity model failed to load!');
                    }
                    this._placeholders[val.index].entities = new sepa.Class([baseModel.model, sepa.Model]);

                    // 判断是否分页
                    var render = this._placeholders[val.index].placeholder.detailConfig.render;

                    if (render.page.isOpen) {
                        //如果有容器则使用该容器，否则使用默认容器
                        if (!$.trim(render.page.container)) {
                            render.page.container = '*[data-index="' + val.index + '-page"]';
                        }
                        this.config[val.index + 'Page'] = $.extend(true, {}, render.page);
                        this.component('openPage', [val.index + 'Page']);
                    }

                    this.loadPlaceholderData(val.id, this._hashParams);
                }));

            } else {
                console.error('没有任何占位符！');
            }
        },

        /**
         * 加载占位符数据
         */
        loadPlaceholderData : function(placeholderId, paramsArr) {
            this.config.getPlaceholderData.params.id = placeholderId;
            this.config.getPlaceholderData.params.paramsArr = paramsArr;
            this.component('remote', ['getPlaceholderData']);
        },

        /**
         * 加载占位符数据结果
         */
        getPlaceholderDataResult : function(result) {
            if(!result.resultCode) {
                // 将结果保存在相同hash名的实体类里
                this._placeholders[result.data.index].entities.populate(result.data.list);
                // 判断是否有分页，如果有将保存当前页和总页数
                var render = this._placeholders[result.data.index].placeholder.detailConfig.render;
                if (render.page.isOpen) {
                    render.page.currPage = result.data.currPage;
                    render.page.totalPage = result.data.totalPage;
                }
                this.pageRender(result.data.index);
            } else {
                console.error(result.resultMsg);
            }
        },

        /**
         * 页面渲染
         */
        pageRender : function(index) {
            /**
             * 1、根据index找到容器
             * 2、找到容器里的克隆元素，复制并存储
             * 3、删除容器中的克隆元素
             * 4、提取存储中的元素并进行渲染
             * 5、追加到容器中
             */
            if (this._placeholders[index]) {
                var placeholder = this._placeholders[index].placeholder;

                //渲染变量
                var render = placeholder.detailConfig.render;

                var $container = this.$('*[data-index=' + index + ']');

                var $clone = $container.children('*[data-clone]:first');
                var $row = $clone.clone();

                $container.empty();

                var list = this._placeholders[index].entities.all();
                list.forEach(this.proxy(function(val, idx, arr) {
                    var data = val;
                    var $r = $row.clone();

                    //遍历元素字段
                    $r.find('*[data-field]').each(this.proxy(function(idx, el) {
                        var $el = this.$(el);
                        var fieldName = $el.data('field');

                        //数据非空判断
                        if (data[fieldName]) {
                            //append属性判断
                            if (this.contains(render.apdArr, fieldName)) {
                                $el.append(data[fieldName]);
                            } else {
                                $el.text(data[fieldName]);
                            }

                            var attrs = render.attrs[fieldName];
                            for (var i in attrs) {
                                $el.attr(attrs[i], data[fieldName]);
                            }
                        }
                    }));

                    //遍历进入标记
                    $r.find('*[data-entry]').each(this.proxy(function (idx, el) {
                        var $el = this.$(el);
                        var flag = $el.data('entry');

                        var hash = render.entry[flag];
                        if (hash) {
                            var path = hash + '/' + data.id;
                            var tagName = el.tagName;

                            if (tagName == 'A') {
                                $el.attr('href', '#' + path);
                            } else {
                                $el.attr('data-hpath', path);
                            }
                        }
                    }));

                    $container.append($r);
                }));

                if (render.page.isOpen) {
                    this.showPage(index, render.page.currPage, render.page.totalPage);
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

        showPage : function(index, currPage, totalPage) {
            this.component('paginate', [currPage, totalPage]);
        },

        pervClick : function(event) {
            var $el = this.$(event.target);
            var index = $el.parents('*[data-index]').data('index').split('-')[0];
            var placeholder = this._placeholders[index].placeholder;
            placeholder.detailConfig.render.page.currPage -= 1;

            var params = this._hashParams.concat();
            if (!params) {
                params = new Array();
            }
            params.push(placeholder.detailConfig.render.page.currPage);
            this.loadPlaceholderData(placeholder.id, params);
        },

        nextClick : function(event) {
            var $el = this.$(event.target);
            var index = $el.parents('*[data-index]').data('index').split('-')[0];
            var placeholder = this._placeholders[index].placeholder;
            placeholder.detailConfig.render.page.currPage += 1;

            var params = this._hashParams.concat();
            if (!params) {
                params = new Array();
            }
            params.push(placeholder.detailConfig.render.page.currPage);
            this.loadPlaceholderData(placeholder.id, params);
        },

        pageClick : function(event) {
            var $el = this.$(event.target);
            var index = $el.parents('*[data-index]').data('index').split('-')[0];
            var placeholder = this._placeholders[index].placeholder;
            placeholder.detailConfig.render.page.currPage = parseInt($el.text());

            var params = this._hashParams.concat();
            if (!params) {
                params = new Array();
            }
            params.push(placeholder.detailConfig.render.page.currPage);
            this.loadPlaceholderData(placeholder.id, params);
        }

    });

    new CoreCtrl('body');

})();