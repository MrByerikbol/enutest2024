<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="primary" class="fixed-top">
            <b-navbar-brand href="/#/home">
                <b-navbar-brand href="/#/home">
                    <img width="136" src="@/assets/logo_w.png" alt="Kitten">
                </b-navbar-brand>
            </b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>  
                    <b-nav-item href="/#/home">
                        <span class="text-uppercase text-light h5">{{$t('enu.landing.mainMenu.top100')}}</span>
                    </b-nav-item>
                   
                </b-navbar-nav>

                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto">
                     <b-nav-item class="ml-auto" href="/#/contactus">
                        <span class="text-uppercase text-light h5">{{$t('enu.system.contactUsTxt')}}</span>
                    </b-nav-item>
                    <b-button size="info" class="mr-2" v-b-modal.loginModal>{{$t('system.loginTxt')}}</b-button>
                    <b-button size="danger" class="mr-2" v-b-modal.userModal>{{$t('system.regTxt')}}</b-button>
                    <b-nav-item-dropdown right :text="$t('mainMenu.currentLang')">
                    <b-dropdown-item href="javascript:void(0)"  v-for="locale in $i18n.locales()" :key="'i81n-' + locale"
                        @click="$i18n.set(locale)" v-if="$i18n.locale() !== locale">{{locale}}</b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>

        <b-modal id="userModal" :title="$t('userList.userModal')" @hidden="resetUserForm" @show="onModalShown" hide-footer size="xl">
            <b-overlay :show="isPost" rounded="sm">
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
                        <label  for="firstName">{{$t('enu.teacherForm.thirdName')}}</label>
                        <b-form-input
                            id="thirdName"
                            v-model="userForm.thirdName"
                            
                            :placeholder="$t('enu.teacherForm.thirdName')"
                        ></b-form-input>
                    </b-col>
                    <b-col sm="auto" md="12">

                        <label for="positionId">{{$t('enu.landing.teacherForm.workPosition')}}</label>
                        <select class="form-control"
                            id="positionId"
                            v-model="userForm.positionId"  
                        >
                            <option value=0>{{$t('comboChooseText')}}</option>

                            <option v-for="(d,k) in workPositions" :key="k" :value="d.positionId"> 
                            {{$i18n.locale()=='kz' ? d.positionName : d.positionNameRu}}    
                            </option>
                        </select>
                    </b-col>
                    <b-col sm="auto" md="12">
                        <label  for="dateOfBirth">{{$t('enu.landing.teacherForm.dateOfBirth')}}</label>
                       
                        <datepicker format="dd-MM-yyyy"
                            :clear-button="true"
                            class="w-100 form-control-sm"
                            v-model="userForm.dateOfBirth" :placeholder="$t('enu.landing.teacherForm.dateOfBirth')"></datepicker>
                    </b-col>
                    <b-col sm="auto" md="12">
                        <label  for="isFifteen">{{$t('enu.landing.teacherForm.dateOfPositionShort')}}</label>
                        <select class="form-control"
                            id="isFifteen"
                            v-model="userForm.isFifteen"
                        >
                            <option value=0>{{$t('enu.teacherForm.isFifteen2')}}</option>
                            <option value=1>{{$t('enu.teacherForm.isFifteen1')}}</option>
                        </select>
                    </b-col>
                   
                    <b-col sm="auto" md="12">
                        <label for="educationDegreeId">{{$t('enu.landing.teacherForm.degree')}}</label>

                        <select class="form-control"
                            id="educationDegreeId"
                            v-model="userForm.educationDegreeId"  
                        >
                            <option value=0>{{$t('comboChooseText')}}</option>

                            <option v-for="(d,k) in educations" :key="k" :value="d.educationDegreeId"> 
                            {{$i18n.locale()=='kz' ? d.educationName : d.educationNameRu}}    
                            </option>
                        </select>
                        
                    </b-col>
                     <b-col sm="auto" md="12">
                        <label  for="educationInfo">{{$t('enu.landing.teacherForm.education')}}</label>
                        <b-form-textarea
                            id="educationInfo"
                            v-model="userForm.educationInfo"
                            required
                            :placeholder="$t('enu.landing.teacherForm.education')"
                        ></b-form-textarea>
                    </b-col>
                    <b-col sm="auto" md="12">
                        <label  for="constAdress">{{$t('enu.landing.teacherForm.adress')}}</label>
                        <b-form-textarea
                            id="constAdress"
                            v-model="userForm.constAdress"
                            required
                            :placeholder="$t('enu.landing.teacherForm.adress')"
                        ></b-form-textarea>
                    </b-col>
                    <b-col sm="auto" md="12">
                        <label  for="prize">{{$t('enu.landing.teacherForm.prise')}}</label>
                        <b-form-textarea
                            id="prize"
                            v-model="userForm.prize"
                            required
                            :placeholder="$t('enu.landing.teacherForm.prise')"
                        ></b-form-textarea>
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
                    <!-- begining of the password information -->
                    <b-col sm="auto" md="12">
                       <h5>
                           {{$t('enu.teacherForm.idCardGroupTxt')}}
                       </h5>
                    </b-col>
                    <b-col sm="auto" lg="6" md="6">
                        <label  for="passwordNumber">{{$t('enu.landing.teacherForm.regNumber')}}</label>
                        <b-form-input
                            id="passwordNumber"
                            v-model="userForm.passwordNumber"
                            type="text" pattern="\d*" maxlength="12"
                            required
                            :placeholder="$t('enu.landing.teacherForm.regNumber')"
                        ></b-form-input>
                    </b-col>
                    <b-col sm="auto" lg="6" md="6">
                        <label  for="idCardNumber">{{$t('enu.teacherForm.idCardNumberTxt')}}</label>
                        <b-form-input
                            id="idCardNumber"
                            v-model="userForm.idCardNumber"
                            
                            type="text" pattern="\d*" maxlength="9"
                            required
                            :placeholder="$t('enu.teacherForm.idCardNumberTxt')"
                        ></b-form-input>
                    </b-col>
                    <b-col sm="auto" lg="6" md="6">
                        <label  for="idCardDate">{{$t('enu.teacherForm.IdCardDateTxt')}}</label>
                        <datepicker format="dd-MM-yyyy"
                            :clear-button="true"
                            v-model="userForm.idCardDate"
                            :placeholder="$t('enu.teacherForm.IdCardDateTxt')"></datepicker>
                    </b-col>
                    <b-col sm="auto" md="6" lg="6">
                        <label  for="givenOrg">{{$t('enu.teacherForm.givenOrgChooseText')}}</label>
                        <select class="form-control"
                            id="givenOrg"
                            v-model="userForm.givenOrg"
                        >
                            <option value=0>{{$t('enu.teacherForm.givenOrg1')}}</option>
                            <option value=1>{{$t('enu.teacherForm.givenOrg2')}}</option>
                        </select>
                    </b-col>
                    <!-- end of the password information -->


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
                        <label  for="reuserPassword">{{$t('enu.teacherForm.reEnterPassword')}}</label>
                        <b-form-input
                            id="reuserPassword"
                            v-model="userForm.reuserPassword"
                            type="password"
                            required
                            :placeholder="$t('enu.teacherForm.reEnterPassword')"
                        ></b-form-input>
                    </b-col>
                   
                </b-form-row>
                <b-button type="submit" variant="primary" class="mr-2">{{$t('system.submitButtonText')}}</b-button>
                <b-button type="reset" variant="danger">{{$t('system.cancelButtonText')}}</b-button>
            </b-form> 
            </b-overlay>   
        </b-modal>

        <b-modal id="loginModal" :title="$t('system.loginTxt')" hide-footer>
            <b-form v-on:submit.prevent="handleLoginFormSubmit">
                <b-form-row class="mb-3">
                    
                    <b-col sm="auto" md="12">
                        <label for="userName">{{$t('system.login.userName')}}</label>
                        <b-form-input
                            id="userName"
                            v-model="login.username"
                            type="text"
                            required
                        ></b-form-input>
                    </b-col>
                    <b-col sm="auto" md="12">
                        <label for="userPassword">{{$t('system.login.userPassword')}}</label>
                        <b-form-input
                            id="userPassword"
                            v-model="login.password"
                            type="password"
                            required
                        ></b-form-input>
                    </b-col>
                   
                </b-form-row>
                <b-button type="submit" variant="primary" class="mr-2">{{$t('system.loginTxt')}}</b-button>
                
            </b-form>    
        </b-modal>
    </div> 
</template>
<script>
  import axios from 'axios';
  import {apiDomain,loginUrl,getHeader} from "@/config/config";
  import Vue from 'vue'
  const cl = btoa("devglan-client:devglan-secret");
  import Datepicker from 'vuejs-datepicker';
  const moment = require('moment')
  const authUser = {};
    export default {
        components:{Datepicker},
        name:"LandingHeader" ,
        data(){
            return {
                login:{
                    username:'',
                    password:''
                },
                //begining of the form submission
                userForm:{
                    thirdName : "",
                    positionId:0,
                    dateOfBirth:"",
                    workExperience:"",
                    isFifteen:0,
                    educationInfo:"",
                    educationDegreeId:0,
                    constAdress:"",


                    givenOrg:0,
                    passwordNumber:0,
                    idCardNumber:0,
                    idCardDate:"",

                    prize:"",

                    userId:0,
                    lastName:"",
                    firstName:"",
                    userEmail:"",
                    userPhone:"",
                    userPassword:"",
                    userRoleId:7,
                    userType:0,
                    loanLimit:0,
                    departmentId : 0,
                    docCats:[],
                    reuserPassword:""
                },
                departments:[],
                workPositions:[],
                educations : [],
                isPost:false
            }  
        },
        methods:{
             submitUser(evt){
                evt.preventDefault();
                if(this.userForm.departmentId==0){
                    this.$bvToast.toast(Vue.i18n.translate('enu.teacherForm.missingDepartmentMsg'), {
                        variant:'danger',

                        title: Vue.i18n.translate('system.errorTitle'),
                        autoHideDelay: 5000
                    })
                    return ;
                }
                if(this.userForm.dateOfBirth==""){
                    this.$bvToast.toast(Vue.i18n.translate('enu.teacherForm.missingDateOfBirthTxt'), {
                        variant:'danger',

                        title: Vue.i18n.translate('system.errorTitle'),
                        autoHideDelay: 5000
                    })
                    return ;
                }
                if(this.userForm.positionId==0){
                    this.$bvToast.toast(Vue.i18n.translate('enu.teacherForm.missingPositionTxt'), {
                        variant:'danger',

                        title: Vue.i18n.translate('system.errorTitle'),
                        autoHideDelay: 5000
                    })
                    return ;
                }
                if(this.userForm.educationDegreeId==0){
                    this.$bvToast.toast(Vue.i18n.translate('enu.teacherForm.missingDegreeTxt'), {
                        variant:'danger',

                        title: Vue.i18n.translate('system.errorTitle'),
                        autoHideDelay: 5000
                    })
                    return ;
                }
                if(this.userForm.idCardDate==""){
                    this.$bvToast.toast(Vue.i18n.translate('enu.teacherForm.missingIdCardDateTxt'), {
                        variant:'danger',

                        title: Vue.i18n.translate('system.errorTitle'),
                        autoHideDelay: 5000
                    })
                    return ;
                }
                if(isNaN(this.userForm.passwordNumber)){
                    this.$bvToast.toast(Vue.i18n.translate('enu.teacherForm.wrongInTxt'), {
                        variant:'danger',

                        title: Vue.i18n.translate('system.errorTitle'),
                        autoHideDelay: 5000
                    })
                    return ;
                }
                if(isNaN(this.userForm.idCardNumber)){
                    this.$bvToast.toast(Vue.i18n.translate('enu.teacherForm.wrongIdCardTxt'), {
                        variant:'danger',

                        title: Vue.i18n.translate('system.errorTitle'),
                        autoHideDelay: 5000
                    })
                    return ;
                }
                if(this.userForm.userPassword.trim()!=this.userForm.reuserPassword.trim()){
                    this.$bvToast.toast(Vue.i18n.translate('enu.teacherForm.notSamePasswordMsg'), {
                        variant:'danger',

                        title: Vue.i18n.translate('system.errorTitle'),
                        autoHideDelay: 5000
                    })
                    return ;
                }
                if(!this.userForm.docCats){
                    this.userForm.docCats=[];
                }
                this.isPost=true;
                this.userForm.dateOfBirth=moment(this.userForm.dateOfBirth).format('DD-MM-YYYY');
                this.userForm.idCardDate=moment(this.userForm.idCardDate).format('DD-MM-YYYY');
                axios.post(apiDomain+'/login/enu/landing/postuser',this.userForm,{headers:getHeader()})
                    .then(response=>{
                        this.isPost=false;
                        let localVariant = "info";
                        let alertMsg = Vue.i18n.translate('system.successMsg');
                        if(response.data==='dublicated'){
                            alertMsg=Vue.i18n.translate('system.dublicationMsg');
                            localVariant="danger";
                        }
                        else{
                            this.$bvModal.hide('userModal')
                        }
                        this.resetUserForm();
                        this.$bvToast.toast(alertMsg, {
                            variant:localVariant,
                            title: Vue.i18n.translate('system.successTitle'),
                            autoHideDelay: 5000
                        });

                    })
                    .catch(error => {
                        //console.log(error.message)
                        this.isPost=false;
                        this.$bvToast.toast(error.message, {
                            variant:'danger',

                            title: Vue.i18n.translate('system.errorTitle'),
                            autoHideDelay: 5000
                        })
                    }
                ) 
            },
            resetUserForm(){
                this.userForm={
                    thirdName : "",
                    positionId:0,
                    dateOfBirth:"",
                    workExperience:"",
                    isFifteen:0,
                    educationInfo:"",
                    educationDegreeId:0,
                    constAdress:"",


                    givenOrg:0,
                    passwordNumber:0,
                    idCardNumber:0,
                    idCardDate:"",

                    prize:"",
                    userId:0,
                    lastName:"",
                    firstName:"",
                    userEmail:"",
                    userPhone:"",
                    userPassword:"",
                    userRoleId:7,
                    userType:0,
                    loanLimit:0,
                   
                    departmentId : 0,
                    docCats:[],
                    reuserPassword:""
                }
            },
            onModalShown(){
                this.getRefData("department");
                this.getRefData("workPosition");
                this.getRefData("educationDegree");

            },
            getRefData(refName){
                    axios.post(apiDomain+'/login/enu/landing/getrefs',{refType:refName},{headers:getHeader()})
                .then(response=>{
                    if(refName=='department'){
                        this.departments=response.data;
                    }
                    if(refName=='workPosition'){
                        this.workPositions=response.data;
                    }
                     if(refName=='educationDegree'){

                        this.educations=response.data;
                    }
                    
                })
                .catch(error => {
                    //console.log(error.message)
                    this.$bvToast.toast(error.message, {
                        title: 'алдаа',
                        autoHideDelay: 5000
                    })
                }) 
            },
            handleLoginFormSubmit () {

            // axios.get(apiDomain+'/login/setpassword',{},{headers:getHeader()})
            // .then(response=>{
            //   alert("zayada bi hairtai bsan ");

            // });


            //alert("the form submit handled");
            axios.request({
                baseURL: apiDomain,
                url: loginUrl,
                withCredentials: true,
                method: "post",

                crossdomain: true,
                data: "username="+this.login.username+"&password="+this.login.password+"&grant_type=password",

                headers: {
                'Authorization': 'Basic ' +cl,
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                }
            }).then(response=> {
                if(response.status===200){
                    authUser.access_token=response.data.access_token;
                    authUser.refresh_token = response.data.refresh_token;

                    window.localStorage.setItem('authUser',JSON.stringify(authUser));
                    this.$router.push({name:'AfterAuth'});
                    
                }



            })
            .catch(function (error) {
                //console.log(error);
                //alert(JSON.stringify(error));
                if(error.response.status===400){
                    alert("Сіз енгізген ақпарат дұрыс емес.");
                }
                else {
                    //alert("Алдаа үүслээ та дахин оролдоно уу .");
                    console.log("Server de hatelikter shihti");
                }
          });
        }
      }        
    } 
    
</script>