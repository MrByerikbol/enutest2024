<template>
     <b-row>
        <b-col lg="12">
            <hr>    
        </b-col>
        <b-col lg="12">
            <b-row class="mt-2">
                <b-col lg="4">
                    <datepicker format="yyyy-MM-dd"
                    :clear-button="true" @cleared="clearBegin" v-model="beginDate" placeholder="Эхлэх огноо"></datepicker>
                </b-col>
                <b-col lg="4">
                    <datepicker 
                        format="yyyy-MM-dd" 
                    :clear-button="true" @cleared="clearEnd" v-model="endDate" placeholder="Дуусах огноо"></datepicker>
                </b-col>
                <b-col lg="4">
                    <select v-model="dStatus" @change="tableRefresher" class="d-block w-100 small-font" style="height:29px !important;">
                        <option value=0>--Ажил авах--</option>
                        <option value=1>--Миний ажлууд--</option>
                      
                        <option value=2>--Миний хийсэн--</option>
                    </select>
                </b-col>
            </b-row>    
        </b-col> 
        <b-col lg="8">
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
                @keyup="filterChange"
                @change="filterChange"
                id="filterInput"
                placeholder="Хайлт хийх утгаа оруулна уу"
               
                ></b-form-input>
                <b-button size="sm" class="ml-3" v-if="beginDate!='' || filter!=''"
                      @click="doSearch"> 
                    Шүүх 
                </b-button>
            </b-input-group>
            </b-form-group>
        </b-col>
    
        <b-col lg="4" class="pt-3 text-right">
            <strong>тоо:</strong> {{totalRows}}  
        </b-col>
        <b-table 
            
            small 
            ref="workTable"
            striped hover 
            :items="workProvider" 
            :fields="fields"
            :busy.sync="isBusy"
            :current-page="currentPage"
            :per-page="perPage"
            :table-variant="tableVariant"
            selected-variant="active"
            @row-dblclicked="item=>$set(item, '_showDetails', !item._showDetails)"
            >
            <template v-slot:table-busy>
            <div class="text-center text-info my-2">
                <b-spinner class="align-middle"></b-spinner>
                <strong>Ачаалж байна...</strong>
            </div>
            </template>
            <template v-slot:cell(workInfo)="del">
                <b-list-group>
                    <b-list-group-item v-if="loading">
                        <Loading/>
                    </b-list-group-item>
                    <b-list-group-item v-if="!loading">
                        <b-button variant="outline-primary"  class="mb-2" size="sm">
                            {{del.item.orderNumber+'-'+del.item.orderUser.firstName+'-('+del.item.orderUser.phoneNumber+')'}}
                            <b-badge variant="warning" class="ml-2 mt-1">
                                {{del.item.relDetails.length}}
                            </b-badge>
                            <b-badge variant="warning" class="ml-2 mt-1 float-right">
                                {{del.item.createdDate}}
                            </b-badge>
                        </b-button>
                        <DelPvh :relDetails="del.item.relDetails" :dStatus="dStatus" 
                            :tableRefresher="tableRefresher" :showToast="showToast"/>
                        <b-badge variant="danger">
                            {{del.item.kusokStatus==0 
                                ? 'Шинэ' : del.item.kusokStatus=='1' ? 'Наагдаж байна' : 'Наагдсан'}}
                        </b-badge>

                       
                    </b-list-group-item>  
                </b-list-group>
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
import Loading from './Loading';
import DelPvh from './DelPvh';


const moment = require('moment')
require('moment/locale/es')
export default {
    name :"KusokGluer",
    
    components:{
        Datepicker,
        Loading,
        DelPvh
    },
    data(){
        return {
            loading:false,
            isSmall:true,
            fields: [
                {
                    key: 'workInfo',
                    label: 'Кусок пвх мэдээлэл'
                }
            ],
            isBusy:false,
            totalRows:0,
            currentPage: 1,
            perPage: 20,
            tableVariant:'light',
            filter:"",
            beginDate :"",
            endDate: "",
            
            dStatus:0
          
        }
    },
    methods:{
        
        
        
        
       
        showToast(msg,variant){
            this.$bvToast.toast(
                msg,
                {
                    title:"Мэдээлэл",
                    variant:variant,
                    toaster:'b-toaster-bottom-left'
                }
            );
        },
        filterChange(){
            if(this.filter.length==0){
                this.tableRefresher(1);
            }
        },
        clearBegin(){
            this.beginDate="";
            this.endDate=""
            this.tableRefresher(1);
        },
        clearEnd(){
            this.endDate="";
        },
        doSearch(){
            this.tableRefresher(1);
        },
        tableRefresher(p){
            if(p==0){this.dStatus=0}

            this.$refs.workTable.refresh();
        },
        //shine ajluudiin jagsaalt      
        workProvider(ctx){
            
            ctx.filter=this.filter;
            ctx.dStatus=this.dStatus;

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
            let promise = axios.post(apiDomain+'/admin/work/gluer/kusok/getkusokpvhwork',ctx,{headers:getHeader()});

            return promise.then((response) => {
                const result = response.data;
                this.isBusy = false
                this.totalRows=result.gridData.recordCount;
                
                result.gridData.items.forEach(function(obj){ 
                    if(Number(obj.kusokStatus) == 0){
                        obj._rowVariant = "light";
                    }
                    if(Number(obj.kusokStatus) == 1){
                        obj._rowVariant = "warning";
                    }
                    if(Number(obj.kusokStatus) == 2){
                        obj._rowVariant = "danger";
                    }
                });
                //alert(JSON.stringify(result.gridData.items));
                return result.gridData.items;
            }).catch(error => {
                this.$bvToast.toast(error.message, {
                    title: 'Алдааны мэдээлэл',
                    autoHideDelay: 5000,
                    variant:"danger"
                })  
                this.isBusy = false
                return []
            })
        }
        
    }
}
</script>

<style>
    .small-font{
        font-size:90%;
        font-weight: 400 
   }
   .xs-font{
        font-size:80%;
        font-weight: 400 
   }
</style>