export default ({ $axios, app, route, redirect, store }) => {
    $axios.onRequest(
        config => {
            config.baseURL = process.env.apiUrl; //配置api路径
            config.headers.sessionKey = localStorage.getItem('sessionKey');
            //config.params={'userid':'009114'}
        }
    );  
    $axios.onResponse(response => {
        if (response.status == 200) {
            let data = response.data;
            if (!data) {
                return;
            }
            if (data.status == 1) {
                // if(store.state.act_status){
                    return Promise.resolve(data);
                // }else{
                    // return Promise.resolve(data.data);
                // }
            } else if (data.status == 0) {
                switch (data.code) {
                    case 100:
                        localStorage.removeItem('openId');
                        localStorage.removeItem('sessionKey');
                        let url;
                        if (store.state.backUrl) {
                            url = process.env.host + store.state.backUrl;
                        } else {
                            url = window.location.href;
                        }
                        // url = url.replace(/\//g, "@");
                        url = escape(url);
                        window.location.href = `${process.env.baseUrl}dt/oauth?url=${url}`;
                        break;
                    case 200:
                        redirect('/sorry');
                        break;
                    default:
                        return Promise.reject(data.info);
                }
            }
        }
    });

    $axios.onError(error => {
        const code = parseInt(error.response && error.response.status);

        if (code === 400) {
            app.$toast.fail('出错了');
        }
        if (code === 500) {
            app.$toast.fail('出错了');
        }
    });

}