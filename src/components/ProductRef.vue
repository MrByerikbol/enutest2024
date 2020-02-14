<template>
    <div class="row">
         <b-modal 
            size="lg" 
            id="productRefModal" 
            title="Барааны лавлах сангууд"
            ref="productRefModal"
            @hide="onRefHide"
            hide-footer>

            <b-row>
                <b-col lg="6">
                    <b-col lg="12">
                        <h5>
                            <span class="bd-content-title">Барааны өнгө</span>
                        </h5>
                    </b-col>
                    <b-col lg="12" class="my-3">
                    
                        <b-button variant="success" size="sm" class="mr-2" v-b-modal.productColorModal>Шинэ</b-button>
                        <b-button variant="info" v-if="selectedColorRows.length==1" size="sm" @click="updateColorRecord" class="mr-2">Засах</b-button>
                        <b-button variant="danger" v-if="selectedColorRows.length>0" size="sm" class="mr-2" @click="deleteColorRecord">Устгах</b-button>
                    </b-col>
                    <b-row>
                        <b-col lg="8">
                            <b-form-input
                                v-model="colorFilter"
                                type="search"
                                id="colorInput"
                                size="sm"
                                placeholder="Хайлт хийх утгаа оруулна уу"
                            ></b-form-input>
                        </b-col>
                        <b-col lg="4" class="pt-3 text-right">
                            <strong>тоо:</strong> {{totalColorRows}}  
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col lg="12">
                            <b-table 
                                ref="colorTable"
                                striped hover selectable
                                :items="colorProvider" 
                                :fields="colorFields"
                                :busy.sync="isColorBusy"
                                :current-page="colorCurrentPage"
                                :per-page="colorPerPage"
                                :filter="colorFilter"
                                :select-mode="'multi'"
                                responsive="sm"
                                :small="isSmall"
                                @row-selected="onColorSelected">
                                
                                <template v-slot:table-busy>
                                    <div class="text-center text-info my-2">
                                    <b-spinner class="align-middle"></b-spinner>
                                    <strong>Ачаалж байна...</strong>
                                    </div>
                                </template>
                        
                        
                            </b-table>
                        </b-col>
                        <b-col lg="12">
                            <b-pagination
                                v-model="colorCurrentPage"
                                :total-rows="totalColorRows"
                                :per-page="colorPerPage"
                                align="fill"
                                size="sm"
                                class="my-0"
                                
                            ></b-pagination>
                        </b-col>
                    </b-row>

                    <b-modal id="productColorModal" title="Шинэ барааны өнгө нэмэх" hide-footer>
                        <b-form v-on:submit.prevent="submitProductColor">
                            <b-form-row class="mb-3">
                                
                                <b-col sm="auto" md="12">
                                    <label for="colorName">Барааны өнгө</label>
                                    <b-form-input
                                        id="colorName"
                                        v-model="colorForm.refName"
                                        type="text"
                                        required
                                        placeholder="Барааны өнгө"
                                    ></b-form-input>
                                </b-col>
                            </b-form-row>
                            <b-button type="submit" variant="primary" class="mr-2">Шинэ өнгө үүсгэх</b-button>
                            <b-button type="reset" variant="danger">Арилгах</b-button>
                        </b-form>    
                    </b-modal>
                </b-col> 

                <b-col lg="6">
                    <b-col lg="12">
                        <h5>
                            <span class="bd-content-title">Барааны хэмжээ</span>
                        </h5>
                    </b-col>
                    <b-col lg="12" class="my-3">
                    
                        <b-button variant="success" size="sm" class="mr-2" @click="newMeasure">Шинэ</b-button>
                        <b-button variant="info" v-if="selectedMeasureRows.length==1" size="sm" @click="updateMeasureRecord" class="mr-2">Засах</b-button>
                        <b-button variant="danger" v-if="selectedMeasureRows.length>0" size="sm" class="mr-2" @click="deleteMeasureRecord">Устгах</b-button>
                    </b-col>
                    <b-row>
                        <b-col lg="8">
                            <b-form-input
                                v-model="measureFilter"
                                type="search"
                                id="colorInput"
                                size="sm"
                                placeholder="Хайлт хийх утгаа оруулна уу"
                            ></b-form-input>
                        </b-col>
                        <b-col lg="4" class="pt-3 text-right">
                            <strong>тоо:</strong> {{totalMeasureRows}}  
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col lg="12">
                            <b-table 
                                ref="measureTable"
                                striped hover selectable
                                :items="measureProvider" 
                                :fields="measureFields"
                                :busy.sync="isMeasureBusy"
                                :current-page="measureCurrentPage"
                                :per-page="measurePerPage"
                                :filter="measureFilter"
                                :select-mode="'multi'"
                                responsive="sm"
                                :small="isSmall"
                                @row-selected="onMeasureSelected">
                                
                                <template v-slot:table-busy>
                                    <div class="text-center text-info my-2">
                                    <b-spinner class="align-middle"></b-spinner>
                                    <strong>Ачаалж байна...</strong>
                                    </div>
                                </template>
                        
                        
                            </b-table>
                        </b-col>
                        <b-col lg="12">
                            <b-pagination
                                v-model="measureCurrentPage"
                                :total-rows="totalMeasureRows"
                                :per-page="measurePerPage"
                                align="fill"
                                size="sm"
                                class="my-0"
                                
                            ></b-pagination>
                        </b-col>
                    </b-row>

                    <b-modal id="productMeasureModal" title="Шинэ барааны хэмжээ нэмэх" hide-footer>
                        <b-form v-on:submit.prevent="submitProductMeasure">
                            <b-form-row class="mb-3">
                                <b-col sm="auto" md="12">
                                    <label for="catId">Төрөл</label>
                                    <select class="form-control"
                                        id="catId"
                                        v-model="measureForm.catId"
                                    >
                                        <option value=0>--сонгох--</option>
                                        <option v-for="(c,i) in productCats" :key="i" :value=c.catId>
                                            {{c.catName}}
                                        </option>
                                    </select>
                                </b-col>
                                <b-col sm="auto" md="12">
                                    <label for="measureName">Барааны хэмжээ</label>
                                    <b-form-input
                                        id="measureName"
                                        v-model="measureForm.refName"
                                        type="text"
                                        required
                                        placeholder="Барааны хэмжээ"
                                    ></b-form-input>
                                </b-col>
                            </b-form-row>
                            <b-button type="submit" variant="primary" class="mr-2">Шинэ хэмжээ үүсгэх</b-button>
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
    name : "ProductRef",
    props:["parentRefs"],

    data(){
        return{
            colorForm:{
                refType:'color',
                refName : "",
                refId:0
            },

            colorFields: [
                {
                    key: 'colorName',
                    label: 'Барааны өнгө',
                }
            ],
            isSmall:true,
            isColorBusy:false,
            totalColorRows:0,
            colorCurrentPage: 1,
            colorPerPage: 20, 
            colorFilter:"",
            selectedColorRows:[],

            //begining of the measure 
            measureForm:{
                refType:'measure',
                refName : "",
                refId:0,
                catId:0
            },

            measureFields: [
                {
                    key: 'catName',
                    label: 'Төрөл',
                },
                {
                    key: 'measureName',
                    label: 'Барааны хэмжээ',
                }
            ],
           
            isMeasureBusy:false,
            totalMeasureRows:0,
            measureCurrentPage: 1,
            measurePerPage: 20, 
            measureFilter:"",
            selectedMeasureRows:[],
            productCats:[]
        }
    },
    methods:{
        newMeasure(){
            this.getRef(7);
            this.$bvModal.show('productMeasureModal');
        },
        onRefHide(){
            this.parentRefs(11);
            this.parentRefs(12);
        },
        deleteColorRecord(){
            let warn = confirm("Та итгэлтэй байна уу ?");
            if(warn){
                if(this.selectedColorRows.length>0){
                let o = new Object();
                o.selectedRows=this.selectedColorRows;
                o.type='bay_product_color';

                axios.post(apiDomain+'/admin/delivery/deleteref',o,{headers:getHeader()})
                    .then(()=>{
                        this.$refs.colorTable.refresh(); 
                    
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
        updateColorRecord(){
            if(this.selectedColorRows.length==1){
                let id = this.selectedColorRows[0].id;
                if(id>0){
                axios.post(apiDomain+'/admin/delivery/getref',{type:'productColor',id:id},{headers:getHeader()})
                .then(response=>{

                    let rData = response.data;
                    this.colorForm.refId=rData.refId;
                    this.colorForm.refName =  rData.refName;
                    this.colorForm.retType='color';
                    this.$bvModal.show('productColorModal');
                    
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
        submitProductColor(evt){
            evt.preventDefault();
           
            axios.post(apiDomain+'/admin/delivery/addref/',this.colorForm,{headers:getHeader()})
            .then(()=>{
                let alertMsg = "Шинээр барааны өнгө амжилттай үүслээ";
                this.$bvToast.toast(alertMsg, {
                    title: 'Амжилт',
                    autoHideDelay: 5000
                })  
                this.$bvModal.hide('productColorModal')
                this.colorForm={
                    refId:0,
                    refName:"",
                    refType:'color'
                }
                this.$refs.colorTable.refresh();
            })
            .catch(error => {
                    //console.log(error.message)
                    this.$bvToast.toast(error.message, {
                        title: 'Алдааны мэдээлэл',
                        autoHideDelay: 5000
                    })
                }
            ) 
        },
        onColorSelected(items){
            this.selectedColorRows=items;
        },
        colorProvider(ctx){
            //alert("yes");
            this.isColorBusy = true;
            let promise = axios.post(apiDomain+'/admin/pcat/colorlist',ctx,{headers:getHeader()});

            return promise.then((response) => {
                const result = response.data;
                this.isColorBusy = false;
                this.totalColorRows=result.recordCount;
                //alert(JSON.stringify(result));
                return(result.items)
            }).catch(error => {
                this.isColorBusy = false
                alert(error.message);
                return [];
            });
        },

        //begining of the measure 
        deleteMeasureRecord(){
            let warn = confirm("Та итгэлтэй байна уу ?");
            if(warn){
                if(this.selectedMeasureRows.length>0){
                let o = new Object();
                o.selectedRows=this.selectedMeasureRows;
                o.type='bay_product_measure';

                axios.post(apiDomain+'/admin/delivery/deleteref',o,{headers:getHeader()})
                    .then(()=>{
                        this.$refs.measureTable.refresh(); 
                    
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
        updateMeasureRecord(){
            if(this.selectedMeasureRows.length==1){
                let id = this.selectedMeasureRows[0].id;
                if(id>0){
                    this.getRef(7);
                    axios.post(apiDomain+'/admin/delivery/getref',{type:'productMeasure',id:id},{headers:getHeader()})
                    .then(response=>{

                        let rData = response.data;
                        this.measureForm.refId=rData.refId;
                        this.measureForm.refName =  rData.refName;
                        this.measureForm.retType='measure';
                        this.measureForm.catId=rData.catId;
                        this.$bvModal.show('productMeasureModal');
                        
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
        submitProductMeasure(evt){
            evt.preventDefault();
            if(this.measureForm.catId && this.measureForm.catId>0){
                axios.post(apiDomain+'/admin/delivery/addref/',this.measureForm,{headers:getHeader()})
                .then(()=>{
                    let alertMsg = "Шинээр барааны хэмжээ амжилттай үүслээ";
                    this.$bvToast.toast(alertMsg, {
                        title: 'Амжилт',
                        autoHideDelay: 5000,
                        variant:'success'
                    })  
                    this.$bvModal.hide('productMeasureModal')
                    this.measureForm={
                        refId:0,
                        refName:"",
                        refType:'measure',
                        catId:0
                    }
                    this.$refs.measureTable.refresh();
                })
                .catch(error => {
                        //console.log(error.message)
                        this.$bvToast.toast(error.message, {
                            title: 'Алдааны мэдээлэл',
                            autoHideDelay: 5000,
                            variant:"danger"
                        })
                    }
                ) 
            }
            else{
                this.$bvToast.toast("Та төрөл заавал сонгоно уу.", {
                    title: 'Алдааны мэдээлэл',
                    autoHideDelay: 5000,
                    variant:"danger"
                })    
            }
            
        },
        onMeasureSelected(items){
            this.selectedMeasureRows=items;
        },
        measureProvider(ctx){
            //alert("yes");
            this.isMeasureBusy = true;
            let promise = axios.post(apiDomain+'/admin/pcat/measurelist',ctx,{headers:getHeader()});

            return promise.then((response) => {
                const result = response.data;
                this.isMeasureBusy = false;
                this.totalMeasureRows=result.recordCount;
                //alert(JSON.stringify(result));
                return(result.items)
            }).catch(error => {
                this.isMeasureBusy = false
                alert(error.message);
                return [];
            });
        },
        getRef(type){
            axios.get(apiDomain+'/admin/delivery/refs/'+type,{headers:getHeader()})
            .then(response=>{
                if(type===7){
                    this.productCats=response.data;
                }
            });  
        }
    }
}
</script>
<style scoped>

</style>