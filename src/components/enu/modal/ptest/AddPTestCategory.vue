<template>
    <b-modal id="modal" :title="$t('system.newRecord')" hide-footer size="huge"  @hidden="clearForm">
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
                    <label for="catNameRu">{{$t('enu.ttest.catForm.catNameRu')}}</label>
                    <b-form-input
                        id="catNameRu"
                        v-model="testCategoryForm.catNameRu"
                        type="text"
                        required
                        :placeholder="$t('enu.ttest.catForm.catNameRu')"
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

                <!-- begining of the test category points -->
                <b-col sm="auto" md="12">
                    <h5 for="point">{{$t('enu.ptest.categoryForm.pointDesc')}}</h5>
                    <b-button @click="addDetailField" size="sm" block variant="outline-success my-3">{{$t('enu.ttest.questionForm.addField')}}</b-button>

                    <b-row v-for="(a,index) in testCategoryForm.categoryPoints" :key="index">
                        <b-col lg="12" class="pt-2">
                            <b-row>
                                <b-col lg="6">
                                    <select v-model="testCategoryForm.categoryPoints[index].gender" class="form-control">
                                        <option value=0>{{$t("enu.ptest.catpoint.general")}}</option>
                                        <option value=1>{{$t("enu.ptest.catpoint.male")}}</option>
                                        <option value=2>{{$t("enu.ptest.catpoint.female")}}</option>
                                    </select>
                                </b-col>
                            </b-row>
                        </b-col>
                        <b-col lg="2">
                            <span class="text-info w-100">{{$t('enu.ptest.factorForm.fromPoint')}}</span>
                            <input type="number" class="form-control mt-2"
                                v-model="testCategoryForm.categoryPoints[index].fromPoint"/>
                        </b-col>
                        <b-col lg="2">
                            <span class="text-info w-100">{{$t('enu.ptest.factorForm.toPoint')}}</span>
                            <input type="number" class="form-control mt-2"
                                v-model="testCategoryForm.categoryPoints[index].endPoint"/>
                        </b-col>

                        <b-col lg="3">
                            <span class="text-info w-100">{{$t('enu.ptest.factorForm.description')}}</span>
                            <b-form-textarea class="mt-2" v-model="testCategoryForm.categoryPoints[index].description"></b-form-textarea>
                        </b-col>
                        <b-col lg="3">
                            <span class="text-info w-100">{{$t('enu.ptest.factorForm.descriptionRu')}}</span>
                            <b-form-textarea class="mt-2" v-model="testCategoryForm.categoryPoints[index].descriptionRu"></b-form-textarea>
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
            <b-button  @click="clearForm" variant="danger">{{$t('system.cancelButtonText')}}</b-button>
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
               haveFactor:0,
               categoryPoints:[]
            },
            groups:[]
        }
    },
    methods:{
        addDetailField(){
            this.testCategoryForm.categoryPoints.push({

                catPointId:0,
                fromPoint:0,
                endPoint:0,
                description:"",
                gender:0,
                descriptionRu:""
            });
        },

        removeField(index){
            this.testCategoryForm.categoryPoints.splice(index,1);
        },
        updateRecord(rData){
            this.testCategoryForm.catId=rData.catId;
            this.testCategoryForm.catName=rData.catName
            this.testCategoryForm.catNameRu=rData.catNameRu;
            this.testCategoryForm.additionalPoint=rData.additionalPoint;
            
            this.testCategoryForm.orderIndex=rData.orderIndex;
            this.testCategoryForm.haveFactor=rData.haveFactor;
            this.testCategoryForm.categoryPoints=rData.categoryPoints;
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
               haveFactor:0,
               categoryPoints:[]
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