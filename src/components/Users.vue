<template>
  
   
    <b-row>
      <b-col lg="12">
        <h3>
          <span class="bd-content-title">Хэрэлэгчийн жагсаалт</span>
        </h3>
      </b-col>
      <b-col lg="12" class="mt-3">
      
          <b-button variant="success" size="sm" class="mr-2" v-b-modal.userModal>Шинэ</b-button>
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
        ref="userTable"
        striped hover selectable
        :items="userProvider" 
        :fields="fields"
        :busy.sync="isBusy"
        :current-page="currentPage"
        :per-page="perPage"
        :table-variant="tableVariant"
        :filter="filter"
        :select-mode="selectMode"
        selected-variant="active"
      
        @row-selected="onUserSelected"
        >
        <template v-slot:cell(userId)="{ rowSelected }">
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

      <b-modal id="userModal" title="Шинэ хэрэглэгч нэмэх" hide-footer>
          <b-form v-on:submit.prevent="submitUser">
                <b-form-row class="mb-3">
                    <b-col sm="auto" md="12">
                        <label for="userType">Хэрэглэгчийн төрөл</label>
                        <select class="form-control"
                            id="userType"
                            v-model="userForm.userType"  
                        >
                          <option value=0>Систем</option>
                          <option value=1> Клиент </option>
                        </select>
                    </b-col>
                    <b-col sm="auto" md="12" v-if="userForm.userType==1">
                        <label for="loanLimit">Зээлийн хэмжээ</label>
                        <input type="number" class="form-control"
                            id="loanLimit"
                            v-model="userForm.loanLimit"  
                        />
                         
                    </b-col>
                    <b-col sm="auto" md="12">
                        <label for="lastName">Овог</label>
                        <b-form-input
                            id="lastName"
                            v-model="userForm.lastName"
                           
                            required
                            placeholder="Овог"
                        ></b-form-input>
                    </b-col>
                    <b-col sm="auto" md="12">
                        <label  for="firstName">Нэр</label>
                        <b-form-input
                            id="firstName"
                            v-model="userForm.firstName"
                          
                            required
                            placeholder="Нэр"
                        ></b-form-input>
                    </b-col>
                    <b-col sm="auto" md="12">
                        <label  for="userEmail">И-мэйл</label>
                        <input
                            class="form-control"
                            id="userEmail"
                            v-model="userForm.userEmail"
                            type="email"
                            required
                            placeholder="И-мэйл"
                        />
                    </b-col>
                    <b-col sm="auto" md="12">
                        <label  for="userEmail">Утас</label>
                        <b-form-input
                            id="userPhone"
                            v-model="userForm.userPhone"
                            type="Text"
                            required
                            placeholder="Утас"
                        ></b-form-input>
                    </b-col>
                    <b-col sm="auto" md="12">
                        <label  for="userPassword">Нууц үг</label>
                        <b-form-input
                            id="userPassword"
                            v-model="userForm.userPassword"
                            type="password"
                            required
                            placeholder="Нууц үг"
                        ></b-form-input>
                    </b-col>
                    <b-col sm="auto" md="12">
                        <label  for="userRoleId">Хэрэглэгчийн эрх</label>
                        <b-form-select
                            id="userRoleId"
                            v-model="userForm.userRoleId"
                            :options="userRoles"
                            required
                            placeholder="Хэрэглэгчийн эрх"
                        ></b-form-select>
                    </b-col>
                    
                </b-form-row>
                <b-button type="submit" variant="primary" class="mr-2">Шинэ хэрэглэгч үүсгэх</b-button>
                <b-button type="reset" variant="danger">Арилгах</b-button>
            </b-form>    
        </b-modal>
    </b-row>

</template>

<script>
import axios from 'axios';
import {apiDomain,loginUrl,getHeader} from "../config/config";

export default {

  name: 'Users',
  data(){
    return {
      fields: [
          {
            key: 'userId',
            label: 'Id',
          },
          {
            key: 'lastName',
            label: 'Овог',
          },
          {
            key: 'firstName',
            label: 'Нэр',
          },
          {
            key: 'userEmail',
            label: 'Нэвтрэх нэр',
          },
          {
            key: 'phoneNumber',
            label: 'Утас',
          },
          {
            key: 'roleName',
            label: 'Эрх',
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
      userForm:{
        userId:0,
        lastName:"",
        firstName:"",
        userEmail:"",
        userPhone:"",
        userPassword:"",
        userRoleId:null,
        userType:0,
        loanLimit:0
      },

      userRoles:[{value:null,text:'Хэрэглэгчийн эрх'}]
    }
  },
  methods:{
    deleteRecord(){
      let warn = confirm("Та итгэлтэй байна уу ?");
      if(warn){
        if(this.selectedRows.length>0){
          axios.post(apiDomain+'/admin/deleterecord/',this.selectedRows,{headers:getHeader()})
            .then(response=>{
              this.$refs.userTable.refresh();  
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
        let userId = this.selectedRows[0].userId;
        if(userId>0){
          axios.get(apiDomain+'/admin/getuser/'+userId,{headers:getHeader()})
          .then(response=>{
            this.userForm=response.data;
            this.$bvModal.show('userModal')    
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
    submitUser(evt){
          evt.preventDefault();
          axios.post(apiDomain+'/admin/core/postuser/',this.userForm,{headers:getHeader()})
            .then(response=>{
                let alertMsg = "Хэрэглэгч амжилттай үүслээ";
                if(response.data==='dublicated'){
                  alertMsg='Хэрэглэгчийн и-мэйл давхардсан байна.'
                }
                else{
                  this.$bvModal.hide('userModal')
                  this.userForm={
                        userId:0,
                        lastName:"",
                        firstName:"",
                        userEmail:"",
                        userPhone:"",
                        userPassword:"",
                        userRoleId:null,
                        userType:0,
                        loanLimit:0
                  }
                  this.$refs.userTable.refresh()
                }
                
                this.$bvToast.toast(alertMsg, {
                    title: 'Амжилт',
                    autoHideDelay: 5000
                })



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

    onUserSelected(items){
      this.selectedRows=items;
    },
    userProvider(ctx){
        //alert("yes");
        this.isBusy = false
        let promise = axios.post(apiDomain+'/admin/delivery/userlist',ctx,{headers:getHeader()});
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
    },
    getRefs(refType){
       axios.get(apiDomain+'/admin/delivery/refs/'+refType,{headers:getHeader()})
          .then(response=>{
              if(refType==3){
                  this.userRoles=this.userRoles.concat(response.data);
              }
              
          })
          .catch(error => {
              //console.log(error.message)
              //alert("server dr aldaa uuslee");
          }
      ) 
    }

  },
  created(){
    this.getRefs(3);
  }

}
</script>