<template> 
    <b-row>
        
        <b-col lg="12" class="py-3">
            <h3>
                <span class="bd-content-title">{{$t('enu.test.examModulTitle')}}</span>
            </h3>

        </b-col>
        
        <b-col lg="12" v-if="!isBlocked">
           
            <b-row>
                <b-col lg="5">
                   <h5 class="w-100 d-block text-info">
                        <label for="blockName">{{$t('enu.ttest.catForm.chooseGroup')}}</label>   
                    </h5> 
                   <basic-select v-if="$i18n.locale()=='kz'"
                        :options="testGroups"
                        :selected-option="selectedGroup"
                        placeholder="select item"
                        @select="selectGroup"
                        :isDisabled=true
                    >
                    </basic-select>
                    <basic-select v-if="$i18n.locale()=='ru'"
                        :options="testGroupsRu"
                        :selected-option="selectedGroup"
                        placeholder="select item"
                        @select="selectGroup"
                        :isDisabled=true
                    >
                    </basic-select>
                </b-col>
                <b-col lg="5">
                    <h5 class="w-100 d-block text-info">
                        <label for="catName">{{$t('enu.ttest.questionList.chooseCategoryTxt')}}</label>   
                    </h5>
                    <basic-select v-if="$i18n.locale()=='kz'"
                        :options="catOptions"
                        :selected-option="selectedCat"
                        placeholder="select item"
                        @select="selectCat"
                        :isDisabled=true
                    >
                    </basic-select>  
                     <basic-select v-if="$i18n.locale()=='ru'"
                        :options="catOptionsRu"
                        :selected-option="selectedCat"
                        placeholder="select item"
                        @select="selectCat"
                        :isDisabled=true
                    >
                    </basic-select>    
                </b-col>
                <b-col v-if="timer!=null" lg="2">
                    <h5 class="w-100 d-block text-info">
                        <label for="catName">{{$t('enu.test.examModule.examTime')}}</label>   
                    </h5>
                    <span class="font-weight-bold text-danger">
                        {{timeLeft}}
                    </span>
                </b-col>
            </b-row>
            
            <b-row>
                <b-col lg="12" class="text-right">
                    <b-button
                         v-if="showResultBtn"
                         
                         variant="outline-info" @click="showExamResult" size="sm" class="mr-2">
                        {{$i18n.locale()=='kz' ? 'Емтихан нәтижесін көрсету.' : 'Показать результат экзамена.'}}
                    </b-button>

                    <b-button
                         v-if="questions.length>0"
                         
                         variant="outline-danger" @click="overExam" size="sm">
                        {{$t('enu.ttest.examModule.overExam')}}
                    </b-button>
                </b-col>
            </b-row>
            <b-row v-if="notFully">
                <b-alert show variant="danger" class="w-100 my-2">
                    <h5 class="alert-heading">{{$t('notFully')}}</h5>
                    <hr>
                    <p v-for="(c,ci) in notFullyCats.unCats" :key="ci">
                        {{$i18n.locale()=='kz' ? c.catName + " : " + "("+c.questionCount+")"
                         : c.catNameRu + " : " + "("+c.questionCount+")"}}
                    </p>
                </b-alert>
            </b-row>


            <b-row>
                <b-alert 
                    show variant="danger"
                    v-if="examResult.result=='failed'"
                    class="w-100 my-2">
                    {{$t("studentTakenPoint")}} {{examResult.takenPoint}} <strong>{{$t("studentFailed")}}</strong>
                </b-alert>
                <b-alert 
                    show variant="success"
                    v-if="examResult.result=='passed'"
                    class="w-100 my-2">
                    {{$t("studentTakenPoint")}} {{examResult.takenPoint}} <strong>{{$t("studentPassed")}}</strong>
                </b-alert>
            </b-row>

        </b-col>
        <b-col lg="12" v-if="!isBlocked">
            <b-col lg="12" v-for="(q,i) in questions" :key="i">
                <hr>
                <b-row>
                    <b-col lg="12">
                        <h4>{{$i18n.locale()=='kz' ? q.question : q.questionRu}}</h4>
                    </b-col>
                </b-row>
                <b-row v-for="(a,ai) in q.testAnswers" :key="ai">
                    <b-col lg="12">
                        <input 
                            v-model="q.answerId"
                            :value=a.answerId
                            :id="'a'+a.answerId" type="radio" class="mr-1"
                            @change="chooseAnswer(i)"
                        />
                        <label :for="'a'+a.answerId">
                            {{$i18n.locale()=='kz' ? a.answer : a.answerRu}}
                        </label>
                    </b-col> 
                </b-row>
            </b-col>
        </b-col>
        <b-col lg="12" v-if="isBlocked" class="text-center">
            <h2 class="text-danger text-center">{{$t('enu.ttest.examModuleBlocked')}}</h2>
        </b-col>
         <b-modal ref="confirm-modal" hide-footer :title="$t('system.confirmMsg')" @hide="hideModal">
            <!-- <div class="d-block text-center">
                <h3>{{$t('system.confirmMsg')}}</h3>
            </div> -->
            <b-button class="mt-3" size="lg" variant="outline-danger" block @click="beginExam">Ok</b-button>
            <b-button class="mt-2" size="lg" variant="outline-warning" block @click="hideModal">Cancel</b-button>
        </b-modal>
    </b-row>

</template>

<script>
import {apiDomain,getHeader} from "@/config/config";
import { BasicSelect } from 'vue-search-select';
import axios from 'axios';
import Vue from 'vue';
import {mapState} from 'vuex';
//import Router from "@/router";
export default {
    name : "StudentExam",
    data(){
        return{
            questions : [],
            testGroups:[],
            testGroupsRu:[],
            selectedGroup:{},
            testCats:[],
            testCatsRu:[],
            selectedCat:{},
            catOptions:[],
            catOptionsRu:[],
            time: null, //in seconds
            timer: null,
            isBlocked:false,
            isExamBegan:false,
            notFully:false,
            notFullyCats:{},
            examResult:{},
            studentId:0,
            showResultBtn:false
        }
    },
    components:{BasicSelect},
    

    methods:{
       showExamResult(){
            if(this.studentId>0){
                //Router.push({ path: '/stresult/'+this.studentId});
                let a= document.createElement('a');
                a.target= '_blank';
                let hr = Vue.i18n.locale()=='kz' ? '/#/stresult/'+this.studentId : '/#/stresultru/'+this.studentId;
                a.href= hr;
                a.click();
            }
                
       },

        overExam(){
            let conf = confirm(Vue.i18n.translate('system.confirmMsg'));
            if(conf){
                let groupId = this.selectedGroup.value;
                axios.post(apiDomain+'/admin/enu/ttest/buisness/loginedcomp',{groupId:groupId},{headers:getHeader()})
                .then(response=>{
                    if(Number(response.data) > 0){

                         let alertMsg = Vue.i18n.translate('studentTestFinished');
                         this.$bvToast.toast(alertMsg, {
                            toaster:'b-toaster-top-center',
                            variant:'success',
                            title: Vue.i18n.translate('system.successTitle'),
                            autoHideDelay: 5000
                        });  
                        this.notFully=false;
                        this.notFullyCats={};

                        this.studentId = response.data;
                        this.showResultBtn = true;
                    }
                    if(response.data=='hasAnswers'){
                        if(!response.data.mainResult){
                            this.$bvToast.toast(Vue.i18n.translate('error.unFilled.Question'),{
                                toaster:'b-toaster-top-center',
                                variant:'danger',
                                title: Vue.i18n.translate('system.errorTitle'),
                                autoHideDelay: 5000
                            });
                        }
                    }
                })
                .catch((err) => {
                        
                        this.$bvToast.toast(Vue.i18n.translate('system.serverError') + err.message, {
                            toaster:'b-toaster-top-center',
                            variant:'danger',
                            title: Vue.i18n.translate('system.errorTitle'),
                            autoHideDelay: 5000
                        })
                    }
                )     
            }
        },
        hideModal() {       
            this.$refs['confirm-modal'].hide();
        },
        chooseAnswer(quesitonIndex){
            let qquestionId = this.questions[quesitonIndex].questionId;
            let qanswerId = this.questions[quesitonIndex].answerId;
            let choosenGroupId = this.selectedGroup.value;
            if(qquestionId && qanswerId && choosenGroupId){
                if(parseInt(qanswerId)>0){
                     axios.post(apiDomain+'/admin/enu/ttest/buisness/postanswer',{questionId:qquestionId,answerId:qanswerId,groupId:choosenGroupId},{headers:getHeader()})
                    .then(response=>{
                        if(response.data=='userBlocked'){
                            this.isBlocked=true;
                        }
                        if(response.data=='examCompleted'){
                            //alert("yess");
                            this.$bvToast.toast(Vue.i18n.translate('enu.ttest.examModuleCompleted'), {
                                toaster:'b-toaster-top-center',
                                variant:'danger',
                                title: Vue.i18n.translate('system.errorTitle'),
                                autoHideDelay: 5000
                            })
                        }
                        if(response.data=='cantShow'){
                            this.questions=[];
                            this.$bvToast.toast(Vue.i18n.translate('enu.ttest.examModuleCantShow'), {
                                toaster:'b-toaster-top-center',
                                variant:'danger',
                                title: Vue.i18n.translate('system.errorTitle'),
                                autoHideDelay: 5000
                            })
                        }
                        if(response.data.transactionResult=='timeOver' || response.data.transactionResult=='mustReset'){
                            this.$bvToast.toast(Vue.i18n.translate('enu.test.examModule.timeOver'), {
                                toaster:'b-toaster-top-center',
                                variant:'danger',
                                title: Vue.i18n.translate('system.errorTitle'),
                                autoHideDelay: 5000
                            })
                            clearInterval(this.timer);    
                        }
                    })
                    .catch(() => {
                            this.$bvToast.toast(Vue.i18n.translate('system.serverError'), {
                                toaster:'b-toaster-top-center',
                                variant:'danger',
                                title: Vue.i18n.translate('system.errorTitle'),
                                autoHideDelay: 5000
                            })
                        }
                    )     
                }
            }
            
        },
        decrementOrAlert () {
            if (this.time > 0) {
                this.time--
                return
            }
            
            this.$bvToast.toast(Vue.i18n.translate('enu.test.examModule.timeOver'), {
                toaster:'b-toaster-top-center',
                variant:'danger',
                title: Vue.i18n.translate('system.errorTitle'),
                autoHideDelay: 5000
            });
            clearInterval(this.timer)
            this.finishExam();
        },
        selectGroup(group){
            this.selectedGroup=group;
            if(Vue.i18n.locale()=='kz'){
                this.catOptions=this.testCats.filter(c=>parseInt(c.groupId)==parseInt(this.selectedGroup.value));
            }
            else{
                this.catOptionsRu=this.testCatsRu.filter(c=>parseInt(c.groupId)==parseInt(this.selectedGroup.value));
            }
            
        },
        selectCat(cat){
            this.selectedCat=cat;
            if(this.isExamBegan){
                this.beginExam();
            }
            else{
                this.$refs['confirm-modal'].show()
            }
            
        },
        beginExam(){
            this.isExamBegan=true;
            this.examResult={};

            if(this.selectedCat!=null){
                if(parseInt(this.selectedCat.value)>0){
                    axios.get(apiDomain+'/admin/enu/ttest/buisness/choosecat/'+this.selectedCat.value+'/'+this.selectedGroup.value+'/'+Vue.i18n.locale()+'',
                    {headers:getHeader()})
                    .then(response=>{
                        //alert(JSON.stringify(response.data));
                        this.hideModal();
                        if(response.data=='error'){
                           this.showResultBtn = true;
                           this.studentId=Number(this.loginedUser.userId); 
                        }
                        if(response.data.result=='examCompleted'){
                           this.showResultBtn = true;
                           this.studentId=Number(this.loginedUser.userId);
                           Vue.i18n.set(response.data.lan);
                        }
                        if(response.data.result=='cantShow'){
                            this.questions=[];
                            this.$bvToast.toast(Vue.i18n.translate('enu.ttest.examModuleCantShow'), {
                                toaster:'b-toaster-top-center',
                                variant:'danger',
                                title: Vue.i18n.translate('system.errorTitle'),
                                autoHideDelay: 5000
                            })
                            this.studentId=Number(this.loginedUser.userId);
                            Vue.i18n.set(response.data.lan);
                        }
                        if(response.data=='userBlocked'){
                            this.questions=[];
                            this.isBlocked=true;
                        }
                        if(response.data.transactionResult=='testBegan'){
                            this.questions=[];
                            this.$bvToast.toast(Vue.i18n.translate('enu.ttest.examModuleBegan'), {
                                toaster:'b-toaster-top-center',
                                variant:'danger',
                                title: Vue.i18n.translate('system.errorTitle'),
                                autoHideDelay: 5000
                            })
                        }
                        if(response.data.transactionResult=='success'){
                            
                            this.questions=response.data.questions;
                            if(response.data.lan!='no')
                                Vue.i18n.set(response.data.lan);

                            if(this.time==null){
                                this.time=parseInt(response.data.leftTime);
                                this.timer = setInterval(this.decrementOrAlert, 1000);
                            }
                            
                        }
                        if(response.data.transactionResult=='catError'){
                        this.$bvToast.toast(Vue.i18n.translate('enu.test.examModule.catError'), {
                                toaster:'b-toaster-top-center',
                                variant:'danger',
                                title: Vue.i18n.translate('system.errorTitle'),
                                autoHideDelay: 5000
                            })
                        }
                        

                    })
                    .catch(() => {
                            
                            this.$bvToast.toast(Vue.i18n.translate('system.serverError'), {
                                toaster:'b-toaster-top-center',
                                variant:'danger',
                                title: Vue.i18n.translate('system.errorTitle'),
                                autoHideDelay: 5000
                            })
                        }
                    )         
                }
            } 
        },
        getRef(refType){
            axios.post(apiDomain+'/admin/enu/ref/getdatalist',{refType:refType},{headers:getHeader()})
            .then(response=>{
                if(refType=='category'){
                    response.data.forEach(c => {
                        this.testCats.push({'value':c.catId,'text':c.catName,'groupId':c.groupId});    
                    });    
                    response.data.forEach(c => {
                        this.testCatsRu.push({'value':c.catId,'text':c.catNameRu,'groupId':c.groupId});    
                    });    
                }
                if(refType=='ttestCategory'){
                    response.data.forEach(c => {
                        this.testGroups.push({'value':c.groupId,'text':c.groupName});    
                    });
                    response.data.forEach(c => {
                        this.testGroupsRu.push({'value':c.groupId,'text':c.groupNameRu});    
                    });
                    
                }

                if(Vue.i18n.locale()=='kz'){
                    this.selectedGroup=this.testGroups[0];
                    this.selectedCat=this.testCats[0];
                    this.beginExam();
                }
                if(Vue.i18n.locale()=='ru'){
                    this.selectedGroup=this.testGroupsRu[0];
                    this.selectedCat=this.testCatsRu[0];
                    this.beginExam();
                }
            })
            .catch((e) => {
                // alert(e.message)
                //     this.$bvToast.toast(Vue.i18n.translate('system.serverError'), {
                //         toaster:'b-toaster-top-center',
                //         variant:'danger',
                //         title: Vue.i18n.translate('system.errorTitle'),
                //         autoHideDelay: 5000
                //     })
                }
            ) 
        }
    },
    created(){
        //alert("yes");
        this.getRef("category");
        this.getRef("ttestCategory");
    },
    computed:{
        timeLeft(){
            return `${this.minutes} минут ${this.seconds} секунд`;
        },
        minutes() {
            return String(Math.floor(this.time / 60)).padStart(2, '0')
        },
        seconds(){
            return String(this.time % 60).padStart(2, '0')
        },
        
        ...mapState([
            'loginedUser'
        ])
    
    }

}
</script>
<style scoped>

</style>