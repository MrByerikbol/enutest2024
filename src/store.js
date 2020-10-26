import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
// load vuex i18n module

Vue.use(Vuex);

import {apiDomain,getHeader} from "./config/config";
import createPersistedState from 'vuex-persistedstate'

const store= new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    shops:[],
    users:[],
    products:[],
    detailProducts:[],
    deliveryFormObject:{},
    kusokFormObject:{},
    loginedUser: JSON.parse(window.localStorage.getItem('loginedUser')),
    wareHouses:[],
    wareHouseProducts:[],

    productCats:[],
    productMeasures:[],
    productColors:[],
    workPricesm:[],
    listWorkPrices:[]
  },
  
  getters: {
    
    getDeliveryFormObject(state){
      return state.deliveryObject;
    },
    getWareHouseProductBalance(state){
      // alert(wareHouseId + " " +productId);
      return (wareHouseId,productId)=>{
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
    
    SET_KUSOK_FORM_OBJECT(state,reqData){
      axios.post(apiDomain+'/admin/order/newpvhkusok',reqData,{headers:getHeader()})
      .then(response => {
        //alert(JSON.stringify(response.data));
        state.kusokFormObject=response.data;  
      }).catch(()=>{
          //console.log(error);
      }) 
    },
    SET_DELIVERY_FORM_OBJECT(state,reqData){
      axios.post(apiDomain+'/admin/order/neworder',reqData,{headers:getHeader()})
      .then(response => {
        //alert(JSON.stringify(response.data));
        state.deliveryFormObject=response.data;
      }).catch(()=>{
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
              if(refType==7){
                state.productCats=response.data;
              }
              if(refType==11){
                  state.productColors=response.data;
              }
              if(refType==12){
                  state.productMeasures=response.data;
              }
              if(refType==13){
                  state.workPrices=response.data;
              }
              if(refType==14){
                  state.listWorkPrices=response.data;
              }
          })
          .catch(() => {
              //console.log(error.message)
              
          }
      ) 
    },
    SET_LOGINED_USER(state){
      //alert("yess");
      state.loginedUser=JSON.parse(window.localStorage.getItem('loginedUser'));
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
    setKusokFormObject:(context,reqData)=>{
      context.commit("SET_KUSOK_FORM_OBJECT",reqData);
    },
    setLoginedUser(context){
      //alert("it shoild be call the state");
      context.commit("SET_LOGINED_USER");  
    }
  }
});


export default store;