<template>
    <b-col lg="12">
        <b-row>
            <b-col lg="12" class="pt-3 text-right">
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
                selected-variant="danger"   
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
                                <b-badge variant="warning" class="ml-2 mt-1">
                                    {{del.item.listCount}}
                                </b-badge>
                                <b-badge variant="warning" class="ml-2 mt-1 float-right">
                                    {{del.item.orderDate}}
                                    
                                </b-badge>
                            </b-button>

                            
                            <div style="clear:left;" class="mt-1 w-100 d-inline-block pl-3"
                                v-for="(work,workIndex) in del.item.deliveryProducts" :key="workIndex">

                                <div class="float-left mb-1">
                                    <b-button size="sm" @dblclick="getDelWork(work.relId,'one')"  variant="outline-success">

                                        <b-badge>
                                            {{work.catName+'-'+work.colorName+'-'+work.measureName}}
                                        </b-badge>
                                        <b-badge  class="ml-1">
                                            {{'Тоо : '+work.productCount}}
                                        </b-badge>
                                        <b-badge  class="ml-1">
                                            {{'Зүссэн : '+work.doneCount}}
                                            
                                        </b-badge>
                                    </b-button>   
                                </div>

                                <div style="clear:left;" class="w-100 pl-3">
                                    <b-badge :variant="user.isActive==1 ? 'primary' : 'danger' " class="ml-1" style="cursor:pointer;" 
                                        v-for="(user,userIndex) in work.listUsers" :key="userIndex">
                                        {{user.relUserInfo + ' ('+user.confirmedDoneCount+')'}}    
                                    </b-badge>
                                </div>
                                <DelListWork
                                    v-if="work.listWorks 
                                    && work.listWorks.length>0"
                                    :listWorks="work.listWorks" 
                                    :dStatus="2" 
                                    :isPvh="false"
                                ></DelListWork>

                                <DelPvh
                                    v-if="work.relDetails 
                                            && work.relDetails.length>0" 
                                    :relDetails="work.relDetails" 
                                    :dStatus="2" 
                                    :isKusok="false"
                                    :showToast="showToast"
                                    :calcSalary="calculateSalary"
                                    :userId="userId"
                                    :updateSalaryBalance="updateSalaryBalance"
                                    :tableRefresher="tableRefresher"></DelPvh>

                               

                            </div>
                        
                            <b-badge variant="danger">
                                {{del.item.listStatus==0 
                                    ? 'Шинэ' : del.item.listStatus=='1' ? 'Зүсэгдэж байна' : 'Зүсэгдсэн'}}
                            </b-badge>

                            <b-badge variant="warning" class="ml-1">
                                {{del.item.pvhStatus==0 
                                    ? 'Наагдаагүй' : del.item.pvhStatus==1 ? 'Наагдаж байна' : 'Наагдсан'}}
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
import DelListWork from './DelListWork';
import DelPvh from './DelPvh';


import {EventBus} from '@/EventBus.js';
export default {
    name :"SlicerCalculation",
    props:['userId','userInfo','beginDate','endDate','filter'],
    components:{
        Loading,
        DelListWork,
        DelPvh
    },
    data(){
        return {
            loading:false,
            isSmall:true,
            fields: [
                {
                    key: 'workInfo',
                    label: 'Наасан ажлын мэдээлэл'
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

            EventBus.$emit("gluerSalaryInformation",this.salaryInformation);
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
        tableRefresher(){
            if(this.$refs.workTable)
                this.$refs.workTable.refresh();
        },
        //hiise ajliin jagsaalt 
        workProvider(ctx){
            ctx.userId=this.userId;
            ctx.filter=this.filter;
            ctx.beginDate = this.beginDate;
            ctx.endDate = this.endDate;

            if(Number(this.userId)>0 && this.beginDate!="" && this.endDate!=""){
               
                this.isBusy = false
                let promise = axios.post(apiDomain+'/admin/calculation/gluerworklist',ctx,{headers:getHeader()});
                return promise.then((response) => {
                    const result = response.data;
                    this.isBusy = false
                    this.totalRows=result.gridData.recordCount;
                    this.salaryInformation = [];
                    EventBus.$emit("mainSalaryRendered");
                    EventBus.$emit("salarySearchDone");
                    return result.gridData.items;
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
        EventBus.$on("gluerTableRefresher", ()=> {
            vm.tableRefresher();
            EventBus.$emit("mainSalaryRendered");

            EventBus.$emit("gluerKusokTableRefresher");
        });
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