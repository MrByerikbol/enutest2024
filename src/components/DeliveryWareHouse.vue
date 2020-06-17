<template>
    <b-row>
      <b-col lg="6">

        <b-col lg="12">
          <h3>
            <span class="bd-content-title">Барааны жагсаалт хураангуй</span>
          </h3>
        </b-col>
        <b-col lg="10">
          <b-form-group
            label="Хайлт"
            label-cols-sm="1"
            label-align-sm="left"
            label-size="sm"
            label-for="filterInput"
            class="mb-2 mt-3"
          >
            <b-input-group size="sm">
              <b-form-input
                v-model="filterMain"
                type="search"
                id="filterInput"
                placeholder="Хайлт хийх утгаа оруулна уу"
              ></b-form-input>
              
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col lg="2" class="pt-3 text-right">
            <strong>тоо:</strong> {{totalRowsMain}}  
        </b-col>
        <b-table 
          ref="productMainTable"
          striped hover selectable
          :items="productMainProvider" 
          :fields="fieldsMain"
          :busy.sync="isBusyMain"
          :current-page="currentPageMain"
          :per-page="perPageMain"
          :table-variant="tableVariant"
          :filter="filterMain"
          :select-mode="selectMode"
          selected-variant="danger"
        
          @row-selected="onProductSelectedMain"
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
            v-model="currentPageMain"
            :total-rows="totalRowsMain"
            :per-page="perPageMain"
            align="fill"
            size="sm"
            class="my-0"
            
        ></b-pagination>    
      </b-col>
      <b-col lg="6">
        <b-col lg="12">
          <h3>
            <span class="bd-content-title">Барааны жагсаалт дэлгэрэнгүй</span>
          </h3>
        </b-col>
        <b-col lg="12">
          <b-form-group
            label="Хайлт"
            label-cols-sm="1"
            label-align-sm="left"
            label-size="sm"
            label-for="filterInput"
            class="mb-2 mt-3"
          >
            <b-input-group size="sm">
              <b-form-input
                v-model="filter"
                type="search"
                id="filterInput"
                placeholder="Хайлт хийх утгаа оруулна уу"
              ></b-form-input>
              
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-row>
          <b-col lg="7" class="pt-3">
                <datepicker format="yyyy-MM-dd" 
                    :clear-button="true" @cleared="clearDate" v-model="beginDate" placeholder="Огноо оруулна уу"></datepicker>
          </b-col>

          <b-col lg="3" class="pt-3">
                    <b-button  
                    v-if="beginDate!=''" size="sm" @click="searchBydate">
                    Шүүх    
                </b-button>
            </b-col>
          <b-col lg="2" class="pt-3 text-right">
            <strong>тоо:</strong> {{totalRows}}  
          </b-col>
        </b-row>
        <b-table 
          ref="userProductTable"
          striped hover selectable
          :items="productProvider" 
          :fields="fields"
          :busy.sync="isBusy"
          :current-page="currentPage"
          :per-page="perPage"
          :table-variant="tableVariant"
          :filter="filter"
          :select-mode="selectMode"
          selected-variant="danger"
        
          @row-selected="onProductSelected"
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
          <template slot="isConfirmed" slot-scope="row">
              <div class="text-center text-info">
                  <b-button v-if="row.item.isConfirmed==0"
                          @click="confirmProduct(row.item.id)"  variant="danger" size="sm">
                      баталгаажуулах    
                  </b-button>
                  <strong v-if="row.item.isConfirmed==1">Баталгаажсан</strong>
              </div>
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

      </b-col>  
    </b-row>

</template>

<script>
import axios from 'axios';
import {apiDomain,getHeader} from "../config/config";
import { ModelListSelect } from 'vue-search-select'
import Datepicker from 'vuejs-datepicker';
const moment = require('moment')
require('moment/locale/es')
export default {
  name: 'DeliveryWareHouse',

  data(){
    return {
      fields: [
          {
            key: 'id',
            label: 'Id',
          },
          {
            key: 'productName',
            label: 'Барааны нэр',
          },
          {
            key: 'productCount',
            label: 'Барааын тоо',
          },
          {
            key: 'createdDate',
            label: 'Огноо',
          },

          {
            key: 'isConfirmed',
            label: 'Баталгаажуулалт',
          }
          
      ],
      isBusy:false,
      totalRows:0,
      currentPage: 1,
      perPage: 20,
      tableVariant:'light',
      filter:"",
      selectMode:'multi',
      selectedRows:[],
      beginDate:"",


      //for the main table
       fieldsMain: [
          {
            key: 'id',
            label: 'Id',
          },
          {
            key: 'productName',
            label: 'Барааны нэр',
          },
          {
            key: 'productCount',
            label: 'Барааын тоо',
          }
      ],
      isBusyMain:false,
      totalRowsMain:0,
      currentPageMain: 1,
      perPageMain: 20,
      tableVariant:'light',
      filterMain:"",
      selectMode:'multi',
      selectedRowsMain:[],

     
    }
  },
  methods:{
    onProductSelected(items){
      this.selectedRows=items;
    },
    onProductSelectedMain(items){
      this.selectedRowsMain=items;
    },
    productProvider(ctx){
        let calculationDate1=moment(this.beginDate).format('YYYY-MM-DD');
        ctx.beginDate= calculationDate1;
        this.isBusy = false
        let promise = axios.post(apiDomain+'/admin/delivery/userwarehousedetail',ctx,{headers:getHeader()});
        return promise.then((response) => {
          const result = response.data;
          this.isBusy = false
          this.totalRows=result.recordCount;
          //alert(JSON.stringify(result));
          return(result.items)
        }).catch(error => {
          this.isBusy = false
          return []
        })
    },
    productMainProvider(ctx){
       
        this.isBusyMain = false
        let promise = axios.post(apiDomain+'/admin/delivery/userwarehousemain',ctx,{headers:getHeader()});
        return promise.then((response) => {
          const result = response.data;
          this.isBusyMain = false
          this.totalRowsMain=result.recordCount;
          //alert(JSON.stringify(result));
          return(result.items)
        }).catch(error => {
          this.isBusy = false
          return []
        })
    },
    clearDate(){
        this.beginDate="";
    },
    searchBydate(){
        this.$refs.userProductTable.refresh();
    },
    confirmProduct(relId){
        let warn = confirm("Сіз сенімдісіз бе ?");
        if(warn){
            axios.post(apiDomain+'/admin/delivery/confirmproduct',{'relId':relId},{headers:getHeader()})
            .then(response=>{
                if(response.data=='success'){
                    this.$refs.userProductTable.refresh();
                }
            });
        }   
    }
  },
  components: {
    Datepicker
  }
}
</script>