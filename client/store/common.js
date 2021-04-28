export const state = () => ({
    headTitle: '',
    headBottom: true,
    headBg: '#fff'
})

export const mutations = {
    setTitle(state, text) {
        state.headTitle = text;
    },
    setHeaderBottom(state, text) {
        state.headBottom = text;
    },
    setHeadBg(state, text) {
        state.headBg = text;
    }
}

export const actions = {

}