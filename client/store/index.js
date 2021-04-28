export const state = () => ({
    user: null,
    visitedUrl: null,
    visitAt: null,
    pages: 0,
    axiosTimes: 0,
    act_status:false,
})

export const mutations = {
    setUser(state, text) {
        state.user = text;
    },
    setVisitedUrl(state, text) {
        state.visitedUrl = text;
    },
    setVisitAt(state, text) {
        state.visitAt = text;
    },
    addPages(state) {
        state.pages++;
    },
    addAxiosTimes(state) {
        state.axiosTimes++;
    },
    reduceAxiosTimes(state) {
        state.axiosTimes--;
    },
}

export const getters = {
    
}

export const actions = {

}