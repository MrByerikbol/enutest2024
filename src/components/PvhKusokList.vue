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
                    <datepicker format="yyyy-MM-dd" 
                    :clear-button="true" @cleared="clearEnd" v-model="endDate" placeholder="Бiту уақыты"></datepicker>
                </b-col>
                <b-col lg="4">
                    <select v-model="dStatus" @change="tableRefresher" class="d-block w-100 small-font" style="height:29px !important;">
                        <option value=0>--Жаңа--</option>
                        <option value=1>--Iстелуде--</option>
                        <option value=2>--Iстелген--</option>
                        <option value=-1>--Барлығы--</option>
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
                placeholder="Iздеу"
               
                ></b-form-input>
                <b-button size="sm" class="ml-3" v-if="beginDate!='' || filter!=''"
                      @click="doSearch"> 
                    Iзде 
                </b-button>
            </b-input-group>
            </b-form-group>
        </b-col>
    
        <b-col lg="4" class="pt-3 text-right">
            <strong>Саны:</strong> {{totalRows}}  
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
            selected-variant="danger"
            @row-dblclicked="item=>$set(item, '_showDetails', !item._showDetails)"
            >
            <template v-slot:table-busy>
            <div class="text-center text-info my-2">
                <b-spinner class="align-middle"></b-spinner>
                <strong>Жүктелуде...</strong>
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
                      <font-awesome-icon icon="pen"  title="Тапсырысты жөндеу"/>
                    </b-button>
                   
                    <b-button v-if="row.item.kusokStatus==0" variant="outline-danger" class="mr-1" size="sm" >
                      <font-awesome-icon icon="window-close"
                         @click="deleteKusokPvh(row.item.kusokId)" title="Тапсырысты жою"/>
                    </b-button>
                </center>

            </template>
            <template v-slot:row-details="row">
                <b-card>
                    <h6>пвх - лар</h6>
                    <b-table striped hover :fields="pvhFields" table-variant="primary" 
                        :items="row.item.relDetails">
                        <template v-slot:cell(workInfo)="work">
                            {{ work.item.isDirect==1 ? 'Прямой': 'Обалный' + '-' +work.item.workName}}
                        </template>
                        <template v-slot:cell(isDone)="pvh">
                            {{pvh.item.isDone==2 ? 'Iстелген' : (pvh.item.isDone==1 ? 
                                'Iстелуде' : 'Iстелмеген') }}
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
                                        <font-awesome-icon icon="check" title=" ПВХ жабыстыру"/>
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
                    label: 'Тапсырыс саны'
                },
                {
                    key: 'userInfo',
                    label: 'Тұтынушы'
                },
                {
                    key: 'totalKusokPrice',
                    label: 'Барлық бағасы'
                },
                {
                    key: 'totalMetr',
                    label: 'Барлық мр'
                    
                },
                {
                    key: 'createdDate',
                    label: 'Уақыт',
                  
                },
                
                {
                    key: 'orderActions',
                    label: 'Әрекеттер',
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
                    label: 'Түрi'
                },
                {
                    key: 'colorName',
                    label: 'Түсi'
                },
                {
                    key: 'measureName',
                    label: 'Көлемi'
                },
                
                {
                    key: 'workInfo',
                    label: 'Жұмыс'
                },
                {
                    key: 'productCount',
                    label: 'Метр'
                },
                {
                    key: 'totalPrice',
                    label: 'Барлығы'
                },
                {
                    key: 'wareHouseName',
                    label: 'Қойма'
                },
                {
                    key: 'isDone',
                    label: 'Статус'
                
                },
                {
                    key: 'doneCount',
                    label: 'Жапсырған'
                
                },
                {
                    key: 'pvhActions',
                    label: 'Әрекеттер'
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
                this.$bvToast.toast("Жабсырған санды енгiзнiз !!!", {
                    title: 'Қате !!!',
                    autoHideDelay: 5000,
                    variant:'danger'
                });
                return ;
            }
            if(checker<doingCount){
                this.$bvToast.toast("Енгiзнiз сан терiс !!!", {
                    title: 'Қате !!!',
                    autoHideDelay: 5000,
                    variant:'danger'
                });
                item.doingCount=0;
                return ;          
            }

            let warn = confirm("Сіз сенімдісіз бе ?");
            if(warn){
                axios.post(apiDomain+'/admin/order/setdonecount',
                {'detailId':detailId,"doneCount":doingCount},{headers:getHeader()})
                .then((response)=>{
                    let rData=response.data;
                    let alertMsg = rData==='error' ? 'Қате шықты .' : 'Операция сәтті аяқталды.'
                    let variant = rData==='error' ? 'danger' : 'success';
                    this.$bvToast.toast(alertMsg, {
                        title: 'Ақпарат',
                        autoHideDelay: 5000,
                        variant:variant
                    });
                    this.tableRefresher();        
                })
                .catch(error => {
                    //console.log(error.message)
                    this.$bvToast.toast(error.message, {
                        title: 'қате',
                        autoHideDelay: 5000,
                        variant:"danger"
                    })
                })     
            }
        },
        deleteKusokPvh(kusokId){
            let warn = confirm("Сіз сенімдісіз бе ?");
            let dblWarn = confirm("Сіз шынымен сенімдісіз бе?");
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
                    let alertMsg = variant=='success' ? "Үйлдэл Жетістіктай үүслээ." 
                        : "Алдаа үүслээ та дахин оролдоно уу ."
                    this.showToast(alertMsg,variant);
                    this.tableRefresher(1);

                })
                .catch(error=>{
                    this.$bvToast.toast(
                        error.message,
                        {
                            title:"Қате туралы ақпарат",
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
                    title:"Ақпарат",
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
                    title: 'Қате туралы ақпарат',
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