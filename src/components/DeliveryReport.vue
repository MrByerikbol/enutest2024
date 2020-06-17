<template>
  
   
    <div>
      <b-form-row class="mb-3">
        <h3>
          <span class="bd-content-title">Тайлангийн модул</span>
        </h3>
      </b-form-row>
      <b-form-row class="mb-3">
          <b-col lg="8">
            <select v-model="reportType" class="form-control">
                <option value="1">Хүргэлтийн нэгдсэн тайлан</option>
                <option value="3">Оператор болон хүргэгчийн тайлан</option>
                <option value="2">Барааны тайлан</option>
            </select>
          </b-col>
          <b-col lg="4" v-if="reportType==3">
            <select v-model="userType" class="form-control">
                <option value="user_id">Хүргэгч</option>
                <option value="reg_user_id">Оператор</option>
            </select>
          </b-col>
      </b-form-row>
      <b-form-row class="mb-3">
        <b-col lg="4" >
            <datepicker format="yyyy-MM-dd" 
                :clear-button="true" @cleared="clearDate" v-model="beginDate" placeholder="Басталу уақыты"></datepicker>
        </b-col>
        <b-col lg="4" class="text-right">
            <datepicker style="display:block;" format="yyyy-MM-dd" 
                :clear-button="true" @cleared="clearDate1" v-model="endDate" placeholder="Бiту уақыты"></datepicker>
        </b-col>

        <b-col lg="2" >
            <b-button v-if="beginDate!=''" size="sm" @click="doFilter">Шүүх</b-button>
        </b-col>
            
      </b-form-row>  

      <b-form-row v-if="reportType==1">
        <b-col lg="8">
            <input
                class="form-control"
                v-model="filter"
                type="search"
                id="filterInput"
                placeholder="Хайлт хийх утгаа оруулна уу"
            />
        </b-col>
        <b-col lg="4" class="pt-3 text-right">
            <strong>тоо:</strong> {{totalRows}}  
        </b-col>
       
      </b-form-row>  
      <b-table 
        ref="mainDeliveryReportTable"
        striped hover selectable
        :items="mainReportProvider" 
        :fields="fields"
        :busy.sync="isBusy"
        :current-page="currentPage"
        :per-page="perPage"
        :table-variant="tableVariant"
        :filter="filter"
        :select-mode="selectMode"
        selected-variant="danger"

        v-if="reportType==1"

        >
        <template v-slot:cell(userId)="{ rowSelected }">
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

     
      </b-table>
      <b-pagination
          v-if="reportType==1"
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          align="fill"
          size="sm"
          class="my-0"
          
      ></b-pagination>

      <b-form-row v-if="reportType==2">
        <b-col lg="6">
            <input
                class="form-control"
                v-model="filterProduct"
                type="search"
                id="filterInput"
                placeholder="Хайлт хийх утгаа оруулна уу"
            />
        </b-col>
        <b-col lg="3" class="pt-3 text-right">
            <strong>тоо:</strong> {{totalRowsProduct}}  
        </b-col>
         <b-col lg="3" class="pt-3 text-right">
            <strong>Нийт:</strong> {{totalPrice}}₮  
        </b-col>
        
      </b-form-row>  
      <b-table 
        ref="mainDeliveryReportProductTable"
        striped hover selectable
        :items="mainReportProvider" 
        :fields="fieldsProduct"
        :busy.sync="isBusyProduct"
        :current-page="currentPageProduct"
        :per-page="perPageProduct"
        :table-variant="tableVariant"
        :filter="filterProduct"
        :select-mode="selectMode"
        selected-variant="danger"

        v-if="reportType==2"

        >
        <template v-slot:cell(userId)="{ rowSelected }">
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

     
      </b-table>
      <b-pagination 
          v-if="reportType==2"
          v-model="currentPageProduct"
          :total-rows="totalRowsProduct"
          :per-page="perPageProduct"
          align="fill"
          size="sm"
          class="my-0"
          
      ></b-pagination>  

      <b-form-row v-if="reportType==3">
        <b-col lg="8">
            <!-- <input
                class="form-control"
                v-model="filterProduct"
                type="search"
                id="filterInput"
                placeholder="Хайлт хийх утгаа оруулна уу"
            /> -->
        </b-col>
        <b-col lg="6" class="pt-3 text-right">
            <strong>тоо:</strong>{{totalRowsUser}}  
        </b-col>
        <b-col lg="6" class="pt-3 text-right">
            <strong>Хүргэсэн:</strong> {{succCount}}  
            <br>
            <strong>Цуцалсан:</strong> {{declinedCount}}
        </b-col>
      </b-form-row>

      <b-table 
        ref="mainDeliveryReportUserTable"
        striped hover selectable
        :items="mainReportProvider" 
        :fields="fieldsUser"
        :busy.sync="isBusyUser"
        :current-page="currentPageUser"
        :per-page="perPageUser"
        :table-variant="tableVariant"
       
        :select-mode="selectMode"
        selected-variant="danger"

        v-if="reportType==3"

        >
        <template v-slot:cell(userId)="{ rowSelected }">
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

     
      </b-table>
      <b-pagination 
          v-if="reportType==3"
          v-model="currentPageUser"
          :total-rows="totalRowsUser"
          :per-page="perPageUser"
          align="fill"
          size="sm"
          class="my-0"
      ></b-pagination>    
    </div>
</template>

<script>
import axios from 'axios';
import {apiDomain,getHeader} from "../config/config";
import Datepicker from 'vuejs-datepicker';
const moment = require('moment')
require('moment/locale/es')
export default {

  name: 'DeliveryReport',

  components:{
    Datepicker
  },

  data(){
    return {
      fields: [
          {
            key: 'all',
            label: 'Нийт',
          },
          {
            key: 'success',
            label: 'Хүргэсэн',
          },
          {
            key: 'declined',
            label: 'Цуцалсан',
          }
      ],
      isBusy:false,
      totalRows:0,
      currentPage: 1,
      perPage: 20,
      tableVariant:'light',
      filter:"",
      selectMode:'multi',

      //baraanii tailan 
      fieldsProduct: [
          {
            key: 'productName',
            label: 'Барааны нэр',
          },
          {
            key: 'productPrice',
            label: 'Нэгжийн үнэ',
          },
          {
            key: 'totalCount',
            label: 'Нийт тоо',
          },
          {
            key: 'totalPrice',
            label: 'Нийт дүн',
          }
      ],
      isBusyProduct:false,
      totalRowsProduct:0,
      currentPageProduct: 1,
      perPageProduct: 20,
      filterProduct:"",
      

      //baraanii tailan 
      fieldsUser: [
          {
            key: 'firstName',
            label: 'Нэр',
          },
          {
            key: 'phoneNumber',
            label: 'Утасны дугаар',
          },
          {
            key: 'all',
            label: 'Нийт тоо',
          },
          {
            key: 'success',
            label: 'Хүргэсэн',
          },
          {
            key: 'declined',
            label: 'Цуцалсан',
          }

      ],

      isBusyUser:false,
      totalRowsUser:0,
      currentPageUser: 1,
      perPageUser: 100,
      


      userType:"user_id",
      beginDate: "",
      endDate:"",
      reportType:1,
      declinedCount:0,
      succCount:0,
      totalPrice:0
    }
  },
  methods:{
    clearDate(){
      this.beginDate="";
      this.endDate="";
    },
    clearDate1(){
      this.endDate=""
    },
    doFilter(){
        if(this.reportType==1){
            this.$refs.mainDeliveryReportTable.refresh();
        }
        if(this.reportType==2){
            this.$refs.mainDeliveryReportProductTable.refresh();
        }
        if(this.reportType==3){
            this.$refs.mainDeliveryReportUserTable.refresh();
        }
    },
    mainReportProvider(ctx){
        if(this.beginDate!=""){
            ctx.beginDate=moment(this.beginDate).format('YYYY-MM-DD')
            if(this.endDate!=""){
                ctx.endDate=moment(this.endDate).format('YYYY-MM-DD')
            }
            else{
                ctx.endDate=moment(this.beginDate).format('YYYY-MM-DD');
            }
            let endPoint = null;
            if(this.reportType==1){
                endPoint = 'deliverymain';
            }
            if(this.reportType==2){
                endPoint = 'productreport';
            }
            if(this.reportType==3){
                endPoint = 'userreport';
            }

            if(endPoint!=null){
                if(endPoint=='deliverymain'){
                    this.isBusy = false
                }
                if(endPoint=='productreport'){
                    this.isBusyProduct = false
                }
                if(endPoint=='userreport'){
                    this.isBusyUser = false
                }
                ctx.userType=this.userType;
                let promise = axios.post(apiDomain+'/admin/delivery/report/'+endPoint,ctx,{headers:getHeader()});
                return promise.then((response) => {
                    const result = response.data;
                    if(endPoint=='deliverymain'){
                        this.isBusy = false
                        this.totalRows=result.recordCount;
                    }
                    if(endPoint=='productreport'){
                        this.isBusyProduct = false;
                        this.totalRowsProduct=result.recordCount;
                        this.totalPrice=result.totalCost;

                    }
                    if(endPoint=='userreport'){
                        this.isBusyUser = false;
                        this.totalRowsUser=result.recordCount;
                        //alert(totalRowsUser);
                    }
                    this.declinedCount = result.declinedCount;
                    this.succCount = result.sucCount;

                    //alert(JSON.stringify(result));
                    return(result.items)
                }).catch(error => {
                    this.isBusy = false;
                    this.isBusyProduct = false;
                    this.isBusyUser = false;
                    alert(error.message);

                    return [];
                })
            }
        }
    }
  }
}
</script>