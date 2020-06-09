<template>
 <b-col lg="12">      
    
    <b-row class="text-primary">
       
        <b-col
            lg="12" 
            v-if="listSalarySum>0 && slicerSalaryForm.calcId==0">
            <strong><em>
                Бодогдсон  зүсэлтийн цалин:
            </em></strong> {{listSalarySum}}
        </b-col>
        <b-col lg="12" v-if="workSalarySum>0 && slicerSalaryForm.calcId==0">
            <strong><em>Бодогдсон нэмэлт ажлын цалин:</em></strong> {{workSalarySum}}
        </b-col>
        <!-- herev zasch baival -->
        <b-col lg="12" v-if="dbListSalarySum>0 && slicerSalaryForm.calcId>0">
            <strong><em>
                Бодогдсон  зүсэлтийн цалин:
            </em></strong> {{dbListSalarySum}}
        </b-col>
        <b-col lg="12" v-if="dbWorkSalarySum>0 && slicerSalaryForm.calcId>0">
            <strong><em>Бодогдсон нэмэлт ажлын цалин:</em></strong> {{dbWorkSalarySum}}
        </b-col>

        <b-col lg="12" v-if="slicerSalaryForm.calcId==0">
            <b-col lg="12" v-if="slicerSalaryForm.bonusSalary>0">
                <strong><em>Бодогдсон Бонус цалин:</em></strong> {{slicerSalaryForm.bonusSalary}}
            </b-col>
            

            <b-col lg="12" v-if="workSalarySum>0 || listSalarySum>0">
                <strong><em>Бодогдсон нийт цалин:</em></strong> 
                {{Number(workSalarySum)+Number(listSalarySum)
                    +Number(slicerSalaryForm.bonusSalary)}}
            </b-col>
        </b-col>
        <!-- herev zasch baival -->

        <b-col lg="12" v-if="slicerSalaryForm.calcId>0">
            <b-col lg="12" v-if="slicerSalaryForm.dbBonusSalary>0">
                <strong><em>Бодогдсон Бонус цалин:</em></strong> 
                {{Number(slicerSalaryForm.dbBonusSalary)+Number(slicerSalaryForm.bonusSalary)}}
            </b-col>
           
            <b-col lg="12" v-if="dbWorkSalarySum>0 || dbListSalarySum>0">
                <strong><em>Бодогдсон нийт цалин:</em></strong> 
                {{Number(dbWorkSalarySum)+Number(dbListSalarySum)
                    +Number(slicerSalaryForm.dbBonusSalary)+Number(slicerSalaryForm.bonusSalary)}}
            </b-col>
        </b-col>

    </b-row>
    <b-col lg="12" v-if="slicerSalaryForm.calcId==0 
        && (workSalarySum>0 || listSalarySum>0) " class="text-danger">
    
        <h5 class="text-center">
            <span class="bd-content-title">
                Цалин өгөх
            </span>
        </h5> 
         <b-col lg="12">
            <strong>Картаар авсан</strong>
            {{
               Number(slicerSalaryForm.byCard)
            }}
        </b-col>
        <b-col lg="12">
            <strong>Бэлнээр авсан</strong>
            {{
               Number(slicerSalaryForm.byCash)
            }}
        </b-col>
        <b-col lg="12" v-if="slicerSalaryForm.taxSalary>0">
            <strong>Торгуулиар авсан</strong> 
            {{Number(slicerSalaryForm.taxSalary)}}
        </b-col>
        <b-col lg="12">
            <hr>
            <strong>Авсан нийт цалин=</strong>
                {{
                    (Number(slicerSalaryForm.byCard)
                    +Number(slicerSalaryForm.byCash))+Number(slicerSalaryForm.taxSalary)
                }}
        </b-col>
        <b-col lg="12" class="text-success">
            <strong><em>Үлдэгдэл цалин=</em></strong>
            {{
                (Number(workSalarySum)+Number(listSalarySum)+Number(slicerSalaryForm.bonusSalary))
                -(Number(slicerSalaryForm.byCard)
                +Number(slicerSalaryForm.byCash)+Number(slicerSalaryForm.taxSalary))
            }}
        </b-col>
    </b-col>
    <b-col lg="12" v-if="slicerSalaryForm.calcId>0 
        && (dbWorkSalarySum>0 || dbListSalarySum>0) " class="text-danger">
    
        <h5 class="text-center">
            <span class="bd-content-title">
                Цалин өгөх
            </span>
         </h5> 

         <b-col lg="12">
            <strong>Картаар авсан</strong>
            {{
               Number(slicerSalaryForm.dbByCard)
            }}
        </b-col>
        <b-col lg="12">
            <strong>Бэлнээр авсан</strong>
            {{
               Number(slicerSalaryForm.dbByCash)
            }}
        </b-col>
        <b-col lg="12" v-if="slicerSalaryForm.dbTaxSalary>0">
            <strong>Торгуулиар авсан</strong> 
            {{Number(slicerSalaryForm.dbTaxSalary)+Number(slicerSalaryForm.taxSalary)}}
        </b-col>
         

        <b-col lg="12">
            <hr>
            <strong>Авсан нийт цалин=</strong>
            {{
               Number(slicerSalaryForm.currentAssignedSalary)
            }}
        </b-col>
        <b-col lg="12" class="text-success">
            <strong><em>Үлдэгдэл цалин</em></strong>
            {{
               Number(slicerSalaryForm.currentBalance) -
               (Number(slicerSalaryForm.byCard)+Number(slicerSalaryForm.byCash)+Number(slicerSalaryForm.taxSalary)) 
            }}
        </b-col>

        <!-- begining of the calculation information -->
        <b-col lg="12" class="pt-3 text-primary">
            <strong><em>Тооцоо хийсэн:</em></strong>
            {{
               slicerSalaryForm.calcDate 
            }}
        </b-col>
         <b-col lg="12" class="pt-3 text-primary">
            <strong><em>Сүүлд засалт хийсэн:</em></strong><br>
            {{
               slicerSalaryForm.calcDate 
            }}
        </b-col>
        <b-col lg="12" class="text-primary">
            <strong><em>Тооцооны интервал:</em></strong><br>
            
            {{
               slicerSalaryForm.calcBeginDate + ' наас/нээс ' +slicerSalaryForm.calcEndDate
            }}
            
        </b-col>
       
    </b-col>
    <b-col lg="12"  v-if="listSalarySum>0 || workSalarySum>0 || dbListSalarySum>0 || dbWorkSalarySum>0">
        <b-form v-on:submit.prevent="postSlicerSalaryCalculation">
            <b-form-row>
                    <b-col sm="auto" lg="12">
                        <label for="bonusSalary">Бонус цалин</label>
                        <b-form-input
                            id="bonusSalary"
                            v-model="slicerSalaryForm.bonusSalary"
                            type="number"
                            placeholder="Бонус"
                        ></b-form-input>
                    </b-col>
                    <b-col sm="auto" lg="12">
                        <label for="bonusDescription">Бонус шалтгаан</label>
                        <b-form-textarea
                            id="bonusDescription"
                            v-model="slicerSalaryForm.bonusDescription"
                            placeholder="Бонус шалтгаан"
                        ></b-form-textarea>
                    </b-col>
                   
                
                    <b-col sm="auto" lg="12">
                        <label for="byCard">Картаар</label>
                        <b-form-input
                            :min=0
                            id="byCard"
                            v-model="slicerSalaryForm.byCard"
                            type="number"
                            placeholder="Картаар"
                        ></b-form-input>
                    </b-col>
                    <b-col sm="auto" lg="12">
                        <label for="byCash">Бэлнээр</label>
                        <b-form-input
                            id="byCash"
                            min=0
                            v-model="slicerSalaryForm.byCash"
                            type="number"
                            placeholder="Бэлнээр"
                        ></b-form-input>
                    </b-col>

                     <b-col sm="auto" lg="12">
                        <label for="taxSalary">Торгууль</label>
                        <b-form-input
                            id="taxSalary"
                            v-model="slicerSalaryForm.taxSalary"
                            type="number"
                            placeholder="Торгууль"
                        ></b-form-input>
                    </b-col>
                    <b-col sm="auto" lg="12">
                        <label for="taxDescription">Торгууль шалтгаан</label>
                        <b-form-textarea
                            id="taxDescription"
                            v-model="slicerSalaryForm.taxDescription"
                            placeholder="Торгууль шалтгаан"
                        ></b-form-textarea>
                    </b-col>
                    
                    
                </b-form-row>
                <b-button
                    v-if="!isSalaryPosted
                     && (slicerSalaryForm.byCash >0 || slicerSalaryForm.byCard>0)"
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
    name:"SalaryForm",
    components:{
        Loading
    },
    props:[
        'clistSalarySum',
        'cworkSalarySum',
        'slicerSalary',
        'beginDate',
        'endDate', 
        'userId'
    ],
    data(){
      return {
        dbListSalarySum : 0,
        dbWorkSalarySum :0,
        updateSalaryData:null,

        slicerSalaryForm:{
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
        updateSlicerSalary(salaryInfo){
            window.scrollTo(0,0);
            axios.post(apiDomain+'/admin/calculation/getuserdbsalary',salaryInfo,{headers:getHeader()})
            .then((response)=>{
                let dbData = response.data;
                this.slicerSalaryForm.byCard=0;
                this.slicerSalaryForm.byCash=0;
                this.slicerSalaryForm.bonusSalary = 0;
                this.slicerSalaryForm.taxSalary = 0;
                this.slicerSalaryForm.calcId= dbData.calcId;
                this.slicerSalaryForm.bonusDescription= dbData.bonusDescription;
                this.slicerSalaryForm.dbBonusSalary = dbData.bonusSalary;
                this.slicerSalaryForm.taxDescription= dbData.taxDescription;
                this.slicerSalaryForm.dbByCard= dbData.byCard;
                this.slicerSalaryForm.dbByCash= dbData.byCash;
                this.slicerSalaryForm.dbTaxSalary = dbData.taxSalary;
                this.dbListSalarySum=dbData.listSalarySum;
                this.dbWorkSalarySum=dbData.workSalarySum;
                this.slicerSalaryForm.currentBalance=dbData.currentBalance;
                this.slicerSalaryForm.currentAssignedSalary=dbData.currentAssignedSalary;
                this.slicerSalaryForm.calcDate=dbData.createdDate;
                this.slicerSalaryForm.dbModiDate=dbData.modiDate;
                this.slicerSalaryForm.calcBeginDate=dbData.calcBeginDate;
                this.slicerSalaryForm.calcEndDate=dbData.calcEndDate;
            })
            .catch(error =>{
                alert(error.message);
            });
        },
        postSlicerSalaryCalculation(){
            let warn = confirm("Сіз сенімдісіз бе ?");
            
            if((warn && this.slicerSalary.length>0) ||
                (warn && this.slicerSalaryForm.calcId>0)  ){
                this.isSalaryPosted=true;
                if(this.slicerSalaryForm.calcId>0){
                    this.slicerSalaryForm.salaryDetails=[];
                }
                else{
                    this.slicerSalaryForm.salaryDetails=this.slicerSalary;
                }
                
                this.slicerSalaryForm.calcBeginDate=this.beginDate;
                this.slicerSalaryForm.calcEndDate=this.endDate;
                this.slicerSalaryForm.userId = this.userId;

                axios.post(apiDomain+'/admin/calculation/postsalary',this.slicerSalaryForm,{headers:getHeader()})
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
                            this.updateSlicerSalary(this.updateSalaryData);
                        else {
                             EventBus.$emit("slicerTableRefresher");    
                        }

                    }
                    if(serverResult=='error'){
                        this.$bvToast.toast('Системд алдаа үүслээ !', {
                            title: 'Қате туралы ақпарат',
                            autoHideDelay: 5000,
                            variant:"danger"
                        });
                        this.dbListSalarySum=0;
                        this.dbWorkSalarySum=0;
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
      listSalarySum:function(){
         
        this.slicerSalaryForm.calcId=0;         
        return this.clistSalarySum;
      },
      workSalarySum:function(){
        this.slicerSalaryForm.calcId=0;
        return this.cworkSalarySum;
      }
    },
    mounted(){
        let c = this;
        EventBus.$on("updateSlicerSalary", (data)=>{
            c.updateSalaryData=data;
            c.updateSlicerSalary(data);
        });

        EventBus.$on("searchDone", ()=>{
          c.slicerSalaryForm.calcId=0;
          c.dbListSalarySum=0;
          c.dbWorkSalarySum=0;
        });
    }

}
</script>