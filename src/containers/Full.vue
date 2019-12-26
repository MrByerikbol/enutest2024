<template>
    <div class="app">
        <AppHeader/>
        <b-container>
            <router-view></router-view>
        </b-container>
   </div>
</template>

<script>

import axios from 'axios';
const menujsonurl = "/admin/user/menu";
import {apiDomain,getHeader} from "../config/config";
import AppHeader from '../components/AppHeader';

export default {
    
  name: 'Full',
  components: {
    AppHeader
  },
  computed: {
    name () {
      return this.$route.name
    },
    list () {
      return this.$route.matched
    }
  },
  methods:{
    rightMenuJSON(){
      //alert("now it will take right menu json");
      
      axios.get(apiDomain+menujsonurl,{headers:getHeader()}).then(response=>{
        //alert("it take response from server");
        //console.log("this is the main struct of something",response.data);
        this.nav=response.data;
      })
      .catch(error=>{
        //alert("this is error section");
        //console.log(error);
        this.$router.push({name:'Login'});
      })
    }

  },
  created(){
      //alert("iishee irsen uu");
    this.rightMenuJSON();
  }
}
</script>
