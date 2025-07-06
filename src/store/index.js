import userDetailStore from './user-detail/store'
export default {
    state: {
        ...userDetailStore.state,
    },
    mutations: {
        ...userDetailStore.mutations,
    },
    actions: {
        ...userDetailStore.actions,
    },
};