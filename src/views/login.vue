<template>
    <div class="login-container">
        <el-card>
            <div slot="header" style="text-align: center;">
                <h3>权限管理系统</h3>
            </div>
            <el-form status-icon ref="dataForm" :model="dataForm" :rules="dataFormRules" size="medium">
                <el-form-item prop="userName">
                    <el-input
                            v-model="dataForm.userName"
                            placeholder="用户名"
                            autocomplete="off"
                            prefix-icon="el-icon-user-solid">
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password"
                              v-model="dataForm.password"
                              placeholder="密码"
                              autocomplete="off"
                              prefix-icon="el-icon-lock">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-checkbox v-model="dataForm.remember">记住我</el-checkbox>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :loading="submitLoading" @click="handleSubmit">登 录</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "login",
        data() {
            return {
                submitLoading: false,
                dataForm: {
                    userName: 'admin',
                    password: '123456',
                    remember: false
                },
                dataFormRules: {
                    userName: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                    password: [{required: true, message: '请输入密码', trigger: 'blur'}],
                },
                notifyPromise: Promise.resolve()
            }
        },
        methods: {
            handleSubmit() {
                this.$refs.dataForm.validate((valid) => {
                    if (valid) {
                        this.submitLoading = true;
                        this.$api.login(this.dataForm).then(res => {
                            if (res.data.code == 200) {
                                this.$store.commit('change', [
                                        {type: this.$global.consts.token, param: res.data.data.token},
                                        {type: this.$global.consts.userInfo, param: res.data.data.user},
                                        {type: this.$global.consts.menuList, param: res.data.data.menuList}
                                    ]
                                );
                                this.$message.success({
                                    message: res.data.message,
                                    onClose: () => {
                                        this.$router.push({path: '/'});
                                    }
                                });
                            } else {
                                this.$message.error(res.data.message);
                                this.submitLoading = false;
                            }
                        }).catch(() => {
                            this.$message.error('服务器连接错误，请联系管理员');
                            this.submitLoading = false;
                        });
                    } else {
                        this.$message.error('请完善表单信息');
                        return false;
                    }
                });
            },
            loadNotify(obj) {
                this.notifyPromise = this.notifyPromise.then(this.$nextTick).then(() => {
                    this.$notify.success({
                        title: obj.title,
                        message: obj.message,
                        showClose: false
                    });
                });
            },
        },
        mounted() {
            this.loadNotify({title: '超级管理员(暂不提供体验)', message: '账号：admin 密码：xxxxxx'});
            this.loadNotify({title: '系统管理员', message: '账号：tellsea 默认密码：123456'});
            this.loadNotify({title: '系统监控员', message: '账号：scott 默认密码：123456'});
        }
    }
</script>

<style scoped>
    .login-container {
        box-sizing: border-box;
        height: 100vh;
        padding-top: 200px;
        /*background-image: url("../assets/image/login_bg.png");*/
    }

    .el-card {
        width: 400px;
        margin: auto;
        position: relative;
    }

    .el-button {
        width: 100%;
    }
</style>