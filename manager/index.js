(function() {

    var sepa = org.eocencle.sepa;

    var IndexController = new sepa.Class([sepa.Controller, sepa.CElement]);

    IndexController.include({

        elements : {
            'ul.page-sidebar-menu' : 'sidebarContainer'
        },

        events : {
            'click ul.page-sidebar-menu a' : 'sidebarClick'
        },

        _hashMap : {

        },

        load : function() {
            $(window).bind('hashchange', this.proxy(this.hashChange));

            this.hashChange();
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

            var $oldActive = this.sidebarContainer.children('li.active');

            if($oldActive.length) {
                $oldActive.removeAttr('class');
                $oldActive.find('span.selected').remove();
                $oldActive.find('span.arrow').removeClass('open');
                $oldActive.find('li.open').removeClass('open');
            }

            var $a = this.sidebarContainer.find('a[href="#' + hash + '"]');

            if($a.parent().parent().hasClass('page-sidebar-menu') ||
                !$a.parent().siblings('li').find('a[href="#' + this.oldHash + '"]').length) {
                $oldActive.find('ul[style]').slideUp(200);
            }

            var $li;
            if($a.parent().hasClass('open')) {
                $li = this.sidebarContainer.children('li.open');
                $li.removeClass('open').addClass('active');
                $li.find('span.title').after(this.component('element', ['span']).clone().addClass('selected'));
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

            this.oldHash = hash;
        }
    });

    this.indexCtrl = new IndexController('body');

})();