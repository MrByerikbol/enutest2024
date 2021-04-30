<template>
  <div class="column" style="float:left;margin-right:5px; margin-bottom:5px;">
    <qrcode-vue :value="value" :size="psize" render-as="svg" level="H"></qrcode-vue>
  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
export default {
  props: ['value','psize'],
  components:{
    QrcodeVue,
  },
}
</script>