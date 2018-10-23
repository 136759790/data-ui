
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
                    <FormItem label="名称">
                        <Input  v-model="formQuery.name" placeholder="名称"></Input>
                    </FormItem>
                    <FormItem label='种类'>
                        <Select v-model="formQuery.type">
                            <Option value="in">in</Option>
                            <Option value="out">out</Option>
                        </Select>
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
                    <FormItem label="名称：" >
                        <Input  v-model="formEdit.name" placeholder="名称"></Input>
                    </FormItem>
                    <FormItem label="种类：" >
                        <Select v-model="formEdit.type">
                            <Option value="in">输入线程池</Option>
                            <Option value="out">输出线程池</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="核心数量：" >
                        <Input type='number'  v-model="formEdit.core" placeholder="核心数量"></Input>
                    </FormItem>
                    <FormItem label="最大数量：" >
                        <Input type='number' v-model="formEdit.max" placeholder="最大数量"></Input>
                    </FormItem>
                    <FormItem label="存活时间：" >
                        <Input type='number' v-model="formEdit.keepalive" placeholder="存活时间（秒）"></Input>
                    </FormItem>
                    <FormItem label="队列大小：" >
                        <Input type='number' v-model="formEdit.queuesize" placeholder="队列大小"></Input>
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
                    edit:false,
                    config:false,
                },
                formQuery:{},
                formEdit:{},
                col_base:[
                    {title: 'ID',key: 'id',align:'center'},
                    {title: '名称',key: 'name',align:'center'},
                    {title: '种类',key: 'type',align:'center',render:(h,params)=>{
                        let type_str="输出线程池";
                        if(params.row.type == 'in'){
                            type_str="输入线程池";
                        }
                        return h('span',type_str);
                    }},
                    {title: '核心数',key: 'core',align:'center'},
                    {title: '最大数',key: 'max',align:'center'},
                    {title: '存活时间',key: 'keepalive',align:'center'},
                    {title: '队列容量',key: 'queuesize',align:'center'},
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
                                            this.handleModify(params.row.id)
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
                            ]);
                        }},
                ],
                data_base:[],
            }
        },
        methods:{
            handleModify(id){
                let v = this;
                v.$ajax.get('/data/thread/'+id).then(function(res){
                    debugger
                    v.formEdit = res.data;
                    v.formEdit.id = id;
                    v.modal.edit = true;
                }).catch(function(e){
                    v.$Message.error(e.message);
                });
            },
            handleQuery(){
                let $vue = this;
                this.$ajax.get('/data/thread',{params:this.formQuery}).then(function(res){
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
                if(this.formEdit.id){
                    this.$ajax.put('/data/thread',postData)
                    .then((res)=>{
                        $vue.$Message.success(res.data.result_msg);
                    }).catch((e)=>{
                        $vue.$Message.success(e.message);
                    });
                }else{
                    this.$ajax.post('/data/thread',postData).then(function(res){
                        if(res.data.result_status == 1){
                            $vue.$Message.success(res.data.result_msg);
                        }
                    }).catch(function(e){
                        $vue.$Message.error(e.msg);
                    });
                }
                $vue.handleQuery();
            },
            handleModal(){
                this.formEdit = {}
                this.modal.edit = true
            },
            handleRemove(id){
                let postData=this.$qs.stringify({id:id});
                let $vue = this;
                this.$ajax.delete('/data/thread/'+id).then(function(res){
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