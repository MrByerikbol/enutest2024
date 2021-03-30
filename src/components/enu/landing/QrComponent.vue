<template>
  <div class="column" style="padding: 10px">
    <qrcode-vue :value="value" :size="300" render-as="svg" level="H"></qrcode-vue>
  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
export default {
  props: ['value'],
  components:{
    QrcodeVue,
  },
}
</script>