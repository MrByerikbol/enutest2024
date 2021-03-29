<template>
    <b-row>
        <b-col lg="12">
            <b-modal size="lg" id="studentRegForm" 
                :title="$t('userList.userModal')" hide-footer>
                <b-form v-on:submit.prevent="handleStudentReg">
                    <b-form-row class="mb-3">
                        
                        <b-col sm="auto" md="12">
                            <label for="lastName">{{$t('userList.lastName')}}</label>
                            <b-form-input
                                id="lastName"
                                v-model="userForm.lastName"
                                required
                                :placeholder="$t('userList.lastName')"
                            ></b-form-input>
                        </b-col>
                        <b-col sm="auto" md="12">
                            <label  for="firstName">{{$t('userList.firstName')}}</label>
                            <b-form-input
                                id="firstName"
                                v-model="userForm.firstName"
                                required
                                :placeholder="$t('userList.firstName')"
                            ></b-form-input>
                        </b-col>
                        <b-col sm="auto" md="12">
                            <label  for="thirdName">{{$t('enu.teacherForm.thirdName')}}</label>
                            <b-form-input
                                id="thirdName"
                                v-model="userForm.thirdName"
                                
                                :placeholder="$t('enu.teacherForm.thirdName')"
                            ></b-form-input>
                        </b-col>
                        <b-col sm="auto" md="12">
                            <label  for="userPhone">{{$t('userList.phoneNumber')}}</label>
                            <b-form-input
                                id="userPhone"
                                v-model="userForm.userPhone"
                                type="Text"
                                required
                                :placeholder="$t('userList.phoneNumber')"
                            ></b-form-input>
                        </b-col>
                        <b-col sm="auto" md="12">
                            <label  for="userEmail">{{$t('userList.email')}}</label>
                            <input
                                class="form-control"
                                id="userEmail"
                                v-model="userForm.userEmail"
                                type="email"
                                required
                                :placeholder="$t('userList.email')"
                            />
                        </b-col>
                        <b-col sm="auto" lg="12" md="12">
                            <label  for="passwordNumber">{{$t('enu.landing.teacherForm.regNumber')}}</label>
                            <b-form-input
                                id="passwordNumber"
                                v-model="userForm.passwordNumber"
                                type="text" pattern="\d*" maxlength="12"
                                required
                                :placeholder="$t('enu.landing.teacherForm.regNumber')"
                            ></b-form-input>
                        </b-col>

                        <b-col sm="auto" lg="12" md="12">
                            <label  for="studentPhoto">{{$t('studentPhoto')}}</label>
                            <b-form-file
                                class="mt-2"
                                size="sm"
                                
                                v-model="userForm.studentPhoto"
                                :state="Boolean(userForm.studentPhoto)"
                                :placeholder="$t('enu.teacherDocForm.chooseFile')"
                                :drop-placeholder="$t('enu.teacherDocForm.dropHere')"
                            ></b-form-file>  
                        </b-col>
                        <b-col sm="auto" lg="12" md="12">
                            <label  for="studentPassworPhoto">{{$t('studentPassworPhoto')}}</label>
                            <b-form-file
                                class="mt-2"
                                size="sm"
                                
                                v-model="userForm.studentPasswordPhoto"
                                :state="Boolean(userForm.studentPasswordPhoto)"
                                :placeholder="$t('enu.teacherDocForm.chooseFile')"
                                :drop-placeholder="$t('enu.teacherDocForm.dropHere')"
                            ></b-form-file>  
                        </b-col>
                        <b-col sm="auto" lg="12" md="12">
                            <label  for="studentEnt">{{$t('studentEnt')}}</label>
                            <b-form-file
                                class="mt-2"
                                size="sm"
                                
                                v-model="userForm.studentEnt"
                                :state="Boolean(userForm.studentEnt)"
                                :placeholder="$t('enu.teacherDocForm.chooseFile')"
                                :drop-placeholder="$t('enu.teacherDocForm.dropHere')"
                            ></b-form-file>  
                        </b-col>
                        <b-col sm="auto" md="12">
                            <label  for="userPassword">{{$t('userList.userForm.password')}}</label>
                            <b-form-input
                                id="userPassword"
                                v-model="userForm.userPassword"
                                type="password"
                                required
                                :placeholder="$t('userList.userForm.password')"
                            ></b-form-input>
                        </b-col>
                        <b-col sm="auto" md="12">
                            <label  for="reuserPassword">{{$t('enu.teacherForm.reEnterPassword')}}</label>
                            <b-form-input
                                id="reuserPassword"
                                v-model="userForm.reuserPassword"
                                type="password"
                                required
                                :placeholder="$t('enu.teacherForm.reEnterPassword')"
                            ></b-form-input>
                        </b-col>
                    </b-form-row>
                    <b-button type="submit"  variant="primary" class="mr-2">
                        {{$t('studentMakeRequest')}}
                    </b-button>
                    
                </b-form>    
            </b-modal>

             <b-modal size="lg"  ref="requestModal"
                :title="$t('studentMakeRequest')" hide-footer @shown="testBase">
                <div class="w-100" id="docContainer">
                    <div class=WordSection1>
                        <table class=MsoNormalTable border=1 cellspacing=0 cellpadding=0 align=left
                        width=694 style='width:520.75pt;border-collapse:collapse;border:none;
                        margin-left:6.75pt;margin-right:6.75pt'>
                        <tr style='height:36.6pt'>
                        <td width=294 valign=top style='width:220.15pt;border:none;border-bottom:
                        solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt;height:36.6pt'>
                        <p class=MsoNormal align=center style='text-align:center'><span lang=RU
                        style='font-size:10.0pt'>Л.Н.Гумилев атындағы Еуразия ұлттық университеті</span></p>
                        </td>
                        <td width=166 valign=top style='width:124.7pt;border:none;border-bottom:solid windowtext 1.0pt;
                        padding:0in 5.4pt 0in 5.4pt;height:36.6pt'>
                        <p class=MsoNormal align=center style='text-align:center'><span lang=RU>&nbsp;</span></p>
                        </td>
                        <td width=235 valign=top style='width:175.9pt;border:none;border-bottom:solid windowtext 1.0pt;
                        padding:0in 5.4pt 0in 5.4pt;height:36.6pt'>
                        <p class=MsoNormal align=center style='text-align:center'><span lang=RU
                        style='font-size:10.0pt'>Евразийский национальный университет имени
                        Л.Н.Гумилева</span></p>
                        </td>
                        </tr>
                        </table>



                        <p class=MsoNormal style='margin-left:269.35pt;text-align:justify'><b><span
                        lang=KZ>Қабылдау комиссияның төрағасы, Л.Н.Гумилев атындағы ЕҰУ ректоры</span></b></p>

                        <p class=MsoNormal style='margin-left:269.35pt;text-align:justify'><b><span
                        lang=KZ>Е.Б.Сыдықовқа/</span></b></p>

                        <p class=MsoNormal style='margin-left:269.35pt;text-align:justify'><b><span
                        lang=RU>Председателю</span></b><b><span lang=RU> </span><span lang=RU>приемной
                        комиссии,</span></b></p>

                        <p class=MsoNormal style='margin-left:269.35pt;text-align:justify'><b><span
                        lang=KZ>р</span><span lang=RU>ектору ЕНУ</span></b><b><span lang=RU> </span><span
                        lang=RU>им</span></b><b><span lang=KZ>. </span><span lang=RU>Л.Н.Гумилева</span></b></p>

                        <p class=MsoNormal style='margin-left:269.35pt;text-align:justify'><b><span
                        lang=KZ>Сыдыкову Е.Б.</span></b></p>

                        <p class=MsoNormal style='margin-left:269.35pt;text-align:justify'><span
                        lang=RU>&nbsp;</span></p>

                        <p class=MsoNormal style='text-align:justify'><span lang=KZ>&nbsp;</span></p>

                        <p class=MsoNormal style='text-align:justify'><span lang=KZ>&nbsp;</span></p>

                        <p class=MsoNormal style='text-align:justify'><span lang=RU>Азамат/азаматша/от
                        гр.<strong>{{getFullName}}</strong></span></p>

                        <p class=MsoNormal align=center style='text-align:center'><span lang=RU>                                            
                        </span><i><span lang=KZ style='font-size:10.0pt'>(ТАӘ/ФИО)</span></i></p>

                        <p class=MsoNormal><span lang=KZ>&nbsp;</span></p>

                        <p class=MsoNormal><span lang=KZ>&nbsp;</span></p>

                        <p class=MsoNormal align=center style='text-align:center'><b><span lang=KZ>ӨТІНІШ/ЗАЯВЛЕНИЕ</span></b></p>

                        <p class=MsoNormal style='text-align:justify'><span lang=KZ>&nbsp;</span></p>

                        <p class=MsoNormal style='text-align:justify;text-indent:35.45pt'><span
                        lang=KZ>Мені, «Педагогикалық ғылымдар»  білім беру саласы бойынша арнаулы
                        емтиханға жіберуіңізді сұраймын.</span></p>

                        <p class=MsoNormal style='text-align:justify;text-indent:35.45pt'><span
                        lang=RU>Прошу допустить меня на специальный экзамен по </span><span lang=KZ>области
                        образования «Педагогические науки».</span></p>

                        <p class=MsoNormal style='text-align:justify'><span lang=RU>&nbsp;</span></p>

                        <p class=MsoNormal><span lang=KZ>Байланыс мәліметтері</span><span lang=RU>/Контактные
                        данные: телефон <strong>{{getPhoneNumber}}</strong></span></p>

                        <p class=MsoNormal style='text-indent:35.45pt'><span lang=RU>&nbsp;</span></p>

                        <p class=MsoNormal style='text-indent:35.45pt'><span lang=RU>&nbsp;</span></p>

                        <p class=MsoNormal style='text-indent:35.45pt'><span lang=RU>&nbsp;</span></p>

                        <p class=MsoNormal style='text-align:justify'><span lang=KZ style='color:black'>Л.Н.Гумилев
                        атындағы ЕҰУ-нің қабылдау ережелерімен таныстым.</span></p>

                        <p class=MsoNormal style='text-align:justify'><span lang=RU>С правилами приема
                        в ЕНУ имени Л.Н.Гумилева  ознакомлен (а)</span><span lang=KZ>.</span><span
                        lang=RU>_______________________</span></p>

                        <p class=MsoNormal style='text-align:justify'><i><span lang=RU
                        style='font-size:10.0pt'>                                                                                               
                            </span></i><i><span lang=KZ style='font-size:10.0pt'>                  </span></i><i><span
                        lang=RU style='font-size:10.0pt'>  </span></i><i><span lang=KZ
                        style='font-size:10.0pt'>                              (қолы/подпись)</span></i></p>

                        <p class=MsoNormal><span lang=KZ>&nbsp;</span></p>

                        <p class=MsoNormal><span lang=KZ>Өзімнің жеке деректерімді жинауға, өңдеуге
                        және таратылуына келісемін.</span></p>

                        <p class=MsoNormal style='text-align:justify'><span lang=RU>На сбор, обработку
                        и распространение моих персональных данных согласен(а)______________</span></p>

                        <p class=MsoNormal style='text-align:justify'><i><span lang=RU
                        style='font-size:9.0pt'>                                                                                                
                                                                                                                    (қолы/подпись)</span></i></p>

                        <p class=MsoNormal><span lang=RU>&nbsp;</span></p>

                        <p class=MsoNormal><span lang=RU>Өтініш берілген күні/Дата подачи заявления <strong>{{getCurrentDate}}</strong> </span></p>

                        <p class=MsoNormal><span lang=RU>Оқуға түсушінің қолы/Подпись поступающего ______________________</span></p>

                        <p class=MsoNormal><span lang=RU style='font-size:11.0pt'>&nbsp;</span></p>

                        <p class=MsoNormal><span lang=RU style='font-size:11.0pt'>&nbsp;</span></p>

                        <p class=MsoNormal><b><span lang=RU style='font-size:11.0pt'>&nbsp;</span></b></p>

                        <p class=MsoNormal><b><span lang=RU style='font-size:11.0pt'>&nbsp;</span></b></p>

                        <p class=MsoNormal><b><span lang=RU style='font-size:11.0pt'>&nbsp;</span></b></p>

                        <p class=MsoNormal><b><span lang=RU style='font-size:11.0pt'>Техникалық
                        хатшының аты-жөні                                                                </span></b></p>

                        <p class=MsoNormal><b><span lang=RU>ФИО технического секретаря </span></b><b><span
                        lang=RU style='font-size:11.0pt'>____________________________________________________________</span></b></p>

                        <p class=MsoNormal style='text-align:justify'>
                            <i><span lang=RU style='font-size:10.0pt'>(қолы/подпись)</span></i></p>
                        <p class=MsoNormal style='text-align:justify'><b><span lang=RU>&nbsp;</span></b></p>

                    </div>
                </div>
              
            </b-modal>
        </b-col>
    </b-row>
</template>
<script>
    const moment = require('moment')
    export default {
        name:"StudentReg",
        data(){
            return{
                userForm:{
                    thirdName:"",
                    firstName :"",
                    lastName:"",
                    passwordNumber:"",
                    userPhone:"",
                    userEmail:"",
                    userPassword:"",
                    reuserPassword:"",

                    studentPhoto:null,
                    studentPasswordPhoto:null,
                    studentEnt:null
                }
            }
        },
        methods:{
            handleStudentReg(){
              
                this.$refs['requestModal'].show();
                
            },
            testBase(){
                let docContainer = document.getElementById('docContainer');
                let mainHtml = docContainer.innerHTML;
                let additionalStr = ` <html>
                    <head>
                        <!--
                            /* Font Definitions */
                            @font-face
                                {font-family:"Cambria Math";
                                panose-1:2 4 5 3 5 4 6 3 2 4;}
                            @font-face
                                {font-family:Calibri;
                                panose-1:2 15 5 2 2 2 4 3 2 4;}
                            @font-face
                                {font-family:Tahoma;
                                panose-1:2 11 6 4 3 5 4 4 2 4;}
                            /* Style Definitions */
                            p.MsoNormal, li.MsoNormal, div.MsoNormal
                                {margin:0in;
                                font-size:12.0pt;
                                font-family:"Times New Roman",serif;}
                            p.MsoFooter, li.MsoFooter, div.MsoFooter
                                {mso-style-link:"Footer Char";
                                margin:0in;
                                font-size:12.0pt;
                                font-family:"Times New Roman",serif;}
                            span.FooterChar
                                {mso-style-name:"Footer Char";
                                mso-style-link:Footer;
                                font-family:"Times New Roman",serif;}
                            /* Page Definitions */
                            @page WordSection1
                                {size:595.3pt 841.9pt;
                                margin:21.3pt 42.55pt 28.35pt 56.7pt;}
                            div.WordSection1
                                {page:WordSection1;}
                            /* List Definitions */
                            ol
                                {margin-bottom:0in;}
                            ul
                                {margin-bottom:0in;}
                            -->
                    </head>

                    <body lang=EN-US style='word-wrap:break-word'> `;

                let newHTML=additionalStr.concat(mainHtml).concat("</body></html>");

                
                console.log(newHTML);

                var encodedString =btoa(unescape(encodeURIComponent(newHTML)))

                console.info("=======BTOA========")
                console.log(encodedString);
                
                console.log("=====haitadan html hurdim======")
                var str2 = decodeURIComponent(escape(window.atob(encodedString)));

                console.log(str2);
                
                
            }
        },
        computed:{
            getFullName:function(){
                return this.userForm.thirdName + ' '+this.userForm.lastName + ' '+this.userForm.firstName
            },
            getPhoneNumber:function(){
                return this.userForm.userPhone;
            },
            getCurrentDate:function(){
                return moment(this.userForm.dateOfBirth).format('DD-MM-YYYY');
            }
        }
    }
</script>
<style scoped>
   
                        
    /* Font Definitions */
    @font-face
        {font-family:"Cambria Math";
        panose-1:2 4 5 3 5 4 6 3 2 4;}
    @font-face
        {font-family:Calibri;
        panose-1:2 15 5 2 2 2 4 3 2 4;}
    @font-face
        {font-family:Tahoma;
        panose-1:2 11 6 4 3 5 4 4 2 4;}
    /* Style Definitions */
    p.MsoNormal, li.MsoNormal, div.MsoNormal
        {margin:0in;
        font-size:12.0pt;
        font-family:"Times New Roman",serif;}
    p.MsoFooter, li.MsoFooter, div.MsoFooter
        {mso-style-link:"Footer Char";
        margin:0in;
        font-size:12.0pt;
        font-family:"Times New Roman",serif;}
    span.FooterChar
        {mso-style-name:"Footer Char";
        mso-style-link:Footer;
        font-family:"Times New Roman",serif;}
    /* Page Definitions */
    @page WordSection1
        {size:595.3pt 841.9pt;
        margin:21.3pt 42.55pt 28.35pt 56.7pt;}
    div.WordSection1
        {page:WordSection1;}
    /* List Definitions */
    ol
        {margin-bottom:0in;}
    ul
        {margin-bottom:0in;}
                    
                    
</style>