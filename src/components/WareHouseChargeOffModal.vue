<template>
    <div class="row">
        <b-modal 
            size="lg" 
            
            id="chargeOffModal" 
            :title="''+wareHouseName+' агуулахаас бараа зарлагдах'"
            ref="chargeOffModal"
            @hide="onChargeOffModalHide"
            hide-footer>
            <b-form v-on:submit.prevent="chargeOffWareHouseProduct" >
                <b-form-row class="mb-3">
                    <b-col lg="4" sm="auto" md="3">
                        <label for="productCat">Төрөл</label>
                        <select v-model="catId" @change="catChange" class="form-control">
                            <option value=0>--сонгох--</option>
                            <option v-for="(c ,i) in comProductCats" :value=c.catId :key="i">
                                {{c.catName}}
                            </option>
                        </select>
                    </b-col>
                    <b-col lg="4" sm="auto" md="4">
                        <label class="mr-sm-2" >Өнгө сонгох</label>
                        <model-list-select
                            :list="productColors"
                            option-value="id"
                            option-text="name"
                            v-model="selectedColor"
                            placeholder="Өнгө сонгох"
                            @searchchange="searchColor"
                            :isDisabled="catId==0 ? true : false"
                        >
                        </model-list-select>
                    </b-col>
                    <b-col lg="4" sm="auto" md="3">
                        <label for="productCat">Хэмжээ</label>
                        <select @change="findProduct" :disabled=" !selectedColor.id ? true : false " v-model="measureId" class="form-control">
                            <option value=0>--сонгох--</option>
                            <option v-for="(c ,i) in productFilteredMeasures" :value=c.id :key="i">
                                {{c.measureName}}
                            </option>
                        </select>
                    </b-col>
                    
                </b-form-row>
                <b-form-row class="mb-3" >
                    <b-col sm="auto" lg="4" md="4">
                        <label class="mr-sm-2" for="productChargePrice">Барааны үнэ</label>
                        <b-form-input
                            id="productChargePrice"
                            v-model="selectedProduct.productOutPrice"
                            type="number"
                            
                        ></b-form-input>
                    </b-col>
                    <b-col sm="auto" lg="4" md="4">
                        <label class="mr-sm-2" for="productCount">Барааны тоо</label>
                        <b-form-input
                            id="productCount"
                            v-model="chargeOff.productCount"
                            type="number"
                            
                        ></b-form-input>
                    </b-col>
                    <b-col sm="auto" lg="4" md="4">
                        <label class="mr-sm-2" for="chargeOffTotalPrice1">Нийт үнэ</label>
                        <input type="number"
                            id="chargeOffTotalPrice1"
                            v-model="chargeOffTotalPrice"
                            class="form-control"
                            disabled 
                        />
                    </b-col>
                    
                </b-form-row>
                <b-form-row>
                    <b-col lg="6" class="pt-2">
                        <datepicker format="yyyy-MM-dd" 
                            :clear-button="true" 
                            @cleared="chargeOff.chargeOffDate=''" 
                            input-class="form-control w-75 d-inline"
                            v-model="chargeOff.chargeOffDate"
                            id="datePickerInput"
                            :language="kk"
                            placeholder="Бараа зарлагадсан огноог оруулна уу"></datepicker>
                    </b-col>
                    
                    <b-col lg="6" md="3" class="pt-2">
                        <b-button @click="chargeOffProduct" v-if="selectedProduct.id && 
                            selectedProduct.id>0"
                            class="btn-block" variant="danger">
                            Барааг агуулахаас зарлагдах 
                        </b-button>
                    </b-col>
                </b-form-row>

                
                <b-form-row class="mb-1 mt-3">
                    <b-col lg="6">
                        <input
                            v-model="filterDetail"
                            type="search"
                            id="filterInputDetail"
                            placeholder="Хайлт хийх утгаа оруулна уу"
                            class="form-control" size="sm">
                        
                    </b-col>
                  
                    <b-col lg="12" class="pb-3 text-right text-info">
                        <b-form-row>
                            <b-col lg="5" class="pt-3 text-right">
                                <strong>Зарлага хийсэн нийт үнэ:</strong> {{recentSumOfProductPrice}}  
                            </b-col>  
                            <b-col lg="4" class="pt-3 text-right">
                                <strong>Нийт тоо:</strong>  {{recentSumOfProductCount}}  
                            </b-col>
                            <b-col lg="3" class="pt-3 text-right">
                                <strong>Бичлэг:</strong>{{totalRowsDetail}}
                            </b-col>
                        </b-form-row>    
                      
                        
                    </b-col>
                    
                    <b-table 
                        ref="chargeOffTable"
                        striped hover selectable
                        :items="detailProvider" 

                        :fields="chargeOffFields"
                        :busy.sync="isBusyDetail"
                        :current-page="currentPageDetail"
                        :per-page="perPageDetail"
                        :table-variant="'info'"
                        :filter="filterDetail"
                        :select-mode="'multi'"
                        selected-variant="active"
                    >
                        
                        <template v-slot:table-busy>
                            <div class="text-center text-info my-2">
                                <b-spinner class="align-middle"></b-spinner>
                                <strong>Ачаалж байна...</strong>
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
            </b-form>    
        </b-modal>    
    </div>    
</template>
<script>
    import axios from 'axios';
    import {apiDomain,getHeader} from "../config/config";
    import { ModelListSelect } from 'vue-search-select'
    import Datepicker from 'vuejs-datepicker';
    import {kk} from 'vuejs-datepicker/dist/locale'
    const moment = require('moment')
    require('moment/locale/es')
    export default {
        components:{
            Datepicker,
            ModelListSelect,
            
        },
        name: "WareHouseChargeOffModal",
        props:[
            'choosenWareHouseName',
            'choosenWareHouseId',
            'productCats',
            'productMeasures'
        ],
        data(){
            return {
                kk:kk,
                products:[],
                selectedProduct:{},
                
                catId : 0,
                colorId : 0,
                measureId:0,
              
                isColorDisabled : true,
                productColors : [],
                selectedColor:{},
               
                //begining of the ware house chargeoff product list
                chargeOffFields: [
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
                recentSumOfProductPrice:0,
                recentSumOfProductCount:0,

                chargeOff:{
                    wareHouseId : 0,
                    productCount:0,
                    chargeOffDate : "",
                    productId:0,
                    productPrice:0,
                    
                },
                productFilteredMeasures:[]
            }
        },
        methods:{
            catChange(){
                if(this.catId>0){
                    this.productFilteredMeasures=this.comProductMeasures.filter(m=>m.catId===this.catId);
                }
                this.findProduct();
            },
            searchColor(searchText){
                if(this.wareHouseId>0 && searchText.trim().length>0){
                    this.measureId=0;
                   
                    this.selectedColor={};
                    axios.get(apiDomain+'/admin/delivery/searchcolor/'+this.wareHouseId+'/'+searchText,{headers:getHeader()})
                    .then(response=>{
                        //this.$refs.wareHouseTable.refresh();  
                        this.productColors=response.data;
                        
                    })
                    .catch(error => {
                        //console.log(error.message)
                        this.$bvToast.toast(error.message, {
                            title: 'алдаа',
                            autoHideDelay: 5000
                        })
                    })     
                }
                
            },
            findProduct(){
                //alert("came here");
                if(this.catId > 0 && this.selectedColor.id>0 && this.measureId>0){
                    let findJSON  = {
                        catId : this.catId,
                        colorId : this.selectedColor.id,
                        measureId : this.measureId

                    };
                    axios.post(apiDomain+'/admin/bay_warehouse/findproduct',findJSON,{headers:getHeader()})
                    .then(response=>{
                        
                        if(!response.data){
                            this.selectedProduct={};
                            this.productCount=0;
                        }   
                        else{
                            //alert(JSON.stringify(response.data));
                            this.selectedProduct=response.data;
                        } 
                        
                    })
                    .catch(error => {
                        //console.log(error.message)
                        this.$bvToast.toast(error.message, {
                            title: 'алдаа',
                            autoHideDelay: 5000,
                            variant:'danger'
                        })
                    });     
                }
                else{
                    this.selectedProduct= {};
                    this.productCount=0;
                }
            },
            chargeOffProduct(){
                if(confirm("Та итгэлтэй байна уу ?")){
                    if(this.selectedProduct.id 
                            && this.selectedProduct.id>0){
                        let dbChargeOffDate = null;
                        

                        if(this.chargeOff.chargeOffDate!=""){
                            dbChargeOffDate=moment(this.chargeOff.chargeOffDate).format('YYYY-MM-DD');
                        }
                        
                        if(this.wareHouseId>0 && dbChargeOffDate!=null && this.chargeOffTotalPrice>0){
                             
                            this.chargeOff.chargeOffDate = dbChargeOffDate;
                            this.chargeOff.wareHouseId =this.wareHouseId;
                            this.chargeOff.productId = this.selectedProduct.id;
                            this.chargeOff.productPrice = this.selectedProduct.productOutPrice;
                            axios.post(apiDomain+'/admin/delivery/chargeoffwarehouse',this.chargeOff,
                                {headers:getHeader()})
                            .then(response=>{
                                this.products=[];
                                //this.$refs.wareHouseTable.refresh();  
                                let result = response.data;
                                let responseText=null;

                                if("success"==result){
                                    responseText="Операция сәтті аяқталды."
                                    this.selectedProduct=null;
                                   
                                    this.chargeOff={
                                        wareHouseId : 0,
                                        productCount:0,
                                        chargeOffDate : "",
                                        productId:0 ,
                                        productPrice:0   
                                    }
                                    this.$bvToast.toast(responseText, {
                                        title: 'Мэдээлэл',
                                        autoHideDelay: 5000,
                                        variant:"success"
                                    })
                                    this.$refs.chargeOffTable.refresh();
                                }
                                else{
                                    responseText="Алдаа үүслээ дахиж оролдоно уу."
                                    this.$bvToast.toast(responseText, {
                                        title: 'Мэдээлэл',
                                        autoHideDelay: 5000,
                                        variant:"danger"
                                    })
                                }

                                this.catId=0;
                                this.measureId=0;
                              
                                this.productColors=[];
                                this.selectedColor={};
                                this.selectedProduct={};
                            })
                            .catch(error => {
                                //console.log(error.message)
                                this.$bvToast.toast(error.message, {
                                    title: 'алдаа',
                                    autoHideDelay: 5000,
                                    variant:'danger'
                                })
                            }) 
                            
                            

                        }
                        else{
                            this.$bvToast.toast('Та бүх талбаруудыг бөглөнө үү', {
                                title: 'алдаа',
                                autoHideDelay: 5000,
                                variant:'danger'
                            })
                        }

                    }
                    else{
                        this.$bvToast.toast('Та таталт хийх барааг хайж олно уу', {
                            title: 'алдаа',
                            autoHideDelay: 5000
                        })    
                    }
                }
            },
            onChargeOffModalHide(){
                axios.post(apiDomain+'/admin/bay_warehouse/to_old/',
                {'wareHouseId':this.wareHouseId , type:'out'},{headers:getHeader()});
                //refresh the main things 
                this.$emit("refreshTrigger");

            },
            
           
            detailProvider(ctx){
                //alert("yes");
                if(this.wareHouseId>0){
                    //alert("yes");
                    ctx.wareHouseId=this.wareHouseId;
                    this.isBusyDetail = false;
                    let promise = axios.post(apiDomain+'/admin/bay_warehouse/getrecentchargeoffproducts',ctx,{headers:getHeader()});
                    return promise.then((response) => {
                        const result = response.data;
                        this.isBusyDetail = false
                        this.totalRowsDetail=result.dataList.recordCount;
                        this.recentSumOfProductPrice = result.sumOfPrice;
                        this.recentSumOfProductCount = result.sumOfProductCount;
                        return(result.dataList.items);
                    }).catch(error => {
                        this.isBusyDetail = false
                        alert(error.message);
                        return []
                    })
                }
            }
        },
        computed:{
            chargeOffTotalPrice:function(){
                return this.selectedProduct.productOutPrice * this.chargeOff.productCount;
            },
            wareHouseId:function(){
                return this.choosenWareHouseId;
            },
            wareHouseName :function(){
                return this.choosenWareHouseName;
            },
            comProductCats :function(){
                return this.productCats;
            },
            comProductMeasures :function(){
                return this.productMeasures;
            }
        }    
    }
</script>
<style scoped>
    .modal-lg{
        max-width: 90% !important;
    }
</style>