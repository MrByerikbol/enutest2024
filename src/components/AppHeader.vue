<template>
  <div>
  <b-navbar toggleable="lg" type="dark" variant="info">
    <b-navbar-brand href="#">Распилийн систем</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>

        <b-nav-item v-if="hasRole('ADMIN') || hasRole('OPERATOR') || hasRole('MANAGER') " href="javascript:void(0)" @click="newDelivery">
          Шинэ лист
        </b-nav-item>
        <b-nav-item v-if="hasRole('ADMIN') || hasRole('OPERATOR') || hasRole('MANAGER') || hasRole('DELIVERY')" href="/#/deliveries">Захиалгууд</b-nav-item>

        <b-nav-item v-if="hasRole('ADMIN') 
          || hasRole('MANAGER')" href="javascript:void(0)" @click="doCalculation1">Тооцоо</b-nav-item>
          
        <b-nav-item v-if="hasRole('ADMIN')" href="/#/users">Хэрэглэгчид</b-nav-item>
        <b-nav-item v-if="hasRole('ADMIN')" href="/#/shops">Дэлгүүрүүд</b-nav-item>
        <b-nav-item v-if="hasRole('ADMIN') || hasRole('MANAGER')" href="/#/products">Бараанууд</b-nav-item>
        <b-nav-item v-if="hasRole('ADMIN') || hasRole('MANAGER')" href="/#/warehouse">Агуулах</b-nav-item>
        
        <b-nav-item v-if="hasRole('DELIVERY')" href="/#/deliverywarehouse">Агуулах</b-nav-item>
        <b-nav-item v-if="hasRole('ADMIN')" href="/#/deliveryreport">Тайлан</b-nav-item>

      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-form>
          <b-form-input size="sm" class="mr-sm-2" placeholder="Хайх үгээ оруулна уу"></b-form-input>
          <b-button size="sm" class="my-2 my-sm-0" type="submit">хайх</b-button>
        </b-nav-form>

        <!-- <b-nav-item-dropdown text="Lang" right>
          <b-dropdown-item href="#">EN</b-dropdown-item>
          <b-dropdown-item href="#">ES</b-dropdown-item>
          <b-dropdown-item href="#">RU</b-dropdown-item>
          <b-dropdown-item href="#">FA</b-dropdown-item>
        </b-nav-item-dropdown> -->
        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template slot="button-content">
            <em @click="getStatistic">Статистик</em>
          </template>
          <b-dropdown-item href="javascript:void(0)">
              Нийт : 
              <strong style="float:right;" v-if="statisticData!=null">
                {{statisticData.totalDeliveryCount}}
              </strong>  
              <em v-if="statisticData==null" class="pulse"></em>
          </b-dropdown-item>
          <b-dropdown-item href="javascript:void(0)">
              Цуцалсан : 
              <strong style="float:right;" v-if="statisticData!=null">
                {{statisticData.totalDeclinedCount}}
              </strong>  
              <em v-if="statisticData==null" class="pulse"></em>
          </b-dropdown-item>
          <b-dropdown-item href="javascript:void(0)">
              Хүргэсэн : 
              <strong style="float:right;" v-if="statisticData!=null">
                {{statisticData.totalDoneCount}}
              </strong>  
              <em v-if="statisticData==null" class="pulse"></em>
          </b-dropdown-item>
          <b-dropdown-item href="javascript:void(0)">
              Идэвхитэй : 
              <strong style="float:right;" v-if="statisticData!=null">
                {{statisticData.totalActiveCount}}
              </strong>  
              <em v-if="statisticData==null" class="pulse"></em>
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template slot="button-content"><em>Хэрэглэгч</em></template>
          <b-dropdown-item href="javascript:void(0)">Нууц үг солих</b-dropdown-item>
          <b-dropdown-item href="javascript:void(0)" @click="logOut">Системээс гарах</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</div>  
</template>

<script>
import {mapActions,mapState} from 'vuex';
import axios from 'axios';
import {apiDomain,loginUrl,getHeader} from "../config/config";
export default {
  name: 'AppHeader',
  data(){
    return {
      statisticData:null
    }
  },
  
  methods:{
    getStatistic(){
      this.statisticData=null;
       axios.get(apiDomain+'/admin/getstatistic',{headers:getHeader()})
      .then(response=>{
          this.statisticData=response.data;

      })
      .catch(error => {
          console.log(error.message)    
      })
    },
    logOut : function(){
      //alert("Server taliin token arilgahaa martavaa Bek chuhal shvv!!! ");
     
      axios.get(apiDomain+'/admin/logout',{headers:getHeader()})
      .then(response=>{
          window.localStorage.removeItem("authUser");
          this.$router.push({name:'Login'});
      })
      .catch(error => {
          alert(error.message);    
      })
       
    },
    ...mapActions([
        'setDeliveryRefs',
        'setDeliveryFormObject',
        'setLoginedUser'
    ]),
    newDelivery(){
      //alert("hey");
      let reqData = {deliveryId:0};
      this.setDeliveryFormObject(reqData);
      this.setDeliveryRefs(2);
      this.setDeliveryRefs(4);
      this.setDeliveryRefs(8);
      this.setDeliveryRefs(9);
      this.setDeliveryRefs(10);
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
            title: 'Алдааны мэдээлэл',
            autoHideDelay: 5000
        })  
      }
    },
    getLoginedUser(){
     
      this.setLoginedUser();  
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
    //this.setDeliveryRefs(4);
    //this.setDeliveryRefs(8);
    
    this.getLoginedUser();
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
