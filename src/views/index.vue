
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
                    <FormItem prop="策略">
                        <Select  placeholder="导入策略" v-model="formQuery.policy">
                            <Option v-for="i in type.policy" :value="i.value" :key="i.value">{{i.label}}</Option>
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
                    <Table :loading="table.loading" border size="small" :columns="col_base" :data="data_base"></Table>
                    <Page align="center" @on-change="handlePage" page-size=5  show-total :total="page.total" style="padding-top:20px;" size="small" show-elevator></Page>
                </Card>
                <Card>
                    <p slot="title">
                        <Icon type="monitor"></Icon>
                        导入日志
                    </p>
                    <a href="#" slot="extra" @click.prevent="handleClearLog">
                        <Icon type="ios-loop-strong"></Icon>
                        清除日志
                    </a>
                    <div id="logContainer" style="height:200px;padding-left:30px;overflow:auto;">
                        <ul >
                            <li v-for="i in logs">{{i}}</li>
                        </ul>
                    </div>
                </Card>
            </Content>
        </Layout>
        <Modal title="新增"   v-model="modal.edit" :closable="false" @on-ok='handleSave'>
            <Form ref="formEdit"  :model="formEdit" style="padding:10px 30px;">
                <FormItem label="名称:" prop="name">
                    <Input type="text" style="width:300px;" v-model="formEdit.name" placeholder="名称"></Input>
                </FormItem>
                <FormItem label="策略:" prop="policy">
                    <Select style="width:300px;" v-model="formEdit.policy">
                        <Option v-for="i in type.policy" :value="i.value" :key="i.value">{{i.label}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="描述:" prop="description">
                    <Input type="textarea" style="width:300px;" :autosize="{minRows: 2,maxRows: 5}" 
                    v-model="formEdit.description" placeholder="导入描述，格式为 作者-模块-内容"></Input>
                </FormItem>
            </Form>
        </Modal>
        <Modal title="配置" inline  v-model="modal.config" :closable="false" >
            <Form ref="formConfig" :model="formConfig" :rules='rulesConfig'>
                <FormItem label="解析配置：" prop="inid">
                    <Select v-model="formConfig.inid" filterable style="width:200px;">
                        <Option v-for="item in select.in.list" :value="item.id" :key="item.name" :label='item.name'></Option>
                    </Select>
                </FormItem>
                <FormItem label="导入配置：" prop="outid">
                    <Select v-model="formConfig.outid" filterable style="width:200px;">
                        <Option v-for="item in select.out.list" :value="item.id" :key="item.name" :label='item.name'></Option>
                    </Select>
                </FormItem>
                <FormItem label="数据源配置：" prop="dbid">
                    <Select v-model="formConfig.dbid" filterable style="width:200px;">
                        <Option v-for="item in select.db.list" :value="item.id":key="item.name":label='item.name'></Option>
                    </Select>
                </FormItem>
                <FormItem label="输入线程：" prop="thinid">
                    <Select v-model="formConfig.thinid" filterable style="width:200px;">
                        <Option v-for="item in select.thin.list" :value="item.id":key="item.name" :label='item.name'></Option>
                    </Select>
                </FormItem>
                <FormItem label="输出线程：" prop="thoutid">
                    <Select v-model="formConfig.thoutid" filterable style="width:200px;">
                        <Option v-for="item in select.thout.list" :value="item.id":key="item.name"  :label='item.name'></Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" size="large" @click="handleModalOper('config',false)">取消</Button>
                <Button type="primary" size="large" @click='handleSaveConfig("formConfig")'>确定</Button>
            </div>
        </Modal>
        <Modal title="导入" okText="开始导入" inline  v-model="modal.import" :closable="false" @on-ok='handleImport'>
            <Tabs value="tabs" v-model = 'formImport.url'>
                <TabPane label="HTTP" name="/import/import" icon="upload" align="center">
                    <Upload align="left" style="width:300px;" multiple type="drag" 
                        action="/import/upload" 
                        :data='formImport' 
                        :on-remove="handleRemoveFile"
                        :default-file-list="uploadFileList" 
                        >
                        <div style="padding: 20px 0;">
                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                            <p>文件上传（支持拖拽）</p>
                        </div>
                    </Upload>
                </TabPane>
                <TabPane label="文件夹" name="/import/importFile" icon="folder">
                    <Form>
                        <FormItem label="文件夹路径：" >
                            <Input v-model="formImport.path" style="width:300px" placeholder="请输入想要上传的文件夹地址"/> 
                            <Button type="primary" @click="handleCheck('file')">检查</Button>
                        </FormItem>
                    </Form>
                    <ul style="padding:0px 50px;">
                        <li v-for="i in files.file">{{i}}</li>
                    </ul>
                </TabPane>
                <TabPane label="FTP" name="/import/importFtp" icon="network">
                    <Form align="center">
                        <FormItem label="FTP地址：" >
                            <Input v-model="formImport.host" style="width:300px" placeholder="host"/> 
                        </FormItem>
                        <FormItem label="FTP端口：" >
                            <Input v-model="formImport.port" style="width:300px" placeholder="port"/> 
                        </FormItem>
                        <FormItem label="FTP目的：" >
                            <Input v-model="formImport.target" style="width:300px" placeholder="目的文件夹"/> 
                        </FormItem>
                        <FormItem label="FTP账号：" >
                            <Input v-model="formImport.username" style="width:300px" placeholder="账号"/> 
                        </FormItem>
                        <FormItem label="FTP密码：" >
                            <Input v-model="formImport.password" style="width:300px" placeholder="密码"/> 
                        </FormItem>
                        <Button  type="primary" @click="handleCheck('ftp')">检查</Button>
                    </Form>
                    <ul style="padding:0px 50px;">
                        <li v-for="i in files.ftp">{{i}}</li>
                    </ul>
                </TabPane>
            </Tabs>
        </Modal>
    </div>
</template>
<script>
    // import SockJs from 'sockjs-client'
    export default {
        data () {
            return {
                type:{
                    policy:[
                        {value:'continue',label:'出现异常继续执行'},
                        {value:'break',label:'出现异常停止执行'},
                    ],
                },
                uploadFileList:[],
                table:{loading:false},
                socket:{},
                page:{
                    total:0
                },
                logs:[],
                files:{
                    file:[],
                    ftp:[],
                },
                modal:{
                    edit:false,
                    config:false,
                    import:false,
                    update:false,
                },
                select:{
                    in:{
                        list:[],
                        value:''
                    },
                    out:{
                        list:[],
                        value:''
                    },
                    db:{
                        list:[],
                        value:''
                    },
                    thin:{
                        list:[],
                        value:''
                    },
                    thout:{
                        list:[],
                        value:''
                    },
                },
                formQuery:{},
                formUpdate:{},
                formImport:{
                    version:'',//批次ID，用来判断上传路径在哪
                    imid:'',//使用哪种配置上传
                    url : '/import/import',//上传方式 HTTP FILE FTP
                    type : 'http',//上传方式 HTTP FILE FTP
                },
                formEdit:{},
                formConfig:{inid:'',outid:'',db:'',thinid:'',thoutid:''},
                rulesConfig:{
                    // inid:[{required:true,message:'此选项不能为空',trigger:'blur'}],
                    // outid:[{required:true,message:'此选项不能为空',trigger:'blur'}],
                    // dbid:[{required:true,message:'此选项不能为空',trigger:'blur'}],
                    // thinid:[{required:true,message:'此选项不能为空',trigger:'blur'}],
                    // thoutid:[{required:true,message:'此选项不能为空',trigger:'blur'}],
                },
                col_base:[
                    {title: 'ID',key: 'id',maxWidth:90,align:'center'},
                    {title: '名称',key: 'name',maxWidth:180,align:'center',tooltip:true},
                    {title: '策略',key: 'policy',align:'center',render:(h,params)=>{
                        if(params.row.policy == 'continue'){
                            return h('p',"出现异常跳过继续执行");
                        }else if(params.row.policy == 'break'){
                            return h('p',"出现异常终止执行");
                        }
                    }},
                    {title: '描述',key: 'description',align:'center',tooltip:true},
                    {title: '操作',align:'center',maxWidth:400,render: (h, params) => {
                            return h('div', [
                                 h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                     style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.handleImportModal(params.row.id)
                                        }
                                    }
                                }, '导入'),
                                 h('Button', {
                                    props: {
                                        type: 'default',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.handleConfig(params.row.id)
                                        }
                                    }
                                }, '配置'),
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
                                            this.handleUpdateModal(params.index)
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
            handlePage(pageNum){
                this.formQuery.page = pageNum;
                this.handleQuery();
            },
            handleQueryFiles(){
                let v = this;
                this.$ajax.get('/data/upload/files').then(function(res){
                    if(res.data.result_status == 1){
                        v.uploadFileList = res.data.data;
                    }
                });
            },
            handleRemoveFile(file,filelist){
                let v = this;
                this.$ajax.delete('/data/upload/file?name='+file.name).then(function(res){
                    if(res.data.result_status == 1){
                        v.$Message.success(res.data.result_msg);
                    }else{
                        v.$Message.error(res.data.result_msg);
                    }
                    v.handleQueryFiles();
                });
            },
            handleCheck(type){
                let $v = this;
                if(type == 'file'){//检查文件路径
                    if(!$v.formImport.path){
                        this.$Message.error("输入的路径不能为空。");
                        return;
                    }
                    this.formImport.type=type;
                    this.$ajax.get('/data/check',{params:$v.formImport})
                    .then(function(res){
                        $v.files.file = [];
                        let data = res.data.data;
                        if(data && data.length > 0){
                            $v.files.file = res.data.data;
                        }else{
                            $v.files.file.push('暂无数据');
                        }
                    }).catch(function(e){

                    });
                }else if(type == 'ftp'){//检查ftp路径
                    if(!$v.formImport.host){
                        this.$Message.error("输入的路径不能为空。");
                        return;
                    }
                    this.formImport.type=type;
                    this.$ajax.get('/data/check',{params:$v.formImport})
                    .then(function(res){
                        $v.files.ftp = [];
                        let data = res.data.data;
                        if(data && data.length > 0){
                            $v.files.ftp = res.data.data;
                        }else{
                            $v.files.ftp.push('暂无数据');
                        }
                    }).catch(function(e){

                    });

                }
            },
            handleModalOper(modal,operate){
                this.modal[modal] = operate;
            },
            handleClearLog(){
                this.logs = [];
                this.socket.close();
            },
            handleInitWebSocket(){
                let $v =this;
                //连接发生错误的回调方法
                $v.socket.onerror = function(){
                    console.log('error');
                };
                //连接成功建立的回调方法
                $v.socket.onopen = function(event){
                    console.log('open');
                }
                //接收到消息的回调方法
                $v.socket.onmessage = function(event){//event.data
                    $v.logs.push(event.data);
                    if(event.data.indexOf('END') > 0){
                        $v.socket.close();
                    }
                }
                //连接关闭的回调方法
                $v.socket.onclose = function(){
                    console.log('close');
                }
                
            },
            handleGetLog(){
                let $v = this;
                //判断当前浏览器是否支持WebSocket
                if('WebSocket' in window){
                    debugger
                    console.log('支持websocket');
                    if($v.socket){
                        $v.socket = null;
                    }
                    $v.socket = new WebSocket("ws://localhost:8080/websocket");
                    this.handleInitWebSocket();
                }else{
                    alert('Not support websocket')
                }
                
            },
            handleUpdate(){
                let $v = this;
                let postData=this.$qs.stringify(this.formUpdate);
                this.$ajax.put('/data/im',postData).then(function(res){
                    if(res.data.result_status == 1){
                        $v.$Message.success(res.data.result_msg);
                        $v.handleQuery();
                    }
                }).catch(function(e){
                    
                });
            },
            handleImport(){
                let $v = this;
                debugger
                $v.handleGetLog();
                let postData=this.$qs.stringify(this.formImport);
                this.$ajax.post(this.formImport.url,postData).then(function(res){
                    if(res.data.result_status == 1){
                        $v.$Message.success(res.data.result_msg);
                    }else{
                        $v.$Message.error(res.data.result_msg);
                    }
                }).catch(function(e){
                    $v.$Message.error(e.message);
                });
            },
            handleInitImportId(){
                let time = new Date().getTime();
                this.formImport.version = time;
            },
            handleImportModal(id){
                this.formImport.imid = id;
                this.modal.import = true;
            },
            handleUpdateModal(index){
                let data = this.data_base[index];
                this.formEdit.id=data.id;
                this.formEdit.name=data.name;
                this.formEdit.description=data.description;
                this.formEdit.policy=data.policy;
                this.modal.edit = true;
            },
            handleConfig(id){
                // this.formConfig={};
                this.formConfig.imid=id;
                let $v = this;
                let p = new Promise(function(resolve,reject){
                    resolve($v.handleQuerySelect(id));
                });
                // let p = new Promise($v.handleQuerySelect(id));
                p.then(function(data){
                    $v.$ajax.get('/data/im/'+id).then(function(res){
                        debugger
                        $v.formConfig.inid = res.data.in?res.data.in.id:'';
                        $v.formConfig.outid = res.data.out?res.data.out.id:'';
                        $v.formConfig.dbid = res.data.db?res.data.db.id:'';
                        $v.formConfig.thinid = res.data.threadIn?res.data.threadIn.id:'';
                        $v.formConfig.thoutid = res.data.threadOut?res.data.threadOut.id:'';
                    }).catch(function(e) {
                        
                    });
                });
                // this.handleQuerySelect(id);
                this.modal.config = true;
            },
            handleQuerySelect(id){//查询select的值
                let $v= this;
                this.$ajax.get('/data/select/ins').then(function(res){
                    $v.select.in.list = res.data;
                }).catch(function(e) {
                    
                });
                this.$ajax.get('/data/select/ths',{params:{type:'in'}}).then(function(res){
                    $v.select.thin.list = res.data;
                }).catch(function(e) {
                    
                });
                this.$ajax.get('/data/select/ths',{params:{type:'out'}}).then(function(res){
                    $v.select.thout.list = res.data;
                }).catch(function(e) {
                    
                });
                this.$ajax.get('/data/select/outs').then(function(res){
                    $v.select.out.list = res.data;
                }).catch(function(e) {
                    
                });
                this.$ajax.get('/data/select/dbs').then(function(res){
                    $v.select.db.list = res.data;
                }).catch(function(e) {
                    
                });
                
                
            },
            handleSaveConfig(name){
                let $v = this;
                this.$refs[name].validate((valid)=>{
                    if(valid){
                        let postData=this.$qs.stringify(this.formConfig);
                        this.$ajax.post('/data/config',postData).then(function(res){
                            if(res.data.result_status == 1){
                                $vue.$Message.success(res.data.result_msg);
                            }
                            $v.handleModalOper('config',false);
                        }).catch(function(e){
                            $v.handleModalOper('config',false);
                        });
                    }else{
                        $v.$Message.error("验证失败");
                    }
                })
            },
            handleQuery(){
                this.table.loading=true;
                let $vue = this;
                this.formQuery.rows=5;
                let postData=this.$qs.stringify(this.formQuery);
                this.$ajax.post('/data/ims',postData).then(function(res){
                    console.log(res);
                    if(res.data.result_status == 1){
                        $vue.data_base = res.data.rows;
                        $vue.page.total = res.data.total;
                    }
                    $vue.table.loading=false;   
                }).catch(function(e){
                    $vue.table.loading=false;   
                });
            },
            handleSave(){
                debugger
                let postData=this.$qs.stringify(this.formEdit);
                let $v = this;
                if(this.formEdit.id){
                    this.$ajax.put('/data/im',postData).then(function(res){
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
                    this.$ajax.post('/data/addIm',postData).then(function(res){
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
                let postData=this.$qs.stringify({id:id});
                let $vue = this;
                this.$ajax.post('/data/delIm',postData).then(function(res){
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
            this.handleInitImportId();
            this.handleQuery();
            this.handleQueryFiles();
        },
        watch:{
            logs() {
                this.$nextTick(() => {
                    var container = this.$el.querySelector("#logContainer");
                    container.scrollTop = container.scrollHeight;
                })
            }
        }
    }
</script> 