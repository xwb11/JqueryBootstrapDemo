/**
 * 订单详情页面
 * @type {number}
 */

/**
 * 订单查询接口
 * @type {string}
 */
var str;
var SELECT_ORDER_URL = requestUrl + "api/generate/orderMaster/queryByPage"; //url地址 分页查询
var CANCEL_ORDER_URL = requestUrl + "api/generate/orderMaster/cancelOrder"; //url地址 取消订单
// var SELECT_ORDER_URL = requestUrl + "api/generate/orderMaster/queryByPage"; //url地址 查询
var SELECT_ORDER_DETAIL_URL = requestUrl + "api/generate/orderMaster/detail"

var FINISH_ORDER_URL = requestUrl + "api/generate/orderMaster/finishOrder"//完结订单


let MAX_FILE_NUM = 2;
$(function() {
    laydate.render({
        elem: '#birthday',
        range: true,
        max: new Date().Format('yyyy-MM'),
        done: function (value) {

        }
    });
});

$(function () {
    tableInit(SELECT_ORDER_URL,'');
});

/**
 * @Desc 登录日志tab跳转
 * @Date 2018-09-19 10:06:12
 * @Author qitian
 */
function tableInit(tableUrl,cond) {
    $('#problem-table-all').bootstrapTable({
        url: tableUrl,
        method: requestJson ? 'get' : 'post',//请求方式（*）
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        //toolbar: '#toolbar',              //工具按钮用哪个容器
        striped: true,                      //是否显示行间隔色
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
                    buyerName: $("#select-name").val(),
                    buyerPhone:$("#select-iphone").val(),
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
            visible: true                  //是否显示复选框
        }, {
            field: 'number',
            title: '序号',
            align: 'center',
            formatter:function(value,row,index) {
                //通过formatter可以自定义列显示的内容
                //value：当前field的值，即id
                //row：当前行的数据
                return index + 1;
            }
        }, {
            field: 'orderId',
            title: '订单Id',
            align: 'center',
        }, {
            field: 'buyerName',
            title: '姓名',
            align: 'center',
        }, {
            field: 'buyerPhone',
            title: '手机号',
            align: 'center',
            width:120
        }, {
            field: 'buyerAddress',
            title: '地址',
            align: 'center',
            width:200
        },{
            field: 'orderAmount',
            title: '订单总金额',
            align: 'center',
        },{
            field: 'orderStatus',
            title: '订单状态',
            align: 'center',
            formatter: function (value) {
                if (value === 0) {
                    return "新下单";
                } else if (value === 1) {
                    return "已完结";
                } else {
                    return "已取消";
                }
            }
        },{
            field: 'payStatus',
            title: '支付状态',
            align: 'center',
            formatter: function (value) {
                if (value === 0) {
                    return "未支付";
                } else {
                    return "已支付";
                }
            }
        },{
           field: 'createTime',
           title: '创建时间',
            align: 'center',
            width:200,
            formatter:function(value) {
                if (value != null) {
                    return getMyDate(value);
                }
                return "-";
            }
        },{
            field:'ID',
            title: '操作',
            width: 100,
            align: 'center',
            valign: 'middle',
            formatter:function(value,row,index) {
                //通过formatter可以自定义列显示的内容
                //value：当前field的值，即id
                //row：当前行的数据

                // let a = '<a href="#" onclick="openContinueModal()" data-target="#allproblem-continue" data-toggle="modal">继续提问</a>';
                let b = '<a href="#" onclick="openDetailModal()" style="color: palevioletred;" data-target="#allproblem" data-toggle="modal" id="check-allproblem" >详情</a>';
                let c = '<a href="#" style="color: #6ce26c" onclick="cancel()">取消</a>';
                return b + '     ' + c;
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
            console.log(result)
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
    $('#problem-table-all').bootstrapTable("destroy");
    tableInit(SELECT_ORDER_URL, "condition");
}
//模糊搜索 end

/**
 * 重置按钮
 */
$("#reset-button").click(function () {
    $("#select-name").val("")
    $("#select-iphone").val("")
})


//打开详情订单
function openDetailModal() {

  $(this).find(".bs-checkbox").find("input").eq(0).prop("checked",true);

    let checkboxTable = $("#problem-table-all").bootstrapTable('getSelections');
    console.log("---------------")
    console.log(checkboxTable[0].orderId);
    $("#allproblemTitle").html('<h4>' + ' 订单商品详情' + '</h4>')

    $.ajax({
        url: SELECT_ORDER_DETAIL_URL,
        type: requestJson ? 'get' : 'post',
        cache:false,
        data: {
            openid: checkboxTable[0].buyerOpenid ,
            orderId: checkboxTable[0].orderId
        },
        dataType: "json",
        // contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.ok) {
                $('#product-detail').empty();
                for (var i = 0; i < data.data.orderDetailEOList.length; i++) {
                    $("#product-detail").append('<tr>' +
                        '<td>' + data.data.orderDetailEOList[i].productId + '</td>+' +
                        '<td>' + data.data.orderDetailEOList[i].productName + '</td>+' +
                        '<td>' + data.data.orderDetailEOList[i].productPrice + '</td>+' +
                        '<td>' + data.data.orderDetailEOList[i].productQuantity + '</td>+' +
                        '</tr>')
                }
            } else {
                poptip.alert(POP_TIP.rquestFail);
                $('#problem-table-all').bootstrapTable("refresh");
            }
        }
    })

}

//取消订单
function cancel() {
    let checkboxTable = $("#problem-table-all").bootstrapTable('getSelections');
    console.log("---------------")
    console.log(checkboxTable[0]);
    if (checkboxTable[0].orderStatus === 2){
        poptip.alert(POP_TIP.checkStatus);
        return 0;
    }
    $.ajax({
        url: CANCEL_ORDER_URL,
        type: requestJson ? 'get' : 'post',
        cache:false,
        data: {
            openid: checkboxTable[0].buyerOpenid ,
            orderId: checkboxTable[0].orderId
        },
        dataType: "json",
        // contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.ok) {
                poptip.alert(POP_TIP.updateSuccess);
                $("#add-modal").modal("hide");
                $('#problem-table-all').bootstrapTable("refresh");
            } else {
                poptip.alert(POP_TIP.updateFail);
                $("#add-modal").modal("hide");
                $('#problem-table-all').bootstrapTable("refresh");
            }
        }
    })
}

//完结订单
function finish() {
    let checkboxTable = $("#problem-table-all").bootstrapTable('getSelections');
    console.log()
    console.log(checkboxTable[0]);
    if (checkboxTable[0].orderStatus === 1){
        poptip.alert(POP_TIP.finishStatus);
        return 0;
    }
    $.ajax({
        url: FINISH_ORDER_URL,
        type: requestJson ? 'get' : 'post',
        cache:false,
        data: JSON.stringify({
            openid: checkboxTable[0].buyerOpenid ,
            orderId: checkboxTable[0].orderId,
            orderStatus:checkboxTable[0].orderStatus
        }),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.ok) {
                poptip.alert(POP_TIP.updateSuccess);
                $("#add-modal").modal("hide");
                $('#problem-table-all').bootstrapTable("refresh");
            } else {
                poptip.alert(POP_TIP.updateFail);
                $("#add-modal").modal("hide");
                $('#problem-table-all').bootstrapTable("refresh");
            }
        }
    })
}



