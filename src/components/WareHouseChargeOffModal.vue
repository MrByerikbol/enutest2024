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
                <b-form-row class="mb-3" >
                    <b-col sm="auto" md="4">
                        <label class="mr-sm-2" >Бараа сонгох</label>

                        <model-list-select
                            :list="products"
                            option-value="id"
                            option-text="name"
                            v-model="selectedProduct"
                            placeholder="Бараа сонгох"
                            
                            @searchchange="searchChargeOffProduct"
                            
                        >
                        </model-list-select>
                    </b-col>
                    

                    <b-col sm="auto" md="3">
                        <label class="mr-sm-2" for="productChargePrice">Барааны үнэ</label>
                        <b-form-input
                            id="productChargePrice"
                            v-model="selectedProduct.productOutPrice"
                            type="number"
                            
                        ></b-form-input>
                    </b-col>
                    <b-col sm="auto" md="2">
                        <label class="mr-sm-2" for="productCount">Барааны тоо</label>
                        <b-form-input
                            id="productCount"
                            v-model="chargeOff.productCount"
                            type="number"
                            
                        ></b-form-input>
                    </b-col>
                    <b-col sm="auto" md="3">
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
                        <b-button @click="chargeOffProduct" v-if="selectedProduct!=null"
                            class="btn-block" variant="danger">
                            Барааг агуулахаас зарлагдах 
                        </b-button>
                    </b-col>
                </b-form-row>

                
                <b-form-row class="mb-3">
                    <b-col lg="6">
                        <b-form-group
                        label-cols-sm="1"
                        label-align-sm="left"
                        label-size="sm"
                        label-for="filterInputDetail"
                        class="mb-2 mt-3"
                        >
                        <b-input-group size="sm">
                            <b-form-input
                            v-model="filterDetail"
                            type="search"
                            id="filterInputDetail"
                            placeholder="Хайлт хийх утгаа оруулна уу"
                            ></b-form-input>
                            
                        </b-input-group>
                        </b-form-group>
                    </b-col>
                    <b-col lg="2" class="pt-3 text-right">
                        <strong>тоо:</strong> {{totalRowsDetail}}  
                    </b-col>
                    <b-col lg="4" class="pt-3 text-right">
                        <strong>Зарлага хийсэн нийт үнэ:</strong> <br> {{recentSumOfPrice}}  
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
            'choosenWareHouseId'
        ],
        data(){
            return {
                kk:kk,
                products:[],
                selectedProduct:{},

               
                //begining of the ware house chargeoff product list
                chargeOffFields: [
                    {
                        key: 'productName',
                        label: 'Барааны нэр',
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
                recentSumOfPrice:0,

                chargeOff:{
                    wareHouseId : 0,
                    productCount:0,
                    chargeOffDate : "",
                    productId:0,
                    productPrice:0
                }
            }
        },
        methods:{
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
                                    responseText="Үйлдэл амжилттай боллоо."
                                    this.selectedProduct=null;
                                   
                                    this.chargeOff={
                                        wareHouseId : 0,
                                        productCount:0,
                                        chargeOffDate : "",
                                        productId:0 ,
                                        productPrice:0   
                                    }
                                    
                                    this.$refs.chargeOffTable.refresh();
                                }
                                else{
                                    responseText="Алдаа үүслээ дахиж оролдоно уу."
                                }
                                if(responseText!=null){
                                    this.$bvToast.toast(responseText, {
                                        title: 'Мэдээлэл',
                                        autoHideDelay: 5000
                                    })
                                }
                                this.selectedProduct={};
                            })
                            .catch(error => {
                                //console.log(error.message)
                                this.$bvToast.toast(error.message, {
                                    title: 'алдаа',
                                    autoHideDelay: 5000
                                })
                            }) 
                            
                            

                        }
                        else{
                            this.$bvToast.toast('Та бүх талбаруудыг бөглөнө үү', {
                                title: 'алдаа',
                                autoHideDelay: 5000
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
            searchChargeOffProduct(searchText){
                if(this.wareHouseId>0 && searchText.trim().length>0){
                    axios.get(apiDomain+'/admin/delivery/searchproduct/'+this.wareHouseId+'/'+searchText,{headers:getHeader()})
                    .then(response=>{
                        //this.$refs.wareHouseTable.refresh();  
                        this.products=response.data;
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
                        this.totalRowsDetail=result.recordCount;
                        this.recentSumOfPrice = result.sumOfPrice;
                        return(result.items);
                    }).catch(error => {
                    this.isBusyDetail = false
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
            }
        }    
    }
</script>
<style scoped>

</style>