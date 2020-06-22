<template>
     <b-row>
        <h6 class="pl-4">Жабыстыратын ПВХ-лар</h6>
        <div style="clear:left;" class="mb-1 w-100 d-inline-block pl-3"
                v-for="(detail,detailIndex) in relDetails" :key="detailIndex">
               
            <div class="float-left mb-1 pl-4">
                <Loading v-if="loading"/>
                <b-button size="sm" v-if="!loading" 
                    @dblclick="getPvh(detail.detailId)" variant="outline-danger">

                    <b-badge>
                        {{detail.colorName +' '+detail.measureName}} {{detail.detailId}}
                    </b-badge>
                    <b-badge  class="ml-1">
                        {{'Жумыс саны : '+detail.productCount}}
                    </b-badge>
                    <b-badge  class="ml-1" >
                        {{'Iстеген : '+detail.doneCount}} 
                    </b-badge>

                    <br v-if="detail.myUnconfirmedCount && detail.myUnconfirmedCount>0">
                    <b-badge 
                        v-if="detail.myUnconfirmedCount && detail.myUnconfirmedCount>0"
                        variant="success" class="ml-2 mt-1 float-right">
                        {{'Расталмаган : '+ detail.myUnconfirmedCount}}
                    </b-badge>
                    <br v-if="isClient">
                    <b-badge class="mr-1"  v-if="isClient">
                        <strong>{{detail.workName}} </strong>
                    </b-badge>
                    <b-badge block  variant="success" v-if="isClient">
                        ПВХ Багасы: <strong>{{detail.totalPrice}} </strong>
                    </b-badge>
                     <b-badge block class="ml-1" variant="success" v-if="isClient">
                        Жумыс Багасы: <strong>{{detail.workPrice}} </strong>
                    </b-badge>
                    <b-badge block class="ml-1" variant="warning" v-if="isClient">
                        Жалпы Багасы: <strong>{{detail.workPrice+detail.totalPrice}} </strong>
                    </b-badge>
                </b-button>
                
            </div>

            <div v-if="dStatus==1 && !isClient" class="float-left ml-1 margin-bottom-sm">
               
                <b-dropdown size="sm" class="ml-2" right
                        id="dropdown-text"   variant="danger" text=" ПВХ жабыстыру">
                    <b-dropdown-item-button

                            v-if="
                                ((!detail.myJudges || detail.myJudges.length==0) 
                                && Number(detail.productCount)-Number(detail.doneCount))>0
                                &&
                                ((!detail.myConfirmations || detail.myConfirmations.length==0) 
                                && Number(detail.productCount)-Number(detail.doneCount))>0
                            "
                            @click="donePvh(detail)">
                        Жабыстыру
                    </b-dropdown-item-button>

                    <b-dropdown-divider v-if="detail.myConfirmations 
                        && detail.myConfirmations.length>0"></b-dropdown-divider>
                    <b-dropdown-text 
                        v-if="detail.myConfirmations 
                            && detail.myConfirmations.length>0" class="text-danger" >
                        Растау 
                    </b-dropdown-text>
                        <b-dropdown-item-button   v-for="(confirmation,conIndex) in
                            detail.myConfirmations" :key="conIndex" 
                            @click="confirmDoneCount(confirmation.confirmId)">
                            {{confirmation.relUserInfo +": "+confirmation.doneCount}}
                        </b-dropdown-item-button>

                    <b-dropdown-divider v-if="detail.myJudges && detail.myJudges.length>0"></b-dropdown-divider>
                    <b-dropdown-text v-if="detail.myJudges && detail.myJudges.length>0" class="text-warning">
                        Расталыну
                    </b-dropdown-text>
                    <b-dropdown-item-button disabled v-for="(judge,jIndex) in
                        detail.myJudges" :key="jIndex">
                        {{judge.relUserInfo}}
                        </b-dropdown-item-button>
                </b-dropdown>
            </div>
            <div style="clear:left;" class="w-100 pl-5">
                <b-badge :variant="user.isActive==1 ? 'primary' : 'danger' " 
                    class="ml-1" style="cursor:pointer;" 
                    v-for="(user,userIndex) in detail.listUsers" :key="userIndex">
                    {{user.relUserInfo + ' ('+user.confirmedDoneCount+')'}}    
                </b-badge>
                
            </div>
            <!-- 'listUsers','userId','salary' -->
            <GluerSalaryPeriod 
                v-if="userId"
                :listUsers="detail.listUsers"
                :userId="userId"
                :detailId="detail.detailId"
                :calcSalary="calcSalary"
                :updateSalaryBalance="updateSalaryBalance"
              
            />
        </div>
      
       
    </b-row>  
</template>
<script>
import axios from 'axios';
import {apiDomain,getHeader} from "../config/config";
import Loading from './Loading';
import GluerSalaryPeriod from './GluerSalaryPeriod';
export default {
    name :"DelPvh",
    props:['relDetails',
    'dStatus','tableRefresher',
    'showToast','userId','calcSalary',
    'updateSalaryBalance','isClient'],
    components:{
        Loading,
        GluerSalaryPeriod
    },
    data(){
        return {
            loading:false
        }
    },
    methods:{
        confirmDoneCount(pvhConfirmId){
            this.loading=true;
            let warn = confirm("Сіз сенімдісіз бе ?");
            if(warn){
                axios.post(apiDomain+'/admin/work/gluer/confirmdonecount',{
                    'pvhConfirmId':pvhConfirmId,
                    
                },{headers:getHeader()})
                .then((response)=>{
                    this.loading=false;
                    let rText = response.data;
                   
                    let msg = rText =='success' ? 'Операция сәтті аяқталды.' : 'қате шықты қайта көрнiз !!!';
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
        donePvh(detail){
            
            if(!detail.productCount || Number(detail.productCount)==0){
                this.showToast("Жабсыру санын енгізіңіз.","danger");
                return ;
                
            }
            if(detail.myJudges || detail.myConfirmations) {
                if(detail.myJudges && detail.myJudges.length>0){
                    this.showToast(" Сiз растамағансыз немесе расталмағансыз ","danger");    
                    return ;
                }
                if(detail.myConfirmations && detail.myConfirmations.length>0){
                    this.showToast(" Сiз растамағансыз немесе расталмағансыз ","danger");    
                    return ;
                    
                }
            }
          
            if(detail.productCount && Number(detail.productCount )>0){
                //donecounttologined
                this.loading=true;
                axios.post(apiDomain+'/admin/work/gluer/donecounttologined',{
                    'donePvhCount':detail.productCount,
                    'detailId':detail.detailId

                },{headers:getHeader()})
                .then((response)=>{
                    this.loading=false;
                    let rText = response.data;
                    //alert(rText);
                    let msg = rText =='success' ? 'Операция сәтті аяқталды.' : 'қате шықты қайта көрнiз !!!';
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
        getPvh(detailId){
            if(this.dStatus>0){
                return;
            }
            this.loading=true;
            axios.post(apiDomain+'/admin/work/gluer/getpvhwork',{
                'detailId':detailId
            },{headers:getHeader()})
            .then((response)=>{
               this.loading=false;
               let rText = response.data;
               let msg = rText =='success' ? 'Операция сәтті аяқталды.' : " Сiз растамағансыз немесе расталмағансыз ";
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