<template>
    <div class="app-container">
        <el-card>
            <el-form :inline="true" :model="searchForm" ref="searchForm" size="small" class="demo-form-inline">
                <el-form-item label="用户名">
                    <el-input v-model="searchForm.userName" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="昵称">
                    <el-input v-model="searchForm.nickName" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="电话">
                    <el-input v-model="searchForm.phone" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="searchForm.status" placeholder="请选择">
                        <el-option label="请选择" value="0"></el-option>
                        <el-option label="正常" value="1"></el-option>
                        <el-option label="锁定" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="handleSearch" v-has="'userInfo:select'"
                               title="查询"></el-button>
                    <el-button size="mini" icon="el-icon-refresh-left" @click="handleReset('searchForm')" v-has="'userInfo:select'"
                               title="重置"></el-button>
                </el-form-item>
            </el-form>
            <el-row>
                <el-button type="primary" size="mini" icon="el-icon-plus" title="新增" @click="handleAdd"
                           v-has="'userInfo:add'">新增
                </el-button>
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
                        label="头像">
                    <template slot-scope="scope">
                        <el-avatar shape="square" fit="fill" :src="scope.row.avatar"></el-avatar>
                    </template>
                </el-table-column>
                <el-table-column
                        label="用户名">
                    <template slot-scope="scope">
                        <p>{{scope.row.userName}}</p>
                    </template>
                </el-table-column>
                <el-table-column
                        label="昵称">
                    <template slot-scope="scope">
                        <p>{{scope.row.nickName}}</p>
                    </template>
                </el-table-column>
                <el-table-column
                        label="角色">
                    <template slot-scope="scope">
                        <p>{{scope.row.roleName}}</p>
                    </template>
                </el-table-column>
                <el-table-column
                        label="电话">
                    <template slot-scope="scope">
                        <p>{{scope.row.phone}}</p>
                    </template>
                </el-table-column>
                <el-table-column
                        label="登录次数">
                    <template slot-scope="scope">
                        <p>{{scope.row.loginTimes}}</p>
                    </template>
                </el-table-column>
                <el-table-column
                        label="最近登录时间" width="160">
                    <template slot-scope="scope">
                        <p>{{scope.row.lastLoginTime}}</p>
                    </template>
                </el-table-column>
                <el-table-column
                        label="创建人">
                    <template slot-scope="scope">
                        <p>{{scope.row.createUserName}}</p>
                    </template>
                </el-table-column>
                <el-table-column
                        label="创建时间" width="160">
                    <template slot-scope="scope">
                        <p>{{scope.row.createTime}}</p>
                    </template>
                </el-table-column>
                <el-table-column
                        label="状态">
                    <template slot-scope="scope">
                        <div v-if="scope.row.status === 1">
                            <el-tag size="medium" type="success">正常</el-tag>
                        </div>
                        <div v-else-if="scope.row.status === 2">
                            <el-tag size="medium" type="warning">锁定</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" width="180" label="操作">
                    <template slot-scope="scope">
                        <el-button type="info" size="mini" icon="el-icon-tickets"
                                   @click="handleShow(scope.$index, scope.row)" title="查看" v-has="'userInfo:detail'">
                        </el-button>
                        <el-button type="warning" size="mini" icon="el-icon-edit"
                                   @click="handleEdit(scope.$index, scope.row)" title="编辑" v-has="'userInfo:update'">
                        </el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete"
                                   @click="handleDelete(scope.$index, scope.row)" title="删除" v-has="'userInfo:delete'">
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="10"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="tableDataCount">
                </el-pagination>
            </el-row>
        </el-card>
        <el-dialog
                title="查看用户信息"
                :visible.sync="showDialogVisible"
                width="800px">
            <el-form :model="showForm" ref="showForm" size="medium" label-width="100px"
                     class="demo-ruleForm">
                <el-col :span="12">
                    <el-form-item label="头像" prop="userName">
                        <el-avatar shape="square" :size="100" :src="showForm.avatar"></el-avatar>
                    </el-form-item>
                    <el-form-item label="用户名" prop="userName">
                        <span>{{showForm.userName}}</span>
                    </el-form-item>
                    <el-form-item label="昵称" prop="nickName">
                        <span>{{showForm.nickName}}</span>
                    </el-form-item>
                    <el-form-item label="角色" prop="roleName">
                        <span>{{showForm.roleName}}</span>
                    </el-form-item>
                    <el-form-item label="电话" prop="phone">
                        <span>{{showForm.phone}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="性别" prop="sex">
                        <div v-if="showForm.sex === 0">保密</div>
                        <div v-else-if="showForm.sex === 1">男</div>
                        <div v-else-if="showForm.sex === 2">女</div>
                    </el-form-item>
                    <el-form-item label="描述" prop="description">
                        <span>{{showForm.description}}</span>
                    </el-form-item>
                    <el-form-item label="登录次数" prop="loginTimes">
                        <span>{{showForm.loginTimes}}</span>
                    </el-form-item>
                    <el-form-item label="最后登录时间" prop="lastLoginTime">
                        <span>{{showForm.lastLoginTime}}</span>
                    </el-form-item>
                    <el-form-item label="创建人" prop="createUserName">
                        <span>{{showForm.createUserName}}</span>
                    </el-form-item>
                    <el-form-item label="创建时间" prop="createTime">
                        <span>{{showForm.createTime}}</span>
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <div v-if="showForm.status === 1">
                            <el-tag size="medium" type="success">正常</el-tag>
                        </div>
                        <div v-else-if="showForm.status === 2">
                            <el-tag size="medium" type="warning">锁定</el-tag>
                        </div>
                    </el-form-item>
                </el-col>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" size="mini" @click="showDialogVisible=false">关闭</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "userInfoList",
        data() {
            return {
                showDialogVisible: false,
                deleteVisible: false,
                searchForm: {
                    userName: '',
                    nickName: '',
                    phone: '',
                    status: '0',
                    page: 1,
                    limit: 10
                },
                tableLoading: true,
                tableDataCount: 0,
                tableData: [],
                showForm: {}
            }
        },
        methods: {
            // 加载表格数据
            loadTable() {
                this.$api.userInfoList(this.searchForm).then(res => {
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
                this.searchForm.status = '0';
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
            // 新增
            handleAdd() {
                this.$router.push({path: '/userInfo/userInfoAdd'});
            },
            // 查看
            handleShow(index, row) {
                this.showDialogVisible = true;
                this.showForm = row;
            },
            // 编辑
            handleEdit(index, row) {
                this.$router.push({path: '/userInfo/userInfoUpdate', query: {id: row.id}});
            },
            // 删除
            handleDelete(index, row) {
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    let param = {
                        id: row.id,
                        status: 3
                    };
                    this.$api.deleteUserInfo(param).then(res => {
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
            this.loadTable();
        }
    }
</script>

<style scoped>

</style>