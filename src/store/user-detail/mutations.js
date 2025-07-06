export default {
    setDeleted(state, deleted) {
        state.deleted = { ...deleted };
    },
    setSaved(state, saved) {
        state.saved = { ...saved };
    },
    setLastId(state, lastId) {
        state.lastId = lastId;

    },
    increaseLastId(state) {
        state.lastId = state.lastId + 1;
    },
    setUserDetail(state, userDetail) {
        state.userDetail = { ...userDetail };
    },
};