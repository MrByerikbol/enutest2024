<template>
    <b-row>
      <b-col lg="8">
        <b-row>
          <h4>
            <span class="bd-content-title">{{userPosition=='GLUER'  ? 'Наагчын наасан ажил' : 'Зүсэгчийн зүссэн ажил'}}</span>
          </h4>
        </b-row>

        <b-row>
          <b-col lg="12" class="mb-3">
            <select @change="setPosition" v-model="userId">
              <option value="0">--сонго--</option>
              <option v-for="(dUser,index) in dUsers" :value="dUser.userId" :key="index">
                {{dUser.firstName}} - {{dUser.phoneNumber}} - {{dUser.position=='GLUER' ? 'Наагч' : 'Зүсэгч'}}
              </option>
            </select> 
          </b-col>
          <b-col lg="5" >
            <datepicker format="yyyy-MM-dd" 
                :clear-button="true" @cleared="clearDate" v-model="cBeginDate"
                placeholder="Басталу уақыты"></datepicker>
          </b-col>
          <b-col lg="5" >
            <datepicker format="yyyy-MM-dd" 
                :clear-button="true" @cleared="cEndDate=''" v-model="cEndDate"
                placeholder="Бiту уақыты"></datepicker>
          </b-col>
          <b-col lg="2" >
            <b-button v-if="cBeginDate!='' && cEndDate!='' && userId>0" size="sm" @click="doFilter">Шүүх</b-button>
          </b-col>
          <b-col lg="12">
            <SlicerCalculation 
              v-if="userPosition=='SLICER'"
              :userId="userId" 
              :beginDate="beginDate" 
              :endDate="endDate"
              :filter="''" />

            <GluerCalculation v-if="userPosition=='GLUER'"
              :userId="userId" 
              :beginDate="beginDate" 
              :endDate="endDate"
              :filter="''" />

            <GluerKusokCalculation 
                  v-if="userPosition=='GLUER' && mainSalaryRendered"
                  :userId="userId" 
                  :beginDate="beginDate" 
                  :endDate="endDate"/>
          </b-col>
        </b-row>
      </b-col>


      <b-col lg="4" >
        <b-row>
          <h4>
            <span class="bd-content-title">
              {{userPosition=='GLUER' ? 'Наагчын ' + `цалингийн задаргаа` : 'Зүсэгчийн ' + `цалингийн задаргаа`}}
            </span>
          </h4>
        </b-row>
        <b-row>
          <SalaryForm v-if="userPosition=='SLICER'"
            :clistSalarySum="listSalarySum" 
            :cworkSalarySum="workSalarySum"
            :slicerSalary="slicerSalary"
            :beginDate="beginDate"
            :endDate="endDate"
            :userId="userId"
          />

          <GluerSalaryForm v-if="userPosition=='GLUER'"
            :cgluerSalarySum="gluerSalarySum" 
            :cgluerKusokSalarySum="gluerKusokSalarySum"
            :gluerSalary="gluerSalary"
            :gluerKusokSalary="gluerKusokSalary"
            :beginDate="beginDate"
            :endDate="endDate"
            :userId="userId"
          />
        </b-row>
      </b-col>
    </b-row>
</template>

<script>
import axios from 'axios';
import {apiDomain,getHeader} from "../config/config";
import Datepicker from 'vuejs-datepicker';
import SlicerCalculation from './SlicerCalculation';
import GluerCalculation from './GluerCalculation';
import GluerKusokCalculation from './GluerKusokCalculation';
import SalaryForm from './SalaryForm';
import GluerSalaryForm from './GluerSalaryForm';
import {EventBus} from '@/EventBus.js';

const moment = require('moment')
require('moment/locale/es')
export default {

  name: 'Calculation',
  components:{
    Datepicker,
    SlicerCalculation,
    GluerCalculation,
    SalaryForm,
    GluerSalaryForm,
    GluerKusokCalculation
  },
  data(){
    return {
      mainSalaryRendered:false,
      cBeginDate:"",
      cEndDate:"",

      beginDate :"",
      endDate : "",
      userId:0,
      dUsers:[],
      userPosition:"",
      
      slicerSalary : [],
      listSalarySum:0,
      workSalarySum:0,

      gluerSalary:[],
      gluerKusokSalary:[],
      gluerSalarySum:0,
      gluerKusokSalarySum:0
      
    }
  },
 
  methods:{
    setPosition(){
      let selectedUser = this.dUsers.filter(u=>Number(u.userId)==Number(this.userId));
      this.userPosition=selectedUser.length==1 
        ? selectedUser[0].position 
        : "";
      //alert("this may super "+this.userPosition);
    },
    
    calculateSlicerSalary(){
     
      this.listSalarySum=
        this.slicerSalary
        .filter(l=>Number(l.salaryType)==0)
        .reduce((listSalarySum,list)=>listSalarySum+Number(list.salary),0);

      this.workSalarySum=
        this.slicerSalary
        .filter(l=>Number(l.salaryType)==1)
        .reduce((listSalarySum,list)=>listSalarySum+Number(list.salary),0);

        //alert(JSON.stringify(this.slicerSalary));
    },
    calculateGluerSalary(){
      this.gluerSalarySum=
        this.gluerSalary
        .reduce((gluerSalarySum,list)=>gluerSalarySum+Number(list.salary),0);
    },
    calculateKusokGluerSalary(){
      this.gluerKusokSalarySum=
        this.gluerKusokSalary
        .reduce((gluerSalarySum,list)=>gluerSalarySum+Number(list.salary),0);
    },
    doFilter(){
      this.beginDate=moment(this.cBeginDate).format('YYYY-MM-DD');
      this.endDate=moment(this.cEndDate).format('YYYY-MM-DD');

      if(Number(this.userId)>0 &
         this.beginDate!="" && this.endDate!=""){
           this.setPosition();

           EventBus.$emit('slicerTableRefresher');
           EventBus.$emit('gluerTableRefresher');
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
  },
  mounted(){
    let c = this;
    EventBus.$on("listSalaryInformation", (data)=>{
      c.slicerSalary = data;
      c.calculateSlicerSalary();
    });
    EventBus.$on("gluerSalaryInformation", (data)=>{
      c.gluerSalary = data;
      c.calculateGluerSalary();
    });
    
    EventBus.$on("gluerKusokSalaryInformation", (data)=>{
      c.gluerKusokSalary = data;
      c.calculateKusokGluerSalary();
    });
    //kusok naaltiin tootsoog hiih gj neeree mailj bna da
    EventBus.$on("mainSalaryRendered", ()=>{
      c.mainSalaryRendered=true;
    });
  },
}
</script>