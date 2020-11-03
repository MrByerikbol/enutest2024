<template>
 <div class="app"> 
   <LandingHeader/>
 
    <b-container  fluid>
         <b-row class="pt-5 mt-5"> 
            <b-col lg="8" class="pt-5">
              <router-view></router-view>

            </b-col>
            <b-col lg="4" class="pt-5">
              <h4>{{$t('enu.landing.departmentsText')}}</h4>
              <DepartmentList/>
            </b-col>
      </b-row>  
    </b-container>
    
   <LandingFooter/>
 </div>
</template>

<script>
  import LandingHeader from "@/components/enu/landing/LandingHeader";
  import DepartmentList from "@/components/enu/landing/DepartmentList";
  import LandingFooter from "@/components/enu/landing/LandingFooter";
  export default {
    components:{
      LandingHeader,
      DepartmentList,
      LandingFooter
    },
    name:"Login"
  }
</script>

<style scoped>

</style>