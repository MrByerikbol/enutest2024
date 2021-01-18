<template>
    <b-row>
        <b-modal id="questionModal" :title="$t('system.newRecord')"
            @hide="modalHide" hide-footer size="huge" @show="getRefs('category')" @hidden="clearForm">
            <b-form v-on:submit.prevent="submitForm">
                <b-form-row class="mb-3">
                    <b-col sm="auto" md="12">
                        <label for="catId">{{$t('enu.ttest.questionList.chooseCategoryTxt')}}</label>
                        <select id="catId"
                            @change="questionForm.factorId=0"

                            v-model="questionForm.catId" class="form-control">
                            <option value=0>{{$t('comboChooseText')}}</option>
                            <option v-for="(c,k) in testCats" 
                                :key="k" :value=c.catId>
                                {{$i18n.locale()=='kz' ? c.catName : c.catNameRu}}
                            </option>
                        </select>
                    </b-col>

                    <b-col sm="auto" md="12" v-if="
                        factors.filter(f=>Number(f.catId)==Number(questionForm.catId)).length>0
                    ">
                       <label for="factorId">{{$t('enu.ptest.factorForm.name')}}</label>
                        <select id="factorId"
                            v-model="questionForm.factorId" class="form-control">
                            <option value=0>{{$t('comboChooseText')}}</option>
                            <option v-for="(f,fi) in factors.filter(f=>Number(f.catId)==Number(questionForm.catId))" 
                                :key="fi" :value=f.factorId>
                                {{$i18n.locale()=='kz' ? f.factorName : f.factorNameRu}}

                            </option>
                        </select>
                    </b-col>

                    <b-col sm="auto" md="12">
                        <label for="question">{{$t('enu.ttest.questionForm.enterQuestionTxt')}}</label>
                        <b-form-textarea
                            id="question"
                            v-model="questionForm.question"
                            required
                            :placeholder="$t('enu.ttest.questionForm.enterQuestionTxt')"
                        ></b-form-textarea>
                    </b-col>
                    <b-col sm="auto" md="12">
                        <label for="questionRu">{{$t('enu.ttest.questionForm.enterQuestionRuTxt')}}</label>
                        <b-form-textarea
                            id="questionRu"
                            v-model="questionForm.questionRu"
                            required
                            :placeholder="$t('enu.ttest.questionForm.enterQuestionRuTxt')"
                        ></b-form-textarea>
                    </b-col>

                    <b-col sm="auto" md="12">
                        <label for="point">{{$t('enu.ttest.questionList.testPoint')}}</label>
                        <b-form-input
                            id="additionalPoint"
                            v-model="questionForm.point"
                            type="number"
                            required
                            step="any" 
                            :placeholder="$t('enu.ttest.questionList.testPoint')"
                        ></b-form-input>
                    </b-col>
                    <b-col sm="auto" md="12">
                        <h5 for="point">{{$t('enu.ttest.questionForm.enterAnswers')}}</h5>
                        <b-button @click="addAnswerField" size="sm" block variant="outline-success my-3">{{$t('enu.ttest.questionForm.addField')}}</b-button>

                        <b-row v-for="(a,index) in questionForm.testAnswers" :key="index">
                            <b-col lg="3">
                                <span class="text-info w-100">{{$t('enu.test.questionForm.enterAnswer')}}</span>
                                <b-form-textarea class="mt-2" v-model="questionForm.testAnswers[index].answer"></b-form-textarea>
                            </b-col>
                            <b-col lg="3">
                                <span class="text-info w-100">{{$t('enu.test.questionForm.enterAnswerRu')}}</span>
                                <b-form-textarea class="mt-2" v-model="questionForm.testAnswers[index].answerRu"></b-form-textarea>
                            </b-col>
                            <b-col lg="2">
                                <span class="text-info w-100">{{$t('enu.ptest.questionForm.answerPoint')}}</span>
                                <input type="number" 
                                    class="form-control mt-2" v-model="questionForm.testAnswers[index].answerPoint"/>
                            </b-col>
                            <b-col lg="2">
                                <span class="text-info w-100">{{$t('enu.test.questionForm.isAnswerCorrect')}}</span>
                                <select v-model="questionForm.testAnswers[index].isCorrect" class="w-100 form-control mt-2">
                                    <option value=0>
                                        {{$t('enu.test.questionForm.no')}}
                                    </option>
                                    <option value=1>
                                        {{$t('enu.test.questionForm.yes')}}
                                    </option>
                                </select>
                            </b-col>
                            <b-col lg="2" class="text-center">
                                <span class="d-block text-info w-100 ">{{$t('system.deleteButton')}}</span>
                                <b-button size="sm" @click="removeField(index)" variant="danger" class="mt-2">
                                    <b-icon icon="x-circle"></b-icon>
                                </b-button>
                            </b-col>
                        </b-row>
                    </b-col>
                </b-form-row>
                <b-button type="submit" variant="primary" class="mr-2">{{$t('system.submitButtonText')}}</b-button>
                <b-button type="reset" variant="danger">{{$t('system.cancelButtonText')}}</b-button>
            </b-form>    
        </b-modal>
        <b-modal ref="confirm-modal" hide-footer :title="$t('system.confirmMsg')" @hide="hideModal">
            <b-overlay :show="delOverlay" rounded="sm">
                <!-- <div class="d-block text-center">
                    <h3>{{$t('system.confirmMsg')}}</h3>
                </div> -->
                <b-button class="mt-3" size="sm" variant="outline-danger" block @click="deleteDocument">Ok</b-button>
                <b-button class="mt-2" size="sm" variant="outline-warning" block @click="hideModal">Cancel</b-button>
            </b-overlay>
        </b-modal>
    </b-row>
</template>

<script>
import {apiDomain,getHeader} from "@/config/config";
import axios from 'axios';
import Vue from "vue";
import {EventBus} from '@/EventBus.js';
export default {
    name : "AddPQuestion",
    props:['refreshRecordTable'],
    data(){
        return{
            questionForm:{
                
                catId :0,
                questionId:0,
                question : "",
                questionRu:"",
                point:0,
                testAnswers:[],
                factorId : 0
            },
            testCats:[],
            delAnswerId : null,
            delOverlay:false,
            delIndex:-1,
            factors:[]
            
        }
    },
    methods:{
        hideModal() {
            //alert("hide detected");
            this.delTeacherDocRelId=null;
            this.$refs['confirm-modal'].hide();
        },
        showConfirmModal(delAnswerId){
            this.$refs['confirm-modal'].show();
            this.delAnswerId=delAnswerId;
        },
        
        removeField(index){
            if(parseInt(this.questionForm.testAnswers[index].answerId)>0){
                this.showConfirmModal(this.questionForm.testAnswers[index].answerId);
                this.delIndex=index;
            }
            else{
                this.questionForm.testAnswers.splice(index,1);
            }
            
        },
        deleteDocument() {
            //alert("do something "+this.delTeacherDocRelId);  
            if(this.delAnswerId!=null){
                this.delOverlay=true;
                axios.post(apiDomain+'/admin/enu/ptest/delanswer',
                {'answerId':this.delAnswerId},
                {headers:getHeader()})
                .then(()=>{
                    this.delOverlay=false;
                    if(this.delIndex!=-1){
                        this.questionForm.testAnswers.splice(this.delIndex,1);
                    }
                    this.hideModal();   
                })
                .catch(error => {
                    this.delOverlay=false;
                    alert(error.message);
                });
            }
            
            
        },
        addAnswerField(){
            this.questionForm.testAnswers.push(
                {
                    answerId:0,
                    answer:"",
                    answerRu:"",
                    isCorrect:0,
                    answerPoint:0
                }
            )
        },
        updateRecord(rData){
            
            this.questionForm.catId=rData.catId;
            this.questionForm.questionId=rData.questionId;
            this.questionForm.question=rData.question;
            this.questionForm.questionRu=rData.questionRu;
            this.questionForm.point=rData.point;
            this.questionForm.testAnswers=rData.testAnswers;
            this.questionForm.factorId=rData.factorId;
            this.$bvModal.show('questionModal');
        },
        submitForm(evt){
            evt.preventDefault();
            if(Number(this.questionForm.point==0)){
                alert("Test upaidi engizniz !!!");
                return ;
            }
            if(this.questionForm.catId==0){
                this.$bvToast.toast(Vue.i18n.translate('enu.ttest.questionFor.chooseCategory'), {
                    toaster:'b-toaster-top-center',
                    variant:'danger',
                    title: Vue.i18n.translate('system.errorTitle'),
                    autoHideDelay: 5000
                })
                return ;
            }
            if(this.questionForm.testAnswers.length==0){
                this.$bvToast.toast(Vue.i18n.translate('enu.test.questionform.ditNotEnterAnswer'), {
                    toaster:'b-toaster-top-center',
                    variant:'danger',
                    title: Vue.i18n.translate('system.errorTitle'),
                    autoHideDelay: 5000
                });
                return;
            }
            let isAnswersValid=true;
            this.questionForm.testAnswers.forEach(a=>{
                if(!a.answer || a.answer.length<1 
                    || !a.answerRu || a.answerRu.length<1){
                        isAnswersValid=false;
                        return ;
                    }
            });
            if(!isAnswersValid){
                this.$bvToast.toast(Vue.i18n.translate('enu.test.questionform.allField'), {
                    toaster:'b-toaster-top-center',
                    variant:'danger',
                    title: Vue.i18n.translate('system.errorTitle'),
                    autoHideDelay: 5000
                });
                return;
            }
                
            if(this.factors.filter(f=>Number(f.catId)==Number(this.questionForm.catId)).length>0){
                if(Number(this.questionForm.factorId==0)){
                    this.$bvToast.toast(Vue.i18n.translate('enu.test.questionform.allField'), {
                        toaster:'b-toaster-top-center',
                        variant:'danger',
                        title: Vue.i18n.translate('system.errorTitle'),
                        autoHideDelay: 5000
                    });

                    return;
                }
            }
            axios.post(apiDomain+'/admin/enu/ptest/savequestion',this.questionForm,{headers:getHeader()})
            .then((res)=>{
                if(res.data=='success'){
                    let alertMsg = Vue.i18n.translate('system.successMsg');
                    this.$bvToast.toast(alertMsg, {
                        toaster:'b-toaster-top-center',
                        variant:'success',
                        title: Vue.i18n.translate('system.successTitle'),
                        autoHideDelay: 5000
                    });  
                    this.clearForm();
                    this.$bvModal.hide('modal')
                    this.refreshRecordTable();
                }
                else{
                    //console.log(error.message)
                    this.$bvToast.toast(Vue.i18n.translate('system.serverError'), {
                        toaster:'b-toaster-top-center',
                        variant:'danger',
                        title: Vue.i18n.translate('system.errorTitle'),
                        autoHideDelay: 5000
                    })
                }
               
            })
            .catch(error => {
                    //console.log(error.message)
                    this.$bvToast.toast(error.message, {
                        toaster:'b-toaster-top-center',
                        variant:'danger',
                        title: Vue.i18n.translate('system.errorTitle'),
                        autoHideDelay: 5000
                    })
                }
            ) 
        },
        modalHide(){
            this.clearForm();
        },
        clearForm(){
             this.questionForm={
                catId :0,
                questionId:0,
                question : "",
                questionRu:"",
                point:0,
                testAnswers:[],
                factorId:0
            }
        },
        getRefs(refType){
             axios.post(apiDomain+'/admin/enu/ref/getdatalist',{refType:refType},{headers:getHeader()})
                .then(response=>{
                    if(refType=='pCategory'){
                        this.testCats=response.data;
                         axios.get(apiDomain+'/admin/enu/ptest/getfactorlist',{headers:getHeader()})
                        .then(response=>{
                            this.factors=response.data;
                        })
                        .catch(() => {
                            //console.log(error.message)
                            //alert("server dr aldaa uuslee");
                            }
                        ) 
                    }
                })
                .catch(() => {
                    //console.log(error.message)
                    //alert("server dr aldaa uuslee");
                }
            ) 
        }
    },
    created(){
        var vm = this;
        EventBus.$on("updatePQuestion", (rData)=> vm.updateRecord(rData));
        this.getRefs("pCategory");
    }
}
</script>
<style scoped>

</style>