<template>
     <b-row>
        <b-col lg="12">
            <hr>    
        </b-col>
        <b-col lg="12">
            <b-row class="mt-2">
                <b-col lg="4">
                    <datepicker format="yyyy-MM-dd"
                    :clear-button="true" @cleared="clearBegin" v-model="beginDate" placeholder="Басталу уақыты"></datepicker>
                </b-col>
                <b-col lg="4">
                    <datepicker 
                        format="yyyy-MM-dd" 
                    :clear-button="true" @cleared="clearEnd" v-model="endDate" placeholder="Аяқталу уақыты"></datepicker>
                </b-col>
                <b-col lg="4">
                    <select v-model="dStatus" @change="tableRefresher" class="d-block w-100 small-font" style="height:29px !important;">
                        <option value=0>--Жұмыс тандау--</option>
                        <option value=1>--Өз жұмысым--</option>
                        <option value=-1>--Күтiуде--</option>
                        <option value=2>--Істегенiм--</option>
                    </select>
                </b-col>
            </b-row>    
        </b-col> 
        <b-col lg="6" class="pt-3">
            <input 
                type="search"
                v-model="filter"
                @keyup="filterChange"
                @change="filterChange"
                id="filterInput"
                placeholder="Iздейтiн сөз"   
                class="form-control"
            >
            <b-button size="sm" class="ml-3" v-if="beginDate!='' || filter!=''"
                    @click="doSearch"> 
                Талдау 
            </b-button>
        </b-col>
    
        <b-col lg="3" class="pt-3 text-right">
            <strong>саны:</strong> {{totalRows}}  
        </b-col>
        <b-col lg="3" class="pt-3 text-right">
            <b-icon icon="arrow-repeat" id="salaryOk"
                href="#"
                tabindex="0"
                v-b-tooltip.hover
                @click="tableRefresher"
                title="Жүктеу"
                style="cursor:pointer"
                variant="success" font-scale="2"
            >
            </b-icon>  
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
            selected-variant="danger"    
        >
            <template v-slot:table-busy>
            <div class="text-center text-info my-2">
                <b-spinner class="align-middle"></b-spinner>
                <strong>Жүктелуде...</strong>
            </div>
            </template>
            <template v-slot:cell(workInfo)="del">
                <b-list-group>
                    <b-list-group-item v-if="loading">
                        <Loading/>
                    </b-list-group-item>
                    <b-list-group-item v-if="!loading">
                    
                        <b-button variant="outline-primary"  class="mb-2" size="sm">
                            {{del.item.orderNumber +'-'+ del.item.userInfo}}
                            <b-badge variant="warning" class="ml-2 mt-1">
                                {{del.item.listCount}}
                            </b-badge>
                            <b-badge variant="warning" class="ml-2 mt-1 float-right">
                                {{del.item.orderDate}}
                            </b-badge>
                            <br v-if="dStatus==Number(-1)">
                            <b-badge v-if="dStatus==Number(-1)">
                                {{del.item.waitingReason}}
                            </b-badge>
                        </b-button>

                        <b-button
                            @click="changeWaitingStatus(del.item.deliveryId)"
                            variant="outline-warning" size="sm" class="mb-2 ml-2">
                            {{dStatus=='-1' ? 'Жабыстыру' : 'Күттiру'}}
                        </b-button>
                        <div style="clear:left;" class="mt-1 w-100 d-inline-block pl-3"
                             v-for="(work,workIndex) in del.item.deliveryProducts" :key="workIndex">

                            <div class="float-left mb-1">
                                <b-button size="sm"  variant="outline-success">

                                    <b-badge>
                                        {{work.catName+'-'+work.colorName+'-'+work.measureName}}
                                    </b-badge>
                                    <b-badge  class="ml-1">
                                        {{'Саны : '+work.productCount}}
                                    </b-badge>
                                    <b-badge  class="ml-1">
                                        {{'Жапсырған : '+work.doneCount}}
                                    </b-badge>
                                    <br v-if="work.myUnconfirmedCount && work.myUnconfirmedCount>0">
                                    <b-badge 
                                        v-if="work.myUnconfirmedCount && work.myUnconfirmedCount>0"
                                        variant="danger" class="ml-2 mt-1 float-right">
                                        {{'Расталмаған  : '+ work.myUnconfirmedCount}}
                                    </b-badge>
                                </b-button>
                               
                            </div>

                            
                            <div style="clear:left;" class="w-100 pl-3">
                                <b-badge :variant="user.isActive==1 ? 'primary' : 'danger' " class="ml-1" style="cursor:pointer;" 
                                    v-for="(user,userIndex) in work.listUsers" :key="userIndex">
                                    {{user.relUserInfo + ' ('+user.confirmedDoneCount+')'}}    
                                </b-badge>
                            </div>
                            <!-- <DelListWork v-if="work.listWorks 
                                        && work.listWorks.length>0"
                                        :listWorks="work.listWorks" 
                                :dStatus="dStatus" 
                                :isPvh="true"
                                :showToast="showToast"
                                :tableRefresher="tableRefresher"></DelListWork> -->
                            <DelPvh
                                v-if="work.relDetails 
                                        && work.relDetails.length>0"                                         
                                :relDetails="work.relDetails" 
                                :dStatus="dStatus" 
                                :showToast="showToast"
                                :tableRefresher="tableRefresher"></DelPvh>
                        </div>
                        <hr/>
                        <b-badge variant="danger">
                            {{del.item.listStatus==0 
                                ? 'Жаңа' : del.item.listStatus=='1' ? 'Кесілуде' : 'Кесілді'}}
                         </b-badge>

                          <b-badge variant="warning" class="ml-1">
                            {{del.item.pvhStatus==0 
                                ? 'Жапсырылмаған' : del.item.pvhStatus==1 ? 'Жапсырылуда' : 'Жапсырылған'}}

                         </b-badge>
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
             title="Түснiктеме қосу" 
             no-close-on-backdrop
             lazy
             @hide="resetWform"
            
             hide-footer>
            <b-form v-on:submit.prevent="submitWaiting">
                  <b-form-row class="mb-3">
                      <b-col sm="auto" md="12">
                          <label for="productName">Түснiктеме</label>
                          <textarea required v-model="wForm.waitingReason" class="form-control"></textarea>
                      </b-col>
                  </b-form-row>
                  <b-button size="sm" type="submit" variant="primary" class="mr-2">Күттiру</b-button>
                  <b-button size="sm" type="reset" variant="danger">Жою</b-button>
              </b-form>    
          </b-modal>
    </b-row>  
</template>
<script>
import axios from 'axios';
import {apiDomain,getHeader} from "../config/config";
import Datepicker from 'vuejs-datepicker';
import Loading from './Loading';
// import DelListWork from './DelListWork';
import DelPvh from './DelPvh';


const moment = require('moment')
require('moment/locale/es')
export default {
    name :"Gluer",
    components:{
        Datepicker,
        Loading,
       //DelListWork,
        DelPvh
    },
    data(){
        return {
            loading:false,
            isSmall:true,
            fields: [
                {
                    key: 'workInfo',
                    label: 'Жұмыс ақпараты'
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
            
            dStatus:0,
            wForm:{
                deliveryId:-1,
                isWait:-1,
                waitingReason:""
            }
        }
    },
    methods:{
        postWaitingStatus(){
            let warn = confirm("Сіз сенімдісіз бе?");
            if(this.wForm.deliveryId>0 &&
                this.wForm.isWait!=-1 &&
                warn){
               
                axios.post(apiDomain+'/admin/work/slicer/changewaitingstatus',{
                    'deliveryId':this.wForm.deliveryId,
                    'isWait':this.wForm.isWait,
                    'waitingReason':this.wForm.waitingReason

                },{headers:getHeader()})
                .then((response)=>{
                    this.loading=false;
                    let rText = response.data;
                   
                    let msg = rText =='success' ? 'Операция сәтті өтті.' : 'қате шықты қайта көрнiз !!!';
                    let variant =rText =='success' ? 'success' : 'danger';

                    if(rText=='success'){
                        this.tableRefresher();  
                    }
                            

                    this.$bvModal.hide("waitingModal");
                    this.showToast(msg,variant);
                })
                .catch(error => {
                    //console.log(error.message)
                    this.showToast(error.message,"danger");
                });     
            }
         
        },
        changeWaitingStatus(deliveryId){
            this.wForm.deliveryId=deliveryId;
            if(this.dStatus==0 || this.dStatus==1){
                this.wForm.isWait=1;
                this.$bvModal.show("waitingModal");
                
            }
            if(this.dStatus==-1){
                this.wForm.isWait=0;
                this.postWaitingStatus();
                
            }
        },
        resetWform(){
            this.wForm={
                deliveryId:-1,
                isWait:-1,
                waitingReason:""
            }
        },
        submitWaiting(evt){
            evt.preventDefault();

            this.postWaitingStatus();
        },
        confirmDoneCount(confirmId){
            this.loading=true;
            let warn = confirm("Сіз сенімдісіз бе?");
            if(warn){
                axios.post(apiDomain+'/admin/work/slicer/confirmdonecount',{
                    'confirmId':confirmId,
                },{headers:getHeader()})
                .then((response)=>{
                    this.loading=false;
                    let rText = response.data;
                   
                    let msg = rText =='success' ? 'Операция сәтті өтті.' : 'қате шықты қайта көрнiз !!!';
                    let variant =rText =='success' ? 'success' : 'danger';

                    if(rText=='success')
                            this.tableRefresher();
                    this.showToast(msg,variant);
                })
                .catch(error => {
                    //console.log(error.message)
                    this.$bvToast.toast(error.message, {
                        title: 'Қате ақпараты',
                        autoHideDelay: 5000,
                        variant:"danger"
                    })
                });
            }
            
        },
        doneWork(work){
            
            if(!work.doingCount || Number(work.doingCount)==0){
                this.showToast("Жабсыру санын енгізіңіз.","danger");
                work.doingCoun=0;
                return ;
                
            }
            if(work.myJudges || work.myConfirmations) {
                if(work.myJudges && work.myJudges.length>0){
                    this.showToast("Сiз растамағансыз немесе расталмағансыз.","danger");    
                    return ;
                }
                if(work.myConfirmations && work.myConfirmations.length>0){
                    this.showToast("Сiз растамағансыз немесе расталмағансыз.","danger");    
                    return ;
                    
                }
            }
            if(Number(work.doingCount)>Number(work.productCount)-Number(work.doneCount)){
                this.showToast("Терiс сан кiргiздiнiз","danger");
                work.doingCoun=0;
                return ;
            }
            if(work.doingCount && Number(work.doingCount)>0){
                //donecounttologined
                this.loading=true;
                axios.post(apiDomain+'/admin/work/slicer/donecounttologined',{
                    'doneCount':work.doingCount,
                    'delProductId':work.relId

                },{headers:getHeader()})
                .then((response)=>{
                    this.loading=false;
                    let rText = response.data;
                    //alert(rText);
                    let msg = rText =='success' ?  'Операция сәтті өтті.' : 'қате шықты қайта көрнiз !!!';
                    let variant =rText =='success' ? 'success' : 'danger';

                    if(rText=='success')
                            this.tableRefresher();
                    this.showToast(msg,variant);
                })
                .catch(error => {
                    //console.log(error.message)
                    this.showToast(error.message,"danger");
                });
            }
        },
        getDelWork(itemId,type){
            if(this.dStatus>0){
                return;
            }
            this.loading=true;
            axios.post(apiDomain+'/admin/work/slicer/getlist',{
                'itemId':itemId,
                'type':type
            },{headers:getHeader()})
            .then((response)=>{
               this.loading=false;
               let rText = response.data;
               let msg = rText =='success' ? 'Операция сәтті өтті.' : " Сiз растамағансыз немесе расталмағансыз.!!!";
               let variant =rText =='success' ? 'success' : 'danger';

               if(rText=='success'){
                    this.tableRefresher();
               }
               else{
                   this.showToast(msg,variant);
               }
               //this.showToast(msg,variant);
            })
            .catch(error => {
                //console.log(error.message)
                this.$bvToast.toast(error.message, {
                    title: 'Қате ақпараты',
                    autoHideDelay: 5000,
                    variant:"danger"
                })
            });
        },
        getOrder(deliveryId){
            alert(deliveryId);
        },
        showToast(msg,variant){
            this.$bvToast.toast(
                msg,
                {
                    title:"Ақпарат",
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
            let promise = axios.post(apiDomain+'/admin/work/gluer/newworklist',ctx,{headers:getHeader()});
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
                    title: 'Ақпарат',
                    autoHideDelay: 5000,
                    variant:"danger"
                })  
                this.isBusy = false
                return []
            })
        }
        
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