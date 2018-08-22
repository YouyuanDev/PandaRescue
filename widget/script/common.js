var header, headerHeight = 0,
    g_loadingID;
var serverIP = '192.168.0.12:8080';

function fnSettingHeader() {
    var sType = api.systemType;
    var header = $api.byId('header');
    if (sType == "ios") {
        $api.fixIos7Bar(header);

    } else if (sType == "android") {
        $api.fixStatusBar(header);
    }
}

function fnReadyFrame() {
    var nav = $api.byId('header');
    var navHeight = $api.offset(nav).h;
    var frameName = api.winName + '_frame';
    api.openFrame({
        name: frameName,
        url: './' + frameName + '.html',
        bounces: true,
        rect: {
            x: 0,
            y: navHeight,
            w: 'auto',
            h: 'auto'
        },
        vScrollBarEnabled: false
    });
};

function JudgeLogin() {
    //$api.rmStorage('operatorno');
    var userInfo = $api.getStorage('operatorno');
    if (userInfo != undefined) {
        return true;
    } else {
        return false;
    }

}

function formatterdate(value, row, index) {
    if (value != undefined && value != null)
        return getDateOnly(value);
    else
        return "";
}

function getDateOnly(str) {
    if (str != undefined && str != "") {
        var oDate = new Date(str);
        y = oDate.getFullYear();
        m = oDate.getMonth() + 1;
        d = oDate.getDate();
        return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
    } else {
        return "";
    }
}

function getDate1(str) {
    if (str != undefined && str != "") {
        var oDate = new Date(str);
        y = oDate.getFullYear();
        m = oDate.getMonth() + 1;
        d = oDate.getDate();
        h = oDate.getHours();
        mins = oDate.getMinutes();
        s = oDate.getSeconds();
        return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d) + ' ' + (h < 10 ? ('0' + h) : h) + ':' + (mins < 10 ? ('0' + mins) : mins) + ':' + (s < 10 ? ('0' + s) : s);
    } else {
        return "";
    }
}



//字符串转date
function parseMobiDate(str) {
    if (str != undefined)
        return new Date(Date.parse(str));
    else
        return new Date();

}

function closeWindow() {
    api.closeWin();
}

//检查用户是否有网络
function checkNetWork() {
    var connectionType = api.connectionType;
    if (connectionType == "none") {
        api.alert({
            msg: "无网络连接!"
        });
    }
}
//图片上传
function selectPicture() {
    api.actionSheet({
        title: '上传图片',
        cancelTitle: '取消',
        buttons: ['拍照', '从手机相册选择']
    }, function(ret, err) {
        if (ret) {
            getPicture(ret.buttonIndex);
        }
    });
}

function getPicture(sourceType) {
    if (sourceType == 1) { // 拍照
        api.getPicture({
            sourceType: 'camera',
            encodingType: 'jpg',
            mediaValue: 'pic',
            allowEdit: false,
            destinationType: 'base64',
            quality: 90,
            saveToPhotoAlbum: true
        }, function(ret, err) {
            if (ret) {
                if (ret.data != undefined) {
                    openLoading();
                    var s = 'http://' + serverIP + '/UploadFile/uploadPicture.action';
                    api.ajax({
                        url: s,
                        method: 'post',
                        data: {
                            values: {
                                name: 'haha'
                            },
                            files: {
                                file: ret.data
                            }
                        }
                    }, function(ret, err) {
                        closeLoading();
                        if (ret) {
                            if (ret.imgUrl != undefined && ret.imgUrl != "") {
                                api.sendEvent({
                                    name: 'UploadPictureEvent',
                                    extra: {
                                        imgUrl: ret.imgUrl
                                    }
                                });
                                toastSuccess("上传成功!");
                            } else {
                                toastFail("上传失败!");
                            }
                        } else {
                          toastFail("系统错误,上传照片失败!错误码:" + err.code);
                        }
                    });
                }
            } else {
                toastFail(err.msg);
            }
        });
    } else if (sourceType == 2) { // 从相机中选择
        api.getPicture({
            sourceType: 'library',
            encodingType: 'jpg',
            mediaValue: 'pic',
            destinationType: 'base64',
            quality: 50,
            targetWidth: 750,
            targetHeight: 750
        }, function(ret, err) {
            if (ret) {
                if (ret.data != undefined) {
                    var s = 'http://' + serverIP + '/UploadFile/uploadPicture.action';
                    openLoading();
                    api.ajax({
                        url: s,
                        method: 'post',
                        data: {
                            values: {
                                name: 'haha'
                            },
                            files: {
                                file: ret.data
                            }
                        }
                    }, function(ret, errs) {
                        closeLoading();
                        if (ret) {
                            if (ret.imgUrl != undefined && ret.imgUrl != "") {
                                api.sendEvent({
                                    name: 'UploadPictureEvent',
                                    extra: {
                                        imgUrl: ret.imgUrl
                                    }
                                });
                                toastSuccess("上传成功!");
                            } else {
                                toastFail("上传失败!");
                            }
                        } else {
                          toastFail("系统错误,上传照片失败!错误码:" + err.code);
                        }
                    });
                }
            } else {
                toastFail(err.msg);
            }
        });
    }
}
//图片模板
function pictureTemplate(imgUrl, imgData) {
    var template = '<div class="temp-container">' +
        '<div onclick="delSelectPicture(this)" class="temp-del-icon">x</div>' +
        '<img id="imgUp" data-url="' + imgUrl + '" src="' + imgData + '"/>' +
        '</div>';
    return template;
}
//删除选择的照片
function delSelectPicture(obj) {
    var picUrl = $(obj).siblings('img').attr('data-url');
    $(obj).parent().remove();
}
//打开加载进度条
function openLoading() {
    var UILoading = api.require('UILoading');
    UILoading.flower({
        center: {
            x: api.winWidth / 2.0,
            y: api.winHeight / 2.0
        },
        size: 30,
        mask: 'rgba(0,0,0,0.5)',
        fixed: true
    }, function(ret) {
        //alert(JSON.stringify(ret));
        g_loadingID = ret.id;
    });
}
//关闭加载进度条
function closeLoading() {
    var uiloading = api.require('UILoading');
    uiloading.closeFlower({
        id: g_loadingID
    });
    g_loadingID = 0;
}
//计算模板中所需直线距离
function getDistance(num) {
    if (num != undefined && !isNaN(num)) {
        num = num / 1000.0;
        num = num.toFixed(2);
    }
    return num;
}
//秒转分钟
function convertSecToMin(sec) {
    if (sec != undefined && !isNaN(sec)) {
        sec = sec / 60;
        sec = sec.toFixed(0);
    }
    return sec;
}

// function ClearLoadingPicture() {
//     var uiloading = api.require('UILoading');
//     uiloading.closeFlower({
//         id: g_loadingID
//     });
//     g_loadingID = 0;
// }
//验证手机号是否合法
function isPhoneNo(phone) {
    var pattern = /^1[34578]\d{9}$/;
    return pattern.test(phone);
}
//验证密码是否合法
function isPassword(password) {
    var pattern = /^[0-9a-zA-Z_]{6,15}$/;
    return pattern.test(password);
}
//正确消息弹出框
function toastSuccess(txt) {
    api.toast({
        msg: txt,
        duration: 2000,
        location: 'middle'
    });
}
//错误消息弹出框
function toastFail(txt) {
    api.toast({
        msg: txt,
        duration: 2000,
        location: 'middle'
    });
}
//数据为空时的模板
function makeEmptyTemplate(con) {
    // var template = '<div class="pr-empty">' + con + '</div>';
    // return template;
}

//绑定Push推送
function bindPush(username) {
    var push = api.require('push');
    push.bind({
        userName: username,
        userId: username
            // userName: api.deviceId,
            // userId: api.deviceId
    }, function(ret, err) {
        if (ret.status == true) {
            toastSuccess(username + "bind成功");
            toastSuccess(username + "bind成功");
        } else {
            toastFail(username + "bind" + err.msg);
            toastFail(err.msg);
        }
    });
}

//解除绑定Push推送
function unbindPush(username) {
    var push = api.require('push');
    push.unbind({
        userName: username,
        userId: username
    }, function(ret, err) {
        if (ret.status) {
            toastSuccess('解除绑定成功');
        } else {
            toastFail(err.msg);
        }
    });
}
// 加入推送群组
function joinPushGroup(groupName) {

    var push = api.require('push');
    //加入组
    push.joinGroup({
        groupName: groupName
    }, function(ret, err) {
        if (ret.status) {
            var s = '加入组' + groupName + '成功';
            toastSuccess(s);
        } else {
            toastFail('加入组' + err.msg);
        }
    });
    push.setPreference({
        notify: true,
        updateCurrent: false
    });
}
// 退出推送群组
function leaveAllPushGroup() {
    var push = api.require('push');
    push.leaveAllGroup(function(ret, err) {
        if (ret) {
            var s = '退出所有组成功';
            toastSuccess(s);
        } else {
            toastFail(err.msg);
        }
    });
}

//加载服务类型
function loadAllServiceType() {
    //查看本地是否已经存在，不存在请求服务器，存在就直接获取
    var g_service_type_dict = {};
    var dict = api.getPrefs({
        sync: true,
        key: 'g_service_type_dict'
    });
    var length = 0;
    for (var ever in dict) {
        length++;
    }
    if (dict != undefined && length > 0) {
        g_service_type_dict = dict;
        api.sendEvent({
            name: 'GetAllServiceTypeEvent',
            extra: {
                g_service_type_dict: g_service_type_dict
            }
        });
    } else {
        var s = 'http://' + serverIP + '/ServiceType/getAllServiceType.action';
        api.ajax({
            url: s,
            method: 'post'
        }, function(rets, err) {
            if (rets) {
                for (var i = 0; i < rets.length; i++) {
                    var service_type_code = rets[i].service_type_code;
                    var service_type_name = rets[i].service_type_name;
                    var service_type_name_en = rets[i].service_type_name_en;
                    g_service_type_dict[service_type_code] = {
                        "service_type_name": service_type_name,
                        "service_type_name_en": service_type_name_en
                    };
                }
                api.setPrefs({
                    key: 'g_service_type_dict',
                    value: g_service_type_dict
                });
                api.sendEvent({
                    name: 'GetAllServiceTypeEvent',
                    extra: {
                        g_service_type_dict: g_service_type_dict
                    }
                });
            } else {
               toastFail("系统错误,加载服务类型失败!错误码:" + err.code);
            }
        });
    }
}
//加载故障类型
function loadAllFaultType() {
    //查看本地是否已经存在，不存在请求服务器，存在就直接获取
    var g_failure_type_dict = {};
    var dict = api.getPrefs({
        sync: true,
        key: 'g_failure_type_dict'
    });
    var length = 0;
    for (var ever in dict) {
        length++;
    }
    if (dict != undefined && length > 0) {
        g_failure_type_dict = dict;
        api.sendEvent({
            name: 'GetAllFailureTypeEvent',
            extra: {
                g_failure_type_dict: g_failure_type_dict
            }
        });
    } else {
        var s = 'http://' + serverIP + '/FailureType/getAllFailureType.action';
        api.ajax({
            url: s,
            method: 'post'
        }, function(rets, errs) {
            if (rets) {
                for (var i = 0; i < rets.length; i++) {
                    var failure_type_code = rets[i].failure_type_code;
                    var failure_type_name = rets[i].failure_type_name;
                    var failure_type_name_en = rets[i].failure_type_name_en;
                    g_failure_type_dict[failure_type_code] = {
                        "failure_type_name": failure_type_name,
                        "failure_type_name_en": failure_type_name_en
                    };
                }
                api.setPrefs({
                    key: 'g_failure_type_dict',
                    value: g_failure_type_dict
                });
                api.sendEvent({
                    name: 'GetAllFailureTypeEvent',
                    extra: {
                        g_failure_type_dict: g_failure_type_dict
                    }
                });
            } else {
                 toastFail("系统错误,加载故障类型失败!错误码:" + err.code);
            }
        });
    }
}
//加载所有订单状态类型
function loadAllOrderStatus() {
    //查看本地是否已经存在，不存在请求服务器，存在就直接获取
    var g_order_status = {};
    var dict = api.getPrefs({
        sync: true,
        key: 'g_order_status'
    });
    var length = 0;
    for (var ever in dict) {
        length++;
    }
    if (dict != undefined && length > 0) {
        g_order_status = dict;
        api.sendEvent({
            name: 'GetAllOrderStatusEvent',
            extra: {
                g_order_status: g_order_status
            }
        });
    } else {
        var s = 'http://' + serverIP + '/Order/getAllOrderStatusForAPP.action';
        api.ajax({
            url: s,
            method: 'post'
        }, function(rets, errs) {
            if (rets) {
                for (var i = 0; i < rets.length; i++) {
                    var status_code = rets[i].status_code;
                    var status_name = rets[i].status_name;
                    var status_name_en = rets[i].status_name_en;
                    g_order_status[status_code] = {
                        "status_name": status_name,
                        "status_name_en": status_name_en
                    };
                }
                api.setPrefs({
                    key: 'g_order_status',
                    value: g_order_status
                });
                api.sendEvent({
                    name: 'GetAllOrderStatusEvent',
                    extra: {
                        g_order_status: g_order_status
                    }
                });
            } else {
                toastFail("系统错误,加载所有订单状态类型失败!错误码:" + err.code);
            }
        });
    }
}
//判断图片是否有效
function imgExists(e) {
    var imgurl='../../image/default_portrait.png';
    var ImgObj = new Image(); //判断默认图片是否存在
    ImgObj.src = imgurl;
    //没有图片，则返回-1
    if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
        e.src=imgurl;
    } else {
        e.onerror=null;
    }
}
