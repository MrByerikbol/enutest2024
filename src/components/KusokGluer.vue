<template>
     <b-row>
        <b-col lg="12">
            <hr>    
        </b-col>
        <b-col lg="12">
            <b-row class="mt-2">
                <b-col lg="4">
                    <datepicker format="yyyy-MM-dd"
                    :clear-button="true" @cleared="clearBegin" v-model="beginDate" placeholder="Эхлэх огноо"></datepicker>
                </b-col>
                <b-col lg="4">
                    <datepicker 
                        format="yyyy-MM-dd" 
                    :clear-button="true" @cleared="clearEnd" v-model="endDate" placeholder="Дуусах огноо"></datepicker>
                </b-col>
                <b-col lg="4">
                    <select v-model="dStatus" @change="tableRefresher" class="d-block w-100 small-font" style="height:29px !important;">
                        <option value=0>--Ажил авах--</option>
                        <option value=1>--Миний ажлууд--</option>
                        <option value=-1>--Миний хүлээгдэж байгаа--</option>
                        <option value=2>--Миний хийсэн--</option>
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
                placeholder="Хайлт хийх утгаа оруулна уу"
               
                ></b-form-input>
                <b-button size="sm" class="ml-3" v-if="beginDate!='' || filter!=''"
                      @click="doSearch"> 
                    Шүүх 
                </b-button>
            </b-input-group>
            </b-form-group>
        </b-col>
    
        <b-col lg="4" class="pt-3 text-right">
            <strong>тоо:</strong> {{totalRows}}  
        </b-col>
        <b-table 
            
            small 
            ref="workTable"
            striped hover 
            :items="workProvider" 
            :fields="fields"
            :busy.sync="isBusy"
            :current-page="currentPage"
            :per-page="perPage"
            :table-variant="tableVariant"
            selected-variant="active"
            @row-dblclicked="item=>$set(item, '_showDetails', !item._showDetails)"
            >
            <template v-slot:table-busy>
            <div class="text-center text-info my-2">
                <b-spinner class="align-middle"></b-spinner>
                <strong>Ачаалж байна...</strong>
            </div>
            </template>
            <template v-slot:cell(workInfo)="del">
                <b-list-group>
                    <b-list-group-item v-if="loading">
                        <Loading/>
                    </b-list-group-item>
                    <b-list-group-item v-if="!loading">
                    
                        <b-button variant="outline-primary"  class="mb-2" size="sm">
                           {{del.item}}
                        </b-button>
                        <!-- <div style="clear:left;" class="mt-1 w-100 d-inline-block pl-3"
                             v-for="(work,workIndex) in del.item.deliveryProducts" :key="workIndex">

                            <div class="float-left mb-1">
                                <b-button size="sm" @dblclick="getDelWork(work.relId,'one')"  variant="outline-success">

                                    <b-badge>
                                        {{work.catName+'-'+work.colorName+'-'+work.measureName}}
                                    </b-badge>
                                    <b-badge  class="ml-1">
                                        {{'Тоо : '+work.productCount}}
                                    </b-badge>
                                    <b-badge  class="ml-1">
                                        {{'Зүссэн : '+work.doneCount}}
                                    </b-badge>
                                    <br v-if="work.myUnconfirmedCount && work.myUnconfirmedCount>0">
                                    <b-badge 
                                        v-if="work.myUnconfirmedCount && work.myUnconfirmedCount>0"
                                        variant="danger" class="ml-2 mt-1 float-right">
                                        {{'Миний баталагдаагүй зүсэлт : '+ work.myUnconfirmedCount}}
                                    </b-badge>
                                </b-button>
                               
                            </div>

                            <div v-if="dStatus==1" class="float-left ml-1 margin-bottom-sm">
                                <input type="number"
                                    style="width:60px"
                                    :max="Number(work.productCount)-Number(work.doneCount)"
                                    v-model=work.doingCount>
                                <b-dropdown size="sm" class="ml-2" right
                                     id="dropdown-text"   variant="danger" text="Зүсэх">
                                    <b-dropdown-item-button v-if="work.doingCount>0 
                                         && work.doingCount <= (Number(work.productCount)-Number(work.doneCount))"
                                         @click="doneWork(work)">
                                        Зүсэх
                                    </b-dropdown-item-button>
                                    <b-dropdown-divider v-if="work.myConfirmations 
                                        && work.myConfirmations.length>0"></b-dropdown-divider>
                                    <b-dropdown-text 
                                        v-if="work.myConfirmations 
                                            && work.myConfirmations.length>0" class="text-danger" >
                                        Миний батлах 
                                    </b-dropdown-text>
                                     <b-dropdown-item-button   v-for="(confirmation,conIndex) in
                                        work.myConfirmations" :key="conIndex" @click="confirmDoneCount(confirmation.confirmId)">

                                        {{confirmation.relUserInfo +":"+confirmation.doneCount}}
                                     </b-dropdown-item-button>

                                    <b-dropdown-divider v-if="work.myJudges && work.myJudges.length>0"></b-dropdown-divider>
                                    <b-dropdown-text v-if="work.myJudges && work.myJudges.length>0" class="text-warning">
                                        Намайг батлах
                                    </b-dropdown-text>
                                    <b-dropdown-item-button disabled v-for="(judge,jIndex) in
                                     work.myJudges" :key="jIndex">
                                        {{judge.relUserInfo}}
                                     </b-dropdown-item-button>
                                </b-dropdown>
                            </div>
                            <div style="clear:left;" class="w-100 pl-3">
                                <b-badge :variant="user.isActive==1 ? 'primary' : 'danger' " class="ml-1" style="cursor:pointer;" 
                                    v-for="(user,userIndex) in work.listUsers" :key="userIndex">
                                    {{user.relUserInfo + ' ('+user.confirmedDoneCount+')'}}    
                                </b-badge>
                            </div>

                            <DelListWork v-if="work.listWorks 
                                && work.listWorks.length>0" :listWorks="work.listWorks" 
                            :dStatus="dStatus" 
                            :isPvh="false"
                            :showToast="showToast"
                            :tableRefresher="tableRefresher"></DelListWork>
                        </div> -->
                        <!-- <b-badge variant="danger">
                            {{del.item.listStatus==0 
                                ? 'Шинэ' : del.item.listStatus=='1' ? 'Зүсэгдэж байна' : 'Зүсэгдсэн'}}
                        </b-badge>

                         <b-badge variant="warning" class="ml-1">
                            {{del.item.pvhStatus==0 
                                ? 'Наагдаагүй' : del.item.pvhStatus==1 ? 'Наагдаж байна' : 'Наагдсан'}}
                         </b-badge> -->
                    </b-list-group-item>  
                </b-list-group>
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

        <b-modal id="waitingModal"
             title="Тайлбар оруулах" 
             no-close-on-backdrop
             lazy
             @hide="resetWform"
            
             hide-footer>
            <b-form v-on:submit.prevent="submitWaiting">
                  <b-form-row class="mb-3">
                      <b-col sm="auto" md="12">
                          <label for="productName">Тайлбар</label>
                          <textarea required v-model="wForm.waitingReason" class="form-control"></textarea>
                      </b-col>
                  </b-form-row>
                  <b-button size="sm" type="submit" variant="primary" class="mr-2">Хүлээлгэх</b-button>
                  <b-button size="sm" type="reset" variant="danger">Арилгах</b-button>
              </b-form>    
          </b-modal>
    </b-row>  
</template>
<script>
import axios from 'axios';
import {apiDomain,getHeader} from "../config/config";
import Datepicker from 'vuejs-datepicker';
import Loading from './Loading';
import DelListWork from './DelListWork';


const moment = require('moment')
require('moment/locale/es')
export default {
    name :"KusokGluer",
    
    components:{
        Datepicker,
        Loading,
        DelListWork
    },
    data(){
        return {
            loading:false,
            isSmall:true,
            fields: [
                {
                    key: 'workInfo',
                    label: 'Ажлын мэдээлэл'
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
            
            dStatus:0
          
        }
    },
    methods:{
        
        
        
        
       
        showToast(msg,variant){
            this.$bvToast.toast(
                msg,
                {
                    title:"Мэдээлэл",
                    variant:variant,
                    toaster:'b-toaster-bottom-left'
                }
            );
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

            this.$refs.workTable.refresh();
        },
        //shine ajluudiin jagsaalt      
        workProvider(ctx){
            alert("ene bol busgui chinii zurag ");
            ctx.filter=this.filter;
            ctx.delStatus=this.dStatus;

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
            let promise = axios.post(apiDomain+'/admin/work/gluer/kusok/getkusokpvhwork',ctx,{headers:getHeader()});

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
                    title: 'Алдааны мэдээлэл',
                    autoHideDelay: 5000,
                    variant:"danger"
                })  
                this.isBusy = false
                return []
            })
        }
        
    },
    created(){
        alert("wht the fuck is happen");
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