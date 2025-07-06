<template>
  <div v-show="show" class="wrapper">
    <div class="modal">
      <div class="header">
        <div class="title">Notification</div>
        <img class="ic__close" :src="icClose" alt="close" @click="close" />
      </div>
      <div class="body">
        {{ message }}
      </div>
      <div class="footer">
        <base-button class="cancel" @click="close">Cancel</base-button>
        <base-button class="ok" @click="confirm">OK</base-button>
      </div>
    </div>
  </div>
</template>
<script>
import icClose from "@images/ic_close.svg";

export default {
  props: {
    message: {
      type: String,
      required: true,
    },
  },
  emits: ["confirm"],
  data() {
    return {
      show: false,
    };
  },
  computed: {
    icClose() {
      return icClose;
    },
  },
  methods: {
    open() {
      this.show = true;
    },
    close() {
      this.show = false;
    },
    confirm() {
      this.$emit("confirm");
      this.close();
    },
  },
};
</script>
<style lang="scss" scoped>
.wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #8080808f;
  z-index: 2;

  & .modal {
    position: absolute;
    top: calc(50% - 150px / 2);
    left: calc(50% - 400px / 2);
    display: flex;
    width: 400px;
    height: 150px;
    padding: 12px;
    flex-direction: column;
    justify-content: space-between;
    background-color: #fff;
    border-radius: 6px;
    z-index: 2;

    & .header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      & .title {
        font-size: 1.25rem;
        font-weight: bolder;
      }

      & .ic__close {
        width: 12px;
        height: 12px;
        padding: 8px;
        background: #0057fe;
        border-radius: 6px;
        cursor: pointer;
      }
    }

    & .footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;

      & .btn {
        min-width: 100px;
        &.ok {
          background: #0057fe;
          color: #fff;
        }
      }
    }
  }
}
</style>
