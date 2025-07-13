<template>
  <div ref="container" class="container">
    <hajime-list />
    <hajime-detail />
  </div>
</template>
<script>
import HajimeList from "./components/HajimeList.vue";
import HajimeDetail from "./components/HajimeDetail.vue";
import bgImage from "@images/bg_001.jpg";

export default {
  components: { HajimeList, HajimeDetail },
  mounted() {
    this.setBackground(bgImage);
  },
  methods: {
    setBackground(src) {
      const body = document.querySelector("body");
      body.style.background = `url(${src}) 50% 50% no-repeat`;
      body.style.backgroundSize = "cover";
    },
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
    width: 790px;
    background: rgb(53 51 64 / 48%);
    border-radius: 6px;
    padding: 20px;
    margin: 10px auto;
    gap: 12px;
  }
}
</style>
