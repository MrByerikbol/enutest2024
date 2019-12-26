<template>
    <b-row>
      <b-col lg="12">
        <h3>
          <span class="bd-content-title">Дэлгүүрийн жагсаалт</span>
        </h3>
      </b-col>
      <b-col lg="12" class="mt-3">
      
          <b-button variant="success" size="sm" class="mr-2" v-b-modal.shopModal>Шинэ</b-button>
          <b-button variant="info" v-if="selectedRows.length==1" size="sm" @click="updateRecord" class="mr-2">Засах</b-button>
          <b-button variant="danger" v-if="selectedRows.length>0" size="sm" class="mr-2" @click="deleteRecord">Устгах</b-button>

      </b-col>
      <b-col lg="6">
        <b-form-group
          label="Хайлт"
          label-cols-sm="1"
          label-align-sm="left"
          label-size="sm"
          label-for="filterInput"
          class="mb-2 mt-3"
        >
          <b-input-group size="sm">
            <b-form-input
              v-model="filter"
              type="search"
              id="filterInput"
              placeholder="Хайлт хийх утгаа оруулна уу"
            ></b-form-input>
            
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col lg="6" class="pt-3 text-right">
        <strong>тоо:</strong> {{totalRows}}  
      </b-col>
      <b-table 
        ref="shopTable"
        striped hover selectable
        :items="shopProvider" 
        :fields="fields"
        :busy.sync="isBusy"
        :current-page="currentPage"
        :per-page="perPage"
        :table-variant="tableVariant"
        :filter="filter"
        :select-mode="selectMode"
        selected-variant="active"
      
        @row-selected="onShopSelected"
        >
        <template v-slot:cell(id)="{ rowSelected }">
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
            <strong>Ачаалж байна...</strong>
          </div>
        </template>

     
      </b-table>
      <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          align="fill"
          size="sm"
          class="my-0"
          
      ></b-pagination>

      <b-modal id="shopModal" title="Шинэ дэлгүүр нэмэх" hide-footer>
          <b-form v-on:submit.prevent="submitShop">
                <b-form-row class="mb-3">

                    <b-col sm="auto" md="12">
                        <label for="name">Дэлгүүрийн нэр</label>
                        <b-form-input
                            id="name"
                            v-model="shopForm.name"
                            type="text"
                            required
                            placeholder="Дэлгүүрийн нэр"
                        ></b-form-input>
                    </b-col>
                    <b-col sm="auto" md="12">
                        <label  for="phone">Дэлгүүрийн утас</label>
                        <b-form-input
                            id="phone"
                            v-model="shopForm.phone"
                            type="text"
                            required
                            placeholder="Дэлгүүрийн утас"
                        ></b-form-input>
                    </b-col>
                    <b-col sm="auto" md="12">
                        <label  for="address">Дэлгүүрийн хаяг</label>
                        <b-form-textarea
                            id="address"
                            v-model="shopForm.address"                            
                            required
                            placeholder="Дэлгүүрийн хаяг"
                        ></b-form-textarea>
                    </b-col>
                    
                    
                </b-form-row>
                <b-button type="submit" variant="primary" class="mr-2">Шинэ дэлгүүр үүсгэх</b-button>
                <b-button type="reset" variant="danger">Арилгах</b-button>
            </b-form>    
        </b-modal>
    </b-row>

</template>

<script>
import axios from 'axios';
import {apiDomain,loginUrl,getHeader} from "../config/config";

export default {

  name: 'Shops',
  data(){
    return {
      fields: [
          {
            key: 'id',
            label: 'Id',
          },
          {
            key: 'name',
            label: 'Дэлгүүрийн нэр',
          },
          {
            key: 'phone',
            label: 'Дэлгүүрийн утас',
          },
          {
            key: 'address',
            label: 'Дэлгүүрийн хаяг',
          }
      ],
      isBusy:false,
      totalRows:0,
      currentPage: 1,
      perPage: 20,
      tableVariant:'light',
      filter:"",
      selectMode:'multi',
      selectedRows:[],

      //begining of the form submission
      shopForm:{
        id:0,
        name:"",
        phone:"",
        address:""
      }
    }
  },
  methods:{
    deleteRecord(){
      let warn = confirm("Та итгэлтэй байна уу ?");
      if(warn){
        if(this.selectedRows.length>0){
          let o = new Object();
          o.selectedRows=this.selectedRows;
          o.type='del_delivery_shop';

          axios.post(apiDomain+'/admin/delivery/deleteref',o,{headers:getHeader()})
            .then(response=>{
              this.$refs.shopTable.refresh();  
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
    updateRecord(){
      if(this.selectedRows.length==1){
        let id = this.selectedRows[0].id;
        if(id>0){
          axios.post(apiDomain+'/admin/delivery/getref',{type:'shop',id:id},{headers:getHeader()})
          .then(response=>{
            this.shopForm=response.data;
            this.$bvModal.show('shopModal')    
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
    submitShop(evt){
          evt.preventDefault();
          axios.post(apiDomain+'/admin/delivery/addshop/',this.shopForm,{headers:getHeader()})
            .then(response=>{
                let alertMsg = "Шинээр дэлгүүр амжилттай үүслээ";
                this.$bvToast.toast(alertMsg, {
                    title: 'Амжилт',
                    autoHideDelay: 5000
                })  
                this.$bvModal.hide('shopModal')
                this.userForm={
                    id:0,
                    name:"",
                    phone:"",
                    address:""
                }
                this.$refs.shopTable.refresh()
            })
            .catch(error => {
                //console.log(error.message)
                this.$bvToast.toast(error.message, {
                    title: 'Амжилт',
                    autoHideDelay: 5000
                })
            }
        ) 
    },

    onShopSelected(items){
      this.selectedRows=items;
    },
    shopProvider(ctx){
        //alert("yes");
        this.isBusy = false
        let promise = axios.post(apiDomain+'/admin/delivery/shoplist',ctx,{headers:getHeader()});
        return promise.then((response) => {
          const result = response.data;
          this.isBusy = false
          this.totalRows=result.recordCount;
          //alert(JSON.stringify(result));
          return(result.items)
        }).catch(error => {
          this.isBusy = false
          return []
        })
    }
  }
 
}
</script>