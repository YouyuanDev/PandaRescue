var header, headerHeight = 0;
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

function closeWindow(){
   api.closeWin();
}

//检查用户是否有网络
function checkNetWork(){
  var connectionType = api.connectionType;
  if(connectionType=="none"){
    api.alert({
        msg:"无网络连接!"
    });
  }
}
//图片上传
function selectPicture(){
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
function ClearLoadingPicture() {
    var uiloading = api.require('UILoading');
    uiloading.closeFlower({
        id: g_loadingID
    });
    g_loadingID = 0;
}
