<template>
    <section>
        <el-row style='margin-top: 10px;'>
            <el-col :span='6'>
                <el-button @click='toAdd' type='success' plain size='small'><i class='el-icon-plus'></i>新建游戏</el-button>      
            </el-col>
            <el-col :offset='12' :span='6'>
                <el-input v-model='searchMsg' placeholder="游戏名称或包名搜索" size='small' clearable @keyup.native.enter='searchGame'>
                    <el-button slot='append' @click='searchGame'><i class='el-icon-search'></i></el-button>
                </el-input>
            </el-col>
        </el-row>
        <el-table :data='dataList' border>
            <el-table-column prop='gamename' label='游戏名称' width='160' align='center'></el-table-column>
            <el-table-column prop='package' label='包名' width='160' align='center'></el-table-column>
            <el-table-column label='游戏图片地址' align='center' >
                <template slot-scope='scope'>
                    <div style="display:flex; flex-direction: row;justify-content: center;">
                        <img :src='scope.row.pic' width='50px' height="50px" style='margin-right: 20px;'>
                        <el-button size='mini' type='primary' plain style="margin-top: 15px; margin-bottom: 10px;" class='picbtn' :data-clipboard-text='scope.row.pic'>复制</el-button>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label='操作' align="center"  width='260'>
                <template slot-scope='scope'>
                	<!-- <el-dropdown> -->
                        <el-button @click='toUpgit(scope.row,scope.row.id)' size='mini' type='primary'>
                            导入礼包
                            <!-- <i class="el-icon-arrow-down el-icon--right"></i> -->
                        </el-button>
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
                <el-form-item label="选择游戏">
                    <el-input v-model='msgContent.content.gamename'></el-input>
                </el-form-item>
                <el-form-item label='游戏包名'>
                    <el-input v-model='msgContent.content.package'></el-input>
                </el-form-item>
                <el-form-item label='游戏图片地址'>
                    <el-input v-model='msgContent.content.pic'></el-input>
                 <el-upload
                    class="upload-demo"
                    action="https://box.jiawanhd.com/ssb/xcx/file/image"                  
                    list-type="picture"
                    :on-success='successUpload'
                    :on-error='failUpload'
                    :limit=1
                    :on-exceed="overLimit">
                        <el-button size="mini" type="primary">上传本地图片</el-button>
                </el-upload>
                </el-form-item>
                
            </el-form>
            <div slot='footer'>
                <el-button @click='toSave' type='success'>保存</el-button>
                <el-button @click='toCancel' type='text'>取消</el-button>
            </div>
        </el-dialog>
        <el-dialog title='导入礼包' :visible.sync="showGit" width="600px" @close='showGit = false'>
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
                    <el-button  v-if="giftBag.codetype=='2'" style="width:100%; background:rgb(242,242,242)" @click="upgiftCode">选择文件</el-button>
                    <input type="file" id="giftcode" hidden/>
                </el-form-item>
                <el-form-item label="有效期:" >
                    <el-radio v-model="forever" label="1" style="width:30%;">
                        <el-button type="text" :disabled="disabled1" style="width:90%;" :style="disabled1?'background:rgb(245,247,250)':'background:rgb(252,252,254)'" >永久</el-button>
                    </el-radio>
                    <el-radio v-model="forever" label="2" style="display:inline;">
                        <el-date-picker
                        :disabled="disabled0"
                        style="width:58%;"
                        v-model="rangeTime"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
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
                    <el-button  type='success' @click="addgift($event)" style="width:40%">添加</el-button>
                    <el-button type='info' @click='gitCancel' style="width:40%">取消</el-button>
                </el-form-item>  
            </el-form>
        </el-dialog>
    </section>
</template>
<script>
import Clipboard from 'clipboard';
import { mapState } from 'vuex';
export default {
   data(){
       return{
           dataList:[],
           gamebaglist:[],
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
                    package:'',
                    id:null
                }
            },
            isShowContent:false,
            isadd:false,//新增
            showGit:false,
            forever:'1',
            rangeTime:[],
            file:'',
            giftBag:{
                giftname:"",
                gamepkg:"",
                codetype:'1',
                code:'',
                remark:'',
                starday:'',
                endday:'',
                context:'',//礼包内容
                
            },
       }
   },
   mounted(){
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
    },
   methods:{
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
            sessionStorage.setItem('getrowid',JSON.stringify(row))
        },
        addgift(e){
            let sendata=new FormData()
            sendata.append('file',this.file[0]);    
            sendata.append('giftname',this.giftBag.giftname);//礼包名称
            sendata.append('gameid',JSON.parse(sessionStorage.getrowid).id);//游戏id
            sendata.append('codetype',this.giftBag.codetype);//礼包类型
            sendata.append('code',this.giftBag.code);  //礼包码
			sendata.append('gamepkg',JSON.parse(sessionStorage.getrowid).package);//游戏包名
            sendata.append('remark',this.giftBag.remark);//礼包描述
            sendata.append('remark',this.giftBag.context);//礼包描述
            if(this.forever=='1'){
            	this.rangeTime[0]=''
            	this.rangeTime[1]=''
            }
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
        gitCancel(){
            this.showGit=false
        },
       handlePage(e) {
            this.pager.pageNumber = e
            this.getGamedatalist()
        },
        overLimit(files, fileList) {
            this.$message({
                message: '请删除原有照片再上传！',
                type: 'warning'
            })
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
       getGamedatalist(){
         let page = this.pager.pageNumber
          let key=this.searchMsg
             this.$api.Game.gamebaselist(page,key,res => {
                if(res.pager.dataList) {
                    this.dataList = res.pager.dataList
                    this.pager = res.pager.pager  
                }
           
            }) 
          
       },
       searchGame(){
            this.getGamedatalist()           
       },
       toAdd(){
           this.isShowContent=true
           this.msgContent.title='新增游戏包'
           this.isadd=true
       },
       toEdit(item){
           this.isShowContent=true
           this.msgContent.title='编辑游戏包'
           this.isadd=false
           this.msgContent.content=item
       },
        toDel(id){
             this.$confirm('确定删除此游戏吗？', '提示', {
                confirmButtonText: '删除',
                cancelButtonText: '取消'
            }).then(() => {
                this.$api.Game.deletegamebase(id, res => {
                    if(res) {
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
       toSave(){
           if(!this.msgContent.content.gamename){
               this.$message({message: '游戏名称不能为空',type:'waring'})
               return
           }
           if(!this.msgContent.content.package){
               this.$message({message: '游戏包不能为空',type:'waring'})
               return
           }
           if(!this.msgContent.content.pic){
               this.$message({message: '请上传图片',type:'waring'})
               return
           }
           if(!this.isadd){
               this.$api.Game.editgamebase(this.msgContent.content, res => {
                    if(res) {
                        this.$message({
                            message: '游戏库修改成功！',
                            type: 'success'
                        })
                    }
                    this.getGamedatalist()
                    this.msgContent.content=''       
                    this.isShowContent = false
                })               
           }else{
               this.$api.Game.addbasegame(this.msgContent.content,res=>{
                   if(res){
                    this.$message({
                        message: '游戏库添加成功',
                        type: 'success'
                    })
                    this.getGamedatalist()
                    this.isShowContent=false
                }
               })
           }
       },
       toCancel(){
           this.isShowContent=false
       }
   }
}
</script>

<style lang="scss" scoped>

</style>

