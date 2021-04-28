const pkg = require('./package')

module.exports = {
    mode: 'spa',

    srcDir: 'client/', //指定自定义项目目录

    cache: false,

    env: { //全局变量
        // 正式服务器
        host: 'http://staff.zhsumarc.com:8022/lar/dd',
        baseUrl: 'http://staff.zhsumarc.com:8022/lar/',
        apiUrl: 'http://staff.zhsumarc.com:8022/lar/dt/',

        // 测试服务器
        // host: 'http://dd1.zhsumarc.com/dd',
        // baseUrl: 'http://dd1.zhsumarc.com/',
        // apiUrl: 'http://dd1.zhsumarc.com/dt/',

        //本地
        // host: 'http://127.0.0.1/dd',
        // baseUrl: 'http://127.0.0.1:8000/',
        // apiUrl: 'http://127.0.0.1:8000/dt/',

        homePage: '/index/',
        version: 1.1,
        PATH_TYPE:process.env.PATH_TYPE,
        title: '计划管理系统',
    },

    server: { //在这里只是配置本地的访问域名与端口
        port: 88, // default: 3000
        host: '127.0.0.1', // default: localhost,
    },

    /*
     ** Headers of the page
     */
    head: { //头部信息
        title: '计划管理系统',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' },
            { hid: 'description', name: 'description', content: pkg.description }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ],
        script: [
            {src: '//g.alicdn.com/dingding/dingtalk-jsapi/2.3.0/dingtalk.open.js', type:'text/javascript', charset: 'utf-8'}
        ]
    },

    /*
     ** Customize the progress-bar color
     */
    // loading: {
    //     color: '#6440AF',
    //     height: '5px',
    //     failedColor: '#6440AF'
    // },

    loading: false, //loading条配置

    loadingIndicator: { //初次进入spa项目时的loading
        name: 'pulse',
        color: '#6440AF',
        background: 'white'
    },

    /*
     ** Global CSS
     */
    css: [ //全局样式
        '@/assets/css/common.less',
    ],

    /*
     ** Set Middleware
     */
    router: { //全局中间件以及访问路由前缀
        middleware: 'auth',
        base: '/lar/dd/'
        //base: '/dd/'
    },

    /*
     ** Plugins to load before mounting the App
     */
    plugins: [{ //全局插件配置
        src: '~/plugins/vant',
        ssr: false
    }, {
        src: '~/plugins/axios',
        ssr: false
    }, {
        src: '~/plugins/common',
        ssr: false
    }],

    /*
     ** Nuxt.js modules
     */
    modules: [ //模块配置
        // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios',
        '@nuxtjs/style-resources'
    ],

    styleResources: { //全局less变量
        less: './assets/css/variables.less'
    },
    /*
     ** Axios module configuration
     */
    axios: { //axios配置
        // See https://github.com/nuxt-community/axios-module#options
    },

    generate: { // 构建打包后的目录，默认是dist
        dir: 'dd'
    },

    /*
     ** Build configuration
     */
    build: {
        /*
         ** You can extend webpack config here
         */
        extend(config, ctx) {

        },
        babel: {
            plugins: [ //vant引入
                [
                    'import',
                    {
                        libraryName: 'vant',
                        libraryDirectory: 'es',
                        style: name => `${name}/style/less`
                    },
                    'vant'
                ]
            ]
        },
        loaders: { //vant主题变量配置。
            less: {
                modifyVars: {
                    green: '#6440AF', //vant主题颜色
                }
            }
        }
    }
}