<template>
     <b-row  :class=" !isList ? 'pl-5 pr-4' : 'pl-4 pr-2'">
        <div v-if="workConfirms.length>0" class="w-100 pb-2 text-danger pt-2" >{{foundUser.relUserInfo}} {{isList ? 'зүссэн' : 'хийсэн'}} 
            <strong>{{foundUser.confirmedDoneCount}}</strong> 
            {{isList ? 'листийн' : 'нэмэлт ажлын'}} 
             задаргаа 
            <div class="mt-2 text-secondary">
                Нэгж {{isList ? 'зүсэлтийн' : 'нэмэлт ажлын'}} үнэлгээ 
                <input type="number" @change="calculatePeriodSalary" v-model="foundUser.unitCalculationCost">   
            </div>    
        </div>
        <div class="mb-2 p-1 small-font w-100"
             :class=" !isList ? 'border-success' : 'border-secondary'"
             style="clear:left; border:1px dashed #6c757d"
             v-for="(workConfirm,confirmIndex) in workConfirms" :key="confirmIndex">
            <div class="w-100">
                Зүссэн Огноо :<strong>{{workConfirm.createdDate}}</strong>    
            </div>
            <div class="w-100" style="position:relative;" v-if="workConfirm.isCalculationConfirmed==1">
                <b-icon icon="check" id="salaryOk"
                    href="#"
                    tabindex="0"
                    v-b-tooltip.hover
                    @click="updateSalaryBalance(workConfirm.anyId,isList)"
                    title="Цалин бодогдсон"
                    style="position:absolute;right:0;top:-25px;" 
                    variant="success" font-scale="4"></b-icon>

               
                <div class="w-100">
                    
                    Тооцоо хийсэн : <strong>{{workConfirm.calcDate}}</strong>    
                </div>
                <div class="w-100">
                    Тооцооны интервал : 
                        <strong>{{workConfirm.calcBeginDate+' наас/нөөс '+workConfirm.calcEndDate}}</strong>    
                </div>
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
            <div class="w-100">
                    {{isList ? 'Зүссэн' : 'Хийсэн'}}  : <strong>{{ workConfirm.confirmedCount}}</strong>    
            </div>
            <div class="w-100" style="text-decoration:underline">
                Нийт үнэлгээ <em><strong>({{isList ? 'Зүссэн' : 'Хийсэн'}} тоо * Оноогдсон үэнэлгээ)</strong></em> = <strong>
                    {{(foundUser.unitCalculationCost/(workConfirm.workPeriods.length+1))*workConfirm.confirmedCount}}
                </strong>
            </div> 
            
        </div>
    </b-row>  
</template>
<script>


export default {
    name :"SlicerSalaryPeriod",
    props:[
        'listUsers',
        'userId',
        'isList',
      
        'relId',
        
        'workId',
        'calcSalary',
        'updateSalaryBalance'
        ],
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
        },
        calculatePeriodSalary(){
            let salarySum = 
            this.workConfirms
            .filter(w=>w.isCalculationConfirmed==0)//umnu ni tootsoolol hiigdeegui tohiolold l shine bolno
            .reduce(
                (sum,currentSalary) => 
                sum + 
                Number(this.foundUser.unitCalculationCost/(currentSalary.workPeriods.length+1))
                *currentSalary.confirmedCount,
            0);    
            if(this.isList){
                //console.info(`${this.deliveryIndex} ${this.listIndex} ${this.workIndex} `);
                this.calcSalary(this.relId,salarySum,0);
            }
            if(!this.isList){
                this.calcSalary(this.workId,salarySum,1);
            }        
        }
       
    },
    created(){
        this.getCurrentBeingCalculatedUser();    
        this.calculatePeriodSalary();
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