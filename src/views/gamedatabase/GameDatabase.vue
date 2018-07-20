<template>
    <section>
        <el-row style='margin-top: 10px;'>
            <el-col :span='6'>
                <el-button @click='toAdd' type='success' plain size='small'>
                    <i class='el-icon-plus'></i>新建游戏</el-button>
            </el-col>
            <el-col :offset='12' :span='6'>
                <el-input v-model='searchMsg' placeholder="游戏名称或包名搜索" size='small' clearable @keyup.native.enter='searchGame'>
                    <el-button slot='append' @click='searchGame'>
                        <i class='el-icon-search'></i>
                    </el-button>
                </el-input>
            </el-col>
        </el-row>
        <el-table :data='dataList' border>
            <el-table-column prop='gamename' label='游戏名称' width='160' align='center'></el-table-column>
            <el-table-column prop='package' label='包名' width='160' align='center'></el-table-column>
            <el-table-column label='游戏图片地址' align='center'>
                <template slot-scope='scope'>
                    <div style="display:flex; flex-direction: row;justify-content: center;">
                        <img :src='scope.row.pic' width='50px' height="50px" style='margin-right: 20px;'>
                        <el-button size='mini' type='primary' plain style="margin-top: 15px; margin-bottom: 10px;" class='picbtn' :data-clipboard-text='scope.row.pic'>复制</el-button>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label='操作' align="center" width='260'>
                <template slot-scope='scope'>
                    <el-dropdown split-button type="primary" size='mini' @command="handleCommand($event,scope.row,null)" trigger='click'>
                        礼包
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="a">添加礼包</el-dropdown-item>
                            <el-dropdown-item command="b">礼包列表</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-button @click='toEdit(scope.row)' size='mini' type='primary'>编辑</el-button>
                    <el-button @click='toDel(scope.row.id)' size='mini' type='danger' plain>删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination style='text-align: center; margin-top: 10px;' v-if='pager.recordCount > 10' :total="pager.recordCount" :page-size="pager.pageSize" :current-page="pager.pageNumber" layout="prev, pager, next" @current-change='handlePage'>
        </el-pagination>
        <!--添加游戏弹出框-->
        <el-dialog :title='msgContent.title' :visible.sync="isShowContent" width='500px' @close='toCancel'>
            <el-form ref='form' :model='msgContent.content' label-width='100px'>
                <el-form-item label="选择游戏">
                    <el-input v-model='msgContent.content.gamename'></el-input>
                </el-form-item>
                <el-form-item label='游戏包名'>
                    <el-input v-model='msgContent.content.package'></el-input>
                </el-form-item>
                <el-form-item label='游戏图片地址'>
                    <el-popover 
                    placement="right"
                    trigger="hover"
                    >
                        <img :src="msgContent.content.pic" width="150px" height="150px">
                        <el-input slot="reference" v-model='msgContent.content.pic'></el-input>
                    </el-popover>                 
                    <el-upload class="upload-demo" action="https://box.jiawanhd.com/ssb/xcx/file/image" list-type="picture" :on-success='successUpload' :on-error='failUpload' :limit=1 :on-exceed="overLimit">
                        <el-button size="mini" type="primary">上传本地图片</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot='footer'>
                <el-button @click='toSave' type='success'>保存</el-button>
                <el-button @click='toCancel' type='text'>取消</el-button>
            </div>
        </el-dialog>
        <!--添加礼包弹出框-->
        <el-dialog :title='bgtitle' :visible.sync="showGit" width="600px" @close='showGit = false'>
            <el-form label-width="80px" :model="giftBag">
                <el-form-item label="礼包名称">
                    <el-input v-model="giftBag.giftname"></el-input>
                </el-form-item>
                <el-form-item label="礼包类型:">
                    <el-radio v-model="giftBag.codetype" label="1">一码通</el-radio>
                    <el-radio v-model="giftBag.codetype" label="2">批量</el-radio>
                </el-form-item>
                <el-form-item label="礼包码:">
                    <el-input v-model="giftBag.code" v-if="giftBag.codetype=='1'"></el-input>
                    <el-button v-if="giftBag.codetype=='2'" style="width:30%; background:rgb(242,242,242);float:left" @click="upgiftCode">选择文件</el-button>
                    <el-input v-if="giftBag.codetype=='2'" v-model="textname" style="width:70%;float:left" placeholder="文件名称"></el-input>
                    <input type="file" id="giftcode" hidden/>
                </el-form-item>
                <el-form-item label="有效期:">
                    <el-radio v-model="forever" label="1" style="width:30%;" @change="choose($event)">
                        <el-button type="text" :disabled="disabled1" style="width:90%;" :style="disabled1?'background:rgb(245,247,250)':'background:rgb(252,252,254)'">永久</el-button>
                    </el-radio>
                    <el-radio v-model="forever" label="2" style="display:inline;" @change="choose($event)">
                        <el-date-picker :disabled="disabled0" style="width:58%;" v-model="rangeTime" type="daterange" value-format="yyyy-MM-dd hh:mm:ss" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                    </el-radio>
                </el-form-item>
                <el-form-item label="使用说明:">
                    <textarea v-model="giftBag.remark" style="width:100%;border-radius:5px;height:100px;"></textarea>
                </el-form-item>
                <el-form-item label='礼包内容'>
                    <textarea v-model="giftBag.context" style="width:100%;border-radius:5px;height:100px;"></textarea>
                </el-form-item>
                <el-form-item style="text-align:center">
                    <el-button type='success' @click="addgift($event)" style="width:40%">保存</el-button>
                    <el-button type='info' @click='gitCancel' style="width:40%">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--礼包列表-->
        <el-dialog title="礼包列表" :visible.sync="showGitList" width='70%' @close="showGitList=false">
            <el-table :data="gitBagList" border>
                <el-table-column prop="giftname" label="礼包名称" align='center'></el-table-column>
                <el-table-column prop="remark" label="使用说明" align='center'></el-table-column>
                <el-table-column prop="context" label="礼包内容" align='center'></el-table-column>
                <el-table-column label="有效期" align='center' width='70'>
                    <template slot-scope="scope">
                        {{scope.row.starday ? Math.floor((Date.parse(scope.row.endday)-Date.parse(scope.row.starday))/86400000)+'天':'永久'}}
                    </template>
                </el-table-column>
                <el-table-column label="礼包类型" align='center'>
                    <template slot-scope="scope">
                        <div v-if="scope.row.codetype=='1'"> 一码通</div>
                        <div v-else class="gitype">
                            <span>批量码</span><input style="width:30px" v-model="scope.row.size">
                            <el-popover
                                placement="top-start"
                                title="查看礼包码"
                                width="200"
                                trigger="hover">
                                <ul style="list-style:none">
                                    <li v-for="(item,index) in coldelist" :key="index" v-if="scope.row.id===item.giftid" >{{item.code}}</li>
                                </ul>
                                <div slot="reference" style="display:inline;">
                                    <button style="" @click="getgiftcode(scope.row.id,scope.row.size)">获取</button>
                                    <!--<button class="tag-read" :data-clipboard-text="code" @click="copy(scope.row.id)">复制批量码</button>-->
                                </div>
                            </el-popover>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align='center' width='150'>
                    <template slot-scope="scope">
                        <el-button type="primary" size='mini' @click="handleCommand('c',null,scope.row)">修改</el-button>
                        <el-button type="danger" size='mini' @click="delgitBg(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
                <el-pagination style='text-align: center; margin-top: 10px;' v-if='pager.recordCount > 10' :total="pager.recordCount" :page-size="pager.pageSize" :current-page="pager.pageNumber" layout="prev, pager, next" @current-change='handlePagelist'>
                </el-pagination>
            </el-table>
            
        </el-dialog>
    </section>
</template>
<script>
import Clipboard from 'clipboard';
import { mapState } from 'vuex';
export default {
    data() {
        return {
            dataList: [],
            gamebaglist: [],
            searchMsg: '',
            pager: {
                pageNumber: 1,//当前页数
                pageSize: 15,//每页显示条目个数
                recordCount: null//总条数
            },
            msgContent: {
                title: '',
                content: {
                    gamename: '',
                    pic: '',
                    package: '',
                    id: null
                }
            },
            isShowContent: false,
            isadd: false,//默认修改游戏
            bgtitle:'新增礼包',
            showGit: false,
            forever: '1',
            rangeTime: [],
            file: [],
            giftBag: {
                giftname: "",
                gamepkg: "",
                codetype: '1',
                code: '',
                remark: '',
                starday: '',
                endday: '',
                context: '',//礼包内容

            },
            addgiftbg: false,//默认修改礼包
            showGitList: false,//是否展示礼包列表
            size:0,//礼包码条数
            gitBagList: [],//礼包列表
            coldelist:[],//礼包码列表
            textname:'',
            disabled0:true,
			disabled1:false

        }
    },
    mounted() {
        this.getGamedatalist()
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

       
    },
    computed: {
        // disabled0() {
        //     if (this.forever == '1') {
        //         return true
        //     } else {
        //         return false
        //     }
        // },
        // disabled1() {
        //     if (this.forever == '2') {
        //         return true
        //     } else {
        //         return false
        //     }
        // },
        code(){
            let copylist=[]
            this.coldelist.map((i)=>{
                copylist.push(i.code)
            })
             return copylist
        }
    },
    watch:{
       
    },
    methods: {
        choose(val){
            if(val==1){
                this.rangeTime = []
                this.rangeTime[0] = ''
                this.rangeTime[1] = ''
                this.disabled1=false,
                this.disabled0=true
            }else{
                this.disabled1=true,
                this.disabled0=false
            }
        },
        copy() {
            var clipboard = new Clipboard('.tag-read')
            clipboard.on('success', e => {
                this.$message({
                    message: '复制成功！',
                    type: 'success'
                })
            // 释放内存
            clipboard.destroy()
            })
            clipboard.on('error', e => {
            // 不支持复制
            console.log('该浏览器不支持自动复制')
            // 释放内存
            clipboard.destroy()
            })
        },
        //选择礼包码
        upgiftCode() {
            let code = document.getElementById('giftcode')
            code.onchange = (e) => {
                this.file = e.target.files
                if (this.file) {
                    this.$message({
                        message: '文件选择成功',
                        type: 'warning'
                    })
                }
                
                this.textname=this.file[0].name
            }
            code.click()
        },
        handleCommand(e, row, giflist) {
            if (e == 'a') {
                //添加礼包
                this.showGit = true
                this.addgiftbg = true
                this.bgtitle='新增礼包'
                this.textname=''
                this.giftBag={
                    giftname: "",
                    gamepkg: "",
                    codetype: '1',
                    code: '',
                    remark: '',
                    starday: '',
                    endday: '',
                    context: '',//礼包内容
                }
                sessionStorage.setItem('getrowid', JSON.stringify(row))
            } else if (e == 'b') {
                //获取列表
                this.showGitList = true
                this.msgContent.content = row
                this.getGitbaglist()

            } else if (e == 'c') {
                //编辑礼包列表
                this.showGit = true
                this.addgiftbg = false
                this.bgtitle='编辑礼包'
                this.giftBag = giflist
                this.rangeTime=[giflist.starday,giflist.endday]
                this.giftBag.codetype = giflist.codetype.toString()
                if (this.giftBag.endday) {
                    console.log(this.giftBag.endday)
                    this.forever = '2'
                } else {
                    this.forever = '1'
                }
            }

        },
        //删除礼包列表
        delgitBg(id) {
            console.log(id)
            this.$confirm('此操作将永久删除此文件，是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$api.Game.delgifbg(id,res=>{
                    if(res){
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                         this.getGitbaglist()
                    }
                })  
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },
        //获得礼包列表
        getGitbaglist() {
            let gameid = this.msgContent.content.id
            let page = this.pager.pageNumber
            this.$api.Game.listgift(gameid, page, res => {
                let data = res.gifts
                if (data) {
                    this.gitBagList = data
                }
            })
        },
        //礼包码条数
        getgiftcode(giftid,size){
            this.$api.Game.getgiftcode(giftid,size,res=>{
                console.log(res)
                if(res){ 
                    this.$message({
                                message: '获取成功！',
                                type: 'success'
                            })
                    this.coldelist=res.gifts
                }
            })
        },
        addgift(e) {
            if (!this.giftBag.giftname) {
                this.$message({
                    message: '礼包名称不能为空',
                    type: 'warning'
                })
                return
            }
            if (this.forever == '1') {
                this.rangeTime[0] = ''
                this.rangeTime[1] = ''
            }
            if (this.forever == '2' && !this.rangeTime[0] && !this.rangeTime[1]) {
                this.$message({
                    message: '请选择日期',
                    type: 'warning'
                })
                return
            }
            let sendata = new FormData()   
            sendata.append("file", this.file[0]);
            sendata.append('giftname', this.giftBag.giftname);//礼包名称
            sendata.append('gameid', JSON.parse(sessionStorage.getrowid).id);//游戏id
            sendata.append('codetype', this.giftBag.codetype);//礼包类型
            sendata.append('code', this.giftBag.code);  //礼包码
            sendata.append('gamepkg', JSON.parse(sessionStorage.getrowid).package);//游戏包名
            sendata.append('remark', this.giftBag.remark);//礼包描述
            sendata.append('context', this.giftBag.context);//礼包内容         
            sendata.append('starday', this.rangeTime[0]);
            sendata.append('endday', this.rangeTime[1]);
            sendata.append('id',this.giftBag.id)//礼包id
            if (this.addgiftbg) {
                //新增
                this.$api.Game.addgift(sendata, res => {
                    if (res) {
                        this.$message({
                            message: '游戏礼包导入成功',
                            type: 'success'
                        })
                        this.showGit = false
                        this.giftBag = {}
                    }
                })
            } else {
                //修改 
                this.$api.Game.updgiftbg(sendata, res => {
                    if (res) {
                        this.$message({
                            message: '游戏礼包修改成功',
                            type: 'success'
                        })
                        this.showGit = false
                        this.giftBag = {}
                    }
                })
                    
            }
        },
        gitCancel() {
            this.showGit = false
        },
        handlePage(e) {
            this.pager.pageNumber = e
            this.getGamedatalist()
        },
        handlePagelist(e) {
            this.pager.pageNumber = e
            this.getGitbaglist()
        },
        overLimit(files, fileList) {
            this.$message({
                message: '请删除原有照片再上传！',
                type: 'warning'
            })
        },
        successUpload(res) {
            if (res.data.operationState != 'FAIL') {
                console.log(res, '图片路径')
                this.$message({
                    message: '图片上传成功！',
                    type: 'success'
                })
                this.msgContent.content.pic = res.data[0]
                this.imgurl = res.data[0]
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
        getGamedatalist() {
            let page = this.pager.pageNumber
            let key = this.searchMsg
            this.$api.Game.gamebaselist(page, key, res => {
                if (res.pager.dataList) {
                    this.dataList = res.pager.dataList
                    this.pager = res.pager.pager
                }
            })
        },
        searchGame() {
            this.getGamedatalist() 
        },
        toAdd() {
            this.isShowContent = true
            this.msgContent.title = '新增游戏包'
            this.isadd = true
        },
        toEdit(item) {
            this.isShowContent = true
            this.msgContent.title = '编辑游戏包'
            this.isadd = false
            this.msgContent.content = item
        },
        toDel(id) {
            this.$confirm('确定删除此游戏吗？', '提示', {
                confirmButtonText: '删除',
                cancelButtonText: '取消'
            }).then(() => {
                this.$api.Game.deletegamebase(id, res => {
                    if (res) {
                        this.$message({
                            message: '游戏删除成功',
                            type: 'success'
                        })
                        this.getGamedatalist()
                        this.isShowContent = false
                    }
                })
            }).catch((err) => {
                this.$message({
                    message: '删除失败',
                    type: 'error'
                })
            })
        },
        toSave() {
            if (!this.msgContent.content.gamename) {
                this.$message({ message: '游戏名称不能为空', type: 'waring' })
                return
            }
            if (!this.msgContent.content.package) {
                this.$message({ message: '游戏包不能为空', type: 'waring' })
                return
            }
            if (!this.msgContent.content.pic) {
                this.$message({ message: '请上传图片', type: 'waring' })
                return
            }
            if (!this.isadd) {
                this.$api.Game.editgamebase(this.msgContent.content, res => {
                    if (res) {
                        this.$message({
                            message: '游戏库修改成功！',
                            type: 'success'
                        })
                    }
                    this.getGamedatalist()
                    this.isShowContent = false
                    this.msgContent.content={}
                })
            } else {
                this.$api.Game.addbasegame(this.msgContent.content, res => {
                    if (res) {
                        this.$message({
                            message: '游戏库添加成功',
                            type: 'success'
                        })
                        this.getGamedatalist()
                        this.isShowContent = false
                    }
                })
            }
        },
        toCancel() {
            this.isShowContent = false
        }
    }
}
</script>

<style lang="scss" scoped>
.gitype {
    display: inline;
    span {
        line-height: 25px;
        margin-right: 10px;
    }
    input {
        height: 18px;
        margin-right: 5px;
    }
}
</style>

