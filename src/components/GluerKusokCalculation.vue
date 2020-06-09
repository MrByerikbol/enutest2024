<template>
    <b-col lg="12">
        <b-row>
            <b-col lg="12" class="pt-3 text-right">
                <strong>тоо:</strong> {{totalRows}}  
            </b-col>
            <b-table 
                
                small 
                ref="kusokWorkTable"
                striped hover 
                :items="workProvider" 
                :fields="fields"
                :busy.sync="isBusy"
                :current-page="currentPage"
                :per-page="perPage"
                :table-variant="tableVariant"
                selected-variant="active"   
            >
                <template v-slot:table-busy>

                <div class="text-center text-info my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Жүктелуде...</strong>
                </div>
                </template>
                <template v-slot:cell(workInfo)="del">
                    <b-list-group>
                        <b-list-group-item v-if="loading">
                            <Loading/>
                        </b-list-group-item>
                        <b-list-group-item v-if="!loading">
                        
                            <b-button variant="outline-primary"  class="mb-2" size="sm">
                            
                                {{del.item.orderNumber +'-'+ del.item.userInfo}}
                                <b-badge variant="warning" class="ml-2 mt-1 float-right">
                                    {{del.item.orderDate}}
                                </b-badge>
                            </b-button>

                            
                            <div style="clear:left;" class="mt-1 w-100 d-inline-block pl-3">
                                <DelPvh
                                    v-if="del.item.relDetails && del.item.relDetails.length>0" 
                                    :relDetails="del.item.relDetails" 
                                    :dStatus="2" 
                                    :showToast="showToast"
                                    :calcSalary="calculateSalary"
                                    :userId="userId"
                                    :isKusok="true"
                                    :updateSalaryBalance="updateSalaryBalance"
                                    :tableRefresher="tableRefresher">
                                </DelPvh>
                            </div>
                            <b-badge variant="warning" class="ml-1">
                                {{del.item.kusokStatus==0 
                                    ? 'Наагдаагүй' : del.item.kusokStatus==1 ? 'Наагдаж байна' : 'Наагдсан'}}
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
    </b-col> 
</template>
<script>
import axios from 'axios';
import {apiDomain,getHeader} from "../config/config";
import Loading from './Loading';
import DelPvh from './DelPvh';

import {EventBus} from '@/EventBus.js';
export default {
    name :"GluerKusokCalculation",
    props:['userId','beginDate','endDate'],

    components:{
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
                    label: 'Наасан куосок ажлын мэдээлэл'
                }
            ],
            isBusy:false,
            totalRows:0,
            currentPage: 1,
            perPage: 1000,
            tableVariant:'light',
            salaryInformation:[],
            
        }
    },
    methods:{
        tableRefresher(){
            if(this.$refs.kusokWorkTable)
                this.$refs.kusokWorkTable.refresh();
        },
         
        updateSalaryBalance(anyId){
            EventBus.$emit("updateGluerSalary",{'anyId':anyId});
        },
        calculateSalary(detailId,salarySum){
            
            let foundIndex = this.checkSalaryInformation(detailId);
            //console.info("osilaisha barligi bolip atir goi "+foundIndex);
            if(Number(foundIndex)==-1){
                this.salaryInformation.push({
                    'salary' : salarySum,
                    'itemId':detailId,
                    'salaryType':2});
            }
            else{
                this.salaryInformation[foundIndex].salary=salarySum;
            }

            EventBus.$emit("gluerKusokSalaryInformation",this.salaryInformation);
        },
        checkSalaryInformation (detailId){
            let theResult = -1;
            this.salaryInformation.filter((s,index)=>{
                if(Number(s.itemId)==Number(detailId))
                    theResult=index;
            });        
            if (theResult!=-1){
                return theResult;
            }
            return -1;
        },  
        
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
        //hiise ajliin jagsaalt 
        workProvider(ctx){
            ctx.userId=this.userId;
            ctx.filter="";
            ctx.beginDate = this.beginDate;
            ctx.endDate = this.endDate;
            if(Number(this.userId)>0 && this.beginDate!="" && this.endDate!=""){
                this.isBusy = false
                let promise = axios.post(apiDomain+'/admin/calculation/gluerkusoklist',ctx,{headers:getHeader()});
                return promise.then((response) => {
                    const result = response.data;
                    this.isBusy = false
                    this.totalRows=result.recordCount;
                    this.salaryInformation = [];
                    return result.items;
                }).catch(error => {
                    this.$bvToast.toast(error.message, {
                        title: 'Қате туралы ақпарат',
                        autoHideDelay: 5000,
                        variant:"danger"
                    })  
                    this.isBusy = false
                    return []
                });
            }
         
            
        }

    },
    created(){
        var vm = this;
        EventBus.$on("gluerKusokTableRefresher", ()=> vm.tableRefresher());
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