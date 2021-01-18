<template> 
    <b-row>
        
        <b-col lg="12" class="py-3">
            <h3>
                <span class="bd-content-title">{{$t('enu.test.examModulTitle')}}</span>
            </h3>
        </b-col>
        
        <b-col lg="12" v-if="!isBlocked">
            <b-row>
                <b-col lg="9">
                    <h5 class="w-100 d-block text-info">
                        <label for="catName">{{$t('enu.ttest.questionList.chooseCategoryTxt')}}</label>   
                    </h5>
                    <basic-select v-if="$i18n.locale()=='kz'"
                        :options="catOptions"
                        :selected-option="selectedCat"
                        placeholder="select item"
                        @select="selectCat"
                    >
                    </basic-select>  
                     <basic-select v-if="$i18n.locale()=='ru'"
                        :options="catOptionsRu"
                        :selected-option="selectedCat"
                        placeholder="select item"
                        @select="selectCat"
                    >
                    </basic-select>    
                </b-col>
                <b-col v-if="timer!=null" lg="3">
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
            <b-button class="mt-3" size="sm" variant="outline-danger" block @click="beginExam">Ok</b-button>
            <b-button class="mt-2" size="sm" variant="outline-warning" block @click="hideModal">Cancel</b-button>
        </b-modal>
    </b-row>

</template>

<script>
import {apiDomain,getHeader} from "@/config/config";
import { BasicSelect } from 'vue-search-select';
import axios from 'axios';
import Vue from 'vue';

export default {
    name : "PExam",
    data(){
        return{
            questions : [],
            testGroups:[],
            testGroupsRu:[],
            selectedGroup:{},
            
            selectedCat:{},
            catOptions:[],
            catOptionsRu:[],
            time: null, //in seconds
            timer: null,
            isBlocked:false,
            isExamBegan:false
        }
    },
    components:{BasicSelect},
    

    methods:{
        overExam(){
            let conf = confirm(Vue.i18n.translate('system.confirmMsg'));
            if(conf){
                axios.post(apiDomain+'/admin/enu/ptest/buisness/loginedcomp',{userId:'beku'},{headers:getHeader()})
                .then(response=>{
                    if(response.data=='canNotComp'){
                        //alert("yess");
                        this.$bvToast.toast(Vue.i18n.translate('error.unFilled.Question'),{
                            toaster:'b-toaster-top-center',
                            variant:'danger',
                            title: Vue.i18n.translate('system.errorTitle'),
                            autoHideDelay: 5000
                        })
                    }
                    if(response.data=='success'){
                         let alertMsg = Vue.i18n.translate('system.successMsg');
                         this.$bvToast.toast(alertMsg, {
                            toaster:'b-toaster-top-center',
                            variant:'success',
                            title: Vue.i18n.translate('system.successTitle'),
                            autoHideDelay: 5000
                        });  
                    }
                        
                })
                .catch((err) => {
                        //console.error(err.message);
                        this.$bvToast.toast(Vue.i18n.translate('system.serverError') + " "+err.message , {
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
            
            if(qquestionId && qanswerId){
                if(parseInt(qanswerId)>0){
                     axios.post(apiDomain+'/admin/enu/ptest/buisness/postanswer',{questionId:qquestionId,answerId:qanswerId},{headers:getHeader()})
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
            if(this.selectedCat!=null){
                if(parseInt(this.selectedCat.value)>0){
                    axios.get(apiDomain+'/admin/enu/ptest/buisness/choosecat/'+this.selectedCat.value,
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
                        if(response.data=='userBlocked'){
                            this.questions=[];
                            this.isBlocked=true;
                        }
                        // if(response.data.transactionResult=='testBegan'){
                        //     this.questions=[];
                        //     this.$bvToast.toast(Vue.i18n.translate('enu.ttest.examModuleBegan'), {
                        //         toaster:'b-toaster-top-center',
                        //         variant:'danger',
                        //         title: Vue.i18n.translate('system.errorTitle'),
                        //         autoHideDelay: 5000
                        //     })
                        // }
                        if(response.data.transactionResult=='success' || 
                            response.data.transactionResult=='testBegan'){
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
                if(refType=='pCategory'){
                    response.data.forEach(c => {
                        this.catOptions.push({'value':c.catId,'text':c.catName,'groupId':c.groupId});    
                    });    
                    response.data.forEach(c => {
                        this.catOptionsRu.push({'value':c.catId,'text':c.catNameRu,'groupId':c.groupId});    
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
        this.getRef("pCategory");
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