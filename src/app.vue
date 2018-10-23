<template>
    <div>
        <app-nav></app-nav>
        <!-- <div class="tags-con">
            <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
        </div> -->
        <router-view></router-view>
    </div>
</template>
<script>
    import Navbar from './views/nav.vue'
    import util from '@/libs/util.js';
    export default {
        components: {
            'app-nav': Navbar
        },
        data() {
            return {
            };
        },
        mounted() {

        },
        beforeDestroy() {

        },
        methods: {

        },
        computed:{
        },
        watch: {
        }
    };
</script>