
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
                    <FormItem >
                        <Input  v-model="formQuery.description" placeholder="描述">
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
                    <Table border  size="small" :columns="col_base" :data="data_base"></Table>
                    <Page align="center" :total="page.total" style="padding-top:20px;" show-elevator></Page>
                </Card>
            </Content>
        </Layout>
        <Modal title="新增"  v-model="modal.edit" :closable="false" @on-ok='handleSave'>
            <Form ref="formEdit" :model="formEdit"  :label-width="100">
                    <FormItem label="名称：" >
                        <Input  v-model="formEdit.name" placeholder="名称"></Input>
                    </FormItem>
                    <FormItem label="表名：" >
                        <Input  v-model="formEdit.table" placeholder="表名"></Input>
                    </FormItem>
                    <FormItem label="开始行：" >
                        <Input  v-model="formEdit.skip" placeholder="开始行"></Input>
                    </FormItem>
                    <FormItem label="数据块大小：" >
                        <Input  v-model="formEdit.blockcount" placeholder="数据块大小"></Input>
                    </FormItem>
                    <FormItem label="种类：" >
                        <Select v-model="formEdit.type">
                            <Option v-for="i in select.type" :value="i.value" :key="i.value">{{i.label}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="存储类型：" >
                        <Select v-model="formEdit.store_type">
                            <Option v-for="i in select.store_type" :value="i.value" :key="i.value">{{i.label}}</Option>
                        </Select>
                    </FormItem>
            </Form>
        </Modal>
        <Modal title="配置" :width = '1000'   v-model="modal.config" :closable="false" >
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
                        <FormItem label="键：" >
                            <Input   v-model="formEle.key" placeholder="键"></Input>
                        </FormItem>
                        <FormItem label="值：">
                            <Input  number v-model="formEle.value" placeholder='根据key-value解析文件需要指定'></Input>
                        </FormItem>
                        <FormItem label="下标：" >
                            <Input  number v-model="formEle.index" placeholder="根据下标解析文件需要指定"></Input>
                        </FormItem>
                        <FormItem label="种类：" >
                            <Input  number v-model="formEle.index" placeholder="对应的JDBC种类"></Input>
                        </FormItem>
                        <FormItem label="格式：" >
                            <Input  number v-model="formEle.index" placeholder="类型为日期类型时需要指定"></Input>
                        </FormItem>
                        <Button @click="handleAddEle" type="primary">新增</Button>
                </Form>
            </Card>
        </Modal>
    </div>
</template>
<script>
    import expandRow from './inDetail.vue'
    export default {
        components:{expandRow},
        data () {
            return {
                select:{
                    type:[
                        {value:'txt',label:'txt文件'},
                        {value:'json',label:'json文件'},
                        {value:'excel',label:'excel文件'},
                    ],
                    store_type:[
                        {value:'mysql',label:'mysql数据库'},
                        {value:'oracle',label:'oracle数据库'},
                    ],
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
                    {title: '展开',type: 'expand',align:'center',
                        render:(h,params)=>{
                            return h(expandRow,{
                                props:{
                                    id:params.row.id
                                }
                            });
                        }    
                    },
                    {title: 'ID',key: 'id',align:'center'},
                    {title: '名称',key: 'name',align:'center'},
                    {title: '表名',key: 'table',align:'center'},
                    {title: '存储类型',key: 'store_type',align:'center'},
                    {title: '数据大小',key: 'blockcount',align:'center'},
                    {title: '开始行',key: 'skip',align:'center'},
                    {title: '种类',key: 'type',align:'center'},
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
                                // h('Button', {
                                //     props: {
                                //         type: 'default',
                                //         size: 'small'
                                //     },
                                //     on: {
                                //         click: () => {
                                //             this.handleConfig(params.row.id)
                                //         }
                                //     }
                                // }, '配置'),
                            ]);
                        }},
                ],
                col_ele:[
                    {title: 'ID',key: 'id',align:'center'},
                    {title: '键',key: 'key',align:'center'},
                    {title: '值',key: 'value',align:'center'},
                    {title: '下标',key: 'index',align:'center'},
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
            handleQuerySelect(){
                let $v = this;
                this.$ajax.get('/data/import/types').then(function(res){
                    $v.select.type = res.data.data;
                }).catch(function(e){

                });
            },
            handleModify(id){
                let $v = this;
                this.$ajax.get('/data/in/'+id).then(function(res){
                    debugger
                    // $v.formEdit = res.data;
                    $v.formEdit.id = res.data.id;
                    $v.formEdit.name = res.data.name;
                    $v.formEdit.blockcount = res.data.blockcount;
                    $v.formEdit.type = res.data.type;
                    $v.formEdit.skip = res.data.skip;
                    $v.modal.edit=true;
                }).catch(function(e){
                    $v.$Message.error(e.message);
                });
            },
            handleQuery(){
                let $vue = this;
                let postData=this.$qs.stringify(this.formQuery);
                this.$ajax.post('/data/ins',postData).then(function(res){
                    if(res.data.result_status == 1){
                        $vue.data_base = res.data.rows;
                        $vue.page.total = res.data.total;
                    }
                }).catch(function(e){
                    
                });
            },
            handleQueryEle(id){
                let $vue = this;
                let postData=this.$qs.stringify({id:id});
                this.$ajax.get('/data/eles',{
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
                this.$ajax.post('/data/ele',postData).then(function(res){
                    // $vue.data_ele = res.data;
                    $vue.handleQueryEle($vue.formEle.inid);
                    $vue.formEle.key = null;
                    $vue.formEle.value = null;
                    $vue.formEle.index = null;
                }).catch(function(e){
                    
                });
            },
            handleRemoveEle(id){
                let $v = this;
                this.$ajax.delete('/data/ele/'+id).then(function(res){
                    $v.handleQueryEle($v.formEle.inid);
                }).catch(function(e){
                    
                });
            },
            handleConfig(id){
                this.handleQueryEle(id);
                this.modal.config = true;
                this.formEle.inid = id;
            },
            handleSave(){
                let postData=this.$qs.stringify(this.formEdit);
                let $vue = this;
                if(this.formEdit.id){
                    this.$ajax.put('/data/in',postData).then(function(res){
                        if(res.data.result_status == 1){
                            $vue.$Message.success(res.data.result_msg);
                            $vue.handleQuery();
                        }
                    }).catch(function(e){
                        $vue.$Message.error(e.msg);
                    });
                }else{
                    this.$ajax.post('/data/in',postData).then(function(res){
                        if(res.data.result_status == 1){
                            $vue.$Message.success(res.data.result_msg);
                            $vue.handleQuery();
                        }
                    }).catch(function(e){
                        $vue.$Message.error(e.msg);
                    });
                }
            },
            handleModal(){
                this.formEdit = {}
                this.modal.edit = true
            },
            handleRemove(id){
                let postData=this.$qs.stringify({id:id});
                let $vue = this;
                this.$ajax.delete('/data/in/'+id).then(function(res){
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
            this.handleQuerySelect();
        }
    }
</script> 