<template>
    <b-row>
      <b-col lg="8">
        <b-row>
          <h3>
            <span class="bd-content-title">Тооцооны модул</span>
          </h3>
        </b-row>

        <b-row>
          <b-col lg="12" class="mb-3">
            <select v-model="userId">
              <option value="0">--сонго--</option>

              <option v-for="(dUser,index) in dUsers" :value="dUser.userId" :key="index">
                {{dUser.firstName}} - {{dUser.phoneNumber}} - {{dUser.position=='GLUER' ? 'Наагч' : 'Зүсэгч'}}
              </option>
            </select> 
          </b-col>
          <b-col lg="5" >
            <datepicker format="yyyy-MM-dd" 
                :clear-button="true" @cleared="clearDate" v-model="cBeginDate"
                placeholder="Эхлэх огноо"></datepicker>
          </b-col>
          <b-col lg="5" >
            <datepicker format="yyyy-MM-dd" 
                :clear-button="true" @cleared="cEndDate=''" v-model="cEndDate"
                placeholder="Дуусах огноо"></datepicker>
          </b-col>
          <b-col lg="2" >
            <b-button v-if="cBeginDate!='' && cEndDate!='' && userId>0" size="sm" @click="doFilter">Шүүх</b-button>
          </b-col>
          <b-col lg="12">
            <SlicerCalculation v-if="isSlicer"
              :userId="userId" 
              :beginDate="beginDate" 
              :endDate="endDate"
           

              :filter="''" />

              <b-button class="mt-4" @click="getSlicerSalary" block variant="outline-success" >Цалин бодох</b-button>
          </b-col>
        </b-row>
      </b-col>


      <b-col lg="4" >
        tootsoo hiij hadaglah heseg   
      </b-col>
    </b-row>
</template>

<script>
import axios from 'axios';
import {apiDomain,getHeader} from "../config/config";
import Datepicker from 'vuejs-datepicker';
import SlicerCalculation from './SlicerCalculation';
import {EventBus} from '@/EventBus.js';

const moment = require('moment')
require('moment/locale/es')
export default {

  name: 'Calculation',
  components:{
    Datepicker,
    SlicerCalculation
  },
  data(){
    return {
      cBeginDate:"",
      cEndDate:"",

      beginDate :"",
      endDate : "",
      userId:0,
      dUsers:[],
      isSlicer:false
    
    }
    
  },
  methods:{
    getSlicerSalary(){
      
      let f =EventBus.$emit('getSlicerSalary');
      //let calculatedSalary = this.bus.$emit('getSlicerSalary');
      
    },
    doFilter(){
      this.beginDate=moment(this.cBeginDate).format('YYYY-MM-DD');
      this.endDate=moment(this.cEndDate).format('YYYY-MM-DD');

      if(Number(this.userId)>0 &
         this.beginDate!="" && this.endDate!=""){
           this.isSlicer=true;
           EventBus.$emit('slicerTableRefresher');
         }
    },
    getDusers(){
      axios.post(apiDomain+'/admin/calculation/getusers',{},{headers:getHeader()})
      .then((response) => {
          this.dUsers=response.data;
        }).catch(error => {
          alert(error.message);
          this.dUsers=[];
        })  
    },
    clearDate(){
      this.cBeginDate="";
      this.cEndDate="";
    }
  },
  created(){
    this.getDusers();
  }
}
</script>