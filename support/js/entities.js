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
    //id,hash索引,页面名称,模板名称,模板名称,详细配置
    Page.create(['id', 'hashIndex', 'name', 'templateId', 'templateName', 'detailConfig']);

    new sepa.EntitiesManager({id : 'Page', model : Page}).save();

    //页面占位符
    var PagePlaceholder = new sepa.Class(sepa.BaseModel);
    //id,页面ID,占位符ID,占位符索引,资源类型,引入组ID,引入组名称,详细配置
    PagePlaceholder.create(['id', 'pageId', 'placeholderId', 'index', 'resourceType', 'groupId', 'groupName', 'detailConfig']);

    new sepa.EntitiesManager({id : 'PagePlaceholder', model : PagePlaceholder}).save();

    //下拉框节点
    var SelectNode = new sepa.Class(sepa.BaseModel);
    //id,名称
    SelectNode.create(['id', 'name']);

    new sepa.EntitiesManager({id : 'SelectNode', model : SelectNode}).save();

})();