<template>    
    <b-col lg="12">
        <b-col lg="12 my-3">
            <h4>
                <span class="bd-content-title">{{$t('teacherModule.myDocuments')}}</span>
            </h4>
        </b-col>
        <b-col lg="12">
            <b-row>
                <b-col lg="6" class="mb-3">
                    <b-button variant="outline-success" size="sm" class="mr-2" block disabled>{{$t('teacherModule.newDocument')}}</b-button>
                </b-col>
                <b-col lg="6" class="mb-3">
                    <b-button @click="toFillDoc" variant="outline-info" size="sm" class="mr-2" block>
                        <!-- {{$t('enu.teacherDocList.yearPlanning')}} -->
                        {{$t('enu.teacherDocList.fillDocH1Title')}}
                    </b-button>
                </b-col>
            </b-row>
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
                    <!-- block ashatin icon -->
                    <template #head(blockActions)="data">
                        <span class="text-info pl-2"><b-icon icon="chevron-compact-down" font-scale="1.5"></b-icon></span>
                    </template>
                    <template v-slot:cell(blockActions)="row">
                        <b-button @click="row.toggleDetails" 
                            variant="outline-info"  size="sm" >
                           <b-icon icon="chevron-compact-down" font-scale="1.5"></b-icon>
                        </b-button>
                    </template>
                    <!-- blocktin ishindegi document categoyalari  -->
                     <template v-slot:row-details="row">
                        <b-card>
                            <b-row>
                                <b-col lg="12">
                                    <h6>{{$t('enu.teacherDocListSunDocCatListTitle')}}</h6>
                                </b-col>
                            </b-row>
                            <b-table striped :fields="docCatFields" hover
                                table-variant="warning" :items="row.item.docCats">

                                <template #head(docCatActions)="data">
                                    <span class="text-info pl-2"><b-icon icon="chevron-compact-down" font-scale="1.5"></b-icon></span>
                                </template>
                                <template v-slot:cell(docCatActions)="row">
                                    <b-button @click="row.toggleDetails" 
                                        variant="outline-info"  size="sm" >
                                        <b-icon icon="chevron-compact-down" font-scale="1.5"></b-icon>
                                    </b-button>    
                                </template>
                                <!-- docCatName name --> 
                                <template #head(docCatName)="data">
                                    <span class="text-info">{{$t(data.label)}}</span>
                                </template>
                                <template v-slot:cell(docCatName)="row">
                                    {{$i18n.locale()=='kz' ? row.item.docCatName : row.item.docCatNameRu}}
                                </template>
                            
                                <!-- maximum point -->
                                <template #head(maxPoint)="data">
                                    <span class="text-info">{{$t(data.label)}}</span>
                                </template>
                                <!-- planned point -->
                                <template #head(plannedPoint)="data">
                                    <span class="text-info">{{$t(data.label)}}</span>
                                </template>
                                <!-- taken point -->
                                <template #head(takenPoint)="data">
                                    <span class="text-info">{{$t(data.label)}}</span>
                                </template>
                               
                                
                                <!-- categordin bashanda shigatin docummentter -->
                                <template v-slot:row-details="row">
                                    <b-card>
                                        <h6>{{$t('enu.documentList.title')}}</h6>
                                        <b-table striped :fields="docFields" hover
                                            table-variant="success" :items="row.item.docs">
                                            <!-- docCatName name --> 
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
                                            <!-- planned point -->
                                            <template #head(plannedPoint)="data">
                                                <span class="text-info">{{$t(data.label)}}</span>
                                            </template>
                                            <!-- taken point -->
                                            <template #head(takenPoint)="data">
                                                <span class="text-info">{{$t(data.label)}}</span>
                                            </template>
                                            <!-- docCatName name --> 
                                            <template #head(docActions)="data">
                                                <span class="text-info">{{$t(data.label)}}</span>
                                            </template>
                                            <template v-slot:cell(docActions)="row">
                                                <b-button variant="danger" size="sm" class="float-left"
                                                     @click="showConfirmModal(row.item.teacherDocRelId)">{{$t('system.deleteButton')}}</b-button>

                                                <b-button variant="info" size="sm" class="float-left" 
                                                     @click="downloadDoc(row.item.teacherDocRelId,row.item.fileName)">

                                                     {{$t('enu.teacherDocList.downloadDocument')}}
                                                </b-button>
                                               
                                            </template>
                                        </b-table>
                                        <b-row>
                                            <b-col lg="12" class="text-right py-2">
                                                <b-button size="sm" variant="warning" @click="row.toggleDetails">{{$t('enu.system.closeSubDocument')}}</b-button>
                                            </b-col>
                                        </b-row>
                                    </b-card>
                                </template>
                            </b-table>
                            <b-row>
                                <b-col lg="12" class="text-right py-2">
                                    <b-button size="sm" variant="info" @click="row.toggleDetails">{{$t('enu.system.closeSubCategory')}}</b-button>
                                </b-col>
                            </b-row>
                        </b-card>
                    </template>
                    <!-- block name --> 
                    <template #head(blockName)="data">
                        <span class="text-info">{{$t(data.label)}}</span>
                    </template>
                    <template v-slot:cell(blockName)="row">
                        {{$i18n.locale()=='kz' ? row.item.blockName : row.item.blockNameRu}}
                    </template>
                   
                    <!-- maximum point -->
                    <template #head(maxPoint)="data">
                        <span class="text-info">{{$t(data.label)}}</span>
                    </template>
                    <!-- planned point -->
                    <template #head(plannedPoint)="data">
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
                <b-modal ref="confirm-modal" hide-footer :title="$t('system.confirmMsg')" @hide="hideModal">
                    <b-overlay :show="delOverlay" rounded="sm">
                        <!-- <div class="d-block text-center">
                            <h3>{{$t('system.confirmMsg')}}</h3>
                        </div> -->
                        <b-button class="mt-3" size="sm" variant="outline-danger" block @click="deleteDocument">Ok</b-button>
                        <b-button class="mt-2" size="sm" variant="outline-warning" block @click="hideModal">Cancel</b-button>
                    </b-overlay>
                </b-modal>
            </b-col>
        </b-row>
        <AddTeacherDocument :refreshRecordTable="refreshRecordTable"/>
    </b-col>    
</template>

<script>
import {apiDomain,getHeader} from "@/config/config";
import AddTeacherDocument from "@/components/enu/modal/AddTeacherDocument";
//import {EventBus} from '@/EventBus.js';
import axios from 'axios';
//import Vue from 'vue';
export default {
    name : "TeacherDocList",

    components:{
        AddTeacherDocument
    },
    data(){
        return{
            docCatFields:[
                {
                    key: 'docCatActions',
                    
                },

                {
                    key: 'docCatName',
                    label: 'enu.teacherDocList.categoryName',
                },
                {
                    key: 'maxPoint',
                    label: 'enu.blockForm.maxPoint',
                },
                {
                    key: 'plannedPoint',
                    label: 'enu.teacherDocList.plannedPoint',
                },
               
                {
                    key: 'takenPoint',
                    label: 'enu.teacherDocList.takenPoint',
                }
            ],
            docFields:[
                {
                    key: 'docName',
                    label: 'enu.docForm.docName',
                },
                {
                    key: 'maxPoint',
                    label: 'enu.blockForm.maxPoint',
                },
                {
                    key: 'plannedPoint',
                    label: 'enu.teacherDocList.plannedPoint',
                },
               
                {
                    key: 'takenPoint',
                    label: 'enu.teacherDocList.takenPoint',
                }, 
                {
                    key: 'docActions',
                    label: 'enu.teacherDocList.docActions',
                }
            ],
            fields: [
                {
                    key: 'blockActions',
                    
                },

                {
                    key: 'blockName',
                    label: 'enu.documentCategory.blockListName',
                },
                {
                    key: 'maxPoint',
                    label: 'enu.blockForm.maxPoint',
                },
                {
                    key: 'plannedPoint',
                    label: 'enu.teacherDocList.plannedPoint',
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
            delTeacherDocRelId :null,
            delOverlay:false
        }
    },
    methods:{
        toFillDoc(){
            this.$router.push({name:"TeacherFillDoc"});
        },
        downloadDoc(teacherDocRelId,fileName){
            //alert("here ");
            axios.post(apiDomain+'/admin/enu/kpibuisness/downloaddoc',
                {
                    'teacherDocRelId':teacherDocRelId
                },
                {
                  responseType: 'blob', // important
                  headers:getHeader()
                }
            )
            .then((response) => {
                //alert(JSON.stringify(response.data));
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);

                document.body.appendChild(link);
                link.click();
            });
        },
        hideModal() {
            //alert("hide detected");
            this.delTeacherDocRelId=null;
            this.$refs['confirm-modal'].hide();
        },
        deleteDocument() {
            //alert("do something "+this.delTeacherDocRelId);  
            this.delOverlay=true;
            axios.post(apiDomain+'/admin/enu/kpibuisness/deltedoc',
            {'teacherDocRelId':this.delTeacherDocRelId},
            {headers:getHeader()})
            .then(()=>{
                this.delOverlay=false;
                this.$refs.recordTable.refresh(); 
                this.hideModal();   
            })
            .catch(error => {
                this.delOverlay=false;
                alert(error.message);
            });
            
        },
        showConfirmModal(teacherDocRelId){
            this.$refs['confirm-modal'].show();
            this.delTeacherDocRelId=teacherDocRelId;
        },
        onSelected(items){
            this.selectedRows=items;
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
