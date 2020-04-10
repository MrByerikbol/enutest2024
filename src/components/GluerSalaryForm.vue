<template>
 <b-col lg="12">      
    
    <b-row class="text-primary">
        <b-col lg="12" v-if="gluerSalarySum>0">
            <strong><em>
                Бодогдсон  наалтын цалин:
            </em></strong> {{gluerSalarySum}}
        </b-col>
       
        <b-col lg="12" v-if="gluerSalaryForm.bonusSalary>0">
            <strong><em>Бодогдсон Бонус цалин:</em></strong> {{gluerSalaryForm.bonusSalary}}
        </b-col>
        <b-col lg="12" v-if="gluerSalaryForm.taxSalary>0">
            <strong><em>Бодогдсон торгууль:</em></strong> {{gluerSalaryForm.taxSalary}}
        </b-col>
        <b-col lg="12" v-if="gluerSalarySum>0">
        
        <strong><em>Бодогдсон нийт цалин:</em></strong> 
            {{(Number(gluerSalarySum)+Number(gluerSalaryForm.bonusSalary))
            -Number(gluerSalaryForm.taxSalary)}}
        </b-col>
    </b-row>
    <b-col lg="12" v-if="gluerSalarySum>0" class="text-danger">
    
        <h5 class="text-center">
        <span class="bd-content-title">Цалин өгөх</span>
        </h5> 
        <b-col lg="12">
        <strong>Авсан цалин=</strong>
            {{
                Number(gluerSalaryForm.byCard)
                +Number(gluerSalaryForm.byCash)
            }}
        </b-col>
        <b-col lg="12">
        <strong><em>Үлдэгдэл цалин=</em></strong>
            {{
            
                (
                    Number(gluerSalarySum)
                    +Number(gluerSalaryForm.bonusSalary)
                )
                -
                (
                    Number(gluerSalaryForm.byCard)
                    +Number(gluerSalaryForm.byCash)
                    +Number(gluerSalaryForm.taxSalary)
                
                )
            }}
        </b-col>
    </b-col>
    <b-col lg="12"  v-if="gluerSalarySum>0" >
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
                        :max="Number(gluerSalarySum)+Number(gluerSalaryForm.bonusSalary)"
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
                        :max="Number(gluerSalarySum)
                            +Number(gluerSalaryForm.bonusSalary)-Number(gluerSalaryForm.byCard)"
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
                    v-if="gluerSalaryForm.byCash >0 || gluerSalaryForm.byCard>0"
                    type="submit" class="mt-3" block variant="outline-success">
                    Цалингийн тооцоо хийх
                </b-button>
            </b-form>
        </b-col>
    </b-col>   
</template>

<script>
export default {
    name:"GluerSalaryForm",
    props:[
        'cgluerSalarySum',
    ],
    methods:{
        postGluerSalaryCalculation(){
            alert("we will do something super");
        }
    },
    data(){
      return {
        gluerSalaryForm:{
          bonusSalary : 0,
          bonusDescription:"",
          taxSalary :0,
          taxDescription:"",
          byCard : 0,
          byCash:0
        }
      }
    },
    computed:{
      gluerSalarySum:function(){
        return this.cgluerSalarySum;
      }
     
    }    
}
</script>