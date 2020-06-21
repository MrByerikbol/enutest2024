<template>
  <div>
    <b-card title="Тапсырыс тізімі" bg-variant="light">
      <b-tabs pills card  v-model="tabIndex"  @input="dateFilter">
        <b-row class="mt-2">
          <b-col lg="3">
            <datepicker format="yyyy-MM-dd"
              :clear-button="true" @cleared="clearBegin" v-model="beginDate" placeholder="Басталу уақыты"></datepicker>
          </b-col>
          <b-col lg="3">
            <datepicker format="yyyy-MM-dd" 
             :clear-button="true" @cleared="clearEnd" v-model="endDate" placeholder="Бiту уақыты"></datepicker>
          </b-col>
        </b-row>
        <b-tab title="Жаңа"
           active>
          <b-card-text>
            <b-row>
              <b-col lg="6">
                <b-form-group
                  label="Іздеу"
                  label-cols-sm="1"
                  label-align-sm="left"
                  label-size="sm"
                  label-for="filterInput"
                  class="mb-2 mt-3"
                >
                  <b-input-group size="sm">
                    <b-form-input
                      v-model="filter"
                     
                      id="filterInput1"
                      placeholder="Іздеу"
                      @keyup="filterChange"
                      @change="filterChange"
                    ></b-form-input>
                    <b-button size="sm" class="ml-3"  @click="doSearch"> Ізде </b-button>
                  </b-input-group>
                 
                </b-form-group>
                
              </b-col>
              <b-col lg="4" class="pt-3">
                <select class="form-sm-control float-right" v-model="sortType"
                   @change="sortChange">
                  <option value="asc">Тапсырыс номерi бойынша</option>
                  <option value="desc">Жаңа тапсырыс бойынша</option>
                </select>
              </b-col>
              
              <b-col lg="2" class="pt-3 text-right">
                <strong>саны:</strong> {{totalRows}}  
              </b-col>
              <b-table 
                ref="newOrderTable"
                responsive="sm"
                small 
                striped hover selectable
                :items="newOrderProvider" 
                :fields="fieldsNew"
                :busy.sync="isBusy"
                :current-page="currentPage"
                :per-page="perPage"
                :table-variant="tableVariant"
                selected-variant="danger"
                
                >
                <template v-slot:table-busy>
                  <div class="text-center text-info my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Жүктелуде...</strong>
                  </div>
                </template>
                <template v-slot:cell(orderDate)='regInfo'>
                    <div class="text-center">
                      {{regInfo.item.orderDate}}<br>  
                      <small><strong>{{regInfo.item.regUserInfo}}</strong></small>  
                    </div>
                </template>
                <template v-slot:cell(orderActions)="row">
                    <b-button @click="row.toggleDetails" 
                      variant="outline-success" class="mr-1" size="sm"   >
                      <font-awesome-icon icon="list" title="ЛДСП көру"/>
                    </b-button>
                    
                    <b-button  
                      variant="outline-primary" @click="editOrder(row.item.deliveryId)" class="mr-1" size="sm" >
                      <font-awesome-icon icon="pen"  title="Тапсырыс жөндеу"/>
                    </b-button>
                    <b-button @click="deleteOrder(row.item.deliveryId)" variant="outline-danger" class="mr-1" size="sm" >
                      <font-awesome-icon icon="window-close"  title="Тапсырыс жою"/>
                    </b-button>
                </template>
                <template v-slot:row-details="row">
                  <b-card>
                    <b-row>
                      <b-col lg="6">
                        <h6>ЛДСП лер</h6>
                      </b-col>
                    </b-row>
                    <b-table striped :fields="listFields" hover table-variant="warning" :items="row.item.deliveryProducts">
                      <template v-slot:cell(listActions)="row">
                          <b-button 
                            @click="row.toggleDetails"
                            :disabled="row.item.relDetails.length>0 ? false : true " 
                            variant="outline-success" class="mr-1" size="sm"   >
                            <font-awesome-icon icon="list" title="Пвх көру"/>
                          </b-button>
                         
                      </template>
                      <template v-slot:cell(pvhCount)="row">
                          {{row.item.relDetails.length}}
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
                      <template v-slot:cell(isDone)="row">
                        {{row.item.isDone==0 ? 'Iстелмеген' : 'Iстелген'}}
                      </template>
                      <!-- pvh jagaaslt -->
                      <template v-slot:row-details="row">
                          <b-card>
                            <h6>пвх - лар</h6>
                            <b-table striped hover :fields="pvhFields" table-variant="danger" 
                              :items="row.item.relDetails">
                              <template v-slot:cell(isDone)="pvh">
                                {{pvh.item.isDone==0 ? 'Iстелмеген' : 'Iстелген'}}
                              </template>
                              <template v-slot:cell(totalPrice)="t">
                                {{t.item.totalPrice+(t.item.productCount*t.item.workPrice)}}
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
              <div class="w-100">
                <b-pagination
                    v-model="currentPage"
                    :total-rows="totalRows"
                    :per-page="perPage"
                    align="fill"
                    size="sm"
                    class="my-0"
                    
                ></b-pagination>
              </div>
             </b-row>              
          </b-card-text>
        </b-tab>
        <b-tab title="Iстелуде">
          <b-card-text>
              <b-row>
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
                        v-model="filter"
                       
                        id="filterInput2"
                        placeholder="Iздеу"
                        @keyup="filterChange"
                        @change="filterChange"
                      ></b-form-input>
                      <b-button size="sm" class="ml-3"  @click="doSearch"> Iзде </b-button>
                    </b-input-group>
                  
                  </b-form-group>
                  
                </b-col>
                
                <b-col lg="4" class="pt-3">
                  <select class="form-sm-control float-right" v-model="sortType"
                    @change="sortChange">
                    <option value="asc">Тапсырыс номерi бойынша</option>
                    <option value="desc">Жаңа тапсырыс бойынша</option>
                  </select>
                </b-col>
                <b-col lg="2" class="pt-3 text-right">
                  <strong>саны:</strong> {{totalRowsProgress}}  
                </b-col>
                <b-table 
                  responsive="sm"
                  small 
                  ref="progressOrderTable"
                  striped hover 
                  :items="progressOrderProvider" 
                  :fields="fieldsNew"
                  :busy.sync="isBusy"
                  :current-page="currentPageProgress"
                  :per-page="perPage"
                  :table-variant="tableVariant"
                
                  selected-variant="danger"
                  
                  >
                  <template v-slot:table-busy>
                    <div class="text-center text-info my-2">
                      <b-spinner class="align-middle"></b-spinner>
                      <strong>Жүктелуде...</strong>
                    </div>
                  </template>
                  <template v-slot:cell(orderDate)='regInfo'>
                    <div class="text-center">
                      {{regInfo.item.orderDate}}<br>  
                      <small><strong>{{regInfo.item.regUserInfo}}</strong></small>  
                    </div>
                  </template>
                  <template v-slot:cell(orderActions)="row">
                      <b-button @click="row.toggleDetails" 
                        variant="outline-success" class="mr-1" size="sm"   >
                        <font-awesome-icon icon="list" title="ЛДСП көру"/>
                      </b-button>
                     
                      <b-button  
                        variant="outline-primary" class="mr-1" size="sm" >
                        <font-awesome-icon icon="pen" @click="editOrder(row.item.deliveryId)" title="Тапсырыс жөндеу"/>
                      </b-button>
                     
                  </template>
                  <template v-slot:row-details="row">
                    <b-card>
                      <b-row>
                        <b-col lg="6">
                          <h6>ЛДСП лер</h6>
                        </b-col>
                      </b-row>
                      <b-table striped :fields="listFields" hover table-variant="warning" :items="row.item.deliveryProducts">
                        <template v-slot:cell(listActions)="row">
                            <b-button 
                              @click="row.toggleDetails"
                              :disabled="row.item.relDetails.length>0 ? false : true " 
                              variant="outline-success" class="mr-1" size="sm"   >
                              <font-awesome-icon icon="list" title="Пвх жабу"/>
                            </b-button>
                           
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
                              <h6>пвх - лар</h6>
                              <b-table striped hover :fields="pvhFields" table-variant="danger" 
                                :items="row.item.relDetails">
                                 <template v-slot:cell(totalPrice)="t">
                                  {{t.item.totalPrice+(t.item.productCount*t.item.workPrice)}}
                                </template>
                                <template v-slot:cell(isDone)="pvh">
                                  {{pvh.item.isDone==0 ? 'Iстелмеген' : 'Iстелген'}}
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
              <div class="w-100">
                <b-pagination
                    v-model="currentPageProgress"
                    :total-rows="totalRowsProgress"
                    :per-page="perPage"
                    align="fill"
                    size="sm"
                    class="my-0"
                    
                ></b-pagination>
              </div>
             </b-row>                 
          </b-card-text>
        </b-tab>
        
        <b-tab title="Iстелген">
          <b-card-text>
            <b-row>
                <b-col lg="8">
                  <b-form-group
                    label="Iздеу"
                    label-cols-sm="1"
                    label-align-sm="left"
                    label-size="sm"
                    label-for="filterInputu"
                    class="mb-2 mt-3"
                  >
                    <b-input-group size="sm">
                      <b-form-input
                        v-model="filter"
                       
                        id="filterInputu"
                        placeholder="Iздеу"
                        @keyup="filterChange"
                        @change="filterChange"
                      ></b-form-input>
                      <b-button size="sm" class="ml-3"  @click="doSearch"> Iзде </b-button>
                    </b-input-group>
                  
                  </b-form-group>
                  
                </b-col>
                
                
                <b-col lg="4" class="pt-3 text-right">
                  <strong>саны:</strong> {{totalRowsDone}}  
                </b-col>
                <b-table 
                  responsive="sm"
                  small 
                  ref="doneOrderTable"
                  striped hover 
                  :items="doneOrderProvider" 
                  :fields="fieldsNew"
                  :busy.sync="isBusy"
                  :current-page="currentPageDone"
                  :per-page="perPage"
                  :table-variant="tableVariant"
                
                  selected-variant="danger"
                  
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
                  <template v-slot:row-details="row">
                    <b-card>
                      <b-row>
                        <b-col lg="6">
                          <h6>ЛДСП лер</h6>
                        </b-col>
                      </b-row>
                      <b-table striped :fields="listFields" hover table-variant="warning" :items="row.item.deliveryProducts">
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
                              <b-table striped hover :fields="pvhFields" table-variant="danger" 
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
              <div class="w-100">
                <b-pagination
                    v-model="currentPageDone"
                    :total-rows="totalRowsDone"
                    :per-page="perPage"
                    align="fill"
                    size="sm"
                    class="my-0"
                    
                ></b-pagination>
              </div>
             </b-row>  
          </b-card-text>
        </b-tab>
        <b-tab title="Кеңейтілген іздеу">
          <b-card-text v-show="tabIndex==3">
            <AdvancedOrderSearch :beginDate="beginDate"
               :endDate="endDate" :tabIndex="tabIndex"></AdvancedOrderSearch>  
          </b-card-text>
        </b-tab>
        <b-tab title="Касса есебi">
          <b-card-text v-show="tabIndex==4">
            <CurrentDayCalculation :beginDate='beginDate' :endDate='endDate'/>  
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
import AdvancedOrderSearch from './AdvancedOrderSearch'
import CurrentDayCalculation from './CurrentDayCalculation'
const moment = require('moment')
require('moment/locale/es')
export default {
  name: 'Deliveries',
  components: {
    Datepicker,
    AdvancedOrderSearch,
    CurrentDayCalculation
  },
  data(){
    return {
      isSmall:true,

      fieldsNew: [
          {
            key: 'orderNumber',
            label: 'Тапсырыс саны',
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
            label: 'Кесушiлер'
          },
          {
              key: 'listActions',
              label: 'Әрекеттер'
          }
      ],
     
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
      endDate: "",
      sortBy: 'orderNumber',
      sortDesc: false,
      sortType:"asc"
    }
  },
  methods:{
    sortChange(){
      this.refreshTables();
    },
    doSearch(){
      
      if(this.beginDate || this.filter.length>0){
        this.refreshTables();
      }
      else{
        this.$bvToast.toast("Іздеу мәндері енгiзнiз !!!", {
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
        .then(response=>{
          this.$bvToast.toast('Операция сәтті аяқталды.', {
              title: 'Жетістік',
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
            if(operationType==='completeOrder' || response.data==='complete'){
              
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
      this.sortType="asc";
      this.tabIndex=index;
      this.beginDate="";
      this.endDate="";
      this.filter="";
      this.refreshTables();
    },
    
    
    
    completeOrder(delId){
      //alert(delId);
      let warn = confirm("Сіз сенімдісіз бе ?");
      if(warn){
        let result = this.hasRole("OPERATOR");
        let result1 = this.hasRole("MANAGER");
        let result2 = this.hasRole("ADMIN");

        if(result || result1 || result2){

          this.changeStatus('done',delId);
        }
        else{
          this.$bvToast.toast("Зөвхөн хүргэгчид энэ үйлдэлийг хийх боломжтой", {
              title: 'Қате туралы ақпарат',
              autoHideDelay: 5000
          })  
        }
      }
    },
    ...mapActions([
        'setDeliveryFormObject',
        'setDeliveryRefs'
    ]),

    editOrder(pdeliveryId){
      this.setDeliveryRefs(7);
      this.setDeliveryRefs(11);
      this.setDeliveryRefs(12);
      this.setDeliveryRefs(13);
      this.setDeliveryRefs(14);

      let reqData = {deliveryId:pdeliveryId};
      //alert("something will happen ");
      this.setDeliveryFormObject(reqData);
      this.$router.push({name:'NewDelivery'});
    },

    newOrderProvider(ctx){
        if(this.tabIndex!=0)
          return ;
        ctx.orderType="new";
        ctx.sortType=this.sortType;
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
              title: 'Қате туралы ақпарат',
              autoHideDelay: 5000,
              variant:"danger"
          })  
          this.isBusy = false
          return []
        })
    },
    progressOrderProvider(ctx){
        if(this.tabIndex!=1)
          return ;
        ctx.orderType="progress";
       ctx.sortType=this.sortType;
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
              title: 'Қате туралы ақпарат',
              autoHideDelay: 5000,
              variant:"danger"
          })  
          this.isBusyProgress = false
          return []
        })
    },

    doneOrderProvider(ctx){
        if(this.tabIndex!=2)
          return ;
        ctx.orderType="done";
        ctx.sortType=this.sortType;
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
              title: 'Қате туралы ақпарат',
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
                  title: 'Қате туралы ақпарат',
                  autoHideDelay: 5000
              });
              this.deliveryDescription="";
              return ;

            }
            this.deliveryDescription="";
            let alertMsg = null;
            if("ignore"===type){
              alertMsg="Жетістіктай цуцлагдлаа"
            }
            if("done"===type){
              alertMsg="Жетістіктай хүргэлт хийгдлээ"
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
    },
   
    deleteOrder(delId){
      let warn = confirm("Сіз сенімдісіз бе ?");
      if(warn){
        let selectedRows=[];
        selectedRows.push({"id":delId});
        if(selectedRows.length>0){
          let o = new Object();
         
          o.selectedRows=selectedRows;

          o.type='del_delivery';

          axios.post(apiDomain+'/admin/delivery/deleteref',o,{headers:getHeader()})
            .then(()=>{
              this.refreshTables();  
            })
            .catch(error => {
                
                this.$bvToast.toast(error.message, {
                    title: 'алдаа',
                    variant:'danger',
                    autoHideDelay: 5000
                })
            }) 
        }
      }
      
    },
  },

  computed:{
    ...mapState([
        'loginedUser'
    ]),
  }
}
</script>

