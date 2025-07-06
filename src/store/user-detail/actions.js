export default {
    increaseLastId(store) {
        store.commit('increaseLastId');
    },
    setLastId(store, lastId) {
        store.commit('setLastId', lastId);
    },
    setUserDetail(store, userDetail) {
        store.commit('setUserDetail', userDetail);
    },
    setDeleted(store, deleted) {
        store.commit('setDeleted', deleted);
    },
    setSaved(store, saved) {
        store.commit('setSaved', saved);
    },
    resetUserDetail(store) {
        store.commit('setUserDetail', {});
    },
    resetDeleted(store) {
        store.commit('setDeleted', {
            status: false,
            userId: null,
        });
    },
    resetSaved(store) {
        store.commit('setSaved', {
            status: false,
            user: {},
        });
    },
};