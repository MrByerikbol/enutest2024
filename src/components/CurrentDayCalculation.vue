<template>
    <b-row>
        <b-col lg="12">
            <b-button block  :disabled="calculating || beginDate=='' || endDate==''" @click="getCurrentCalculationInfo">
                {{calculating ? 'Жүктелуде...' : 'Есеп ақпаратын алу'}}
            </b-button>
        </b-col>
        <b-col lg="12" v-if="calcInfo!=null">
            <h5>Тапсырыс есебi</h5>
            <b-row class="bg-info">
                <b-col lg="4"><strong>Дайны алган</strong></b-col>    
                <b-col lg="4"><strong>Картбен алган</strong></b-col>    
                <b-col lg="4"><strong>Карыз</strong></b-col>

                <b-col lg="4">{{calcInfo.deliveryCalc.sumByCash}}</b-col>    
                <b-col lg="4">{{calcInfo.deliveryCalc.sumByCard}}</b-col>    
                <b-col lg="4">{{calcInfo.deliveryCalc.sumLoan}}</b-col>    
            </b-row>
           
            <h5>Кусок ПВХ есебi</h5>
            <b-row class="bg-warning">
                <b-col lg="4"><strong>Дайны алган</strong></b-col>    
                <b-col lg="4"><strong>Картбен алган</strong></b-col>    
                <b-col lg="4"><strong>Карыз</strong></b-col>

                <b-col lg="4">{{calcInfo.kusokCalc.sumByCash}}</b-col>    
                <b-col lg="4">{{calcInfo.kusokCalc.sumByCard}}</b-col>    
                <b-col lg="4">{{calcInfo.kusokCalc.sumLoan}}</b-col>    
            </b-row>
            <h5>Кайтарган несие есебi</h5>
            
            <b-row class="bg-danger">
                <b-col lg="4"><strong>Дайны алган</strong></b-col>    
                <b-col lg="4"><strong>Картбен алган</strong></b-col>    
                <b-col lg="4"><strong>Карыз</strong></b-col>

                <b-col lg="4">{{calcInfo.loanCalc.sumByCash}}</b-col>    
                <b-col lg="4">{{calcInfo.loanCalc.sumByCard}}</b-col>    
                <b-col lg="4">{{calcInfo.loanCalc.sumLoan}}</b-col>    
            </b-row>
            <b-row>
                <b-col lg="4"><strong>Барлык дайны алган</strong></b-col>    
                <b-col lg="4"><strong>Барлык картбен алган</strong></b-col>    
                <b-col lg="4"><strong>Барлык карыз</strong></b-col>

                <b-col lg="4">#{{
                    Number(calcInfo.deliveryCalc.sumByCash)
                    +Number(calcInfo.loanCalc.sumByCash)
                    +Number(calcInfo.kusokCalc.sumByCash)
                }}</b-col>    
                <b-col lg="4">#{{Number(calcInfo.deliveryCalc.sumByCard)
                    +Number(calcInfo.loanCalc.sumByCard)
                    +Number(calcInfo.kusokCalc.sumByCard)}}
                </b-col>    
                <b-col lg="4">#{{Number(calcInfo.deliveryCalc.sumLoan)
                    +Number(calcInfo.loanCalc.sumLoan)
                    +Number(calcInfo.kusokCalc.sumLoan)}}
                </b-col>    
            </b-row>
             <b-row>
                <b-col lg="12">
                    <hr>    
                </b-col> 
                <b-col lg="12" class="text-right"><strong>Жалпы Есеп: #</strong> 
                    {{
                        Number(calcInfo.deliveryCalc.sumLoan)
                        +Number(calcInfo.loanCalc.sumLoan)
                        +Number(calcInfo.kusokCalc.sumLoan)

                        +Number(calcInfo.deliveryCalc.sumByCard)
                        +Number(calcInfo.loanCalc.sumByCard)
                        +Number(calcInfo.kusokCalc.sumByCard)

                        +Number(calcInfo.deliveryCalc.sumByCash)
                        +Number(calcInfo.loanCalc.sumByCash)
                        +Number(calcInfo.kusokCalc.sumByCash)
                    }}   
                 </b-col>    
               
            </b-row>
        </b-col>
    </b-row>

</template>
<script>
    import axios from 'axios';
    import {apiDomain,getHeader} from "../config/config";
    const moment = require('moment')
    require('moment/locale/es')
    export default {
        name : "CurrentDayCalculation",
        props:['beginDate','endDate'],
        data(){
            return{
                calculating:false,
                calcInfo:null
            }
        },
        methods:{
            getCurrentCalculationInfo(){
                //alert("duudagdav");
                this.calculating=true;
                let ctx = new Object();
                
                if(this.beginDate!=""){
                    ctx.beginDate=moment(this.beginDate).format('YYYY-MM-DD')
                }
                else{
                    ctx.beginDate="";
                }
                if(this.endDate!=""){
                    ctx.endDate=moment(this.endDate).format('YYYY-MM-DD')
                }
                else{
                    ctx.endDate="";
                }
                axios.post(apiDomain+'/admin/order/getcurrentdaycalc',
                ctx,{headers:getHeader()})
                .then(response=>{
                    this.calculating=false;
                    this.calcInfo=response.data;
                })
                .catch(() => {
                    this.calculating=false;
                    
                }) 
            }
        }
    }
</script>