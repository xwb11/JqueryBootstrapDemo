/**
 * 类目管理界面接口
 */
var SELECT_CATEGORY_URL = requestUrl + "api/generate/productCategory/page"; //url地址 分页查询
var INSERT_CATEGORY_URL = requestUrl + "api/generate/productCategory/categoryAdd"; //url地址 类目新增
var DELETE_CATEGORY_URL = requestUrl + "api/generate/productCategory/deleteCategory"; //url地址删除
var UPDATE_CATEGORY_URL = requestUrl + "api/generate/productCategory/updateCategory" //url地址 更新

$(function () {
    tableInit(SELECT_CATEGORY_URL,'');
});

//获得表格数据
function tableInit(tableUrl,cond) {

    $('#knowledge-table').bootstrapTable({
        url: tableUrl,
        method: requestJson ? 'get' : 'post',                      //请求方式（*）
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        //toolbar: '#toolbar',              //工具按钮用哪个容器
        striped: false,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        sortable: false,                     //是否启用排序
        sortOrder: "asc",                   //排序方式
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber: 1,                      //初始化加载第一页，默认第一页,并记录
        pageSize: 10,                     //每页的记录行数（*）
        pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
        search: false,                      //是否显示表格搜索
        strictSearch: true,
        //showColumns: true,                  //是否显示所有的列（选择显示的列）
        showRefresh: false,                  //是否显示刷新按钮
        minimumCountColumns: 2,             //最少允许的列数
        clickToSelect: true,                //是否启用点击选中行
        //height: 500,                      //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "ID",                     //每一行的唯一标识，一般为主键列
        showToggle: false,                   //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                  //是否显示父子表
        //得到查询的参数
        queryParams : function (params) {
            //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            var temp;
            //模糊查询
            if (cond == "condition") {
                temp = {
                    categoryName: $("#title-search").val(),
                    pageSize:10,
                    rows: params.limit,                         //页面大小
                    page: (params.offset / params.limit) + 1,   //页码
                    sort: params.sort,      //排序列名
                    // sortOrder: params.order //排位命令（desc，asc）
                };
                return JSON.stringify(temp);
            } else {
                temp = {
                    rows: params.limit,                         //页面大小
                    page: (params.offset / params.limit) + 1,   //页码
                    sort: params.sort,      //排序列名
                    sortOrder: params.order //排位命令（desc，asc）
                };
                return JSON.stringify(temp);
            }
        },
        columns: [{
            checkbox: true,
            visible: true                  //是addCategory否显示复选框
        }, {
            align: 'center',
            field: 'number',
            title: '序号',
            formatter:function(value,row,index) {
                //通过formatter可以自定义列显示的内容
                //value：当前field的值，即id
                //row：当前行的数据
                return index + 1;
            }
        }, {
            align: 'center',
            field: 'categoryName',
            title: '类目名称'
        }, {
            align: 'center',
            field: 'categoryType',
            title: '类目类型'
        }, {
            align: 'center',
            field: 'createTime',
            title: '创建时间',
            formatter:function(value) {
                if (value != null) {
                    return getMyDate(value);
                }
                return "-";
            }
        }, {
            align: 'center',
            field: 'updateTime',
            title: '更新时间',
            formatter:function(value) {
                if (value != null) {
                    return getMyDate(value);
                }
                return "-";
            }
        },{
            field:'ID',
            title: '操作',
            width: 120,
            align: 'center',
            valign: 'middle',
            formatter:function(value,row,index) {
                //通过formatter可以自定义列显示的内容
                //value：当前field的值，即id
                //row：当前行的数据
                // let a = '<a href="../../pages/knowledge-base/knowledge-detial.html" onclick="openDetialModal()">查看</a>';
                let b = '<a href="#" style="color: palevioletred;" onclick="openEditorModal()" data-target="#add-modal" data-toggle="modal">编辑</a>';
                let c = '<a href="#" style="color: #6ce26c" onclick="openDeleteModal()">删除</a>';
                return  b + '  ' + c;
            }
        }],
        onLoadSuccess: function (e) {
            console.log(e)
        },
        onLoadError: function () {
            console.log("数据加载失败！");
        },
        onDblClickRow: function (row, $element) {
        },
        //客户端分页，需要指定到rows
        responseHandler: function(result) {
            // return data.rows;
            if (requestJson) {
                return result.rows;
            } else {
                return {
                    "rows": result.data.list,
                    "total": result.data.count
                };
            }
        }
    });
}
//模糊搜索 begin
function SearchPlan() {
    $('#knowledge-table').bootstrapTable("destroy");
    tableInit(SELECT_CATEGORY_URL, "condition");
}
//模糊搜索 end

//保存按钮
$("#addCategory").on("click", function () {
    let checkboxTable = $("#knowledge-table").bootstrapTable('getSelections');
    console.log(checkboxTable);
    if ($("#show-model-title").html() == '<h4>' + ' 修改类目' + '</h4>') {
       var UPDATECATEGORY = {
            "categoryId": checkboxTable[0].categoryId,
            "categoryName": $("#inputTitle").val(),
            "categoryType": $("#inputType").val(),
        };
        $.ajax({
            url: UPDATE_CATEGORY_URL,
            type: requestJson ? 'get' : 'post',
            data: JSON.stringify(UPDATECATEGORY),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.ok) {
                    poptip.alert(POP_TIP.updateSuccess);
                    $("#add-modal").modal("hide");
                    $('#knowledge-table').bootstrapTable("refresh");
                } else {
                    poptip.alert(POP_TIP.updateFail);
                    $("#add-modal").modal("hide");
                    $('#knowledge-table').bootstrapTable("refresh");
                }
            }
        })
    } else {
        $.ajax({
            url: INSERT_CATEGORY_URL,
            method: requestJson ? 'get' : 'post',
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                categoryName: $("#inputTitle").val(),
                categoryType: $("#inputType").val()
            }),
            success: function (data) {
                if (data.ok) {
                    poptip.alert(data.respCode);
                    $("#add-modal").modal("hide");
                    $('#knowledge-table').bootstrapTable("refresh");
                } else {
                    poptip.alert(data.message);
                    $("#add-modal").modal("hide");
                    $('#knowledge-table').bootstrapTable("refresh");
                }
            }
        });
    }
});

//添加一条数据
function openAddModal() {
    $("#show-model-title").html('<h4>' + ' 新增类目' + '</h4>')
    let modal = $("#add-modal");//还原，置空
    modal.find("input").eq(0).val("");//将模态框中的数据清空
    modal.find("input").eq(1).val("");//将模态框中的数据清空

}


//删除一条数据
function openDeleteModal() {
    let checkboxTable = $("#knowledge-table").bootstrapTable('getSelections');
    poptip.confirm({
        content: '确定删除此条数据？',
        yes: function() {
            let settings = {
                url: DELETE_CATEGORY_URL,
                method: requestJson ? 'get' : 'post',
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                data:JSON.stringify({
                    "categoryId": checkboxTable[0].categoryId
                })
            };
            $.ajax(settings).done(function (data) {
                if (data.ok) {
                    poptip.alert(data.data);
                    $("#add-modal").modal("hide");
                    $('#knowledge-table').bootstrapTable("refresh");
                } else {
                    poptip.alert("删除失败");
                    $("#add-modal").modal("hide");
                    $('#knowledge-table').bootstrapTable("refresh");
                }
            });
            poptip.close();
        },
        cancel:function() {
            console.log('confirm-cancel');
            poptip.close();
        }
    });
}
//修改一条数据
function openEditorModal() {
    let checkboxTable = $("#knowledge-table").bootstrapTable('getSelections');
    // console.log(checkboxTable);
    //模态框标题
    $("#show-model-title").html('<h4>' + ' 修改类目' + '</h4>')
    //得到当前数据的详细信息
    $("#inputTitle").val(checkboxTable[0].categoryName);
    $("#inputType").val(checkboxTable[0].categoryType);

}
//查看一条数据
function openDetialModal() {
    //模态框标题
    $("#modelTitle").html('<h4>' + ' 知识点详情' + '</h4>')
    //得到当前数据的详细信息
    $("#inputTitle").val('如何按照车型搜索备件？')
    $("#inputCategory").val('备件问题')
    $("#inputPublisher").val('总管理员dall')
    $("#inputNum").val('3')
}
/**
 * 重置按钮,搜索项变为空
 * 宣文彬
 */
$("#search-reset").on("click",function () {
    $("#title-search").val("");
});