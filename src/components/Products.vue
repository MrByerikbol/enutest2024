<template>
    <b-row>
      <b-col lg="4">
        <b-col lg="12">
          <h3>
            <span class="bd-content-title">Барааны төрөл</span>
          </h3>
        </b-col>
        <b-col lg="12" class="mt-3">
        
            <b-button variant="success" size="sm" class="mr-2" v-b-modal.productCatModal>Шинэ</b-button>
            <b-button variant="info" v-if="selectedCatRows.length==1" size="sm" @click="updateCatRecord" class="mr-2">Засах</b-button>
            <b-button variant="danger" v-if="selectedCatRows.length>0" size="sm" class="mr-2" @click="deleteCatRecord">Устгах</b-button>
        </b-col>
        <b-row>
          <b-col lg="6">
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
                  v-model="catfilter"
                  type="search"
                  id="catFilterInput"
                  placeholder="Хайлт хийх утгаа оруулна уу"
                ></b-form-input>
                
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col lg="6" class="pt-3 text-right">
            <strong>тоо:</strong> {{totalCatRows}}  
          </b-col>
        </b-row>
        <b-table 
          ref="catTable"
          striped hover selectable
          :items="catProvider" 
          :fields="catFields"
          :busy.sync="catIsBusy"
          :current-page="catCurrentPage"
          :per-page="catPerPage"
          :table-variant="tableVariant"
          :filter="catfilter"
          :small="isSmall"
          selected-variant="danger"
          isSmall=true
          @row-selected="onCatSelected"
          >
          <template v-slot:table-busy>
            <div class="text-center text-info my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Жүктелуде...</strong>
            </div>
          </template>
          <template v-slot:cell(catDetail)="row">
              <!-- {{row.item}} -->
              <b-button size="sm" @click="getDetailProduct(row.item.id)"  variant="warning">
                  Задаргаа
              </b-button>
           
            </template>
      
        </b-table>
        <b-pagination
            v-model="catCurrentPage"
            :total-rows="catTotalRows"
            :per-page="catPerPage"
            align="fill"
            size="sm"
            class="my-0"
            
        ></b-pagination>

        <b-modal id="productCatModal" title="Шинэ төрөл нэмэх" hide-footer>
            <b-form v-on:submit.prevent="submitCat">
                  <b-form-row class="mb-3">
                      
                      <b-col sm="auto" md="12">
                          <label for="catName">Төрөлийн нэр</label>
                          <b-form-input
                              id="catName"
                              v-model="catForm.catName"
                              type="text"
                              required
                              placeholder="Төрөлийн нэр"
                          ></b-form-input>
                      </b-col>
                  </b-form-row>
                  <b-button type="submit" variant="primary" class="mr-2">Шинэ төрөл үүсгэх</b-button>
                  <b-button type="reset" variant="danger">Арилгах</b-button>
              </b-form>    
          </b-modal>
      </b-col>
      <b-col lg="8">
        <b-col lg="12">
          <h3>
            <span class="bd-content-title">Барааны жагсаалт</span>
          </h3>
        </b-col>
        <b-col lg="12" class="mt-3">
        
            <b-button variant="success" size="sm" class="mr-2" v-b-modal.productModal>Шинэ</b-button>
            <b-button variant="info" v-if="selectedRows.length==1" size="sm" @click="updateRecord" class="mr-2">Засах</b-button>
            <b-button variant="danger" v-if="selectedRows.length>0" size="sm" class="mr-2" @click="deleteRecord">Устгах</b-button>
            
            <b-button style="float:right;" variant="primary" size="sm" class="mr-2" @click="productRef">Барааны лавлах сангууд</b-button>
            <b-button style="float:right;" variant="info" size="sm" class="mr-2" @click="priceRef">Наалтын хөлс</b-button>
            <b-button style="float:right;" variant="danger" size="sm" class="mr-2" @click="listWorkPriceRef">Зүсэлт хөлс</b-button>
        </b-col>
        <b-row>
          <b-col lg="6">
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
        </b-row>
        <b-row>
          <b-col lg="6" md="6" sm="12">
            <select @change="catChange1" class="form-control" v-model="catId">
              <option value="0">---таңдау---</option>
              <option v-for="(cat,i) in productCats " :key="i" :value="cat.catId">
                {{cat.catName}}
              </option>
            </select>
          </b-col>
        </b-row>
        <b-table 
          ref="productTable"
          striped hover selectable
          :items="productProvider" 
          :fields="fields"
          :busy.sync="isBusy"
          :current-page="currentPage"
          :per-page="perPage"
          :table-variant="tableVariant"
          :filter="filter"
          :select-mode="selectMode"
          selected-variant="danger"
          :small="isSmall"
          @row-selected="onProductSelected"
          >
         
          <template v-slot:table-busy>
            <div class="text-center text-info my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Жүктелуде...</strong>
            </div>
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

        <b-modal id="productModal" title="Шинэ бараа нэмэх" @hide="onProductModalHide" hide-footer>
            <b-form v-on:submit.prevent="submitProduct">
                  <b-form-row class="mb-3">

                      <b-col sm="auto" md="12">
                          <label for="productName">Барааны төрөл</label>
                          <select class="form-control" v-model="productForm.catId">
                            <option value=0>---таңдау---</option>
                            <option v-for="(p,i) in productCats " :value="p.catId" :key="i">
                              {{p.catName}}
                            </option>
                          </select>
                      </b-col>
                      <b-col sm="auto" md="12">
                          <label for="productColor">Барааны өнгө</label>
                          <select id="productColor" class="form-control" v-model="productForm.colorId">
                            <option value=0>---таңдау---</option>
                            <option v-for="(p,i) in productColors " :value="p.id" :key="i">
                              {{p.colorName}}
                            </option>
                          </select>
                      </b-col>
                      <b-col sm="auto" md="12">
                          <label for="productName">Барааны хэмжээ</label>
                          <select class="form-control" v-model="productForm.measureId">
                            <option value=0>---таңдау---</option>
                            <option v-for="(p,i) in productMeasures.filter(m=>parseInt(m.catId)==parseInt(productForm.catId)) " :value="p.id" :key="i">
                              {{p.measureName}}
                            </option>
                          </select>
                      </b-col>
                      <b-col sm="auto" md="12">
                          <label  for="productPrice">Барааны үнэ</label>
                          <b-form-input
                              id="productPrice"
                              v-model="productForm.productPrice"
                              type="number"
                              required
                              placeholder="Барааны үнэ"
                          ></b-form-input>
                      </b-col>
                      <b-col sm="auto" md="12">
                          <label  for="productPrice">Зарах үнэ</label>
                          <b-form-input
                              id="productPrice"
                              v-model="productForm.productOutPrice"
                              type="number"
                              required
                              placeholder="Зарах үнэ"
                          ></b-form-input>
                      </b-col>
                      
                      
                  </b-form-row>
                  <b-button type="submit" variant="primary" class="mr-2">Шинэ бараа үүсгэх</b-button>
                  <b-button type="reset" variant="danger">Арилгах</b-button>
              </b-form>    
          </b-modal>

          <ProductRef v-if="showRef" :parentRefs="getRefs"></ProductRef>
          <WorkPriceRef v-if="showPrice"></WorkPriceRef>
          <ListWorkPriceRef v-if="showListWorkPriceRef" :productCats="productCats"></ListWorkPriceRef>
      </b-col>
      
    </b-row>

</template>

<script>
import axios from 'axios';
import {apiDomain,getHeader} from "../config/config";
import ProductRef from './ProductRef';
import WorkPriceRef from './WorkPriceRef';
import ListWorkPriceRef from './ListWorkPriceRef';
export default {

  name: 'Products',
  data(){
    return {
      fields: [
        
          {
            key: 'catName',
            label: 'Төрөл',
          },
          {
            key: 'productName',
            label: 'Өнгө',
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
            key: 'productOutPrice',
            label: 'Зарах үнэ'
          }
      ],
      isBusy:false,
      totalRows:0,
      currentPage: 1,
      perPage: 20,
      tableVariant:'light',
      filter:"",
      selectMode:'multi',
      selectedRows:[],

      //begining of the form submission
      productForm:{
        id:0,
        productName:"",
        productPrice:0,
        productOutPrice:0,
        catId:0,
        measureId:0 , 
        colorId : 0
      },
      catId:0,
      productCats:[],
      productMeasures : [],
      productColors : [],
      //begining of the product category
      catFields: [
          {
            key: 'catName',
            label: 'Барааны төрөл',
          },
          {
            key: 'productCount',
            label: 'Барааны тоо'
          },
          {
            key: 'catDetail',
            label: 'Задаргаа',
          }
      ],
      catIsBusy:false,
      catTotalRows:0,
      catCurrentPage: 1,
      catPerPage: 20,
     
      catfilter:"",
    
      selectedCatRows:[],

      //begining of the form submission
      catForm:{
        catId:0,
        catName:""
      },
      totalCatRows:0,
      showRef : false,
      showPrice : false,
      showListWorkPriceRef:false,

      isSmall:true 
     
    }
  },
  methods:{
    onProductModalHide(){
      this.productForm={
        id:0,
        productName:"",
        productPrice:0,
        productOutPrice:0,
        catId:0,
        measureId:0 , 
        colorId : 0
      }
    },
    productRef(){
      this.showRef=true;
      this.$bvModal.show("productRefModal");
    },
    priceRef(){
      
      this.showPrice=true;
      this.$bvModal.show("workPriceRefModal");
    },
    listWorkPriceRef(){
      
      this.showListWorkPriceRef=true;
      this.$bvModal.show("ListWorkPriceRefModal");
    },
    catChange1(){
      this.$refs.productTable.refresh();
    },
    getDetailProduct(catId){
      //alert("this is the catId "+catId);
      this.catId=catId;
      this.$refs.productTable.refresh();
    },
    deleteRecord(){
      let warn = confirm("Сіз сенімдісіз бе ?");
      if(warn){
        if(this.selectedRows.length>0){
          let o = new Object();
          o.selectedRows=this.selectedRows;
          o.type='del_delivery_product';

          axios.post(apiDomain+'/admin/delivery/deleteref',o,{headers:getHeader()})
            .then(()=>{
              this.$refs.productTable.refresh();  
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
          
          axios.post(apiDomain+'/admin/delivery/getref',{type:'product',id:id},{headers:getHeader()})
          .then(response=>{
            this.productForm=response.data;
            this.$bvModal.show('productModal')    
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
    submitProduct(evt){
          evt.preventDefault();
          let dbProduct= this.productForm;
          if(dbProduct.measureId==0 || dbProduct.colorId==0){
            this.$bvToast.toast("Та хэмжээ эсвэл өнгө сонгоогүй байна .", {
                title: 'Қате туралы ақпарат',
                variant:'danger',
                autoHideDelay: 5000
            });
            return ;
          }
          axios.post(apiDomain+'/admin/delivery/addproduct/',dbProduct,{headers:getHeader()})
            .then((response)=>{
                
                if(response.data == 'dublicated'){
                  this.$bvToast.toast('Энэ бараа лавлах санд бүртгэгдсэн байна .', {
                    title: 'Қате туралы ақпарат',
                    variant:'danger',
                    autoHideDelay: 5000
                  })
                  return ;
                }
                let alertMsg = "Шинээр дэлгүүр Жетістіктай үүслээ";
                this.$bvToast.toast(alertMsg, {
                    title: 'Жетістік',
                    autoHideDelay: 5000,
                    variant:"info"
                })  
                this.$bvModal.hide('productModal')
                this.productForm={
                    id:0,
                    productName:"",
                    productPrice:0,
                    productOutPrice:0,
                    catId:0,
                    measureId : 0,
                    colorId : 0
                }
                
                this.$refs.productTable.refresh();
                this.$refs.catTable.refresh();
            })
            .catch(error => {
                //console.log(error.message)
                this.$bvToast.toast(error.message, {
                    title: 'Қате туралы ақпарат',
                    variant:'danger',
                    autoHideDelay: 5000
                })
            }
        ) 
    },

    onProductSelected(items){
      this.selectedRows=items;
    },
    productProvider(ctx){
        //alert("yes");
        this.isBusy = false;
        ctx.catId = this.catId;
        let promise = axios.post(apiDomain+'/admin/delivery/productlist',ctx,{headers:getHeader()});
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



    
    //begining of the product category methods 
    deleteCatRecord(){
      let warn = confirm("Сіз сенімдісіз бе ?");
      if(warn){
        if(this.selectedCatRows.length>0){
          let o = new Object();
          o.selectedRows=this.selectedCatRows;
          o.type='bay_product_category';

          axios.post(apiDomain+'/admin/delivery/deleteref',o,{headers:getHeader()})
            .then(()=>{
              this.$refs.catTable.refresh(); 
              this.getRefs(7);
              this.getRefs(11);
              this.getRefs(12);
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
    updateCatRecord(){
      if(this.selectedCatRows.length==1){
        let id = this.selectedCatRows[0].id;
        if(id>0){
          axios.post(apiDomain+'/admin/delivery/getref',{type:'productCategory',id:id},{headers:getHeader()})
          .then(response=>{
            this.catForm=response.data;
            this.$bvModal.show('productCatModal');
            this.getRefs(7);
            this.getRefs(11);
            this.getRefs(12);
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
    submitCat(evt){
          evt.preventDefault();
          axios.post(apiDomain+'/admin/pcat/addproductcategory/',this.catForm,{headers:getHeader()})
            .then(()=>{
                let alertMsg = "Шинээр барааны Жетістіктай үүслээ";
                this.$bvToast.toast(alertMsg, {
                    title: 'Жетістік',
                    autoHideDelay: 5000
                })  
                this.$bvModal.hide('productCatModal')
                this.catForm={
                    catId:0,
                    catName:""
                }
                this.$refs.catTable.refresh();
                this.$refs.productTable.refresh();
                this.getRefs(7);
                this.getRefs(11);
                this.getRefs(12);
            })
            .catch(error => {
                //console.log(error.message)
                this.$bvToast.toast(error.message, {
                    title: 'Жетістік',
                    autoHideDelay: 5000
                })
            }
        ) 
    },

    onCatSelected(items){
      this.selectedCatRows=items;
    },
    catProvider(ctx){
        //alert("yes");
        this.isCatBusy = false
        let promise = axios.post(apiDomain+'/admin/pcat/catlist',ctx,{headers:getHeader()});
        return promise.then((response) => {
          const result = response.data;
          this.isCatBusy = false;
          this.totalCatRows=result.recordCount;
          //alert(JSON.stringify(result));
          return(result.items)
        }).catch(error => {
          this.isCatBusy = false
          alert(error.message);
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
              if(type==12){
                this.productMeasures=response.data;
              }
          })
          .catch(error => {
            alert(error.message);
          }
      ) 
    }
  },
  created(){
    this.getRefs(7);
    this.getRefs(11);
    this.getRefs(12);
  },
  components:{
    ProductRef,
    WorkPriceRef,
    ListWorkPriceRef
  }
  
}
</script>