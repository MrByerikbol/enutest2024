<template>
     <!-- .auth -->
    <main class="auth auth-floated">
      <!-- form -->
      <form class="auth-form" v-on:submit.prevent="handleLoginFormSubmit">
        <div class="mb-4">
          <div class="mb-3">
            <img class="rounded" src="assets/apple-touch-icon.png" alt="" height="72">
          </div>
          <h1 class="h3"> Нэвтрэх </h1>
        </div>
        <!-- <p class="text-left mb-4"> Шинэ хэрэглэгч бүртгүүлэх <a href="auth-signup.html">Бүртгүүлэх</a></p> -->
        <!-- .form-group -->
        <div class="form-group mb-4">
          <label class="d-block text-left" for="inputUser">Хэрэглэгчийн нэр</label> 
          <input 
            type="text" 
            id="inputUser" 
            class="form-control form-control-lg" 
            required="" 
            v-model="login.username"
            autofocus="">
        </div><!-- /.form-group -->
        <!-- .form-group -->
        <div class="form-group mb-4">
          <label class="d-block text-left" for="inputPassword">Нууц үг</label>
          <input 
            type="password" 
            id="inputPassword" 
            class="form-control form-control-lg"
            required=""
            v-model="login.password"
            >
        </div><!-- /.form-group -->
        <!-- .form-group -->
        <div class="form-group mb-4">
          <button class="btn btn-lg btn-primary btn-block" type="submit">Нэвтрэх</button>
        </div><!-- /.form-group -->
        <!-- .form-group -->
        <div class="form-group text-center">
          <div class="custom-control custom-control-inline custom-checkbox">
            <input type="checkbox" class="custom-control-input" id="remember-me"> <label class="custom-control-label" for="remember-me">Сануулах</label>
          </div>
        </div><!-- /.form-group -->
        <!-- recovery links -->
        <p class="py-2">
          <a href="auth-recovery-username.html" class="link">Нууц үг мартсан</a> <span class="mx-2">·</span> 
        </p><!-- /recovery links -->
        <!-- copyright -->
        <p class="mb-0 px-3 text-muted text-center"> © 2018 Бүх эрх хуулиар хамгаалагдсан.<a href="#!">Үйлчилгээний нөхцөл</a> 
        </p>
      </form><!-- /.auth-form -->
     
    </main><!-- /.auth -->
</template>
<script>
  import axios from 'axios';
  import {apiDomain,loginUrl} from "../config/config";



  const cl = btoa("devglan-client:devglan-secret");
  const authUser = {};
  export default {
       name : "Login",
       data(){
        return {
          login:{
            username:'',
            
            password:''
          }
        }
      },

      methods:{
        handleLoginFormSubmit () {
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
            //alert(response.status);
            //console.log(response.status);
            if(response.status===200){
              authUser.access_token=response.data.access_token;
              authUser.refresh_token = response.data.refresh_token;

              window.localStorage.setItem('authUser',JSON.stringify(authUser));
              /*this.$http.get(apiDomain+'/users/user',{headers:getHeader()})
                .then(response=>{
                  console.log('user object',response);

                })*/
              this.$router.push({name:'Deliveries'});
            }



          }).catch(function (error) {
            //console.log(error);

            if(error.response.status===400){
              alert("Таны оруулсан мэдээлэл буруу байна.");
            }
            else {
              //alert("Алдаа үүслээ та дахин оролдоно уу .");
              console.log("server dr aldaa uuslee");

            }

          });
        }
      }        
  }
</script>
<style scoped>

</style>