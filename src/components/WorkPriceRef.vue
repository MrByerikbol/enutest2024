<template>
    <div class="row">
         <b-modal 
            size="lg" 
            id="workPriceRefModal" 
            title="Пвх наалтын ажлын хөлс"
            ref="workPriceRefModal"
            hide-footer>

            <b-row>
                <b-col lg="12">
                   
                    <b-col lg="12" class="my-3">
                    
                        <b-button variant="success" size="sm" class="mr-2" v-b-modal.workPriceModal>Шинэ</b-button>
                        <b-button variant="info" v-if="selectedWorkPriceRows.length==1" size="sm" @click="updateWorkPriceRecord" class="mr-2">Засах</b-button>
                        <b-button variant="danger" v-if="selectedWorkPriceRows.length>0" size="sm" class="mr-2" @click="deleteWorkPriceRecord">Устгах</b-button>
                    </b-col>
                    <b-row>
                        <b-col lg="8">
                            <b-form-input
                                v-model="workPriceFilter"
                                type="search"
                                id="colorInput"
                                size="sm"
                                placeholder="Хайлт хийх утгаа оруулна уу"
                            ></b-form-input>
                        </b-col>
                        <b-col lg="4" class="pt-3 text-right">
                            <strong>тоо:</strong> {{totalWorkPriceRows}}  
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col lg="12">
                            <b-table 
                                ref="workPriceTable"
                                striped hover selectable
                                :items="workPriceProvider" 
                                :fields="workPriceFields"
                                :busy.sync="isWorkPriceBusy"
                                :current-page="workPriceCurrentPage"
                                :per-page="workPricePerPage"
                                :filter="workPriceFilter"
                                :select-mode="'multi'"
                                responsive="sm"
                                :small="isSmall"
                                @row-selected="onWorkPriceSelected">
                                
                                <template v-slot:table-busy>
                                    <div class="text-center text-info my-2">
                                    <b-spinner class="align-middle"></b-spinner>
                                    <strong>Ачаалж байна...</strong>
                                    </div>
                                </template>
                                <template v-slot:cell(workTypeId)="row">
                                    {{row.item.workTypeId==1 ? 'Прямая' : 'Овальная'}}
                            
                                </template>
                        
                            </b-table>
                        </b-col>
                        <b-col lg="12">
                            <b-pagination
                                v-model="workPriceCurrentPage"
                                :total-rows="totalWorkPriceRows"
                                :per-page="workPricePerPage"
                                align="fill"
                                size="sm"
                                class="my-0"
                                
                            ></b-pagination>
                        </b-col>
                    </b-row>

                    <b-modal id="workPriceModal" title="Шинэ ажлын хөлс нэмэх" hide-footer>
                        <b-form v-on:submit.prevent="submitWorkPrice">
                            <b-form-row class="mb-3">
                                
                                <b-col sm="auto" lg="12" md="12">
                                    <label for="workTypeId">Наалтын төрөл</label>
                                    <select class="form-control"
                                        id="workTypeId"
                                        v-model="workPriceForm.workTypeId"
                                    >
                                        <option value=-1>--сонгох--</option>

                                        <option value=1>Прямая</option>
                                        <option value=0>Овальная</option>
                                    </select>
                                </b-col>
                                <b-col sm="auto" lg="12" md="12">
                                    <label for="workName">Ажлын нэр</label>
                                    <input type="text" required class="form-control"
                                        id="workName"
                                        v-model="workPriceForm.workName"
                                    /> 
                                </b-col>
                                <b-col sm="auto" lg="12" md="12">
                                    <label for="workPrice">Ажлын хөлс</label>
                                    <input type="number" required class="form-control"
                                        id="workPrice"
                                        v-model="workPriceForm.workPrice"
                                    /> 
                                </b-col>
                                <b-col sm="auto" lg="12" md="12">
                                    <label for="workerPrice">Ажилтаны хөлс</label>
                                    <input type="number" required class="form-control"
                                        id="workerPrice"
                                        v-model="workPriceForm.workerPrice"
                                    /> 
                                </b-col>
                            </b-form-row>
                            <b-button type="submit" variant="primary" class="mr-2">Шинэ ажлын үүсгэх</b-button>
                            <b-button type="reset" variant="danger">Арилгах</b-button>
                        </b-form>    
                    </b-modal>
                </b-col> 

               
            </b-row>
         </b-modal>
    </div>
</template>

<script>
import {apiDomain,getHeader} from "../config/config";
import axios from 'axios';
export default {
    name : "workPriceRef",
    data(){
        return{
            workPriceForm:{
                id: 0,
                workTypeId : -1,
                workName : "",
                workPrice : 0,
                workerPrice : 0
            },

            workPriceFields: [
                {
                    key: 'workName',
                    label: 'Ажлын нэр',
                },
                {
                    key: 'workTypeId',
                    label: 'Ажлын төрөл',
                },
                {
                    key: 'workPrice',
                    label: 'Ажлын хөлс',
                },
                {
                    key: 'workerPrice',
                    label: 'Ажилтаны хөлс',
                }

            ],
            isSmall:true,
            isWorkPriceBusy:false,
            totalWorkPriceRows:0,
            workPriceCurrentPage: 1,
            workPricePerPage: 20, 
            workPriceFilter:"",
            selectedWorkPriceRows:[],

        
        }
    },
    methods:{
        deleteWorkPriceRecord(){
            let warn = confirm("Та итгэлтэй байна уу ?");
            if(warn){
                if(this.selectedWorkPriceRows.length>0){
                let o = new Object();
                o.selectedRows=this.selectedWorkPriceRows;
                o.type='bay_work_price';

                axios.post(apiDomain+'/admin/delivery/deleteref',o,{headers:getHeader()})
                    .then(()=>{
                        this.$refs.workPriceTable.refresh(); 
                    
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
        updateWorkPriceRecord(){
            if(this.selectedWorkPriceRows.length==1){
                let id = this.selectedWorkPriceRows[0].id;
                if(id>0){
                axios.post(apiDomain+'/admin/delivery/getref',{type:'workPrice',id:id},{headers:getHeader()})
                .then(response=>{
                    this.workPriceForm=response.data;
                    this.$bvModal.show('workPriceModal');
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
        submitWorkPrice(evt){
            evt.preventDefault();
            if(this.workPriceForm.workTypeId==-1){
                    this.$bvToast.toast("Та ажлын төрөл сонгоно уу!!!", {
                    title: 'Алдааны мэдээлэл',
                    autoHideDelay: 5000,
                    variant:'danger'
                })
                return ;
            }
            axios.post(apiDomain+'/admin/delivery/addworkprice/',this.workPriceForm,{headers:getHeader()})
            .then(()=>{
                
                let alertMsg = "Шинээр ажлын хөлс амжилттай үүслээ";
                this.$bvToast.toast(alertMsg, {
                    title: 'Амжилт',
                    autoHideDelay: 5000,
                    variant:"success"
                })  
                this.$bvModal.hide('workPriceModal')
                this.workPriceForm={
                    id:0,
                    workTypeId:-1,
                    workName:"",
                    workPrice:0,
                    workerPrice:0
                }
                this.$refs.workPriceTable.refresh();
            })
            .catch(error => {
                    //console.log(error.message)
                    this.$bvToast.toast(error.message, {
                        title: 'Алдааны мэдээлэл',
                        autoHideDelay: 5000,
                        variant:'danger'
                    })
                }
            ) 
        },
        onWorkPriceSelected(items){
            this.selectedWorkPriceRows=items;
        },
        workPriceProvider(ctx){
            //alert("yes");
            this.isWorkPriceBusy = true;
            let promise = axios.post(apiDomain+'/admin/pcat/worpricelist',ctx,{headers:getHeader()});

            return promise.then((response) => {
                const result = response.data;
                this.isWorkPriceBusy = false;
                this.totalWorkPriceRows=result.recordCount;
                //alert(JSON.stringify(result));
                return(result.items)
            }).catch(error => {
                this.isWorkPriceBusy = false
                alert(error.message);
                return [];
            });
        }

      
    }
}
</script>
<style scoped>

</style>