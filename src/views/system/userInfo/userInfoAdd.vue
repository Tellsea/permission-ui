<template>
    <div class="app-container">
        <el-card>
            <div slot="header">
                <span>新增用户</span>
            </div>
            <el-form :model="dataForm" :rules="rules" ref="dataForm" size="medium" label-width="100px"
                     class="demo-ruleForm">
                <el-row>
                    <el-col :md="12" :sm="24">
                        <el-form-item label="头像" prop="avatar">
                            <el-upload
                                    class="avatar-uploader"
                                    :action="this.$global.fileServer.upload"
                                    :data="{folder: 'user_info'}"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess"
                                    :before-upload="beforeAvatarUpload">
                                <img v-if="dataForm.avatar" :src="dataForm.avatar" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="用户名" prop="userName">
                            <el-input v-model="dataForm.userName" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="昵称" prop="nickName">
                            <el-input v-model="dataForm.nickName" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="dataForm.password" show-password placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="电话" prop="phone">
                            <el-input v-model="dataForm.phone" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :md="12" :sm="24">
                        <el-form-item label="角色" prop="roleIds">
                            <el-select v-model="dataForm.roleIds" multiple placeholder="请选择">
                                <el-option
                                        v-for="role in roleInfoList"
                                        :key="role.id"
                                        :label="role.name"
                                        :value="role.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="性别" prop="sex">
                            <el-radio-group v-model="dataForm.sex">
                                <el-radio label="1">男</el-radio>
                                <el-radio label="2">女</el-radio>
                                <el-radio label="0">保密</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="描述" prop="description">
                            <el-input
                                    type="textarea"
                                    :rows="4"
                                    placeholder="请输入"
                                    v-model="dataForm.description">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item style="text-align: center;">
                        <el-button type="primary" :loading="submitLoading" @click="submitForm('dataForm')">提交</el-button>
                        <el-button @click="resetForm('dataForm')">重置</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: 'userInfoAdd',
        data() {
            let checkPhone = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('手机号不能为空'));
                } else {
                    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
                    if (reg.test(value)) {
                        callback();
                    } else {
                        return callback(new Error('请输入正确的手机号'));
                    }
                }
            };
            return {
                dataForm: {
                    userName: '',
                    nickName: '',
                    password: '',
                    avatar: '',
                    phone: '',
                    sex: '1',
                    description: '',
                    status: 1,
                    roleIds: ''
                },
                rules: {
                    avatar: [{required: true, message: '请上传头像', trigger: 'blur'}],
                    userName: [{required: true, message: '请输入', trigger: 'blur'}],
                    nickName: [{required: true, message: '请输入', trigger: 'blur'}],
                    password: [
                        {required: true, message: '请输入', trigger: 'blur'},
                        {min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur'}
                    ],
                    phone: [{validator: checkPhone, trigger: 'blur'}],
                    roleIds: [{required: true, message: '请选择', trigger: 'blur'}]
                },
                roleInfoList: [],
                submitLoading: false
            };
        },
        methods: {
            // 上传头像成功
            handleAvatarSuccess(res, file) {
                if (res.code != 200) {
                    this.$message.error('上传头像错误');
                    return false;
                }
                this.dataForm.avatar = this.$global.fileServer.browse + res.data;
                // base64
                // this.dataForm.avatar = URL.createObjectURL(file.raw);
            },
            // 上传头像
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            // 加载角色列表
            loadRoleList() {
                this.$api.roleInfoListAll().then(res => {
                    if (res.data.code == 200) {
                        this.roleInfoList = res.data.data;
                    } else {
                        this.$message.error(res.data.message);
                    }
                }).catch(() => {
                    this.$message.error('服务器连接错误，请联系管理员');
                });
            },
            // 表单提交
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.submitLoading = true;
                        this.dataForm.roleIds = this.dataForm.roleIds.join(',');
                        this.$api.saveUserInfo(this.dataForm).then(res => {
                            if (res.data.code == 200) {
                                this.$message.success({
                                    message: res.data.message,
                                    onClose: () => {
                                        this.$router.push('userInfoList');
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
            // 重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
        },
        mounted() {
            this.loadRoleList();
        }
    }
</script>

<style scoped>
    .el-select {
        display: block;
    }

    /* 上传样式 */
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>