<template> 
    <b-row>
        <b-col lg="12" class="py-3">
            <h3>
                <span class="bd-content-title">{{$t('enu.ttest.testRefMainTitle')}}</span>
            </h3>
        </b-col>
        <b-col lg="5">
            <b-col lg="12">
                <h5>
                    <span class="bd-content-title">{{$t('enu.ttest.testCatTitle')}}</span>
                </h5>
            </b-col>
            <b-col lg="12" class="mb-3">
                <b-button variant="success" size="sm" class="mr-2" v-b-modal.modal>{{$t('system.newButton')}}</b-button>
                <b-button variant="info" v-if="selectedRows.length==1" size="sm" @click="updateRecord" class="mr-2">{{$t('system.updateButton')}}</b-button>
                <b-button variant="danger" v-if="selectedRows.length>0" size="sm" class="mr-2" @click="deleteRecord">{{$t('system.deleteButton')}}</b-button>

                <b-button size="sm" class="float-right" v-b-modal.factorModal>{{$t('enu.ptest.factorForm.factorButtonText')}}</b-button>
            </b-col>
            <b-row>
                <b-col lg="8">
                    <b-form-input
                        v-model="filter"
                        type="search"
                        id="colorInput"
                        size="sm"
                        :placeholder="$t('system.searchText')"
                    ></b-form-input>
                </b-col>
                <b-col lg="4" class="text-right">
                    <strong>{{$t('system.recordCountText')}}:</strong> {{totalRows}}  
                </b-col>
            </b-row>
            <b-row>
                <b-col lg="12" class="pt-2">
                    <b-table 
                        ref="recordTable"
                        striped hover selectable
                        :items="recordProvider" 
                        :fields="fields"
                        :busy.sync="isBusy"
                        :current-page="currentPage"
                        responsive
                        :per-page="perPage"
                        :filter="filter"
                        :select-mode="'multi'"
                        
                        
                        selected-variant="danger"
                        @row-selected="onSelected">
                        
                        <template #head(groupName)="data">
                            <span class="text-info">{{$t(data.label)}}</span>
                        </template>
                        <template v-slot:cell(groupName)="row">
                            {{$i18n.locale()=='kz' ? row.item.groupName : row.item.groupNameRu}}
                        </template>
                        <template #head(catName)="data">
                            <span class="text-info">{{$t(data.label)}}</span>
                        </template>
                        <template v-slot:cell(catName)="row">
                            {{$i18n.locale()=='kz' ? row.item.catName : row.item.catNameRu}}
                        </template>
                        <template #head(additionalPoint)="data">
                            <span class="text-info">{{$t(data.label)}}</span>
                        </template>
                        <template #head(questionCount)="data">
                            <span class="text-info">{{$t(data.label)}}</span>
                        </template>
                        <template v-slot:cell(haveFactor)="row">
                           {{row.item.haveFactor==0 ? $t('system.no') : $t('system.yes')}}
                        </template>    
                        <template v-slot:cell(docCatId)="{ rowSelected }">
                            <template v-if="rowSelected">
                                <span aria-hidden="true">&check;</span>
                                <span class="sr-only">Selected</span>
                            </template>
                            <template v-else>
                                <span aria-hidden="true">&nbsp;</span>
                                <span class="sr-only">Not selected</span>
                            </template>
                        </template>
                        <template v-slot:table-busy>
                            <div class="text-center text-info my-2">
                                <b-spinner class="align-middle"></b-spinner>
                                <strong>Жүктелуде...</strong>
                            </div>
                        </template>
                    </b-table>
                </b-col>
                <b-col lg="12">
                    <b-pagination
                        v-model="currentPage"
                        :total-rows="totalRows"
                        :per-page="perPage"
                        align="fill"
                        size="sm"
                        class="my-0"
                        
                    ></b-pagination>
                </b-col>
                <AddPTestCategory :refreshRecordTable="refreshRecordTable"/>               
                <AddTestFactor/>               
            </b-row>
            
        </b-col>
        <b-col lg="7">
            <PQuestionList  :prefreshRecordTable="refreshRecordTable"/>
        </b-col>
         
    </b-row>

</template>

<script>
import {apiDomain,getHeader} from "@/config/config";
import AddPTestCategory from "@/components/enu/modal/ptest/AddPTestCategory"
import AddTestFactor from "@/components/enu/modal/ptest/AddTestFactor"
import PQuestionList from "@/components/enu/comps/ptest/PQuestionList"
import {EventBus} from '@/EventBus.js';
import axios from 'axios';
import Vue from 'vue';

export default {
    name : "TestCategoryList",
    components:{
        AddPTestCategory,
        PQuestionList,
        AddTestFactor
    },
    data(){

        return{
            fields: [
                {
                    key: 'catId',
                    label: 'ID'
                },
                {
                    key: 'catName',
                    label: 'enu.ttest.catName',
                },
                {
                    key: 'questionCount',
                    label: 'enu.ttest.questionCount',
                    variant:'warning'
                },
                {
                    key: 'haveFactor',
                    label: 'Factor',

                    variant:'info'
                }
            ],
            isSmall:false,
            isBusy:false,
            totalRows:0,
            currentPage: 1,
            perPage: 20, 
            filter:"",
            selectedRows:[],
            groupId :0,
            groups:[]
        }
    },
    methods:{
        catGroupChange(){
            this.$refs.recordTable.refresh();
        },
        deleteRecord(){
            let warn = confirm(Vue.i18n.translate('system.confirmMsg'));

            if(warn){
                if(this.selectedRows.length>0){
                    let o = new Object();
                    let delIndexes = [];
                    this.selectedRows.forEach(r=>{
                        delIndexes.push(r.catId);
                    })
                    o.indexes=delIndexes;
                    o.name='enu_ptest_category';
                    o.unique='cat_id';
                    axios.post(apiDomain+'/admin/enu/ref/deleterecords',o,{headers:getHeader()})
                    .then(()=>{
                        this.refreshRecordTable();
                    
                    })
                    .catch(error => {
                        //console.log(error.message)
                        this.$bvToast.toast(error.message, {
                            title: 'алдаа',
                            autoHideDelay: 5000
                        })
                    }) 
                }
            }
        
        },
        onSelected(items){
            this.selectedRows=items;
        },

        updateRecord(){
            if(this.selectedRows.length==1){
                let id = this.selectedRows[0].catId;
                if(id && id>0){
                    
                    axios.get(apiDomain+'/admin/enu/ptest/updatecat/'+id+'',{headers:getHeader()})
                    .then(response=>{
                        let rData = response.data;
                        EventBus.$emit('pTestCategory',rData);
                        
                    })
                    .catch(error => {
                        //console.log(error.message)
                        this.$bvToast.toast(error.message, {
                            title: 'алдаа',
                            autoHideDelay: 5000
                        })
                    }) 
                }
            }
        
        },

        recordProvider(ctx){
            //alert("yes");
            this.isBusy = true;
            let promise = axios.post(apiDomain+'/admin/enu/ptest/gettestcatlist',ctx,{headers:getHeader()});
            ctx.groupId=this.groupId;
            return promise.then((response) => {
                const result = response.data;
                this.isBusy = false;
                this.totalRows=result.recordCount;
                
                return(result.items)
            })
            .catch(error => {
                this.isBusy = false
                alert(error.message);
                return [];
            });
        },
        refreshRecordTable(){
            this.$refs.recordTable.refresh();
        }
    }
}
</script>
<style scoped>

</style>