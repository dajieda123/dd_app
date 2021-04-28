export const state = () => ({
    askChannel: null
})

export const mutations = {
    setAskChannel(state, text) {
        state.askChannel = text;
    }
}

export const actions = {
    async clickStat({ commit, state, rootState }, params) {
        let u = window.navigator.userAgent;
        let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        let data = {
            event_id: params.event_id,
            visited_url: rootState.visitedUrl,
            visited_at: rootState.visitAt,
            visited_device: 0,
            visited_from: 0
        };
        let option = params.option;
        if (option) {
            data.option = Object.keys(option)[0];
            data.option_value = option[data.option];
        }
        if (isAndroid) {
            data.visited_device = 2;
        }
        if (isiOS) {
            data.visited_device = 1;
        }
        // await this.$axios({
        //     method: "post",
        //     url: "customEventLog/addEventLog",
        //     data: data
        // })
    },
    async addChannelLog({ commit }, params) {
        await this.$axios.get('channelLog/wechatShare/' + params.type).then((res) => {
            commit('setAskChannel', params.type);
            commit('setADTAG', null, { root: true });
        });
    }
}