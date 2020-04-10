<template>
     <b-row>
        <h6 class="pl-4">Наах ПВХ-нууд</h6>
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
                        {{'Ажлын тоо : '+detail.productCount}}
                    </b-badge>
                    <b-badge  class="ml-1" >
                        {{'Хийсэн : '+detail.doneCount}}
                    </b-badge>

                    <br v-if="detail.myUnconfirmedCount && detail.myUnconfirmedCount>0">
                    <b-badge 
                        v-if="detail.myUnconfirmedCount && detail.myUnconfirmedCount>0"
                        variant="success" class="ml-2 mt-1 float-right">
                        {{'Миний баталагдаагүй наалт : '+ detail.myUnconfirmedCount}}
                    </b-badge>
                </b-button>
                
            </div>

            <div v-if="dStatus==1" class="float-left ml-1 margin-bottom-sm">
               
                <b-dropdown size="sm" class="ml-2" right
                        id="dropdown-text"   variant="danger" text="Пвх наах">
                    <b-dropdown-item-button v-if="Number(detail.productCount)-Number(detail.doneCount)>0"
                            @click="donePvh(detail)">
                        Наах
                    </b-dropdown-item-button>

                    <b-dropdown-divider v-if="detail.myConfirmations 
                        && detail.myConfirmations.length>0"></b-dropdown-divider>
                    <b-dropdown-text 
                        v-if="detail.myConfirmations 
                            && detail.myConfirmations.length>0" class="text-danger" >
                        Миний батлах 
                    </b-dropdown-text>
                        <b-dropdown-item-button   v-for="(confirmation,conIndex) in
                            detail.myConfirmations" :key="conIndex" 
                            @click="confirmDoneCount(confirmation.confirmId)">
                            {{confirmation.relUserInfo +": "+confirmation.doneCount}}
                        </b-dropdown-item-button>

                    <b-dropdown-divider v-if="detail.myJudges && detail.myJudges.length>0"></b-dropdown-divider>
                    <b-dropdown-text v-if="detail.myJudges && detail.myJudges.length>0" class="text-warning">
                        Намайг батлах
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
    props:['relDetails','dStatus','tableRefresher','showToast','userId','calcSalary'],
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
            let warn = confirm("Итгэйлтэй байна уу ?");
            if(warn){
                axios.post(apiDomain+'/admin/work/gluer/confirmdonecount',{
                    'pvhConfirmId':pvhConfirmId,
                    
                },{headers:getHeader()})
                .then((response)=>{
                    this.loading=false;
                    let rText = response.data;
                   
                    let msg = rText =='success' ? 'Үйлдэл амжилттай боллоо.' : 'Алдаа үүслээ дахин оролдоно уу !!!';
                    let variant =rText =='success' ? 'success' : 'danger';

                    if(rText=='success')
                        this.tableRefresher();
                    this.showToast(msg,variant);
                })
                .catch(error => {
                    //console.log(error.message)
                    this.$bvToast.toast(error.message, {
                        title: 'Алдааны мэдээлэл',
                        autoHideDelay: 5000,
                        variant:"danger"
                    })
                });
            }
            
        },
        donePvh(detail){
            
            if(!detail.productCount || Number(detail.productCount)==0){
                this.showToast("Та зүссэх тоогоо оруулна уу.","danger");
                return ;
                
            }
            if(detail.myJudges || detail.myConfirmations) {
                if(detail.myJudges && detail.myJudges.length>0){
                    this.showToast("Та баталгаажуулалт хийгээгүй эсвэл баталагдаагүй байна.","danger");    
                    return ;
                }
                if(detail.myConfirmations && detail.myConfirmations.length>0){
                    this.showToast("Та баталгаажуулалт хийгээгүй эсвэл баталагдаагүй байна.","danger");    
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
                    let msg = rText =='success' ? 'Үйлдэл амжилттай боллоо.' : 'Алдаа үүслээ дахин оролдоно уу !!!';
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
               let msg = rText =='success' ? 'Үйлдэл амжилттай боллоо.' : " Та баталгаажуулаагүй "
                    +" наалтууд эсвэл танд баталгаа наалтууд байна !!!";
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
                    title: 'Алдааны мэдээлэл',
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