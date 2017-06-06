/**
 * 主页、组件、实体类
 */

(function($) {
    var sepa = org.eocencle.sepa;

    var IndexController = new sepa.Class(sepa.Controller);

    IndexController.include({

        _HASH : {
            'home' : 'home.html',
            'topic' : 'topic.html'
        },

        elements : {
            'div.main' : 'main'
        },

        load : function() {
            //初始化状态机
            var Statem = new sepa.Class(sepa.StateMachine);

            this.sm = new Statem(this);

            var Event = new sepa.Class(sepa.Event);

            for(var hash in this._HASH) {
                this.sm.addEvent(new Event(hash, function(hash) {
                    this.main.load(this._HASH[hash]);
                }));
            }
            //初始页
            var hash = window.location.hash.slice(1);

            var sp = hash.split('/');
            sp[0] == 'topic'

            this._HASH[hash] ? this.sm.trigger(hash) : this.sm.trigger('home');

            window.onhashchange = this.proxy(this.hashChange);
        },

        hashChange : function() {
            var hash = window.location.hash.slice(1);
            var hashArr = hash.split('/');
            this._HASH[hashArr[0]] ? this.sm.trigger(hashArr[0]) : this.sm.trigger('home');
        }

    });

    new IndexController('body');

    //项目组件
    var CPage = sepa.CPage = new sepa.Class();
    /**
     * 分页组件
     * {
     * 	block: //数字块个数，最小为5
     * 	container: //显示容器,jquery选择器
     * 	btnFontPos: //按钮上字体显示位置,jquery选择器
     * 	btns: {
     * 		prevBtn: //表示上一页,blocks方法,必须包含名为prev的类
     * 		nextBtn: //表示下一页,blocks方法,必须包含名为next的类
     * 		actBtn: //表示当前活动页,blocks方法
     * 		pageBtn: //表示数字页,blocks方法,必须包含名为num的类
     * 		moitBtn: //表示点页,blocks方法
     * 	}
     * 	methods: {
     * 		prevMethod: //上一页响应方法
     * 		nextMethod: //下一页响应方法
     * 		pageMethod: //数字页响应方法
     * 	}
     * }
     */
    CPage.extend({
        _component : {
            _common: {
                openPage : function(cfgName) {
                    var cfg = this.pageCfg = this.config[cfgName];
                    if(!cfg) throw('缺少名为' + cfgName + '的配置！');
                    var el = $(cfg.container);
                    el.on('click','.prev' , this.proxy(this[cfg.methods.prevMethod]));
                    el.on('click','.next' , this.proxy(this[cfg.methods.nextMethod]));
                    el.on('click','.num' , this.proxy(this[cfg.methods.pageMethod]));
                },
                paginate : function(currPage, totalPage) {
                    var cfg = this.pageCfg;

                    var el = $(cfg.container);

                    var openFontPos = false;
                    var btnFontPos = cfg.btnFontPos;
                    if(btnFontPos) openFontPos = true;

                    var prevBtn = this[cfg.btns.prevBtn];
                    var nextBtn = this[cfg.btns.nextBtn];
                    var actBtn = this[cfg.btns.actBtn];
                    var pageBtn = this[cfg.btns.pageBtn];
                    var moitBtn = this[cfg.btns.moitBtn];
                    el.empty();

                    if(cfg.block < 5) throw('分页数字块最少为5个！');

                    var lr = parseInt(cfg.block / 2);
                    var middle = lr + 1;

                    //前页显示控制
                    if(currPage != 1) {
                        el.append(prevBtn.clone());
                    }
                    if(totalPage <= cfg.block) {
                        var no;
                        for(var i = 1; i <= totalPage; i ++) {
                            if(currPage == i) {
                                no = actBtn.clone();
                            } else {
                                no = pageBtn.clone();
                            }
                            openFontPos ? $(btnFontPos, no).text(i) : no.text(i);
                            el.append(no);
                        }
                    } else {
                        var before = currPage - middle;
                        var after = totalPage - middle;
                        var no;
                        if(before <= 1 && currPage >= after) {
                            for(var i = 1; i <= totalPage; i ++) {
                                if(currPage == i) {
                                    no = actBtn.clone();
                                } else {
                                    no = pageBtn.clone();
                                }
                                openFontPos ? $(btnFontPos, no).text(i) : no.text(i);
                                el.append(no);
                            };
                        }
                        //前面有省略
                        if(before > 1 && currPage >= after) {
                            no = pageBtn.clone();
                            openFontPos ? $(btnFontPos, no).text(1) : no.text(1);
                            el.append(no);
                            el.append(moitBtn.clone());
                            var sw = lr + (middle - (totalPage - currPage)) - 1;
                            for(var i = sw; i >= 1; i --) {
                                no = pageBtn.clone();
                                openFontPos ? $(btnFontPos, no).text(currPage - i) : no.text(currPage - i);
                                el.append(no);
                            }
                            no = actBtn.clone();
                            openFontPos ? $(btnFontPos, no).text(currPage) : no.text(currPage);
                            el.append(no);
                            for(var i = currPage + 1; i <= totalPage; i ++) {
                                no = pageBtn.clone();
                                openFontPos ? $(btnFontPos, no).text(i) : no.text(i);
                                el.append(no);
                            };
                        }
                        //后面有省略
                        if(before <= 1 && currPage < after) {
                            for(var i = 1; i <= currPage; i ++) {
                                if(currPage == i) {
                                    no = actBtn.clone();
                                } else {
                                    no = pageBtn.clone();
                                }
                                openFontPos ? $(btnFontPos, no).text(i) : no.text(i);
                                el.append(no);
                            }
                            var sw = lr + (middle - (currPage - 1)) - 1;
                            for(var i = 1; i <= sw; i ++) {
                                no = pageBtn.clone();
                                openFontPos ? $(btnFontPos, no).text(currPage + i) : no.text(currPage + i);
                                el.append(no);
                            }
                            el.append(moitBtn.clone());
                            no = pageBtn.clone();
                            openFontPos ? $(btnFontPos, no).text(totalPage) : no.text(totalPage);
                            el.append(no);
                        }
                        //前后都有省略
                        if(before > 1 && currPage < after) {
                            no = pageBtn.clone();
                            openFontPos ? $(btnFontPos, no).text(1) : no.text(1);
                            el.append(no);
                            el.append(moitBtn.clone());
                            for(var i = lr; i >= 1; i --) {
                                no = pageBtn.clone();
                                openFontPos ? $(btnFontPos, no).text(currPage - i) : no.text(currPage - i);
                                el.append(no);
                            }
                            no = actBtn.clone();
                            openFontPos ? $(btnFontPos, no).text(currPage) : no.text(currPage);
                            el.append(no);
                            for(var i = 1; i <= lr; i ++) {
                                no = pageBtn.clone();
                                openFontPos ? $(btnFontPos, no).text(currPage + i) : no.text(currPage + i);
                                el.append(no);
                            }
                            el.append(moitBtn.clone());
                            no = pageBtn.clone();
                            openFontPos ? $(btnFontPos, no).text(totalPage) : no.text(totalPage);
                            el.append(no);
                        };
                    }
                    //后页显示控制
                    if(totalPage != 0 && currPage != totalPage) {
                        el.append(nextBtn.clone());
                    };
                }
            }
        }
    });

    var MyPage = sepa.MyPage = new sepa.Class();

    MyPage.include({
        blocks : {
            'prevBtnBlk' : 'prevBtnEl',
            'nextBtnBlk' : 'nextBtnEl',
            'actBtnBlk' : 'actBtnEl',
            'pageBtnBlk' : 'pageBtnEl',
            'moitBtnBlk' : 'moitBtnEl'

        },
        config : {
            page : {
                block : 5,
                container : 'ul.page-navi',
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
                }
            }
        },
        prevBtnBlk : function() {
            var li = this.component('element', ['li']).addClass('prev');
            var a = this.component('element', ['a']).attr('href', 'javascript:void(0);').append('&lt;');
            li.append(a);
            return li;
        },

        nextBtnBlk : function() {
            var li = this.component('element', ['li']).addClass('next');
            var a = this.component('element', ['a']).attr('href', 'javascript:void(0);').append('&gt;');
            li.append(a);
            return li;
        },

        actBtnBlk : function() {
            var li = this.component('element', ['li']);
            var a = this.component('element', ['a']).attr('href', 'javascript:void(0);').addClass('current');
            li.append(a);
            return li;
        },

        pageBtnBlk : function() {
            var li = this.component('element', ['li']).addClass('num');
            var a = this.component('element', ['a']).attr('href', 'javascript:void(0);');
            li.append(a);
            return li;
        },

        moitBtnBlk : function() {
            return this.component('element', ['li']).text(' ... ');
        }
    });

})(jQuery);


(function() {

    var sepa = org.eocencle.sepa;
    org.eocencle.entities = {};

    var BaseTopic = org.eocencle.entities.BaseTopic = new sepa.Class(sepa.BaseModel);
    //id，类型(1:文本，2:图片，4:视频，8:语音)，标题，内容ID，作者ID，作者，发布时间，最后回复者ID，最后回复者，最后回复时间，
    // 查看次数，回复数，摘录，图片，置顶，精华，热帖，状态(1:正常，2:已删除)
    BaseTopic.create(['id', 'type', 'title', 'postId', 'authorId', 'author', 'createTime', 'lastId', 'last',
        'lastTime', 'views', 'replies', 'excerpt', 'image', 'top', 'digest', 'hot', 'status']);

    var BasePost = org.eocencle.entities.BasePost = new sepa.Class(sepa.BaseModel);
    //id，主题ID，主题名称，内容，作者ID，作者，发布时间，楼层，回复提示（0：不提示，1、回复提示、2、@提示），状态
    BasePost.create(['id', 'topicId', 'topicTitle', 'content', 'authorId', 'author', 'createTime', 'floorNo',
        'remind', 'status']);

})();
