<template>
    <div>
        <with-university></with-university>
        <with-birth></with-birth>
    </div>
</template>

<style scoped>
</style>

<script>
    import withUniversity from "./withUniversity/withUniversity.vue";
    import withBirth from "./withBirth/withBirth.vue";

    export default{
        data(){
            return {}
        },
        components:{
            withUniversity,
            withBirth
        }
    }
</script>