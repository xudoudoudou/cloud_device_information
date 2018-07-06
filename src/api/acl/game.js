import http from '@/http'

export default {
    /**
     * 游戏列表
     * @param {number} page 页码
     * @param {Function} success 回调
     */
    list(page, success) {
        http.get('games/list', {
            page: page
        }, success);
    },
     /**
      * 导入礼包
      * @param {string} giftname 礼包名称
      * @param {string} gamepkg 游戏包名
      * @param {string} codetype 礼包类型
      * @param {string} code 一码通礼包码
      * @param {string} file 非一码通，礼包文件
      * @param {string} remark 使用说明
      * @param {string} srarday 有效期 开始时间
      * @param {string} endday 有效期 结束时间
      * @param {string} channelcode 渠道码
      * @param {Function} success 回调
      */
     addgift(obj, success) {      
         http.postBody('/games/addgift', obj, success);
     },
    /**
     * 添加游戏
     * @param {string} gamename 游戏名称
     * @param {string} pic 游戏图片地址
     * @param {string} dlurl 下载地址
     * @param {string} channel 所属渠道
     * @param {Function} success 回调
     */
    add(obj, success) {
        http.postBody('games/add', {
            gamename: obj.gamename,
            pic: obj.pic,
            dlurl: obj.dlurl,
            channel: obj.channel,
            apkpackage:obj.apkpackage,
            sort: obj.sort
        }, success);
    },
    /**
     * 编辑游戏
     * @param {string} id ID
     * @param {string} gamename 游戏名称
     * @param {string} pic 游戏图片地址
     * @param {string} dlurl 下载地址
     * @param {string} channel 所属渠道
     * @param {Function} success 回调
     */
    edit(obj, success) {
        http.postBody('games/edit', {
            id: obj.id,
            gamename: obj.gamename,
            pic: obj.pic,
            dlurl: obj.dlurl,
            channel: obj.channel,
            apkpackage:obj.apkpackage,
            sort: obj.sort
        }, success);
    },
    /**
     * 删除游戏
     * @param {string} id ID
     * @param {Function} success 回调
     */
    delete(id, success) {
        http.get('games/delete/' + id, success);
    },
    /**
     * 搜索游戏
     * @param {string} key 搜索关键词
     * @param {number} page 页码
     * @param {number} channelId 渠道id
     * @param {Function} success 回调
     */
    search(key, page, channelid, success) {
        http.get('games/search', {
            key: key,
            channelid: channelid,
            page: page
        }, success);
    },
    /**
     * 设置推荐
     * @param {number} id ID
     * @param {string} hotimg 推荐图片url
     * @param {Function} success 成功回调
     */
    setHot(id, hotimg, success) {
        http.get('games/sethot', {
            id: id,
            hotimg: hotimg
        }, success)
    },
    /**
     * 取消推荐
     * @param {number} id ID
     * @param {Function} success 成功回调
     */
    cancelHot(id, success) {
        http.get('games/unsethot', {
            id: id
        }, success)
    },
}