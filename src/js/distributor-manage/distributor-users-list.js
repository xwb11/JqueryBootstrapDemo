/**
 * 商品列表
 *
 */

var SELECT_PRODUCT_URL = requestUrl + "api/generate/productInfo/queryByPage"; //url地址 分页查询
var INSERT_PRODUCT_URL = requestUrl + "api/generate/productInfo/addProductInfo"; //url地址 类目新增
var DELETE_PRODUCT_URL = requestUrl + "api/generate/productInfo/deleteProductInfo"; //url地址删除
var UPDATE_PRODUCT_URL = requestUrl + "api/generate/productInfo/updateProductInfo" //url地址 更新


//经销商管理（用户列表） 刘志杰 2018-09-25
$(function () {
    TableInit();//表格初始化
})

/**
 * @Desc 表格初始化
 * @Date 2
 * @Author qitian
 */
function TableInit() {
    $("#show-table-distributor-users").bootstrapTable({
        url: SELECT_PRODUCT_URL,
        method: requestJson ? 'get' : 'post',                      //请求方式（*）
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
        queryParams: function (params) {
            //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            var temp = {
                rows: params.limit,                         //页面大小
                page: (params.offset / params.limit) + 1,   //页码
                sort: params.sort,      //排序列名
                sortOrder: params.order //排位命令（desc，asc）
            };
            return temp;
        },
        columns: [{
            align: 'center',
            valign: 'middle',
            checkbox: true,
            visible: true                  //是否显示复选框
        }, {
            align: 'center',
            field: 'index',
            title: '序号',
            valign: 'middle',
            formatter: function (value, row, index) {
                //通过formatter可以自定义列显示的内容
                //value：当前field的值，即id
                //row：当前行的数据
                return index + 1;
            }
        }, {
            align: 'center',
            field: 'productName',
            title: '商品名称',
            valign: 'middle',
        }, {
            align: 'center',
            field: 'productIcon',
            title: '图片',
            valign: 'middle',
            formatter: function (value) {
                let a = "<img src=' " + value + " ' style='max-width: 51px;max-height: 37px'>"
                return a;
            }
        }, {
            align: 'center',
            field: 'productPrice',
            valign: 'middle',
            title: '单价'
        }, {
            align: 'center',
            field: 'productStock',
            valign: 'middle',
            title: '库存'
        }, {
            align: 'center',
            field: 'productDescription',
            valign: 'middle',
            title: '描述'
        }, {
            align: 'center',
            field: 'categoryType',
            title: '类目',
            valign: 'middle',
            width: 50
        }, {
            align: 'center',
            field: 'categoryName',
            title: '类目名称',
            valign: 'middle'
        }, {
            align: 'center',
            field: 'createTime',
            title: '创建时间',
            valign: 'middle',
            formatter: function (value) {
                if (value != null) {
                    return getMyDate(value);
                }
                return "-";
            }
        }, {
            align: 'center',
            field: 'updateTime',
            title: '修改时间',
            valign: 'middle',
            formatter: function (value) {
                if (value != null) {
                    return getMyDate(value);
                }
                return "-";
            }
        }, {
            field: 'ID',
            title: '操作',
            width: 120,
            align: 'center',
            valign: 'middle',
            formatter: function (value, row, index) {
                console.log(row.productStatus)
                if (row.productStatus == 0) {
                    let a = '<a href="#" style="color: palevioletred;" onclick="upateProduct()" data-target="#add-modal" data-toggle="modal">修改</a>';
                    let b = '<a href="#" style="color: #6ce26c" onclick="downProduct()">下架</a>';
                    return a + '  ' + b + '  ';
                } else {
                    //通过formatter可以自定义列显示的内容
                    //value：当前field的值，即id
                    //row：当前行的数据
                    let a = '<a href="#" style="color: palevioletred;" onclick="upateProduct()" data-target="#add-modal" data-toggle="modal">修改</a>';
                    let b = '<a href="#" style="color: #6ce26c" onclick="upProduct()">上架</a>';
                    // let c = '<a href="#" class="disable" onclick="openDeleteModal()">禁用</a>';
                    return a + '  ' + b + '  ';
                }
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
        responseHandler: function (data) {
            // return data.rows;
            if (requestJson) {
                return result.rows;
            } else {
                return {
                    "rows": data.data.list,
                    "total": data.data.count
                };
            }
        }
    });
}

function upateProduct() {
    let checkboxTable = $("#show-table-distributor-users").bootstrapTable('getSelections');
    console.log(checkboxTable);
    //模态框标题
    $("#show-model-title").html('<h4>' + ' 修改商品' + '</h4>')
    $("#basicinfo-input-realname").val(checkboxTable[0].productName);
    $("#basicinfo-input-price").val(checkboxTable[0].productPrice)
    $("#basicinfo-input-age").val(checkboxTable[0].productStock)
    $("#basicinfo-input-idcardnumber").val(checkboxTable[0].productDescription)
    $("#pic").val(checkboxTable[0].productIcon)
    $("#select-category").val()
    getBaseOptionFun();
}

/**
 * 下架操作
 */
function downProduct() {
    let checkboxTable = $("#show-table-distributor-users").bootstrapTable('getSelections');

    $.ajax({
        url: UPDATE_PRODUCT_URL,
        type: requestJson ? 'get' : 'post',
        data: JSON.stringify({
            productId: checkboxTable[0].productId,
            productStatus: 1
        }),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.ok) {
                poptip.alert(POP_TIP.updateSuccess);
                $("#add-modal").modal("hide");
                $('#show-table-distributor-users').bootstrapTable("refresh");
            } else {
                poptip.alert(POP_TIP.updateFail);
                $("#add-modal").modal("hide");
                $('#show-table-distributor-users').bootstrapTable("refresh");
            }
        }
    })
}

/**
 * 上架操作
 */
function upProduct() {
    let checkboxTable = $("#show-table-distributor-users").bootstrapTable('getSelections');

    $.ajax({
        url: UPDATE_PRODUCT_URL,
        type: requestJson ? 'get' : 'post',
        data: JSON.stringify({
            productId: checkboxTable[0].productId,
            productStatus: 0
        }),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.ok) {
                poptip.alert(POP_TIP.updateSuccess);
                $("#add-modal").modal("hide");
                $('#show-table-distributor-users').bootstrapTable("refresh");
            } else {
                poptip.alert(POP_TIP.updateFail);
                $("#add-modal").modal("hide");
                $('#show-table-distributor-users').bootstrapTable("refresh");
            }
        }
    })
}


//保存按钮
$("#addCategory").on("click", function () {
    let checkboxTable = $("#knowledge-table").bootstrapTable('getSelections');
    console.log(checkboxTable);
    if ($("#show-model-title").html() == '<h4>' + ' 修改类目' + '</h4>') {
        var UPDATECATEGORY = {
            "productId": checkboxTable[0].categoryId,
            "productName": $("#basicinfo-input-realname").val(),
            "productPrice": $("#basicinfo-input-price").val(),
            "productStock": $("#basicinfo-input-age").val(),
            "productDescription": $("#basicinfo-input-idcardnumber").val(),
            "productIcon": $("#pic").val(),
            "categoryType": $("#select-category").val(),
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
    }
});

function getBaseOptionFun() {
    $('#select-category').empty();
    $.ajax({
        url: SELECT_CATEGORY_URL,
        type: requestJson ? 'get' : 'post',
        data: {},
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.ok) {
                console.log("--------------------")
                console.log(data)
                console.log(data.data.length)
                //遍历得到类目名称
                for (var i = 0; i < data.data.length; i++) {
                    $("#select-category").append("<option value='" + data.data[i].categoryType + "'>"
                        + data.data[i].categoryType + "</option>");
                }
                $("#select-category option:eq(0)").attr('selected', 'selected')
            }
        }
    })
}

// $("#select-category").click(function () {
//     getBaseOptionFun();
// })
// function selectFile() {
//     var form = new FormData();//通过HTML表单创建FormData对象
//
//     var files = document.getElementById('pic').files;
//     console.log(121313)
//     console.log(files[0]);
//     if (files.length == 0) {
//         return;
//     }
//     var file = files[0];
//     //把上传的图片显示出来
//     var reader = new FileReader();
//     // 将文件以Data URL形式进行读入页面
//     console.log(reader);
//     reader.readAsBinaryString(file);
//     reader.onload = function (f) {
//         var result = document.getElementById("result");
//         var src = "data:" + file.type + ";base64," + window.btoa(this.result);
//         result.innerHTML = '<img src ="' + src + '"/>';
//
//     }
//     console.log('file', file);
//     ///////////////////
//     form.append('file', file);
//     console.log(form.get('file'));
//     console.log(form.get('file').name)
//     console.log("==========")
//     console.log($("#pic").val())
//     // var xhr = new XMLHttpRequest();
//     // xhr.open("post", url, true);
// }
$("#img_input2").on("change", function (e) {
    var file = e.target.files[0]; //获取图片资源
    // 只选择图片文件
    if (!file.type.match('image.*')) {
        return false;
    }
    var reader = new FileReader();
    reader.readAsDataURL(file); // 读取文件
    // 渲染文件
    reader.onload = function (arg) {
        var img = '<img class="preview" src="' + arg.target.result + '" alt="preview"/>';
        $("#preview_box2").empty().append(img);
    }
});

