<template>
    <section>
        <el-row style='margin-top: 10px;'>
            <el-col :span='6'>
                <el-button @click='toAdd' type='success' plain size='small'><i class='el-icon-plus'></i>新建游戏</el-button>
            </el-col>
            <el-col :offset='12' :span='6'>
                <el-input v-model='searchMsg' placeholder="账号名称搜索" size='small' clearable @keyup.native.enter='searchGame'>
                    <el-select class='preIpt' v-model="chosedChannelId" slot="prepend" filterable clearable placeholder="请选择渠道"  @change='searchGame'>
                        <el-option
                        v-for="item in channelList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                    <el-button slot='append' @click='searchGame'><i class='el-icon-search'></i></el-button>
                </el-input>
            </el-col>
        </el-row>
        <el-table :data='dataList' border>
            <el-table-column prop='sort' width="60" label='序号'  align='center'></el-table-column>
            <el-table-column prop='gamename' label='游戏名称'  align='center'></el-table-column>
            <el-table-column prop='channelobj.name' label='所属渠道'  align='center'></el-table-column>
            <el-table-column prop='channelobj.code' width="180" label='渠道码'  align='center'></el-table-column>
            <el-table-column prop='apkpackage' label='包名'  align='center'></el-table-column>
            <el-table-column label='游戏图片地址' align='center' >
                <template slot-scope='scope'>
                    <div style="display:flex; flex-direction: row;justify-content: center;">
                        <img :src='scope.row.pic' width='50px' height="50px" style='margin-right: 20px;'>
                        <el-button size='mini' type='primary' plain style="margin-top: 15px; margin-bottom: 10px;" class='picbtn' :data-clipboard-text='scope.row.pic'>复制</el-button>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop='dlurl' label='游戏下载地址' align='center'>
                <template slot-scope="scope">
                    <el-popover trigger='hover' placement="top">
                        <div>{{scope.row.dlurl}}</div>
                        <el-button slot='reference' size='mini' type='success' @click='toDownload(scope.row.dlurl)'>下载</el-button>
                    </el-popover>
                    <el-button size='mini' type='primary' plain style='margin-left:15px;' class='dlbtn' :data-clipboard-text='scope.row.dlurl'>复制</el-button>
                </template>
            </el-table-column>
            <el-table-column prop='hgame' label='推荐游戏' align='center'>
                <template slot-scope='scope'>
                    <div  style="display:flex; flex-direction: row;justify-content: center;">
                        <img :src='scope.row.hotimg' v-if='scope.row.ishot' width='50px' height="50px" style='margin-right: 15px;'/>
                        <el-button @click='toSetHot(scope.row.id, scope.row.hotimg)' v-if='scope.row.ishot' type='success' style="margin-top: 15px; margin-bottom: 10px;" size='mini'>修改</el-button>
                        <el-button @click='cancelHot(scope.row.id)' v-if='scope.row.ishot' type='warning' style="margin-top: 15px; margin-bottom: 10px;" size='mini'>取消</el-button>
                        <el-button @click='toSetHot(scope.row.id)' v-if='!scope.row.ishot' type='success' style="margin-top: 15px; margin-bottom: 10px;" size='mini'>添加</el-button>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop='createtime' label='添加日期'  align='center'></el-table-column>
            <el-table-column label='操作' align="center"  width='260'>
                <template slot-scope='scope'>
                     <!-- <el-dropdown> -->
                        <!--<el-button @click='toUpgit(scope.row,scope.row.id)' size='mini' type='primary'>-->
                     
                            <!-- <i class="el-icon-arrow-down el-icon--right"></i> -->
                        <!--</el-button>-->
                        <!-- <el-dropdown-menu slot="dropdown">礼包列表</el-dropdown-menu>
                    </el-dropdown> -->
                   
                    <el-button @click='toEdit(scope.row)' size='mini' type='primary'>编辑</el-button>
                    <el-button @click='toDel(scope.row.id)' size='mini' type='danger' plain>删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style='text-align: center; margin-top: 10px;'
            v-if='pager.recordCount > 10' 
            :total="pager.recordCount"
            :page-size="pager.pageSize" 
            :current-page="pager.pageNumber" 
            layout="prev, pager, next" 
            @current-change='handlePage'>
        </el-pagination>
        <el-dialog :title='msgContent.title' :visible.sync="isShowContent" width='500px' @close='toCancel'>
            <el-form ref='form' :model='msgContent.content' label-width='100px'>
                <el-form-item label='选择游戏'>
                    <el-select @change='choosegame($event)' v-model="msgContent.content.gamename" filterable clearable placeholder="请选择游戏" >
                        <el-option
                        v-for="item in gamebaselist"
                        :key="item.id"
                        :label="item.gamename"
                        :value="item.gamename">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label='游戏名称'>
                    <el-input v-model='msgContent.content.gamename' disabled></el-input>
                </el-form-item>
                <el-form-item label='游戏图片地址'>
                    <el-popover trigger='hover' placement="right">
                        <img :src='msgContent.content.pic' width='150px' height="150px">
                        <el-input v-model='msgContent.content.pic' slot='reference' disabled></el-input>
                    </el-popover>
                    <!-- <el-upload
                    v-if="!isAdd"
                    class="upload-demo"
                    action="https://box.jiawanhd.com/ssb/xcx/file/image"                  
                    list-type="picture"
                    :on-success='successUpload'
                    :on-error='failUpload'
                    :limit=1
                    :on-exceed="overLimit">
                        <el-button size="mini" type="primary">上传本地图片</el-button>
                    </el-upload> -->
                </el-form-item>
                <el-form-item label='包名'>
                    <el-input v-model='msgContent.content.apkpackage' disabled></el-input>
                </el-form-item>
                <el-form-item label='游戏下载地址'>
                    <el-input v-model='msgContent.content.dlurl'></el-input>
                </el-form-item>
                <el-form-item label='序号'>
                    <el-input v-model='msgContent.content.sort' placeholder="序号越小越靠前显示"></el-input>
                </el-form-item>
                <el-form-item label='所属渠道'>
                    <el-select v-model="msgContent.content.channel" filterable placeholder="请选择渠道">
                        <el-option
                        v-for="item in topChannelList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot='footer'>
                <el-button @click='toSave' type='success'>保存</el-button>
                <el-button @click='toCancel' type='text'>取消</el-button>
            </div>
        </el-dialog>
        <el-dialog title='设置推荐游戏' :visible.sync="showHot" width="600px" @close='showHot = false'>
            <div class='line'>
                <div class='title'>游戏图片：</div>
                <img :src='imgurl' width='50px' height="50px" v-if='imgurl' style='margin-right: 15px;'/>
                <!-- <el-button @click='openImg' type='primary' plain size='small' style="margin-top: 15px; margin-bottom: 15px;">上传本地图片</el-button> -->
                 <el-upload
                    ref="upload"
                    class="upload-demo"
                    action="https://box.jiawanhd.com/ssb/xcx/file/image"                  
                    list-type="picture"
                    :show-file-list="false"
                    :on-success='successUpload'
                    :on-error='failUpload'
                    :limit=1
                    >
                        <el-button size="mini" type="primary" @click="upimg">上传本地图片</el-button>
                </el-upload>
            </div>
            <div class='line'>
                <div class='title'>图片url：</div>
                <el-input v-model='imgurl' size='small' style='width: 350px'></el-input>
            </div>
            <el-button @click='setHot' type='success' size='small' style='margin-left: 20px'>设置推荐</el-button>
            <!-- <input id='upIpt' @change='setImg' style='visibility: hidden' type='file'/> -->
        </el-dialog>
    </section>
</template>

<script>
import Clipboard from 'clipboard';
import { mapState } from 'vuex';

export default {
    data() {
        return {
            gameList: [],
            searchMsg: '',
            chosedChannelId: '',
            isShowContent: false,
            msgContent: {
                title: '',
                content: {
                    gamename: '',
                    pic: '',
                    dlurl: '',
                    channel: '',
                    apkpackage:'',
                    sort: '',
                }
            },
            pager: {
                pageNumber: 1,
                pageSize: 10,
                recordCount: 10
            },
            isAdd: true,
            currentId: 0,
            showHot: false,
            imgurl: '',
            showGit:false,
            rangeTime:[],
            forever:'1',
            giftBag:{
                giftname:"",
                gamepkg:"",
                codetype:'1',
                code:'',
                remark:'',
                starday:'',
                endday:'',
                
            },
            file:'',
            gamebaselist:[]
        }
    },
    computed: {
        disabled0(){
            if(this.forever=='1'){
                return true
            }else{
                return false
            }
        },
         disabled1(){
            if(this.forever=='2'){
                return true
            }else{
                return false
            }
        },
        ...mapState({
            channelList: state => state.channelList,
        }),
        dataList() {
            let list = this.gameList.sort((a, b) => {
                return a.sort - b.sort;
            })
            list = list.map((e) => {
                e.sort = e.sort.toString()
                return e
            })
            return list
        },
        topChannelList() {
            return this.$store.getters.topChannel()
        }
    },
    watch: {
        "msgContent.content.dlurl"(val) {
            let durl = val.split("_")
            this.msgContent.content.apkpackage = durl[durl.length-2]
        }
    },
    methods: {
        getData() {
            let pageNo = this.pager.pageNumber
            this.$api.Game.list(pageNo, res => {
                if(res.pager.dataList) {
                    this.gameList = res.pager.dataList
                    this.$store.dispatch('getChannel')                
                    this.pager = res.pager.pager
                }
            }) 
                       
        },
        gamebase(){
             this.$api.Game.lsbaseallgame(res=>{
                let data=res.pager
                if(data){
                    this.gamebaselist=data
                }
            })
        },
        choosegame(val){        
            this.gamebaselist.forEach(e => {
                if(e.gamename==val){
                    e.apkpackage=e.package
                    this.msgContent.content=e
                    this.msgContent.content.baseid=e.id
                }
                 
                    
        });
                   
        },
        searchGame() {
            if(!this.chosedChannelId && !this.searchMsg) {
                this.pager.pageNumber = 1
                this.getData()
                return
            }
            // else if(!this.searchMsg && !this.chosedChannelId) {
                
            //     this.getData()
            //     return
            // }
            else if(this.searchMsg && !this.chosedChannelId) {
                this.searchMsg = ''
                this.$message({
                    message: '请选择搜索渠道！',
                    type: 'error'
                })
                return
            }
            this.$api.Game.search(this.searchMsg, this.pager.pageNumber, this.chosedChannelId, res => {
                const data = res.pager
                if(data) {
                    this.gameList = data.dataList
                    this.pager = data.pager
                }
            })
        },
        toDownload(url) {
            window.location.href = url
        },
        toAdd() {
            this.isAdd = true
            this.isShowContent = true
            this.msgContent.title = '新建游戏'
            this.msgContent.content = {
                                        gamename: '',
                                        pic: '',
                                        dlurl: '',
                                        channel: '',
                                        apkpackage:'',
                                        sort: 0
                                    }
        },
        gitCancel(){
            this.showGit=false
        },
        //选择礼包码
        upgiftCode(){
            let code=document.getElementById('giftcode')
            code.onchange=(e)=>{
                this.file =e.target.files
            }
            code.click()
        },
        //导入礼包
        toUpgit(row,id){
            this.showGit=true         
            sessionStorage.setItem('row',JSON.stringify(row))
        },
        addgift(e){
            let sendata=new FormData()
            sendata.append('file',this.file[0]);    
            sendata.append('giftname',this.giftBag.giftname);
            sendata.append('gamepkg',JSON.parse(sessionStorage.row).apkpackage);
            sendata.append('gameid',JSON.parse(sessionStorage.row).id);
            sendata.append('codetype',this.giftBag.codetype);
            sendata.append('code',this.giftBag.code);
            sendata.append('channelcode',JSON.parse(sessionStorage.row).channelobj.code);
            sendata.append('remark',this.giftBag.remark);
            sendata.append('starday',this.rangeTime[0]);
            sendata.append('endday',this.rangeTime[1]);
            this.$api.Game.addgift(sendata,res=>{
                if(res){
                    this.$message({
                        message: '游戏礼包导入成功',
                        type: 'success'
                    })
                    this.showGit=false
                }
                
            })
        },
        toEdit(item) {
            this.isAdd = false
            this.isShowContent = true
            this.msgContent.title = '编辑游戏'
            this.msgContent.content = item
            this.msgContent.content.baseid=item.id
            sessionStorage.setItem('row',JSON.stringify(row))
            console.log(item)
        },
        toDel(id) {
            this.$confirm('确定删除此游戏吗？', '提示', {
                confirmButtonText: '删除',
                cancelButtonText: '取消'
            }).then(() => {
                this.$api.Game.delete(id, res => {
                    if(res) {
                        this.$message({
                            message: '游戏删除成功',
                            type: 'success'
                        }) 
                        this.pager.pageNumber = 1
                        this.isShowContent = false
                        this.getData() 
                    }                    
                })
            }).catch((err) => {
                this.$message({
                    message: '删除失败',
                    type: 'error'
                })
            })
        },
        toCancel() {
            this.isShowContent = false
            this.msgContent = {
                title: '',
                content: {
                    gamename: '',
                    pic: '',
                    dlurl: '',
                    channel: '',
                    apkpackage:'',
                    sort: 0
                }
            }
            this.getData()
        },
        toSave() {
            if(!this.isAdd) {
                this.$api.Game.edit(this.msgContent.content, res => {
                    if(res.game) {
                        this.$message({
                            message: '游戏修改成功！',
                            type: 'success'
                        })
                        this.pager.pageNumber = 1
                    }        
                    this.isShowContent = false
                })
            }
            else {
                this.$api.Game.add(this.msgContent.content, res => {
                    if(res.game) {
                        this.$message({
                            message: '游戏创建成功！',
                            type: 'success'
                        })
                        this.pager.pageNumber = 1
                    }   
                    this.isShowContent = false   
                })
            }
        },
        handlePage(e) {
            this.pager.pageNumber = e
            if(this.chosedChannelId || this.searchMsg) {
                this.searchGame()
            }
            else {
                this.getData()
            }
        },
        upimg(){
            this.$refs.upload.clearFiles();
        },
        successUpload(res) {
            if(res.data.operationState != 'FAIL') {
                console.log(res,'图片路径')
                this.$message({
                    message: '图片上传成功！',
                    type: 'success'
                })
                this.msgContent.content.pic = res.data[0]
                this.imgurl=res.data[0]
                
            }
            else {
                this.$message({
                    message: res.data.error[0],
                    type: 'error'
                })
            }
            
        },
        failUpload(err) {
            this.$message({
                message: '图片上传失败，请重新上传！',
                type: 'error'
            })
        },
        toSetHot(id, url) {
            this.showHot = true
            this.currentId = id
            this.imgurl = ''
            if(url) {
                this.imgurl = url
            }
        },
        cancelHot(id) {
            this.$api.Game.cancelHot(id, res => {
                if(res) {
                    this.$message.success('取消推荐成功~~~')
                    this.getData()
                }
                else {
                    this.$message.error('取消推荐失败~~~')
                }
            })
        },
        openImg() {
            let ipt = document.getElementById('upIpt');
            ipt.click()
        },
        setImg() {
            let file = document.getElementById('upIpt').files;
            let formD = new FormData();
            formD.append('file', file[0]);
            this.$api.Img.uploadImg(formD, res => {
                this.imgurl = res.url
            })
        },
        setHot() {
            if(this.imgurl == '') {
                this.$message.error('图片url不能为空~~~')
                return
            }
            this.$api.Game.setHot(this.currentId, this.imgurl, res => {
                if(res) {
                    this.$message.success('推荐设置成功~~~')
                    this.showHot = false
                    this.getData()
                }
                else {
                    this.$message.error('推荐设置失败~~~')
                }
            })
        }
    },
    mounted() {
        this.getData()
        this.gamebase()
        const dlBtn = new Clipboard('.dlbtn')
        dlBtn.on('success', e => {
            this.$message({
                message: '游戏下载地址复制成功！',
                type: 'success'
            })
        })
        dlBtn.on('error', e => {
            this.$message({
                message: '游戏下载地址复制失败！',
                type: 'error'
            })
        })
        const picBtn = new Clipboard('.picbtn')
        picBtn.on('success', e => {
            this.$message({
                message: '图片地址复制成功！',
                type: 'success'
            })
        })
        picBtn.on('error', e => {
            this.$message({
                message: '图片地址复制失败！',
                type: 'error'
            })
        })
    }
}
</script>

<style lang="scss" scoped>
.search-content{
    margin: 10px;
    text-align: right;
    .el-input{
        width: 300px;
    }
}
.preIpt{
    width: 130px;
}
.line{
    display: flex;
    flex-direction: row;
    margin: 20px;
    .title{
        width: 120px;
    }
}
</style>
