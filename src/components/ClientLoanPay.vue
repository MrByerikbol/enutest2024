<template>
    <b-row>
       
        <b-col lg="12">
            <h5>
                <span class="bd-content-title">Берiлген несиелер</span>
            </h5>
        </b-col>
        <b-col lg="12">
            <hr>    
        </b-col>
        <b-col lg="12">
          <b-row>  
              <b-col lg="4">
                  <datepicker format="yyyy-MM-dd"
                  :clear-button="true" @cleared="beginDateCleaner" v-model="beginDate" placeholder="Басталу уақыты"></datepicker>
              </b-col>
              <b-col lg="4">
                  <datepicker format="yyyy-MM-dd" 
                  :clear-button="true" @cleared="endDate=''" v-model="endDate" placeholder="Бiту уақыты"></datepicker>
              </b-col>
               <b-col lg="2">
                  {{sumLoan}}
              </b-col>
              <b-col lg="2">
                  <b-button v-if="endDate!=''" @click="getSumLoan" >Iздеу</b-button>
              </b-col>
          </b-row>
        </b-col>
       
       
        <b-col lg="12" class="pt-3 text-right">
            <strong>Саны:</strong> {{totalRows}}  
        </b-col>
        <b-table
            small 
            ref="clientLoanTable"
            striped hover selectable
            :items="orderLoanProvider" 
            :fields="fields"
            :busy.sync="isBusy"
            :current-page="currentPage"
            :per-page="perPage"
            :table-variant="tableVariant"
            :select-mode="selectMode"
            selected-variant="danger"
        >
            <template v-slot:cell(id)="{ rowSelected }">
                <template v-if="rowSelected">
                    <span aria-hidden="true">&check;</span>
                    <span class="sr-only">Selected</span>
                </template>
                <template v-else>
                    <span aria-hidden="true">&nbsp;</span>
                    <span class="sr-only">Not selected</span>
                </template>
            </template>
            <template v-slot:table-busy>
                <div class="text-center text-info my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Жүктелуде...</strong>
                </div>
            </template>
            <template v-slot:cell(userInfo)="row">
                {{row.item.firstName + '-'+row.item.lastName+' Тел : ' + row.item.phoneNumber}}
            </template>
        </b-table>
        <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            align="fill"
            size="sm"
            class="my-0"
            
        ></b-pagination>
    </b-row>
    
</template>

<script>
import axios from 'axios';

import {apiDomain,getHeader} from "../config/config";
import Datepicker from 'vuejs-datepicker';
const moment = require('moment')
require('moment/locale/es')
export default {
  name:"ClientLoanPay",
  components:{
      Datepicker
  },
  data(){
    return {
      fields: [
         
          {
            key: 'takenLoanByCash',
            label: 'Дайын',
            variant:'danger'
          },
          {
            key: 'takenLoanByCard',
            label: 'Картбен',
            variant:'primary'
          },
          {
            key: 'loan',
            label: 'Барлық төлегенiм',
            variant:'warning'
          },
        //   {
        //     key: 'loanDesc',
        //     label: 'Түснiктеме',
        //     variant:'danger'
        //   },
          {
            key: 'createdDate',
            label: 'Уақыт',
            variant:'info'
          }
      ],
      isBusy:false,
      totalRows:0,
      currentPage: 1,
      perPage: 30,
      tableVariant:'light',
      beginDate:"",
      endDate:"",
      sumLoan:0
    }
  },
  
  methods:{
    getSumLoan(){
      
      let rbeginDate = null;
      let rendDate = null;
      if(this.beginDate!=''){
        rbeginDate=moment(this.beginDate).format('YYYY-MM-DD');
      }  
      if(this.beginDate!=''){
        rendDate=moment(this.endDate).format('YYYY-MM-DD');
      }  
      if(rbeginDate!=null && rendDate!=null){
        axios.post(apiDomain+'/admin/order/sumpaidloan',
        {'beginDate':rbeginDate,'endDate':rendDate},{headers:getHeader()})
        .then((response) => {
          this.sumLoan=response.data;  
        }).catch(error => {
          alert(error.message);
          this.sumLoan = 0;
        })  
      }
    },
    doSearch(){
        this.$refs.clientLoanTable.refresh();
    },
    filterChange(){
        if(this.filter.trim().length==0)
            this.$refs.clientLoanTable.refresh();
    },
    beginDateCleaner(){
        this.beginDate="";
        this.endDate="";
        this.$refs.clientLoanTable.refresh();
    },
    orderLoanProvider(ctx){
        ctx.filter=this.filter;
        if(this.beginDate!=""){
           ctx.beginDate=moment(this.beginDate).format('YYYY-MM-DD')
        }
        else{
          ctx.beginDate="";
        }
        if(this.endDate!=""){
           ctx.endDate=moment(this.endDate).format('YYYY-MM-DD')
        }
        else{
          ctx.endDate="";
        }
        this.isBusy = false
        let promise = axios.post(apiDomain+'/admin/order/clientloanlist',ctx,{headers:getHeader()});
        return promise.then((response) => {
          const result = response.data;
          this.isBusy = false
          this.totalRows=result.recordCount;
          //alert(JSON.stringify(result));
          return(result.items)
        }).catch(error => {
          alert(error.message);
          this.isBusy = false
          return []
        })
    }
  }
  
 
}
</script>