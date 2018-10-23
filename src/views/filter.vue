
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
                    <Table :loading="table.loading" border size="small" :columns="col_base" :data="data_base"></Table>
                    <Page align="center" :total="page.total" style="padding-top:20px;" size="small" show-elevator></Page>
                </Card>
            </Content>
        </Layout>
        <Modal title="新增"   v-model="modal.edit" :closable="false" @on-ok='handleSave'>
            <Form ref="formEdit"  :model="formEdit" style="padding:10px 30px;">
                <FormItem label="名称:" prop="name">
                    <Input type="text" style="width:200px;" v-model="formEdit.name" placeholder="过滤器名称"></Input>
                </FormItem>
                <FormItem label="正则:" prop="pattern">
                    <Input type="text" style="width:200px;" v-model="formEdit.pattern" placeholder="过滤器使用的正则表达式"></Input>
                </FormItem>
                <FormItem label="路径:" prop="clazz">
                    <Input type="text" style="width:200px;" v-model="formEdit.clazz" placeholder="自定义过滤器的类"></Input>
                </FormItem>
                <FormItem label="种类:" prop="type">
                    <Select style="width:200px;" v-model="formEdit.type" >
                        <Option v-for="i in select.type" :key="i.value" :value="i.value">{{i.label}}</Option>
                    </Select>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
    // import SockJs from 'sockjs-client'
    export default {
        data () {
            return {
                table:{loading:false},
                formQuery:{},
                formEdit:{},
                select:{
                    type:[
                        {value:'reg',label:'正则表达式过滤器'},
                        {value:'self',label:'自定义过滤器'},
                    ],
                },
                modal:{
                    edit:false,
                },
                page:{
                    total:0
                },
                col_base:[
                    {title: 'ID',key: 'id',align:'center'},
                    {title: '名称',key: 'name',align:'center'},
                    {title: '正则',key: 'pattern',align:'center'},
                    {title: '种类',key: 'type',align:'center'},
                    {title: '自定义过滤器',key: 'clazz',align:'center'},
                    {title: '操作',key: 'description',align:'center',render: (h, params) => {
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
                                            this.handleUpdate(params.row)
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
            handleUpdate(row){
                this.formEdit = row;
                this.modal.edit = true
            },
            handleQuery(){
                this.table.loading=true;
                let postData=this.$qs.stringify(this.formQuery);
                let v = this;
                this.$ajax.get('/filter/filters',{params:this.formQuery}).then((res)=>{
                    if(res.data.result_status == 1){
                        v.data_base = res.data.rows;
                        v.page.total = res.data.total;
                    }
                    v.table.loading=false;   
                }).catch(function(e){
                    v.table.loading=false;   
                });
            },
            handleSave(){
                debugger
                let postData=this.$qs.stringify(this.formEdit);
                let $v = this;
                if(this.formEdit.id){
                    this.$ajax.put('/filter/filter',postData).then(function(res){
                        if(res.data.result_status == 1){
                            $v.$Message.success(res.data.result_msg);
                            $v.handleQuery();
                        }else{
                            $v.$Message.error(res.data.result_msg);
                        }
                    }).catch(function(e){
                        $v.$Message.error(e.message);
                    });
                }else{
                    this.$ajax.post('/filter/filter',postData).then(function(res){
                        if(res.data.result_status == 1){
                            $v.$Message.success(res.data.result_msg);
                            $v.handleQuery();
                        }
                    }).catch(function(e){
                        $v.$Message.error(e.msg);
                    });
                }
            },
            handleModal(){
                this.formEdit = {}
                this.modal.edit = true
            },
            handleRemove(id){
                let $vue = this;
                this.$ajax.delete('/filter/'+id).then(function(res){
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
        },
        watch:{
        }
    }
</script> 