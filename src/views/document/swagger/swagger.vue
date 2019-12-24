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
                src: this.$global.adminServer.swagger
            }
        },
    }
</script>

<style scoped>
    iframe {
        height: calc(100vh - 65px);
    }
</style>