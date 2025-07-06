<template>
  <div class="container">
    <!-- <div class="table">
      <div class="table__header" :style="`display: grid; grid-template-columns: ${gridColumnsValue};`">
        <div v-for="(header, index) in headers" :key="index" class="column">
          <div :class="`cell ${index < headers.length - 1 ? 'idx' : ''}`" @click="handleSort(index)">
            {{ header.text }}

            <span class="sort">
              <img v-if="header.sort" :src="getSortIcon(header.sort)" alt="sort">
            </span>
          </div>
        </div>
      </div>
      <div ref="tableBody" class="table__body"
        :style="`display: grid; grid-template-columns: ${gridColumnsValue}; grid-column: 1 / 6;`"
        @scroll="handleScroll">
        <div v-for="(header, index) in headers" :key="index" class="column">
          <div v-for="(item, index) in items" :key="index" :class="`cell ${selectedIndex === index ? 'selected' : ''}`"
            @click="handleSelect(index)">
            {{ item[header.value] }}
          </div>
        </div>
      </div>
      <div v-if="!isLesserData" class="scrollbar">
        <div class="thumb" :style="{ height: thumbHeight + 'px', top: thumbTop + 'px' }" @mousedown="startDrag"></div>
      </div>
    </div> -->
    <hajime-table />
    <!-- <div class="detail">
      <h3 class="detail__title">Detail</h3>
      <div class="form">
        <div class="form__input">
          <label for="userName">User Name</label>
          <input v-model="detailData.userName" class="detail__input" type="text" id="userName">
        </div>
        <div class="form__input">
          <label for="age">Age</label>
          <input v-model="detailData.age" class="detail__input" type="text" id="age">
        </div>
        <div class="form__input">
          <label for="gender">Gender</label>
          <input v-model="detailData.gender" class="detail__input" type="text" id="gender">
        </div>
        <div class="form__input">
          <label for="dateOfBirth">Date Of Birth</label>
          <input v-model="detailData.dateOfBirth" class="detail__input" type="text" id="dateOfBirth">
        </div>
      </div>
      <button class="btn btn__del" @click="handleDelete">Delete</button>
      <button class="btn btn__reset" @click="handleReset">Reset</button>
      <button class="btn btn__save" :disabled="disabledSave" @click="handleSave">Save</button>
    </div> -->
    <hajime-detail :selected-item="{}" />
  </div>
</template>
<script>
import HajimeTable from './components/HajimeTable.vue';
import HajimeDetail from './components/HajimeDetail.vue';

export default {
  components: { HajimeTable, HajimeDetail },
  data() {
    return {
    };
  },
  computed: {
  },
  watch: {
  },
  methods: {
  },
};
</script>
<style lang="scss">
@import "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap";

$color_1: #fff;
$color_2: black;
$font-family_1: "Open Sans", sans-serif;
$background-color_1: #a1a1af;

body {
  font-family: $font-family_1;
  background: #000;
  color: $color_2;

  & .container {
    display: flex;
    flex-direction: column;
    width: 750px;
    background: #fff;
    padding: 10px;
    margin: 10px auto;
    gap: 12px;
  }
}
</style>