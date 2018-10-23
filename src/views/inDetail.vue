
<template>
    <div id="container">
        <Table :loading=loading border stripe  size="small" :columns="col_ele" :data="data_ele"></Table>
        <div align ="center" style="margin-top:10px;">
            <Button type="primary" @click="handleConfig">新增</Button>
        </div>
        <Modal title="新增元素"@on-ok='handleAddEle'  v-model="modal.config" :closable="false" >
            <Form ref="formEle"  :model="formEle"  :label-width="60">
                    <FormItem label="列名：" >
                        <Input   v-model="formEle.key" placeholder="数据库列名"></Input>
                    </FormItem>
                    <FormItem label="属性：">
                        <Input  number v-model="formEle.value" placeholder='导入文件中的属性名称'></Input>
                    </FormItem>
                    <FormItem label="下标：" >
                        <Input  number v-model="formEle.index" placeholder="导入文件中的下标位置，从0开始递增"></Input>
                    </FormItem>
                    <FormItem label="种类：" >
                        <Select clearable filterable v-model='formEle.type' placeholder="对应的JDBC种类">
                            <Option v-for='i in select' :value='i.value' :key="i.value">{{i.label}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="格式：" >
                        <Input  number v-model="formEle.pattern" placeholder="类型为日期类型时需要指定"></Input>
                    </FormItem>
            </Form>
        </Modal>
        <Modal title="过滤器" width='600px'   @on-ok='handleSetFilter'  v-model="modal.filter" :closable="false" >
            <div>
                <Transfer
                    :data="allFilter"
                    :target-keys="myFilter"
                    :list-style="listStyle"
                    :render-format="render3"
                    :titles="titles"
                    @on-change="handleChange1"
                    filterable>
                </Transfer>
                <br/>
                <Form   inline  :label-width="120" :model="formMyFilter">
                    <FormItem label="添加正则过滤器：" >
                        <Row :gutter="16">
                        <Col span="9">
                            <Input width="60px" v-model="formMyFilter.pattern" placeholder="自定义正则表达式"></Input>
                        </Col>
                        <Col span="9">
                            <Input width="60px" placeholder="描述" v-model="formMyFilter.name"></Input>
                        </Col>
                        <Col span="4" offset="1">
                            <Button type="primary" @click="handleAddFilter">添加</Button>
                        </Col>
                    </Row>
                    </FormItem>
                </Form>
            </div>
        </Modal>
    </div>
</template>
<script>
    export default {
        props:{
            id:Number
        },
        methods:{
            handleAddFilter(){
                this.formMyFilter.type='reg';
                let postData=this.$qs.stringify(this.formMyFilter);
                this.$ajax.post('/filter/filter',postData).then((res)=>{
                    this.$Message.success(res.data.result_msg);
                    this.handleGetFilters();
                });
            },
            handleGetFilters(){
                this.$ajax.get('/filter/filters').then((res)=>{
                    debugger
                    this.allFilter = [];
                    res.data.rows.forEach(function(element) {
                        this.allFilter.push({key:element.id,label:element.name});
                    }, this);
                });
            },
            handleChange1 (newTargetKeys, direction, moveKeys) {
                this.myFilter = newTargetKeys;
            },
            render3 (item) {
                return item.label;
            },
            handleFilger(id){
                this.modal.filter = true;
                this.currentId = id;
                this.handleGetMyfilter(id);
            },
            handleGetMyfilter(id){
                debugger
                this.modal.filter = true;
                this.currentId = id;
                this.$ajax.get('/filter/filters/all',{
                    params:{
                        elementId:id,
                    }
                }).then((res)=>{
                    debugger
                    if(res.data.result_status){
                        this.$Message.success(res.data.result_msg);
                        let data = res.data.data;
                        data.forEach(function(e) {
                            this.myFilter.push(e.id);
                        }, this);
                    }else{
                        this.$Message.error(res.data.result_msg);
                    }
                });
            },
            handleSetFilter(){
                // let postData=this.$qs.stringify({elementId:this.currentId,filterIds:JSON.stringify(this.myFilter)},{arrayFormat: 'repeat'});
                var params = new URLSearchParams();
                params.append('elementId',this.currentId);		
                this.myFilter.forEach(function(e) {
                    params.append('filterIds',e);
                }, this);	
                debugger
                this.$ajax.post('/filter/relation',params).then((res)=>{
                    this.$Message.success(res.data.result_msg);
                    this.modal.filter = false;
                });
            },
            handleConfig(){
                this.formEle={}
                this.handleQueryEle(this.id);
                this.modal.config = true;
                this.formEle.inid = this.id;
            },
            handleQueryEle(id){
                this.loading=true;
                let $v = this;
                let postData=this.$qs.stringify({id:id});
                this.$ajax.get('/data/eles',{
                    params:{
                        id : id
                    }
                }).then(function(res){
                    $v.data_ele = res.data;
                    $v.loading=false;
                }).catch(function(e){
                    $v.loading=false;
                });
            },
            handleAddEle(){
                let $vue = this;
                let postData=this.$qs.stringify(this.formEle);
                this.$ajax.post('/data/ele',postData).then(function(res){
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
                    $v.handleQueryEle($v.id);
                }).catch(function(e){
                    
                });
            },
        },
        mounted(){
            this.handleQueryEle(this.id);
            this.handleGetFilters();
        },
        data () {
            return {
                listStyle: {
                    width: '250px',
                    height: '300px'
                },
                currentId:{},
                allFilter:[],
                myFilter:[],
                titles:[
                    '所有过滤器','我的过滤器'
                ],
                modal:{
                    config:false,
                    filter:false,
                },
                formEle:{},
                formFilter:{filters:[]},
                formMyFilter:{},
                loading:false,
                col_ele:[
                    {title: 'ID',key: 'id',align:'center'},
                    {title: '列名',key: 'key',align:'center'},
                    {title: '属性',key: 'value',align:'center'},
                    {title: '下标',key: 'index',align:'center'},
                    {title: '种类',key: 'type',align:'center'},
                    {title: '格式',key: 'pattern',align:'center'},
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
                                            this.handleFilger(params.row.id)
                                        }
                                    }
                                }, '过滤器'),
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
                data_ele:[],
                select:[
                    {value:'CHAR',label:'CHAR'},
                    {value:'VARCHAR',label:'VARCHAR'},
                    {value:'LONGVARCHAR',label:'LONGVARCHAR'},
                    {value:'NUMERIC',label:'NUMERIC'},
                    {value:'DECIMAL',label:'DECIMAL'},
                    {value:'BOOLEAN',label:'BOOLEAN'},
                    {value:'TINYINT',label:'TINYINT'},
                    {value:'SMALLINT',label:'SMALLINT'},
                    {value:'INTEGER',label:'INTEGER'},
                    {value:'BIGINT',label:'BIGINT'},
                    {value:'FLOAT',label:'FLOAT'},
                    {value:'DOUBLE',label:'DOUBLE'},
                    {value:'DATE',label:'DATE'},
                    {value:'TIME',label:'TIME'},
                    {value:'TIMESTAMP',label:'TIMESTAMP'},
                ],
            }
        },
    }
</script> 