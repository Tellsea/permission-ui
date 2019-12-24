<template>
    <div class="app-container">
        <el-card>
            <div slot="header">
                <span>权限列表</span>
            </div>
            <el-row>
                <el-col :md="10" :sm="24">
                    <el-button size="mini" type="primary" icon="el-icon-plus" v-has="'resourceInfo:add'" @click="treeAppendRoot">添加根节点</el-button>
                    <el-tree
                            :data="treeData"
                            default-expand-all
                            node-key="id"
                            ref="tree"
                            highlight-current
                            :expand-on-click-node="false"
                            :props="treeProps"
                            @node-click="treeNodeClick">
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                            <span>{{ node.label }}</span>
                            <span>
                                <el-button
                                        type="text"
                                        size="mini"
                                        @click="() => treeAppend(data)" v-has="'resourceInfo:add'">
                                    添加
                                </el-button>
                                <el-button
                                        type="text"
                                        size="mini"
                                        @click="() => treeRemove(node, data)" v-has="'resourceInfo:delete'">
                                    删除
                                </el-button>
                            </span>
                        </span>
                    </el-tree>
                </el-col>
                <el-col :md="14" :sm="24">
                    <div class="app-roll-fix">
                        <el-form :model="dataForm" :rules="rules" ref="dataForm" size="medium" label-width="100px">
                            <el-form-item label="名称" prop="name">
                                <el-input v-model="dataForm.name" placeholder="请输入"></el-input>
                            </el-form-item>
                            <el-form-item label="权限" prop="perms">
                                <el-input v-model="dataForm.perms" placeholder="例如：add、update、delete、select、detail)"></el-input>
                            </el-form-item>
                            <el-form-item label="路径" prop="url">
                                <el-input v-model="dataForm.url" placeholder="请输入"></el-input>
                            </el-form-item>
                            <el-form-item label="定位" prop="type">
                                <el-radio-group v-model="dataForm.type">
                                    <el-radio label="0">未使用</el-radio>
                                    <el-radio label="1">菜单</el-radio>
                                    <el-radio label="2">按钮</el-radio>
                                    <el-radio label="3">链接</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="图标" prop="icon">
                                <el-input v-model="dataForm.icon" placeholder="请输入" suffix-icon="dataForm.icon"></el-input>
                            </el-form-item>
                            <el-form-item label="排序" prop="sort">
                                <el-input type="number" v-model="dataForm.sort" placeholder="请输入"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button size="mini" type="primary" :loading="submitLoading" v-has="'resourceInfo:update'" @click="submitForm">更新
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "resourceInfoList",
        data() {
            return {
                dataForm: {
                    id: 0,
                    name: '',
                    url: '',
                    perms: '',
                    type: '0',
                    icon: '',
                    sort: 0,
                },
                rules: {
                    name: [{required: true, message: '请输入', trigger: 'blur'}],
                    perms: [{required: true, message: '请输入', trigger: 'blur'}],
                },
                submitLoading: false,
                treeProps: {
                    children: 'children',
                    label: 'name'
                },
                treeData: []
            }
        },
        methods: {
            // 树添加根节点
            treeAppendRoot() {
                let param = {
                    name: '(空)',
                    perms: 'test'
                };
                this.$api.saveResourceInfo(param).then(res => {
                    if (res.data.code == 200) {
                        this.$message.success({
                            message: res.data.message,
                            onClose: () => {
                                this.loadResourceTree();
                            }
                        });
                    } else {
                        this.$message.error(res.data.message);
                        this.submitLoading = true;
                    }
                }).catch(() => {
                    this.$message.error('服务器连接错误，请联系管理员');
                    this.submitLoading = true;
                });
            },
            // 树添加
            treeAppend(data) {
                let param = {
                    pid: data.id,
                    name: '(空)',
                    perms: 'test'
                };
                this.$api.saveResourceInfo(param).then(res => {
                    if (res.data.code == 200) {
                        this.$message.success({
                            message: res.data.message,
                            onClose: () => {
                                this.loadResourceTree();
                            }
                        });
                    } else {
                        this.$message.error(res.data.message);
                        this.submitLoading = true;
                    }
                }).catch(() => {
                    this.$message.error('服务器连接错误，请联系管理员');
                    this.submitLoading = true;
                });
            },
            // 树删除
            treeRemove(node, data) {
                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex(d => d.id === data.id);
                children.splice(index, 1);
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.$api.deleteResourceInfo({id: data.id}).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success(res.data.message);
                        } else {
                            this.$message.error(res.data.message);
                        }
                    }).catch(() => {
                        this.$message.error('服务器连接错误，请联系管理员');
                    });
                });
            },
            // 树点击节点
            treeNodeClick(data, node) {
                data.type = String(data.type);
                this.dataForm = data;
            },
            // 表单提交
            submitForm() {
                if (this.dataForm.id === 0) {
                    this.$message.error('请选择左侧节点');
                    return false;
                }
                this.$refs.dataForm.validate((valid) => {
                    if (valid) {
                        this.submitLoading = true;
                        this.$api.updateResourceInfo(this.dataForm).then(res => {
                            if (res.data.code == 200) {
                                this.$message.success({
                                    message: res.data.message,
                                    onClose: () => {
                                        this.submitLoading = false;
                                    }
                                });
                            } else {
                                this.$message.error(res.data.message);
                                this.submitLoading = true;
                            }
                        }).catch(() => {
                            this.$message.error('服务器连接错误，请联系管理员');
                            this.submitLoading = true;
                        });
                    } else {
                        this.$message.error('请完善表单信息');
                        return false;
                    }
                });
            },
            // 设置树选中
            setTreeSelect(data) {
                this.$nextTick(() => {
                    this.$refs.tree.setCheckedKeys(data);
                });
            },
            // 加载资源树
            loadResourceTree() {
                this.$api.resourceInfoTree().then(res => {
                    if (res.data.code == 200) {
                        this.treeData = res.data.data;
                    } else {
                        this.$message.error(res.data.message);
                    }
                }).catch(() => {
                    this.$message.error('服务器连接错误，请联系管理员');
                });
            }
        },
        mounted() {
            this.loadResourceTree();
        }
    }
</script>

<style scoped>
    .el-tree {
        margin-top: 20px;
    }

    /*树按钮*/
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }

    .app-roll-fix {

    }
</style>