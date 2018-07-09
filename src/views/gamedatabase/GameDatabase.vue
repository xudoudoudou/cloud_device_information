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
   computed:{
   },
   methods:{
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

