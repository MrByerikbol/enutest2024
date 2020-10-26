<template>
    <b-modal id="blockModal" :title="$t('newRecord')" hide-footer size="lg">
        <b-row>
            <b-col lg="12">
                <b-form v-on:submit.prevent="submitForm">
                    <b-form-row class="mb-3">
                        
                        <b-col sm="auto" md="12">
                            <label for="blockName">{{$t('enu.blockForm.blockName')}}</label>
                            <b-form-input
                                id="blockName"
                                v-model="blockForm.blockName"
                                type="text"
                                required
                                :placeholder="$t('enu.blockForm.blockName')"
                            ></b-form-input>
                        </b-col>
                        <b-col sm="auto" md="12">
                            <label for="blockNameRu">{{$t('enu.blockForm.blockNameRu')}}</label>
                            <b-form-input
                                id="blockNameRu"
                                v-model="blockForm.blockNameRu"
                                type="text"
                                required
                                :placeholder="$t('enu.blockForm.blockNameRu')"
                            ></b-form-input>
                        </b-col>
                        <b-col sm="auto" md="12">
                            <label for="maxValue">{{$t('enu.blockForm.maxPoint')}}</label>
                            <b-form-input
                                id="maxValue"
                                v-model="blockForm.maxValue"
                                type="number"
                                required
                                :placeholder="$t('enu.blockForm.maxPoint')"
                            ></b-form-input>
                        </b-col>
                    </b-form-row>
                    <b-button type="submit" size="sm" variant="primary" class="mr-2">{{$t('system.submitButtonText')}}</b-button>
                    <b-button type="reset" size="sm" variant="danger">{{$t('system.cancelButtonText')}}</b-button>
                </b-form> 
            </b-col>
            <BlockList ref="blockList" :clearForm="clearForm"/>
        </b-row>       
    </b-modal>
</template>
<script>
    import {apiDomain,getHeader} from "@/config/config";
    import axios from 'axios';
    import Vue from "vue";
    import {EventBus} from '@/EventBus.js';
    import BlockList from '@/components/enu/comps/BlockList'
    export default {
        name : "DocumentBlock",
        components:{
            BlockList
        },

        data(){
            return{
                blockForm:{
                    blockId:0,
                    blockName:'',
                    blockNameRu:"",
                    maxValue:0
                }
            }
        },
        methods:{
             updateRecord(rData){
                //alert(JSON.stringify(rData));
                this.blockForm.blockId=rData.blockId;
                this.blockForm.blockName=rData.blockName;
                this.blockForm.blockNameRu=rData.blockNameRu;
                this.blockForm.maxValue=rData.maxPoint;
                
            },
            submitForm(evt){
                evt.preventDefault();
            
                axios.post(apiDomain+'/admin/enu/kpi/addblock/',this.blockForm,{headers:getHeader()})
                .then(()=>{
                    let alertMsg = Vue.i18n.translate('system.successMsg');
                    this.$bvToast.toast(alertMsg, {
                        variant:'success',
                        title: Vue.i18n.translate('system.successTitle'),
                        autoHideDelay: 5000
                    });  
                    this.$bvModal.hide('modal')
                    this.clearForm();
                    this.$refs.blockList.refreshRecordTable();
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
                this.blockForm={
                    blockId:0,
                    blockName:'',
                    blockNameRu:"",
                    maxValue:0
                }
            }
            

        },
        created(){
            var vm = this;
            EventBus.$on("updateBlock", (rData)=> vm.updateRecord(rData));
        }
        
       
    }
</script>