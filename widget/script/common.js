var header, headerHeight = 0;
var serverIP = '192.168.0.102:8080';

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
    //alert(toString.call(value));
    if (value != undefined && value != null)
        return getDateOnly(value);
    else
        return "";
}

function getDateOnly(str) {
    var oDate = new Date(str);
    y = oDate.getFullYear();
    m = oDate.getMonth() + 1;
    d = oDate.getDate();
    return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
}

function getDate1(str) {
    var oDate = new Date(str);
    y = oDate.getFullYear();
    m = oDate.getMonth() + 1;
    d = oDate.getDate();
    h = oDate.getHours();
    mins = oDate.getMinutes();
    s = oDate.getSeconds();
    return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d) + ' ' + (h < 10 ? ('0' + h) : h) + ':' + (mins < 10 ? ('0' + mins) : mins) + ':' + (s < 10 ? ('0' + s) : s);
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
                var s = 'http://' + serverIP + '/UploadFile/uploadPicture.action';
                DoLoadingPicture();
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
                }, function(rets, errs) {
                    ClearLoadingPicture();
                    if (rets) {
                        $('.imgBox').append(pictureTemplate(rets.imgUrl, ret.base64Data));
                        alert("上传成功!");
                    } else {
                        api.alert({
                            msg: JSON.stringify(errs)
                        });
                    }
                });
            } else {
                alert(JSON.stringify(err));
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
                var s = 'http://' + serverIP + '/UploadFile/uploadPicture.action';
                DoLoadingPicture();
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
                }, function(rets, errs) {
                    ClearLoadingPicture();
                    if (rets) {
                        $('.imgBox').append(pictureTemplate(rets.imgUrl, ret.base64Data));
                        alert("上传成功!");
                    } else {
                        api.alert({
                            msg: JSON.stringify(errs)
                        });
                    }
                });
            } else {
                alert(JSON.stringify(err));
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
//loading动画效果
function DoLoadingPicture() {
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

//计算模板中所需直线距离
function getDistance(num) {
    if (num != undefined && !isNaN(num)) {
        num = num / 1000.0;
        num = num.toFixed(2);
    }
    return num;
}
//秒转分钟
function convertSecToMin(sec){
  if (sec != undefined && !isNaN(sec)) {
      sec = sec / 60;
      sec = sec.toFixed(0);
  }
  return sec;
}


function ClearLoadingPicture() {
    var uiloading = api.require('UILoading');
    uiloading.closeFlower({
        id: g_loadingID
    });
    g_loadingID = 0;
}
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
    var template = '<div class="pr-empty">' + con + '</div>';
    return template;
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
            alert(username + "bind成功");
            toastSuccess(username + "bind成功");
        } else {
            alert(username+ "bind"+err.msg);
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
            alert('解除绑定成功');
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
            alert(s);
            toastSuccess(s);
        } else {
             alert('加入组'+err.msg);
            toastFail(err.msg);
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
            alert(s);
            toastSuccess(s);
        } else {
            toastFail(err.msg);
        }
    });
}
