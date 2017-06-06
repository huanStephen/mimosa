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
            'column' : 'column/index.html',
            'article' : 'article/index.html',
            'image' : 'resource/index.html',
            'sound' : 'resource/index.html',
            'video' : 'resource/index.html',
            'attachment' : 'resource/index.html',
            'templateImport' : 'template/templateImport.html',
            'templateConfig' : 'template/templateConfig.html',
            'page' : 'page/index.html'
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
            this.pageContainer.load(path, this.proxy(function() {
                this._el.animate({scrollTop: 0}, 300);
            }));
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