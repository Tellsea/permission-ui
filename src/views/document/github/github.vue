<template>
    <div class="app-container">
        <el-card>
            <div slot="header">
                <span>项目源码</span>
            </div>
            <el-table stripe
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
                        label="名称">
                    <template slot-scope="scope">
                        <el-tag size="medium" type="success">{{ scope.row.name }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        label="描述">
                    <template slot-scope="scope">
                        <p>{{scope.row.description}}</p>
                    </template>
                </el-table-column>
                <el-table-column
                        label="核心技术">
                    <template slot-scope="scope">
                        <p>{{scope.row.coreTechnology}}</p>
                    </template>
                </el-table-column>
                <el-table-column
                        label="Github" width="100">
                    <template slot-scope="scope">
                        <a target="_blank" :href="scope.row.githubCode">
                            <el-button size="mini" type="primary">Github</el-button>
                        </a>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "github",
        data() {
            return {
                tableData: [
                    {
                        name: 'permission-ui',
                        description: 'SpringBoot + Shiro + Vue 前端项目',
                        coreTechnology: 'Vue2.6、Vue-cli3、Vue-router3、Vuex、Element-ui2.13、Axios0.19、Qs6.9 等',
                        githubCode: 'https://www.github.com/tellsea/permissin-ui'
                    },
                    {
                        name: 'permission',
                        description: 'SpringBoot + Shiro + Vue 后台项目',
                        coreTechnology: 'SpringBoot2.2、TkMybatis2.1、JDBC Templete、MyBatis Plus 代码生成器、Druid1.1、Swagger2.9、Shiro1.4 等',
                        githubCode: 'https://www.github.com/tellsea/permissin'
                    },
                ]
            }
        }
    }
</script>

<style scoped>

</style>