<template>
     <b-row class="pt-3 pl-4">
        <div class="w-100 pb-2" >{{foundUser.relUserInfo}} зүссэн 
            <strong>{{foundUser.confirmedDoneCount}}</strong> листийн задаргаа
            <div>
                Нэгж зүсэлтийн үнэлгээ <input type="number" v-model="foundUser.unitCalculationCost">   

            </div>    
        </div>
        <div class="w-100 mb-2 p-1 small-font" style="clear:left; border:1px dashed #6c757d"
             v-for="(workConfirm,confirmIndex) in workConfirms" :key="confirmIndex">
                <div class="w-100">
                    Огноо : <strong>{{workConfirm.createdDate}}</strong>    
                </div>
                <div class="w-100">
                    Зүссэн тоо : <strong>{{ workConfirm.confirmedCount}}</strong>    
                </div>
               
                <div class="w-100">
                    Хамтарч зүсэгчид ({{workConfirm.workPeriods.length}}) : <br>
                    <em class="small-font" v-for="(m,mIndex) in workConfirm.workPeriods" :key="mIndex">
                        <strong>{{m.periodUser.relUserInfo}}</strong>
                    </em> 
                </div> 
                
                <div class="w-100">
                    <em>Оноогдсон зүсэлтийн үнэлгээ</em> : <strong>
                        {{foundUser.unitCalculationCost/(workConfirm.workPeriods.length+1)}}</strong>
                </div>
                <div class="w-100" style="text-decoration:underline">
                    Нийт үнэлгээ : <strong>
                        {{(foundUser.unitCalculationCost/(workConfirm.workPeriods.length+1))*workConfirm.confirmedCount}}
                    </strong>
                </div> 
           
        </div>
    </b-row>  
</template>
<script>


export default {
    name :"SlicerSalaryPeriod",
    props:['listUsers','userId'],
    
    data(){
        return {
            foundUser:{},
            workConfirms:[]            
        }
    },
    methods:{
        getCurrentBeingCalculatedUser(){
            let foundUser = null;
            for (let user of this.listUsers){
                if(Number(user.userId)==Number(this.userId)){
                    foundUser=user;
                    break;
                }
            }
            this.workConfirms=foundUser.anyWorkConfirms;
            this.foundUser=foundUser;
        }
    },
    created(){
        this.getCurrentBeingCalculatedUser();
    }
}
</script>

<style>
    .small-font{
        font-size:90%;
        font-weight: 400 
   }
   .xs-font{
        font-size:80%;
        font-weight: 400 
   }
</style>