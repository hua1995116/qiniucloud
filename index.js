const qiniu = require('qiniu');
const mime = require('mime');
const path = require('path');
// 文件上传
function qiniuCloud(config) {
    if(!config.accessKey || !config.secretKey || !config.bucket) {
        console.log('params error!');
        return;
    }
    this.accessKey = config.accessKey || '';
    this.secretKey = config.secretKey || '';
    this.zone = config.zone || 'Zone_z2';
    this.bucket = config.bucket || '';
    this.hostUrl = config.url || '';
    this.dir = config.dir || '';
    const options = {
        scope: this.bucket,
    };
    const mac = new qiniu.auth.digest.Mac(this.accessKey, this.secretKey);
    const putPolicy = new qiniu.rs.PutPolicy(options);
    this.uploadToken = putPolicy.uploadToken(mac);
    
    const qiniuConfig = new qiniu.conf.Config();
    // 空间对应的机房
    qiniuConfig.zone = qiniu.zone[this.zone];
    
    this.formUploader = new qiniu.form_up.FormUploader(qiniuConfig);
}

qiniuCloud.prototype.upload = function(list) {
    const promiselist = list.map((item) => {
        return this.uploadPromise(item);
    })
    return Promise.all(promiselist).then((res) => { 
        console.log(res);
        console.log('上传完成!');
        return res;
    }).catch(err => {
        console.log('上传失败!');
    })
}


qiniuCloud.prototype.uploadPromise = function(url) {
    const name = this.dir + path.basename(url);
    const mimeType = mime.getType(name);
    return new Promise((resolve, reject) => {
        const putExtra = new qiniu.form_up.PutExtra({
            mimeType,
        });
        const _this = this;
        this.formUploader.putFile(this.uploadToken, name, url, putExtra, function (respErr,
            respBody, respInfo) {
            if (respErr) {
                reject(respErr);
            }
            if (respInfo.statusCode == 200) {
                resolve(_this.hostUrl + name);
            } else {
                console.log(respInfo)
                resolve('error');
            }
        });
    })
}

module.exports = qiniuCloud;