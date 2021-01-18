<template>
    <b-row>
        <b-modal id="factorModal" :title="$t('system.newRecord')"
            @hide="modalHide" hide-footer size="huge" @show="getRefs('pCategory')" @hidden="clearForm">
            <b-form v-on:submit.prevent="submitForm">
                <b-form-row class="mb-3">
                    <b-col sm="auto" md="12">
                        <label for="catId">{{$t('enu.ttest.questionList.chooseCategoryTxt')}}</label>
                        <select id="catId"
                            v-model="factorForm.catId" class="form-control">
                            <option value=0>{{$t('comboChooseText')}}</option>
                            <option v-for="(c,k) in testCats.filter(f=>f.haveFactor==1)" 
                                :key="k" :value=c.catId>
                                {{$i18n.locale()=='kz' ? c.catName : c.catNameRu}}
                            </option>
                        </select>
                    </b-col>
                    <b-col sm="auto" md="12">
                        <label for="factorName">{{$t('enu.ptest.factorForm.factorName')}}</label>
                        <b-form-textarea
                            id="factorName"
                            v-model="factorForm.factorName"
                            required
                            :placeholder="$t('enu.ptest.factorForm.factorName')"
                        ></b-form-textarea>
                    </b-col>

                    <b-col sm="auto" md="12">
                        <label for="factorNameRu">{{$t('enu.ptest.factorForm.factorNameRu')}}</label>
                        <b-form-textarea
                            id="factorNameRu"
                            v-model="factorForm.factorNameRu"
                            required
                            :placeholder="$t('enu.ptest.factorForm.factorNameRu')"
                        ></b-form-textarea>
                    </b-col>

                    <!-- begining of the test factor detail -->
                    <b-col sm="auto" md="12">
                        <h5 for="point">{{$t('enu.ptest.factorForm.factorDetail')}}</h5>
                        <b-button @click="addDetailField" size="sm" block variant="outline-success my-3">{{$t('enu.ttest.questionForm.addField')}}</b-button>

                        <b-row v-for="(a,index) in factorForm.factorDetails" :key="index">
                            <b-col lg="2">
                                <span class="text-info w-100">{{$t('enu.ptest.factorForm.fromPoint')}}</span>
                                <input type="number" class="form-control mt-2"
                                 v-model="factorForm.factorDetails[index].fromPoint"/>
                            </b-col>
                            <b-col lg="2">
                                <span class="text-info w-100">{{$t('enu.ptest.factorForm.toPoint')}}</span>
                                <input type="number" class="form-control mt-2"
                                 v-model="factorForm.factorDetails[index].endPoint"/>
                            </b-col>

                            <b-col lg="3">
                                <span class="text-info w-100">{{$t('enu.ptest.factorForm.description')}}</span>
                                <b-form-textarea class="mt-2" v-model="factorForm.factorDetails[index].description"></b-form-textarea>
                            </b-col>
                            <b-col lg="3">
                                <span class="text-info w-100">{{$t('enu.ptest.factorForm.descriptionRu')}}</span>
                                <b-form-textarea class="mt-2" v-model="factorForm.factorDetails[index].descriptionRu"></b-form-textarea>
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
                <b-button type="reset" @click="clearForm" variant="danger">{{$t('system.cancelButtonText')}}</b-button>

                <hr>
                <b-form-row>
                    <b-col lg="12">
                        <b-form-row>
                            <b-col lg="2">
                                <h6>
                                    {{$t('enu.ptest.factorForm.factorCategory')}}
                                </h6>
                            </b-col>
                            <b-col lg="3">
                                <h6>
                                    {{$t('enu.ptest.factorForm.name')}}
                                </h6>
                            </b-col>    
                            <b-col lg="3">
                                <h6>
                                    {{$t('enu.ptest.factorForm.nameRu')}}
                                </h6>    
                            </b-col>    
                            <b-col lg="2">
                                <h6>{{$t('system.updateButton')}}</h6>    
                            </b-col>    
                            <b-col lg="2">
                                <h6>
                                    {{$t('system.deleteButton')}}    
                                </h6>
                            </b-col>    
                        </b-form-row>    
                    </b-col>
                    <b-col lg="12">
                        <b-form-row class="mb-2" v-for="(f,fi) in factors" :key="fi">
                            <b-col lg="2">
                                {{$i18n.locale()=='kz' ? f.catName : c.catNameRu}}
                            </b-col>

                            <b-col lg="3">
                                {{f.factorName}}
                            </b-col>    
                            <b-col lg="3">
                                {{f.factorNameRu}}
                            </b-col>    
                            <b-col lg="2">
                                <b-button variant="info" size="sm" @click="updateRecord(f.factorId)">
                                    {{$t('system.updateButton')}}
                                </b-button>
                            </b-col>    
                            <b-col lg="2">
                                <b-button @click="delFactor(f.factorId,fi)" variant="danger" size="sm">
                                    {{$t('system.deleteButton')}}
                                </b-button>
                            </b-col>       
                        </b-form-row>
                    </b-col>
                </b-form-row>

            </b-form>    
        </b-modal>
        <b-modal ref="confirm-modal" hide-footer :title="$t('system.confirmMsg')" @hide="hideModal">
            <b-overlay :show="delOverlay" rounded="sm">
                <!-- <div class="d-block text-center">
                    <h3>{{$t('system.confirmMsg')}}</h3>
                </div> -->
                <b-button class="mt-3" size="sm" variant="outline-danger" block @click="deleteFactorDetail">Ok</b-button>
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
    name : "AddTestFactor",
    data(){
        return{
            factorForm:{
                factorId : 0,
                factorName:"",
                factorNameRu:"",
                catId:0,
                factorDetails:[]
            },

            testCats:[],

            delFactorDetailId : null,
            delOverlay:false,
            delIndex:-1,
            factors:[]
            
        }
    },
    methods:{
        delFactor(factorId,delIndex){
            let warn = confirm("system.confirmMsg");
            
            if(warn){
                axios.post(apiDomain+'/admin/enu/ptest/delfactor',{factorId:factorId},{headers:getHeader()})
                .then(response=>{
                    if(response.data=='success'){
                        let alertMsg = Vue.i18n.translate('system.successMsg');
                        this.$bvToast.toast(alertMsg, {
                            toaster:'b-toaster-top-center',
                            variant:'success',
                            title: Vue.i18n.translate('system.successTitle'),
                            autoHideDelay: 5000
                        });
                        this.factors.splice(delIndex,1);  
                    }
                    else{
                        this.$bvToast.toast(Vue.i18n.translate('system.serverError'), {
                            toaster:'b-toaster-top-center',
                            variant:'danger',
                            title: Vue.i18n.translate('system.errorTitle'),
                            autoHideDelay: 5000
                        })    
                    }
                })
                .catch(() => {
                    //console.log(error.message)
                    //alert("server dr aldaa uuslee");
                    }
                )      
            }
        },
        hideModal() {
            //alert("hide detected");
            this.delFactorDetailId=null;
            this.$refs['confirm-modal'].hide();
        },
        showConfirmModal(factorDetailId){
            this.$refs['confirm-modal'].show();
            this.delFactorDetailId=factorDetailId;
        },
        
        removeField(index){
            if(parseInt(this.factorForm.factorDetails[index].factorDetailId)>0){
                this.showConfirmModal(this.factorForm.factorDetails[index].factorDetailId);

                this.delIndex=index;
            }
            else{
                this.factorForm.factorDetails.splice(index,1);
            }
            
        },
        deleteFactorDetail() {
            //alert("do something "+this.delTeacherDocRelId);  
            if(this.delFactorDetailId!=null){
                this.delOverlay=true;
                axios.post(apiDomain+'/admin/enu/ptest/delfactordetail',
                {'factorDetailId':this.delFactorDetailId},
                {headers:getHeader()})
                .then(()=>{
                    this.delOverlay=false;
                    if(this.delIndex!=-1){
                        this.factorForm.factorDetails.splice(this.delIndex,1);
                    }
                    this.hideModal();   
                })
                .catch(error => {
                    this.delOverlay=false;
                    alert(error.message);
                });
            }
            
            
        },
        addDetailField(){
            this.factorForm.factorDetails.push(
                {
                    factorDetailId:0,
                    fromPoint:0,
                    endPoint:0,
                    description:"",
                    descriptionRu:"",
                }
            )
        },
        updateRecord(factorId){
            axios.post(apiDomain+'/admin/enu/ptest/getcurrentfactor',{factorId:factorId},{headers:getHeader()})
            .then(response=>{

                this.factorForm=response.data;
            })
            .catch(() => {
                //console.log(error.message)
                //alert("server dr aldaa uuslee");
                }
            )     
        },
        submitForm(evt){
            evt.preventDefault();
            if(this.factorForm.catId==0){
                this.$bvToast.toast(Vue.i18n.translate('enu.ttest.questionFor.chooseCategory'), {
                    toaster:'b-toaster-top-center',
                    variant:'danger',
                    title: Vue.i18n.translate('system.errorTitle'),
                    autoHideDelay: 5000
                })
                return ;
            }
            if(this.factorForm.factorDetails.length==0){
                this.$bvToast.toast(Vue.i18n.translate('enu.ptest.factorForm.ditNotEnterFactorDetail'), {
                    toaster:'b-toaster-top-center',
                    variant:'danger',
                    title: Vue.i18n.translate('system.errorTitle'),
                    autoHideDelay: 5000
                });
                return;
            }
            let isFactorDetail=true;
            this.factorForm.factorDetails.forEach(a=>{
                if(!a.description || a.description.length<1 
                    || !a.description || a.descriptionRu.length<1){
                        isFactorDetail=false;

                        return ;
                    }
            });
            if(!isFactorDetail){
                this.$bvToast.toast(Vue.i18n.translate('enu.test.questionform.allField'), {
                    toaster:'b-toaster-top-center',
                    variant:'danger',
                    title: Vue.i18n.translate('system.errorTitle'),
                    autoHideDelay: 5000
                });
                return;
            }
                

            axios.post(apiDomain+'/admin/enu/ptest/savefactor',this.factorForm,{headers:getHeader()})
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
                    this.getRefs("default"); 
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
             this.factorForm={
                factorId : 0,
                factorName:"",
                factorNameRu:"",
                catId:0,
                factorDetails:[]
            }
        },
        getRefs(refType){
            axios.post(apiDomain+'/admin/enu/ref/getdatalist',{refType:refType},{headers:getHeader()})
            .then(response=>{
                if(refType=='pCategory'){
                    this.testCats=response.data;
                }
            })
            .catch(() => {
                //console.log(error.message)
                //alert("server dr aldaa uuslee");
                }
            ) 

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
    }
}
</script>
<style scoped>

</style>