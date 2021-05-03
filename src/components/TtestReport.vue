<template>
    <b-row class="px-3" > 
     <!-- {{reports}}    -->
     <b-col lg="12" id="printContainer">
         <p style="padding:0;margin:0; text-align: center;font-size: 14pt;"><strong>«</strong><strong>Л.Н.
                Гумилев&nbsp;атындағы&nbsp;Еуразия&nbsp;ұлттық&nbsp;университеті»&nbsp;КеАҚ</strong></p>
        
        <p style="padding:0;margin:0; text-align: center;font-size: 14pt;">
            <strong>Профессорлық-оқытушылық құрамды</strong>
        </p>
        <p style="padding:0;margin:0; text-align: center;font-size: 14pt;"><strong>АТЕСТАТТАУ НӘТИЖЕЛЕРІ</strong></p>


        <p style="padding:0;margin:0; font-size: 14pt;"><strong>Өткізу орны:&nbsp;</strong>Л.Н.
            Гумилев&nbsp;атындағы&nbsp;Еуразия&nbsp;ұлттық&nbsp;университеті&nbsp;(Сәтпаев&nbsp;к-сі, 2, 352&nbsp;дәр.)</p>
        <p style="padding:0;margin:0; font-size: 14pt;"><strong>Күні</strong><strong>:</strong>&nbsp;<u>{{currentDate}}</u> ж.</p>
        <p style="padding:0;margin:0; font-size: 14pt;"><strong>Уақыты</strong>: {{currentTime}}</p>


<table border="1" style="border-collapse: collapse; text-align: center;">
    <tbody>
        <tr>
            <td rowspan="2" style="min-width: 180;" width="180">
                <p><strong>Аты-жөні</strong></p>
            </td>
            
            <td style="min-width: 150;" v-for="(r,ri) in reports" :key="ri">
                <p><strong>{{r.cat_name}}</strong></p>
            </td>
        </tr>
        <tr>
            <td width="132" v-for="(r,ri) in reports" :key="ri">
                <p><strong>{{parseInt(ri)+1}}</strong></p>
            </td>
            
        </tr>
        <tr style="height: 100;">
            <td  width="208">{{userInfo}}</td>
            <td width="132" v-for="(r,ri) in reports" :key="ri">&nbsp;{{r.maximum+' / '+r.correct}}</td>
        </tr>
    </tbody>
</table>
<p style="padding:0;margin:0;">&nbsp;</p>
<p style="padding:0;margin:0; text-align: center;font-size: 14pt;"><strong>Персонал&nbsp;басқармасының&nbsp;басшысы&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ж.Т. Жумабаева</strong></p>

<p style="text-align: center; font-size: 14pt;">Таныстырылды _______________ ________________________________</p>
<p style="text-align: center;font-size: 10pt;">Қолы&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
    &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Аты-жөні</p>
    <table border="1" style="border-collapse: collapse;">
        <tbody>
            <tr>
                <td>
                    <strong><span class="text-danger">Ескертпе:</span></strong>&nbsp;<strong>I топ</strong>&nbsp;(декандар, декан орынбасарлары, кафедра меңгерушілері)<br>
                    
                    <strong>Барлығы</strong><strong>&nbsp;6</strong><strong>0&nbsp;сұрақ</strong><strong>(120
                            минут),&nbsp;өту&nbsp;балл –&nbsp;</strong><strong>30</strong>
                </td>


                <td>
                    <strong><span class="text-danger">Ескертпе:</span></strong>&nbsp;<strong></strong><strong>II</strong><strong>&nbsp;топ</strong>(профессор-оқутышылар құрамы)<br>
                    
                    <strong>Барлығы </strong><strong>50 </strong><strong>сұрақ </strong><strong>(120
                            минут),&nbsp;өту&nbsp;балл -&nbsp;</strong><strong>25</strong>
                </td>
            </tr>
            <tr>
                <td>
                    <strong>1) </strong><strong>ҚР-ның Конституциясы</strong> &nbsp;(10&nbsp;сұрақ,&nbsp;төменгі&nbsp;шектік&nbsp;мәні&nbsp;5) 
                    
                    <br>
                    
                    <strong>2) </strong><strong>ҚР-ның «Білім туралы» Заңы</strong>&nbsp;Заңы(10&nbsp;сұрақ,&nbsp;төменгі&nbsp;шектік&nbsp;мәні&nbsp;5)
                    <br>
                    
                    <strong>3) </strong><strong>ҚР-ның «Ғылым туралы» Заңы</strong>(10&nbsp;сұрақ,&nbsp;төменгі&nbsp;шектік&nbsp;мәні&nbsp;5)<br>
                    
                    <strong>4) </strong><strong>ҚР-ның Еңбек кодексі</strong> (10&nbsp;сұрақ,&nbsp;төменгі&nbsp;шектік&nbsp;мәні&nbsp;5)<br>
                    
                    <strong>5) </strong><strong>Жоғары білім беру мен педагогика саласындағы менеджменттің негізгі принциптері</strong>(10&nbsp;сұрақ,&nbsp;төменгі&nbsp;шектік&nbsp;мәні&nbsp;5)<br>
                    <strong>6) </strong><strong>Цифрлық  дағдылар</strong> (10&nbsp;сұрақ,&nbsp;төменгі&nbsp;шектік&nbsp;мәні&nbsp;5)<br>
                </td>
                <td>
                    <strong>1) </strong><strong>ҚР-ның Конституциясы</strong>&nbsp;(10&nbsp;сұрақ,&nbsp;төменгі&nbsp;шектік&nbsp;мәні&nbsp;5)<br>
                    
                    <strong>2) </strong><strong>ҚР-ның «Білім туралы» Заңы</strong> (10&nbsp;сұрақ,&nbsp;төменгі&nbsp;шектік&nbsp;мәні&nbsp;5)<br>
                    
                    <strong>3) </strong><strong>ҚР-ның «Ғылым туралы» Заңы</strong>(10&nbsp;сұрақ,&nbsp;төменгі&nbsp;шектік&nbsp;мәні&nbsp;5)<br>
                    
                    <strong>4) </strong><strong>ҚР-ның Еңбек кодексі</strong>(10&nbsp;сұрақ,&nbsp;төменгі&nbsp;шектік&nbsp;мәні&nbsp;5)<br>
                    
                    <strong>5) </strong><strong>Цифрлық  дағдылар </strong>(10&nbsp;сұрақ,&nbsp;төменгі&nbsp;шектік&nbsp;мәні&nbsp;5)
                </td>
            </tr>
        </tbody>
    </table>


    <p style="padding:0;margin:0; text-align: center;page-break-before: always;font-size: 14pt;"><strong>НАО «Евразийский национальный университет им. Л.Н.
            Гумилева»</strong></p>
    <p style="padding:0;margin:0; text-align: center;font-size: 14pt;"><strong>РЕЗУЛЬТАТЫ АТТЕСТАЦИИ</strong></p>
    <p style="padding:0;margin:0; text-align: center;font-size: 14pt;"><strong>Профессорско-преподавательского состава</strong></p>
    
    <p style="padding:0;margin:0; font-size: 14pt;"><strong>Место проведения</strong>: Евразийский национальный университет имени Л.Н. Гумилева (ул. Сатпаева, 2,
        ауд. 352)</p>
    <p style="padding:0;margin:0; font-size: 14pt;"><strong>Дата:</strong>&nbsp;{{currentDate}} г.</p>
    <p style="padding:0;margin:0; font-size: 14pt;"><strong>Время</strong>:&nbsp;{{currentTime}}</p>


    <table border="1" style="border-collapse: collapse;text-align: center;">
        <tbody>
            <tr>
                <td rowspan="2" style="min-width: 180;" width="180">
                    <p><strong>ФИО</strong></p>
                </td>
                <td style="min-width: 150;" v-for="(r,ri) in reports" :key="ri">
                    <p><strong>{{r.cat_name_ru}}</strong></p>
                </td>
            </tr>
            <tr>
               <td width="132" v-for="(r,ri) in reports" :key="ri">
                    <p><strong>{{parseInt(ri)+1}}</strong></p>
                </td>
            </tr>
            <tr style="height: 100;">
                 <td  width="208">{{userInfo}}</td>
                 <td width="132" v-for="(r,ri) in reports" :key="ri">&nbsp;{{r.maximum+' / '+r.correct}}</td>
            </tr>
        </tbody>
    </table>

    <p style="padding:0;margin:0;">&nbsp;</p>
    
    <p style="padding:0;margin:0; text-align: center;font-size: 14pt;"><strong>Начальник Управления персоналом&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Ж.Т. Жумабаева</strong></p>
    <p style="padding:0;margin:0; text-align: center;font-size: 14pt;">&nbsp;</p>
    <p style="padding:0;margin:0; text-align: center;font-size: 14pt;">Ознакомлен (а) _______________ ________________________________</p>
    <p style="padding:0;margin:0; text-align: center;font-size: 10pt;">Подпись&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ФИО претендента</p>
    <p style="padding:0;margin:0;" >&nbsp;</p>
    
    <table border="1" style="border-collapse: collapse;">
        <tbody>
            <tr>
                <td style="width: 50%;">
                    <strong><span class="text-danger">Примечание:</span></strong>&nbsp;<strong>Группа 1</strong>&nbsp;Руководители структурных подразделений <br>
                    <strong>Всего</strong><strong>&nbsp;6</strong><strong>0 вопросов</strong><strong>(120 минут),
                            проходной
                            бал</strong><strong>л</strong><strong>&nbsp;–&nbsp;</strong><strong>3</strong><strong>0</strong>
                </td>
                <td>
                    <strong><span class="text-danger">Примечание:</span></strong>&nbsp;<strong>Группа&nbsp;</strong><strong>II</strong> Специалисты <br>
                    <strong>Всего</strong><strong>&nbsp;5</strong><strong>0 вопросов</strong><strong>(120 минут),
                            проходной бал</strong><strong>л</strong><strong>&nbsp;-&nbsp;</strong><strong>25</strong>
                </td>
            </tr>
            <tr>
                <td>
                    <strong>1) </strong><strong>Конституция Республики Казахстан</strong> &nbsp;(10&nbsp;вопросов,&nbsp;пороговое&nbsp;значение&nbsp;5) <br>
                    <strong>2) </strong><strong>Закон Республики Казахстан «Об образовании»</strong>&nbsp;Заңы(10&nbsp;вопросов,&nbsp;пороговое&nbsp;значение&nbsp;5) <br>
                    <strong>3) </strong><strong>Закон Республики Казахстан «О науке»</strong>(10&nbsp;вопросов,&nbsp;пороговое&nbsp;значение&nbsp;5)<br> 
                    <strong>4) </strong><strong>Трудовой Кодекс Республики Казахстан </strong> (10&nbsp;вопросов,&nbsp;пороговое&nbsp;значение&nbsp;5)<br> 
                    <strong>5) </strong><strong>Цифровые навыки</strong>(10&nbsp;вопросов,&nbsp;пороговое&nbsp;значение&nbsp;5)<br> 
                    <strong>6) </strong><strong>Основные принципы менеджмента в области образования и педагогики высшей школы</strong> (10&nbsp;вопросов,&nbsp;пороговое&nbsp;значение&nbsp;5)<br> 
                </td>
                <td>
                    <strong>1) </strong><strong>Конституция Республики Казахстан</strong> &nbsp;(10&nbsp;вопросов,&nbsp;пороговое&nbsp;значение&nbsp;5) <br>
                    <strong>2) </strong><strong>Закон Республики Казахстан «Об образовании»  </strong>&nbsp;Заңы(10&nbsp;вопросов,&nbsp;пороговое&nbsp;значение&nbsp;5) <br>
                    <strong>3) </strong><strong>Закон Республики Казахстан «О науке»</strong>(10&nbsp;вопросов,&nbsp;пороговое&nbsp;значение&nbsp;5)<br> 
                    <strong>4) </strong><strong>Трудовой Кодекс Республики Казахстан </strong> (10&nbsp;вопросов,&nbsp;пороговое&nbsp;значение&nbsp;5)<br> 
                    <strong>5) </strong><strong>Цифровые навыки</strong>(10&nbsp;вопросов,&nbsp;пороговое&nbsp;значение&nbsp;5)<br> 
                </td>
            </tr>
        </tbody>
    </table>
                    
     </b-col>
        <b-col lg="12">
            <b-button variant="outline-success" @click="PrintDiv('printContainer')" class="mt-3 w-25 float-right">Print</b-button>
        </b-col>
    </b-row>
</template>

<script>
const moment = require('moment')
export default {
    
    name:"TtestReport",
    props:['reports','userInfo'],
    methods:{
        PrintDiv(id) {
            var data=document.getElementById(id).innerHTML;
            var myWindow = window.open('', 'my div', 'height=400,width=600');
            myWindow.document.write('<html><head><title>my div</title>');
            /*optional stylesheet*/ //myWindow.document.write('<link rel="stylesheet" href="main.css" type="text/css" />');
            myWindow.document.write('</head><body >');
            myWindow.document.write(data);
            myWindow.document.write('</body></html>');
            myWindow.print();
            
            myWindow.close();
            myWindow.document.close(); // necessary for IE >= 10
            
            myWindow.onload=function(){ // necessary if the div contain images
                myWindow.focus(); // necessary for IE >= 10
                myWindow.print();
                myWindow.close();
            };
        },
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