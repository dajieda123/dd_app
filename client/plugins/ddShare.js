export default () => {
    if (navigator.userAgent.toLowerCase().indexOf("dingtalk") >= 0) {   //判断是否钉钉
        // 右侧导航点击
        dd.biz.navigation.setRight({
            show: true, //控制按钮显示， true 显示， false 隐藏， 默认true
            control: true, //是否控制点击事件，true 控制，false 不控制， 默认false
            showIcon: true, //是否显示icon，true 显示， false 不显示，默认true； 注：具体UI以客户端为准
            onSuccess: function (result) {
                //如果control为true，则onSuccess将在发生按钮点击事件被回调
                dd.biz.util.share({
                    type: 2, //分享类型，0:全部组件 默认； 1:只能分享到钉钉；2:不能分享，只有刷新按钮
                    url: window.location.href,
                    title: '',
                    content: '',
                    image: 'https://static.dingtalk.com/media/lALPDeC2uILBKEvMyMzI_200_200.png',
                    onSuccess: function () {
                    },
                    onFail: function (err) {
                    }
                })
            },
            onFail: function (err) {
            },
        });
    }
}
