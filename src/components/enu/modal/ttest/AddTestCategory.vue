<template>
    <b-modal id="modal" :title="$t('system.newRecord')" hide-footer size="lg" @show="getRefs('ttestCategory')" @hidden="clearForm">
        <b-form v-on:submit.prevent="submitForm">
            <b-form-row class="mb-3">
                 <b-col sm="auto" md="12">
                    <label for="blockName">{{$t('enu.ttest.catForm.chooseGroup')}}</label>
                    <select v-model="testCategoryForm.groupId" class="form-control">
                        <option value="0">{{$t('comboChooseText')}}</option>
                        <option v-for="(b,k) in groups" :key="k" :value="b.groupId">
                            {{$i18n.locale()=='kz' ? b.groupName : b.groupNameRu}}
                        </option>
                    </select>
                </b-col>
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
                    <label for="additionalPoint">{{$t('enu.ttest.catForm.additionalPoint')}}</label>
                    <b-form-input
                        id="additionalPoint"
                        v-model="testCategoryForm.additionalPoint"
                        type="number"
                        required
                        step="any" 
                        :placeholder="$t('enu.ttest.catForm.additionalPoint')"
                    ></b-form-input>
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
    name : "AddTestCategory",
    props:['refreshRecordTable'],
    data(){
        return{
            testCategoryForm:{
               catId:0,
               catName : "",
               catNameRu:"",
               additionalPoint:0,
               groupId :0,
               orderIndex :0
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
            this.testCategoryForm.groupId=rData.groupId;
            this.testCategoryForm.orderIndex=rData.orderIndex;
            
            this.$bvModal.show('modal');
        },
        submitForm(evt){
            
            evt.preventDefault();
            if(this.testCategoryForm.groupId==0){
                this.$bvToast.toast(Vue.i18n.translate('enu.ttest.chooseGroupErrorTxt'), {
                    variant:'danger',
                    title: Vue.i18n.translate('system.errorTitle'),
                    autoHideDelay: 5000
                })
                return ;
            }
            
            axios.post(apiDomain+'/admin/enu/ttest/savetestcategory',this.testCategoryForm,{headers:getHeader()})
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

        getRefs(refType){
            axios.post(apiDomain+'/admin/enu/ref/getdatalist',{refType:refType},{headers:getHeader()})
                .then(response=>{
                    if(refType=='ttestCategory'){
                        this.groups=response.data;
                    }
                })
                .catch(() => {
                    //console.log(error.message)
                    //alert("server dr aldaa uuslee");
                }
            ) 
        },
        clearForm(){
            this.testCategoryForm={
               catId:0,
               catName : "",
               catNameRu:"",
               additionalPoint:0,
               groupId :0,
               orderIndex:0
            }
        }

    
    },
    created(){
        var vm = this;

        EventBus.$on("testCategory", (rData)=> vm.updateRecord(rData));
    }
    
    
}
</script>
<style scoped>

</style>