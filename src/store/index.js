import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// Vuex状态管理
const store = new Vuex.Store({
    state: {
        token: '',
        userInfo: {
            id: 0,
            userName: '',
            nickName: '',
            avatar: '',
            destination: '',
            loginTimes: 0,
            lastLoginTime: '',
            phone: '',
            sex: 0,
            status: 0,
            roleInfoList: [],
            resourceInfoList: []
        },
        menuList: []
    },
    mutations: {
        // 修改 state 存储值
        change(state, obj) {
            if (Object.prototype.toString.call(obj) === '[object Object]') {
                state[obj.type] = obj.param;
            } else if (Object.prototype.toString.call(obj) === '[object Array]') {
                for (let i = 0; i < obj.length; i++) {
                    state[obj[i].type] = obj[i].param;
                }
            } else {
                console.error('Vuex：无法匹配对象');
            }
        }
    }
});
export default store;