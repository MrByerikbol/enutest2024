<template>
    <b-modal id="modal" :title="$t('system.newRecord')" hide-footer size="lg" @show="getRefs('block')" @hidden="clearForm">
        <b-form v-on:submit.prevent="submitForm">
            <b-form-row class="mb-3">
                 <b-col sm="auto" md="12">
                    <label for="blockName">{{$t('enu.docCatList.chooseBlock')}}</label>
                    <select v-model="documentCategoryForm.blockId" class="form-control">
                        <option value="0">{{$t('comboChooseText')}}</option>
                        <option v-for="(b,k) in blocks" :key="k" :value="b.blockId">
                            {{$i18n.locale()=='kz' ? b.blockName : b.blockNameRu}}
                        </option>
                    </select>
                </b-col>
                <b-col sm="auto" md="12">
                    <label for="docCatName">{{$t('enu.docCatList.docCatName')}}</label>
                    <b-form-input
                        id="docCatName"
                        v-model="documentCategoryForm.docCatName"
                        type="text"
                        required
                        :placeholder="$t('enu.docCatList.docCatName')"
                    ></b-form-input>
                </b-col>
                <b-col sm="auto" md="12">
                    <label for="docCatNameRu">{{$t('enu.docCatList.docCatNameRu')}}</label>
                    <b-form-input
                        id="docCatNameRu"
                        v-model="documentCategoryForm.docCatNameRu"
                        type="text"
                        required
                        :placeholder="$t('enu.docCatList.docCatNameRu')"
                    ></b-form-input>
                </b-col>

                <b-col sm="auto" md="12">
                    <label for="docCount">{{$t('enu.docCatList.insertableDocCount')}}</label>
                    <b-form-input
                        id="docCount"
                        v-model="documentCategoryForm.docCount"
                        type="number"
                        required
                        :placeholder="$t('enu.docCatList.insertableDocCount')"
                    ></b-form-input>
                </b-col>
                <b-col sm="auto" md="12">
                    <label for="docCount">{{$t('enu.docCatList.maxPoint')}}</label>
                    <b-form-input
                        id="docCount"
                        v-model="documentCategoryForm.maxValue"
                        type="number"
                        required
                        :placeholder="$t('enu.docCatList.maxPoint')"
                    ></b-form-input>
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
    name : "AddDepartment",
    props:['refreshRecordTable'],
    data(){
        return{
            documentCategoryForm:{
               blockId:0,
               docCatId : 0,
               docCatName : "",
               docCatNameRu:"",
               maxValue:0,
               docCount:1
            },
            blocks:[]
        }
    },
    methods:{
        updateRecord(rData){
            //alert(rData.blockId);
            this.documentCategoryForm.blockId=rData.blockId;
            this.documentCategoryForm.docCatId=rData.docCatId;
            this.documentCategoryForm.docCatName=rData.docCatName;
            this.documentCategoryForm.docCatNameRu=rData.docCatNameRu;
            this.documentCategoryForm.maxValue=rData.maxPoint;
            this.documentCategoryForm.docCount=rData.docCount;

            
            this.$bvModal.show('modal');
        },
        submitForm(evt){
            evt.preventDefault();
            if(this.documentCategoryForm.blockId==0){
                this.$bvToast.toast(Vue.i18n.translate('system.error.chooseBlock'), {
                    variant:'danger',
                    title: Vue.i18n.translate('system.errorTitle'),
                    autoHideDelay: 5000
                })
                return ;
            }
            axios.post(apiDomain+'/admin/enu/kpi/postdocumentcategory',this.documentCategoryForm,{headers:getHeader()})
            .then(()=>{
                this.clearForm();
                this.$bvModal.hide('modal')
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

        getRefs(refType){
            axios.post(apiDomain+'/admin/enu/ref/getdatalist',{refType:'block'},{headers:getHeader()})
                .then(response=>{
                    if(refType=='block'){
                        this.blocks=response.data;
                    }
                })
                .catch(() => {
                    //console.log(error.message)
                    //alert("server dr aldaa uuslee");
                }
            ) 
        },
        clearForm(){
            this.documentCategoryForm={
                blockId:0,
                docCatId : 0,
                docCatName : "",
                docCatNameRu:"",
                maxValue:0,
                docCount:1
            }
        }


    },
    created(){
        var vm = this;

        EventBus.$on("documentCategory", (rData)=> vm.updateRecord(rData));
    }
    
    
}
</script>
<style scoped>

</style>