<template>
    <b-list-group>
        <b-list-group-item v-for="(d,i) in departments" :key="i">
            <a href="javascript:void(0)">{{$i18n.locale()=='kz' ? d.departmentName : d.departmentNameRu}}</a> ({{d.teacherCount}})
        </b-list-group-item>
        
    </b-list-group>
</template>
<script>
import {apiDomain,getHeader} from "@/config/config";
import axios from 'axios';
export default {
    name:"DepartmentList",
    data(){
        return {
            departments:[]
        }
    },
    created(){
       
        axios.post(apiDomain+'/login/enu/landing/getrefs',{refType:'department'},{headers:getHeader()})
        .then(response=>{
            this.departments=response.data;
            
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
</script>