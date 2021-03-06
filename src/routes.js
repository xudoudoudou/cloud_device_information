import Login from './views/Login.vue'
import Home from './views/Home.vue'
import NotFound from './views/404.vue'

import Dashboard from './views/dashbord/DashBoard.vue'

import User from './views/acl/User.vue'
import UserToken from './views/acl/User_Token.vue'
import Role from './views/acl/Role.vue'
import Permission from './views/acl/Permission.vue'
import Game from './views/acl/Game.vue'

import Account from './views/account/Account.vue'
import Channel from './views/account/Channel.vue'
import PerChannel from './views/account/PerChannel.vue'
import PerChannelData from './views/account/PerChannelData.vue'

import Payment from './views/payment/Payment.vue'
import UserMsg from './views/payment/UserMsg.vue'

import AndroidDevice from './views/acl/AndroidDevice'
import iosDevice from './views/acl/iosDevice'

import DataContent from './views/mission/dataContent'
import MissionList from './views/mission/missionList'

import ImgList from './views/img/ImgList'

import CodeBook from './views/codebook/Index.vue'
import CodeBookGroup from './views/codebook/Group.vue'

import Setting from './views/setting/Index.vue'

import Branch from './views/department/Branch.vue'
import Department from './views/department/Index.vue'

import Database from './views/monitor/DataBase.vue'
import Runtime from './views/monitor/Runtime.vue'
import APM from './views/monitor/Apm.vue'
import LoginLog from './views/monitor/LoginLog.vue'

import GameDatabase from './views/gamedatabase/GameDatabase.vue'


let routes = [
  {
    path: '/',
    redirect: '/dashboard',
    hidden: true
  },
  {
    path: '/login',
    component: Login,
    name: '',
    hidden: true
  },
  {
    path: '/404',
    component: NotFound,
    name: '',
    hidden: true
  },
  {
    path: '/',
    component: Home,
    name: '主页',
    leaf: true,
    meta: {
      requiresAuth: true
    },
    iconCls: 'el-icon-fa-dashboard', //图标样式class
    children: [{
      path: '/dashboard',
      iconCls: 'el-icon-fa-dashboard',
      component: Dashboard,
      name: 'Dashboard',
      meta: {
        requiresAuth: true
      },
    }]
  },
  {
    path: '/',
    component: Home,
    name: '访问控制',
    iconCls: 'el-icon-fa-users', //图标样式class
    meta: {
      requiresAuth: true
    },
    children: [{
        path: '/user',
        iconCls: 'el-icon-fa-user',
        component: User,
        meta: {
          p: 'user.list',
          requiresAuth: true
        },
        name: '用户管理',
      },
      {
        path: '/role',
        iconCls: 'el-icon-fa-lock',
        component: Role,
        meta: {
          p: 'role.list',
          requiresAuth: true
        },
        name: '角色管理'
      },
      {
        path: '/permission',
        iconCls: 'el-icon-fa-eye',
        component: Permission,
        meta: {
          p: 'permission.list',
          requiresAuth: true
        },
        name: '权限管理'
      },
      {
        path: '/game',
        iconCls: 'el-icon-tickets',
        component: Game,
        name: '游戏管理',
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/user_token',
        component: UserToken,
        iconCls: 'el-icon-tickets',
        name: 'Token管理',
        meta: {
          requiresAuth: true
        },
      }
    ]
  },
  {
    path:'/',
    component: Home,
    name:'游戏库管理',
    iconCls: 'el-icon-circle-plus', //图标样式class
    mata:{
      requiresAuth:true
    },
    children:[
      {
        path: '/gamedatabase',
        iconCls: 'el-icon-tickets',
        component: GameDatabase,
        name: '游戏包管理',
        meta: {
          requiresAuth: true
        }
      },
    ]
  },
  {
    path: '/',
    component: Home,
    name: '帐号控制',
    iconCls: 'el-icon-goods', //图标样式class
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '/account',
        iconCls: 'el-icon-tickets',
        component: Account,
        name: '账户管理',
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/channel',
        iconCls: 'el-icon-news',
        component: Channel,
        name: '渠道管理',
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/perchannel',
        iconCls: 'el-icon-news',
        component: PerChannel,
        name: '渠道日数据管理',
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/perchanneldata',
        iconCls: 'el-icon-news',
        component: PerChannelData,
        name: '渠道日数据',
        meta: {
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '设备管理',
    iconCls: 'el-icon-mobile-phone', //图标样式class
    meta: {
      requiresAuth: true
    },
    children: [{
        path: '/Android_device',
        component: AndroidDevice,
        iconCls: 'el-icon-mobile-phone',
        name: 'Android设备管理',
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/ios_device',
        component: iosDevice,
        iconCls: 'el-icon-mobile-phone',
        name: 'IOS设备管理',
        meta: {
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '支付管理',
    iconCls: 'el-icon-tickets',
    meta: {
      requiresAuth: true
    },
    children: [{
      path: '/payment',
      component: Payment,
      iconCls: 'el-icon-tickets',
      name: '支付信息',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/user_msg',
      iconCls: 'el-icon-view',
      component: UserMsg,
      name: '注册用户信息',
      meta: {
        requiresAuth: true
      }
    }]
  },
  {
    path: '/',
    component: Home,
    name: '任务管理',
    iconCls: 'el-icon-date',
    meta: {
      requiresAuth: true
    },
    children: [{
      path: '/mission_list',
      component: MissionList,
      iconCls: 'el-icon-edit-outline',
      name: '任务列表',
      meta: {
        requiresAuth: true
      },
    }]
  },
  {
    path: '/',
    component: Home,
    name: '图片管理',
    iconCls: 'el-icon-picture-online',
    meta: {
      requiresAuth: true
    },
    children: [{
      path: '/img_list',
      component: ImgList,
      iconCls: 'el-icon-picture',
      name: '图片列表',
      meta: {
        requiresAuth: true
      }
    }]
  },
  {
    path: '/',
    component: Home,
    name: '码本管理',
    iconCls: 'el-icon-fa-book',
    meta: {
      requiresAuth: true
    },
    children: [{
        path: '/codegroup',
        iconCls: 'el-icon-fa-object-group',
        component: CodeBookGroup,
        name: '码本分组',
        meta: {
          requiresAuth: true
        },
      },
      {
        path: '/codebook',
        component: CodeBook,
        iconCls: 'el-icon-fa-cubes',
        name: '码本数据',
        meta: {
          requiresAuth: true
        },
      }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'el-icon-fa-cogs',
    name: '配置管理',
    meta: {
      requiresAuth: true
    },
    children: [{
      path: '/setting',
      component: Setting,
      iconCls: 'el-icon-fa-cog',
      name: '配置列表',
      meta: {
        requiresAuth: true
      },
    }]
  },
  {
    path: '/',
    component: Home,
    name: '组织架构',
    iconCls: 'el-icon-fa-building',
    meta: {
      requiresAuth: true
    },
    children: [{
      path: '/branch',
      component: Branch,
      iconCls: 'el-icon-fa-bank',
      name: '机构管理',
      meta: {
        requiresAuth: true
      },
    }, {
      path: '/department',
      component: Department,
      iconCls: 'el-icon-fa-chrome',
      name: '部门管理',
      meta: {
        requiresAuth: true
      },
    }]
  },
  {
    path: '/',
    component: Home,
    name: '监控面板',
    iconCls: 'el-icon-fa-camera',
    meta: {
      requiresAuth: true
    },
    children: [{
      path: '/db',
      component: Database,
      iconCls: 'el-icon-fa-database',
      name: 'Druid监控',
      meta: {
        requiresAuth: true
      },
    }, {
      path: '/runtime',
      component: Runtime,
      iconCls: 'el-icon-fa-server',
      name: '运行环境',
      meta: {
        requiresAuth: true
      },
    }, {
      path: '/login/log',
      component: LoginLog,
      iconCls: 'el-icon-fa-history',
      name: '登录日志',
      meta: {
        requiresAuth: true
      },
    }, {
      path: '/trace',
      component: APM,
      iconCls: 'el-icon-fa-tags',
      name: '操作日志',
      meta: {
        requiresAuth: true
      },
    }]
  }
];

export default routes;
