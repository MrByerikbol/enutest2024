<template>
    <b-modal id="modal" :title="$t('system.newRecord')"  hide-footer  size="huge"  @show="onModalShow">
       
        <b-overlay :show="overlayShow" rounded="sm">
            <b-form v-on:submit.prevent="submitForm">
                <b-form-row class="mb-3">
                    
                    <b-col sm="auto" md="12">
                        <label for="docDetail">{{$t('enu.teacherDocForm.shortDescription')}}</label>
                        <b-form-textarea
                            id="docDetail"
                            v-model="teacherForm.description"
                            :placeholder="$t('enu.teacherDocForm.shortDescription')"
                        ></b-form-textarea>
                    </b-col>
                    <b-col sm="auto" md="12">
                        <!-- <b-row>
                            <b-col lg="12 text-right pt-2 pr-3">
                                <b-button variant="info" @click="addTeacherDocRow" size="sm">{{$t('enu.teacherDocForm.addRow')}}</b-button>
                            </b-col>
                            engizilgen , rastalgan , maximaldi
                        </b-row> -->
                        
                        <b-row>
                            

                            <b-col lg="2">
                                <label for="blockId">{{$t('enu.docCatList.chooseBlock')}}</label>
                                <select @change="docChange('block')" class="form-control-sm w-100" id="blockId"
                                    v-model="teacherForm.docDetails.blockId">
                                    <option value=0>{{$t('comboChooseText')}}</option>
                                    <option v-for="(b,k) in blocks" :key="k" :value="b.blockId">
                                        {{$i18n.locale()=='kz' ? b.blockName : b.blockNameRu}}
                                    </option>
                                </select>
                            </b-col>    
                            <b-col lg="3">
                                <label for="docCatId">{{$t('enu.docList.chooseDocCat')}}</label>
                                <select @change="docChange('docCat')" 
                                    v-model="teacherForm.docDetails.docCatId" id='docCatId' class="form-control-sm w-100">
                                    <option value=0>{{$t('comboChooseText')}}</option>
                                    <option v-for="(dc,k) in docCats.filter(d=>d.blockId==teacherForm.docDetails.blockId)" :key="k" :value="dc.docCatId">
                                        {{$i18n.locale()=='kz' ? dc.docCatName : dc.docCatNameRu}}
                                    </option>
                                </select>
                            </b-col>    

                            <b-col lg="3">
                                <label id="docId">{{$t('enu.docForm.docName')}}</label>

                                <!-- <select  v-model="teacherForm.docDetails.docId" id="docId" class="form-control-sm w-100">
                                    <option value=0>{{$t('comboChooseText')}}</option>
                                    <option v-for="(dc,k) in docs.filter(d=>d.docCatId==teacherForm.docDetails.docCatId)" :key="k" :value="dc.docId">
                                        {{$i18n.locale()=='kz' ? dc.docName : dc.docNameRu}}
                                    </option>
                                </select> -->
                                <model-list-select v-if="lang=='kz'"
                                    :list="docs.filter(d=>d.docCatId==teacherForm.docDetails.docCatId)"
                                    option-value="docId"
                                    option-text="docName"
                                   
                                    v-model="selectedDoc"
                                    :placeholder="$t('enu.docForm.docName')"
                                    :isDisabled="teacherForm.docDetails.docCatId==0 ? true : false"
                                >
                                </model-list-select>    
                                <model-list-select v-if="lang=='ru'"
                                    :list="docs.filter(d=>d.docCatId==teacherForm.docDetails.docCatId)"
                                    option-value="docId"
                                    option-text="docNameRu"
                                   
                                    v-model="selectedDoc"
                                    :placeholder="$t('enu.docForm.docName')"
                                    :isDisabled="teacherForm.docDetails.docCatId==0 ? true : false"
                                >
                                </model-list-select>    
                            </b-col>    
                            <b-col lg="4" class="pt-4">
                                <b-form-file
                                    class="mt-2"
                                    size="sm"
                                    
                                    v-model="teacherForm.docDetails.docFile"
                                    :state="Boolean(teacherForm.docDetails.docFile)"
                                    :placeholder="$t('enu.teacherDocForm.chooseFile')"
                                    :drop-placeholder="$t('enu.teacherDocForm.dropHere')"
                                ></b-form-file>    
                            </b-col>
                            <b-col lg="12" v-if="docs.filter(d=> d.isTeam==1 && parseInt(d.docId)==parseInt(this.selectedDoc.docId)).length>0">

                                <label for="teamCount">{{$t('enu.teacherForm.teamInputMsg')}}</label>
                                <b-form-input
                                    id="teamCount"
                                    v-model="teacherForm.docDetails.teamCount"
                                    type="number"
                                    min=1
                                    :placeholder="$t('enu.teacherForm.teamInputMsg')"
                                ></b-form-input>    
                            </b-col>
                            <b-col lg="12" class="pt-3">
                                <b-alert variant="info" show v-if="docCountInformation!=null">
                                    {{$t('enu.teacherForm.docCountInformationMsg')}}<br>
                                    <hr>
                                    <span> {{$t('enu.teacherForm.allowedUploadSizeMsg')+':'}} <strong>{{docCountInformation.permittedCount}}</strong></span><br>
                                    <span> {{$t('enu.teacherForm.uploadedSizeMsg')+':'}} <strong>{{docCountInformation.dbCount}}</strong></span><br>
                                    
                                </b-alert>
                                
                            </b-col>    
                            <!-- <b-col lg="1" class="pt-2">
                                <b-button variant="danger" @click="removeDetailRow(detailIndex)" class="mt-4" size="sm" v-if="detailIndex>0">- {{$t('system.deleteButton')}}</b-button>
                            </b-col>     -->
                            
                        </b-row>
                    </b-col>
                </b-form-row>
                <b-button type="submit" v-if="docCountInformation!=null && docCountInformation.permittedCount>docCountInformation.dbCount" variant="primary" class="mr-2">{{$t('system.submitButtonText')}}</b-button>
                <b-button v-if="teacherForm.docDetails.blockId>0" type="reset" variant="danger">{{$t('system.cancelButtonText')}}</b-button>
                
            </b-form>  
        </b-overlay>  
    </b-modal>
</template>

<script>
import {apiDomain,getHeader,getMultipartHeader} from "@/config/config";
import axios from 'axios';
import Vue from "vue";
import {EventBus} from '@/EventBus.js';
import { ModelListSelect } from 'vue-search-select';
export default {
    name : "AddTeacherDocument",

    props:['refreshRecordTable'],
    components:{
        ModelListSelect
    },
    data(){
        return{
            teacherForm:{
                relId : 0,
                description : "",
                descriptionRu : "",
                docDetails:{
                    blockId:0,
                    docCatId:0,
                    docId:0,
                    docFile:null,
                    teamCount:1
                }
            },
            blocks:[],
            docCats:[],
            docs:[],
            docCountInformation:null,
            overlayShow:false,
            selectedDoc:{}
        }
    },

    methods:{
      
        getDocCountInformation(docCatId){
            if(docCatId>0){
                axios.post(apiDomain+'/admin/enu/kpibuisness/getdocumentcountformation',{docCatId:docCatId},
                {headers:getHeader()})
                    .then(response=>{
                        //alert(JSON.stringify(response.data));
                        this.docCountInformation=response.data;
                    })
                    .catch(() => {
                        alert("System error");
                    }
                )
            }
             
        },
        docChange(type){
            if(type=='block'){
                if(parseInt(this.teacherForm.docDetails.blockId)==0){
                    this.teacherForm.docDetails.docCatId=0;
                    this.selectedDoc={};
                }
            }
            if(type=='docCat'){
                if(parseInt(this.teacherForm.docDetails.docCatId)==0){
                    this.selectedDoc={};
                }
                else{
                    this.getDocCountInformation(parseInt(this.teacherForm.docDetails.docCatId));
                    this.selectedDoc={};
                }
            }
        },
        updateRecord(rData){
            this.departmentForm.refType="department";
            this.departmentForm.refId=rData.departmentId;
            this.departmentForm.refName=rData.departmentName;
            this.departmentForm.refNameRu=rData.departmentNameRu;
            this.$bvModal.show('modal');
        },
        submitForm(evt){
            
            evt.preventDefault(); 
            if(!this.selectedDoc.docId || parseInt(this.selectedDoc.docId)==0){
                 this.$bvToast.toast(Vue.i18n.translate('enu.teacherDocForm.fillAllError'), {
                    variant:'danger',
                    title: Vue.i18n.translate('system.errorTitle'),
                    autoHideDelay: 5000
                })    
                return ;    
            }
            this.teacherForm.docDetails.docId=this.selectedDoc.docId;  
            if(parseInt(this.teacherForm.docDetails.blockId)==0
                || parseInt(this.teacherForm.docDetails.docCatId)==0 
                || parseInt(this.teacherForm.docDetails.docId)==0
             ){
                this.$bvToast.toast(Vue.i18n.translate('enu.teacherDocForm.fillAllError'), {
                    variant:'danger',
                    title: Vue.i18n.translate('system.errorTitle'),
                    autoHideDelay: 5000
                })    
                return ;
             }
             if(!this.teacherForm.docDetails.docFile || this.teacherForm.docDetails.docFile==null){
                 this.$bvToast.toast(Vue.i18n.translate('enu.teacherDocForm.noFileError'), {
                    variant:'danger',
                    title: Vue.i18n.translate('system.errorTitle'),
                    autoHideDelay: 5000
                })   
                 return ;
             }

            //main for checker 
            var formData = new FormData();
            
            if(this.teacherForm.docDetails.docFile.name &&
                this.teacherForm.docDetails.docFile.name!=null){
                let checker = this.teacherForm.docDetails.docFile.name.split(".");

                if(checker.length!=2){
                    this.$bvToast.toast(Vue.i18n.translate('wrongFile'), {
                        toaster:'b-toaster-top-center',
                        variant:'danger',
                        title: Vue.i18n.translate('system.errorTitle'),
                        autoHideDelay: 5000,
                      
                    })   
                    return ;
                }
            }
            else{
                this.$bvToast.toast(Vue.i18n.translate('enu.teacherDocForm.noFileError'), {
                    variant:'danger',
                    title: Vue.i18n.translate('system.errorTitle'),
                    autoHideDelay: 5000
                })   
                 return ;    
            }
            formData.append("docFile", this.teacherForm.docDetails.docFile);
            formData.append("docDetails",JSON.stringify(this.teacherForm));
            
            this.overlayShow=true;    
            axios.post(apiDomain+'/admin/enu/kpibuisness/postteacherdocument',formData,{headers:getMultipartHeader()})
            .then((response)=>{
                let alertMsg = Vue.i18n.translate('system.successMsg');
                let r=response.data;
                if(r.operationResult=='success'){
                     this.$bvToast.toast(alertMsg, {
                        variant:'success',
                        title: Vue.i18n.translate('system.successTitle'),
                        autoHideDelay: 5000
                    });
                    this.teacherForm={
                        relId : 0,
                        description : "",
                        descriptionRu : "",
                        docDetails:{
                            blockId:0,
                            docCatId:0,
                            docId:0,
                            docFile:null,
                            teamCount:1
                        }
                    },
                    this.docCountInformation=null;
                    this.selectedDoc={};
                    this.overlayShow=false;
                }
                else{
                    let errorType=response.errorType;
                    let errorMsg =  null;       
                    if(errorType=='maxFileSize'){
                        errorMsg=Vue.i18n.translate('enu.teacherForm.networkOrFileError');
                    }
                    if(errorType=='noExtension'){
                        errorMsg=Vue.i18n.translate('enu.teacherForm.incorrectFileError');
                    }
                    if(errorType=='catFull'){
                        errorMsg=Vue.i18n.translate('enu.teacherDocForm.rowWarnMsg');
                    }

                    this.$bvToast.toast(errorMsg, {
                        variant:'danger',
                        title: Vue.i18n.translate('system.errorTitle'),
                        autoHideDelay: 5000
                    })
                } 


                
                this.refreshRecordTable();
                //this.$bvModal.hide('modal')
            })
            .catch(() => {
                    this.overlayShow=false;
                    //console.log(error.message)
                    this.$bvToast.toast(Vue.i18n.translate('enu.teacherForm.networkOrFileError'), {
                        variant:'danger',
                        title: Vue.i18n.translate('system.errorTitle'),
                        autoHideDelay: 5000
                    })
                }
            ) 
        },
        onModalShow(){
            this.getRefs('block');
            this.getRefs('docCat');
            this.getRefs('doc');
            this.teacherForm={
                relId : 0,
                description : "",
                descriptionRu : "",
                docDetails:{
                    blockId:0,
                    docCatId:0,
                    docId:0,
                    docFile:null,
                    teamCount:1
                }
            },
            this.docCountInformation=null;
            this.selectedDoc={};
        },
        getRefs(refType){
            axios.post(apiDomain+'/admin/enu/ref/getdatalist',{refType:refType},{headers:getHeader()})
                .then(response=>{
                    if(refType=='block'){
                        this.blocks=response.data;
                    }
                    if(refType=='docCat'){
                        //alert(JSON.stringify(response.data));
                        this.docCats=response.data;
                    }
                    if(refType=='doc'){
                        //alert(JSON.stringify(response.data));
                        this.docs=response.data;
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

        EventBus.$on("updateDepartment", (rData)=> vm.updateRecord(rData));
    },
    computed:{
        lang:function(){
            return Vue.i18n.locale();
        }
    }
    
    
}
</script>
<style>
    @media (min-width: 992px) { .modal .modal-huge { max-width: 90% !important; width: 95% !important;; } } 
    .custom-file-input:lang(en) ~ .custom-file-label::after {
        content: 'Файл';
    }
   select {
    max-width: 100%;
    white-space: normal;
    /* For Firefox: */
    text-overflow: ellipsis;
}
</style>

