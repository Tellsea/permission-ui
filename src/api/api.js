import axios from 'axios'
import Qs from 'qs'
import store from "../store";

const instance = axios.create({
    baseURL: '/api',
    timeout: 60000,
    headers: {
        'Accept': 'application/json',
        Authorization: store.state.token
    }
});

/** ------------------------- 登录 ------------------------------- */
// 登录
export const login = params => {
    return instance.post(`/login`, Qs.stringify(params))
};
// 测试请求头
export const createMenu = params => {
    return instance.post(`/createMenu`, Qs.stringify(params))
};
/** ------------------------- 用户表 ------------------------------- */
// 用户列表
export const userInfoList = params => {
    return instance.post(`/userInfo/list`, Qs.stringify(params))
};
// 新增用户
export const saveUserInfo = params => {
    return instance.post(`/userInfo/save`, Qs.stringify(params))
};
// 根据id查询用户
export const getUserInfoById = params => {
    return instance.post(`/userInfo/getById`, Qs.stringify(params))
};
// 更新用户
export const updateUserInfo = params => {
    return instance.post(`/userInfo/update`, Qs.stringify(params))
};
// 删除用户
export const deleteUserInfo = params => {
    return instance.post(`/userInfo/delete`, Qs.stringify(params))
};

/** ------------------------- 角色表 ------------------------------- */
// 所有角色
export const roleInfoListAll = () => {
    return instance.get(`/roleInfo/listByAll`)
};
// 角色列表
export const roleInfoList = params => {
    return instance.post(`/roleInfo/list`, Qs.stringify(params))
};
// 新增角色
export const saveRoleInfo = params => {
    return instance.post(`/roleInfo/save`, Qs.stringify(params))
};
// 根据id查询角色
export const getRoleInfoById = params => {
    return instance.post(`/roleInfo/getById`, Qs.stringify(params))
};
// 更新角色
export const updateRoleInfo = params => {
    return instance.post(`/roleInfo/update`, Qs.stringify(params))
};
// 删除角色
export const deleteRoleInfo = params => {
    return instance.post(`/roleInfo/delete`, Qs.stringify(params))
};

/** ------------------------- 资源表 ------------------------------- */
// 资源树
export const resourceInfoTree = () => {
    return instance.get(`/resourceInfo/tree`)
};
// 角色列表
export const resourceInfoList = params => {
    return instance.post(`/resourceInfo/list`, Qs.stringify(params))
};
// 新增角色
export const saveResourceInfo = params => {
    return instance.post(`/resourceInfo/save`, Qs.stringify(params))
};
// 根据id查询角色
export const getResourceInfoById = params => {
    return instance.post(`/resourceInfo/getById`, Qs.stringify(params))
};
// 更新角色
export const updateResourceInfo = params => {
    return instance.post(`/resourceInfo/update`, Qs.stringify(params))
};
// 删除角色
export const deleteResourceInfo = params => {
    return instance.post(`/resourceInfo/delete`, Qs.stringify(params))
};

/** ------------------------- 登录日志表 ------------------------------- */
// 登录日志列表
export const loginLogList = params => {
    return instance.post(`/loginLog/list`, Qs.stringify(params))
};
// 删除登录日志
export const deleteLoginLog = params => {
    return instance.post(`/loginLog/delete`, Qs.stringify(params))
};
// 批量删除登录日志
export const deleteLoginLogByIds = params => {
    return instance.post(`/loginLog/deleteByIds`, Qs.stringify(params))
};

/** ------------------------- 系统日志表 ------------------------------- */
// 系统日志列表
export const systemLogList = params => {
    return instance.post(`/systemLog/list`, Qs.stringify(params))
};
// 删除系统日志
export const deleteSystemLog = params => {
    return instance.post(`/systemLog/delete`, Qs.stringify(params))
};
// 批量删除系统日志
export const deleteSystemLogByIds = params => {
    return instance.post(`/systemLog/deleteByIds`, Qs.stringify(params))
};



/** ---------------------------------------------- 测试案例 ---------------------------------------------- */

// get带参数
export const testGet = params => {
    return instance.get(`/roleInfo/listByAll?` + params)
};
// get不带参数
export const testGet2 = () => {
    return instance.get(`/roleInfo/listByAll`)
};
// post带参数
export const testPost = params => {
    return instance.post(`/roleInfo/listByAll?` + params)
};
// post不带参数
export const testPost2 = () => {
    return instance.post(`/roleInfo/listByAll`)
};
