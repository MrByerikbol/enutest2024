<template>
     <b-row>
        <h6 class="pl-4">Хийгдэх нэмэлт ажлууд</h6>
        <div style="clear:left;" class="mt-1 w-100 d-inline-block pl-3"
                v-for="(work,workIndex) in listWorks" :key="workIndex">
               
            <div class="float-left mb-1 pl-4">
                <Loading v-if="loading"/>
                <b-button size="sm" v-if="!loading" @dblclick="getListWork(work.workId)" variant="outline-warning">

                    <b-badge>
                        {{work.workName}}
                    </b-badge>
                    <b-badge  class="ml-1">
                        {{'Ажлын тоо : '+work.workCount}}
                    </b-badge>
                    <b-badge  class="ml-1" >
                        {{'Хийсэн : '+work.doneWorkCount}}
                    </b-badge>

                    <br v-if="work.myUnconfirmedCount && work.myUnconfirmedCount>0">
                    <b-badge 
                        v-if="work.myUnconfirmedCount && work.myUnconfirmedCount>0"
                        variant="danger" class="ml-2 mt-1 float-right">
                        {{'Миний баталагдаагүй ажил : '+ work.myUnconfirmedCount}}
                    </b-badge>
                </b-button>
                
            </div>

            <div v-if="dStatus==1 && !isPvh" class="float-left ml-1 margin-bottom-sm">
                <input type="number"
                    style="width:60px"
                    :max="Number(work.workCount)-Number(work.doneWorkCount)"
                    v-model=work.doingCount>
                <b-dropdown size="sm" class="ml-2" right
                        id="dropdown-text"   variant="warning" text="Хийх">
                    <b-dropdown-item-button v-if="work.doingCount>0 
                            && work.doingCount <= (Number(work.workCount)-Number(work.doneWorkCount))"
                            @click="doneWork(work)">
                        Хийх
                    </b-dropdown-item-button>

                    <b-dropdown-divider v-if="work.myConfirmations 
                        && work.myConfirmations.length>0"></b-dropdown-divider>
                    <b-dropdown-text 
                        v-if="work.myConfirmations 
                            && work.myConfirmations.length>0" class="text-danger" >
                        Миний батлах 
                    </b-dropdown-text>
                        <b-dropdown-item-button   v-for="(confirmation,conIndex) in
                            work.myConfirmations" :key="conIndex" 
                            @click="confirmDoneCount(confirmation.confirmId)">
                            {{confirmation.relUserInfo +": "+confirmation.doneCount}}
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
            <div style="clear:left;" class="w-100 pl-5">
                <b-badge :variant="user.isActive==1 ? 'primary' : 'danger' " 
                    class="ml-1" style="cursor:pointer;" 
                    v-for="(user,userIndex) in work.listUsers" :key="userIndex">
                    {{user.relUserInfo + ' ('+user.confirmedDoneCount+')'}}    
                </b-badge>
            </div>
            <!-- 'listUsers','userId','salary' -->
            <SlicerSalaryPeriod v-if="userId"
                :listUsers="work.listUsers"
                :userId="userId"
                :isList="false"
                :workId="work.workId"
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
import SlicerSalaryPeriod from './SlicerSalaryPeriod';
export default {
    name :"DelListWork",
    props:['listWorks','dStatus',
        'tableRefresher','showToast',
        'updateSalaryBalance',
        'isPvh','userId','deliveryIndex','listIndex','calcSalary'],
    components:{
        Loading,
        SlicerSalaryPeriod
    },
    data(){
        return {
            loading:false
        }
    },
    methods:{
      
        confirmDoneCount(workConfirmId){
            this.loading=true;
            let warn = confirm("Итгэйлтэй байна уу ?");
            if(warn){
                axios.post(apiDomain+'/admin/work/worker/confirmdonecount',{
                    'workConfirmId':workConfirmId,
                    
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
        doneWork(work){
            
            if(!work.doingCount || Number(work.doingCount)==0){
                this.showToast("Та зүссэх тоогоо оруулна уу.","danger");
                work.doingCoun=0;
                return ;
                
            }
            if(work.myJudges || work.myConfirmations) {
                if(work.myJudges && work.myJudges.length>0){
                    this.showToast("Та баталгаажуулалт хийгээгүй эсвэл баталагдаагүй байна.","danger");    
                    return ;
                }
                if(work.myConfirmations && work.myConfirmations.length>0){
                    this.showToast("Та баталгаажуулалт хийгээгүй эсвэл баталагдаагүй байна.","danger");    
                    return ;
                    
                }
            }
            if(Number(work.doingCount)>Number(work.workCount)-Number(work.doneWorkCount)){
                this.showToast("Та буруу тоо оруулсан байна","danger");
                work.doingCount=0;
                return ;
            }
            if(work.doingCount && Number(work.doingCount)>0){
                //donecounttologined
                this.loading=true;
                axios.post(apiDomain+'/admin/work/worker/donecounttologined',{
                    'doneWorkCount':work.doingCount,
                    'workId':work.workId

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
        getListWork(workId){
            if(this.dStatus>0){
                return;
            }
            this.loading=true;
            axios.post(apiDomain+'/admin/work/worker/getlistwork',{
                'workId':workId
            },{headers:getHeader()})
            .then((response)=>{
               this.loading=false;
               let rText = response.data;
               let msg = rText =='success' ? 'Үйлдэл амжилттай боллоо.' : " Та баталгаажуулаагүй "
                    +" хйисэн ажлууд эсвэл танд баталгаа хийлгээгүй ажлууд байна !!!";
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