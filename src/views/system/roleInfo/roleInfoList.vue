<template>
    <div class="app-container">
        <el-card>
            <el-form :inline="true" :model="searchForm" ref="searchForm" size="small" class="demo-form-inline">
                <el-form-item label="角色" prop="name">
                    <el-input v-model="searchForm.name" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="handleSearch"
                               v-has="'roleInfo:select'" title="查询">
                    </el-button>
                    <el-button size="mini" icon="el-icon-refresh-left" @click="handleReset"
                               v-has="'roleInfo:select'" title="重置">
                    </el-button>
                </el-form-item>
            </el-form>
            <el-row>
                <el-button type="primary" size="mini" icon="el-icon-plus" title="新增"
                           v-has="'roleInfo:add'" @click="handleAdd">新增</el-button>
            </el-row>
            <el-table stripe
                      v-loading="tableLoading"
                      :data="tableData"
                      :highlight-current-row="true"
                      :header-cell-style="{background:'#eef1f6', color:'#606266'}"
                      style="width: 100%">
                <el-table-column
                        label="序号"
                        type="index"
                        width="50">
                </el-table-column>
                <el-table-column
                        label="角色" width="150px">
                    <template slot-scope="scope">
                        <span>{{ scope.row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="描述" width="150px">
                    <template slot-scope="scope">
                        <p>{{scope.row.description}}</p>
                    </template>
                </el-table-column>
                <el-table-column
                        label="权限">
                    <template slot-scope="scope">
                        <p>{{scope.row.resourceName}}</p>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" width="120" label="操作">
                    <template slot-scope="scope">
                        <el-button type="warning" size="mini" icon="el-icon-edit" v-has="'roleInfo:update'"
                                   @click="handleEdit(scope.$index, scope.row)" title="编辑">
                        </el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" v-has="'roleInfo:delete'"
                                   @click="handleDelete(scope.$index, scope.row)" title="删除">
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="10"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tableDataCount">
            </el-pagination>
        </el-card>
        <el-dialog
                :title="showDialogTitle"
                :visible.sync="showDialogVisible"
                @close="closeDialog"
                width="500px">
            <el-form :model="dataForm" :rules="rules" ref="dataForm" size="medium" label-width="100px"
                     class="demo-ruleForm">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="dataForm.name" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="dataForm.description" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="权限" prop="resourceIds">
                    <el-tree
                            :data="treeData"
                            show-checkbox
                            default-expand-all
                            node-key="id"
                            ref="tree"
                            highlight-current
                            :props="treeProps"
                            check-strictly>
                    </el-tree>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="showDialogVisible=false">关闭</el-button>
                <el-button type="primary" size="mini" :loading="submitLoading" @click="handleSubmit">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "roleInfoList",
        data() {
            return {
                showDialogTitle: '',
                showDialogVisible: false,
                deleteVisible: false,
                dataForm: {
                    id: 0,
                    name: '',
                    description: '',
                    resourceIds: ''
                },
                rules: {
                    name: [{required: true, message: '请输入', trigger: 'blur'}],
                    resourceIds: [{required: true, message: '请选择权限', trigger: 'blur'}]
                },
                submitLoading: false,
                searchForm: {
                    name: '',
                    page: 1,
                    limit: 10
                },
                tableLoading: true,
                tableDataCount: 0,
                tableData: [],
                treeProps: {
                    children: 'children',
                    label: 'name'
                },
                treeData: []
            }
        },
        methods: {
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
            },
            // 加载表格数据
            loadTable() {
                this.$api.roleInfoList(this.searchForm).then(res => {
                    if (res.data.code == 200) {
                        this.tableDataCount = res.data.count;
                        this.tableData = res.data.data;
                        this.tableLoading = false;
                    } else {
                        this.$message.error(res.data.message);
                    }
                }).catch(() => {
                    this.$message.error('服务器连接错误，请联系管理员');
                });
            },
            // 查询
            handleSearch() {
                this.tableLoading = true;
                this.loadTable();
            },
            // 重置
            handleReset() {
                this.tableLoading = true;
                this.$refs['searchForm'].resetFields();
                this.searchForm.page = 1;
                this.searchForm.limit = 10;
                this.loadTable();
            },
            // 点击页码
            handleSizeChange(val) {
                this.tableLoading = true;
                this.searchForm.limit = val;
                this.loadTable();
            },
            // 跳转页码
            handleCurrentChange(val) {
                this.tableLoading = true;
                this.searchForm.page = val;
                this.loadTable();
            },
            // 关闭对话框
            closeDialog() {
                this.$nextTick(() => {
                    this.$refs.dataForm.resetFields();
                });
                this.$refs.tree.setCheckedKeys([]);
                this.submitLoading = false;
            },
            // 新增按钮
            handleAdd() {
                this.showDialogTitle = '新增角色';
                this.showDialogVisible = true;
            },
            // 编辑按钮
            handleEdit(index, row) {
                this.showDialogTitle = '编辑角色';
                this.showDialogVisible = true;
                this.dataForm.id = row.id;
                this.dataForm.name = row.name;
                this.dataForm.description = row.description;
                if (row.resourceIds) {
                    this.setTreeSelect(row.resourceIds.split(','));
                }
            },
            // 新增/更新
            handleSubmit() {
                this.dataForm.resourceIds = this.$refs.tree.getCheckedKeys().join(',');
                this.$refs.dataForm.validate((valid) => {
                    if (valid) {
                        this.submitLoading = true;
                        if (this.dataForm.id == 0) {
                            this.$api.saveRoleInfo(this.dataForm).then(res => {
                                if (res.data.code == 200) {
                                    this.$message.success({
                                        message: res.data.message,
                                        onClose: () => {
                                            this.showDialogVisible = false;
                                            this.loadTable();
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
                            this.$api.updateRoleInfo(this.dataForm).then(res => {
                                if (res.data.code == 200) {
                                    this.$message.success({
                                        message: res.data.message,
                                        onClose: () => {
                                            this.showDialogVisible = false;
                                            this.loadTable();
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
                        }
                    } else {
                        this.$message.error('请完善表单信息');
                        return false;
                    }
                });
            },
            // 删除
            handleDelete(index, row) {
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    let param = {
                        id: row.id
                    };
                    this.$api.deleteRoleInfo(param).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success({
                                message: res.data.message,
                                onClose: () => {
                                    this.loadTable();
                                }
                            });
                        } else {
                            this.$message.error(res.data.message);
                        }
                    }).catch(() => {
                        this.$message.error('服务器连接错误，请联系管理员');
                    });
                });
            },
        },
        mounted() {
            this.loadResourceTree();
            this.loadTable();
        }
    }
</script>

<style scoped>

</style>