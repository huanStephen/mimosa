(function() {

    var sepa = org.eocencle.sepa;

    var Page = sepa.EntitiesManager.find('Page');

    var PageEntity = new sepa.Class([Page.model, sepa.Model]);

    var CoreCtrl = new sepa.Class([sepa.Controller, sepa.CRemote]);

    CoreCtrl.include({

        _pages : {},

        config : {
            getPageList : {
                path : 'page/getPageList',
                callback : 'getPageListResult'
            }
        },

        getPageListResult : function(result) {
            if(!result.resultCode) {
                PageEntity.populate(result.data.list);
                this.parsePage();
            } else {
                console.error(result.resultMsg);
            }
        },

        parsePage : function() {
            if(PageEntity.count()) {
                var list = PageEntity.all();

                for(var i in list) {
                    this._pages[list[i].hashIndex] = list[i];
                }
            } else {
                console.error('没有任何页面！');
            }
        }

    });

    new CoreCtrl('body');

})();