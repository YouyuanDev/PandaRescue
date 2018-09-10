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
//聊天记录显示的时间格式(参数为：列入 2018-08-08 09:09:09)
//时间差计算
function timeDifference(sj) {
    var nowt = new Date().getTime();
    var a = new Date(parseInt(sj));
    var b = new Date(parseInt(nowt));
    var date1 = Date.parse(formatTime(a, 4));
    var date2 = Date.parse(formatTime(b, 4));
    var xxsj = Math.ceil((date2 - date1) / (60 * 1000))
    if (xxsj <= 1 && xxsj >= 0) {
        return "刚刚";
    } else if (xxsj <= 10 && xxsj > 1) {
        return xxsj + "分钟前";
    } else if (xxsj <= 60 && xxsj > 10) {
        return formatTime(a, 1);
    } else if (xxsj <= 1440 && xxsj > 60) {
        return formatTime(a, 1);
    } else if (xxsj <= 10080 && xxsj > 1440) {
        return formatTime(a, 2);
    } else if (xxsj > 10080) {
        return formatTime(a, 3);
    } else {
        return formatTime(a, 3);
    }
}
//格式化时间
function formatTime(now, type) {
    var show_day = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
    var year = now.getFullYear().toString();
    var month = (now.getMonth() + 1).toString();
    var day = (now.getDate()).toString();
    var tian = now.getDay().toString();
    var hour = (now.getHours()).toString();
    var minute = (now.getMinutes()).toString();
    var second = (now.getSeconds()).toString();
    if (hour.length == 1) {
        hour = "0" + hour;
    }
    if (minute.length == 1) {
        minute = "0" + minute;
    }
    if (second.length == 1) {
        second = "0" + second;
    }
    if (type == 1) {
        var dateTime = hour + ":" + minute;
    } else if (type == 2) {
        var dateTime = show_day[tian] + " " + hour + ":" + minute
    } else if (type == 3) {
        var dateTime = year + "-" + month + "-" + day
    } else if (type == 4) {
        var dateTime = year + "/" + month + "/" + day + " " + hour + ":" + minute + ":" + second;
    } else if (type == 5) {
        var dateTime = show_day[tian];
    }
    return dateTime;
}
//字符串转date
function parseMobiDate(str) {
    if (str != undefined)
        return new Date(Date.parse(str));
    else
        return new Date();

}
//表情转换
function expressionConversion(text) {
    var msg = text;
    var reg = /\[.+?\]/g;
    //var result = text;
    var face = {
        '[微笑]': '<span><img src="../../emotion/Expression_1.png"  width="28"/></span>',
        '[撇嘴]': '<span><img src="../../emotion/Expression_2.png"  width="28" /></span>',
        '[色]': '<span><img src="../../emotion/Expression_3.png"  width="28" /></span>',
        '[发呆]': '<span><img src="../../emotion/Expression_4.png"  width="28" /></span>',
        '[得意]': '<span><img src="../../emotion/Expression_5.png"  width="28" /></span>',
        '[流泪]': '<span><img src="../../emotion/Expression_6.png"  width="28" /></span>',
        '[害羞]': '<span><img src="../../emotion/Expression_7.png"  width="28" /></span>',
        '[闭嘴]': '<span><img src="../../emotion/Expression_8.png"  width="28" /></span>',
        '[睡]': '<span><img src="../../emotion/Expression_9.png"  width="28" /></span>',
        '[大哭]': '<span><img src="../../emotion/Expression_10.png"  width="28"/></span>',
        '[尴尬]': '<span><img src="../../emotion/Expression_11.png"  width="28"/></span>',
        '[发怒]': '<span><img src="../../emotion/Expression_12.png"  width="28"/></span>',
        '[调皮]': '<span><img src="../../emotion/Expression_13.png"  width="28" /></span>',
        '[呲牙]': '<span><img src="../../emotion/Expression_14.png"  width="28" /></span>',
        '[惊讶]': '<span><img src="../../emotion/Expression_15.png"  width="28" /></span>',
        '[难过]': '<span><img src="../../emotion/Expression_16.png"  width="28" /></span>',
        '[酷]': '<span><img src="../../emotion/Expression_17.png"  width="28" /></span>',
        '[冷汗]': '<span><img src="../../emotion/Expression_18.png"  width="28" /></span>',
        '[抓狂]': '<span><img src="../../emotion/Expression_19.png"  width="28" /></span>',
        '[吐]': '<span><img src="../../emotion/Expression_20.png"  width="28" /></span>',
        '[偷笑]': '<span><img src="../../emotion/Expression_21.png"  width="28" /></span>',
        '[愉快]': '<span><img src="../../emotion/Expression_22.png"  width="28" /></span>',
        '[白眼]': '<span><img src="../../emotion/Expression_23.png"  width="28" /></span>',
        '[傲慢]': '<span><img src="../../emotion/Expression_24.png"  width="28" /></span>',
        '[饥饿]': '<span><img src="../../emotion/Expression_25.png"  width="28" /></span>',
        '[困]': '<span><img src="../../emotion/Expression_26.png"  width="28" /></span>',
        '[恐惧]': '<span><img src="../../emotion/Expression_27.png"  width="28" /></span>',
        '[流汗]': '<span><img src="../../emotion/Expression_28.png"  width="28" /></span>',
        '[憨笑]': '<span><img src="../../emotion/Expression_29.png"  width="28" /></span>',
        /*从这*/
        '[悠闲]': '<span><img src="../../emotion/Expression_30.png"  width="28" /></span>',
        '[奋斗]': '<span><img src="../../emotion/Expression_31.png"  width="28" /></span>',
        '[咒骂]': '<span><img src="../../emotion/Expression_32.png"  width="28" /></span>',
        '[疑问]': '<span><img src="../../emotion/Expression_33.png"  width="28" /></span>',
        '[嘘]': '<span><img src="../../emotion/Expression_34.png"  width="28" /></span>',
        '[晕]': '<span><img src="../../emotion/Expression_35.png"  width="28" /></span>',
        '[疯了]': '<span><img src="../../emotion/Expression_36.png"  width="28" /></span>',
        '[衰]': '<span><img src="../../emotion/Expression_37.png"  width="28" /></span>',
        '[骷髅]': '<span><img src="../../emotion/Expression_38.png"  width="28" /></span>',
        '[敲打]': '<span><img src="../../emotion/Expression_39.png"  width="28"/></span>',
        '[再见]': '<span><img src="../../emotion/Expression_40.png"  width="28"/></span>',
        '[擦汗]': '<span><img src="../../emotion/Expression_41.png"  width="28"/></span>',
        '[抠鼻]': '<span><img src="../../emotion/Expression_42.png"  width="28" /></span>',
        '[鼓掌]': '<span><img src="../../emotion/Expression_43.png"  width="28" /></span>',
        '[糗大了]': '<span><img src="../../emotion/Expression_44.png"  width="28" /></span>',
        '[坏笑]': '<span><img src="../../emotion/Expression_45.png"  width="28" /></span>',
        '[左哼哼]': '<span><img src="../../emotion/Expression_46.png"  width="28" /></span>',
        '[右哼哼]': '<span><img src="../../emotion/Expression_47.png"  width="28" /></span>',
        '[哈欠]': '<span><img src="../../emotion/Expression_48.png"  width="28" /></span>',
        '[鄙视]': '<span><img src="../../emotion/Expression_49.png"  width="28" /></span>',
        '[委屈]': '<span><img src="../../emotion/Expression_50.png"  width="28" /></span>',
        '[快哭了]': '<span><img src="../../emotion/Expression_51.png"  width="28" /></span>',
        '[阴险]': '<span><img src="../../emotion/Expression_52.png"  width="28" /></span>',
        '[亲亲]': '<span><img src="../../emotion/Expression_53.png"  width="28" /></span>',
        '[吓]': '<span><img src="../../emotion/Expression_54.png"  width="28" /></span>',
        '[可怜]': '<span><img src="../../emotion/Expression_55.png"  width="28" /></span>',
        '[菜刀]': '<span><img src="../../emotion/Expression_56.png"  width="28" /></span>',
        '[西瓜]': '<span><img src="../../emotion/Expression_57.png"  width="28" /></span>',
        '[啤酒]': '<span><img src="../../emotion/Expression_58.png"  width="28" /></span>',
        '[篮球]': '<span><img src="../../emotion/Expression_59.png"  width="28" /></span>',
        '[乒乓]': '<span><img src="../../emotion/Expression_60.png"  width="28" /></span>',
        '[咖啡]': '<span><img src="../../emotion/Expression_61.png"  width="28" /></span>',
        '[饭]': '<span><img src="../../emotion/Expression_62.png"  width="28" /></span>',
        '[猪头]': '<span><img src="../../emotion/Expression_63.png"  width="28" /></span>',
        '[玫瑰]': '<span><img src="../../emotion/Expression_64.png"  width="28" /></span>',
        '[凋谢]': '<span><img src="../../emotion/Expression_65.png"  width="28" /></span>',
        '[嘴唇]': '<span><img src="../../emotion/Expression_66.png"  width="28" /></span>',
        '[爱心]': '<span><img src="../../emotion/Expression_67.png"  width="28" /></span>',
        '[心碎]': '<span><img src="../../emotion/Expression_68.png"  width="28"/></span>',
        '[蛋糕]': '<span><img src="../../emotion/Expression_69.png"  width="28"/></span>',
        '[闪电]': '<span><img src="../../emotion/Expression_70.png"  width="28"/></span>',
        '[炸弹]': '<span><img src="../../emotion/Expression_71.png"  width="28" /></span>',
        '[刀]': '<span><img src="../../emotion/Expression_72.png"  width="28" /></span>',
        '[足球]': '<span><img src="../../emotion/Expression_73.png"  width="28" /></span>',
        '[瓢虫]': '<span><img src="../../emotion/Expression_74.png"  width="28" /></span>',
        '[便便]': '<span><img src="../../emotion/Expression_75.png"  width="28" /></span>',
        '[月亮]': '<span><img src="../../emotion/Expression_76.png"  width="28" /></span>',
        '[太阳]': '<span><img src="../../emotion/Expression_77.png"  width="28" /></span>',
        '[礼物]': '<span><img src="../../emotion/Expression_78.png"  width="28" /></span>',
        '[拥抱]': '<span><img src="../../emotion/Expression_79.png"  width="28" /></span>',
        '[强]': '<span><img src="../../emotion/Expression_80.png"  width="28" /></span>',
        '[弱]': '<span><img src="../../emotion/Expression_81.png"  width="28" /></span>',
        '[握手]': '<span><img src="../../emotion/Expression_82.png"  width="28" /></span>',
        '[胜利]': '<span><img src="../../emotion/Expression_83.png"  width="28" /></span>',
        '[抱拳]': '<span><img src="../../emotion/Expression_84.png"  width="28" /></span>',
        '[勾引]': '<span><img src="../../emotion/Expression_85.png"  width="28" /></span>',
        '[拳头]': '<span><img src="../../emotion/Expression_86.png"  width="28" /></span>',
        '[差劲]': '<span><img src="../../emotion/Expression_87.png"  width="28" /></span>',
        '[爱你]': '<span><img src="../../emotion/Expression_88.png"  width="28" /></span>',
        '[NO]': '<span><img src="../../emotion/Expression_89.png"  width="28" /></span>',
        '[OK]': '<span><img src="../../emotion/Expression_90.png"  width="28" /></span>',
        '[爱情]': '<span><img src="../../emotion/Expression_91.png"  width="28" /></span>',
        '[飞吻]': '<span><img src="../../emotion/Expression_92.png"  width="28" /></span>',
        '[跳跳]': '<span><img src="../../emotion/Expression_93.png"  width="28" /></span>',
        '[发抖]': '<span><img src="../../emotion/Expression_94.png"  width="28" /></span>',
        '[怄火]': '<span><img src="../../emotion/Expression_95.png"  width="28" /></span>',
        '[转圈]': '<span><img src="../../emotion/Expression_96.png"  width="28" /></span>',
        '[磕头]': '<span><img src="../../emotion/Expression_97.png"  width="28"/></span>',
        '[回头]': '<span><img src="../../emotion/Expression_98.png"  width="28"/></span>',
        '[跳绳]': '<span><img src="../../emotion/Expression_99.png"  width="28"/></span>',
        '[投降]': '<span><img src="../../emotion/Expression_100.png"  width="28" /></span>',
        '[激动]': '<span><img src="../../emotion/Expression_101.png"  width="28" /></span>',
        '[街舞]': '<span><img src="../../emotion/Expression_102.png"  width="28" /></span>',
        '[献吻]': '<span><img src="../../emotion/Expression_103.png"  width="28" /></span>',
        '[左太极]': '<span><img src="../../emotion/Expression_104.png"  width="28" /></span>',
        '[右太极]': '<span><img src="../../emotion/Expression_105.png"  width="28" /></span>'
    };
    str = msg.replace(reg, function(a, b) {
        return face[a] ? face[a] : a;
    });
    return str;
}
//json格式转换
function transExtra(arg) {
    var result = '';
    try {
        result = eval('(' + arg + ')');
    } catch (e) {
        result = arg.slice(1, -1);
    } finally {}
    return result;
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
    if(sec<=0){
      return "<1";
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
//清空setStorage
function clearStorage() {
    $api.rmStorage('g_service_type_dict');
    $api.rmStorage('g_failure_type_dict');
    $api.rmStorage('g_order_status');
}

//加载服务类型
function loadAllServiceType() {
    //查看本地是否已经存在，不存在请求服务器，存在就直接获取
    var g_service_type_dict = {};
    var dict = $api.getStorage('g_service_type_dict');
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
                $api.setStorage('g_service_type_dict', g_service_type_dict);
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
    var dict = $api.getStorage('g_failure_type_dict');
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
        }, function(rets, err) {
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
                $api.setStorage('g_failure_type_dict', g_failure_type_dict);
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
    var dict = $api.getStorage('g_order_status');
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
        }, function(ret, err) {
            if (ret) {
                for (var i = 0; i < ret.length; i++) {
                    var status_code = ret[i].status_code;
                    var status_name = ret[i].status_name;
                    var status_name_en = ret[i].status_name_en;
                    g_order_status[status_code] = {
                        "status_name": status_name,
                        "status_name_en": status_name_en
                    };
                }
                $api.setStorage('g_order_status', g_order_status);
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
    var imgurl = 'http://' + serverIP + '/images/default_portrait.png';
    e.src = imgurl;
    e.onerror = null;
}
//获取当前用户token
function setToken() {
    try {
        var account = $api.getStorage('g_account');
        if (account != undefined) {
            var userId = account.id; //会员id
            var name = account.nickname; //会员昵称
            var portraitUri = 'http://' + serverIP + '/upload/pictures/' + account.icon_url; //会员头像
            var appKey = "4z3hlwrv4omet";
            var appSecret = "IejI9Cs6qfTCU";
            var nonce = Math.floor(Math.random() * 1000000); //随机数
            var timestamp = Date.now(); //时间戳
            var signature = sha1("" + appSecret + nonce + timestamp); //数据签名(通过哈希加密计算)
            api.ajax({
                url: "http://api.cn.ronghub.com/user/getToken.json",
                method: "post",
                headers: {
                    "RC-App-Key": appKey,
                    "RC-Nonce": "" + nonce,
                    "RC-Timestamp": "" + timestamp,
                    "RC-Signature": "" + signature,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: {
                    values: {
                        userId: userId,
                        name: name,
                        portraitUri: portraitUri
                    }
                }
            }, function(ret, err) {
                if (ret) {
                    $api.setStorage('token', ret.token);
                    $api.setStorage('zh', name);
                    $api.setStorage('id', userId);
                    $api.setStorage('tx', portraitUri);
                } else {
                    toastFail("获取token失败");
                }
            });
        }
    } catch (e) {}
}
//获取本地存储的token
function getToken() {
    var token = $api.getStorage('token');
    return token;
}
//获取本地账户信息
function getAccount() {
    var account;
    try {
        var account1 = $api.getStorage('g_account');
        if (account1 != undefined) {
            account = account1;
        }
    } catch (e) {}
    return account;
}
//中英文提示转换(参数:中文,英文)
function GetTextByLanguage(chTxt,enTxt){
   var language=getCookie();
   if(language==undefined||language=="zh-CN"|| language == ""){
     return chTxt;
   }else if(language=="en"){
     return enTxt;
   }
}
//判断字符串是否是undefined或空字符串
function isUndefinedOrEmpty(str){
  str=str+"";
  if(str==undefined||str.trim()==""){
    return true;
  }else{
    return false;
  }
}
