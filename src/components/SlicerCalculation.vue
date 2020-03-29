<template>
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
                            {{del.item.orderNumber +'-'+ del.item.userInfo}}
                            <b-badge variant="warning" class="ml-2 mt-1">
                                {{del.item.listCount}}
                            </b-badge>
                            <b-badge variant="warning" class="ml-2 mt-1 float-right">
                                {{del.item.orderDate}}
                            </b-badge>
                            <br 
                            v-if="del.item.waitingReason && del.item.waitingReason!=null && del.item.waitingReason!=''">
                            <b-badge
                            v-if="del.item.waitingReason && del.item.waitingReason!=null && del.item.waitingReason!=''">
                                {{del.item.waitingReason}}
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
                                    <br v-if="work.myUnconfirmedCount && work.myUnconfirmedCount>0">
                                    <b-badge 
                                        v-if="work.myUnconfirmedCount && work.myUnconfirmedCount>0"
                                        variant="danger" class="ml-2 mt-1 float-right">
                                        {{'Миний баталагдаагүй зүсэлт : '+ work.myUnconfirmedCount}}
                                    </b-badge>
                                </b-button>
                               
                            </div>

                            
                            <div style="clear:left;" class="w-100 pl-3">
                                <b-badge :variant="user.isActive==1 ? 'primary' : 'danger' " class="ml-1" style="cursor:pointer;" 
                                    v-for="(user,userIndex) in work.listUsers" :key="userIndex">
                                    {{user.relUserInfo + ' ('+user.confirmedDoneCount+')'}}    
                                </b-badge>
                            </div>

                            <DelListWork v-if="work.listWorks 
                                && work.listWorks.length>0" :listWorks="work.listWorks" 
                            :dStatus="dStatus" 
                            :isPvh="false"
                            :showToast="showToast"
                            :tableRefresher="tableRefresher"></DelListWork>

                            <!-- 'listUsers','userId','salary' -->
                            <SlicerSalaryPeriod
                                :listUsers="work.listUsers"
                                :userId="userId"
                            />

                        </div>
                        <b-badge variant="danger">
                            {{del.item.listStatus==0 
                                ? 'Зүсэгдээгүй' : del.item.listStatus=='1' ? 'Зүсэгдэж байна' : 'Зүсэгдсэн'}}
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
</template>
<script>
import axios from 'axios';
import {apiDomain,getHeader} from "../config/config";
import Loading from './Loading';
import DelListWork from './DelListWork';
import SlicerSalaryPeriod from './SlicerSalaryPeriod';
export default {
    name :"SlicerCalculation",
    props:['userId','userInfo','beginDate','endDate','filter'],
    components:{
        Loading,
        DelListWork,
        SlicerSalaryPeriod
    },
    data(){
        return {
            loading:false,
            isSmall:true,
            fields: [
                {
                    key: 'workInfo',
                    label: 'Ажлын мэдээлэл'
                }
            ],
            isBusy:false,
            totalRows:0,
            currentPage: 1,
            perPage: 20,
            tableVariant:'light'
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
        tableRefresher(){
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
                let promise = axios.post(apiDomain+'/admin/calculation/worklist',ctx,{headers:getHeader()});
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
                });
            }
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