<template>
    <div id="app">
        <el-container>
            <el-aside width="200" style="background-color: #545c64;">
                <el-menu style="border-right: none;" class="el-menu-vertical-demo"
                         :collapse="isCollapse"
                         background-color="#545c64"
                         text-color="#fff"
                         active-text-color="#409EFF">
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
            <el-container>
                <el-header style="padding: 0;">
                    <el-menu class="el-menu-demo" mode="horizontal">
                        <el-menu-item>
                            <i class="el-icon-s-fold" @click="changeSideStatus"></i>
                        </el-menu-item>
                        <el-menu-item>
                            <span style="font-size: 18px;">权限管理系统</span>
                        </el-menu-item>
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
                <el-main style="padding: 0;">
                    <el-tabs type="border-card" v-model="editableTabsValue" closable @edit="handleTabsEdit">
                        <el-tab-pane
                                :key="item.name"
                                v-for="(item) in editableTabs"
                                :label="item.title"
                                :name="item.name"
                                style="background-color: #f2f2f2; min-height: calc(100vh - 101px); margin: -15px;">
                            <router-view/>
                        </el-tab-pane>
                    </el-tabs>
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
                editableTabsValue: '2',
                editableTabs: [{
                    title: '文章管理',
                    name: '1',
                    content: 'Tab 1 content'
                }, {
                    title: '文章列表',
                    name: '2',
                    content: 'Tab 2 content'
                }],
                tabIndex: 2,

                userInfo: this.$store.state.userInfo,
                isCollapse: false,
                menuList: this.$store.state.menuList
            }
        },
        methods: {
            // 改变侧边栏状态
            changeSideStatus() {
                this.isCollapse = this.isCollapse == true ? false : true;
            },
            handleTabsEdit(targetName, action) {
                if (action === 'add') {
                    let newTabName = ++this.tabIndex + '';
                    this.editableTabs.push({
                        title: 'New Tab',
                        name: newTabName,
                        content: 'New Tab content'
                    });
                    this.editableTabsValue = newTabName;
                }
                if (action === 'remove') {
                    let tabs = this.editableTabs;
                    let activeName = this.editableTabsValue;
                    if (activeName === targetName) {
                        tabs.forEach((tab, index) => {
                            if (tab.name === targetName) {
                                let nextTab = tabs[index + 1] || tabs[index - 1];
                                if (nextTab) {
                                    activeName = nextTab.name;
                                }
                            }
                        });
                    }

                    this.editableTabsValue = activeName;
                    this.editableTabs = tabs.filter(tab => tab.name !== targetName);
                }
            },
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

    .el-menu--inline .el-menu-item {
        padding-left: 50px !important;
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

