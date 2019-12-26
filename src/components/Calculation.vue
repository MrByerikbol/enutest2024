<template>
    <b-row>
      <b-col lg="12">
        <h3>
          <span class="bd-content-title">Тооцооны модул</span>
        </h3>
      </b-col>
      <b-col lg="2">
         <select class="form-control-sm" v-model="userId">
          <option value="0">__сонго__</option>

          <option v-for="(dUser,index) in dUsers" :value="dUser.userId" :key="index">
            {{dUser.userName}}
          </option>
        </select> 
      </b-col>
      <b-col lg="4" >
        <datepicker format="yyyy-MM-dd" 
             :clear-button="true" @cleared="clearDate" v-model="beginDate" placeholder="Огноо оруулна уу"></datepicker>
      </b-col>
      <b-col lg="1" >
        <b-button v-if="beginDate!='' && userId>0" size="sm" @click="doFilter">Шүүх</b-button>
      </b-col>
      <b-col lg="4" >
       
        <b-form-input
          v-model="filter"
          type="search"
          placeholder="Хайлт хийх утгаа оруулна уу"
        ></b-form-input>  
      </b-col>

     

      
      <b-col lg="1" class="pt-1 text-right">
        <strong>Хүргэгдсэн:</strong> {{totalSuccess}} <br>
        <strong>Цуцалсан:</strong> {{totalDecline}}   
      </b-col>

      <b-col lg="12" sm="12" md="12" class="mt-3">

      <b-row>
        <b-row lg="12" class="pl-3" v-if="totalRows>0">
          <b-col lg="4">
            <div class="form-group">
              <label class="w-100" for="productId">Бараа Сонгох</label>
              <select @change="changeProduct" id="productId" class="form-control-sm w-100" v-model="productForm.productId">
                <option value="0">Сонгох</option>
                <option v-for="(p,index) in dProducts" :key="index" :value="p.productId">{{p.productName}}</option>
              </select>
            </div>
          </b-col>
          <b-col>
            <div class="form-group">
              <label class="w-100" for="productPrice">Бараа үнэ</label>
              <input type="number" @change="addPriceCountChange" id="productPrice" class="form-control-sm w-100" v-model="productForm.productPrice">
            </div>
          </b-col>
          <b-col>
            <div class="form-group">
              <label class="w-100" for="productPrice">Бараа тоо</label>
              <input type="number" @change="addPriceCountChange" id="productPrice" class="form-control-sm w-100" v-model="productForm.productCount">
            </div>
          </b-col>
          <b-col>
            <div class="form-group">
              <label class="w-100" for="totalPrice">Нйит үнэ</label>
              <input type="number" id="totalPrice" class="form-control-sm w-100" disabled v-model="productForm.totalPrice">
            </div>
          </b-col>
          <b-col class="pt-2">
            <b-button variant="success mt-4" v-if="productForm.productId>0" @click="addProduct" size="sm">Нэмэх</b-button>
          </b-col>
        </b-row>
        <b-col lg="7" md="8" sm="12">
          <b-table 
              responsive
              small 
              ref="calculationTable"
              striped hover 
              :items="calculationProvider" 
              :fields="fieldsNew"
              :busy.sync="isBusy"
              :current-page="currentPage"
              :per-page="perPage"
              :table-variant="tableVariant"
              :filter="filter"
              selected-variant="active"
              >
            
              <template slot="productInfo" slot-scope="row">
                <!-- {{row.item}} -->
                <div  v-for="(product,index) in row.item.deliveryProducts" 
                  :key="index" size="sm" class="text-left mr-1 mt-1" style="border:1px solid #666;padding:3px;" variant="primary">
                    {{product.productName}} = <input v-model="row.item.deliveryProducts[index].productPrice" @change="updateProduct(product.relId,row.item.deliveryProducts,index)" style="width:80px !important;" type="number" >₮ x 

                    <input v-model="row.item.deliveryProducts[index].productCount" @change="updateProduct(product.relId,row.item.deliveryProducts,index)" style="width:50px !important;" type="number" >= {{product.totalPrice}}₮

                     <br>
                    
                    <b-button class="mt-1" size="sm" @click="deleteProduct(product.relId)" variant="danger">Устгах</b-button>
                </div>
                <br>
                <b-button size="sm" class="text-left mt-1" variant="success">
                    Үүсгэсэн:  <b-badge variant="light">{{row.item.createdUserName}}</b-badge><b-badge variant="light">{{row.item.createdDate}}</b-badge>
                    <br>
                    <strong><span style="color:#000;">Хүргэлт: </span></strong>{{row.item.deliveryCost}}₮ Нийт:{{row.item.totalProductPrice+row.item.deliveryCost}}₮

                </b-button>
               
              </template>
              <template v-slot:table-busy>
                <div class="text-center text-info my-2">
                  <b-spinner class="align-middle"></b-spinner>
                  <strong>Ачаалж байна...</strong>
                </div>
              </template>
              <template slot="deliveryStatus" slot-scope="row">
                <center>
                  {{row.item.delStatus==1 ? 'Хүргэгдсэн' : 'Цуцалсан' }} {{row.item.deliveryStatus}}
                </center>
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
        </b-col>
        <b-col  lg="5" md="4" sm="12">
          <b-row>
              
            <!-- calculationForm:{
              userId:this.userId,
              incomeAccount:0,
              incomeCash:0,
              totalOutCome:0,
              calculated:0,  
              balanceDiff : 0
            } -->
           <b-col lg="4"> 
            <strong>Нийт</strong> :  {{allIncome}}₮
           </b-col>
           <b-col lg="4">
             <strong>Тооцоо</strong> : {{calculationForm.calculated}}
           </b-col>
           <b-col lg="4">
             <strong>Зөрөө</strong> : {{allIncome-calculationForm.calculated}}
           </b-col>
          </b-row>
          <b-row v-if="totalRows>0">
            <b-col lg="4">
              <div class="form-group">
                <label class="w-100" for="incomeCash">Бэлнээр</label>
                <input type="number" @change="calcChanged" id="incomeCash" class="form-control-sm w-100" v-model="calculationForm.incomeCash">
              </div>  
            </b-col>
            <b-col lg="4">
              <div class="form-group">
                <label class="w-100" for="incomeCash">Дансаар</label>
                <input type="number" @change="calcChanged" id="incomeCash" class="form-control-sm w-100" v-model="calculationForm.incomeAccount">
              </div>  
            </b-col>  
            <b-col lg="4">
              <div class="form-group">
                <label class="w-100" for="incomeCash">Зардал</label>
                <input type="number" @change="calcChanged" id="incomeCash" class="form-control-sm w-100" v-model="calculationForm.totalOutCome">
              </div>  
            </b-col>
            <b-col lg="6">
              <div class="form-group">
                <label class="w-100" for="taxIncluded">Тушаасан</label>
                <input type="number" disabled id="taxIncluded" class="form-control-sm w-100"
                 v-model="calculationForm.taxIncluded">
              </div>  
            </b-col>
            <b-col lg="6">
              <div class="form-group">
                <label class="w-100" for="taxInclued">Тушаах ёстой</label>

                <input type="number" disabled id="lastBalance" class="form-control-sm w-100"
                 v-model="calculationForm.lastBalance">

              </div>  
            </b-col>
            <b-col lg="12 text-right">
              <b-button v-if="calculationMade==1 && calculationForm.isConfirmed==0" size="sm" variant="success" class="mr-2" @click="postCalculation(1)">Хадгалах</b-button>
              <b-button v-if="calculationMade==1 && calculationForm.isConfirmed==0" class="mr-2" variant="danger" size="sm" @click="postCalculation(2)">Батлах</b-button>

              <b-button v-if="calculationForm.isConfirmed==0" size="sm" @click="makeCalculation">Тооцоолох</b-button>
            </b-col>     
          </b-row>

        </b-col>
      </b-row>
      </b-col>
    </b-row>
</template>

<script>
import axios from 'axios';
import {apiDomain,getHeader} from "../config/config";
import Datepicker from 'vuejs-datepicker';
const moment = require('moment')
require('moment/locale/es')
export default {

  name: 'Calculation',
  components:{
    Datepicker
  },
  data(){
    return {
       fieldsNew: [
          {
            key: 'productInfo',
            label: 'Барааны мэдээлэл',
            variant: 'warning',
            thStyle:"width:50% !important"
          },
          {
            key: 'shopName',
            label: 'Гарах',
            variant: 'success'
          },
          {
            key: 'destinationOrg',
            label: 'Утас',
            variant: 'info'
          },
          {
            key: 'destinationOrgAddress',
            label: 'Хаяг',
            variant: 'info'
          },
          {
            key: 'deliveryStatus',
            label: 'Төлөв'
          }
      ],
      isBusy:false,
      totalRows:0,
      totalSuccess:0,
      totalDecline:0,
      currentPage: 1,
      perPage: 80,
      tableVariant:'light',

      filter:"",
      beginDate :"",
      userId:0,
      dUsers:[],
      dProducts:[],
      allIncome:0,

      productForm:{
        productId:0,
        productDeliveryId:0,
        productPrice:0,
        productCount:0,
        totalPrice:0,
        deliveryId:0
      },

      calculationForm:{
        id:0,
        userId:0,
        incomeAccount:0,
        incomeCash:0,
        totalOutCome:0,
        calculated:0,  
        calculationDate:"",
        taxIncluded:0,
        lastBalance:0,
        isConfirmed:0
      },
      calculationMade : 0
    }
    
  },
  methods:{
    calcChanged(){
      this.calculationMade=0;
    },
    postCalculation(param){
      let calculationDate1=moment(this.beginDate).format('YYYY-MM-DD');
      this.calculationForm.calculationDate=calculationDate1;
      this.calculationForm.userId=this.userId;
      if(param==1){
        this.calculationForm.isConfirmed=0;
      }
      else{
        let warn = confirm("Та итгэлтэй байна уу та баталгаажуулсанаар дахиж тооцоо хийх боломжгүй болно");
        if(!warn){
          return ;
        }
        this.calculationForm.isConfirmed=1;
      }
      axios.post(apiDomain+'/admin/delivery/postcalculation/',this.calculationForm,{headers:getHeader()})
      .then((response) => {
            if(response.data==='success'){
              this.$bvToast.toast('Тооцоо амжилттай хийгдлээ.', {
                    title: 'Амжилт',
                    autoHideDelay: 5000
              });
              this.calculationMade=0;
            }
            else{
              alert("server dr aldaa uuslee dahij oroldono uu");
            }
       }).catch(error => {
          alert(error.message);
       })      
    },
    makeCalculation(){
      this.calculationForm.calculated
        =parseInt(this.calculationForm.incomeAccount)+parseInt(this.calculationForm.incomeCash)
          +parseInt(this.calculationForm.totalOutCome);

      this.calculationForm.taxIncluded=this.calculationForm.calculated;
        // (parseInt(this.calculationForm.incomeAccount)+
        //   parseInt(this.calculationForm.incomeCash))-parseInt(this.calculationForm.totalOutCome)

      this.calculationForm.lastBalance=(this.allIncome-this.calculationForm.calculated)+this.calculationForm.taxIncluded;

      this.calculationMade=1;
    },
    updateProduct(relId,products,index){
      if(relId>0,products.length>0){
        let productPrice1=products[index].productPrice;
        let productCount1=products[index].productCount;
        let param= {relId:relId,productPrice:productPrice1,productCount:productCount1};

        axios.post(apiDomain+'/admin/delivery/updateproduct/',param,{headers:getHeader()})
        .then((response) => {
            if(response.data==='success'){
              this.$refs.calculationTable.refresh(); 
            }
            else{
              alert("server dr aldaa uuslee dahij oroldono uu");
            }
          }).catch(error => {
            alert(error.message);

          })      
       
        }
         
    },
    changeProduct(){

      if(this.productForm.productId>0){
        for(let t=0;t<this.dProducts.length;t++){
          let current = this.dProducts[t];
          if(current.productId==this.productForm.productId){
            this.productForm.productPrice=current.productPrice;
            break;
          }
        }
      }
      else{
        this.productForm.productCount=0;
        this.productForm.productPrice=0;
        this.productForm.totalPrice=0;
      }
    },
    addPriceCountChange(){
      this.productForm.totalPrice=this.productForm.productPrice*this.productForm.productCount;

    },
    addProduct(){
     
      if(this.productForm.totalPrice>0 
        && this.productForm.productId>0 && this.userId>0){
        this.productForm.dateString=moment(this.beginDate).format('YYYY-MM-DD');
        this.productForm.userId=this.userId;
        axios.post(apiDomain+'/admin/delivery/newcalculationdelivery/',this.productForm,{headers:getHeader()})
        .then((response) => {
            if(response.data==='success'){

              this.$refs.calculationTable.refresh(); 
              this.productForm={
                    productId:0,
                    productDeliveryId:0,
                    productPrice:0,
                    productCount:0,
                    totalPrice:0,
                    deliveryId:0
                  };
            }
            else{
              alert("server dr aldaa uuslee dahij oroldono uu");
            }
          }).catch(error => {
            alert(error.message);
            //this.dUsers=[];
          })      
      }  

    },
    deleteProduct(relId){
      let warn = confirm("Та итгэлтэй байна уу ?");
      if(warn){
        axios.post(apiDomain+'/admin/delivery/delcalcproduct/',{relId:relId},{headers:getHeader()})
        .then((response) => {
            if(response.data==='success'){

              this.$refs.calculationTable.refresh();  
            }
            else{
              alert("server dr aldaa uuslee dahij oroldono uu");
            }
          }).catch(error => {
            alert(error.message);
            //this.dUsers=[];
          })        
      }
    },
    clearDate(){
      this.beginDate=""
    },
    doFilter(){
      this.$refs.calculationTable.refresh();
    },
    calculationProvider(ctx){
        if(this.beginDate!=""){
           ctx.beginDate=moment(this.beginDate).format('YYYY-MM-DD')
        }
        else{
          ctx.beginDate="";
        }
        ctx.userId=this.userId;
        if(this.userId==0){
          this.isBusy = false;
          return [];
        }
        else{
          let promise = axios.post(apiDomain+'/admin/delivery/getcalculationlist',ctx,{headers:getHeader()});

          return promise.then((response) => {
            const result = response.data;
            if(result=='norole'){

              this.$router.push({name:'Deliveries'});

            }
            else{
              this.isBusy = false
              this.totalRows=result.totalRows;
              this.totalSuccess=result.totalSuccess;
              this.totalDecline=result.totalDecline;
              
              this.allIncome=parseInt(result.totalPrice)+parseInt(result.totalDeliveryCost);

              if(result.deliveryCalculation){
                this.calculationForm=result.deliveryCalculation;
                this.calculationMade=1;
              }
                

              return(result.deliveryies)
            }
          
          }).catch(error => {
            alert(error.message);
            this.isBusy = false
            return []
          })
        }
        

        
    },
    getDusers(){
      axios.get(apiDomain+'/admin/delivery/getlistbyquery/user',{headers:getHeader()})
      .then((response) => {
          this.dUsers=response.data;
        }).catch(error => {
          alert(error.message);
          this.dUsers=[];
        })  
    },
    getDproducts(){
      axios.get(apiDomain+'/admin/delivery/getlistbyquery/product',{headers:getHeader()})
      .then((response) => {
          this.dProducts=response.data;
        }).catch(error => {
          alert(error.message);
          this.dProducts=[];
        })  
    }
  },
  created(){
    this.getDusers();
    this.getDproducts();
  }
  
 
}
</script>