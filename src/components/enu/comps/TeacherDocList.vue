<template>    
    <b-col lg="12">
        <b-col lg="12 my-3">
            <h4>
                <span class="bd-content-title">{{$t('teacherModule.myDocuments')}}</span>
            </h4>
        </b-col>
        <b-col lg="6" class="mb-3">
        
            <b-button variant="success" size="sm" class="mr-2" block v-b-modal.modal>{{$t('teacherModule.newDocument')}}</b-button>
            
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

                    :per-page="perPage"
                    :filter="filter"
                    :select-mode="'multi'"
                    
                    
                    selected-variant="danger"
                    @row-selected="onSelected">
                    
                    <!-- block name --> 
                    <template #head(blockName)="data">
                        <span class="text-info">{{$t(data.label)}}</span>
                    </template>
                    <template v-slot:cell(blockName)="row">
                        {{$i18n.locale()=='kz' ? row.item.blockName : row.item.blockNameRu}}
                    </template>
                    <!-- doc cat name --> 
                    <template #head(docCatName)="data">
                        <span class="text-info">{{$t(data.label)}}</span>
                    </template>
                    <template v-slot:cell(docCatName)="row">
                        {{$i18n.locale()=='kz' ? row.item.docCatName : row.item.docCatNameRu}}
                    </template>
                    <!-- doc name --> 
                    <template #head(docName)="data">
                        <span class="text-info">{{$t(data.label)}}</span>
                    </template>
                    <template v-slot:cell(docName)="row">
                        {{$i18n.locale()=='kz' ? row.item.docName : row.item.docNameRu}}
                    </template>
                    <!-- maximum point -->
                    <template #head(maxPoint)="data">
                        <span class="text-info">{{$t(data.label)}}</span>
                    </template>
                    <!-- taken point -->
                    <template #head(takenPoint)="data">
                        <span class="text-info">{{$t(data.label)}}</span>
                    </template>

                    <template v-slot:cell(departmentId)="{ rowSelected }">
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
        </b-row>
        <AddTeacherDocument :refreshRecordTable="refreshRecordTable"/>
    </b-col>    
</template>

<script>
import {apiDomain,getHeader} from "@/config/config";
import AddTeacherDocument from "@/components/enu/modal/AddTeacherDocument";
import {EventBus} from '@/EventBus.js';
import axios from 'axios';
import Vue from 'vue';
export default {
    name : "TeacherDocList",

    components:{
        AddTeacherDocument
    },
    data(){
        return{
            fields: [
                // {
                //     key: 'teacherDocRelId',
                //     label: 'ID'
                // },

                {
                    key: 'blockName',
                    label: 'enu.documentCategory.blockListName',
                },
                {
                    key: 'docCatName',
                    label: 'enu.teacherDocList.categoryName',
                },
                {
                    key: 'docName',
                    label: 'enu.docForm.docName',
                },
                {
                    key: 'maxPoint',
                    label: 'enu.blockForm.maxPoint',
                },
                {
                    key: 'takenPoint',
                    label: 'enu.teacherDocList.takenPoint',
                }
                
                
            ],
            isSmall:false,
            isBusy:false,
            totalRows:0,
            currentPage: 1,
            perPage: 20, 
            filter:"",
            selectedRows:[],
        }
    },
    methods:{
        deleteRecord(){
            let warn = confirm(Vue.i18n.translate('system.confirmMsg'));

            if(warn){
                if(this.selectedRows.length>0){
                    let o = new Object();

                    o.selectedRows=this.selectedRows;
                    o.type='enu_department';
                    axios.post(apiDomain+'/admin/delivery/deleteref',o,{headers:getHeader()})
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
                let id = this.selectedRows[0].departmentId;
                if(id && id>0){
                    axios.post(apiDomain+'/admin/enu/ref/getref',{refType:'department',refId:id},{headers:getHeader()})
                    .then(response=>{
                        let rData = response.data;
                        EventBus.$emit('updateDepartment',rData);
                        
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
            let promise = axios.post(apiDomain+'/admin/enu/kpibuisness/currentteacherdoclist',ctx,{headers:getHeader()});

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
