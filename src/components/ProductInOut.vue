<template>
    <div class="row">
         <b-modal 
            size="lg" 
            id="inOutModal" 
            :title="productName=='' ? 'Барааны орлога зарлагын түүх' : productName + ' : орлога зарлагын түүх'"

            ref="inOutModal"
            @hide="onInOutHide"
            hide-footer>
            <div>
                <b-tabs 
                    content-class="mt-3" 
                    justified
                    active-nav-item-class="font-weight-bold text-uppercase text-primary"
                   
                    >
                    <b-tab title="Агуулхад орлогодосон түүх" active>
                         <b-form-row>
                            <b-col lg="4">
                                <select v-if="productName!=''" disabled class="form-control mt-2" v-model="wareHouseId">
                                    <option value=0>
                                        ---Бүх склад---
                                    </option>
                                    <option 
                                        v-for="(w,index) in wareHouses"
                                        :key="index" :value="w.wareHouseId">
                                        {{w.wareHouseName}}
                                    </option>
                                </select>
                                <select v-if="productName==''"  class="form-control mt-2" v-model="wareHouseId">
                                    <option value=0>
                                        ---Бүх склад---
                                    </option>
                                    <option 
                                        v-for="(w,index) in wareHouses"
                                        :key="index" :value="w.wareHouseId">
                                        {{w.wareHouseName}}
                                    </option>
                                </select>
                            </b-col> 
                            <b-col lg="4" class="pt-2">
                                <datepicker format="yyyy-MM-dd" 
                                    :clear-button="true" 
                                    @cleared="iBeginDate='';iEndDate=''" 
                                    input-class="form-control w-75 d-inline"
                                    v-model="iBeginDate"
                                    id="iBeginDate"
                                    :language="kk"
                                    placeholder="Эхний өдөр">
                                </datepicker>
                            </b-col>
                            
                            <b-col lg="4" md="3" class="pt-2">
                                <datepicker format="yyyy-MM-dd" 
                                    :clear-button="true" 
                                    @cleared="iEndDate=''" 
                                    input-class="form-control w-75 d-inline"
                                    v-model="iEndDate"
                                    id="iEndDate"
                                    :language="kk"
                                    placeholder="Сүүлийн өдөр">
                                </datepicker>
                            </b-col>
                            
                        </b-form-row>
                        <b-form-row class="my-3">
                            <b-col lg="6">
                                <b-form-input v-if="productName==''"
                                    v-model="filterDetail"
                                    type="search"
                                    id="filterInputDetail"
                                    placeholder="Хайлт хийх утгаа оруулна уу"
                                ></b-form-input>
                            </b-col>
                            <b-col lg="2" class="pt-3 text-right">
                                <strong>тоо:</strong> {{totalRowsDetail}}  
                            </b-col>
                            <b-col lg="4" class="pt-3 text-right">
                                <strong>Зарлага хийсэн нийт үнэ:</strong> <br>{{sumOfchargeProductPrice}}   
                            </b-col>
                            <b-col lg="4" class="mt-2">
                                <button v-if="iBeginDate!='' && iEndDate!=''" type="button" @click="getHistory(1)" class="btn btn-primary btn-sm mt-2">Шүүх</button>
                            </b-col>
                            <b-col lg="8" class="text-right mt-2 text-primary">
                                <strong>Нийт орлогодосон тоо:</strong> {{sumOfchargeProductCount}}
                            </b-col>
                         </b-form-row>
                         <b-form-row>
                            <b-table 
                                ref="chargeOffHistoryTable"
                                striped hover selectable
                                :items="chargeInProvider" 
                                responsive
                                small
                                :fields="chargeInFields"
                                :busy.sync="isBusyDetail"
                                :current-page="currentPageDetail"
                                :per-page="perPageDetail"
                                :table-variant="'info'"
                                :filter="filterDetail"
                                :select-mode="'multi'"
                                selected-variant="danger"
                            >
                                
                                <template v-slot:table-busy>
                                    <div class="text-center text-info my-2">
                                        <b-spinner class="align-middle"></b-spinner>
                                        <strong>Жүктелуде...</strong>
                                    </div>
                                </template>
                                
                            </b-table>
                            <b-pagination
                                v-model="currentPageDetail"
                                :total-rows="totalRowsDetail"
                                :per-page="perPageDetail"
                                align="fill"
                                size="sm"
                                class="my-0"
                                
                            ></b-pagination>    
                         </b-form-row>
                    </b-tab>
                    <b-tab title="Агуулахаас зарлагадсан түүх">
                        <b-form-row>
                            <b-col lg="4">
                                <select v-if="productName!=''"
                                    disabled class="form-control mt-2" v-model="wareHouseOffId">
                                    <option value=0>
                                        ---Бүх склад---
                                    </option>
                                    <option 
                                        v-for="(w,index) in wareHouses"
                                        :key="index" :value="w.wareHouseId">
                                        {{w.wareHouseName}}
                                    </option>
                                </select>
                                <select v-if="productName==''"  class="form-control mt-2" v-model="wareHouseOffId">
                                    <option value=0>
                                        ---Бүх склад---
                                    </option>
                                    <option 
                                        v-for="(w,index) in wareHouses"
                                        :key="index" :value="w.wareHouseId">
                                        {{w.wareHouseName}}
                                    </option>
                                </select>
                            </b-col> 
                            <b-col lg="4" class="pt-2">
                                <datepicker format="yyyy-MM-dd" 
                                    :clear-button="true" 
                                    @cleared="oBeginDate='';oEndDate=''" 
                                    input-class="form-control w-75 d-inline"
                                    v-model="oBeginDate"
                                    id="oBeginDate"
                                    :language="kk"
                                    placeholder="Эхний өдөр">
                                </datepicker>
                            </b-col>
                            
                            <b-col lg="4" md="3" class="pt-2">
                                <datepicker format="yyyy-MM-dd" 
                                    :clear-button="true" 
                                    @cleared="oEndDate=''" 
                                    input-class="form-control w-75 d-inline"
                                    v-model="oEndDate"
                                    id="oEndDate"
                                    :language="kk"
                                    placeholder="Сүүлийн өдөр">
                                </datepicker>
                            </b-col>
                            
                        </b-form-row>
                        <b-form-row class="my-3">
                            <b-col lg="6">
                                <b-form-input v-if="productName==''"
                                    v-model="filterOff"
                                    type="search"
                                    id="filterInputOff"
                                    placeholder="Хайлт хийх утгаа оруулна уу"
                                ></b-form-input>
                            </b-col>

                            <b-col lg="2" class="pt-3 text-right">
                                <strong>тоо:</strong> {{totalRowsOff}}  
                            </b-col>
                            <b-col lg="4" class="pt-3 text-right">
                                <strong>Зарлага хийсэн нийт үнэ:</strong> <br>{{sumOfchargeOffProductPrice}}   
                            </b-col>
                            <b-col lg="4" class="mt-2">
                                <button v-if="oBeginDate!='' && oEndDate!=''" type="button" @click="getHistory(2)" class="btn btn-danger btn-sm mt-2">Шүүх</button>
                            </b-col>
                            <b-col lg="8" class="text-right mt-2 text-danger">
                                <strong>Нийт зарлагадсан тоо:</strong> {{sumOfchargeOffProductCount}}
                            </b-col>
                         </b-form-row>
                         <b-form-row>
                            <b-table 
                                responsive
                                small
                                ref="outHistoryTable"
                                striped hover selectable
                                :items="chargeOutProvider" 

                                :fields="chargeOutFields"
                                :busy.sync="isBusyOff"
                                :current-page="currentPageOff"
                                :per-page="perPageOff"
                                :table-variant="'danger'"
                                :filter="filterOff"
                                :select-mode="'single'"
                                selected-variant="danger"
                            >
                                
                                <template v-slot:table-busy>
                                    <div class="text-center text-info my-2">
                                        <b-spinner class="align-middle"></b-spinner>
                                        <strong>Жүктелуде...</strong>
                                    </div>
                                </template>
                                
                            </b-table>
                            <b-pagination
                                v-model="currentPageOff"
                                :total-rows="totalRowsOff"
                                :per-page="perPageOff"
                                align="fill"
                                size="sm"
                                class="my-0"
                                
                            ></b-pagination>    
                         </b-form-row>
                    </b-tab>
                    
                </b-tabs>
            </div>
         </b-modal>
    </div>
</template>

<script>
import axios from 'axios';

import {apiDomain,getHeader} from "../config/config";
import Datepicker from 'vuejs-datepicker';
import {kk} from 'vuejs-datepicker/dist/locale'
const moment = require('moment')
require('moment/locale/es')
    export default {
        name: "ProductInOut",
        components:{
            Datepicker,
            
        },
       
        data(){
            return {
                kk:kk,
                iBeginDate : "",
                iEndDate : "",

                oBeginDate : "",
                oEndDate: "",

                //begining of the in product list
                chargeInFields: [
                    {
                        key: 'catName',
                        label: 'Төрөл',
                    },
                    {
                        key: 'productName',
                        label: 'Барааны нэр',
                    },
                    {
                        key: 'measureName',
                        label: 'Хэмжээ',
                    },
                    {
                        key: 'productPrice',
                        label: 'Үнэ',
                    },
                    {
                        key: 'productCount',
                        label: 'Барааны тоо',
                    },
                    {
                        key: 'totalPrice',
                        label: 'Нийт үнэ',
                    },
                    {
                        key: 'chargeDate',
                        label: 'Татсан огноо',
                    },
                    {
                        key: 'createdDate',
                        label: 'Үүссэн огноо',
                    }
                ],
                isBusyDetail:false,
                totalRowsDetail:0,
                currentPageDetail: 1,
                perPageDetail: 20,
                tableVariantDetail:'light',
                filterDetail:"",
                sumOfchargeProductPrice:0,
                sumOfchargeProductCount:0,
                //begining of the chargeoff list
                
                chargeOutFields: [
                     {
                        key: 'catName',
                        label: 'Төрөл',
                    },
                    {
                        key: 'productName',
                        label: 'Барааны нэр',
                    },
                    {
                        key: 'measureName',
                        label: 'Хэмжээ',
                    },
                    {
                        key: 'productPrice',
                        label: 'Үнэ',
                    },
                    {
                        key: 'productCount',
                        label: 'Барааны тоо',
                    },
                    {
                        key: 'totalPrice',
                        label: 'Нийт үнэ',
                    },
                    {
                        key: 'chargeOffDate',
                        label: 'Зарсан огноо',
                    },
                    {
                        key: 'createdDate',
                        label: 'Үүссэн огноо',
                    }
                ],
                isBusyOff:false,
                totalRowsOff:0,
                currentPageOff: 1,
                perPageOff: 20,
              
                filterOff:"",
                sumOfchargeOffProductPrice:0,
                sumOfchargeOffProductCount:0
            }
        },
        methods:{
            getHistory(p){
                
                if(p==1){
                    //alert("now it will search ");
                    this.$refs.chargeOffHistoryTable.refresh();
                }
                if(p==2){
                    //alert("now it will search ");
                    this.$refs.outHistoryTable.refresh();
                }
            },
            onInOutHide(){
                this.filterDetail="";
                this.iBeginDate="";
                this.iEndDate="";
                this.wareHouseId=0;
                this.sumOfchargeProductPrice=0;
                this.totalRowsDetail=0;

                this.filterOff="";
                this.oBeginDate="";
                this.oEndDate="";
                this.wareHouseOffId=0;

                this.sumOfchargeOffProductPrice=0;

                this.totalRowsOff=0;

                this.sumOfChargeProductCount=0;
                this.sumOfChargeOffProductCount=0;


            },
            chargeInProvider(ctx){
                //alert(this.iBeginDate + " " +this.iEndDate);
                if(this.iBeginDate!="" && this.iEndDate!=""){
                    //alert(this.productName);
                    ctx.filter = this.productName!="" ? this.productName : this.filterDetail;

                    //alert("yes");
                    ctx.wareHouseId=this.wareHouseId;
                    ctx.beginDate=moment(this.iBeginDate).format('YYYY-MM-DD');
                    ctx.endDate=moment(this.iEndDate).format('YYYY-MM-DD');

                    this.isBusyDetail = false;
                    let promise = axios.post(apiDomain+'/admin/bay_warehouse/chargelist',ctx,{headers:getHeader()});
                    return promise.then((response) => {
                        const result = response.data;
                        this.isBusyDetail = false
                        this.totalRowsDetail=result.dataList.recordCount;
                        this.sumOfchargeProductPrice = result.sumOfPrice;
                        this.sumOfchargeProductCount=result.sumOfProductCount;
                        return(result.dataList.items);
                    }).catch(error => {
                        this.isBusyDetail = false;
                        alert(error.message);
                        return []
                    })
                }
            },

            chargeOutProvider(ctx){
                //alert(this.iBeginDate + " " +this.iEndDate);
                if(this.oBeginDate!="" && this.oEndDate!=""){
                    //alert(this.productName);
                    ctx.filter = this.productName!="" ? this.productName : this.filterOff;

                    //alert("yes");
                    ctx.wareHouseId=this.wareHouseOffId;
                    ctx.beginDate=moment(this.oBeginDate).format('YYYY-MM-DD');
                    ctx.endDate=moment(this.oEndDate).format('YYYY-MM-DD');

                    this.isBusyOff = false;
                    let promise = axios.post(apiDomain+'/admin/bay_warehouse/chargeoutlist',ctx,{headers:getHeader()});
                    return promise.then((response) => {
                        const result = response.data;
                        this.isBusyOff = false
                        this.totalRowsOff=result.dataList.recordCount;

                        this.sumOfchargeOffProductPrice = result.sumOfPrice;
                        this.sumOfchargeOffProductCount=result.sumOfProductCount;

                        return(result.dataList.items);
                    }).catch(error => {
                        this.isBusyOff = false
                        alert(error.message);
                        return []
                    })
                }
            }
        },
        props:[
            'pChoosenWareHouseId',
            'pWareHouses',
            'pProductName',
            'pChoosenOffWareHouseId'
        ],
        computed:{
            wareHouseId:{
                get(){
                    return this.pChoosenWareHouseId;
                },
                set(newVal){
                    //alert("new value "+newVal);
                    this.pChoosenWareHouseId=newVal;
                }
            },
            wareHouseOffId:{
                get(){
                    //alert(this.pChoosenOffWareHouseId);
                    return this.pChoosenOffWareHouseId;
                },
                set(newVal){
                    //alert("new value "+newVal);
                    this.pChoosenOffWareHouseId=newVal;
                }
            },
            wareHouses:function(){
                return this.pWareHouses;
            },
            productName:function(){
                return this.pProductName;
            }
        }
    }
</script>