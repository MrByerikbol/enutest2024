<template>    
    <b-col lg="12">
        <b-col lg="12 my-3">
            <h4>
                <!-- <span class="bd-content-title">{{$t('enu.teacherDocList.yearPlanning')}}</span> -->
            </h4>
        </b-col>
        <!-- <b-col lg="6" class="mb-3">
        
            <b-button variant="outline-success" size="sm" @click="toTeaherDoc"
                 class="mr-2" block>
               {{$t('teacherModule.newDocument')}}
            </b-button>
            
        </b-col> -->
     
        <b-row>
            <b-col lg="12" class="text-right">
               <div class="d-inline-block text-justify text-wrap" style="width: 20rem;">
                    {{$t('enu.teacherDocList.fillDocOfficialTitle')}}   
                </div>
            </b-col>
            <b-col lg="12" class="pt-2">
                <div class="d-block text-center">
                    <h6 class="mb-3">{{$t('enu.teacherDocList.fillDocH1Title')}}</h6>
                </div>
                <b-overlay :show="isBusy" rounded="sm">
                    <div class="table-responsive" id="printPage">
                        <table class="table table-bordered">
                            <tr>
                                <th class="align-middle text-center" rowspan="2">№</th>
                                <th class="align-middle text-center" rowspan="2" style="width:30%">{{$t('enu.teacherDocList.fillDocTheadWork')}}</th>
                                <th class="align-middle text-center" rowspan="2">{{$t('enu.teacherDocList.fillDocTheadMeasure')}}</th>
                                <th class="align-middle text-center" rowspan="2">{{$t('enu.teacherDocList.fillDocTheadDependency')}}</th>
                                <th class="align-middle text-center" colspan="2" >{{$t('enu.teacherDocList.fillDocDateTitle')}}</th>
                            </tr>
                            <tr>
                                <th class="align-middle text-center" style="width:18%;">{{$t('enu.teacherDocList.fillDocBeginDate')}}</th>
                                <th class="align-middle text-center" style="width:18%;">{{$t('enu.teacherDocList.fillDocEndDate')}}</th>
                            </tr>
                            <tbody v-for="(r,i) in fDocCats" :key="i">
                                <tr>
                                    
                                    <td colspan="6">
                                        <span class="font-weight-bold">
                                            {{i+1 +'.'+ $i18n.locale()=='kz' 
                                                ? r.categoryName : r.categoryNameRu}}</span>    
                                    </td>      
                                </tr>
                                <tr v-for="(d,di) in r.dFocs" :key="di">
                                    <td>{{d.rowCounter}}</td>
                                    <td>{{$i18n.locale()=='kz' ? d.docName : d.docNameRu}}</td>
                                    <td>{{$i18n.locale()=='kz' ? d.docDescription : d.docDescriptionRu}}</td>
                                    <td>
                                        <textarea v-if="!isPrint" v-model="fDocCats[i].dFocs[di].formDescription"
                                             class="form-control"></textarea>
                                       
                                    </td>
                                    <td>
                                       
                                        <datepicker v-if="!isPrint" format="dd-MM-yyyy"
                                            :clear-button="true"
                                            v-model="fDocCats[i].dFocs[di].beginDate"
                                        ></datepicker>
                                    </td>
                                    <td>
                                        <datepicker v-if="!isPrint" format="dd-MM-yyyy"
                                            :clear-button="true"
                                            v-model="fDocCats[i].dFocs[di].endDate"
                                        ></datepicker>
                                        
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="text-right font-weight-bold">
                            {{$t('enu.teacherDocList.FillDocSignature')+'______________________________________________________'}}
                        </div>
                    </div>
                    
                    
                    
                </b-overlay>
                <b-col lg="12">
                    <b-button class="float-right w-25 no-print" @click="saveYearPlan" variant="outline-info">{{$t('system.submitButtonText')}}</b-button>
                    <b-button class="float-right w-25 mr-2 no-print" @click="printPage" variant="outline-success">{{$t('enu.teacherDocList.FillDocPrint')}}</b-button>
                </b-col>
            </b-col>
        </b-row>
        
    </b-col>    
</template>

<script>
import {apiDomain,getHeader} from "@/config/config";

//import {EventBus} from '@/EventBus.js';
import axios from 'axios';
import Vue from "vue";
import Datepicker from 'vuejs-datepicker';
const moment = require('moment')
export default {
    components:{
        Datepicker
    },
    name : "TeacherDocList",

   
    data(){
        return{
            fDocCats :[],
            isBusy:false
        }
    },
    methods:{
      
        printPage(){
            // this.isBusy = true;
            // axios.post(apiDomain+'/admin/enu/kpibuisness/filldoccats',{},{headers:getHeader()})
            // .then((response) => {
            //     this.isBusy=false;
            //     this.$htmlToPaper("printPage");
            // })
            // .catch(error => {
            //     this.isBusy = false
            //     alert(error.message);
            //     return [];
            // });
            window.print();
            
        },
        toTeaherDoc(){
            this.$router.push({name:"TeacherDocList"});
        },
        // {{ $t('{count} bērns ::: {count} bērni ::: {count} bērnu', {count: 5}, 5) }}
        saveYearPlan(){
            let isReturn = false;
            
            this.fDocCats.forEach(f=>{
                f.dFocs.forEach(d=>{
                     if(parseInt(d.isNess)==1){
                        if(!d.beginDate || !d.endDate || !d.formDescription
                            || d.formDescription.length<1){
                             const h = this.$createElement
                             let docName=Vue.i18n.locale()=='kz' ? d.docName : d.docNameRu;
                             const $toastDocName = h(
                             'div',
                             {
                                //on: { click: () => this.$bvToast.hide(id) }
                                class:'font-weight-bold'
                             },
                                docName
                             );
                             const $toastHr = h('hr');
                             const $toastErrorMsg = h(
                                'span',{},Vue.i18n.translate('enu.teacherDocList.FillDocDocError')
                             );
                             this.$bvToast.toast([$toastDocName,$toastHr,$toastErrorMsg], {
                                toaster:'b-toaster-top-center',
                                variant:'danger',
                                title: Vue.i18n.translate('system.errorTitle'),
                                autoHideDelay: 5000,
                            
                            })   
                            isReturn=true;
                            return ;
                        }    
                    }
                });
                if(isReturn){
                    return;
                }
                if(parseInt(f.docCount)==1){
                    let filledDoc = 0;
                    f.dFocs.forEach(d=>{
                        //alert(d.beginDate);
                        
                        if(d.beginDate && d.endDate && d.formDescription &&
                            d.formDescription.length>0){

                            filledDoc++;
                        }
                    });
                    if(parseInt(filledDoc)==0){
                        const h = this.$createElement
                        let catName=Vue.i18n.locale()=='kz' ? f.categoryName : f.categoryNameRu;
                        const $toastDocName = h(
                        'div',
                        {
                        //on: { click: () => this.$bvToast.hide(id) }
                            class:'font-weight-bold'
                        },
                            catName
                        );
                        const $toastHr = h('hr');
                        const $toastErrorMsg = h(
                            'span',{},Vue.i18n.translate('enu.teacherDocList.FillDocCategoryError')
                        );
                        this.$bvToast.toast([$toastDocName,$toastHr,$toastErrorMsg], {
                            toaster:'b-toaster-top-center',
                            variant:'danger',
                            title: Vue.i18n.translate('system.errorTitle'),
                            autoHideDelay: 5000,
                        
                        })   
                        isReturn=true;
                        return ;
                    }
                }
                if(isReturn){
                    return;
                }
                
                
                
            });
            if(!isReturn){
                // al endi evdep jibereyik postyearplan
                this.isBusy = true;
                this.fDocCats.forEach(d=>{
                    d.dFocs.forEach(f=>{
                        if(f.beginDate!=null && f.endDate!=null){
                            f.beginDate=moment(f.beginDate).format('YYYY-MM-DD');
                            f.endDate=moment(f.endDate).format('YYYY-MM-DD');
                        }
                        else{
                            f.beginDate="";
                            f.endDate="";
                        }
                        
                    });
                });
                axios.post(apiDomain+'/admin/enu/kpibuisness/postyearplan',this.fDocCats,
                    {headers:getHeader()})
                .then((response) => {
                    if(response.data=='success'){
                        let alertMsg = Vue.i18n.translate('system.successMsg');

                        this.$bvToast.toast(alertMsg, {
                            toaster:'b-toaster-top-center',
                            variant:'success',
                            title: Vue.i18n.translate('system.successTitle'),
                            autoHideDelay: 5000
                        });
                    }
                    this.isBusy=false;
                    return;
                    
                })
                .catch(error => {
                    this.isBusy = false
                    alert(error.message);
                    return [];
                });
            }
        }
        
    },
    mounted(){
        this.isBusy = true;
        axios.post(apiDomain+'/admin/enu/kpibuisness/filldoccats',{},{headers:getHeader()})
        .then((response) => {
            this.isBusy=false;
           this.fDocCats=response.data;
        })
        .catch(error => {
            this.isBusy = false
            alert(error.message);
            return [];
        });
    }
    
}
</script>
<style scoped>
    @media print
{    
    .no-print, .no-print *
    {
        display: none !important;
    }
}
</style>
