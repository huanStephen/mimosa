(function() {

    var sepa = org.eocencle.sepa;

    var IndexController = new sepa.Class([sepa.Controller, sepa.CElement]);

    IndexController.include({

        elements : {
            //菜单容器
            'ul.page-sidebar-menu' : 'sidebarContainer',
            //页面容器
            'div.page-content' : 'pageContainer'
        },

        events : {
            'click ul.page-sidebar-menu a' : 'sidebarClick'
        },

        _hashMap : {
            'home' : 'home/index.html',
            'column' : 'column/index.html'
        },

        load : function() {
            $(window).bind('hashchange', this.proxy(this.hashChange));

            var hash = window.location.hash;
            if(hash) this.hashChange();
            else this.sidebarRender('home');
        },

        sidebarClick : function(event) {
            var $a = this.$(event.target);

            var $parent = $a.parent();

            $parent.parent().children('li.open').children('a').children('.arrow').removeClass('open');
            $parent.parent().children('li.open').children('.sub-menu').slideUp(200);
            $parent.parent().children('li.open').removeClass('open');

            var $sub = $a.next();
            if ($sub.is(":visible")) {
                $parent.removeClass('open');
                $('.arrow', $a).removeClass("open");
                $a.parent().removeClass("open");
                $sub.slideUp(200);
            } else {
                $parent.addClass('open');
                $('.arrow', $a).addClass("open");
                $a.parent().addClass("open");
                $sub.slideDown(200);
            }
        },

        oldHash : '',

        hashChange : function() {
            var hash = window.location.hash.slice(1);

            if(!hash) return ;

            this.sidebarRender(hash);

            this.oldHash = hash;
        },

        sidebarRender : function(hash) {
            var $oldActive = this.sidebarContainer.children('li.active');

            if($oldActive.length) {
                $oldActive.removeAttr('class');
                $oldActive.find('span.selected').remove();
                $oldActive.find('span.arrow').removeClass('open');
                $oldActive.find('li.open').removeClass('open');
            }

            var page = this._hashMap[hash];

            if(page) {
                var $a = this.sidebarContainer.find('a[href="#' + hash + '"]');

                if($a.parent().parent().hasClass('page-sidebar-menu') ||
                    !$a.parent().siblings('li').find('a[href="#' + this.oldHash + '"]').length) {
                    $oldActive.find('ul[style]').slideUp(200);
                }

                var $li;
                if($a.parent().hasClass('open')) {
                    $li = this.sidebarContainer.children('li.open');
                    $li.removeClass('open').addClass('active');
                } else {
                    $li = $a.parent();
                    while($li.parent('ul').hasClass('sub-menu')) {
                        $li.addClass('open');
                        $li.parent().prev().children('span.arrow').addClass('open');
                        $li.parent().slideDown(200);
                        $li = $li.parent().parent();
                    }
                    $li.addClass('active');
                }
                $li.find('span.title').after(this.component('element', ['span']).clone().addClass('selected'));

                this.loadPage(page);
            } else {
                $oldActive.find('ul[style]').slideUp(200);
            }
        },

        loadPage : function(path) {
            this.pageContainer.load(path);
        },

        //加载阴影
        blockUI : function(el, centerY) {
            this.$(el).block({
                message: '<img src="../support/image/ajax-loading.gif" align="">',
                centerY: centerY != undefined ? centerY : true,
                css: {
                    top: '10%',
                    border: 'none',
                    padding: '2px',
                    backgroundColor: 'none'
                },
                overlayCSS: {
                    backgroundColor: '#000',
                    opacity: 0.05,
                    cursor: 'wait'
                }
            });
        },

        //消除阴影
        unblockUI : function (el) {
            this.$(el).unblock({
                onUnblock: function () {
                    $(el).removeAttr("style");
                }
            });
        }
    });

    this.indexCtrl = new IndexController('body');

})();

//数据抽象模型
(function() {

    var sepa = org.eocencle.sepa;

    var Entities = new sepa.Class(sepa.BaseModel);
    Entities.create(['id', 'model']);

    sepa.EntitiesManager = new sepa.Class([Entities, sepa.Model]);

    //栏目
    var Column = new sepa.Class(sepa.BaseModel);
    //id,父栏目ID,栏目名称,栏目描述,排序,创建者ID,创建时间,更新者ID,更新时间,栏目状态
    Column.create(['id', 'parentId', 'title', 'description', 'sort', 'createId', 'createTime', 'updateId',
        'updateTime', 'status']);

    new sepa.EntitiesManager({id : 'Column', model : Column}).save();

    //文章
    var Article = new sepa.Class(sepa.BaseModel);
    //id,栏目ID,标题,排序,文章类型,文章属性,缩略图,来源,作者,描述,关键字,内容路径,查看次数,创建者ID,创建时间,更新者ID,创建时间,
    //文章状态,审查注释,内容
    Article.create(['id', 'columnId', 'title', 'sort', 'articleType', 'attribute', 'thumbnails', 'source', 'author',
        'description', 'keyword', 'path', 'viewCount', 'createId', 'createTime', 'updateId', 'updateTime', 'status',
        'examineCommont', 'content']);

    new sepa.EntitiesManager({id : 'Article', model : Article}).save();

    //资源集
    var ResourceAlbum = new sepa.Class(sepa.BaseModel);
    //id,资源类型,名称,描述,创建者ID,创建时间
    ResourceAlbum.create(['id', 'resourceType', 'name', 'description', 'creatorId', 'createTime']);

    new sepa.EntitiesManager({id : 'ResourceAlbum', model : ResourceAlbum}).save();

    //资源
    var Resource = new sepa.Class(sepa.BaseModel);
    //id,资源类型,资源集ID,存储名称,地址,原有名称,创建者ID,创建时间,下载次数
    Resource.create(['id', 'resourceType', 'albumId', 'name', 'path', 'description', 'creatorId', 'createTime',
        'downloadCount']);

    new sepa.EntitiesManager({id : 'Resource', model : Resource}).save();

    //模板
    var Template = new sepa.Class(sepa.BaseModel);
    //id,模板名称,占位符个数
    Template.create(['id', 'name', 'placeholderCount']);

    new sepa.EntitiesManager({id : 'Template', model : Template}).save();

    //占位符
    var Placeholder = new sepa.Class(sepa.BaseModel);
    //id,模板ID,模板名称,占位符索引,资源类型
    Placeholder.create(['id', 'templateId', 'templateName', 'index', 'resourceType']);

    new sepa.EntitiesManager({id : 'Placeholder', model : Placeholder}).save();

    //页面
    var Page = new sepa.Class(sepa.BaseModel);
    //id,hash索引,页面名称,模板名称,模板名称
    Page.create(['id', 'hashIndex', 'name', 'templateId', 'templateName']);

    new sepa.EntitiesManager({id : 'Page', model : Page}).save();

    //页面占位符
    var PagePlaceholder = new sepa.Class(sepa.BaseModel);
    //id,页面ID,占位符ID,占位符索引,资源类型,引入组ID,引入组名称
    PagePlaceholder.create(['id', 'pageId', 'placeholderId', 'index', 'resourceType', 'groupId', 'groupName']);

    new sepa.EntitiesManager({id : 'PagePlaceholder', model : PagePlaceholder}).save();

})();