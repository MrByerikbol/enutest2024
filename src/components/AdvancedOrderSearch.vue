<template>
    <b-row>
        <b-col lg="12">
             <b-row>
                <b-col lg="4">
                    <label class="w-100">
                        Тапсырыс жағдайы
                    </label>
                    <select
                        v-model="searchParams.delStatus"  
                        class="form-sm-control text-center w-100">
                        <option value=-1>--Барлық--</option>
                        <option value="0">Жаңа</option>
                        <option value="1">Iстелуде</option>
                        <option value="2">Iстелген</option>
                    </select>
                </b-col>
                <b-col lg="4">
                    <label class="w-100">
                        Тауарлар түрі
                    </label>
                    <select
                        v-model="searchParams.catId" 
                        class="form-sm-control text-center w-100">
                        <option value=0>--Таңдау--</option>
                        <option v-for="(c,index) in productCats" :key="index" :value="c.catId" >
                            {{c.catName}}
                        </option>
                    </select>
                </b-col>
                <b-col lg="4">
                    <label class="w-100">
                        Тауарлар түсі
                    </label>
                    <select
                        v-model="searchParams.colorId" 
                        class="form-sm-control text-center w-100">
                        <option value=0>--Таңдау--</option>
                        <option v-for="(c,index) in productColors" :key="index" :value="c.id">
                            {{c.colorName}}
                        </option>
                    </select>
                </b-col>
            </b-row>
            <b-row>
                <b-col lg="6">
                    <label class="w-100">
                        Несие жағдайы
                    </label>
                    <select
                        v-model="searchParams.loanType"  
                        class="form-sm-control text-center w-100">
                        <option value=0>--Барлыгы--</option>
                        <option value=1>Несиесiз</option>
                        <option value=2>Несиемен</option>
                    </select>
                </b-col>
                 <b-col lg="6">
                    <label class="w-100">
                        Төлем жағдайы
                    </label>
                    <select
                        v-model="searchParams.paymentType" 
                        class="form-sm-control text-center w-100">
                        <option value=0>--Барлыгы--</option>
                        <option value=1>Дайын</option>
                        <option value=2>Картбен</option>
                    </select>
                </b-col>
            </b-row>
            
        </b-col>
        <b-col lg="6">
            <b-form-group
                label="Iздеу"
                label-cols-sm="1"
                label-align-sm="left"
                label-size="sm"
                label-for="filterInput"
                class="mb-2 mt-3"
            >
                <b-input-group size="sm">
                    <b-form-input
                        v-model="advancedSearchFilter"
                        
                        id="filterInput"
                        placeholder="Iздеу"
                        @keyup="filterChange"
                        @change="filterChange"
                    ></b-form-input>
                    <b-button size="sm" class="ml-3"  @click="doAdvancedSearch">
                         {{searching ? 'Кеңейтілген іздеу жасалуда...':'Кеңейтілген іздеу жаса'}} 
                    </b-button>
                </b-input-group>
            </b-form-group>
        </b-col>
        
        <b-col lg="6" class="pt-3 text-right">
            <strong>Тапсырыс саны:</strong> {{totalRowsOfSearch}}  
        </b-col>
        <!-- <b-col lg="3" class="pt-3 text-right">
            <b-button block size="sm" @click="getStatisticInfo" :disabled="beginDate==''" variant="success">
                Статистика көру    
            </b-button>  
        </b-col> -->
        <b-col lg="12" class="pb-2" v-if="isStatistic">
            <b-row>
                <b-col lg="2"></b-col>
                <b-col lg="2" class="text-right"><strong>Тауар түрі</strong></b-col>
                <b-col lg="2" class="text-right"><strong>Тауар саны</strong></b-col>
                <b-col lg="2" class="text-right"><strong>Тауар</strong></b-col>
                <b-col lg="2" class="text-right"><strong>Жумыс</strong></b-col>
                <b-col lg="2" class="text-right"><strong>Барлығы</strong></b-col>
            </b-row>
            <b-row  v-for="(s,sIndex) in statisticInfo" :key="sIndex">
                <b-col lg="2"></b-col>
                <b-col lg="2" class="text-right">
                    {{(s.catName=='PVH' || s.catName=='kusokPVH')
                     ? s.catName=='PVH' ? 'ПВХ' : ' КУСОК ПВХ' 
                     : s.catName }}
                </b-col>
                <b-col lg="2" class="text-right">{{s.productCount}}</b-col>
                <b-col lg="2" class="text-right">{{s.totalOrderPrice}}</b-col>
                <b-col lg="2" class="text-right">{{s.workPrice}}</b-col>
                <b-col lg="2" class="text-right">{{s.workPrice+s.totalOrderPrice}}</b-col>
            </b-row>
            <b-row>
                <b-col lg="12"><hr></b-col>
            </b-row>
            <b-row>
                
                <b-col lg="4"></b-col>
                <b-col lg="4" class="text-right text-info">Тауар # :<strong>{{productSum}}</strong></b-col>
                <b-col lg="2" class="text-right text-danger">Жумыс # :<strong>{{workSum}}</strong></b-col>

                <b-col lg="2" class="text-right">Барлық # :<strong>{{genSum}}</strong></b-col>
            </b-row>
        </b-col>
        <b-table 
            responsive
            small 
            ref="advancedOrderSearchTable"
            striped hover 
            :items="advancedOrderSearchProvider" 
            :fields="advancedFields"
            :busy.sync="isBusy"
            :current-page="currentPageAdvanced"
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
            <template v-slot:cell(orderActions)="row">
                <center>
                    <b-button @click="row.toggleDetails" 
                        variant="outline-success" class="mr-1" size="sm"   >
                        <font-awesome-icon icon="list" title="ЛДСП көру"/>
                    </b-button>
                </center>
                
            </template>
            <template v-slot:cell(orderDate)='regInfo'>
                <div class="text-center">
                    {{regInfo.item.orderDate}}<br>  
                    <small><strong>{{regInfo.item.regUserInfo}}</strong></small>  
                </div>
            </template>
            <template v-slot:cell(delStatus)="row">
                <span v-if="row.item.delStatus==0">Жаңа</span>
                <span v-if="row.item.delStatus==1">Iстелуде</span>
                <span v-if="row.item.delStatus==2">Iстелген</span>
            </template>
            <template v-slot:row-details="row">
                <b-card>
                    <b-row>
                        <b-col lg="6">
                            <h6>ЛДСП лер</h6>
                        </b-col>
                    </b-row>
                    <b-table
                     striped 
                     :fields="listFields" responsive hover table-variant="warning" :items="row.item.deliveryProducts">
                        <template v-slot:cell(listActions)="row">
                            <center>
                                <b-button 
                                @click="row.toggleDetails"
                                :disabled="row.item.relDetails.length>0 ? false : true " 
                                variant="outline-warning" class="mr-1" size="sm"   >
                                <font-awesome-icon icon="list" title="Пвх жабу"/>
                                </b-button>
                            </center>
                        </template>
                        
                        <template v-slot:cell(pvhCount)="row">
                            {{row.item.relDetails.length}}
                        </template>
                        <template v-slot:cell(isDone)="row">
                            {{row.item.isDone==0 ? 'Iстелмеген' : 'Iстелген'}}
                        </template>
                        <template v-slot:cell(listSlicers)="row">
                            <span class="text-danger" v-if="row.item.listUsers.length==0">
                            Кесушiлер тандамаган
                            </span>
                            <div style="clear:left;" class="w-100 ">
                                <b-badge :variant="user.isActive==1 ? 'primary' : 'danger' " class="ml-1" style="cursor:pointer;" 
                                    v-for="(user,userIndex) in row.item.listUsers" 
                                    :key="userIndex">
                                    {{user.relUserInfo + ' ('+user.confirmedDoneCount+')'}}    
                                </b-badge>
                            </div>
                        </template>
                        <!-- pvh jagaaslt -->
                        <template v-slot:row-details="row">
                            <b-card>
                                <h6>пвх - нууд</h6>
                                <b-table striped hover responsive :fields="pvhFieldsDone" table-variant="danger" 
                                    :items="row.item.relDetails">
                                    <template v-slot:cell(totalPrice)="t">
                                        {{t.item.totalPrice+(t.item.productCount*t.item.workPrice)}}
                                    </template>
                                    <template v-slot:cell(isDone)="row">
                                        {{row.item.isDone==0 ? 'Iстелмеген' : 'Iстелген'}}
                                    </template>
                                    <template v-slot:cell(listGluers)="gluer">
                                        <span class="text-danger" v-if="gluer.item.listUsers.length==0">
                                            Жабсырушы тандамаган
                                        </span>
                                        <div style="clear:left;" class="w-100 ">
                                            <b-badge :variant="user.isActive==1 ? 'primary' : 'danger' " class="ml-1" style="cursor:pointer;" 
                                                v-for="(user,userIndex) in gluer.item.listUsers" :key="userIndex">
                                                {{user.relUserInfo + ' ('+user.confirmedDoneCount+')'}}    
                                            </b-badge>
                                        </div>
                                    </template>
                                </b-table>
                                <b-row>
                                <b-col lg="12" class="text-right py-2">
                                    <b-button size="sm" variant="danger" @click="row.toggleDetails">Пвх жабу</b-button>
                                </b-col>
                                </b-row>
                            </b-card>
                        </template>
                    </b-table>
                    <b-row>
                        <b-col lg="12" class="text-right py-2">
                            <b-button size="sm" variant="danger" @click="row.toggleDetails">ЛДСП жабу</b-button>
                        </b-col>
                    </b-row>
                </b-card>
            </template>
        </b-table>
        <b-pagination
            v-model="currentPageAdvanced"
            :total-rows="totalRowsOfSearch"
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
    const moment = require('moment')
    require('moment/locale/es')
    export default {
        data(){
            return {
                statisticInfo:[],
                totalRowsOfSearch  : 0,
                advancedSearchFilter:"",
                isSmall:true,
                advancedFields: [
                    {
                        key: 'orderNumber',
                        label: 'Тапсырыс саны',
                        variant: 'primary'
                    },
                    {
                        key: 'userInfo',
                        label: 'Тұтынушы',
                        variant: 'danger'
                    },
                    {
                        key: 'totalProductPrice',
                        label: 'Тапсырыс сомасы',
                        variant: 'success'
                    },
                    {
                        key: 'takenCostByCash',
                        label: 'Дайын',
                        variant: 'warning'
                    },
                    {
                        key: 'takenCostByCard',
                        label: 'Картбен',
                        variant: 'primary'
                    },
                    {
                        key: 'deliveryLoan',
                        label: 'Несие',
                        variant: 'danger'
                    },
                    {
                        key: 'delStatus',
                        label: 'Статус',
                        variant: 'warning'
                    },
                    {
                        key: 'orderDate',
                        label: 'Уақыт,Тiркеушi',
                        variant: 'info'
                    },
                    {
                        key: 'orderActions',
                        label: 'Әрекеттер',
                        align:'center'
                    }
                ],
                listFields: [
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
                        key: 'productCount',
                        label: 'Саны'
                    },
                    {
                        key: 'doneCount',
                        label: 'Iстегенi'
                    },
                    {
                        key: 'leftCount',
                        label: 'Қалғаны'
                    },
                    {
                        key: 'productPrice',
                        label: 'Бағасы'
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
                        key: 'pvhCount',
                        label: 'ПВХ'
                    },
                    {
                        key: 'isDone',
                        label: 'Статус'
                    
                    },
                    {
                        key: 'listSlicers',
                        label: 'Кесушiлер',
                        variant:"warning"
                    },
                    {
                        key: 'listActions',
                        label: 'Әрекеттер'
                    }
                ],
                
                pvhFieldsDone: [
                    {
                        key: 'catName',
                        label: 'Түрі'
                    },
                    {
                        key: 'colorName',
                        label: 'Түсі'
                    },
                    {
                        key: 'measureName',
                        label: 'Көлемі'
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
                        key: 'listGluers',
                        label: 'Жабсырушылар',
                        variant:"primary"
                    
                    }
                ],
                isBusy:false,
                
                currentPageAdvanced:1,
                perPage: 33,
                tableVariant:'light',
                productCats:[],
                productColors:[],

                searchParams:{
                    loanType:0,
                    paymentType:0,

                    catId : 0,
                    colorId :0,
                    delStatus:-1
                },
                productSum : 0,
                workPriceSum :0,
                genSum:0,
                searching:false,
                calculating:false
            }
        },
        props:['tabIndex','beginDate','endDate'],
        name : "AdvancedOrderSearch" ,
       
        methods:{
            getStatisticInfo(){
                //alert("duudagdav");
                this.calculating=true;
                let ctx = new Object();
                ctx.filter=this.advancedSearchFilter;
                ctx.searchParams=this.searchParams;
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
                axios.post(apiDomain+'/admin/order/getadvancedsearchstatistic',
                ctx,{headers:getHeader()})
                .then(response=>{
                    this.statisticInfo=response.data;
                    this.productSum = this.statisticInfo
                    .map(o=>o.totalOrderPrice)
                    .reduce((acc,c)=>acc+c);
                    this.calculating=false;
                    this.workSum = this.statisticInfo
                    .map(o=>o.workPrice)
                    .reduce((acc,c)=>acc+c);
                    //eronhii niit dun 
                    this.genSum=this.productSum+this.workSum;

                    this.calculating=false;
                })
                .catch(() => {
                    this.calculating=false;
                    this.searching=false;
                    //alert(error.message);
                    this.genSum=0;
                }) 
            },
            doAdvancedSearch(){
                this.$refs.advancedOrderSearchTable.refresh();
            },
            filterChange(){
                if(this.advancedSearchFilter.trim().length==0)
                    this.$refs.advancedOrderSearchTable.refresh();
            },
            advancedOrderSearchProvider(ctx){
                this.searching=true;
                if(Number(this.tabIndex)!=3){
                    return ;
                }
                //for statistic stuff
                this.getStatisticInfo();

                ctx.filter=this.advancedSearchFilter;
                ctx.searchParams=this.searchParams;
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
                let promise = axios.post(apiDomain+'/admin/order/advancedordersearch',ctx,{headers:getHeader()});
                return promise.then((response) => {
                    const result = response.data;
                    this.isBusy = false;
                    this.totalRowsOfSearch=result.gridData.recordCount;
                    
                    this.searching=false;
                    return(result.gridData.items)
                }).catch(error => {
                    this.calculating=false;
                    this.searching=false;
                    this.$bvToast.toast(error.message, {
                    title: 'Қате туралы ақпарат',
                    autoHideDelay: 5000,
                    variant:"danger"
                })  
                this.isBusy = false
                    return []
                })
            },
            getRefs(type){
                axios.get(apiDomain+'/admin/delivery/refs/'+type,{headers:getHeader()})
                .then(response=>{
                    if(type==7){
                        this.productCats=response.data;
                    }
                    if(type==11){
                        this.productColors=response.data;
                    }
                })
                .catch(error => {
                    alert(error.message);
                }) 
            }
        },
        created(){
            this.getRefs(7);    
            this.getRefs(11);    
        },
        computed:{
            isStatistic:function(){
                if(this.beginDate==''){
                    this.statisticInfo=[];
                    this.genSum=0;
                    return false;
                }
                return true;
            }
        }
    }
</script>