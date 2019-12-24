<template>
    <div class="app-container">
        <el-card>
            <el-form :inline="true" :model="searchForm" ref="searchForm" size="small" class="demo-form-inline">
                <el-form-item label="登录时间" prop="searchTime">
                    <el-date-picker
                            v-model="searchTime"
                            type="daterange"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="handleSearch"
                               v-has="'loginLog:select'" title="查询">
                    </el-button>
                    <el-button size="mini" icon="el-icon-refresh-left" @click="handleReset"
                               v-has="'loginLog:select'" title="重置">
                    </el-button>
                </el-form-item>
            </el-form>
            <el-row>
                <el-button size="mini" type="danger" icon="el-icon-delete" v-has="'loginLog:delete'" @click="handleDeleteBatch">批量删除</el-button>
            </el-row>
            <el-table stripe
                      ref="table"
                      v-loading="tableLoading"
                      :data="tableData"
                      :highlight-current-row="true"
                      :header-cell-style="{background:'#eef1f6', color:'#606266'}"
                      style="width: 100%">
                <el-table-column
                        type="selection"
                        width="55"
                        align="center">
                </el-table-column>
                <el-table-column
                        label="序号"
                        type="index"
                        width="50">
                </el-table-column>
                <el-table-column
                        label="用户名">
                    <template slot-scope="scope">
                        <p>{{scope.row.userName}}</p>
                    </template>
                </el-table-column>
                <el-table-column
                        label="IP">
                    <template slot-scope="scope">
                        <p>{{scope.row.ip}}</p>
                    </template>
                </el-table-column>
                <el-table-column
                        label="位置">
                    <template slot-scope="scope">
                        <p>{{scope.row.location}}</p>
                    </template>
                </el-table-column>
                <el-table-column
                        label="设备">
                    <template slot-scope="scope">
                        <p>{{scope.row.device}}</p>
                    </template>
                </el-table-column>
                <el-table-column
                        label="登录时间" width="160">
                    <template slot-scope="scope">
                        <p>{{scope.row.createTime}}</p>
                    </template>
                </el-table-column>
                <el-table-column
                        label="状态码">
                    <template slot-scope="scope">
                        <div v-if="scope.row.code === 200">
                            <el-tag size="medium" type="success">{{scope.row.code}}</el-tag>
                        </div>
                        <div v-else>
                            <el-tag size="medium" type="warning">{{scope.row.code}}</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        label="消息">
                    <template slot-scope="scope">
                        <p>{{scope.row.message}}</p>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" width="70" label="操作">
                    <template slot-scope="scope">
                        <el-button type="danger" size="mini" icon="el-icon-delete" v-has="'loginLog:delete'"
                                   @click="handleDelete(scope.$index, scope.row)" title="删除">
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
    </div>
</template>

<script>
    export default {
        name: "loginLogList",
        data() {
            return {
                searchTime: [],
                deleteVisible: false,
                searchForm: {
                    searchTime: '',
                    page: 1,
                    limit: 10
                },
                tableLoading: true,
                tableDataCount: 0,
                tableData: []
            }
        },
        methods: {
            // 加载表格数据
            loadTable() {
                this.$api.loginLogList(this.searchForm).then(res => {
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
                this.searchForm.searchTime = this.searchTime.join(',');
                this.tableLoading = true;
                this.loadTable();
            },
            // 重置
            handleReset() {
                this.tableLoading = true;
                this.searchTime = [];
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
            // 删除
            handleDelete(index, row) {
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.$api.deleteLoginLog({id: row.id}).then(res => {
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
            // 批量删除
            handleDeleteBatch() {
                let selection = this.$refs.table.selection;
                if (selection.length === 0) {
                    this.$message.warning('请勾选行');
                    return false;
                }
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    let param = [];
                    for (let i = 0; i < selection.length; i++) {
                        param.push(selection[i].id);
                    }
                    this.$api.deleteLoginLogByIds({ids: param.join(',')}).then(res => {
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
            }
        },
        mounted() {
            this.loadTable();
        }
    }
</script>

<style scoped>

</style>