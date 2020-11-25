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
import ContactUs from '@/components/enu/landing/ContactUs';
import TeacherFillDoc from '@/components/enu/comps/TeacherFillDoc';
import TestCategoryList from '@/components/enu/comps/ttest/TestCategoryList';
import Exam from '@/components/enu/comps/ttest/Exam';
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
                    path: '/exam',
                    name: 'Exam',
                    component: Exam,
                    meta:{requiresAuth:true}
                }
            ]
        }
    ]
})