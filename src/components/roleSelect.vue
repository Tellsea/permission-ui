<template>
    <div>
        <el-select v-model="roleIds" multiple placeholder="请选择">
            <el-option
                    v-for="role in roleInfoList"
                    :key="role.id"
                    :label="role.name"
                    :value="role.id">
            </el-option>
        </el-select>
    </div>
</template>

<script>
    export default {
        name: 'roleSelect',
        data() {
            return {
                roleIds: [],
                roleInfoList: []
            };
        },
        methods: {
            toParent() {
                this.$emit('roleSelect', this.roleIds);
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
        },
        mounted() {
            this.loadRoleList();
        }
    }
</script>

<style scoped>

</style>
