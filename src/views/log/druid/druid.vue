<template>
    <div>
        <iframe width="100%" frameborder="0" scrolling="auto" :src="src"></iframe>
    </div>
</template>

<script>
    export default {
        name: "swagger",
        data() {
            return {
                src: this.$global.adminServer.druid
            }
        },
        mounted() {
            this.$notify.success({
                title: '消息',
                message: '默认账号：tellsea/默认密码：123456',
                position: 'bottom-right'
            });
        }
    }
</script>

<style scoped>
    iframe {
        height: calc(100vh - 65px);
    }
</style>