<template>
  <router-view></router-view>
</template>
<script>
  export default {
    name: 'app'
  }
</script>
<style>
   @media print {
        @page {
            size: landscape;
        }
    }
    @import './assets/landscape.css';
</style>


