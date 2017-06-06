
(function($) {

    var sepa = org.eocencle.sepa;
    var entities = org.eocencle.entities;

    var HomeController = new sepa.Class([sepa.Controller, sepa.CRemote, sepa.CPage, sepa.CElement, sepa.MyPage]);

    var Topic = new sepa.Class([entities.BaseTopic, sepa.Model]);

    HomeController.include({

        elements : {
            'div.intro' : 'intro',
            'div.main' : 'main'
        },

        blocks : {
            'articleBlk' : 'articleEl'
        },

        config : {
            loadTopics : {
                path : 'article/loadTopics',
                params : {
                    size : 5,
                    currPage : 8
                },
                callback : 'loadTopicsResult'
            }
        },

        load : function() {
            this.component('openPage', ['page']);
            this.component('remote', ['loadTopics']);
        },

        loadTopicsResult : function(data) {
            if(data.result) {
                this.intro.append(data.introduction);
                Topic.populate(data.topics);
                this.currPage = data.currPage;
                this.totalPage = data.totalPage;
                this.showTopics();
            }

        },

        showTopics : function() {
            var topics = Topic.all();

            this.main.empty();

            for(var i in topics) {
                var article = this.articleEl.clone();

                article.find('h2 a').append(topics[i].title);

                if(topics[i].type & 8)
                    article.find('span.icon').addClass('audio-format');
                else if(topics[i].type & 4)
                    article.find('span.icon').addClass('video-format');
                else if(topics[i].type & 2)
                    article.find('span.icon').addClass('gallery-format');
                else
                    article.find('span.icon').addClass('standard-format');

                article.find('time').append(topics[i].createTime);
                article.find('.cat-links a').append(topics[i].author);
                article.find('.comments-link a').append(topics[i].replies + ' / ' + topics[i].views);
                article.find('p').append(topics[i].excerpt);

                this.main.append(article);
            }

            this.component('paginate', [this.currPage, this.totalPage]);
        },

        pervClick : function(event) {
            this.config.loadTopics.params.currPage = parseInt($('a', event.currentTarget).text()) - 1;
            this.component('remote', ['loadTopics']);
        },

        nextClick : function() {
            this.config.loadTopics.params.currPage = parseInt($('a', event.currentTarget).text()) + 1;
            this.component('remote', ['loadTopics']);
        },

        pageClick : function() {
            this.config.loadTopics.params.currPage = $('a', event.currentTarget).text();
            this.component('remote', ['loadTopics']);
        },

        articleBlk : function() {
            return '<article class="post hentry format-image">' +
                        '<header class="entry-header">' +
                            '<h2 class="entry-title"><a href=""></a></h2>' +
                            '<div class="entry-meta">' +
                                '<div class="entry-format">' +
                                    '<span class="icon">*</span>' +
                                '</div>' +
                                '<span class="sep"> | </span>' +
                                '<a href="#"><time class="entry-date"></time></a>' +
                                '<span class="sep"> | </span>' +
                                '<span class="cat-links"> <a href="#"></a></span>' +
                                '<span class="sep"> | </span>' +
                                '<div class="comments-link">' +
                                    '<a href="#"></a>' +
                                '</div>' +
                            '</div>' +
                        '</header>' +
                        '<div class="entry-content">' +
                            '<div class="full-size">' +
                                '<a href=""><img /></a>' +
                            '</div>' +
                            '<p></p>' +
                        '</div>' +
                    '</article>';
        }

    });

    new HomeController('div.primary');

})(jQuery);