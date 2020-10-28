<template>
    <b-modal id="documentModal" :title="$t('system.newRecord')" hide-footer size="lg" @show="onModalShow" @hidden="clearForm">
        <b-form v-on:submit.prevent="submitForm">
            <b-form-row class="mb-3">
                 <b-col sm="auto" md="12">
                    <label for="blockId">{{$t('enu.docCatList.chooseBlock')}}</label>
                    <select v-model="documentForm.blockId" id="blockId" class="form-control">
                        <option value="0">{{$t('comboChooseText')}}</option>
                        <option v-for="(b,k) in blocks" :key="k" :value="b.blockId">
                            {{$i18n.locale()=='kz' ? b.blockName : b.blockNameRu}}
                        </option>
                    </select>
                 </b-col>
                <b-col sm="auto" md="12">
                    <label for="docCatId">{{$t('enu.docList.chooseDocCat')}}</label>
                    <select v-model="documentForm.docCatId" id="docCatId" class="form-control">
                        <option value="0">{{$t('comboChooseText')}}</option>
                        <option v-for="(dc,k) in docCats.filter(d=>d.blockId==documentForm.blockId)" :key="k" :value="dc.docCatId">
                            {{$i18n.locale()=='kz' ? dc.docCatName : dc.docCatNameRu}}
                        </option>
                    </select>
                 </b-col>

                <b-col sm="auto" md="12">
                    <label for="docName">{{$t('enu.docForm.docName')}}</label>
                    <b-form-input
                        id="docName"
                        v-model="documentForm.docName"
                        type="text"
                        required
                        :placeholder="$t('enu.docForm.docName')"
                    ></b-form-input>
                </b-col>
                <b-col sm="auto" md="12">
                    <label for="docNameRu">{{$t('enu.docForm.docNameRu')}}</label>
                    <b-form-input
                        id="docNameRu"
                        v-model="documentForm.docNameRu"
                        type="text"
                        required
                        :placeholder="$t('enu.docForm.docNameRu')"
                    ></b-form-input>
                </b-col>
                <b-col sm="auto" md="12">
                    <b-row>
                        <b-col lg="8">
                            <label for="maxValue">{{$t('enu.docCatList.maxPoint')}}</label>
                            <b-form-input
                                id="maxValue"
                                v-model="documentForm.maxValue"
                                type="number"
                                required
                                :placeholder="$t('enu.docCatList.maxPoint')"
                            ></b-form-input>
                        </b-col>
                        <b-col lg="4">
                            <label for="isTeam">{{$t('enu.docCatForm.chooseIsTeam')}}</label>
                            <b-form-checkbox
                                id="isTeam"
                                v-model="documentForm.isTeamF"
                            ></b-form-checkbox>    
                        </b-col>
                    </b-row>
                </b-col>
                
            </b-form-row>
            <b-button type="submit" variant="primary" class="mr-2">{{$t('system.submitButtonText')}}</b-button>
            <b-button type="reset" variant="danger">{{$t('system.cancelButtonText')}}</b-button>
        </b-form>    
    </b-modal>
</template>

<script>
import {apiDomain,getHeader} from "@/config/config";
import axios from 'axios';
import Vue from "vue";
import {EventBus} from '@/EventBus.js';
export default {
    name : "AddDocument",
    props:['refreshRecordTable'],
    data(){
        return{
            documentForm:{
               blockId:0,
               dockId:0,
               docCatId : 0,
               docName : "",
               docNameRu:"",
               maxValue:0,
               isTeamF :false,
               isTeam:0
            },
            blocks:[],
            docCats:[]
        }
    },
    methods:{
        updateRecord(rData){
            this.documentForm=rData;
            rData.isTeam==1 ? this.documentForm.isTeamF=true : this.documentForm.isTeamF=false;
            this.documentForm.maxValue = rData.maxPoint;
            this.$bvModal.show('documentModal');
        },
        submitForm(evt){
            evt.preventDefault();
            if(this.documentForm.isTeamF){
                this.documentForm.isTeam=1;
            }
            else{
                this.documentForm.isTeam=0;
            }
            if(this.documentForm.blockId==0 
                || this.documentForm.docCatId==0 ){

                this.$bvToast.toast(Vue.i18n.translate('system.error.chooseBlockOrDocCat'), {
                    variant:'danger',
                    title: Vue.i18n.translate('system.errorTitle'),
                    autoHideDelay: 5000
                })
                return ;
            }
            axios.post(apiDomain+'/admin/enu/kpi/postdocument',this.documentForm,{headers:getHeader()})
            .then(()=>{
                this.clearForm();
                //this.$bvModal.hide('modal')
                this.refreshRecordTable();
            })
            .catch(error => {
                    //console.log(error.message)
                    this.$bvToast.toast(error.message, {
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
                })
                .catch(() => {
                    //console.log(error.message)
                    //alert("server dr aldaa uuslee");
                }
            ) 
        },
        clearForm(){
            this.documentForm={
                blockId:0,
                dockId:0,
                docCatId : 0,
                docName : "",
                docNameRu:"",
                maxValue:0,
                isTeamF:false,
                isTeam:0
            }
        }


    },
    created(){
        var vm = this;

        EventBus.$on("updateDocument", (rData)=> vm.updateRecord(rData));
    }
    
    
}
</script>
<style scoped>

</style>