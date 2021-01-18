<template>
    <b-row class="px-3">
        <b-col lg="12">
            <b-row id="printContainer"> 
                <b-col lg="12" >
                    <div class="w-100" v-if="$i18n.locale()=='kz'">
                        <p style="text-align: center;font-size: 14pt;">
                            <strong>Үміткерлерді</strong><strong>&nbsp;Қазақстан&nbsp;Республикасының&nbsp;заңнамасы&nbsp;бойынша</strong>
                        </p>
                        <p style="text-align: center;font-size: 14pt;"><strong>ТЕСТІЛЕУ НӘТИЖЕЛЕРІ</strong></p>
                        <p style="font-size: 14pt;"><strong>Өткізу орны:&nbsp;</strong>Л.Н.
                            Гумилев&nbsp;атындағы&nbsp;Еуразия&nbsp;ұлттық&nbsp;университеті&nbsp;(Сәтпаев&nbsp;к-сі, 2, 352&nbsp;дәр.)</p>
                        <p style="font-size: 14pt;"><strong>Аты-жөні:&nbsp;</strong>{{report.userInfo.firstName + ' ' +report.userInfo.lastName}}</p>
                        <p style="font-size: 14pt;"><strong>Емтихан күні:&nbsp;</strong>{{report.examDate}}</p>
                        <p style="font-size: 14pt;"><strong>Есеп беру күні:&nbsp;</strong>{{report.reportDate}}</p>
                    </div>
                    <div class="w-100" v-if="$i18n.locale()=='ru'">
                        <p style="text-align: center;page-break-before: always;font-size: 14pt;"><strong>НАО «Евразийский национальный университет им. Л.Н.
                        Гумилева»</strong></p>
                        <p>&nbsp;</p>
                        <p style="text-align: center;font-size: 14pt;"><strong>РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ</strong></p>
                        <p style="text-align: center;font-size: 14pt;"><strong>претендентов на знание законодательства Республики Казахстан</strong></p>
                        <p style="font-size: 14pt;"><strong>Место проведения</strong>: Евразийский национальный университет имени Л.Н. Гумилева (ул. Сатпаева, 2,
                            ауд. 352)</p>
                        <p style="font-size: 14pt;"><strong>Аты-жөні:&nbsp;</strong>{{report.userInfo.firstName + ' ' +report.userInfo.lastName}}</p>
                        <p style="font-size: 14pt;"><strong>Дата экзамена:&nbsp;</strong>{{report.examDate}}</p>
                        <p style="font-size: 14pt;"><strong>Дата отчета:&nbsp;</strong>{{report.reportDate}}</p>
                    </div>        
                    
                </b-col>
                
                <b-col lg="12">
                    <b-row v-for="(r,rIndex) in report.reportData" :key="rIndex">
                        <b-col lg="12" v-if="r.haveFactor==0"><h5 class="mt-2">{{$i18n.locale()=='kz' ? r.catName : r.catNameRu}} :</h5></b-col>
                        <b-col lg="12"  v-if="r.haveFactor==0">
                            <span class="ml-3">
                                {{'('+r.catDefination.currentUserTakenPoint+')'}} {{$i18n.locale()=='kz' ? r.catDefination.description : r.catDefination.descriptionRu}}
                            </span>
                        </b-col>
                        <b-col lg="12"  v-if="r.haveFactor==1">
                            <h5 class="mt-2">{{$i18n.locale()=='kz' ? r.catName : r.catNameRu}} :</h5>
                            <table border="1" width="100%" style="border-collapse: collapse; text-align: center;">
                                <tr>
                                    <td style="min-width: 150;">
                                        <p><strong>Фактор</strong></p>
                                    </td>
                                    <td >
                                        <p><strong>{{$t('defination')}}</strong></p>
                                    </td>
                                    
                                </tr>
                                
                                <tbody v-for="(f,fIndex) in r.factors" :key="fIndex">
                                    <tr style="height: 100;">
                                        <td>
                                            {{$i18n.locale()=='kz' ? f.factorName : f.factorNameRu}}              
                                        </td>
                                        <td>
                                            <span class="ml-3">
                                                {{'('+f.factorDef.currentUserTakenPoint+')'}} {{$i18n.locale()=='kz' ? f.factorDef.description : f.factorDef.descriptionRu}}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </b-col>

                    </b-row>
                </b-col>
            </b-row>
        </b-col>
        <b-col lg="12">
            <b-button variant="outline-success" @click="printReport"  class="mt-3 w-25 float-right">Print</b-button>
        </b-col>
    </b-row>
</template>
<script>
    export default {
        props:['report'],
        name:"PtestReport",
        methods:{
            printReport(){
                this.$htmlToPaper('printContainer');
                //this.PrintDiv('printContainer');
            }    
        }
        
    }
</script>