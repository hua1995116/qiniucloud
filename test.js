const fs = require('fs');
const path = require('path');
const qiniuUpload = require('./src/index');
const URL = './img';

const files = fs.readdirSync(URL);
const fileList = files.map(item => path.join(URL, item));

const qiniuO = new qiniuUpload({
    accessKey: '',
    secretKey: '',
    zone: 'Zone_z2',
    bucket: 'chat',
    dir: 'test/',
    url: 'http://pdlu3e6ll.bkt.clouddn.com/',
})

qiniuO.upload(fileList);