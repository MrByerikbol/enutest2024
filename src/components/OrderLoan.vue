<template>
    <b-modal
    @hide="onOrderLoanModalToggle"
    @show="onOrderLoanModalToggle" 
    id="orderLoanModal" title="Тапсырыс несиесiн төлеу" size="lg" hide-footer>  
        <b-row>
        <b-col lg="12">
            <b-form v-on:submit.prevent="submitOrderLoan">
                <b-form-row class="mb-3">

                    <b-col sm="auto" md="12">
                        <label for="name">Тұтынушы</label>
                        <select
                            v-model="orderLoanForm.userId"
                            class="form-control"
                        >
                            <option value=0>--Тұтынушы таңдау--</option>
                            <option v-for="(u,index) in users" :key="index" :value="u.value">
                                {{u.text + '-'+u.lastName+' Тел : ' + u.phoneNumber}}
                            </option>
                        </select>
                    </b-col>
                    <b-col sm="auto" md="12">
                        <label  for="takenLoanByCard">Картбен алган несие</label>
                        <b-form-input
                            id="takenLoanByCard"
                            v-model="orderLoanForm.takenLoanByCard"
                            type="number"
                            required
                            placeholder="Картбен алган несие"
                        ></b-form-input>
                    </b-col>
                    <b-col sm="auto" md="12">
                        <label  for="takenLoanByCash">Дайын алган несие</label>
                        <b-form-input
                            id="takenLoanByCash"
                            v-model="orderLoanForm.takenLoanByCash"
                            type="number"
                            required
                            placeholder="Дайын алган несие"
                        ></b-form-input>
                    </b-col>
                    <b-col sm="auto" md="12">
                        <label  for="loanDesc">Түсініктеме</label>
                        <b-form-textarea
                            id="loanDesc"
                            v-model="orderLoanForm.loanDesc"                            
                            
                            placeholder="Түсініктеме"
                        ></b-form-textarea>
                    </b-col>
                    
                    
                </b-form-row>
                <b-button type="submit" 
                    v-show="orderLoanForm.userId>0" variant="primary" class="mr-2">Берiлген несие тiркеу</b-button>
                <b-button type="reset" variant="danger">Жою</b-button>
            </b-form>        
        </b-col>  
        <b-col lg="12">
            <h5>
                <span class="bd-content-title">Берiлген несиелер</span>
            </h5>
        </b-col>
        <b-col lg="12">
          <b-row>  
            <b-col lg="5">
                <datepicker format="yyyy-MM-dd"
                :clear-button="true" @cleared="beginDateCleaner" v-model="beginDate" placeholder="Басталу уақыты"></datepicker>
            </b-col>
            <b-col lg="5">
                <datepicker format="yyyy-MM-dd" 
                :clear-button="true" @cleared="endDate=''" v-model="endDate" placeholder="Бiту уақыты"></datepicker>
            </b-col>
          </b-row>
        </b-col>
        <b-col lg="12" class="py-2">
            <b-button variant="info" v-if="selectedRows.length==1" size="sm" @click="updateRecord" class="mr-2">Засах</b-button>
            <b-button variant="danger" v-if="selectedRows.length>0" size="sm" class="mr-2" @click="deleteRecord">Устгах</b-button>
        </b-col>
        <b-col lg="6">
            <input 
                @keyup="filterChange"
                @change="filterChange" v-model="filter" placeholder="Iздеу" type="text" class="form-sm-control w-100"/>
        </b-col>
        <b-col lg="2">
            <b-button v-show="beginDate!='' || filter!=''" @click="doSearch" size="sm">Iзде</b-button>
        </b-col>
        <b-col lg="4" class="pt-3 text-right">
            <strong>Саны:</strong> {{totalRows}}  
        </b-col>
        <b-table
            small 
            ref="orderLoanTable"
            striped hover selectable
            :items="orderLoanProvider" 
            :fields="fields"
            :busy.sync="isBusy"
            :current-page="currentPage"
            :per-page="perPage"
            :table-variant="tableVariant"
           
            selected-variant="danger"
        
            @row-selected="onShopSelected"
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
    </b-modal>
</template>

<script>
import axios from 'axios';
import {mapState} from 'vuex';
import {apiDomain,getHeader} from "../config/config";
import Datepicker from 'vuejs-datepicker';
const moment = require('moment')
require('moment/locale/es')
export default {
  name:"OrderLoan",
  components:{
      Datepicker
  },
  data(){
    return {
      fields: [
          {
            key: 'userInfo',
            label: 'Клиент',
          },
          {
            key: 'takenLoanByCash',
            label: 'Дайын алган',
            variant:'danger'
          },
          {
            key: 'takenLoanByCard',
            label: 'Картбен алган',
            variant:'primary'
          },
          {
            key: 'loan',
            label: 'Барлыгы',
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
      filter:"",
      selectedRows:[],
      //begining of the form submission
      orderLoanForm:{
        loanId:0,
        userId : 0,
        takenLoanByCard:0,
        takenLoanByCash:0,
        loanDesc:""
      },
      beginDate:"",
      endDate:""
    }
  },
  
  methods:{
    doSearch(){
        this.$refs.orderLoanTable.refresh();
    },
    filterChange(){
        if(this.filter.trim().length==0)
            this.$refs.orderLoanTable.refresh();
    },
    beginDateCleaner(){
        this.beginDate="";
        this.endDate="";
        this.$refs.orderLoanTable.refresh();
    },
    deleteRecord(){
      let warn = confirm("Сіз сенімдісіз бе ?");
      if(warn){
        if(this.selectedRows.length>0){
          let o = new Object();
          o.selectedRows=this.selectedRows;
          o.type='bay_order_loan';

          axios.post(apiDomain+'/admin/delivery/deleteref',o,{headers:getHeader()})
            .then(()=>{
                this.orderLoanForm={
                    loanId:0,
                    userId : 0,
                    takenLoanByCard:0,
                    takenLoanByCash:0,
                    loanDesc:""
                }
                this.$refs.orderLoanTable.refresh()
            })
            .catch(error => {
                //console.log(error.message)
                this.$bvToast.toast(error.message, {
                    title: 'алдаа',
                    autoHideDelay: 5000
                })
            }) 
        }
      }
      
    },
    updateRecord(){
      if(this.selectedRows.length==1){
        let id = this.selectedRows[0].loanId;
        if(id>0){
          axios.post(apiDomain+'/admin/delivery/getref',{type:'orderLoan',id:id},{headers:getHeader()})
          .then(response=>{
            this.orderLoanForm=response.data;
          })
          .catch(error => {
              //console.log(error.message)
              this.$bvToast.toast(error.message, {
                  title: 'алдаа',
                  autoHideDelay: 5000
              })
          }) 
        }
      }
      
    },
    submitOrderLoan(evt){
          evt.preventDefault();
          if((Number(this.orderLoanForm.takenLoanByCard)
            +Number(this.orderLoanForm.takenLoanByCash))<=0){
                 this.$bvToast.toast('Несие енгизниз !!!', {
                    title: 'Қате ақпараты',
                    autoHideDelay: 5000,
                    variant:'danger'
                })
                return ;
          }
          axios.post(apiDomain+'/admin/order/postorderloan',this.orderLoanForm,{headers:getHeader()})
            .then(()=>{
                let alertMsg = "Операция сәтті аяқталды";
                this.$bvToast.toast(alertMsg, {
                    title: 'Жетістік',
                    autoHideDelay: 5000,
                    variant:'success'
                })  
                
                this.orderLoanForm={
                    loanId:0,
                    userId : 0,
                    takenLoanByCard:0,
                    takenLoanByCash:0,
                    loanDesc:""
                }
                this.$refs.orderLoanTable.refresh()
            })
            .catch(error => {
                //console.log(error.message)
                this.$bvToast.toast(error.message, {
                    title: 'Жетістік',
                    autoHideDelay: 5000,
                    variant:'danger'
                })
            }
        ) 
    },

    onShopSelected(items){
      this.selectedRows=items;
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
        let promise = axios.post(apiDomain+'/admin/order/orderloanlist',ctx,{headers:getHeader()});
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
    },
    onOrderLoanModalToggle(){
        this.orderLoanForm={
            loanId:0,
            userId : 0,
            takenLoanByCard:0,
            takenLoanByCash:0,
            loanDesc:""
        }
        this.$refs.orderLoanTable.refresh();
    }
  },
  computed:{
    ...mapState([
        'users'
    ])
  }
 
}
</script>