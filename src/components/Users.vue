<template>
    <b-row>
      <b-col lg="12">
        <h3>
          <span class="bd-content-title">{{$t('enu.userList.mainTitle')}}</span>
        </h3>
      </b-col>
      <b-col lg="4" class="mt-3">
        <DepartmentList/>  
      </b-col>
      <b-col lg="8" class="mt-3">
        <b-row>
          <b-col lg="12">
            <h5>
                <span class="bd-content-title">{{$t('userPage.userList')}}</span>
            </h5>
          </b-col>
          <b-col lg="12">
              <b-button variant="success" size="sm" class="mr-2" v-b-modal.userModal>{{$t('system.newButton')}}</b-button>
              <b-button variant="info" v-if="selectedRows.length==1" size="sm" @click="updateRecord" class="mr-2">{{$t('system.updateButton')}}</b-button>
              <b-button variant="danger" v-if="selectedRows.length>0" size="sm" class="mr-2" @click="deleteRecord">{{$t('system.deleteButton')}}</b-button>
          </b-col>
          <b-col lg="12">
              <b-row class="mt-2">
                <b-col lg="4">
                  <select class="form-control" v-model="groupId">
                    <option v-for="(g,i) in groups" :key="i" :value="g.groupId">{{$i18n.locale()=='kz' ? g.groupName : g.groupNameRu}}</option>
                  </select>
                </b-col>
                <b-col lg="4">
                  <datepicker format="dd-MM-yyyy"
                    :clear-button="true"
                    v-model="reportDate"
                    placeholder="Choose Date"></datepicker>
                </b-col>
                
                <b-col lg="4">
                  <b-button @click="getMainReport" block variant="outline-success" v-b-modal.reportListModal>Main Exam Report</b-button>
                </b-col>
              </b-row>
          </b-col>
          <b-col lg="6">
            <b-form-group
              :label="$t('system.defaultSearch')"
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
                  :placeholder="$t('system.searchText')"
                ></b-form-input>
                
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col lg="6" class="pt-3 text-right">
            <strong>{{$t('system.recordCountText')}}:</strong> {{totalRows}}  
          </b-col>
          <b-col lg="12">
            <b-row class="pb-3">
              <b-col lg="6">
                  <select class="form-control-sm w-100"
                      id="departmentId"
                      v-model="departmentId"  
                      @change="refreshTable()"
                  >
                    <option value=0>{{$t('comboChooseText')}}</option>

                    <option v-for="(d,k) in departments" :key="k" :value="d.departmentId"> 
                      {{$i18n.locale()=='kz' ? d.departmentName : d.departmentNameRu}}    
                    </option>
                  </select>

                
              </b-col>
              <b-col lg="6">
                <select class="form-control-sm w-100"
                      id="departmentId"
                      v-model="roleId"  
                      @change="refreshTable()"
                  >
                    <option value=0>{{$t('comboChooseText')}}</option>

                    <option v-for="(d,k) in roles" :key="k" :value="d.roleId"> 
                      {{$i18n.locale()=='kz' ? d.roleDefination : d.roleDefinationRu}}    
                    </option>
                  </select>  
              </b-col>
            </b-row>
          </b-col>
          <b-table 
            ref="userTable"
            striped hover selectable
            :items="userProvider" 
            :fields="fields"
            :busy.sync="isBusy"
            :current-page="currentPage"
            :per-page="perPage"
            
            :filter="filter"
            :select-mode="selectMode"
            
            selected-variant="danger"
          
            @row-selected="onUserSelected"
            >
            <template #head(lastName)="data">
              <span class="text-info">{{$t(data.label)}}</span>
            </template>
            <template #head(firstName)="data">
              <span class="text-info">{{$t(data.label)}}</span>
            </template>
            <template #head(userEmail)="data">
              <span class="text-info">{{$t(data.label)}}</span>
            </template>
            <template #head(phoneNumber)="data">
              <span class="text-info">{{$t(data.label)}}</span>
            </template>
            <template #head(roleName)="data">
              <span class="text-info">{{$t(data.label)}}</span>
            </template>
            <template #head(departmentName)="data">
              <span class="text-info">{{$t(data.label)}}</span>
            </template>
            <template v-slot:cell(departmentName)="row">
                {{$i18n.locale()=='kz' ? row.item.departmentName : row.item.departmentNameRu}}
            </template>
            <template v-slot:cell(userAction)="row">
                <b-button
                  @click="blockUser(row.item.userId)"
                  variant="outline-danger" class="mr-2 mb-2">
                  {{row.item.isBlocked==1 ? $t('unBlockUser') : $t('blockUser')}}
                </b-button>
                <b-button
                  @click="compExam(row.item.userId)"
                  variant="outline-info" class="mr-2 mb-2">
                  {{row.item.isExamComp==1 ? $t('unComExam') : $t('comExam')}}
                </b-button>
                 <b-button
                  @click="canShow(row.item.userId)"
                  variant="outline-success" class="mr-2 mb-2">
                  {{row.item.canShow==1 ? $t('canNotShow') : $t('canShow')}}
                </b-button>
                <b-button 
                  variant="outline-info" 
                  class="mr-2" 
                  @click="reportTest(row.item.userId,row.item.lastName+' '+row.item.firstName+' ' + row.item.thirdName)" v-b-modal.reportModal>
                  Report
                </b-button>
                <b-button 
                  variant="outline-warning" 
                  class="mr-2" 
                  @click="reportPTest(row.item.userId)" v-b-modal.reportPModal>
                  P Report
                </b-button>
            </template>
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
                <strong>Жүктелуде...</strong>
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

          <b-modal id="userModal" :title="$t('userList.userModal')" @hidden="resetUserForm" @show="onModalShown" hide-footer size="xl">

              <b-form v-on:submit.prevent="submitUser">
                    
                    <b-form-row class="mb-3">
                        <b-col sm="auto" md="12">
                            <label for="userType">{{$t('userList.userFormTypeText')}}</label>
                            <select class="form-control"
                                id="userType"
                                v-model="userForm.departmentId"  
                            >
                              <option value=0>{{$t('comboChooseText')}}</option>

                              <option v-for="(d,k) in departments" :key="k" :value="d.departmentId"> 
                                {{$i18n.locale()=='kz' ? d.departmentName : d.departmentNameRu}}    
                              </option>
                            </select>
                        </b-col>
                        
                        <b-col sm="auto" md="12">
                            <label for="lastName">{{$t('userList.lastName')}}</label>
                            <b-form-input
                                id="lastName"
                                v-model="userForm.lastName"
                                required
                                :placeholder="$t('userList.lastName')"
                            ></b-form-input>
                        </b-col>
                        <b-col sm="auto" md="12">
                            <label  for="firstName">{{$t('userList.firstName')}}</label>
                            <b-form-input
                                id="firstName"
                                v-model="userForm.firstName"
                                required
                                :placeholder="$t('userList.firstName')"
                            ></b-form-input>
                        </b-col>
                        <b-col sm="auto" md="12">
                            <label  for="userEmail">{{$t('userList.email')}}</label>
                            <input
                                class="form-control"
                                id="userEmail"
                                v-model="userForm.userEmail"
                                type="email"
                                required
                                :placeholder="$t('userList.email')"
                            />
                        </b-col>
                        <b-col sm="auto" md="12">
                            <label  for="userEmail">{{$t('userList.phoneNumber')}}</label>
                            <b-form-input
                                id="userPhone"
                                v-model="userForm.userPhone"
                                type="Text"
                                required
                                :placeholder="$t('userList.phoneNumber')"
                            ></b-form-input>
                        </b-col>
                        <b-col sm="auto" md="12">
                            <label  for="userPassword">{{$t('userList.userForm.password')}}</label>
                            <b-form-input
                                id="userPassword"
                                v-model="userForm.userPassword"
                                type="password"
                                required
                                :placeholder="$t('userList.userForm.password')"
                            ></b-form-input>
                        </b-col>
                        <b-col sm="auto" md="12">
                            <label  for="userRoleId">{{$t('userList.role')}}</label>
                            <b-form-select
                                id="userRoleId"
                                v-model="userForm.userRoleId"
                                :options="userRoles"
                                required
                                :placeholder="$t('userList.role')"
                            ></b-form-select>
                        </b-col>
                        <b-col sm="auto" md="12" class="pt-2" v-if="parseInt(userForm.userRoleId)==12">
                              <b>{{$t('userList.userForm.chooseCatText')}}</b>
                              <b-form-checkbox
                                v-model="allSelected"
                                @change="toggleAll"
                                :indeterminate="indeterminate"
                                
                              >
                                <span class="text-info">{{ allSelected ? $t('system.unSelectAll') : $t('system.selectAll')}}</span>
                              </b-form-checkbox>
  
                              <b-row class="pl-3" v-for="(dc,k) in docCats" :key="k">
                                  <b-col lg="12" >
                                    <input
                                      :id="'dc'+k" type="checkbox"
                                      :value="parseInt(dc.docCatId)" 
                                      @input="docCatChange(dc.docCatId,userForm.userId)"
                                      @change="changeAllSelected"
                                      v-model="userForm.docCats"
                                    />
                                    <label :for="'dc'+k">
                                      {{dc.docCatName}}
                                    </label>
                                  </b-col>
                              </b-row>
                        </b-col>
                    </b-form-row>
                    <b-button type="submit" variant="primary" class="mr-2">{{$t('system.submitButtonText')}}</b-button>
                    <b-button type="reset" variant="danger">{{$t('system.cancelButtonText')}}</b-button>
                </b-form>    
            </b-modal>



             <b-modal id="reportModal" 
                title="report" 
                hide-footer size="huge">

                <TtestReport :reports="reports" :userInfo="reportUserInfo"/>   
            </b-modal>
            <b-modal id="reportPModal" 
                title="P Test Report" 
                hide-footer size="huge">

                <PtestReport :report="pReport"/>   
            </b-modal>
            <b-modal id="reportListModal" 
                title="Main Exam Report"
              
                hide-footer size="huge">
                <ReportList :reports="reportList" :currentGroup="currentGroup" :examDate="formattedExamDate"/>   
            </b-modal>
        </b-row>
      </b-col>
    </b-row>

</template>

<script>
import axios from 'axios';
import {apiDomain,getHeader} from "../config/config";
import DepartmentList from "@/components/enu/comps/DepartmentList";
import TtestReport from "@/components/TtestReport";
import PtestReport from "@/components/PtestReport";
import ReportList from "@/components/ReportList";
import Datepicker from 'vuejs-datepicker';
const moment = require('moment')
import Vue from 'vue'
export default {

  name: 'Users',
  components:{
    DepartmentList,
    TtestReport,
    ReportList,
    Datepicker,
    PtestReport
  },
  data(){
    return {
      
      fields: [
          {
            key: 'userId',
            label: 'ID'
          },
          {
            key: 'lastName',
            label: 'userList.lastName',
          },
          {
            key: 'firstName',
            label: 'userList.firstName',
          },
          {
            key: 'userEmail',
            label: 'userList.email',
          },
          {
            key: 'phoneNumber',
            label: 'userList.phoneNumber',
          },
          {
            key: 'departmentName',
            label: 'userList.departmentName',
          },
          {
            key: 'roleName',
            label: 'userList.role',
          },

          {
            key: 'userAction',
            label: 'Action',
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
        loanLimit:0,
        departmentId : 0,
        docCats:[]
      },

      departments:[],
      roles:[],
      departmentId:0,
      roleId:0,
      userRoles:[{value:null,text:Vue.i18n.translate('comboChooseText')}],

      docCats:[],
      allSelected:false,
      indeterminate:false,
      reports:[],
      reportList:[],
      reportDate:null,
      
      reportUserInfo:"",
      groups:[],
      groupId:0,
      currentGroup:{},
      formattedExamDate:"",
      pReport:{}

    }
  },
  methods:{
    
    blockUser(quserId){
      axios.post(apiDomain+'/admin/enu/ttest/buisness/blockuser',{userId:quserId},{headers:getHeader()})
      .then(response=>{
        if(response.data=='success')
          this.$refs.userTable.refresh();     
      })
      .catch(() => {
              this.$bvToast.toast(Vue.i18n.translate('system.serverError'), {
                  toaster:'b-toaster-top-center',
                  variant:'danger',
                  title: Vue.i18n.translate('system.errorTitle'),
                  autoHideDelay: 5000
              })
          }
      )     
    },
    compExam(quserId){
      axios.post(apiDomain+'/admin/enu/ttest/buisness/compexam',{userId:quserId},{headers:getHeader()})
      .then(response=>{
        if(response.data=='success')
          this.$refs.userTable.refresh();     
      })
      .catch(() => {
              this.$bvToast.toast(Vue.i18n.translate('system.serverError'), {
                  toaster:'b-toaster-top-center',
                  variant:'danger',
                  title: Vue.i18n.translate('system.errorTitle'),
                  autoHideDelay: 5000
              })
          }
      )     
    },
    
    canShow(quserId){
      axios.post(apiDomain+'/admin/enu/ttest/buisness/canshow',{userId:quserId},{headers:getHeader()})
      .then(response=>{
        if(response.data=='success')
          this.$refs.userTable.refresh();     
      })
      .catch(() => {
              this.$bvToast.toast(Vue.i18n.translate('system.serverError'), {
                  toaster:'b-toaster-top-center',
                  variant:'danger',
                  title: Vue.i18n.translate('system.errorTitle'),
                  autoHideDelay: 5000
              })
          }
      )     
    },

    reportPTest(quserId){
      this.reportUserInfo="";
      this.reports=[];

      let examDate = "no-date";
      if(this.reportDate!=null){
        examDate=moment(this.reportDate).format('YYYY-MM-DD');
      }
      
      axios.post(apiDomain+'/admin/enu/ptest/buisness/testreport',{userId:quserId,examDate:examDate},{headers:getHeader()})
      .then(response=>{
          this.pReport=response.data;  
      })
      .catch(() => {
              this.$bvToast.toast(Vue.i18n.translate('system.serverError'), {
                  toaster:'b-toaster-top-center',
                  variant:'danger',
                  title: Vue.i18n.translate('system.errorTitle'),
                  autoHideDelay: 5000
              })
          }
      )     
    },

    reportTest(quserId,userInfo){
      this.reportUserInfo="";
      this.reports=[];

      let examDate = "no-date";
      if(this.reportDate!=null){
        examDate=moment(this.reportDate).format('YYYY-MM-DD');
      }
      
      axios.post(apiDomain+'/admin/enu/ttest/buisness/testreport',{userId:quserId,examDate:examDate},{headers:getHeader()})
      .then(response=>{
        this.reportUserInfo=userInfo;
        this.reports=response.data;  
      })
      .catch(() => {
              this.$bvToast.toast(Vue.i18n.translate('system.serverError'), {
                  toaster:'b-toaster-top-center',
                  variant:'danger',
                  title: Vue.i18n.translate('system.errorTitle'),
                  autoHideDelay: 5000
              })
          }
      )     
    },
    getMainReport(){
      this.formattedExamDate=moment(this.reportDate).format('YYYY-MM-DD');
      if(this.reportDate==null){
        alert("Please choose exam date !!!");
        return ;
      }
      let dateStr = this.reportDate==null ? 'no-date': moment(this.reportDate).format('YYYY-MM-DD');
      this.currentGroup=this.groups.filter(g=>parseInt(g.groupId)==this.groupId)[0];

      axios.get(apiDomain+'/admin/enu/ttest/buisness/getmainreport/'+this.groupId+'/'+dateStr+'',{headers:getHeader()})
      .then(response=>{

        this.reportList=response.data;  

      })
      .catch(() => {
              this.$bvToast.toast(Vue.i18n.translate('system.serverError'), {
                  toaster:'b-toaster-top-center',
                  variant:'danger',
                  title: Vue.i18n.translate('system.errorTitle'),
                  autoHideDelay: 5000
              })
          }
      )     
    },
    docCatChange(d,dUserId){ 
      if(d>0 && dUserId>0){
        // let filtered=this.userForm.docCats.filter(db=>parseInt(db)==parseInt(d));
        // //alert(filtered.length)
        // let deleted=[];
        // if(filtered.length==1 
        //   && deleted.filter(r=>parseInt(r)==parseInt(d)).length==0){
        //   //alert("the all condition");
        //   let o = new Object();
        //   let dIndexes = [];
        //   dIndexes.push(d);

        //   o.userId=dUserId;
        //   let del = [];
        //   del.push(d);
        //   o.docCatId=del;


        //   axios.post(apiDomain+'/admin/enu/ref/deletedoccatfromuser',o,{headers:getHeader()})
        //   .then(()=>{
        //     //alert("iishee ch ireed bna da barag");
        //     deleted.push(d);
        //   })
        //   .catch(error => {
        //       //console.log(error.message)
        //       this.$bvToast.toast(error.message, {
        //           title: 'алдаа',
        //           autoHideDelay: 5000
        //       })
        //   }) 
        // }
      }
    },
    toggleAll(){
      if(this.allSelected){
        // let o = new Object();
        
        
        // o.userId=this.userForm.userId;
        // o.docCatId=this.userForm.docCats;

        // if(parseInt(o.userId)>0 && o.docCatId.length>0){
        //   axios.post(apiDomain+'/admin/enu/ref/deletedoccatfromuser',o,{headers:getHeader()})
        //   .then(()=>{
        //     //alert("iishee ch ireed bna da barag");
        //   })
        //   .catch(error => {
        //       //console.log(error.message)
        //       this.$bvToast.toast(error.message, {
        //           title: 'алдаа',
        //           autoHideDelay: 5000
        //       })
        //   });
        // }
        this.userForm.docCats=[];
      }
      else{
        this.docCats.forEach(d=>{
          if(this.userForm.docCats.filter(o=>parseInt(o)==parseInt(d)).length==0){
            this.userForm.docCats.push(d.docCatId);   
          }       
       });
      }
    },
    
    deleteRecord(){
      let warn = confirm("Сіз сенімдісіз бе ?");
      if(warn){
        if(this.selectedRows.length>0){
          axios.post(apiDomain+'/admin/deleterecord/',this.selectedRows,{headers:getHeader()})
          .then(()=>{
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
            //alert(JSON.stringify(response.data));
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

    resetUserForm(){
      this.userForm={
        userId:0,
        lastName:"",
        firstName:"",
        userEmail:"",
        userPhone:"",
        userPassword:"",
        userRoleId:null,
        userType:0,
        loanLimit:0,
        departmentId:0
      }
    },
    refreshTable(){
      this.$refs.userTable.refresh();
    },
    submitUser(evt){
          evt.preventDefault();
          if(!this.userForm.docCats){
            this.userForm.docCats=[];
          }
          
          axios.post(apiDomain+'/admin/core/postuser/',this.userForm,{headers:getHeader()})
            .then(response=>{
                let localVariant = "info";
                let alertMsg = Vue.i18n.translate('system.successMsg');
                if(response.data==='dublicated'){
                  alertMsg=Vue.i18n.translate('system.dublicationMsg');
                  localVariant="danger";
                }
                else{
                  this.$bvModal.hide('userModal')
                  
                  this.$refs.userTable.refresh()
                }
                this.resetUserForm();
                this.$bvToast.toast(alertMsg, {
                    variant:localVariant,
                    title: Vue.i18n.translate('system.successTitle'),
                    autoHideDelay: 5000
                })



            })
            .catch(error => {
                //console.log(error.message)
                this.$bvToast.toast(error.message, {
                    variant:'danger',

                    title: Vue.i18n.translate('system.errorTitle'),
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
        ctx.departmentId=this.departmentId;
        ctx.roleId=this.roleId;
        let promise = axios.post(apiDomain+'/admin/delivery/userlist',ctx,{headers:getHeader()});
        return promise.then((response) => {
          const result = response.data;
          this.isBusy = false
          this.totalRows=result.recordCount;
          //alert(JSON.stringify(result));
          return(result.items)
        }).catch(() => {
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
              if(refType==15){
                  this.departments=response.data;
              }
              if(refType==16){
                  this.roles=response.data;
              }
          })
          .catch(() => {
              //console.log(error.message)
              //alert("server dr aldaa uuslee");
          }
      ) 
    },
    getEnuRefs(refType){
        axios.post(apiDomain+'/admin/enu/ref/getdatalist',{refType:refType},{headers:getHeader()})
            .then(response=>{
                if(refType=='docCat'){
                    //alert(JSON.stringify(response.data));
                    this.docCats=response.data;
                    this.docCats.forEach(d=>d.relId=0);
                }
            })
            .catch(() => {
                //console.log(error.message)
                //alert("server dr aldaa uuslee");
            }
        ) 
    },
    onModalShown(){
      this.getRefs(15);
      this.getEnuRefs("docCat");
    }

  },
  created(){
    
    this.getRefs(3);
    this.getRefs(15);
    this.getRefs(16);
    axios.post(apiDomain+'/admin/enu/ref/getdatalist',{refType:'ttestCategory'},{headers:getHeader()})
        .then(response=>{
            this.groups=response.data;
        })
        .catch(() => {
            //console.log(error.message)
            //alert("server dr aldaa uuslee");
        }
    ) 
  }

}
</script>
