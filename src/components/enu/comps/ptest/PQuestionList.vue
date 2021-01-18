<template> 
    <b-row>
        <b-col lg="12">
            <b-col lg="12">
                <h5>
                    <span class="bd-content-title">{{$t('enu.ttest.catForm.questionTitle')}}</span>
                </h5>
            </b-col>
            <b-col lg="12" class="mb-3">
                <b-button variant="success" size="sm" class="mr-2" v-b-modal.questionModal>{{$t('system.newButton')}}</b-button>
                <b-button variant="info" v-if="selectedRows.length==1" size="sm" @click="updateRecord" class="mr-2">{{$t('system.updateButton')}}</b-button>
                <b-button variant="danger" v-if="selectedRows.length>0" size="sm" class="mr-2" @click="deleteRecord">{{$t('system.deleteButton')}}</b-button>
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
                <b-col lg="12">
                    <b-row class="mt-2">
                        
                        <b-col lg="12">
                            <select 
                                @change="catGroupChange"
                                v-model="catId" class="form-sm-control w-100">
                                <option value=0>{{$t('enu.ttest.questionList.chooseCategoryTxt')}}</option>
                                <option v-for="(c,i) in testCats"
                                    :key="i" :value="c.catId">
                                    {{$i18n.locale()=='kz' ? c.catName : c.catNameRu}}    
                                </option>
                            </select>
                        </b-col>
                    </b-row>
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
                        <template #head(catName)="data">
                            <span class="text-info">{{$t(data.label)}}</span>
                        </template>
                        <template v-slot:cell(catName)="row">
                            {{$i18n.locale()=='kz' ? row.item.catName : row.item.catNameRu}}
                        </template>
                        <template #head(additionalPoint)="data">
                            <span class="text-info">{{$t(data.label)}}</span>
                        </template>

                        <template #head(question)="data">
                            <span class="text-info">{{$t(data.label)}}</span>
                        </template>
                        <template v-slot:cell(question)="row">
                            {{$i18n.locale()=='kz' ? row.item.question : row.item.questionRu}}
                        </template>
                        <template v-slot:cell(factorName)="row">
                            {{$i18n.locale()=='kz' ? row.item.factorName : row.item.factorNameRu}}
                        </template>
                        <template #head(point)="data">
                            <span class="text-info">{{$t(data.label)}}</span>
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
                <AddPQuestion  :refreshRecordTable="refreshRecordTable"/>
            </b-row>
            
        </b-col>
        
         
    </b-row>

</template>

<script>
import {apiDomain,getHeader} from "@/config/config";
import AddPQuestion from '@/components/enu/modal/ptest/AddPQuestion';
import {EventBus} from '@/EventBus.js';
import axios from 'axios';
import Vue from 'vue';
export default {
    name : "PQuestionList",
    props:["prefreshRecordTable"],

    components:{
        AddPQuestion
    },
    data(){
        return{
            fields: [
                {
                    key: 'questionId',
                    label: 'ID'
                },
                {
                    key: 'catName',
                    label: 'enu.ttest.catName',
                },
                {
                    key: 'question',
                    label: 'enu.ttest.questionList.question',
                    variant:'success'
                },
                {
                    key: 'factorName',
                    label: 'FACTOR',
                    variant:'info'
                },
                {
                    key: 'point',
                    label: 'enu.ttest.questionList.testPoint',
                    
                }
                
            ],
            isSmall:false,
            isBusy:false,
            totalRows:0,
            currentPage: 1,
            perPage: 20, 
            filter:"",
            selectedRows:[],
            catId:0,
            testCats:[]
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
                        delIndexes.push(r.questionId);
                    })
                    o.indexes=delIndexes;
                    o.name='enu_ptest_question';
                    o.unique='question_id';

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
                let id = this.selectedRows[0].questionId;
                if(id && id>0){
                    
                    axios.get(apiDomain+'/admin/enu/ptest/updatequestion/'+id+'',{headers:getHeader()})
                    .then(response=>{
                        let rData = response.data;
                        EventBus.$emit('updatePQuestion',rData);
                        
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
            let promise = axios.post(apiDomain+'/admin/enu/ptest/geptestquestionlist',ctx,{headers:getHeader()});
            ctx.catId=this.catId;
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
            this.prefreshRecordTable();
        }
    },
    created(){
         axios.post(apiDomain+'/admin/enu/ref/getdatalist',{refType:'pCategory'},{headers:getHeader()})
            .then(response=>{
                this.testCats=response.data;
            })
            .catch(() => {
                //console.log(error.message)
                //alert("server dr aldaa uuslee");
            }
        ) 
    }
}
</script>
<style scoped>

</style>