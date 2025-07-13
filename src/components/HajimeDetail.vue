<template>
  <div class="detail">
    <h3 class="detail__title">Detail</h3>
    <div class="form">
      <input type="hidden" v-model="detailData.userId" />
      <div class="grid__box double">
        <div class="form__input">
          <label for="userName">User Name</label>
          <input
            v-model="detailData.userName"
            class="detail__input"
            type="text"
            id="userName"
          />
        </div>
      </div>
      <div class="grid__box">
        <div class="form__input">
          <label for="age">Age</label>
          <input
            v-model.number="detailData.age"
            class="detail__input"
            type="text"
            id="age"
          />
        </div>
      </div>
      <div class="grid__box double">
        <div class="form__input">
          <label for="dateOfBirth">Date Of Birth</label>
          <input
            v-model="detailData.dateOfBirth"
            class="detail__input"
            type="text"
            id="dateOfBirth"
          />
        </div>
      </div>
      <div class="grid__box">
        <div class="form__input">
          <label for="gender">Gender</label>
          <input
            v-model="detailData.gender"
            class="detail__input"
            type="text"
            id="gender"
          />
        </div>
      </div>
    </div>
    <div class="form__btns">
      <base-button class="btn__del" :disabled="disabledDel" @click="confirmDelete">
        Delete
      </base-button>
      <base-button class="btn__reset" :disabled="disabledReset" @click="handleReset">
        Reset
      </base-button>
      <base-button class="btn__save" :disabled="disabledSave" @click="confirmSave">
        Save
      </base-button>
    </div>
  </div>
  <Teleport to="body">
    <base-modal ref="delModal" @confirm="handleDelete" :message="notiMsg" />
    <base-modal ref="saveModal" @confirm="handleSave" :message="notiMsg" />
    <base-modal ref="notiModal" :message="notiMsg" />
  </Teleport>
</template>
<script>
import _ from "lodash";
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      detailData: {},
      notiMsg: "",
    };
  },
  computed: {
    ...mapState(["userDetail", "deleted", "saved"]),
    disabledSave() {
      return !_.isEmpty(this.userDetail)
        ? _.isEqual(this.detailData, this.userDetail)
        : false;
    },
    disabledReset() {
      return _.isEmpty(this.detailData);
    },
    disabledDel() {
      return _.isEmpty(this.userDetail);
    },
    scrollConfig() {
      const tableBody = this.$refs.tableBody;

      return {
        scrollHeight: tableBody.scrollHeight, // Tổng chiều cao nội dung cuộn
        clientHeight: tableBody.clientHeight, // Chiều cao hiển thị của vùng cuộn
        scrollbarHeight: tableBody.offsetHeight - 20, // Chiều cao của rãnh scrollbar (scrollbar div)
      };
    },
    gridColumnsValue() {
      const colsWidth = this.headers.map((header) => header.width || "auto");
      return colsWidth.join(" ");
    },
  },
  watch: {
    userDetail(newVal) {
      this.detailData = { ...newVal };
    },
    deleted({ status }) {
      if (status) {
        this.notify("Deleted successfully!");
        this.resetDeleted();
      }
      this.resetUserDetail();
    },
    saved({ status }) {
      if (status) {
        this.notify("Saved successfully!");
        this.resetSaved();
        this.resetUserDetail();
      }
    },
  },
  methods: {
    ...mapActions([
      "setUserDetail",
      "resetUserDetail",
      "setDeleted",
      "resetDeleted",
      "setSaved",
      "resetSaved",
    ]),
    confirmDelete() {
      this.openDeleteModal("Would you delete?");
    },
    confirmSave() {
      this.openSaveModal("Would you save?");
    },
    handleDelete() {
      this.setDeleted({
        userId: this.userDetail.userId,
      });
    },
    handleSave() {
      this.setSaved({
        user: this.detailData,
      });
      this.resetUserDetail();
    },
    handleReset() {
      this.detailData = {};
      this.resetUserDetail();
    },
    openDeleteModal(msg) {
      this.notiMsg = msg;
      this.$refs.delModal.open();
    },
    openSaveModal(msg) {
      this.notiMsg = msg;
      this.$refs.saveModal.open();
    },
    notify(msg) {
      this.notiMsg = msg;
      this.$refs.notiModal.open();
    },
  },
};
</script>
<style lang="scss" scoped>
$color_1: #fff;
$color_2: black;
$background-color_1: #0057fe;

.detail {
  position: relative;
  background: transparent;

  & .detail__title {
    padding: 6px;
    margin: 0;
    background: transparent;
    color: #fff;
    border-bottom: 4px solid;
  }

  & .form {
    display: grid;
    grid-template-columns: 33.333% 33.333% 33.333%;
    padding: 4px;
    margin-top: 4px;

    & .grid__box {
      display: grid;
      grid-column: span 1;
      padding: 6px;

      &.double {
        grid-column: span 2;
      }

      &.triple {
        grid-column: span 3;
      }

      & .form__input {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: auto;
        color: #fff;

        & .detail__input {
          outline: none;
          padding: 12px;
          background: transparent;
          border: 2px solid #e9e9e9;
          color: inherit;
          font-size: .8rem;

          &:focus {
            background: #5b7ca5a6;
          }

          &:-webkit-autofill,
          &:-webkit-autofill:focus {
            transition: background-color 0s 600000s, color 0s 600000s !important;
          }
        }
      }
    }
  }

  & .form__btns {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 12px 6px 0 6px;
    gap: 12px;

    & :deep(.btn) {
      border: 2px solid;
      border-radius: 0;
      background: #799cd5;
      color: #fff;

      &:disabled {
        background: #0055f94d;
        color: #e9e9e9a6;
        cursor: unset;
      }
    }
  }
}
</style>
