# qiniucloud
package for upload to qiniu cloud

# Install 

```
npm i qiniu-node
```

# Usage 
https://developer.qiniu.com/kodo/sdk/1289/nodejs#5

zone: 
// 华东	qiniu.zone.Zone_z0
// 华北	qiniu.zone.Zone_z1
// 华南	qiniu.zone.Zone_z2
// 北美	qiniu.zone.Zone_na0

```
const qiniuUpload = require('qiniu-node');
const qiniuNode = new qiniuUpload({
    accessKey: 'XXXXXXX',  
    secretKey: 'XXXXXXX',  // key
    zone: 'Zone_z2', 
    bucket: 'chat',   // bucket name
    dir: 'test/',     // 
    url: 'http://pdlu3e6ll.bkt.clouddn.com/',
})

qiniuO.upload(fileList); // fileList is a list of local url

```

# Api

**qiniuNode.upload**

- options`<Object>`
    - `accessKey`   `<String><required>`  key
    - `secretKey`   `<String><required>`  key
    - `zone`        `<String><required>`  location 
    - `bucket`      `<String><required>`  you apply for space
    - `dir`          if you want to diff the project, it can help you
    - `url`          you host url


**qiniuNode.cdnRefresh**

- options`<String>`
    - `list`   `<Array<String>><required>`  refresh url
