const qiniu = require('qiniu');
const mime = require('mime');
const path = require('path');
const {respSuccess, respFail} = require('./utils');
// 文件上传
function qiniuCloud(config) {
    if (!config.accessKey || !config.secretKey || !config.bucket) {
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
    this.mac = new qiniu.auth.digest.Mac(this.accessKey, this.secretKey);
    const putPolicy = new qiniu.rs.PutPolicy(options);
    this.uploadToken = putPolicy.uploadToken(this.mac);

    const qiniuConfig = new qiniu.conf.Config();
    // 空间对应的机房
    qiniuConfig.zone = qiniu.zone[this.zone];

    this.formUploader = new qiniu.form_up.FormUploader(qiniuConfig);
}

qiniuCloud.prototype.cdnRefresh = function (list) {
    const cdnManager = new qiniu.cdn.CdnManager(this.mac);
    return new Promise((resolve, reject) => {
        cdnManager.refreshUrls(list, function (err, respBody, respInfo) {
            if (err) {
                reject(respFail(err));
                return;
            }
            if (respInfo.statusCode == 200) {
                const jsonBody = JSON.parse(respBody);
                resolve(respSuccess(jsonBody));
                //   console.log(jsonBody.code);
                //   console.log(jsonBody.error);
                //   console.log(jsonBody.requestId);
                //   console.log(jsonBody.invalidUrls);
                //   console.log(jsonBody.invalidDirs);
                //   console.log(jsonBody.urlQuotaDay);
                //   console.log(jsonBody.urlSurplusDay);
                //   console.log(jsonBody.dirQuotaDay);
                //   console.log(jsonBody.dirSurplusDay);
            } else {
                resolve({
                    code: respInfo.statusCode,
                    msg: 'error'
                })
            }
        });
    })
}

qiniuCloud.prototype.upload = function (list) {
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


qiniuCloud.prototype.uploadPromise = function (url) {
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
                reject(respFail(respErr));
            }
            if (respInfo.statusCode == 200) {
                resolve(respSuccess(_this.hostUrl + name));
            } else {
                resolve({
                    code: respInfo.statusCode,
                    msg: 'error'
                });
            }
        });
    })
}

module.exports = qiniuCloud;