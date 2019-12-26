import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "../store";

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'index',
        meta: {
            title: 'index'
        },
        redirect: 'home'
        // component: resolve => require(['@/views/index'], resolve)
    },
    {
        path: '/login',
        name: 'login',
        meta: {
            title: 'login'
        },
        component: resolve => require(['@/views/login'], resolve)
    },
    {
        path: '/h',
        name: 'h',
        meta: {
            title: 'h'
        },
        component: resolve => require(['@/views/index'], resolve),
        children:[
            {
                path: '/home',
                name: 'home',
                meta: {
                    title: 'home',
                },
                component: resolve => require(['@/views/home'], resolve),
            },
        ]
    },
    {
        path: '/system',
        name: 'system',
        meta: {
            title: '用户管理',
            perms: 'system'
        },
        component: resolve => require(['@/views/index'], resolve),
        children:[
            {
                path: '/userInfo/userInfoAdd',
                name: 'userInfoAdd',
                meta: {
                    title: '新增用户',
                },
                component: resolve => require(['@/views/system/userInfo/userInfoAdd'], resolve),
            },
            {
                path: '/userInfo/userInfoUpdate',
                name: 'userInfoUpdate',
                meta: {
                    title: '更新用户'
                },
                component: resolve => require(['@/views/system/userInfo/userInfoUpdate'], resolve),
            },
            {
                path: '/userInfo/userInfoList',
                name: 'userInfoList',
                meta: {
                    title: '用户列表',
                    permission: true,
                    perms: 'userInfo:list'
                },
                component: resolve => require(['@/views/system/userInfo/userInfoList'], resolve),
            },
            {
                path: '/roleInfo/roleInfoList',
                name: 'roleInfoList',
                meta: {
                    title: '角色列表',
                    perms: 'roleInfo:list'
                },
                component: resolve => require(['@/views/system/roleInfo/roleInfoList'], resolve),
            },
            {
                path: '/resourceInfo/resourceInfoList',
                name: 'resourceInfoList',
                meta: {
                    title: '权限列表',
                    perms: 'resourceInfo:list'
                },
                component: resolve => require(['@/views/system/resourceInfo/resourceInfoList'], resolve),
            },
            {
                path: '/userInfo/myself',
                name: 'myself',
                meta: {
                    title: '个人中心'
                },
                component: resolve => require(['@/views/system/userInfo/myself'], resolve),
            }
        ]
    },
    {
        path: '/log',
        name: 'log',
        meta: {
            title: '日志管理',
            perms: 'log'
        },
        component: resolve => require(['@/views/index'], resolve),
        children:[
            {
                path: '/systemLog/systemLogList',
                name: 'systemLogList',
                meta: {
                    title: '系统日志'
                },
                component: resolve => require(['@/views/log/systemLog/systemLogList'], resolve),
            },
            {
                path: '/loginLog/loginLogList',
                name: 'loginLogList',
                meta: {
                    title: '登录日志'
                },
                component: resolve => require(['@/views/log/loginLog/loginLogList'], resolve),
            },
            {
                path: '/druid',
                name: 'druid',
                meta: {
                    title: 'Druid监控'
                },
                component: resolve => require(['@/views/log/druid/druid'], resolve),
            },
        ]
    },
    {
        path: '/document',
        name: 'document',
        meta: {
            title: '接口文档'
        },
        component: resolve => require(['@/views/index'], resolve),
        children:[
            {
                path: '/document/swagger',
                name: 'swagger',
                meta: {
                    title: 'Swagger API'
                },
                component: resolve => require(['@/views/document/swagger/swagger'], resolve),
            },
            {
                path: '/document/github',
                name: 'github',
                meta: {
                    title: 'GitHub 源码'
                },
                component: resolve => require(['@/views/document/github/github'], resolve),
            },
        ]
    },
    {
        path: '/error',
        name: 'error',
        meta: {
            title: '错误页'
        },
        component: resolve => require(['@/views/index'], resolve),
        children:[
            {
                path: '/error/unAuth',
                name: 'unAuth',
                meta: {
                    title: 'unAuth'
                },
                component: resolve => require(['@/views/error/unAuth'], resolve),
            },
            {
                path: '/error/notFound',
                name: 'notFound',
                meta: {
                    title: 'notFound'
                },
                component: resolve => require(['@/views/error/notFound'], resolve),
            },
        ]
    },
    {
        path: '*',
        redirect: '/error/notFound'
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

// 路由守卫
router.beforeEach((to, from, next) => {
    // 路由变化修改title
    if (to.meta.title) {
        document.title = '权限管理系统-' + to.meta.title
    }
    let token = store.state.token;
    let permissions = store.state.userInfo.resourceInfoList;
    let session = JSON.parse(sessionStorage.getItem("store"));
    if (session) {
        token = token ? token : session.token;
        permissions = (permissions.length > 0) ? permissions : session.userInfo.resourceInfoList;
    }
    if (token === '' && to.path !== '/login') {
        next('/login');
    } else if (to.meta.perms) {
        let auth = false;
        for (let item of to.matched) {
            auth = item.meta.perms && permissions && permissions.indexOf(item.meta.perms) > -1 && true;
            if (!auth) {
                break;
            }
        }
        auth ? next() : next('/error/unAuth');
    } else {
        next();
    }
});

/* 路由异常错误处理，尝试解析一个异步组件时发生错误，重新渲染目标页面 */
/*router.onError((error) => {
    const pattern = /Loading chunk (\d)+ failed/g;
    const isChunkLoadFailed = error.message.match(pattern);
    const targetPath = router.history.pending.fullPath;
    if (isChunkLoadFailed) {
        router.replace(targetPath);
    }
});*/

export default router;
