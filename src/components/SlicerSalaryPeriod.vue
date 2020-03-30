<template>
     <b-row  :class=" !isList ? 'pl-5 pr-4' : 'pl-4 pr-2'">
        <div class="w-100 pb-2 text-danger pt-2" >{{foundUser.relUserInfo}} {{isList ? 'зүссэн' : 'хийсэн'}} 
            <strong>{{foundUser.confirmedDoneCount}}</strong> 
            {{isList ? 'листийн' : 'нэмэлт ажлын'}} 
             задаргаа

            <div class="mt-2 text-secondary">
                Нэгж {{isList ? 'зүсэлтийн' : 'нэмэлт ажлын'}} үнэлгээ <input type="number" v-model="foundUser.unitCalculationCost">   

            </div>    
        </div>
        <div class="mb-2 p-1 small-font w-100" :class=" !isList ? 'border-success' : 'border-secondary'" style="clear:left; border:1px dashed #6c757d"
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
    props:['listUsers','userId','isList'],
    
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
            //alert(JSON.stringify(foundUser.anyWorkConfirms));
            this.workConfirms=foundUser.anyWorkConfirms;
            this.foundUser=foundUser;
        },
        testFunction(){
            alert("yes boy");
        },
        calculateSalary(){
           
            let salarySum = 
            this.workConfirms
            .reduce(
                (sum,currentSalary) => 
                sum + 
                Number(this.foundUser.unitCalculationCost/(currentSalary.workPeriods.length+1))
                *currentSalary.confirmedCount,
            0);

            return salarySum;
           
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