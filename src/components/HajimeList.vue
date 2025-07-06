<template>
  <base-table
    ref="table"
    :items="items"
    :headers="headers"
    @sort="handleSort"
    @select="handleSelect"
  />
</template>
<script>
import { mapActions, mapState } from "vuex";
import { getListItems, headers } from "../data.js";
import _ from "lodash";

export default {
  data() {
    return {
      items: [],
      originItems: [],
      headers: [],
    };
  },
  created() {
    const initItems = [...getListItems(30)];
    this.setLastId(30);
    this.items = [...initItems];
    this.originItems = [...initItems];
    this.headers = [...headers];
  },
  computed: {
    ...mapState(["userDetail", "deleted", "saved", "lastId"]),
  },
  watch: {
    userDetail(newVal) {
      if (_.isEmpty(newVal)) {
        this.$refs.table.handleResetSelect();
      }
    },
    deleted({ userId }) {
      if (userId) {
        this.handleDelete(userId);
        this.setDeleted({ status: true });
      }
    },
    saved: {
      deep: true,
      handler({ user }) {
        if (user && !_.isEmpty(user)) {
          if (user.userId) {
            this.handleUpdate(user);
          } else {
            this.handleSaveNew(user);
          }
          this.setSaved({ status: true });
        }
      },
    },
  },
  methods: {
    ...mapActions([
      "setUserDetail",
      "setDeleted",
      "setSaved",
      "setLastId",
      "increaseLastId",
    ]),
    handleSort(clickedIndex) {
      this.headers = this.headers.map((header, index) => {
        if (clickedIndex === index) {
          if (header.sort === "asc") {
            return { ...header, sort: "desc" };
          } else if (header.sort === "desc") {
            return { ...header, sort: "" };
          } else {
            return { ...header, sort: "asc" };
          }
        } else {
          return { ...header, sort: "" };
        }
      });

      const colName = this.headers[clickedIndex].value;
      const sortDirection = this.headers[clickedIndex].sort;
      if (sortDirection) {
        this.sortColumn(colName, sortDirection);
      } else {
        this.items = [...this.originItems];
      }
    },
    handleSelect(selectedItem) {
      this.setUserDetail(selectedItem);
    },
    handleSaveNew(user) {
      const userId = this.generateUserId(this.lastId + 1);
      this.items.push({
        ...user,
        userId,
      });
      this.increaseLastId();
    },
    handleUpdate(user) {
      const updatedItems = this.items.map((item) => {
        if (item.userId === user.userId) {
          return { ...item, ...user };
        }

        return item;
      });

      this.items = updatedItems;
    },
    handleDelete(userId) {
      let deleteId = userId;
      let tempItems = [...this.items];
      tempItems = tempItems.filter((item) => item.userId !== deleteId);

      this.items = [...tempItems];
      this.originItems = [...tempItems];
    },
    sortColumn(columnName, sortDirection) {
      const sortFactor = sortDirection === "asc" ? 1 : -1;

      const sortItems = this.items.sort((itemA, itemB) => {
        const valueA = itemA[columnName];
        const valueB = itemB[columnName];

        let comparison = 0;
        if (typeof valueA === "string" && typeof valueB === "string") {
          // Sắp xếp chuỗi không phân biệt chữ hoa/thường, hoặc theo ngôn ngữ cụ thể
          comparison = valueA.localeCompare(valueB, undefined, { sensitivity: "base" });
        } else {
          // Sắp xếp số hoặc các kiểu dữ liệu có thể so sánh trực tiếp
          if (valueA > valueB) {
            comparison = 1;
          } else if (valueA < valueB) {
            comparison = -1;
          }
        }

        // Áp dụng hệ số sắp xếp
        return comparison * sortFactor;
      });

      this.items = [...sortItems];
    },
    generateUserId(num) {
      return `U${_.padStart(String(num), 3, "0")}`;
    },
  },
};
</script>
