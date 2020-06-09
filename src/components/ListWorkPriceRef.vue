<template>
    <div class="row">
         <b-modal 
            size="lg" 
            id="ListWorkPriceRefModal" 
            title="Лист зүсэлтийн ажлын хөлс"
            ref="ListWorkPriceRefModal"
            hide-footer>

            <b-row>
                <b-col lg="12">
                   
                    <b-col lg="12" class="my-3">
                    
                        <b-button variant="success" size="sm" class="mr-2" v-b-modal.workListPriceModal>Шинэ</b-button>
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
                                    <strong>Жүктелуде...</strong>
                                    </div>
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

                    <b-modal id="workListPriceModal" title="Шинэ зүсэлтийн хөлс нэмэх" hide-footer>
                        <b-form v-on:submit.prevent="submitWorkPrice">
                            <b-form-row class="mb-3">
                                
                                <b-col sm="auto" lg="12" md="12">
                                    <label for="catId">Барааны төрөл</label>
                                    <select class="form-control"
                                        id="catId"
                                        v-model="workPriceForm.catId"
                                    >
                                        <option value=-1>--таңдау--</option>
                                        <option v-for="(p,i) in productCats.filter(c=>c.catName!='PVH')" :key="i" :value="p.catId">
                                            {{p.catName}}
                                        </option>
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
    name : "ListWorkPriceRef",
    props:["productCats"],

    data(){
        return{
            workPriceForm:{
                id: 0,
                catId : -1,
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
                    key: 'catName',
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
            let warn = confirm("Сіз сенімдісіз бе ?");
            if(warn){
                if(this.selectedWorkPriceRows.length>0){
                let o = new Object();
                o.selectedRows=this.selectedWorkPriceRows;
                o.type='bay_list_work_price';

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
                axios.post(apiDomain+'/admin/delivery/getref',{type:'listWorkPrice',id:id},{headers:getHeader()})
                .then(response=>{
                    this.workPriceForm=response.data;
                    this.$bvModal.show('workListPriceModal');
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
            if(this.workPriceForm.catId==-1){
                    this.$bvToast.toast("Та ажлын төрөл сонгоно уу!!!", {
                    title: 'Қате туралы ақпарат',
                    autoHideDelay: 5000,
                    variant:'danger'
                })
                return ;
            }
            axios.post(apiDomain+'/admin/delivery/addlistworkprice/',this.workPriceForm,{headers:getHeader()})
            .then(()=>{
                
                let alertMsg = "Шинээр ажлын хөлс Жетістіктай үүслээ";
                this.$bvToast.toast(alertMsg, {
                    title: 'Жетістік',
                    autoHideDelay: 5000,
                    variant:"success"
                })  
                this.$bvModal.hide('workListPriceModal')
                this.workPriceForm={
                    id:0,
                    catId:-1,
                    workName:"",
                    workPrice:0,
                    workerPrice:0
                }
                this.$refs.workPriceTable.refresh();
            })
            .catch(error => {
                    //console.log(error.message)
                    this.$bvToast.toast(error.message, {
                        title: 'Қате туралы ақпарат',
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
            let promise = axios.post(apiDomain+'/admin/pcat/listworpricelist',ctx,{headers:getHeader()});

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