/**
 *@desc 商品管理-新增管理
 */

var SELECT_CATEGORY_URL = requestUrl + "api/generate/productCategory/selectProductCategory" //类目查询
var INSERT_PRODUCT_URL = requestUrl + "api/generate/productInfo/addProductInfo"; //url地址 商品新增
var IMG_URL = requestUrl + "api/generate/productInfo/imgUpload"; //url地址 上传照片

$(function () {
    $('#select-category').empty();
    $.ajax({
        url: SELECT_CATEGORY_URL,
        type: requestJson ? 'get' : 'post',
        data: {},
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.ok) {
                console.log(data)
                //遍历得到类目名称
                for (var i = 0; i < data.data.length; i++) {
                    $("#select-category").append("<option value='" + data.data[i].categoryType + "'>"
                        + data.data[i].categoryType + "</option>");
                }
                $("#select-category option:eq(0)").attr('selected', 'selected')
            }
        }
    })
})

$("#img_input2").on("change", function (e) {
    var file = e.target.files[0]; //获取图片资源
    // 只选择图片文件
    if (!file.type.match('image.*')) {
        return false;
    }
    // $("#preview_box2").val("../../images/" + file.name);
    // console.log($("#preview_box2").val());
    var reader = new FileReader();
    reader.readAsDataURL(file); // 读取文件
    // 渲染文件
    reader.onload = function (arg) {
        var name = file.name;
        var img = '<img class="preview" src="' + arg.target.result + '" alt="preview"/>';
        $("#preview_box2").empty().append(img);
        // console.log($("img").attr("src"));
        var src = $("img").attr("src");
        $.ajax({
            url: IMG_URL,
            type: requestJson ? 'get' : 'post',
            data: {
                data: src,
                name: name
            },
            dataType: "json",
            // contentType: "application/json;charset=utf-8",
            success: function (data) {
                console.log(data)
                $("#preview_box2").val(data.data);
                console.log($("#preview_box2").val())
            }
        })
    }

});

//录入
$("#saveProduct").click(function () {
    var result = {
        productName: $("#product-name").val(),
        productPrice: $("#product-price").val(),
        productStock: $("#product-stock").val(),
        productDescription: $("#product-idcardnumber").val(),
        productIcon: $("#preview_box2").val(),
        categoryType: $("#select-category").val()
    }

    $.ajax({
        url: INSERT_PRODUCT_URL,
        type: requestJson ? 'get' : 'post',
        data: JSON.stringify(result),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.ok) {
                poptip.alert(POP_TIP.addSuccess);
                $("#add-modal").modal("hide");
                $('#show-table-distributor-users').bootstrapTable("refresh");
            } else {
                poptip.alert(POP_TIP.saveFail);
                $("#add-modal").modal("hide");
                $('#show-table-distributor-users').bootstrapTable("refresh");
            }
        }
    })
})

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
//     console.log(file.name)
//     reader.readAsBinaryString(file);
//     reader.onload = function (f) {
//         var result = document.getElementById("result");
//         var src = "data:" + file.type + ";base64," + window.btoa(this.result);
//         result.innerHTML = '<img id="img" src ="' + src + '"/>';
//         $("#pic").text(src)
//         // $.ajax({
//         //     url: IMG_URL,
//         //     type: requestJson ? 'get' : 'post',
//         //     data: {
//         //         data: src,
//         //         fileName: file.name
//         //     },
//         //     dataType: "json",
//         //     // contentType: "application/json;charset=utf-8",
//         //     success: function (value) {
//         //         console.log("上传文件返回")
//         //         console.log(value)
//         //         $("#pic").text(src)
//         //     }
//         // })
//     }
//     form.append('file', file);
//     console.log(form.get('file').name)
//     console.log("==========")
//     // var before = "../../images/" + form.get('file').name;
//     //
//     // $("#pic").text(before);
//     console.log($("#pic").text())
// }


