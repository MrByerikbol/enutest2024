<template>
  <div>
  <b-navbar toggleable="lg" type="dark" variant="info" class="fixed-top">
    <b-navbar-brand href="#">{{$t('logoName')}}</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>  
        <b-nav-item v-if="hasRole('ADMIN') " href="/#/users">{{$t('mainMenu.users')}}</b-nav-item>
        <b-nav-item v-if="hasRole('ADMIN') " href="/#/documentcategorylist">{{$t('mainMenu.documentCategoryList')}}</b-nav-item>
        <!-- <b-nav-item v-if="hasRole('ADMIN')" href="/#/deliveryreport">Ачот</b-nav-item> -->

      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right :text="$t('mainMenu.currentLang')">
          <b-dropdown-item href="javascript:void(0)"  v-for="locale in $i18n.locales()" :key="'i81n-' + locale"
			      @click="$i18n.set(locale)" v-if="$i18n.locale() !== locale">{{locale}}</b-dropdown-item>
          <!-- <b-dropdown-item href="javascript:void(0)" >RU</b-dropdown-item> -->
          </b-nav-item-dropdown>
        
         
        <b-nav-item-dropdown right>
          <!-- <b-dropdown-item href="javascript:void(0)">Құпия сөз</b-dropdown-item> -->
          <b-dropdown-item href="javascript:void(0)" @click="logOut">{{$t('logOut')}}</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
  <OrderLoan v-if="showOrderLoanModal"></OrderLoan>
</div>  
</template>

<script>
import {mapActions,mapState} from 'vuex';
import axios from 'axios';
import {apiDomain,getHeader} from "../config/config";
import OrderLoan from "./OrderLoan.vue";
export default {
  name: 'AppHeader',
  data(){
    return {
      statisticData:null,
      showOrderLoanModal : false
    }
  },
  components:{
    OrderLoan
  },
  methods:{
    showLoanModal(){
      this.showOrderLoanModal=true;
      this.$bvModal.show("orderLoanModal");
    },
    getStatistic(){
      this.statisticData=null;
       axios.get(apiDomain+'/admin/getstatistic',{headers:getHeader()})
      .then(response=>{
          this.statisticData=response.data;

      })
      .catch(error => {
          alert(error.message)    
      })
    },
    logOut : function(){
      //alert("Server taliin token arilgahaa martavaa Bek chuhal shvv!!! ");
     
      axios.get(apiDomain+'/admin/logout',{headers:getHeader()})
      .then(()=>{
          window.localStorage.removeItem("authUser");
          window.localStorage.clear();
          this.$router.push({name:'Login'});
      })
      .catch(error => {
          alert(error.message);    
      })
       
    },
    ...mapActions([
        'setDeliveryRefs',
        'setDeliveryFormObject'
    ]),
    newDelivery(){
      //alert("hey");
      let reqData = {deliveryId:0};
      this.setDeliveryFormObject(reqData);
      this.setDeliveryRefs(2);
      this.setDeliveryRefs(9);
      this.setDeliveryRefs(10);
      this.setDeliveryRefs(7);
      this.setDeliveryRefs(11);
      this.setDeliveryRefs(12);
      this.setDeliveryRefs(13);
      this.setDeliveryRefs(14);
      if(this.$route.name.trim()!='NewDelivery'){
        this.$router.push({name:'NewDelivery'});
      }
        
    },
   
    doCalculation1(){
      //alert("yes");
      let roleName1='ADMIN';
      let roleName2="MANAGER";
      if(this.hasRole(roleName1) || this.hasRole(roleName2)){
        this.$router.push({name:'Calculation'});
      }
      else{
        this.$bvToast.toast("Зөвхөн админ болон менежжер энэ үйлдэлийг хийх боломжтой", {
            title: 'Қате туралы ақпарат',
            autoHideDelay: 5000
        })  
      }
    },
    hasRole(roleName){
      let roleNames = this.loginedUser.roles;
     
      if(roleNames.length>0){
        //alert(JSON.stringify(roleNames));
        for(let r=0;r<roleNames.length;r++){
          
          if(roleNames[r].roleName===roleName){
            
            return true;
            
          }
        }
      }
      else{
        return false;
      }
      
    }
    
  },
  created(){
    this.setDeliveryRefs(1);
    this.setDeliveryRefs(2);
    this.setDeliveryRefs(9);
    this.setDeliveryRefs(10);
  },
  computed:{
    ...mapState([
        'loginedUser'
    ]),
  }
}
</script>
<style scoped>
  .pulse {
  
  display: inline-block;
  margin-top: 5px;

  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #007bff;
  cursor: pointer;
  box-shadow: 0 0 0 rgba(204,169,44, 0.4);
  animation: pulse 1s infinite;
}
.pulse:hover {
  animation: none;
}

@-webkit-keyframes pulse {
  0% {
    -webkit-box-shadow: 0 0 0 0 rgba(204,169,44, 0.4);
  }
  70% {
      -webkit-box-shadow: 0 0 0 10px rgba(204,169,44, 0);
  }
  100% {
      -webkit-box-shadow: 0 0 0 0 rgba(204,169,44, 0);
  }
}
@keyframes pulse {
  0% {
    -moz-box-shadow: 0 0 0 0 rgba(204,169,44, 0.4);
    box-shadow: 0 0 0 0 rgba(204,169,44, 0.4);
  }
  70% {
      -moz-box-shadow: 0 0 0 10px rgba(204,169,44, 0);
      box-shadow: 0 0 0 10px rgba(204,169,44, 0);
  }
  100% {
      -moz-box-shadow: 0 0 0 0 rgba(204,169,44, 0);
      box-shadow: 0 0 0 0 rgba(204,169,44, 0);
  }
}
</style>
