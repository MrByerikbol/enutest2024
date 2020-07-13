<template>
     <b-row>
        <b-col lg="12">
            <hr>    
        </b-col>
        <b-col lg="12">
            <b-row class="mt-2">
                <b-col lg="4">
                    <datepicker format="yyyy-MM-dd"
                    :clear-button="true" @cleared="clearBegin" v-model="beginDate" placeholder="Басталу уақыты"></datepicker>
                </b-col>
                <b-col lg="4">
                    <datepicker 
                        format="yyyy-MM-dd" 
                    :clear-button="true" @cleared="clearEnd" v-model="endDate" placeholder="Аяқталу уақыты"></datepicker>
                </b-col>
                <b-col lg="4">
                    <select v-model="dStatus" @change="tableRefresher" class="d-block w-100 small-font" style="height:29px !important;">
                        
                        <option value=0>--Жана тапсырыстарым--</option>
                        <option value=1>--Істелудегi тапсырыстарым--</option>
                        <option value=2>--Істелген тапсырыстарым--</option>

                    
                    </select>
                </b-col>
            </b-row>    
        </b-col> 
        <b-col lg="6" class="pt-3">
            <input 
                type="search"
                v-model="filter"
                @keyup="filterChange"
                @change="filterChange"
                id="filterInput"
                placeholder="Iздейтiн сөз"   
                class="form-control"
            >
            <b-button size="sm" class="ml-3" v-if="beginDate!='' || filter!=''"
                    @click="doSearch"> 
                Талдау 
            </b-button>
        </b-col>
    
        <b-col lg="3" class="pt-3 text-right">
            <strong>саны:</strong> {{totalRows}}  
        </b-col>
        <b-col lg="3" class="pt-3 text-right">
            <b-icon icon="arrow-repeat" id="salaryOk"
                href="#"
                tabindex="0"
                v-b-tooltip.hover
                @click="tableRefresher"
                title="Жүктеу"
                style="cursor:pointer"
                variant="success" font-scale="2"
            >
            </b-icon>  
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
                            <br v-if="dStatus==Number(-1)">
                            <b-badge v-if="dStatus==Number(-1)">
                                {{del.item.waitingReason}}
                            </b-badge>
                             <br>
                            <b-badge block class="w-100" variant="danger" >
                                Тапсырыс сомасы: <strong>{{del.item.totalProductPrice}}</strong>
                             </b-badge>
                        </b-button>

                       
                        <div style="clear:left;" class="mt-1 w-100 d-inline-block pl-3"
                             v-for="(work,workIndex) in del.item.deliveryProducts" :key="workIndex">

                            <div class="float-left mb-1">
                                <b-button size="sm"  variant="outline-success">

                                    <b-badge>
                                        {{work.catName+'-'+work.colorName+'-'+work.measureName}}
                                    </b-badge>
                                    <b-badge  class="ml-1">
                                        {{'Саны : '+work.productCount}}
                                    </b-badge>
                                    <b-badge  class="ml-1">
                                        {{'Кескен : '+work.doneCount}}
                                    </b-badge>
                                    <br>
                                    <b-badge block class="w-100" variant="warning" >
                                        Багасы: <strong>{{work.totalPrice}}</strong>
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
                                        && work.listWorks.length>0"
                                        :listWorks="work.listWorks" 
                                :dStatus="dStatus" 
                                :isPvh="true"
                                :showToast="showToast"
                                :tableRefresher="tableRefresher" ></DelListWork>
                            <DelPvh
                                v-if="work.relDetails 
                                        && work.relDetails.length>0"                                         
                                :relDetails="work.relDetails" 
                                :dStatus="dStatus" 
                                :showToast="showToast"
                                :tableRefresher="tableRefresher" 
                                :isClient=true></DelPvh>
                        </div>
                        <hr/>
                        <b-badge variant="danger">
                            {{del.item.listStatus==0 
                                ? 'Жаңа' : del.item.listStatus=='1' ? 'Кесілуде' : 'Кесілді'}}
                         </b-badge>

                          <b-badge variant="warning" class="ml-1">
                            {{del.item.pvhStatus==0 
                                ? 'Жапсырылмаған' : del.item.pvhStatus==1 ? 'Жапсырылуда' : 'Жапсырылған'}}

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
import DelListWork from './DelListWork';
import DelPvh from './DelPvh';



const moment = require('moment')
require('moment/locale/es')
export default {
    name :"Client",
    components:{
        Datepicker,
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
                    label: 'Жұмыс ақпараты'
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
                    title:"Ақпарат",
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
            ctx.delStatus=this.dStatus;

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
            let promise = axios.post(apiDomain+'/admin/order/client/orderlist',ctx,{headers:getHeader()});
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
                    title: 'Ақпарат',
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