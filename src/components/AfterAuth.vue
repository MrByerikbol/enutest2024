<template>
    <div class="w-100">жүктелнуде . . . </div>   
</template>
<script>
    import axios from 'axios';
    import {apiDomain,getHeader} from "../config/config";
    export default {
        name:"Auth",
        created(){
            let promise = axios.get(apiDomain+'/admin/login/getlogineduser',{headers:getHeader()});
            return promise.then((response) => {
                const result = response.data;
                result.roles.forEach(r => {
                    if(r.roleName=='SLICER'){
                        this.$router.push({name:'Slicer'});
                    }
                    if(r.roleName=='GLUER'){
                         this.$router.push({name:'Gluer'});    
                    }  
                    if(r.roleName=='ADMIN'){
                         this.$router.push({name:'Deliveries'});    
                    }      
                });
            }).catch(error => {
                alert(error.message);
                this.$router.push({name:'Login'});
            });
        }        
    }
</script>