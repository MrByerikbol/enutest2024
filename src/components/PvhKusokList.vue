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
                    <datepicker format="yyyy-MM-dd" 
                    :clear-button="true" @cleared="clearEnd" v-model="endDate" placeholder="Дуусах огноо"></datepicker>
                </b-col>
                <b-col lg="4">
                    <select v-model="dStatus" @change="tableRefresher" class="d-block w-100 small-font" style="height:29px !important;">
                        <option value=0>--Шинэ--</option>
                        <option value=1>--Хийгдэж байгаа--</option>
                        <option value=2>--Хийгдэж дуссан--</option>
                        <option value=-1>--Бүгд--</option>
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
            responsive
            small 
            ref="kusokTable"
            striped hover 
            :items="pvhKusokProvider" 
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
             <template v-slot:cell(userInfo)="user">
                <b-badge pill variant="light">
                    {{user.item.orderUser.firstName}}
                </b-badge>
                -
                <b-badge pill variant="primary">
                    {{user.item.orderUser.phoneNumber}}
                </b-badge>
            </template>
            <template v-slot:cell(orderActions)="row">

                <center  v-if="row.item.kusokStatus==0 || row.item.kusokStatus==1 ">
                    <b-button 
                      v-if="row.item.kusokStatus==0 || row.item.kusokStatus==1 "  
                      variant="outline-primary" 
                      @click="editPvhKusok(row.item.kusokId)" class="mr-1" size="sm" >
                      <font-awesome-icon icon="pen"  title="Захиалага засах"/>
                    </b-button>
                     <b-button
                        :disabled="row.item.kusokStatus>1 ? true :false"
                        @click="completePvhKusok(row.item.kusokId)" 
                        variant="outline-warning" class="mr-1" size="sm" >
                        <font-awesome-icon icon="check"  title="Захиалага дуусгах"/>
                    </b-button>
                    <b-button v-if="row.item.kusokStatus==0" variant="outline-danger" class="mr-1" size="sm" >
                      <font-awesome-icon icon="window-close"
                         @click="deleteKusokPvh(row.item.kusokId)" title="Захиалага устгах"/>
                    </b-button>
                </center>

            </template>
            <template v-slot:row-details="row">
                
                <b-card>
                    <h6>пвх - нууд</h6>
                    <b-table striped hover :fields="pvhFields" table-variant="primary" 
                        :items="row.item.relDetails">
                        <template v-slot:cell(workInfo)="work">
                            {{ work.item.isDirect==1 ? 'Прямой': 'Обалный' + '-' +work.item.workName}}
                        </template>
                        <template v-slot:cell(isDone)="pvh">
                            {{pvh.item.isDone==2 ? 'Хийгдсэн' : (pvh.item.isDone==1 ? 
                                'Хийгдэж байгаа' : 'Хийгдээгүй') }}
                        </template>
                        <template v-slot:cell(pvhActions)="pvh">
                            <b-row>
                                <b-col lg="6"> <input 
                                    :disabled="pvh.item.isDone==0 || pvh.item.isDone==1 ? false 
                                        : true"
                                    type="number" :max="pvh.item.productCount-pvh.item.doneCount" v-model="pvh.item.doingCount">
                                </b-col>
                                <b-col lg="4">
                                
                                    <b-button 
                                        :disabled="pvh.item.isDone==0 || pvh.item.isDone==1 ? false 
                                        : true"
                                        @click="gluePvh(pvh.item)"  variant="outline-danger" class="mr-1" size="sm" >
                                        <font-awesome-icon icon="check" title="Пвх наах"/>
                                    </b-button>
                                </b-col>
                            </b-row>
                        </template>  
                    </b-table>
                    <b-row>
                        <b-col lg="12" class="text-right py-2">
                        <b-button size="sm" variant="danger" @click="row.toggleDetails">Пвх хаах</b-button>
                        </b-col>
                    </b-row>
                </b-card>
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
    components:{
        Datepicker
    },
    props:["editPvhKusokP"],
    name:"PvhKusokList",
    data(){
        return {
            isSmall:true,
            fields: [
                {
                    key: 'orderNumber',
                    label: 'Дугаар'
                },
                {
                    key: 'userInfo',
                    label: 'Клиент'
                },
                {
                    key: 'totalKusokPrice',
                    label: 'Нийт үнэ'
                },
                {
                    key: 'totalMetr',
                    label: 'Нийт мр'
                    
                },
                {
                    key: 'createdDate',
                    label: 'Огноо',
                  
                },
                
                {
                    key: 'orderActions',
                    label: 'Үйлдэлүүд',
                    align:'center'
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
            pvhFields: [
                {
                    key: 'catName',
                    label: 'Төрөл'
                },
                {
                    key: 'colorName',
                    label: 'Өнгө'
                },
                {
                    key: 'measureName',
                    label: 'Хэмжээ'
                },
                
                {
                    key: 'workInfo',
                    label: 'Ажил'
                },
                {
                    key: 'productCount',
                    label: 'Метр'
                },
                {
                    key: 'totalPrice',
                    label: 'Нийт'
                },
                {
                    key: 'wareHouseName',
                    label: 'Склад'
                },
                {
                    key: 'isDone',
                    label: 'Статус'
                
                },
                {
                    key: 'doneCount',
                    label: 'Наасан'
                
                },
                {
                    key: 'pvhActions',
                    label: 'Үйлдэлүүд'
                }
            ],
            dStatus:0
        }
    },
    methods:{
        gluePvh(item){
            let detailId=item.detailId;
            let doneCount=item.doneCount;

            let checker = Number(item.productCount)-Number(doneCount);
            let doingCount = Number(item.doingCount);
            if(doingCount==0){
                this.$bvToast.toast("Та наасан тоогоо оруулна уу !!!", {
                    title: 'Алдаа !!!',
                    autoHideDelay: 5000,
                    variant:'danger'
                });
                return ;
            }
            if(checker<doingCount){
                this.$bvToast.toast("Та наасан тоогоо буруу оруулсан байна !!!", {
                    title: 'Алдаа !!!',
                    autoHideDelay: 5000,
                    variant:'danger'
                });
                item.doingCount=0;
                return ;          
            }

            let warn = confirm("Та итгэлтэй байна уу ?");
            if(warn){
                axios.post(apiDomain+'/admin/order/setdonecount',
                {'detailId':detailId,"doneCount":doingCount},{headers:getHeader()})
                .then((response)=>{
                    let rData=response.data;
                    let alertMsg = rData==='error' ? 'Алдаа үүслээ .' : 'Үйлдэл амжилттай боллоо.'
                    let variant = rData==='error' ? 'danger' : 'success';
                    this.$bvToast.toast(alertMsg, {
                        title: 'Мэдээлэл',
                        autoHideDelay: 5000,
                        variant:variant
                    });
                    this.tableRefresher();        
                })
                .catch(error => {
                    //console.log(error.message)
                    this.$bvToast.toast(error.message, {
                        title: 'алдаа',
                        autoHideDelay: 5000,
                        variant:"danger"
                    })
                })     
            }
        },
        deleteKusokPvh(kusokId){
            let warn = confirm("Та итгэлтэй байна уу ?");
            let dblWarn = confirm("Та үнэхээр итгэлтэй байна уу ?");
            if(warn && dblWarn){ 
                axios.post(apiDomain+'/admin/order/deletepvhkusok',
                {'kusokId':kusokId},{headers:getHeader()})
                .then(()=>{
                    this.tableRefresher(1);
                })
                .catch(error => {
                    //console.log(error.message)
                    this.$bvToast.toast(error.message, {
                        title: 'алдаа',
                        autoHideDelay: 5000,
                        variant:"danger"
                    })
                }) 
            }
        },
        completePvhKusok(kusokId){
            let warn = confirm("Та итглэтэй байна уу . Та бүх ПВХ нуудыг шууд дуусгах гэж байна .");
            let dblWarn = confirm("Та үнэхээр итгэлтэй байна уу ?");
            if(warn && dblWarn){
                axios.post(apiDomain+'/admin/order/completepvhkusok',{'kusokId':kusokId},{headers:getHeader()})
                .then(response=>{
                    let variant = response.data=='success' ? 'success' : "danger";
                    let alertMsg = variant=='success' ? "Үйлдэл амжилттай үүслээ." 
                        : "Алдаа үүслээ та дахин оролдоно уу ."
                    this.showToast(alertMsg,variant);
                    this.tableRefresher(1);

                })
                .catch(error=>{
                    this.$bvToast.toast(
                        error.message,
                        {
                            title:"Алдааны мэдээлэл",
                            variant:"danger"
                        }
                    );
                });
            }
        },
        showToast(msg,variant){
            this.$bvToast.toast(
                msg,
                {
                    title:"Мэдээлэл",
                    variant:variant
                }
            );
        },
        editPvhKusok(kusokId){
            this.editPvhKusokP(kusokId);
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

            this.$refs.kusokTable.refresh();
        },
        pvhKusokProvider(ctx){
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
            let promise = axios.post(apiDomain+'/admin/order/pvhkusoklist',ctx,{headers:getHeader()});
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