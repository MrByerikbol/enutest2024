<template>
    <div class="w-100">жүктелнуде . . . </div>   
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
                    if(r.roleName=='SLICER'){
                            //this.$router.push({name:'Slicer'});
                            window.location.href = "/#/slicer"; 
                            return;
                        }
                        if(r.roleName=='GLUER'){
                            //this.$router.push({name:'Gluer'});
                            window.location.href = "/#/gluer";     
                            return;
                        }  
                        if(r.roleName=='ADMIN'){
                            //this.$router.push({name:'Deliveries'});
                            window.location.href = "/#/deliveries";         
                            return;
                        }
                        if(r.roleName=='OPERATOR'){
                            window.location.href = "/#/deliveries";    
                            return;
                        } 
                        if(r.roleName=='CLIENT'){
                            window.location.href = "/#/client";  
                            return;  
                        }             
                    });
                })
                .catch(error => {
                    //console.log(error.message)
                    this.$bvToast.toast(error.message, {
                        title: 'алдаа',
                        autoHideDelay: 5000
                    })
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