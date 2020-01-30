<template>
    <b-row>
      <b-col lg="5">  
        <b-col lg="12">
            <h3>
            <span class="bd-content-title">Агуулахын жагсаалт</span>
            </h3>
        </b-col>
        <b-col lg="12" class="mt-3">
        
            <b-button variant="success" size="sm" class="mr-2" v-b-modal.wareHouseModal>Шинэ</b-button>
            <b-button variant="info" v-if="selectedRows.length==1" size="sm" @click="updateRecord" class="mr-2">Засах</b-button>
            <b-button variant="danger" v-if="selectedRows.length>0" size="sm" class="mr-2" @click="deleteRecord">Устгах</b-button>

        </b-col>
        <b-form-row>
            <b-col lg="6">
                <b-form-group
            
                label-cols-sm="1"
                label-align-sm="left"
                label-size="sm"
                label-for="filterInput"
                class="mb-2 mt-3"
                >
                <b-input-group size="sm">
                    <b-form-input
                    v-model="filter"
                    type="search"
                    id="filterInput"
                    placeholder="Хайлт хийх утгаа оруулна уу"
                    ></b-form-input>
                    
                </b-input-group>
                </b-form-group>
            </b-col>
            <b-col lg="6" class="pt-3 text-right">
                <strong>тоо:</strong> {{totalRows}}  
            </b-col>
        </b-form-row>
        <b-table 
            ref="wareHouseTable"
            striped hover selectable
            :items="wareHouseProvider" 
            :fields="fields"
            :busy.sync="isBusy"
            :current-page="currentPage"
            :per-page="perPage"
            :table-variant="tableVariant"
            :filter="filter"
            :select-mode="selectMode"
            selected-variant="active"
            @row-dblclicked="rowDoubleClick"
            @row-selected="onWareHouseSelected"
            >
            <template v-slot:table-busy>
            <div class="text-center text-info my-2">
                <b-spinner class="align-middle"></b-spinner>
                <strong>Ачаалж байна...</strong>
            </div>
            </template>
           <template v-slot:cell(getDetail)="row">
                <!-- {{row.item}} -->
                <b-button @click="chargeWareHouse(row.item.id,row.item.wareHouseName)" class="text-left mr-1 mt-1" variant="success" size="sm">
                    Татах    
                </b-button>
            </template>    

           <template v-slot:cell(chargeOff)="row">
                <!-- {{row.item}} -->
                <b-button @click="chargeOffWareHouse(row.item.id,row.item.wareHouseName)" class="text-left mr-1 mt-1" variant="info" size="sm">
                    Зарлагдах    
                </b-button>
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

        <b-modal id="wareHouseModal" title="Шинэ агуулах нэмэх" hide-footer>
            <b-form v-on:submit.prevent="submitWareHouse">
                <b-form-row class="mb-3">

                    <b-col sm="auto" md="12">
                        <label for="wareHouseName">Агуулахын нэр</label>
                        <b-form-input
                            id="name"
                            v-model="wareHouseForm.wareHouseName"
                            type="text"
                            required
                            placeholder="Агуулахын нэр"
                        ></b-form-input>
                    </b-col>
                </b-form-row>
                <b-button type="submit" variant="primary" class="mr-2">Шинэ агуулах үүсгэх</b-button>
                <b-button type="reset" variant="danger">Арилгах</b-button>
            </b-form>    
        </b-modal>


        <b-modal 
            size="lg" 
            id="productListModal" 
            :title="'Агуулхад бараа таталт хийх { '+ chargingWareHouse +' }'"
            ref="detailModal"
            @hide="onDetailModalClose"
            hide-footer>
            <b-form v-on:submit.prevent="addProductToWareHouse1" v-if="hasRole('ADMIN')">
                    <b-form-row class="mb-3">
                        <b-col lg="4" sm="auto" md="3">
                            <label for="productCat">Төрөл</label>
                            <select v-model="catId" @change="catChange" class="form-control">
                                <option value=0>--сонгох--</option>
                                <option v-for="(c ,i) in productCats" :value=c.catId :key="i">
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
                        <b-col sm="auto" md="4">
                            <label class="mr-sm-2" for="productChargePrice">Барааны үнэ</label>
                            <b-form-input
                                id="productChargePrice"
                                v-model="selectedProduct.productPrice"
                                type="number"
                                
                            ></b-form-input>
                        </b-col>
                        <b-col sm="auto" md="4">
                            <label class="mr-sm-2" for="productCount">Барааны тоо</label>
                            <b-form-input
                                id="productCount"
                                v-model="productCount"
                                type="number"
                               
                            ></b-form-input>
                        </b-col>
                        <b-col sm="auto" md="4">
                            <label class="mr-sm-2" for="chargeTotalPrice1">Нийт үнэ</label>
                            <input type="number"
                                id="chargeTotalPrice1"
                                v-model="chargeTotalPrice"
                                class="form-control"
                                disabled 
                            />
                        </b-col>
                        
                    </b-form-row>
                    <b-form-row>
                        <b-col lg="6" class="pt-2">
                            <datepicker format="yyyy-MM-dd" 
                                :clear-button="true" 
                                @cleared="chargeDate=''" 
                                input-class="form-control w-75 d-inline"
                                v-model="chargeDate"
                                id="datePickerInput"
                                :language="kk"
                                placeholder="Бараа татсан огноог оруулна уу"></datepicker>
                        </b-col>
                        
                        <b-col lg="6" md="3" class="pt-2">
                            <b-button  v-if="selectedProduct.id && selectedProduct.id>0"
                                @click="addProduct" class="btn-block" variant="info">
                                Барааг агуулхад бүртгэх 
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
                            <strong>Барааны тоо:</strong>  {{recentSumOfProductCount}}  
                        </b-col>
                        <b-col lg="2" class="pt-3 text-right">
                            <strong>Нийт үнэ:</strong> {{recentSumOfProductPrice}}  
                        </b-col>

                        <b-col lg="2" class="pt-3 text-right">
                            <strong>Бичлэг:</strong> {{totalRowsDetail}}  
                        </b-col>

                        <b-table 
                            ref="detailTableRef"
                            striped hover selectable
                            :items="detailProvider" 

                            :fields="fieldsDetail"
                            :busy.sync="isBusyDetail"
                            :current-page="currentPageDetail"
                            :per-page="perPageDetail"
                            :table-variant="'info'"
                            :filter="filterDetail"
                            :select-mode="selectMode"
                            selected-variant="active"
                        
                            @row-selected="onDetailSelected"
                            >
                            <template v-slot:cell(id)="{ rowSelected }">
                            <template v-if="rowSelected">
                                <span aria-hidden="true">&check;</span>
                                <span class="sr-only">Selected</span>
                            </template>
                            <template v-else>
                                <span aria-hidden="true">&nbsp;</span>
                                <span class="sr-only">Not selected</span>
                            </template>
                            </template>
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
            <WareHouseChargeOffModal v-if="hasRole('ADMIN')" v-on:refreshTrigger="listRefresher"
                :choosenWareHouseId="chargeOffWareHouseId" 
                :choosenWareHouseName="chargeOffWareHouseName"
                :productCats = "productCats"
                :productMeasures = "productMeasures"    
                ></WareHouseChargeOffModal>

        </b-col>
        <b-col lg="7">
            <b-col lg="12">
                <h3>
                    <span class="bd-content-title">Агуулахын барааны задаргаа</span>
                </h3>
            </b-col>
            <b-form-row>
                <b-col lg="12" class="mt-1">
                    <b-button  size="sm" variant="secondary" @click="getGeneralInOut">Орлого, зарлагын нэгдсэн задаргаа</b-button>
                </b-col>
            </b-form-row>
            <b-form-row>
                <b-col lg="6">
                    <select class="form-control-sm mt-3" v-model="wId" @change="getWareHouseProduct">
                        <option value=0>---Агуулах сонгох---</option>
                        <option v-for="(w,index) in wareHouses" :value="w.wareHouseId" :key="index">
                            {{w.wareHouseName}}
                        </option>
                    </select>    
                </b-col>
                <b-col lg="6">
                    <b-form-group
                        label-cols-sm="1"
                        label-align-sm="left"
                        label-size="sm"
                        label-for="filterInput"
                        class="mb-2 mt-3"
                        >
                        <b-input-group size="sm">
                            <b-form-input
                            v-model="filterWareHouseProduct"
                            type="search"
                            id="filterInput"
                            placeholder="Хайлт хийх утгаа оруулна уу"
                            ></b-form-input>
                            
                        </b-input-group>
                    </b-form-group>
                </b-col>
                
                <b-col lg="12" class="py-3 text-right text-info">
                    Барааны нийт тоо:<strong>{{sumOfProductCount}}</strong>
                    Нийлбэр үнэ:<strong>{{sumOfProductPrice}}</strong>
                    бичлэгийн тоо:<strong> {{totalRowsWareHouseProduct}}</strong>
                    
                </b-col>
                <b-table 
                    ref="wareHouseProductTable"
                    striped hover selectable
                    :items="wareHouseProductProvider" 
                    :fields="wareHouseProductFields"
                    :busy.sync="isBusyWareHouseProduct"
                    :current-page="currentPageWareHouseProduct"
                    :per-page="perPageWareHouseProduct"
                    :table-variant="'warning'"
                    :filter="filterWareHouseProduct"
                    :select-mode="selectMode"
                    selected-variant="active"
                    @row-dblclicked="inOutDblClick"
                    @row-selected="onWareHouseProductSelected"
                    >
                    <template v-slot:cell(id)="{ selectedRowWareHouseProduct }">
                        <template v-if="rowSelected">
                            <span aria-hidden="true">&check;</span>
                            <span class="sr-only">Selected</span>
                        </template>
                        <template v-else>
                            <span aria-hidden="true">&nbsp;</span>
                            <span class="sr-only">Not selected</span>
                        </template>
                    </template>
                    <template v-slot:table-busy>
                        <div class="text-center text-info my-2">
                            <b-spinner class="align-middle"></b-spinner>
                            <strong>Ачаалж байна...</strong>
                        </div>
                    </template>
                   
                </b-table>
                <b-pagination
                    v-model="currentPageWareHouseProduct"
                    :total-rows="totalRowsWareHouseProduct"
                    :per-page="perPageWareHouseProduct"

                    align="fill"
                    size="sm"
                    class="my-0"
                    
                ></b-pagination>
                <ProductInOut 
                    :pChoosenWareHouseId="wId"
                    :pChoosenOffWareHouseId="wId" 
                    :pWareHouses="wareHouses" 
                    :pProductName="choosenProductName"

                    v-if="hasRole('ADMIN')"></ProductInOut>
            </b-form-row>    
        </b-col>
    </b-row>
</template>

<script>
import axios from 'axios';
import {mapActions,mapState} from 'vuex';
import {apiDomain,getHeader} from "../config/config";
import { ModelListSelect } from 'vue-search-select'
import Datepicker from 'vuejs-datepicker';
import {kk} from 'vuejs-datepicker/dist/locale'
import WareHouseChargeOffModal from './WareHouseChargeOffModal';
import ProductInOut from './ProductInOut';
const moment = require('moment')
require('moment/locale/es')

export default {

  name: 'WareHouse',
  
  data(){
    return {
      kk: kk,
      fields: [
          {
            key: 'id',
            label: 'Id',
          },
          {
            key: 'wareHouseName',
            label: 'Агуулахын нэр',
          },
          {
            key: 'getDetail',
            label: 'Татах',
          },
          {
            key: 'chargeOff',
            label: 'Зарлагдах',
          }
      ],
      isBusy:false,
      totalRows:0,
      currentPage: 1,
      perPage: 20,
      tableVariant:'light',
      filter:"",
      selectMode:'single',
      selectedRows:[],
      // for warehouseproduct

      wareHouseProductFields: [
         
          {
              key:'catName',
              label:'Төрөл'
          },
          {
            key: 'productName',
            label: 'Нэр',
          },
          {
            key: 'measureName',
            label: 'Хэмжээ',
          },
          {
              key:'productCount',
              label:'Тоо'
          },
          {
              key:'lastChargeDate',
              label:'Cүүлийн таталт'
          }
         
      ],
      isBusyWareHouseProduct:false,
      totalRowsWareHouseProduct:0,
      currentPageWareHouseProduct: 1,
      perPageWareHouseProduct: 20,
      //tableVariant:'light',
      filterWareHouseProduct:"",
      //selectMode:'multi',
      selectedRowsWareHouseProduct:[],

      //for detail
      fieldsDetail: [
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
      selectedRowsDetail:[],   

      


      //begining of the form submission
      wareHouseForm:{
        id:0,
        wareHouseName:""
      },

      catId : 0,
      colorId : 0,
      measureId:0,
    
      isColorDisabled : true,
      productColors : [],
      selectedColor:{},

      selectedProduct:{},
      productCount:0,
      wareHouseId:0,
      chargeDate:"",
      recentSumOfProductPrice:0,
      recentSumOfProductCount:0,
      chargingWareHouse:"",
      wareHouses:[],
      selectedChargeProduct:{},
      searchProducts : [],
      wId : 0 ,
      chargeOffWareHouseId:0,
      chargeOffWareHouseName:"",

      choosenProductName : "",

      sumOfProductPrice : 0,
      sumOfProductCount : 0,

      //the additional development
      productMeasures: [],
      productFilteredMeasures:[],
      productCats : []
    }
  },
  methods:{
    catChange(){
        if(this.catId>0){
            this.productFilteredMeasures=this.productMeasures.filter(m=>m.catId===this.catId);
        }
        this.findProduct();
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
    listRefresher(){
        this.$refs.wareHouseProductTable.refresh();
    },
    //hamgiin ahnii row double click event barj avlaa Baybesik {2019-12-14}
    rowDoubleClick(row){
        if(this.wId !=row.id){
            this.wId=row.id;
            this.$refs.wareHouseProductTable.refresh();
        }else{
            this.wId=0;
            this.$refs.wareHouseProductTable.refresh();
            this.totalRowsWareHouseProduct=0;
            this.sumOfProductPrice=0;
            this.sumOfProductCount=0;
        } 
    },
    inOutDblClick(row){
        this.choosenProductName=row.productName;
        this.$bvModal.show("inOutModal");
    },
    getGeneralInOut(){
        this.choosenProductName='';
        this.choosenWareHouseId=0;
        this.$bvModal.show("inOutModal");
    },
    getWareHouseProduct(){
        //alert("first attempt " +this.wId);
        this.$refs.wareHouseProductTable.refresh();
    },
    onDetailModalClose(){
        //alert("this can be shown before do something "+this.wareHouseId);
        axios.post(apiDomain+'/admin/bay_warehouse/to_old/',
        {'wareHouseId':this.wareHouseId , 'type':'in'},{headers:getHeader()});
        this.$refs.wareHouseTable.refresh();
        this.$refs.wareHouseProductTable.refresh();
    },
    ...mapActions([
       'setLoginedUser'
    ]),
    getLoginedUser(){
     
      this.setLoginedUser();  
    },
    hasRole(roleName){
        
      let roleNames = this.loginedUser.roles;
     
      if(roleNames.length>0){
        //alert(JSON.stringify(roleNames));
        for(let r=0;r<roleNames.length;r++){
          
          if(roleNames[r].roleName===roleName){
            this.roleResult=true;
            return true;
            
          }
        }
      }
      else{
        this.roleResult=false;
        return false;
      }
      
    },
    uChange(){
        this.searchProducts=[];
    },
    addProductToWareHouse1(){

    },
    searchChargeProduct(searchText){
        if(this.userProductChargeType>0){
            let searchJSON =  null;
            if(this.userProductChargeType==1){
                if(this.userProductForm.wareHouseId>0 && searchText.trim().length>0){
                    searchJSON = {'chargeType':this.userProductChargeType,'wareHouseId':this.userProductForm.wareHouseId,'searchText':searchText};
                }
            }
            if(this.userProductChargeType==2){
                if(this.userProductForm.fromDeliveryUserId>0 
                    && searchText.trim().length>0){

                    searchJSON = {'chargeType':this.userProductChargeType,
                        'fromDeliveryUserId':this.userProductForm.fromDeliveryUserId,'searchText':searchText};
                }
            }
            if(this.userProductChargeType==3){
                if(searchText.trim().length>0){
                    searchJSON = {'chargeType':this.userProductChargeType,
                        'fromDeliveryUserId':this.userProductForm.fromDeliveryUserId,'searchText':searchText};
                }
            }
            if(searchJSON!=null){
                axios.post(apiDomain+'/admin/delivery/searchchargeproduct/',searchJSON,{headers:getHeader()})
                .then(response=>{
                    //this.$refs.wareHouseTable.refresh();  
                    this.searchProducts=response.data;
                })
                .catch(error => {
                    //console.log(error.message)
                    this.$bvToast.toast(error.message, {
                        title: 'алдаа',
                        autoHideDelay: 5000
                    })
                })     
            }
        }
    },
    showChargeModal(){
        this.selectedChargeProduct={};
        this.$bvModal.show("userProductChargeModal");
        this.searchProducts=[];
    },
    chargeOffWareHouse(wHouseId,chargingWareHouse){
        //alert(wHouseId);
        this.chargeOffWareHouseId=wHouseId;
        this.chargeOffWareHouseName=chargingWareHouse;
        this.$bvModal.show("chargeOffModal");
        
    },
    chargeWareHouse(wHouseId,chargingWareHouse){
        //alert(wHouseId);
        this.wareHouseId=wHouseId;
        this.chargingWareHouse=chargingWareHouse;
        this.$bvModal.show("productListModal");
        //this.$refs.detailTableRef.refresh();
    },
    addProduct(){
        if(confirm("Та итгэлтэй байна уу ?")){
            if(this.selectedProduct.id 
                    && this.selectedProduct.id>0){
                let dbChargeDate = null;
                if(this.chargeDate!=""){
                    dbChargeDate=moment(this.chargeDate).format('YYYY-MM-DD');
                }
                if(this.wareHouseId>0 && dbChargeDate!=null && this.chargeTotalPrice && this.chargeTotalPrice>0){
                    let newProduct=
                    {
                        productId:this.selectedProduct.id,
                        productCount:this.productCount,
                        wareHouseId:this.wareHouseId,
                        chargeDate :dbChargeDate,
                        productPrice:this.selectedProduct.productPrice

                    };
                    axios.post(apiDomain+'/admin/delivery/addproducttowarehouse',newProduct,{headers:getHeader()})
                    .then(response=>{
                        this.products=[];
                        //this.$refs.wareHouseTable.refresh();  
                        let result = response.data;
                        let responseText=null;

                        if("success"==result){
                            responseText="Үйлдэл амжилттай боллоо."
                            this.selectedProduct={};
                            this.productCount=0;
                            this.chargeDate="";
                            this.selectedColor={};
                            this.productColors=[];
                            this.catId=0;
                            this.colorId=0;
                            this.measureId=0;
                         

                        
                            this.$refs.detailTableRef.refresh();
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
                        this.productCount=0;
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
                this.$bvToast.toast('Таны таталт хийх бараа өгөгдөлийн санд бүртгэгдээгүй байна .', {
                    title: 'Бараа олох !!!',
                    autoHideDelay: 5000,
                    variant:'danger'
                })    
            }
        }
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
    deleteRecord(){
      let warn = confirm("Та итгэлтэй байна уу ?");
      if(warn){
        if(this.selectedRows.length>0){
          let o = new Object();
          o.selectedRows=this.selectedRows;
          o.type='del_warehouse';
          
          axios.post(apiDomain+'/admin/delivery/deleteref',o,{headers:getHeader()})
            .then(()=>{
              this.$refs.wareHouseTable.refresh();  
              this.getRef(6);
            })
            .catch(error => {
                //console.log(error.message)
                this.$bvToast.toast(error.message, {
                    title: 'алдаа',
                    autoHideDelay: 5000
                })
            }) 
        }
      }
      
    },
    updateRecord(){
      if(this.selectedRows.length==1){
        let id = this.selectedRows[0].id;
        if(id>0){
          axios.post(apiDomain+'/admin/delivery/getref',{type:'warehouse',id:id},{headers:getHeader()})
          .then(response=>{
            this.wareHouseForm=response.data;
            this.$bvModal.show('wareHouseModal')  
            this.getRef(6);  
          })
          .catch(error => {
              //console.log(error.message)
              this.$bvToast.toast(error.message, {
                  title: 'алдаа',
                  autoHideDelay: 5000
              })
          }) 
        }
      }
      
    },
    submitWareHouse(evt){
          evt.preventDefault();
          axios.post(apiDomain+'/admin/delivery/addwarehouse/',this.wareHouseForm,{headers:getHeader()})
            .then(()=>{
                let alertMsg = "Шинээр агуулах амжилттай үүслээ";
                this.$bvToast.toast(alertMsg, {
                    title: 'Амжилт',
                    autoHideDelay: 5000
                })  
                this.$bvModal.hide('wareHouseModal')
                this.wareHouseForm={
                    id:0,
                    wareHouseName:""
                }
                this.$refs.wareHouseTable.refresh();
                this.getRef(6);
            })
            .catch(error => {
                //console.log(error.message)
                this.$bvToast.toast(error.message, {
                    title: 'Амжилт',
                    autoHideDelay: 5000
                })
            }
        ) 
    },

    onWareHouseSelected(items){
      this.selectedRows=items;
    },
    onDetailSelected(items){
      this.selectedRowsDetail=items;
    },
    onWareHouseProductSelected(items){
        this.selectedRowsWareHouseProduct=items;
    },
    wareHouseProvider(ctx){
        //alert("yes");
        this.isBusy = false
        let promise = axios.post(apiDomain+'/admin/delivery/warehouselist',ctx,{headers:getHeader()});
        return promise.then((response) => {
          const result = response.data;
          this.isBusy = false
          this.totalRows=result.recordCount;
          //alert(JSON.stringify(result));
          return(result.items)
        }).catch(error => {

          this.isBusy = false
          alert(error.message);
          return []
        })
    },
    wareHouseProductProvider(ctx){
        
        if(this.wId>0){
           
            ctx.wareHouseId = this.wId;
            this.isBusyWareHouseProduct = false;
            let promise = axios.post(apiDomain+'/admin/bay_warehouse/getwarehouseproducts',ctx,{headers:getHeader()});
            return promise.then((response) => {
                const result = response.data;
                this.isBusyWareHouseProduct = false;
                this.totalRowsWareHouseProduct=result.dataList.recordCount;
                this.sumOfProductCount=result.sumOfProductCount;
                
                this.sumOfProductPrice=result.sumOfPrice;
              
                return(result.dataList.items);
            }).catch(error => {
                alert(error.message);
                this.isBusyWareHouseProduct = false;
                return []
            })
        }
        return [];

    },
    detailProvider(ctx){
        //alert("yes");
        if(this.wareHouseId>0){
            //alert("yes");
            ctx.wareHouseId=this.wareHouseId;
            this.isBusyDetail = false;
            let promise = axios.post(apiDomain+'/admin/bay_warehouse/getrecentproducts',ctx,{headers:getHeader()});
            return promise.then((response) => {
                const result = response.data;
                this.isBusyDetail = false
                this.totalRowsDetail=result.dataList.recordCount;

                this.recentSumOfProductCount = result.sumOfProductCount;
                this.recentSumOfProductPrice = result.sumOfPrice;

                return(result.dataList.items);
            }).catch(error => {
            this.isBusyDetail = false
            alert(error.message);
            return []
            })
        }
    },
    getRef(type){
        axios.get(apiDomain+'/admin/delivery/refs/'+type,{headers:getHeader()})
        .then(response=>{
            if(type===5){
                this.deliveryUsers=response.data;
            }
            if(type===6){
                this.wareHouses=response.data;
            }
            if(type===12){
                this.productMeasures=response.data;
            }
            if(type===7){
                this.productCats=response.data;
            }
        });  
    }
  },
  created(){
      this.getRef(6);
      this.getRef(7);
      this.getRef(12);
      this.getLoginedUser();
  },
  components: {
    ModelListSelect,
    Datepicker,
    WareHouseChargeOffModal,
    ProductInOut
  },
  computed:{
    ...mapState([
        'loginedUser'
    ]),
    chargeTotalPrice:{
        //turshik uzev
        get(){return this.selectedProduct.productPrice * this.productCount;}
    }
  }
 
}
</script>
<style lang="css" scoped>
    
    
    .extraInputClass{width:90% !important;}
     
</style>