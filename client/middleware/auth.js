export default function({ store, redirect, route }) {
    store.commit('setVisitedUrl', process.env.host + route.fullPath);
    store.commit('setVisitAt', parseInt(new Date().getTime() / 1000));
    store.commit('addPages');
    store.dispatch('cbevent/clickStat', { event_id: 'urlLog' });
    if (!localStorage.getItem('openId') && !localStorage.getItem('sessionKey') && process.env.PATH_TYPE !== 'local') {
        if (route.query.openid && route.query.sessionKey) {
            localStorage.setItem("openId", route.query.openid);
            localStorage.setItem("sessionKey", route.query.sessionKey);
        }else {
            let url;
            if (store.state.backUrl) {
                url = process.env.host + store.state.backUrl;
            } else {
                url = window.location.href;
            }
            // url = url.replace(/\//g, "@");
            
            url = escape(url);
            window.location.href = `${process.env.baseUrl}dt/oauth?url=${url}`;
        }
        
    }
}