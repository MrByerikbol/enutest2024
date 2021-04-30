import Vue from 'vue';
import Router from 'vue-router';
//components
import Full from '@/containers/Full';
import Login from '@/components/Login';
import Users from '@/components/Users';
import AfterAuth from '@/components/AfterAuth';
import DocumentCategoryList from '@/components/enu/comps/DocumentCategoryList';
import TeacherDocList from '@/components/enu/comps/TeacherDocList';
import Home from '@/components/enu/landing/Home';
import StudentExamResult from '@/components/enu/landing/StudentExamResult';
import StudentExamResultRu from '@/components/enu/landing/StudentExamResultRu';
import ContactUs from '@/components/enu/landing/ContactUs';
import TeacherFillDoc from '@/components/enu/comps/TeacherFillDoc';
import TestCategoryList from '@/components/enu/comps/ttest/TestCategoryList';
import PTestCategoryList from '@/components/enu/comps/ptest/PTestCategoryList';
import Exam from '@/components/enu/comps/ttest/Exam';
import StudentExam from '@/components/enu/comps/ttest/StudentExam';
import PExam from '@/components/enu/comps/ptest/PExam';
import TestWelcome from '@/components/enu/comps/TestWelcome';
Vue.use(Router);
export default new Router({
   
    routes: [
        {
            
            path: '/login',
            name: 'Login',
            component: Login,

            children: [
                {
                    path: '/home',
                    name: 'Home',
                    component: Home
                },
                
               
                {
                    path: '/contactus',
                    name: 'ContactUs',

                    component: ContactUs
                },
            ]
        },
        {
            path: '/afterauth',
            name: 'AfterAuth',
            component: AfterAuth,
        },
        {
            path: '/stresult/:studentId',
            name: 'Stresult',
            component: StudentExamResult
        },
        {
            path: '/stresultru/:studentId',
            name: 'Stresultru',
            component: StudentExamResultRu
        },
        {
            path: '/',
            redirect: '/home',
            name: 'MainPage',
            component: Full,
            children: [
                {
                    path: '/users',
                    name: 'Users',
                    component: Users,
                    meta:{requiresAuth:true}
                },
                
                {
                    path: '/documentcategorylist',
                    name: 'DocumentCategoryList',
                    component: DocumentCategoryList,
                    meta:{requiresAuth:true}
                },
                {
                    path: '/teacherdoclist',
                    name: 'TeacherDocList',
                    component: TeacherDocList,
                    meta:{requiresAuth:true}
                },
                {
                    path: '/teacherfilldoc',
                    name: 'TeacherFillDoc',
                    component: TeacherFillDoc,
                    meta:{requiresAuth:true}
                },

                {
                    path: '/ttestref',
                    name: 'TestCategoryList',
                    component: TestCategoryList,
                    meta:{requiresAuth:true}
                },
                {
                    path: '/ptestref',
                    name: 'PTestCategoryList',
                    component: PTestCategoryList,
                    
                    meta:{requiresAuth:true}
                },
                {
                    path: '/exam',
                    name: 'Exam',
                    component: Exam,
                    meta:{requiresAuth:true}
                },
                {
                    path: '/pexam',
                    name: 'PExam',
                    component: PExam,
                    meta:{requiresAuth:true}
                },
                {
                    path: '/sexam',
                    name: 'StudentExam',
                    component: StudentExam,
                    meta:{requiresAuth:true}
                },
                {
                    path: '/testwelcome',
                    name: 'TestWelcome',
                    component: TestWelcome,
                    meta:{requiresAuth:true}
                }
            ]
        }
    ]
})