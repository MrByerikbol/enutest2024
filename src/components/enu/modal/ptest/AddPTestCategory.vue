<template>
    <b-modal id="modal" :title="$t('system.newRecord')" hide-footer size="lg"  @hidden="clearForm">
        <b-form v-on:submit.prevent="submitForm">
            <b-form-row class="mb-3">
                 
                <b-col sm="auto" md="12">
                    <label for="catName">{{$t('enu.ttest.catForm.catName')}}</label>
                    <b-form-input
                        id="catName"
                        v-model="testCategoryForm.catName"
                        type="text"
                        required
                        :placeholder="$t('enu.ttest.catForm.catName')"
                    ></b-form-input>
                </b-col>
                <b-col sm="auto" md="12">
                    <label for="catNameRu">{{$t('enu.ttest.catForm.catName')}}</label>
                    <b-form-input
                        id="catNameRu"
                        v-model="testCategoryForm.catNameRu"
                        type="text"
                        required
                        :placeholder="$t('enu.ttest.catForm.catName')"
                    ></b-form-input>
                </b-col>
                <b-col sm="auto" md="12">
                    <label for="haveFactor">{{$t('haveFactor')}}</label>
                    <select v-model="testCategoryForm.haveFactor" class="form-control">
                        <option value=0>{{$t('system.no')}}</option>
                        <option value=1>{{$t('system.yes')}}</option>
                    </select>
                </b-col>
                <b-col sm="auto" md="12">
                    <label for="orderIndex">{{$t('enu.ttest.catForm.orderIndex')}}</label>
                    <b-form-input
                        id="orderIndex"
                        v-model="testCategoryForm.orderIndex"
                        type="number"
                        required    
                        :placeholder="$t('enu.ttest.catForm.orderIndex')"
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
    name : "AddPTestCategory",
    props:['refreshRecordTable'],
    data(){
        return{
            testCategoryForm:{
               catId:0,
               catName : "",
               catNameRu:"",
               additionalPoint:0,
               orderIndex :0,
               haveFactor:0


            },
            groups:[]
        }
    },
    methods:{
        updateRecord(rData){
            //alert(rData.blockId);
            this.testCategoryForm.catId=rData.catId;
            this.testCategoryForm.catName=rData.catName
            this.testCategoryForm.catNameRu=rData.catNameRu;
            this.testCategoryForm.additionalPoint=rData.additionalPoint;
            
            this.testCategoryForm.orderIndex=rData.orderIndex;
            this.testCategoryForm.haveFactor=rData.haveFactor;
            
            this.$bvModal.show('modal');
        },
        submitForm(evt){
            
            evt.preventDefault();
            
            
            axios.post(apiDomain+'/admin/enu/ptest/savetestcategory',this.testCategoryForm,{headers:getHeader()})
            .then(()=>{
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
        clearForm(){
            this.testCategoryForm={
               catId:0,
               catName : "",
               catNameRu:"",
               additionalPoint:0,
               orderIndex:0,
               haveFactor:0
            }
        }

    
    },
    created(){
        var vm = this;
        EventBus.$on("pTestCategory", (rData)=> vm.updateRecord(rData));
    }
}
</script>
<style scoped>

</style>