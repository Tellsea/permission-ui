// 后台服务地址
const adminServerPath ='http://localhost:8080';
const adminServer = {
    swagger: adminServerPath + '/swagger-ui.html',
    druid: adminServerPath + '/druid'
};

// 文件服务地址
const fileServerPath = 'http://localhost:8082';
const fileServer = {
    browse: fileServerPath,
    upload: fileServerPath + '/upload'
};

const consts = {
    // 授权token
    token: 'token',
    // 用户信息
    userInfo: 'userInfo',
    // 侧边栏
    menuList: 'menuList'
};

export {
    adminServer,
    fileServer,
    consts
}