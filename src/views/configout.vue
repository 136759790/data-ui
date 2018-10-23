
<template>
    <div id="container">
        <Layout>
            <Sider :style="{background: '#fff'}" width="300">
            <Card>
                <p slot="title">
                    <Icon type="search"></Icon>
                    查询条件
                </p>
                <Form ref="formInline" :model="formQuery" >
                    <FormItem>
                        <Input  v-model="formQuery.name" placeholder="名称">
                        </Input>
                    </FormItem>
                    <FormItem align="center">
                        <Button @click='handleQuery()'  type="primary">查询</Button>
                        <Button @click='handleModal()' type="primary">新增</Button>
                    </FormItem>
                </Form>
            </Card>
            </Sider>
            <Content>
                <Card>
                    <p slot="title">
                        <Icon type="paper-airplane"></Icon>
                        查询结果
                    </p>
                    <Table border size="small" :columns="col_base" :data="data_base"></Table>
                    <Page align="center" :total="page.total" style="padding-top:20px;" show-elevator></Page>
                </Card>
                </Content>
        </Layout>
        <Modal title="新增"  v-model="modal.edit" :closable="false" @on-ok='handleSave'>
            <Form ref="formEdit" :model="formEdit"  :label-width="80">
                    <FormItem label="名称" >
                        <Input  v-model="formEdit.name" placeholder="名称"></Input>
                    </FormItem>
                    <FormItem label="表名" >
                        <Input  v-model="formEdit.table" placeholder="表名"></Input>
                    </FormItem>
                    <FormItem label="种类" >
                        <Select v-model="formEdit.type">
                            <Option v-for="i in type.out" :value="i.value" :key="i.value">{{i.label}}</Option>
                        </Select>
                    </FormItem>
            </Form>
        </Modal>
        <Modal title="配置" :width = '1000'  v-model="modal.config" :closable="false" >
            <Card>
                <p slot="title">
                    <Icon type="paper-airplane"></Icon>
                    已有元素
                </p>
                <Table :height="200" border size="small" :columns="col_ele" :data="data_ele"></Table>
            </Card>
            <Card>
                <p slot="title">
                    <Icon type="paper-airplane"></Icon>
                    新增元素
                </p>
                <Form ref="formEle"  :model="formEle" inline :label-width="60">
                        <FormItem label="名称：" >
                            <Input   v-model="formEle.name" placeholder="名称"></Input>
                        </FormItem>
                        <FormItem label="种类：" >
                            <Input  number v-model="formEle.type" placeholder="种类："></Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleAddEle" type="primary">新增</Button>
                        </FormItem>
                </Form>
            </Card>
        </Modal>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                type:{
                    out:[
                        {value:'mysql',label:'持久化到mysql数据库'},
                        {value:'oracle',label:'持久化到oralce数据库'},
                    ]
                },
                page:{
                    total:0
                },
                modal:{
                    edit:false,
                    config:false,
                },
                formQuery:{},
                formEdit:{},
                formEle:{},
                col_base:[
                    {title: 'ID',key: 'id',align:'center'},
                    {title: '名称',key: 'name',align:'center'},
                    {title: '种类',key: 'type',align:'center'},
                    {title: '表',key: 'table',align:'center'},
                    {title: '操作',key: 'id',align:'center',render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.show(params.index)
                                        }
                                    }
                                }, '修改'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.handleRemove(params.row.id)
                                        }
                                    }
                                }, '删除'),
                                h('Button', {
                                    props: {
                                        type: 'default',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.handleConfig(params.row.id)
                                        }
                                    }
                                }, '配置'),
                            ]);
                        }},
                ],
                col_ele:[
                    {title: 'ID',key: 'id',align:'center'},
                    {title: '名称',key: 'name',align:'center'},
                    {title: '种类',key: 'type',align:'center'},
                    {title: '操作',key: 'id',align:'center',render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.handleRemoveEle(params.row.id)
                                        }
                                    }
                                }, '删除'),
                            ]);
                        }},
                ],
                data_base:[],
                data_ele:[],
            }
        },
        methods:{
            handleQuery(){
                let $vue = this;
                let postData=this.$qs.stringify(this.formQuery);
                this.$ajax.post('/data/outs',postData).then(function(res){
                    if(res.data.result_status == 1){
                        $vue.data_base = res.data.rows;
                        $vue.page.total = res.data.total;
                    }
                }).catch(function(e){
                    
                });
            },
            handleQueryEle(id){
                debugger
                let $vue = this;
                let postData=this.$qs.stringify({id:id});
                this.$ajax.get('/data/out/eles',{
                    params:{
                        id : id
                    }
                }).then(function(res){
                    $vue.data_ele = res.data;
                }).catch(function(e){
                    
                });
            },
            handleAddEle(){
                let $vue = this;
                let postData=this.$qs.stringify(this.formEle);
                this.$ajax.post('/data/out/ele',postData).then(function(res){
                    $vue.handleQueryEle($vue.formEle.pid);
                    $vue.formEle.name = null;
                    $vue.formEle.type = null;
                }).catch(function(e){
                    
                });
            },
            handleRemoveEle(id){
                let $v = this;
                this.$ajax.delete('/data/out/ele/'+id).then(function(res){
                    $v.handleQueryEle($v.formEle.pid);
                }).catch(function(e){
                    
                });
            },
            handleConfig(id){
                debugger
                this.handleQueryEle(id);
                this.modal.config = true;
                this.formEle.pid = id;
            },
            handleSave(){
                let postData=this.$qs.stringify(this.formEdit);
                let $vue = this;
                this.$ajax.post('/data/out',postData).then(function(res){
                    if(res.data.result_status == 1){
                        $vue.$Message.success(res.data.result_msg);
                        $vue.handleQuery();
                    }
                }).catch(function(e){
                    $vue.$Message.error(e.msg);
                });
            },
            handleModal(){
                this.formEdit = {}
                this.modal.edit = true
            },
            handleRemove(id){
                let postData=this.$qs.stringify({id:id});
                let $vue = this;
                this.$ajax.delete('/data/out/'+id).then(function(res){
                    if(res.data.result_status == 1){
                        $vue.$Message.success(res.data.result_msg);
                        $vue.handleQuery();
                    }
                }).catch(function(e){
                    $vue.$Message.error(e.msg);
                });
            }
        },
        mounted(){
            this.handleQuery();
        }
    }
</script> 