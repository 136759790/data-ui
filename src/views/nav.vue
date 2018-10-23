

<template>
    <div>
        <Menu mode="horizontal" :theme="theme1" active-name="index" @on-select="route">
        <MenuItem name="index">
            <Icon type="home"></Icon>
            数据导入
        </MenuItem>
        <MenuItem name="db">
            <Icon type="ios-people"></Icon>
            数据源
        </MenuItem>
        <MenuItem name="configin">
            <Icon type="ios-people"></Icon>
            解析配置
        </MenuItem>
        <MenuItem name="configout">
            <Icon type="ios-people"></Icon>
            导入配置
        </MenuItem>
        <MenuItem name="filter">
            <Icon type="stats-bars"></Icon>
            过滤器
        </MenuItem>
        <MenuItem name="thread">
            <Icon type="ios-people"></Icon>
            线程池配置
        </MenuItem>
        <Submenu name="3">
            <template slot="title">
                <Icon type="stats-bars"></Icon>
                统计分析
            </template>
            <MenuGroup title="使用">
                <MenuItem name="3-1">新增和启动</MenuItem>
                <MenuItem name="3-2">活跃分析</MenuItem>
                <MenuItem name="3-3">时段分析</MenuItem>
            </MenuGroup>
            <MenuGroup title="留存">
                <MenuItem name="3-4">用户留存</MenuItem>
                <MenuItem name="3-5">流失用户</MenuItem>
            </MenuGroup>
        </Submenu>
        <MenuItem name="im">
            <Icon type="settings"></Icon>
            数据导入
        </MenuItem>
    </Menu>
    </div>
</template>
<script>
    export default {
        name:"app-nav",
        data () {
            return {
                theme1: 'light',
            }
        },
        methods:{
            route(name){
                this.$router.push(name);
            }
        }
    }
</script> 