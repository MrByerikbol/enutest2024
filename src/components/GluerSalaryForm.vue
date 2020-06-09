<template>
 <b-col lg="12">      
    
    <b-row class="text-primary">
        <b-col lg="12"
            v-if="gluerSalarySum>0 && gluerSalaryForm.calcId==0">

            <strong><em>
                Бодогдсон  наалтын цалин:
            </em></strong> {{gluerSalarySum}}
        </b-col>
        <!-- herev zasch baival -->
        <b-col lg="12" v-if="dbGluerSalarySum>0 && gluerSalaryForm.calcId>0">
            <strong><em>
                Бодогдсон  наалтын цалин:
            </em></strong> {{dbGluerSalarySum}}
        </b-col>
        <b-col lg="12" v-if="gluerSalaryForm.calcId==0">
            <b-col lg="12" v-if="gluerSalaryForm.bonusSalary>0">
                <strong><em>Бодогдсон Бонус цалин:</em></strong> {{gluerSalaryForm.bonusSalary}}
            </b-col>
            <b-col lg="12" v-if="gluerSalarySum>0">
            <strong><em>Бодогдсон нийт цалин:</em></strong> 
                {{(Number(gluerSalarySum)+Number(gluerSalaryForm.bonusSalary))}}
            </b-col>
         </b-col>
         <!-- herev zasch baival -->
         <b-col lg="12" v-if="gluerSalaryForm.calcId>0">
            <b-col lg="12" v-if="gluerSalaryForm.dbBonusSalary>0">
                <strong><em>Бодогдсон Бонус цалин:</em></strong> 
                {{Number(gluerSalaryForm.dbBonusSalary)+Number(gluerSalaryForm.bonusSalary)}}
            </b-col>
           
            <b-col lg="12" v-if="dbGluerSalarySum>0">
                <strong><em>Бодогдсон нийт цалин:</em></strong> 
                {{Number(dbGluerSalarySum)
                    +Number(gluerSalaryForm.dbBonusSalary)+Number(gluerSalaryForm.bonusSalary)}}
            </b-col>
         </b-col>

    </b-row>
    <b-col lg="12" v-if="gluerSalarySum>0" class="text-danger">
        <b-col lg="12" v-if="gluerSalaryForm.calcId==0 
            && gluerSalarySum>0 " class="text-danger">
        
            <h5 class="text-center">
                <span class="bd-content-title">
                    Цалин өгөх
                </span>
            </h5> 
            <b-col lg="12">
                <strong>Картаар авсан</strong>
                {{
                Number(gluerSalaryForm.byCard)
                }}
            </b-col>
            <b-col lg="12">
                <strong>Бэлнээр авсан</strong>
                {{
                Number(gluerSalaryForm.byCash)
                }}
            </b-col>
            <b-col lg="12" v-if="gluerSalaryForm.taxSalary>0">
                <strong>Торгуулиар авсан</strong> 
                {{Number(gluerSalaryForm.taxSalary)}}
            </b-col>
            <b-col lg="12">
                <hr>
                <strong>Авсан нийт цалин=</strong>
                    {{
                        (Number(gluerSalaryForm.byCard)
                        +Number(gluerSalaryForm.byCash))+Number(gluerSalaryForm.taxSalary)
                    }}
            </b-col>
            <b-col lg="12" class="text-success">
                <strong><em>Үлдэгдэл цалин=</em></strong>
                {{
                    (Number(gluerSalarySum)+Number(gluerSalaryForm.bonusSalary))
                    -(Number(gluerSalaryForm.byCard)
                    +Number(gluerSalaryForm.byCash)+Number(gluerSalaryForm.taxSalary))
                }}
            </b-col>
        </b-col>
    </b-col>
    <b-col lg="12" v-if="gluerSalaryForm.calcId>0 
        && dbGluerSalarySum " class="text-danger">
    
        <h5 class="text-center">
            <span class="bd-content-title">
                Цалин өгөх
            </span>
         </h5> 

         <b-col lg="12">
            <strong>Картаар авсан</strong>
            {{
               Number(gluerSalaryForm.dbByCard)
            }}
        </b-col>
        <b-col lg="12">
            <strong>Бэлнээр авсан</strong>
            {{
               Number(gluerSalaryForm.dbByCash)
            }}
        </b-col>
        <b-col lg="12" v-if="gluerSalaryForm.dbTaxSalary>0">
            <strong>Торгуулиар авсан</strong> 
            {{Number(gluerSalaryForm.dbTaxSalary)+Number(gluerSalaryForm.taxSalary)}}
        </b-col>
         

        <b-col lg="12">
            <hr>
            <strong>Авсан нийт цалин=</strong>
            {{
               Number(gluerSalaryForm.currentAssignedSalary)
            }}
        </b-col>
        <b-col lg="12" class="text-success">
            <strong><em>Үлдэгдэл цалин</em></strong>
            {{
               Number(gluerSalaryForm.currentBalance) -
               (Number(gluerSalaryForm.byCard)+Number(gluerSalaryForm.byCash)+Number(gluerSalaryForm.taxSalary)) 
            }}
        </b-col>

        <!-- begining of the calculation information -->
        <b-col lg="12" class="pt-3 text-primary">
            <strong><em>Тооцоо хийсэн:</em></strong>
            {{
               gluerSalaryForm.calcDate 
            }}
        </b-col>
         <b-col lg="12" class="pt-3 text-primary">
            <strong><em>Сүүлд засалт хийсэн:</em></strong><br>
            {{
               gluerSalaryForm.calcDate 
            }}
        </b-col>
        <b-col lg="12" class="text-primary">
            <strong><em>Тооцооны интервал:</em></strong><br>
            {{
               gluerSalaryForm.calcBeginDate + ' наас/нээс ' +gluerSalaryForm.calcEndDate
            }}
        </b-col>
    </b-col>
    <b-col lg="12"  v-if="gluerSalarySum>0 || dbGluerSalarySum>0" >
        <b-form v-on:submit.prevent="postGluerSalaryCalculation">
            <b-form-row>
                <b-col sm="auto" lg="12">
                    <label for="bonusSalary">Бонус цалин</label>
                    <b-form-input
                        id="bonusSalary"
                        v-model="gluerSalaryForm.bonusSalary"
                        type="number"
                        placeholder="Бонус"
                    ></b-form-input>
                </b-col>
                <b-col sm="auto" lg="12">
                    <label for="bonusDescription">Бонус шалтгаан</label>
                    <b-form-textarea
                        id="bonusDescription"
                        v-model="gluerSalaryForm.bonusDescription"
                        placeholder="Бонус шалтгаан"
                    ></b-form-textarea>
                </b-col>
                 <b-col sm="auto" lg="12">
                    <label for="byCard">Картаар</label>
                    <b-form-input
                       
                        id="byCard"
                        v-model="gluerSalaryForm.byCard"
                        type="number"
                        placeholder="Картаар"
                    ></b-form-input>
                </b-col>
                <b-col sm="auto" lg="12">
                    <label for="byCash">Бэлнээр</label>
                    <b-form-input
                        id="byCash"
                       
                        v-model="gluerSalaryForm.byCash"
                        type="number"
                        placeholder="Бэлнээр"
                    ></b-form-input>
                </b-col>    
                <b-col sm="auto" lg="12">
                        <label for="taxSalary">Торгууль</label>
                        <b-form-input
                            id="taxSalary"
                            v-model="gluerSalaryForm.taxSalary"
                            type="number"
                            placeholder="Торгууль"
                        ></b-form-input>
                    </b-col>
                    <b-col sm="auto" lg="12">
                        <label for="taxDescription">Торгууль шалтгаан</label>
                        <b-form-textarea
                            id="taxDescription"
                            v-model="gluerSalaryForm.taxDescription"
                            placeholder="Торгууль шалтгаан"
                        ></b-form-textarea>
                    </b-col>
                
                </b-form-row>
                <b-button 
                    v-if="(gluerSalaryForm.byCash >0 || gluerSalaryForm.byCard>0) && !isSalaryPosted"
                    type="submit" class="mt-3" block variant="outline-success">
                    Цалингийн тооцоо хийх
                </b-button>
                <Loading v-if="isSalaryPosted" />
            </b-form>
        </b-col>
    </b-col>   
</template>

<script>
import axios from 'axios';
import {apiDomain,getHeader} from "../config/config";
import Loading from './Loading';
import {EventBus} from '@/EventBus.js';
export default {
    name:"GluerSalaryForm",
    props:[
        'cgluerSalarySum',
        'gluerSalary',
        'gluerKusokSalary',
        'beginDate',
        'endDate', 
        'userId',
        'cgluerKusokSalarySum'   
    ],
    components:{
        Loading
    },
    data(){
      return {
        dbGluerSalarySum :0,
        updateSalaryData :null , 

        gluerSalaryForm:{
            calcId:0,
            bonusSalary : 0,
            bonusDescription:"",
            taxSalary :0,
            taxDescription:"",
            byCard : 0,
            byCash:0
        },
        isSalaryPosted:false
      }
    },
    methods:{
        updateGluerSalary(salaryInfo){
           
            window.scrollTo(0,0);
            axios.post(apiDomain+'/admin/calculation/getuserdbsalary',salaryInfo,{headers:getHeader()})
            .then((response)=>{
                let dbData = response.data;

                this.gluerSalaryForm.byCard=0;
                this.gluerSalaryForm.byCash=0;
                this.gluerSalaryForm.bonusSalary = 0;
                this.gluerSalaryForm.taxSalary = 0;
                this.gluerSalaryForm.calcId= dbData.calcId;
                this.gluerSalaryForm.bonusDescription= dbData.bonusDescription;
                this.gluerSalaryForm.dbBonusSalary = dbData.bonusSalary;
                this.gluerSalaryForm.taxDescription= dbData.taxDescription;
                this.gluerSalaryForm.dbByCard= dbData.byCard;
                this.gluerSalaryForm.dbByCash= dbData.byCash;
                this.gluerSalaryForm.dbTaxSalary = dbData.taxSalary;
                this.dbGluerSalarySum=dbData.pvhSalarySum;
        
                this.gluerSalaryForm.currentBalance=dbData.currentBalance;
                this.gluerSalaryForm.currentAssignedSalary=dbData.currentAssignedSalary;
                this.gluerSalaryForm.calcDate=dbData.createdDate;
                this.gluerSalaryForm.dbModiDate=dbData.modiDate;
                this.gluerSalaryForm.calcBeginDate=dbData.calcBeginDate;
                this.gluerSalaryForm.calcEndDate=dbData.calcEndDate;
            })
            .catch(error =>{
                alert(error.message);
            });
        },
        postGluerSalaryCalculation(){
            let warn = confirm("Сіз сенімдісіз бе ?");
            
            if((warn && this.gluerSalary.length>0) || (warn && this.gluerKusokSalary.length>0) ||
                (warn && this.gluerSalaryForm.calcId>0)  ){
                this.isSalaryPosted=true;
                if(this.gluerSalaryForm.calcId>0){
                    this.gluerSalaryForm.salaryDetails=[];
                    
                }
                else{
                    this.gluerSalaryForm.salaryDetails=[...this.gluerSalary,...this.gluerKusokSalary];
                }
                
                this.gluerSalaryForm.calcBeginDate=this.beginDate;
                this.gluerSalaryForm.calcEndDate=this.endDate;
                this.gluerSalaryForm.userId = this.userId;

                axios.post(apiDomain+'/admin/calculation/postgulersalary',this.gluerSalaryForm,{headers:getHeader()})
                .then((response)=>{
                    this.isSalaryPosted=false;
                    let serverResult = response.data;
                    if(serverResult=='success'){
                         this.$bvToast.toast('Тооцоо Жетістіктай засагдлаа.', {
                            title: 'Мэдээлэл',
                            autoHideDelay: 5000,
                            variant:"success"
                        });
                        if(this.updateSalaryData!=null)
                            this.updateGluerSalary(this.updateSalaryData);
                        else {
                             EventBus.$emit("gluerTableRefresher");    
                        }

                    }
                    if(serverResult=='error'){
                        this.$bvToast.toast('Системд алдаа үүслээ !', {
                            title: 'Қате туралы ақпарат',
                            autoHideDelay: 5000,
                            variant:"danger"
                        });
                        this.dbGluerSalarySum=0;
                        
                    }
                   
                })
                .catch(error =>{
                    this.isSalaryPosted=false;
                    alert(error.message);
                });
            }
        }
    },
    computed:{
      gluerSalarySum:function(){
        this.gluerSalaryForm.calcId=0;
        return Number(this.cgluerSalarySum+this.cgluerKusokSalarySum);
      },
     
     
    },
    mounted(){
        let c = this;
        EventBus.$on("updateGluerSalary", (data)=>{
            c.updateSalaryData=data;
            c.updateGluerSalary(data);
        });

        EventBus.$on("salarySearchDone", ()=>{
          c.gluerSalaryForm.calcId=0;
          c.dbGluerSalarySum=0;
          
        });
    }   
}
</script>