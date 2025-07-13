<template>
  <div class="table">
    <div
      class="table__header"
      :style="`display: grid; grid-template-columns: ${gridColumnsValue};`"
    >
      <div v-for="(header, index) in headers" :key="index" class="column">
        <div class="cell" @click="handleSort(index)">
          {{ header.text }}

          <span class="sort">
            <img v-if="header.sort" :src="getSortIcon(header.sort)" alt="sort" />
          </span>
        </div>
      </div>
    </div>
    <div
      ref="tableBody"
      class="table__body"
      :style="`display: grid; grid-template-columns: ${gridColumnsValue}; grid-column: 1 / 6;`"
      @scroll="handleScroll"
    >
      <div v-for="(header, index) in headers" :key="index" class="column">
        <div
          v-for="(item, index) in items"
          :key="index"
          :class="`cell ${getCellClass(item, index)}`"
          @mouseover="handleMouseOver(index)"
          @mouseleave="handleMouseLeave"
          @click="handleSelect(item.userId)"
        >
          {{ item[header.value] }}
        </div>
      </div>
    </div>
    <div v-if="!isLesserData" class="scrollbar">
      <div
        class="thumb"
        :style="{ height: thumbHeight + 'px', top: thumbTop + 'px' }"
        @mousedown="startDrag"
      ></div>
    </div>
  </div>
</template>
<script>
import _ from "lodash";
import { mapState } from "vuex";
import sortAsc from "@images/ic_asc_sort.svg";
import sortDesc from "@images/ic_desc_sort.svg";

export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    headers: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["sort", "select"],
  data() {
    return {
      selectedIndex: -1,
      hoverIndex: -1,
      isLesserData: false,
      thumbHeight: 0,
      thumbTop: 0,
      isDragging: false,
      startY: 0,
      startThumbTop: 0,
    };
  },
  beforeUnmounted() {
    window.removeEventListener("mousemove", this.drag);
    window.removeEventListener("mouseup", this.stopDrag);
  },
  mounted() {
    this.handleCheckDataLesser();
    this.$nextTick(() => {
      this.updateThumb();

      window.addEventListener("mousemove", this.drag);
      window.addEventListener("mouseup", this.stopDrag);
    });
  },
  computed: {
    ...mapState(["userDetail"]),
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
      if (_.isEmpty(newVal)) this.handleResetSelect();
    },
  },
  methods: {
    handleSort(sortColIndex) {
      this.$emit("sort", sortColIndex);
    },
    getSortIcon(isAsc) {
      return isAsc === "asc" ? sortAsc : sortDesc;
    },
    handleResetSelect() {
      this.selectedIndex = -1;
    },
    handleSelect(userId) {
      if (this.selectedIndex === userId) {
        this.handleResetSelect();
        this.$emit("select", {});
      } else {
        this.selectedIndex = userId;
        const result = this.items.find((item) => item.userId === userId) || {};
        this.$emit("select", result);
      }
    },
    handleMouseOver(index) {
      this.hoverIndex = index;
    },
    handleMouseLeave() {
      this.hoverIndex = -1;
    },
    getCellClass(item, index) {
      let rltClass = "";
      if (index % 2 === 0) rltClass += " even";
      else rltClass += " odd";

      if (this.hoverIndex === index) rltClass += " hovered";
      if (this.selectedIndex === item.userId) rltClass += " selected";

      return rltClass;
    },
    handleCheckDataLesser() {
      const tableBody = this.$refs.tableBody;
      if (tableBody.offsetHeight === tableBody.scrollHeight) {
        this.isLesserData = true;
      } else {
        this.isLesserData = false;
      }
    },
    updateThumb() {
      const tableBody = this.$refs.tableBody;
      if (!tableBody) return;

      // Tính chiều cao của thumb
      this.thumbHeight = this.computeThumbHeight(this.scrollConfig);

      // Cập nhật vị trí của thumb dựa trên scrollbar
      this.handleScroll();
    },
    handleScroll() {
      const tableBody = this.$refs.tableBody;
      if (!tableBody) return;

      const scrollTop = tableBody.scrollTop;

      // Tính toán vị trí của thumb
      // thumbTop = (scrollTop / (scrollHeight - clientHeight)) * (scrollbarHeight - this.thumbHeight);
      // Đảm bảo thumbTop không vượt quá rãnh
      this.thumbTop = this.computeScrollThumbTop(
        scrollTop,
        this.thumbHeight,
        this.scrollConfig
      );
    },
    startDrag(e) {
      this.isDragging = true;
      this.startY = e.clientY;
      this.startThumbTop = this.thumbTop;
      e.preventDefault(); // Ngăn chặn hành vi mặc định của trình duyệt
    },
    drag(e) {
      if (!this.isDragging) return;

      const tableBody = this.$refs.tableBody;
      if (!tableBody) return;

      const deltaY = e.clientY - this.startY;
      const scrollbarHeight = tableBody.offsetHeight - 20; // Chiều cao của rãnh scrollbar (scrollbar div)
      const scrollRange = scrollbarHeight - this.thumbHeight; // Phạm vi di chuyển của thumb

      // Tính toán vị trí mới của thumb
      this.thumbTop = this.computeDragThumbTop(scrollRange, this.startThumbTop, deltaY);

      // Đồng bộ hóa vị trí cuộn của tableBody với vị trí của thumb
      tableBody.scrollTop = this.computeDragScrollTop(
        scrollRange,
        this.thumbTop,
        this.scrollConfig
      );
    },
    stopDrag() {
      this.isDragging = false;
    },
    computeDragScrollTop(scrollRange, thumbTop, scrollConfig) {
      const { scrollHeight, clientHeight } = scrollConfig;
      return (thumbTop / scrollRange) * (scrollHeight - clientHeight);
    },
    computeScrollThumbTop(scrollTop, thumbHeight, scrollConfig) {
      const { scrollHeight, clientHeight, scrollbarHeight } = scrollConfig;

      let newThumbTop =
        (scrollTop / (scrollHeight - clientHeight)) * (scrollbarHeight - thumbHeight);
      newThumbTop = Math.max(0, Math.min(newThumbTop, scrollbarHeight - thumbHeight));

      return newThumbTop;
    },
    computeDragThumbTop(scrollRange, startThumbTop, deltaY) {
      let newThumbTop = startThumbTop + deltaY;
      newThumbTop = Math.min(Math.max(0, newThumbTop), scrollRange); // Giới hạn trong phạm vi

      return newThumbTop;
    },
    computeThumbHeight({ clientHeight, scrollHeight, scrollbarHeight }) {
      let thumbHeight = (clientHeight / scrollHeight) * scrollbarHeight;
      thumbHeight = Math.max(thumbHeight, 20); // Đảm bảo thumb không quá nhỏ

      return thumbHeight;
    },
  },
};
</script>
<style lang="scss" scoped>
$background-color_1: #0057fe;

.table {
  position: relative;
  overflow: hidden;
  background: transparent;
  border-bottom: 4px solid #7d8aad;

  & .table__header {
    background-color: #93b3f4a6;
    font-weight: bolder;
    color: #fff;

    & .cell {
      cursor: pointer;
    }
  }

  & .table__body {
    height: 335px;
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }

    & .column {
      .cell {
        color: #fff;

        &.odd {
          background-color: #657fa9a6;
        }

        &.even {
          background-color: transparent;
        }

        &.selected {
          background: #5bc1ecba !important;
        }

        &.hovered {
          background: #85cbe9a6;
        }
      }
    }
  }

  & .scrollbar {
    position: absolute;
    top: 55px;
    bottom: 10px;
    right: 8px;
    width: 10px;
    background-color: transparent;
    border-radius: 5px;
    z-index: 2;

    & .thumb {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 68px;
      background-color: #a1a1af;
      border: 2px solid #f0f0f0;
      box-sizing: border-box;
      border-radius: 5px;
      cursor: grab;
    }
  }

  & .column {
    width: 100%;

    .cell {
      position: relative;
      display: flex;
      padding: 12px;
      margin: auto;
      user-select: none;
      justify-content: space-between;
      align-items: center;

      .sort {
        display: flex;
        align-items: center;

        & img {
          width: 20px;
          height: 20px;
        }
      }
    }
  }

  &.lesser {
    .table__header {
      &::-webkit-scrollbar {
        display: none;
      }
    }

    .table__body {
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
}
</style>
