
<template>
    <div id="container">
        <Card>
            <p slot="title">
                <Icon type="upload"></Icon>
                数据导入
            </p>
            <Row>
                <Col span="6">
                    <Upload multiple type="drag" action="/data/upload" :data='data'>
                        <div style="padding: 20px 0">
                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                            <p>数据文件上传（支持拖拽）</p>
                        </div>
                    </Upload>
                </Col>
                <Col span="6">
                    <Upload multiple type="drag" action="/data/upload" :data='configIn'>
                        <div style="padding: 20px 0">
                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                            <p>解析配置文件上传（支持拖拽）</p>
                        </div>
                    </Upload>
                </Col>
                <Col span="6">
                    <Upload multiple type="drag" action="/data/upload" :data='configOut'>
                        <div style="padding: 20px 0">
                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                            <p>导入配置文件上传（支持拖拽）</p>
                        </div>
                    </Upload>
                </Col>
                <Col span="6">
                    <Upload multiple type="drag" action="/data/upload" :data='ds'>
                        <div style="padding: 20px 0">
                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                            <p>数据源配置文件上传（支持拖拽）</p>
                        </div>
                    </Upload>
                </Col>
            </Row>
            <div align='center'>
                <Button type='primary'>开始导入</Button>
            </div>
        </Card>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                formUpload:{
                },
                data:{
                    relativePath : 'data'
                },
                configIn:{
                    relativePath : 'configIn'
                },
                configOut:{
                    relativePath : 'configOut'
                },
                ds:{
                    relativePath : 'ds'
                },
            }
        },
        methods:{
            handleQuery(){
                let $vue = this;
                let postData=this.$qs.stringify(this.formQuery);
                this.$ajax.post('/data/ims',postData).then(function(res){
                    console.log(res);
                    if(res.data.result_status == 1){
                        $vue.data_base = res.data.rows;
                        $vue.page.total = res.data.total;
                    }
                }).catch(function(e){
                    
                });
            },
        },
        mounted(){
            let time = new Date().getTime();
            this.data.uid = time;
            this.configIn.uid = time;
            this.configOut.uid = time;
            this.ds.uid = time;
        }
    }
</script> 