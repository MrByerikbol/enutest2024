<template>
  <div>
  <b-navbar toggleable="lg" type="dark" variant="info" class="fixed-top">
    <b-navbar-brand href="#">Кесу Жүйесi</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>

        <b-nav-item v-if="hasRole('ADMIN') || hasRole('OPERATOR') || hasRole('MANAGER') " href="javascript:void(0)" @click="newDelivery">
          Жаңа тапсырыс
        </b-nav-item>
        <b-nav-item v-if="hasRole('ADMIN') || hasRole('OPERATOR') || hasRole('MANAGER') || hasRole('DELIVERY')" href="/#/deliveries">Тапсырыстар</b-nav-item>

        <b-nav-item v-if="hasRole('ADMIN')  
          || hasRole('MANAGER')" href="javascript:void(0)" @click="doCalculation1">Есеп</b-nav-item>
          
        <b-nav-item v-if="hasRole('ADMIN') || hasRole('OPERATOR')" href="/#/users">Тұтнушылар</b-nav-item>
       
        <b-nav-item v-if="hasRole('ADMIN') || hasRole('MANAGER')" href="/#/products">Тауарлар</b-nav-item>
        <b-nav-item v-if="hasRole('ADMIN') || hasRole('MANAGER')" href="/#/warehouse">Қойма</b-nav-item>
        
        <b-nav-item v-if="hasRole('DELIVERY')" href="/#/deliverywarehouse">Қойма</b-nav-item>
        <!-- <b-nav-item v-if="hasRole('ADMIN')" href="/#/deliveryreport">Ачот</b-nav-item> -->

      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item v-if="hasRole('ADMIN') || hasRole('OPERATOR')"
           href="javasript:void(0)" @click="showLoanModal">Несие тiркеу</b-nav-item>

        <!-- <b-nav-item-dropdown text="Lang" right>
          <b-dropdown-item href="#">EN</b-dropdown-item>
          <b-dropdown-item href="#">ES</b-dropdown-item>
          <b-dropdown-item href="#">RU</b-dropdown-item>
          <b-dropdown-item href="#">FA</b-dropdown-item>
        </b-nav-item-dropdown> -->
        
         
        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template slot="button-content"><em>{{loginedUser.firstName}}</em></template>
          <b-dropdown-item v-if="hasRole('SLICER')" href="/#/slicer">Kесу</b-dropdown-item>
          <b-dropdown-item v-if="hasRole('CLIENT')" href="/#/client">Тапсырыстарым</b-dropdown-item>
          <b-dropdown-item v-if="hasRole('GLUER')" href="/#/gluer">Жабсыру</b-dropdown-item>
          <b-dropdown-item v-if="hasRole('GLUER')" href="/#/kusokgluer">Бөлшек Жабсыру</b-dropdown-item>
          
          <b-dropdown-item href="javascript:void(0)">Құпия сөз</b-dropdown-item>
          <b-dropdown-item href="javascript:void(0)" @click="logOut">Жүйеден шығу</b-dropdown-item>
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
