<template>
    <div id="app">
        <el-container>
            <el-header>
                <el-menu class="el-menu-demo" mode="horizontal">
                    <el-menu-item>
                        <el-radio-group v-model="isCollapse">
                            <el-radio-button :label="false">展开</el-radio-button>
                            <el-radio-button :label="true">收起</el-radio-button>
                        </el-radio-group>
                    </el-menu-item>
                    <el-menu-item index="1"><h1>权限管理系统 Templete</h1></el-menu-item>
                    <el-dropdown size="medium" trigger="click">
                          <span class="el-dropdown-link">
                            当前账户：{{userInfo.userName}}<i class="el-icon-arrow-down el-icon--right"></i>
                          </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item icon="el-icon-user" @click.native="toPage('/userInfo/myself')">个人中心
                            </el-dropdown-item>
                            <el-dropdown-item icon="el-icon-close" @click.native="logout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-avatar shape="square" style="float: right; margin-top: 10px;"
                               :src="userInfo.avatar">
                    </el-avatar>
                </el-menu>
            </el-header>
            <el-container>
                <el-aside width="200">
                    <el-menu style="border-right: none;" class="el-menu-vertical-demo"
                             :collapse="isCollapse">
                        <el-submenu v-for="(item, i) in menuList" :index="i + ''" :key="i">
                            <template slot="title">
                                <i :class="item.icon"></i>
                                <span slot="title">{{item.name}}</span>
                            </template>
                            <el-menu-item v-for="(child, j) in item.children" :index="i + '-' + j" :key="j + '10000'"
                                          @click="toPage(child.url)">{{child.name}}
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view/>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: 'index',
        data() {
            return {
                userInfo: this.$store.state.userInfo,
                isCollapse: false,
                changeSideIcon: 'el-icon-arrow-left',
                menuList: this.$store.state.menuList
            }
        },
        methods: {
            toPage(url) {
                this.$router.push({path: url});
            },
            logout() {
                this.$confirm('即将退出系统, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$store.commit('change', [
                            {type: this.$global.consts.token, param: ''},
                            {type: this.$global.consts.userInfo, param: ''}
                        ]
                    );
                    this.$router.push({path: '/login'});
                });
            }
        },
    }
</script>

<style scoped>
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
    }

    .el-main {
        background-color: #f2f2f2;
        padding: 0;
    }

    .el-menu--inline .el-menu-item {
        padding-left: 50px !important;
    }

    .el-tabs__content {
        min-height: calc(100vh - 100px) !important;
    }

    /* 下拉菜单 */
    .el-dropdown {
        float: right;
        margin: 20px;
    }

    .el-dropdown-link {
        cursor: pointer;
        color: #409EFF;
    }

    .el-icon-arrow-down {
        font-size: 12px;
    }
</style>

