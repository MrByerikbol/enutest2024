<template>
    <b-row class="px-3" > 
     <b-col lg="12" id="printContainer">
         <div class="w-100" v-if="$i18n.locale()=='kz'">
            <!-- <p style="text-align: center;font-size: 14pt;"><strong>«</strong><strong>Л.Н.
                    Гумилев&nbsp;атындағы&nbsp;Еуразия&nbsp;ұлттық&nbsp;университеті»&nbsp;КеАҚ</strong></p> -->
            <p style="text-align: center;font-size: 14pt;">
                <strong>Үміткерлерді</strong><strong>&nbsp;Қазақстан&nbsp;Республикасының&nbsp;заңнамасы&nbsp;бойынша</strong>
            </p>
            <p style="text-align: center;font-size: 14pt;"><strong>ТЕСТІЛЕУ НӘТИЖЕЛЕРІ</strong></p>
            <p style="font-size: 14pt;"><strong>Өткізу орны:&nbsp;</strong>Л.Н.
                Гумилев&nbsp;атындағы&nbsp;Еуразия&nbsp;ұлттық&nbsp;университеті&nbsp;(Сәтпаев&nbsp;к-сі, 2, 352&nbsp;дәр.)</p>
            <p style="font-size: 14pt;"><strong>Күні</strong><strong>:</strong>&nbsp;{{currentDate}} ж.</p>
            <p style="font-size: 14pt;"><strong>Уақыты</strong>: {{currentTime}}</p>
            <p style="font-size: 14pt;"><strong>Группа</strong>: {{$i18n.locale()=='kz' ? currentGroup.groupName : currentGroup.groupNameRu}}</p>
         </div>
         <div class="w-100" v-if="$i18n.locale()=='ru'">
            <p style="text-align: center;page-break-before: always;font-size: 14pt;"><strong>НАО «Евразийский национальный университет им. Л.Н.
            Гумилева»</strong></p>
            <p>&nbsp;</p>
            <p style="text-align: center;font-size: 14pt;"><strong>РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ</strong></p>
            <p style="text-align: center;font-size: 14pt;"><strong>претендентов на знание законодательства Республики Казахстан</strong></p>
            
            <p style="font-size: 14pt;"><strong>Место проведения</strong>: Евразийский национальный университет имени Л.Н. Гумилева (ул. Сатпаева, 2,
                ауд. 352)</p>
            <p style="font-size: 14pt;"><strong>Дата:</strong>&nbsp;{{currentDate}} г.</p>
            <p style="font-size: 14pt;"><strong>Время</strong>:&nbsp;{{currentTime}}</p>
            <p style="font-size: 14pt;"><strong>Группа</strong>: {{$i18n.locale()=='kz' ? currentGroup.groupName : currentGroup.groupNameRu}}</p>
         </div>
         
        <table border="1" style="border-collapse: collapse; text-align: center;">
            <tr>
                <td rowspan="2" style="min-width: 180;" width="180">
                    <p><strong>Аты-жөні</strong></p>
                </td>
                
                <td style="min-width: 150;" v-for="(r,ri) in reports[0].details" :key="ri">
                    <p><strong>{{$i18n.locale()=='kz' ? r.cat_name : r.cat_name_ru}}</strong></p>
                </td>

                <td rowspan="2" style="min-width: 90;" width="90">
                    <p><strong>Группа</strong></p>
                </td>
                <td rowspan="2" style="min-width: 90;" width="90">
                    <p><strong>{{$t('examResult')}}</strong></p>
                </td>
                <td rowspan="2" style="min-width: 90;" width="90">
                    <p><strong>{{$t('examDate')}}</strong></p>
                </td>
            </tr>
            <tr>    
                <td width="132" v-for="(r,ri) in reports[0].details" :key="ri">
                    <p><strong>{{parseInt(ri)+1}}</strong></p>
                </td>
                
            </tr>
            <tbody v-for="(m,rIndex) in reports" :key="rIndex">
                <tr style="height: 100;">
                    <td  width="208">{{m.userInfo}}</td>
                    <td width="132" v-for="(r,ri) in m.details" :key="ri">&nbsp;{{r.maximum+' / '+r.correct}}</td>
                    <td  width="208">{{m.group}}</td>
                    <td  width="208">{{m.isPassed==1 ? $t('examPassed') : $t('examNotPassed')}}</td>
                    <td  width="208">{{examDate=="Invalid date" ? '--' :examDate}}</td>
                </tr>
            </tbody>
        </table>
        <p style="text-align: center;">&nbsp;</p>
        <p>&nbsp;</p>          
     </b-col>
        <b-col lg="12">
            <b-button variant="outline-success" @click="printReport" class="mt-3 w-25 float-right">Print</b-button>
        </b-col>
    </b-row>
</template>

<script>
const moment = require('moment')
export default {
    
    name:"ReportList",
    props:['reports','currentGroup','examDate'],
    methods:{
        printReport(){
            this.$htmlToPaper('printContainer');
            //this.PrintDiv('printContainer');
        }    
    },
    computed:{
        currentDate:function(){
            return moment(new Date()).format('DD.MM.YYYY');
        },
        currentTime:function(){
            return moment(new Date()).format('HH:mm');
        }
    }
}
</script>

<style scoped>
    @media print {
        @page {
            size: landscape;
        }
    }
</style>