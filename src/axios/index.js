import instance from './axios'
import { message, Modal } from 'antd'
const getUrl = (num) => {
    let url = '';
    let baseUrl = 'http://wv254w.natappfree.cc'
    switch (num) {
        //  后台服务
        case 1:
            url = `${baseUrl}/back`
            break;
        // 用户单点登录
        case 2:
            url = `${baseUrl}/sso`
            break;
        // 短信
        case 3:
            url = `${baseUrl}/msm`
            break;
        // 权限
        case 4:
            url = `${baseUrl}/acl`
            break;
        // 轮播图及其他内容管理
        case 5:
            url = `${baseUrl}/cms`
            break;
        // 存储服务
        case 6:
            url = `${baseUrl}/oss`
            break;
        //作者 
        case 7:
            url = `${baseUrl}/author`
            break;
        default:
            break;
    }
    return url;
}

export default class Axios {

    static get(object) {
        let baseUrl = getUrl(object.data.service)
        if (object.data && object.data.showLoading !== false) {
            let loading = document.querySelector(".ajax-loading");
            loading.style.display = "block";
        }
        return new Promise((resolve, reject) => {
            instance({
                url: baseUrl + object.url,
                method: "get",
                params: object.data.params ? object.data.params : ''
            }

            ).then(res => {
                if (object.data && object.data.showLoading !== false) {
                    let loading = document.querySelector(".ajax-loading");
                    loading.style.display = "none";
                }
                if (res.status === 200) {
                    if (res.data.code === 0) {
                        resolve(res.data)
                    } else {
                        message.error(res.data.msg)
                    }
                } else {
                    message.error(res.data.msg)
                    reject();
                }
            })
        })
    }
    static post(object) {
        return new Promise((resolve, reject) => {
            let baseUrl = getUrl(object.data.service)
            instance.post(baseUrl + object.url, object.data.params).then(res => {
                if (res.status === 200) {
                    if (res.data.code === 0) {
                        resolve(res.data);
                        message.success("提交成功！")
                    }
                    else {
                        message.error(res.data.msg)
                    }
                } else {
                    Modal.info(
                        {
                            title: "提示",
                            content: "请确认您已填写所有必填项！"
                        }
                    )
                    reject();
                }
            })
        })
    }
    static delete(object) {
        return new Promise((resolve, reject) => {
            let baseUrl = getUrl(object.data.service)
            Modal.confirm({
                title: "提示",
                content: "此操作将永久删除此数据，是否继续？",
                okText: "确认",
                cancelText: "取消",
                onOk() {
                    instance({
                        method:"delete",
                        url:baseUrl + object.url,
                    }).then(res => {
                        if (res.status === 200) {
                            if (res.data.code === 0) {
                                resolve();
                                message.success("删除成功！")
                            }
                        } else {
                            message.error(res.data.msg)
                        }
                    })
                }
            })
        })
    }
    static put(object) {

        return new Promise((resolve, reject) => {
            let baseUrl = getUrl(object.data.service)
            instance.put(baseUrl + object.url, object.data.params).then(res => {
                if (res.status === 200) {
                    if (res.data.code === 0) {
                        resolve();
                        message.success("修改成功!")
                    }
                }
                else {
                    Modal.info({
                        title: "提示",
                        content: "操作失败，请确认是否填写所有必填项！"
                    })
                    reject();
                }
            })

        })

    }

}