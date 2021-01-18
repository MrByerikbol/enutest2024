<template>
    <div class="w-100">жүктелуде . . . </div>   
</template>
<script>
    import axios from 'axios';
    import {mapActions} from 'vuex';
    import {apiDomain,getHeader} from "../config/config";
    export default {
        name:"Auth",
        methods:{
            ...mapActions([
                'setLoginedUser'
            ]),
            getLoginedUser(result){
                axios.post(apiDomain+'/admin/delivery/getlogineduser',{},{headers:getHeader()})
                .then(response=>{
                    //alert("gol yum maani hezee ireheer bna ");
                    //state.loginedUser=response.data;
                    window.localStorage.setItem("loginedUser",JSON.stringify(response.data));
                     //alert("mina hota "+ window.localStorage.getItem("loginedUser"));
                     this.setLoginedUser();
                     result.roles.forEach(r => {
                        if(r.roleName=='ADMIN'){
                            //this.$router.push({name:'Deliveries'});
                            //ttestref
                            window.location.href = "/#/users";         
                            return;
                        }
                        if(r.roleName=='TEACHER'){
                            //this.$router.push({name:'Deliveries'});
                            window.location.href = "/#/testwelcome";         
                            return;
                        }
                        
                    });
                })
                .catch(error => {
                    //console.log(error.message)
                    // this.$bvToast.toast(error.message, {
                    //     title: 'алдаа',
                    //     autoHideDelay: 5000
                    // })
                })   
            }
        },
        created(){
            let promise = axios.get(apiDomain+'/admin/login/getlogineduser',{headers:getHeader()});
            return promise.then((response) => {
                const result = response.data;
                this.getLoginedUser(result);
                //alert(JSON.stringify(result));
               
            }).catch(error => {
                alert(error.message);
                this.$router.push({name:'Login'});
            });
        }
    }
</script>