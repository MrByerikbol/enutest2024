<template>
  <div>
    <b-card title="Захиалгын жагсаалт" bg-variant="light">
      <b-tabs pills card  v-model="tabIndex"  @input="dateFilter">
        <b-row class="mt-2">
          <b-col lg="3">
            <datepicker format="yyyy-MM-dd"
              :clear-button="true" @cleared="clearBegin" v-model="beginDate" placeholder="Эхлэх огноо"></datepicker>
          </b-col>
          <b-col lg="3">
            <datepicker format="yyyy-MM-dd" 
             :clear-button="true" @cleared="clearEnd" v-model="endDate" placeholder="Дуусах огноо"></datepicker>
          </b-col>
        </b-row>
        <b-tab title="Шинэ"
           active>
          <b-card-text>
            <b-row>
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
                      type="input"
                      id="filterInput"
                      placeholder="Хайлт хийх утгаа оруулна уу"
                      @keyup="filterChange"
                      @change="filterChange"
                    ></b-form-input>
                    <b-button size="sm" class="ml-3"  @click="doSearch"> Шүүх </b-button>
                  </b-input-group>
                 
                </b-form-group>
                
              </b-col>
              
              
              <b-col lg="4" class="pt-3 text-right">
                <strong>тоо:</strong> {{totalRows}}  
              </b-col>
              <b-table 
                responsive
                small 
                ref="newOrderTable"
                striped hover 
                :items="newOrderProvider" 
                :fields="fieldsNew"
                :busy.sync="isBusy"
                :current-page="currentPage"
                :per-page="perPage"
                :table-variant="tableVariant"
               
                selected-variant="active"
                
                >
                <template v-slot:table-busy>
                  <div class="text-center text-info my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Ачаалж байна...</strong>
                  </div>
                </template>
                <template v-slot:cell(orderActions)="row">
                    <b-button @click="row.toggleDetails" 
                      variant="outline-success" class="mr-1" size="sm"   >
                      <font-awesome-icon icon="list" title="Лист харах"/>
                    </b-button>
                    <b-button 
                     
                      @click="completeThings('completeOrder',row.item.deliveryId,null)" 
                      variant="outline-warning" class="mr-1" size="sm" >
                      <font-awesome-icon icon="check"  title="Захиалага дуусгах"/>
                    </b-button>
                    <b-button  
                      variant="outline-primary" class="mr-1" size="sm" >
                      <font-awesome-icon icon="pen"  title="Захиалага засах"/>
                    </b-button>
                    <b-button variant="outline-danger" class="mr-1" size="sm" >
                      <font-awesome-icon icon="window-close"  title="Захиалага устгах"/>
                    </b-button>
                </template>
                <template v-slot:row-details="row">
                  <b-card>
                    <b-row>
                      <b-col lg="6">
                        <h6>Листүүд</h6>
                      </b-col>
                    </b-row>
                    <b-table striped :fields="listFields" hover table-variant="warning" :items="row.item.deliveryProducts">
                      <template v-slot:cell(listActions)="row">
                          <b-button 
                            @click="row.toggleDetails"
                            :disabled="row.item.relDetails.length>0 ? false : true " 
                            variant="outline-success" class="mr-1" size="sm"   >
                            <font-awesome-icon icon="list" title="Пвх харах"/>
                          </b-button>
                          <b-button 
                            :disabled="row.item.isDone==1 ? true : false"
                            @click="completeThings('completeList',row.item.relId,row)" variant="outline-info" class="mr-1" size="sm" >
                            <font-awesome-icon icon="check" title="Лист дуусгах"/>
                          </b-button>
                      </template>
                      <template v-slot:cell(pvhCount)="row">
                          {{row.item.relDetails.length}}
                      </template>
                      <template v-slot:cell(isDone)="row">
                        {{row.item.isDone==0 ? 'Хийгдээгүй' : 'Хийгдсэн'}}
                      </template>
                      <!-- pvh jagaaslt -->
                      <template v-slot:row-details="row">
                          <b-card>
                            <h6>пвх - нууд</h6>
                            <b-table striped hover :fields="pvhFields" table-variant="danger" 
                              :items="row.item.relDetails">

                              <template v-slot:cell(isDone)="row">
                                {{row.item.isDone==0 ? 'Хийгдээгүй' : 'Хийгдсэн'}}
                              </template>
                              <template v-slot:cell(pvhActions)="row">
                                <b-button 
                                  :disabled="row.item.isDone==1 ? true : false"
                                  @click="completeThings('completePvh',row.item.detailId,row)"  variant="outline-info" class="mr-1" size="sm" >
                                  <font-awesome-icon icon="check" title="Пвх дуусгах"/>
                                </b-button>
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
                    <b-row>
                      <b-col lg="12" class="text-right py-2">
                        <b-button size="sm" variant="danger" @click="row.toggleDetails">Лист хаах</b-button>
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
          </b-card-text>
        </b-tab>
        <b-tab title="Хийгдэж байгаа">
          <b-card-text>
              <b-row>
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
                        type="input"
                        id="filterInput"
                        placeholder="Хайлт хийх утгаа оруулна уу"
                        @keyup="filterChange"
                        @change="filterChange"
                      ></b-form-input>
                      <b-button size="sm" class="ml-3"  @click="doSearch"> Шүүх </b-button>
                    </b-input-group>
                  
                  </b-form-group>
                  
                </b-col>
                
                
                <b-col lg="4" class="pt-3 text-right">
                  <strong>тоо:</strong> {{totalRowsProgress}}  
                </b-col>
                <b-table 
                  responsive
                  small 
                  ref="progressOrderTable"
                  striped hover 
                  :items="progressOrderProvider" 
                  :fields="fieldsNew"
                  :busy.sync="isBusy"
                  :current-page="currentPageProgress"
                  :per-page="perPage"
                  :table-variant="tableVariant"
                
                  selected-variant="active"
                  
                  >
                  <template v-slot:table-busy>
                    <div class="text-center text-info my-2">
                      <b-spinner class="align-middle"></b-spinner>
                      <strong>Ачаалж байна...</strong>
                    </div>
                  </template>
                  <template v-slot:cell(orderActions)="row">
                      <b-button @click="row.toggleDetails" 
                        variant="outline-success" class="mr-1" size="sm"   >
                        <font-awesome-icon icon="list" title="Лист харах"/>
                      </b-button>
                      <b-button 
                      
                        @click="completeThings('completeOrder',row.item.deliveryId,null)" 
                        variant="outline-warning" class="mr-1" size="sm" >
                        <font-awesome-icon icon="check"  title="Захиалага дуусгах"/>
                      </b-button>
                      <b-button  
                        variant="outline-primary" class="mr-1" size="sm" >
                        <font-awesome-icon icon="pen"  title="Захиалага засах"/>
                      </b-button>
                      <b-button variant="outline-danger" class="mr-1" size="sm" >
                        <font-awesome-icon icon="window-close"  title="Захиалага устгах"/>
                      </b-button>
                  </template>
                  <template v-slot:row-details="row">
                    <b-card>
                      <b-row>
                        <b-col lg="6">
                          <h6>Листүүд</h6>
                        </b-col>
                      </b-row>
                      <b-table striped :fields="listFields" hover table-variant="warning" :items="row.item.deliveryProducts">
                        <template v-slot:cell(listActions)="row">
                            <b-button 
                              @click="row.toggleDetails"
                              :disabled="row.item.relDetails.length>0 ? false : true " 
                              variant="outline-success" class="mr-1" size="sm"   >
                              <font-awesome-icon icon="list" title="Пвх харах"/>
                            </b-button>
                            <b-button 
                              :disabled="row.item.isDone==1 ? true : false"
                              @click="completeThings('completeList',row.item.relId,row)" variant="outline-info" class="mr-1" size="sm" >
                              <font-awesome-icon icon="check" title="Лист дуусгах"/>
                            </b-button>
                        </template>
                        <template v-slot:cell(pvhCount)="row">
                            {{row.item.relDetails.length}}
                        </template>
                        <template v-slot:cell(isDone)="row">
                          {{row.item.isDone==0 ? 'Хийгдээгүй' : 'Хийгдсэн'}}
                        </template>
                        <!-- pvh jagaaslt -->
                        <template v-slot:row-details="row">
                            <b-card>
                              <h6>пвх - нууд</h6>
                              <b-table striped hover :fields="pvhFields" table-variant="danger" 
                                :items="row.item.relDetails">

                                <template v-slot:cell(isDone)="row">
                                  {{row.item.isDone==0 ? 'Хийгдээгүй' : 'Хийгдсэн'}}
                                </template>
                                <template v-slot:cell(pvhActions)="row">
                                  <b-button 
                                    :disabled="row.item.isDone==1 ? true : false"
                                    @click="completeThings('completePvh',row.item.detailId,row)"  variant="outline-info" class="mr-1" size="sm" >
                                    <font-awesome-icon icon="check" title="Пвх дуусгах"/>
                                  </b-button>
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
                      <b-row>
                      <b-col lg="12" class="text-right py-2">
                        <b-button size="sm" variant="danger" @click="row.toggleDetails">Лист хаах</b-button>
                      </b-col>
                    </b-row>
                  </b-card>
                </template>
              </b-table>
              <b-pagination
                  v-model="currentPageProgress"
                  :total-rows="totalRowsProgress"
                  :per-page="perPage"
                  align="fill"
                  size="sm"
                  class="my-0"
                  
              ></b-pagination>
             </b-row>                 
          </b-card-text>
        </b-tab>
        <b-tab title="Хийгдэж дууссан">
          <b-card-text>
            <b-row>
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
                        type="input"
                        id="filterInput"
                        placeholder="Хайлт хийх утгаа оруулна уу"
                        @keyup="filterChange"
                        @change="filterChange"
                      ></b-form-input>
                      <b-button size="sm" class="ml-3"  @click="doSearch"> Шүүх </b-button>
                    </b-input-group>
                  
                  </b-form-group>
                  
                </b-col>
                
                
                <b-col lg="4" class="pt-3 text-right">
                  <strong>тоо:</strong> {{totalRowsDone}}  
                </b-col>
                <b-table 
                  responsive
                  small 
                  ref="doneOrderTable"
                  striped hover 
                  :items="doneOrderProvider" 
                  :fields="fieldsNew"
                  :busy.sync="isBusy"
                  :current-page="currentPageDone"
                  :per-page="perPage"
                  :table-variant="tableVariant"
                
                  selected-variant="active"
                  
                  >
                  <template v-slot:table-busy>
                    <div class="text-center text-info my-2">
                      <b-spinner class="align-middle"></b-spinner>
                      <strong>Ачаалж байна...</strong>
                    </div>
                  </template>
                  <template v-slot:cell(orderActions)="row">
                      <b-button @click="row.toggleDetails" 
                        variant="outline-success" class="mr-1" size="sm"   >
                        <font-awesome-icon icon="list" title="Лист харах"/>
                      </b-button>
                    
                      <b-button  
                        variant="outline-primary" class="mr-1" size="sm" >
                        <font-awesome-icon icon="pen"  title="Захиалага засах"/>
                      </b-button>
                      <b-button variant="outline-danger" class="mr-1" size="sm" >
                        <font-awesome-icon icon="window-close"  title="Захиалага устгах"/>
                      </b-button>
                  </template>
                  <template v-slot:row-details="row">
                    <b-card>
                      <b-row>
                        <b-col lg="6">
                          <h6>Листүүд</h6>
                        </b-col>
                      </b-row>
                      <b-table striped :fields="listFields" hover table-variant="warning" :items="row.item.deliveryProducts">
                        <template v-slot:cell(listActions)="row">
                            <b-button 
                              @click="row.toggleDetails"
                              :disabled="row.item.relDetails.length>0 ? false : true " 
                              variant="outline-success" class="mr-1" size="sm"   >
                              <font-awesome-icon icon="list" title="Пвх харах"/>
                            </b-button>
                            <b-button 
                              :disabled="row.item.isDone==1 ? true : false"
                              @click="completeThings('completeList',row.item.relId,row)" variant="outline-info" class="mr-1" size="sm" >
                              <font-awesome-icon icon="check" title="Лист дуусгах"/>
                            </b-button>
                        </template>
                        <template v-slot:cell(pvhCount)="row">
                            {{row.item.relDetails.length}}
                        </template>
                        <template v-slot:cell(isDone)="row">
                          {{row.item.isDone==0 ? 'Хийгдээгүй' : 'Хийгдсэн'}}
                        </template>
                        <!-- pvh jagaaslt -->
                        <template v-slot:row-details="row">
                            <b-card>
                              <h6>пвх - нууд</h6>
                              <b-table striped hover :fields="pvhFields" table-variant="danger" 
                                :items="row.item.relDetails">

                                <template v-slot:cell(isDone)="row">
                                  {{row.item.isDone==0 ? 'Хийгдээгүй' : 'Хийгдсэн'}}
                                </template>
                                <template v-slot:cell(pvhActions)="row">
                                  <b-button 
                                    :disabled="row.item.isDone==1 ? true : false"
                                    @click="completeThings('completePvh',row.item.detailId,row)"  variant="outline-info" class="mr-1" size="sm" >
                                    <font-awesome-icon icon="check" title="Пвх дуусгах"/>
                                  </b-button>
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
                      <b-row>
                      <b-col lg="12" class="text-right py-2">
                        <b-button size="sm" variant="danger" @click="row.toggleDetails">Лист хаах</b-button>
                      </b-col>
                    </b-row>
                  </b-card>
                </template>
              </b-table>
              <b-pagination
                  v-model="currentPageDone"
                  :total-rows="totalRowsDone"
                  :per-page="perPage"
                  align="fill"
                  size="sm"
                  class="my-0"
                  
              ></b-pagination>
             </b-row>  
          </b-card-text>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import axios from 'axios';
import {apiDomain,getHeader} from "../config/config";
import {mapState,mapActions} from 'vuex';
import Datepicker from 'vuejs-datepicker';
const moment = require('moment')
require('moment/locale/es')
export default {
  name: 'Deliveries',
  components: {
    Datepicker
  },
  data(){
    return {
      isSmall:true,

      fieldsNew: [
          {
            key: 'orderNumber',
            label: 'Дугаар',
            variant: 'primary'
          },
          {
            key: 'userInfo',
            label: 'Клиент',
            variant: 'danger'
          },
          {
            key: 'totalProductPrice',
            label: 'Үнэ',
            variant: 'success'
          },
          {
            key: 'listCount',
            label: 'Лист',
            variant: 'warning'
          },
          {
            key: 'pvhCount',
            label: 'ПВХ',
            variant: 'primary'
          },
          {
            key: 'orderDate',
            label: 'Огноо',
            variant: 'info'
          },
           
          {
            key: 'orderActions',
            label: 'Үйлдэлүүд',
            align:'center'
          }

      ],
      listFields: [
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
            key: 'productCount',
            label: 'Тоо'
          },
          {
            key: 'productPrice',
            label: 'Үнэ'
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
            key: 'pvhCount',
            label: 'ПВХ'
          },
          {
            key: 'isDone',
            label: 'Статус'
           
          },
          {
            key: 'listActions',
            label: 'Үйлдэлүүд'
          }
      ],
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
         
          // {
          //   key: 'productPrice',
          //   label: 'Үнэ'
          // },
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
            key: 'pvhActions',
            label: 'Үйлдэлүүд'
          }
      ],

      fieldsOther: [
         
          {
            key: 'productInfo',
            label: 'Барааны мэдээлэл',
            variant: 'warning'
           
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
          }
      ],
      isBusy:false,
      isBusyProgress:false,
      isBusyDone:false,

      totalRows:0,
      totalRowsProgress:0,
      totalRowsDone:0,

      currentPage: 1,
      currentPageProgress:1,
      currentPageDone:1,


      perPage: 20,
      tableVariant:'light',
      filter:"",

      tabIndex:0,
      beginDate :"",
      endDate: ""
    }
  },
  methods:{
    doSearch(){
      
      if(this.beginDate || this.filter.length>0){
        this.refreshTables();
      }
      else{
        this.$bvToast.toast("Хайлтын утгуудаа орлуулна уу!!!", {
            title: 'Алдаа',
            autoHideDelay: 5000,
            variant:"danger"
        })  
      }
    },
    filterChange(){
      if(this.filter.length==0){
        this.refreshTables();
      }
    },
    completeThings(operationType,objectId,row){
      let warn =confirm("Та үнэхээр итгэлтэй байна уу ?");
      if(warn){
        axios.post(apiDomain+'/admin/order/charge_off_order_products',{'operationType':operationType, 'objectId':objectId},{headers:getHeader()})
        .then(()=>{
          this.$bvToast.toast('Үйлдэл амжилттай боллоо.', {
              title: 'Амжилт',
              autoHideDelay: 5000,
              variant:"success"
          })
          if(row && row!=null){
            row.item.isDone=1;
          }
          //herev shine zahialgiin ali neg list yumuu pvh g complete hiivel refresh
          if(this.tabIndex==0){
            this.refreshTables();
          }
          else{
            if(operationType==='completeOrder'){
              
              this.refreshTables();  
            }
          }
            
        })
        .catch(error => {
            //console.log(error.message)
            this.$bvToast.toast(error.message, {
                title: 'Алдаа',
                autoHideDelay: 5000,
                variant:"danger"
            })
        }) 

      } 
    },
    clearBegin(){
      this.beginDate="";
      this.endDate=""
      this.refreshTables();
    },
    clearEnd(){
      this.endDate="";
    },

    dateFilter(index){
      this.tabIndex=index;
      this.beginDate="";
      this.endDate="";
      this.filter="";
      this.refreshTables();
    },
    
    
    
    completeOrder(delId){
      //alert(delId);
      let warn = confirm("Та итгэлтэй байна уу ?");
      if(warn){
        let result = this.hasRole("DELIVERY");
        let result1 = this.hasRole("MANAGER");
        let result2 = this.hasRole("ADMIN");

        if(result || result1 || result2){

          this.changeStatus('done',delId);
        }
        else{
          this.$bvToast.toast("Зөвхөн хүргэгчид энэ үйлдэлийг хийх боломжтой", {
              title: 'Алдааны мэдээлэл',
              autoHideDelay: 5000
          })  
        }
      }
    },
    ...mapActions([
        'setDeliveryFormObject',
    ]),

    editOrder(pdeliveryId){
      //let reqData = {deliveryId:pdeliveryId};
      alert("something will happen ");
      // this.setDeliveryFormObject(reqData);
      // this.$router.push({name:'NewDelivery'});
    },

    newOrderProvider(ctx){
        ctx.orderType="new";
        ctx.filter=this.filter;
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
        let promise = axios.post(apiDomain+'/admin/order/orderlist',ctx,{headers:getHeader()});
        return promise.then((response) => {
          const result = response.data;
          this.isBusy = false
          this.totalRows=result.gridData.recordCount;
          return(result.gridData.items)
        }).catch(error => {
          this.$bvToast.toast(error.message, {
              title: 'Алдааны мэдээлэл',
              autoHideDelay: 5000,
              variant:"danger"
          })  
          this.isBusy = false
          return []
        })
    },
    progressOrderProvider(ctx){
        ctx.orderType="progress";

        ctx.filter=this.filter;
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
      
        this.isBusyProgress = false
        let promise = axios.post(apiDomain+'/admin/order/orderlist',ctx,{headers:getHeader()});
        return promise.then((response) => {
          const result = response.data;
          this.isBusyProgress = false
          this.totalRowsProgress=result.gridData.recordCount;
          return(result.gridData.items)
        }).catch(error => {
          this.$bvToast.toast(error.message, {
              title: 'Алдааны мэдээлэл',
              autoHideDelay: 5000,
              variant:"danger"
          })  
          this.isBusyProgress = false
          return []
        })
    },

    doneOrderProvider(ctx){
        ctx.orderType="done";

        ctx.filter=this.filter;
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
      
        this.isBusyDone = false
        let promise = axios.post(apiDomain+'/admin/order/orderlist',ctx,{headers:getHeader()});
        return promise.then((response) => {
          const result = response.data;
          this.isBusyDone = false;
          this.totalRowsDone=result.gridData.recordCount;
          return(result.gridData.items)
        }).catch(error => {
          this.$bvToast.toast(error.message, {
              title: 'Алдааны мэдээлэл',
              autoHideDelay: 5000,
              variant:"danger"
          })  
          this.isBusyDone = false
          return []
        })
    },


    hasRole(roleName){
      let roleNames = this.loginedUser.roles;
     
      if(roleNames.length>0){
        //alert(JSON.stringify(roleNames));
        for(let r=0;r<roleNames.length;r++){
          
          if(roleNames[r].roleName===roleName){
            
            return true;
            
          }
        }
      }
      else{
        return false;
      }
      
    },
    changeStatus(type,delId){
       let jsonParam = null;
       if("ignore"===type){
         jsonParam = new Object();
         jsonParam.statusId=2;
         jsonParam.delId=delId;
       }
       if("done"===type){
         jsonParam = new Object();
         jsonParam.statusId=1;
         jsonParam.delId=delId;
       }
       if(jsonParam!=null){
         jsonParam.description=this.deliveryDescription;

         axios.post(apiDomain+'/admin/delivery/changestatus/',jsonParam,{headers:getHeader()})
        .then(response=>{
            let responseMsg=response.data;
            if(responseMsg=='norole'){
              this.$bvToast.toast("Та зөвхөн өөрийн оруулсан хүргэлт цуцлах боломжтой", {
                  title: 'Алдааны мэдээлэл',
                  autoHideDelay: 5000
              });
              this.deliveryDescription="";
              return ;

            }
            this.deliveryDescription="";
            let alertMsg = null;
            if("ignore"===type){
              alertMsg="Амжилттай цуцлагдлаа"
            }
            if("done"===type){
              alertMsg="Амжилттай хүргэлт хийгдлээ"
            }
            this.$bvToast.toast(alertMsg, {
              title: 'Алдаа',
              autoHideDelay: 5000
            });
            this.refreshTables();
        })
        .catch(error => {
            //console.log(error.message)
            this.$bvToast.toast(error.message, {
                title: 'Алдаа',
                autoHideDelay: 5000
            })
        }) 
       }
       
    },
    refreshTables(){
      if(this.tabIndex==0){
        this.$refs.newOrderTable.refresh();
      }
      if(this.tabIndex==1){
        this.$refs.progressOrderTable.refresh();
      }
      if(this.tabIndex==2){
        this.$refs.doneOrderTable.refresh();
      }
    }
    
    
  },
  computed:{
    ...mapState([
        'loginedUser'
    ]),
  }
}
</script>

