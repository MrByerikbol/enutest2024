<template>
    <b-modal id="modal" :title="$t('newRecord')" hide-footer>
        <b-form v-on:submit.prevent="submitForm">
            <b-form-row class="mb-3">
                
                <b-col sm="auto" md="12">
                    <label for="departmentName">{{$t('enu.departmentList.departmentName')}}</label>
                    <b-form-input
                        id="departmentName"
                        v-model="departmentForm.refName"
                        type="text"
                        required
                        :placeholder="$t('enu.departmentList.departmentName')"
                    ></b-form-input>
                </b-col>
                <b-col sm="auto" md="12">
                    <label for="departmentNameRu">{{$t('enu.departmentList.departmentNameRu')}}</label>
                    <b-form-input
                        id="departmentNameRu"
                        v-model="departmentForm.refNameRu"
                        type="text"
                        required
                        :placeholder="$t('enu.departmentList.departmentNameRu')"
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
            departmentForm:{
                refType:'department',
                refName : "",
                refNameRu:"",
                refId:0
            }
        }
    },
    methods:{
        updateRecord(rData){
            this.departmentForm.refType="department";
            this.departmentForm.refId=rData.departmentId;
            this.departmentForm.refName=rData.departmentName;
            this.departmentForm.refNameRu=rData.departmentNameRu;
            this.$bvModal.show('modal');
        },
        submitForm(evt){
            evt.preventDefault();
           
            axios.post(apiDomain+'/admin/enu/ref/addref/',this.departmentForm,{headers:getHeader()})
            .then(()=>{
                let alertMsg = Vue.i18n.translate('system.successMsg');
                this.$bvToast.toast(alertMsg, {
                    variant:'success',
                    title: Vue.i18n.translate('system.successTitle'),
                    autoHideDelay: 5000
                });  
                this.$bvModal.hide('modal')
                this.departmentForm={
                    refType:"department",
                    refId:0,
                    refName : "",
                    refNameRu : ""
                }
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
        }
    },
    created(){
        var vm = this;

        EventBus.$on("updateDepartment", (rData)=> vm.updateRecord(rData));
    }
    
    
}
</script>
<style scoped>

</style>