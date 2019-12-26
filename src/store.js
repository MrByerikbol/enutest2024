import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
Vue.use(Vuex);
import {apiDomain,getHeader} from "./config/config";
import { state } from 'fs';
export default new Vuex.Store({
  state: {
    shops:[],
    users:[],
    products:[],
    detailProducts:[],
    deliveryFormObject:{},
    loginedUser:{},
    wareHouses:[],
    wareHouseProducts:[]
  },
  getters: {
    
    getDeliveryFormObject(state){
      return state.deliveryObject;
    },
    getWareHouseProductBalance(state){
      // alert(wareHouseId + " " +productId);
      return (wareHouseId,productId)=>{
        //alert(wareHouseId + " " +productId);
        for (let i = 0;i<state.wareHouseProducts.length;i++){
          let obj = state.wareHouseProducts[i];
          if(obj.wareHouseId===wareHouseId && obj.productId===productId){
            //alert(JSON.stringify(obj));
            return obj.productCount;
          }
        }
        return 0;
      }
    }
  
  },
  mutations: {
    SET_DELIVERY_FORM_OBJECT(state,reqData){
      axios.post(apiDomain+'/admin/order/neworder',reqData,{headers:getHeader()})
      .then(response => {
        //alert(JSON.stringify(response.data));

        state.deliveryFormObject=response.data;
      }).catch(error=>{
          //console.log(error);
      }) 
    },
    SET_DELIVERY_REFS(state,refType){
      axios.get(apiDomain+'/admin/delivery/refs/'+refType,{headers:getHeader()})
          .then(response=>{
              if(refType==1){
                  state.shops=response.data;
              }
              if(refType==2){
                  state.users=response.data;
              }
              if(refType==4){
                state.products=response.data;
              }
              if(refType==8){
                state.detailProducts=response.data;
              }
              if(refType==9){
                //alert(JSON.stringify(response.data));
                state.wareHouses=response.data;
              }
              if(refType==10){
                //alert(JSON.stringify(response.data));
                state.wareHouseProducts=response.data;
              }
          })
          .catch(error => {
              //console.log(error.message)
              //alert("server dr aldaa uuslee");
          }
      ) 
    },
    SET_LOGINED_USER(state){
      //alert("came");
      axios.post(apiDomain+'/admin/delivery/getlogineduser',{},{headers:getHeader()})
      .then(response=>{
        //alert("yeees");
        state.loginedUser=response.data;
      })
      .catch(error => {
          //console.log(error.message)
          this.$bvToast.toast(error.message, {
              title: 'алдаа',
              autoHideDelay: 5000
          })
      }) 
    }
   
  },
  actions: {
    setDeliveryRefs:(context,refType)=>{
      //alert("ref type "+refType);
      context.commit("SET_DELIVERY_REFS",refType);
    },
    setDeliveryFormObject:(context,reqData)=>{
      context.commit("SET_DELIVERY_FORM_OBJECT",reqData);
    },
    setLoginedUser(context){
      //alert("it shoild be call the state");
      context.commit("SET_LOGINED_USER");  
    }
  }
});