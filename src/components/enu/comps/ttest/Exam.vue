<template> 
    <b-row class="pt-3">
        <b-col lg="12" class="mb-3 pl-4">
            <b-icon class="mb-3" icon="house" scale="2" variant="info" @click="toTrad" style="color: #7952b3;"></b-icon>
        </b-col>
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
                    >
                    </basic-select>
                    <basic-select v-if="$i18n.locale()=='ru'"
                        :options="testGroupsRu"
                        :selected-option="selectedGroup"
                        placeholder="select item"
                        @select="selectGroup"
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
                        :isDisabled="!selectedGroup.value"
                    >
                    </basic-select>  
                     <basic-select v-if="$i18n.locale()=='ru'"
                        :options="catOptionsRu"
                        :selected-option="selectedCat"
                        placeholder="select item"
                        @select="selectCat"
                        :isDisabled="!selectedGroup.value"
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
                    <p v-for="(c,ci) in notFullyCats" :key="ci">
                        {{$i18n.locale()=='kz' ? c.catName + " : " + "("+c.questionCount+")"
                         : c.catNameRu + " : " + "("+c.questionCount+")"}}
                    </p>
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
            <b-button class="mt-3" size="md" variant="outline-danger" block @click="beginExam">Ok</b-button>
            <b-button class="mt-2" size="md" variant="outline-warning" block @click="hideModal">Cancel</b-button>
        </b-modal>


        <b-modal ref="complete-confirm-modal" size="lg" hide-footer :title="$t('sureComplete')" @hide="hideCompModal">
            <div class="d-block text-center">
                <h5 class="text-left text-success">{{$t("filledTestCats")}}</h5>
                <b-row class="mb-4">
                    <b-col lg="5" class="text-left"><strong>{{$t("testCatName")}}</strong></b-col>
                    <b-col lg="3" class="text-center"><strong>{{$t("testCount")}}</strong></b-col>
                    <b-col lg="2" class="text-center"><strong>{{$t("FilledTestCount")}}</strong></b-col>
                    <b-col lg="2" class="text-center text-danger"><strong>{{$t("unFilledTestCount")}}</strong></b-col>
                </b-row>
                <b-row v-for="(t,i) in notFullyCats" :key="i">
                    <b-col lg="5" class="text-left">
                        {{$i18n.locale()=='kz' ? t.catName : t.catNameRu}}
                    </b-col>
                    <b-col lg="3" class="text-center">{{t.dbQuestionCount}}</b-col>
                    <b-col lg="2" class="text-center">{{t.answeredQuestionCount}}</b-col>
                    <b-col lg="2" class="text-center text-danger">{{Number(t.dbQuestionCount)-Number(t.answeredQuestionCount)}}  </b-col>
                    <b-col lg="12"><hr></b-col>
                </b-row>

                
                <h5 class="text-left text-danger">{{$t("unfilledTestCats")}}</h5>
                <hr>
                <b-row v-for="(t,i) in leftCats" :key="i">
                    <b-col lg="12" class="text-left text-danger">
                        {{Number(i+1)+'.'+ t.text}}
                    </b-col>                   
                </b-row>
                    
            </div> 
            <b-button class="mt-3" size="md" variant="outline-success" block @click="completeExam">{{$t("confirmYes")}}</b-button>
            <b-button class="mt-2" size="md" variant="outline-danger" block @click="hideCompModal">{{$t("confirmNo")}}</b-button>
        </b-modal>


    </b-row>

</template>

<script>
import {apiDomain,getHeader} from "@/config/config";
import { BasicSelect } from 'vue-search-select';
import axios from 'axios';
import Vue from 'vue';

export default {
    name : "Exam",
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
            notFullyCats:[],
            leftCats:[]
        }
    },
    components:{BasicSelect},
    

    methods:{
        toTrad(){
            window.location.href = "/#/testwelcome";         
        },
        overExam(){
            let groupId = this.selectedGroup.value;
            //alert(groupId)
            if(groupId){
                axios.post(apiDomain+'/admin/enu/ttest/buisness/loginedcompinfo',{groupId:groupId},{headers:getHeader()})
                .then(response=>{
                    this.notFullyCats=response.data.unCats;
                    let ltestCats = [];
                    if(Vue.i18n.locale()=='kz'){
                        ltestCats=this.testCats.filter(c=>parseInt(c.groupId)==parseInt(this.selectedGroup.value));
                    }
                    else{
                        ltestCats=this.testCatsRu.filter(c=>parseInt(c.groupId)==parseInt(this.selectedGroup.value));
                    }
                    if(this.notFullyCats && this.notFullyCats!=null){
                        ltestCats.forEach(t=>{
                            let canPush = true;
                            this.notFullyCats.forEach(n=>{
                                if(Number(t.value)==Number(n.catId)){
                                    canPush=false;
                                    return;
                                }
                            })

                            if(canPush){
                                if(this.leftCats.filter(l=>Number(l.value)==Number(t.value)).length==0){
                                    this.leftCats.push(t);
                                }
                            }

                        })
                    }
                    
                    this.$refs["complete-confirm-modal"].show();
                })
                .catch((err) => {
                        
                        this.$bvToast.toast(Vue.i18n.translate('system.serverError') + " "+err.message, {
                            toaster:'b-toaster-top-center',
                            variant:'danger',
                            title: Vue.i18n.translate('system.errorTitle'),
                            autoHideDelay: 5000
                        })
                    }
                )     
            }
                
            
        },
        completeExam(){
            let groupId = this.selectedGroup.value;
            if(groupId){
                axios.post(apiDomain+'/admin/enu/ttest/buisness/loginedcomp',{groupId:groupId},{headers:getHeader()})
                .then(response=>{
                    if(response.data=='success'){
                        let alertMsg = Vue.i18n.translate('studentTestFinished');
                            this.$bvToast.toast(alertMsg, {
                            toaster:'b-toaster-top-center',
                            variant:'success',
                            title: Vue.i18n.translate('system.successTitle'),
                            autoHideDelay: 5000
                        });  
                    }
                    this.$refs["complete-confirm-modal"].hide();
                })
                .catch((err) => {
                        
                        this.$bvToast.toast(Vue.i18n.translate('system.serverError') + " "+err.message, {
                            toaster:'b-toaster-top-center',
                            variant:'danger',
                            title: Vue.i18n.translate('system.errorTitle'),
                            autoHideDelay: 5000
                        })
                    }
                )     
            }
            
        },
        hideCompModal() {       
            this.notFullyCats=[];
            this.leftCats=[];
            this.$refs['complete-confirm-modal'].hide();
        },
        hideModal() {       
            this.$refs['confirm-modal'].hide();
        },
        chooseAnswer(quesitonIndex){
            let qquestionId = this.questions[quesitonIndex].questionId;
            let qanswerId = this.questions[quesitonIndex].answerId;
            let choosenGroupId = this.selectedGroup.value;
            //alert(JSON.stringify(this.selectedGroup));
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
                            this.isBlocked=true;
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
                            this.completeExam(); 
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
            this.completeExam();
            clearInterval(this.timer)
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
            this.questions=[];
            this.isExamBegan=true;
            if(this.selectedCat!=null){
                if(parseInt(this.selectedCat.value)>0){
                    axios.get(apiDomain+'/admin/enu/ttest/buisness/choosecat/'+this.selectedCat.value+'/'+this.selectedGroup.value+'/'+Vue.i18n.locale()+'',
                    {headers:getHeader()})
                    .then(response=>{
                        
                        this.hideModal();
                        
                        if(response.data=='cantShow'){
                            this.questions=[];
                            this.$bvToast.toast(Vue.i18n.translate('enu.ttest.examModuleCantShow'), {
                                toaster:'b-toaster-top-center',
                                variant:'danger',
                                title: Vue.i18n.translate('system.errorTitle'),
                                autoHideDelay: 5000
                            })
                        }
                        if(response.data=='userBlocked' || response.data=='examCompleted'){

                            this.questions=[];
                            this.isBlocked=true;
                        }
                        if(response.data.transactionResult=='hasUncompleted'){
                            this.questions=[];

                            this.$bvToast.toast(Vue.i18n.translate('enu.ttest.hasUncompleted'), {
                                toaster:'b-toaster-top-center',
                                variant:'danger',
                                title: Vue.i18n.translate('system.errorTitle'),
                                autoHideDelay: 5000
                            })
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
    },
    created(){
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
        }    
    }

}
</script>
<style scoped>

</style>