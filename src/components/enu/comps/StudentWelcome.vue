<template>
    <b-row class="py-5">

        <b-col lg="6">
            <b-button block @click="toTrad" variant="success">{{$t("welcome.traditional")}}</b-button>    
        </b-col>    
        <b-col lg="6">
            <b-button block @click="toPys" variant="danger">{{$t("welcome.pys")}}</b-button>
        </b-col>    
    </b-row>   
</template>
<script>
    export default {
        name:"TestWelcome", 
        methods:{
            toTrad(){
                window.location.href = "/#/exam";         
            },
            toPys(){
                window.location.href = "/#/pexam";         
            }
        }
    }
</script>