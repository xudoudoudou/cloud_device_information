<template>
    <section>
        <div class='top-bar'>
            <el-button type="success" plain icon="el-icon-fa-plus" @click="addUser" size="small">添加用户</el-button>
            <el-input placeholder="请输入内容" v-model="searchKey" prefix-icon="el-icon-fa-search" style='width: 300px;' size="small">
                <div slot="append">
                    <el-button type="primary" icon="el-icon-fa-search"
                                @click=" pager.pager.pageNumber = 1 ;doSearch()"></el-button>
                </div>
            </el-input>
        </div>
        <el-table :data="pager.dataList" border stripe style="width: 100%" v-loading='loading'>
            <el-table-column prop="id" label="ID" header-align="center" align="center" width="55">
            </el-table-column>
            <el-table-column prop="name" label="用户名" show-overflow-tooltip header-align="center" align="center">
            </el-table-column>
            <el-table-column prop="realName" label="姓名" show-overflow-tooltip header-align="center" align="center">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" :formatter="formatter" show-overflow-tooltip
                             header-align="center" align="center">
            </el-table-column>
            <el-table-column prop="status" label="状态" show-overflow-tooltip header-align="center" align="center">
                <template slot-scope="scope">
                    <el-tag size="small" :type="scope.row.status === 'ACTIVED' ? 'success' : 'danger'" close-transition>
                        {{scope.row.status
                        == 'ACTIVED' ? 'ACTIVED' : 'DISABLED'}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" show-overflow-tooltip header-align="center" align="center">
                <template slot-scope="scope">
                    <el-button-group>
                        <el-button title="编辑用户" size="mini" type="primary" icon="el-icon-fa-edit"
                                   @click="handleEdit(scope.$index,scope.row)"></el-button>
                        <el-button title="重置密码" size="mini" type="primary" icon="el-icon-fa-lock"
                                   @click="handleReset(scope.$index,scope.row)"></el-button>
                        <el-button title="删除用户" size="mini" type="primary" icon="el-icon-fa-trash"
                                   @click="handleDelete(scope.$index,scope.row)"></el-button>
                        <el-button title="用户角色" size="mini" type="primary" icon="el-icon-fa-fire"
                                   @click="handleGrant(scope.$index,scope.row,'role')"></el-button>
                        <el-button title="用户授权" size="mini" type="primary" icon="el-icon-fa-bolt"
                                   @click="handleGrant(scope.$index,scope.row,'permission')"></el-button>
                        <el-button title="渠道授权" size="mini" type="primary" icon="el-icon-fa-refresh"
                                   @click="handleChannel(scope.$index,scope.row)"></el-button>
                        <!-- <el-button title="Token列表" size="mini" type="primary" icon="el-icon-tickets"
                                   @click="tokenList(scope.$index,scope.row,'permission')"></el-button> -->
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination small style='text-align: center; margin-top: 10px;' layout="prev, pager, next"
                        :total="pager.pager.recordCount" :page-size="pager.pager.pageSize"
                        :current-page.sync="pager.pager.pageNumber" v-if="pager.pager.recordCount > 15"
                        @current-change="changePage">
        </el-pagination>
        <!-- 弹框区域-->
        <el-dialog :title="user.id == 0 ? '添加用户' : '编辑用户' " :visible.sync="addEditShow" width="30%">
            <el-form :model="user" :rules="$rules" ref="userForm">
                <el-form-item label="用户名" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="user.name" auto-complete="off" suffix-icon="el-icon-fa-user"
                              placeholder="请填写用户名"></el-input>
                </el-form-item>
                <el-form-item label="真实姓名" :label-width="formLabelWidth" prop="realName">
                    <el-input v-model="user.realName" auto-complete="off" suffix-icon="el-icon-fa-vcard"
                              placeholder="请填写用户真实姓名"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth" prop="password"
                              v-show="user.password != '00000000'">
                    <el-input type="password" v-model="user.password" auto-complete="off"
                              suffix-icon="el-icon-fa-lock" placeholder="请填写用户密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" :label-width="formLabelWidth" prop="rePassword"
                              v-show="user.rePassword != '00000000'">
                    <el-input type="password" v-model="user.rePassword" auto-complete="off"
                              suffix-icon="el-icon-fa-lock" placeholder="请再次填写用户密码"></el-input>
                </el-form-item>
                <el-form-item label="电话" :label-width="formLabelWidth" prop="phone">
                    <el-input v-model="user.phone" auto-complete="off" suffix-icon="el-icon-fa-phone"
                              placeholder="请填写用户电话号码"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
                    <el-input v-model="user.email" auto-complete="off" suffix-icon="el-icon-fa-envelope"
                              placeholder="请填写用户Email地址"></el-input>
                </el-form-item>
                <el-form-item label="用户状态" :label-width="formLabelWidth">
                    <el-switch v-model="user.status" active-value="ACTIVED" inactive-value="DISABLED">
                    </el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addEditShow = false ; user = {status:'ACTIVED'}">取 消</el-button>
                <el-button type="primary" @click="saveOrUpdateUser('userForm')">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="重置密码" :visible.sync="resetShow" width="30%">
            <el-form :model="user" :rules="$rules" ref="resetForm">
                <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
                    <el-input type="password" v-model="user.password" auto-complete="off"
                              suffix-icon="el-icon-fa-lock"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetShow = false">取 消</el-button>
                <el-button type="primary" @click="resetPassword('resetForm')">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="type=='role' ? '设置角色' : '设置权限'" :visible.sync="grantShow" :width="dialogWidth">
            <template>
                <el-transfer v-model="selected" :data="options" :titles="['待选项', '已选项']" filterable></el-transfer>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click="grantShow = false">取 消</el-button>
                <el-button type="primary" @click="grant">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title='设置渠道权限' :visible.sync="channelShow">
            <Channel :cid='userId' @channelSelect='saveChannel' v-if='channelShow'></Channel>
            <div slot='footer' class='dialog-footer'>
                <el-button @click="channelShow = false">取 消</el-button>
                <el-button type="primary" @click="updateChannel">确 定</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<script>
    import moment from "moment";
    import Channel from '../account/Channel';

    export default {
        data() {
            return {
                loading: true,
                searchKey: "",
                pager: {
                    pager: {
                        pageCount: 0,
                        pageNumber: 1,
                        pageSize: 15,
                        recordCount: 0
                    }
                },
                selected: [],
                options: [],
                addEditShow: false,
                resetShow: false,
                grantShow: false,
                type: "role",
                user: {
                    id: 0,
                    name: "",
                    realName: "",
                    status: "ACTIVED",
                    password: "",
                    rePassword: "",
                    phone: "",
                    email: ""
                },
                userId: 0,
                formLabelWidth: "100px",
                channelShow: false,
                chosedIds: {},
                selectedChannel: {}
            };
        },
        components: {
            Channel
        },
        computed: {
            dialogWidth() {
                return 590 * 100 / this.$utils.windowWidth() + "%";
            }
        },
        watch: {
            options: function () {
                this.selected = [];
                this.options.forEach(item => {
                    if (item.selected) {
                        this.selected.push(item.key);
                    }
                });
            }
        },
        methods: {
            grant() {
                let url = "/user/grant/" + this.type;
                let data = {
                    userId: this.user.id,
                    grantIds: this.selected
                };
                this.$api.User.grant(this.user.id, this.type, this.selected, result => {
                    this.$message({
                        type: "success",
                        message: "授权成功!"
                    });
                    window.setTimeout(() => {
                        this.grantShow = false;
                    }, 2000);
                });
            },
            resetPassword(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.$api.User.resetPassword(
                            this.user.id,
                            this.user.name,
                            this.user.password,
                            result => {
                                this.$message({
                                    type: "success",
                                    message: "重置成功!"
                                });
                                this.resetShow = false;
                            }
                        );
                    } else {
                        return false;
                    }
                });
            },
            handleReset(index, row) {
                this.user.id = row.id;
                this.user.name = row.name;
                this.resetShow = true;
            },
            handleChannel(index, item) {
                this.userId = item.id
                this.channelShow = true
            },
            saveChannel(ids) {
                // console.log('ids', ids)
                this.selectedChannel = ids
            },
            updateChannel() {
                let ids = []
                for(let i in this.selectedChannel) {
                    ids = this.selectedChannel[i].concat(ids)
                }
                ids = JSON.stringify(ids)
                this.$api.Channel.channelOfAccount(this.userId, ids, res => {
                    if(res) {
                        this.$message.success('渠道授权成功~~~')
                    }
                    this.channelShow = false
                })
            },
            // tokenList(index,row){
            //     this.$router.push({
            //         path:'/user_token',
            //         query:{
            //             id:row.id
            //         }
            //     })
            // },
            changePage() {
                if (this.searchKey) {
                    this.doSearch();
                } else {
                    this.loadData();
                }
            },
            doSearch() {
                this.loading = true
                this.$api.User.search(
                    this.pager.pager.pageNumber,
                    this.searchKey,
                    result => {
                        this.pager = result.pager;
                        this.loading = false
                    }
                );
            },
            checkSame() {
                return this.user.password === this.user.rePassword;
            },
            addUser() {
                this.addEditShow = true;
                this.user = {
                    id: 0,
                    name: "",
                    realName: "",
                    status: "ACTIVED",
                    password: "",
                    rePassword: "",
                    phone: "",
                    email: ""
                };
            },
            saveOrUpdateUser(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid && this.checkSame()) {
                        var callback = result => {
                            this.changePage();
                            this.addEditShow = false;
                        };
                        this.user.id
                            ? this.$api.User.update(this.user, callback)
                            : this.$api.User.save(this.user, callback);
                    } else {
                        return false;
                    }
                });
            },
            formatter(row, column) {
                return moment(row.createTime, "YYYY-MM-DD hh:mm:ss").format(
                    "YYYY年MM月DD日"
                );
            },
            handleEdit(index, row) {
                let id = this.pager.dataList[index].id;
                this.user = row;
                this.user.password = "00000000";
                this.user.rePassword = "00000000";
                this.addEditShow = true;
            },
            handleGrant(index, row, type) {
                this.user.id = row.id;
                this.type = type;
                this.$api.User.userGrantInfo(type, row.id, result => {
                    this.options = [];
                    result.infos.forEach((item, index) => {
                        this.options.push({
                            key: item.id,
                            label: item.description,
                            selected: item.selected
                        });
                    });
                    this.grantShow = true;
                });
            },
            handleDelete(index, row) {
                this.$confirm("确认删除用户?", "删除确认", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.$api.User.delete(row.id, result => {
                        this.$message({
                            type: "success",
                            message: "删除成功!"
                        });
                        window.setTimeout(() => {
                            if (this.searchKey) {
                                this.doSearch();
                            } else {
                                this.loadData();
                            }
                        }, 2000);
                    });
                });
            },
            loadData() {
                this.$api.User.list(this.pager.pager.pageNumber, result => {
                    console.log(result)
                    this.pager = result.pager;
                    this.loading = false
                });
            }
        },
        mounted: function () {
            this.loadData();
        }
    };
</script>

<style scoped>
.top-bar{
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
}
</style>