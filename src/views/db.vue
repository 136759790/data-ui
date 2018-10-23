
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
                    <FormItem prop="name">
                        <Input type="text" v-model="formQuery.name" placeholder="名称">
                        </Input>
                    </FormItem>
                    <FormItem prop="description">
                        <Input type="text" v-model="formQuery.description" placeholder="描述">
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
                    <FormItem label="名称" prop="name">
                        <Input type="text" v-model="formEdit.name" placeholder="名称">
                        </Input>
                    </FormItem>
                    <FormItem label="地址" prop="url">
                        <Input type="text" v-model="formEdit.url" placeholder="地址">
                        </Input>
                    </FormItem>
                    <FormItem label="账号" prop="username">
                        <Input type="text" v-model="formEdit.username" placeholder="账号">
                        </Input>
                    </FormItem>
                    <FormItem label="密码" prop="password">
                        <Input type="text" v-model="formEdit.password" placeholder="密码">
                        </Input>
                    </FormItem>
                    <FormItem label="初始连接" prop="init">
                        <Input type="text" v-model="formEdit.init" placeholder="初始连接">
                        </Input>
                    </FormItem>
                    <FormItem label="最大连接" prop="max">
                        <Input type="text" v-model="formEdit.max" placeholder="最大连接">
                        </Input>
                    </FormItem>
                    <FormItem label="驱动" prop="driver">
                        <Input type="text" v-model="formEdit.driver" placeholder="驱动">
                        </Input>
                    </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                page:{
                    total:0
                },
                modal:{
                    edit:false
                },
                formQuery:{
                    name:'',
                    description:''
                },
                formEdit:{
                    name:'',
                    description:''
                },
                col_base:[
                    {title: 'ID',key: 'id',align:'center'},
                    {title: '名称',key: 'name',align:'center'},
                    {title: '地址',key: 'url',align:'center'},
                    {title: '账号',key: 'username',align:'center'},
                    {title: '密码',key: 'password',align:'center'},
                    {title: '驱动',key: 'driver',align:'center'},
                    {title: '最大连接',key: 'max',align:'center'},
                    {title: '初始连接',key: 'init',align:'center'},
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
                                    on: {
                                        click: () => {
                                            this.handleRemove(params.row.id)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }},
                ],
                data_base:[]
            }
        },
        methods:{
            handleQuery(){
                let $vue = this;
                let postData=this.$qs.stringify(this.formQuery);
                this.$ajax.post('/data/dbs',postData).then(function(res){
                    if(res.data.result_status == 1){
                        $vue.data_base = res.data.rows;
                        $vue.page.total = res.data.total;
                    }
                }).catch(function(e){
                    
                });
            },
            handleSave(){
                let postData=this.$qs.stringify(this.formEdit);
                let $vue = this;
                this.$ajax.post('/data/db',postData).then(function(res){
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
                this.$ajax.delete('/data/db/'+id).then(function(res){
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