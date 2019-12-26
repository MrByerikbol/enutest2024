import Vue from 'vue';
import Router from 'vue-router';
//components
import Full from '@/containers/Full';
import Login from '@/components/Login';
import Deliveries from '@/components/Deliveries';

import Users from '@/components/Users';
import Shops from '@/components/Shops';
import Products from '@/components/Products';
import NewDelivery from '@/components/NewDelivery';
import Calculation from '@/components/Calculation';
import WareHouse from '@/components/WareHouse';
import DeliveryWareHouse from '@/components/DeliveryWareHouse';
import DeliveryReport from '@/components/DeliveryReport';

Vue.use(Router);
export default new Router({
   
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: Login,
        },
        {
            path: '/',
            redirect: '/deliveries',
            name: 'Delivery',
            component: Full,
            children: [
                {
                    path: 'deliveries',
                    name: 'Deliveries',
                    component: Deliveries,
                    meta:{requiresAuth:true}
                },
                {
                    path: '/newdelivery',
                    name: 'NewDelivery',
                    component: NewDelivery,
                    meta:{requiresAuth:true}
                },
                {
                    path: '/users',
                    name: 'Users',
                    component: Users,
                    meta:{requiresAuth:true}
                },
                {
                    path: '/shops',
                    name: 'Shops',
                    component: Shops,
                    meta:{requiresAuth:true}
                },
                {
                    path: '/products',
                    name: 'Products',
                    component: Products,
                    meta:{requiresAuth:true}
                },
                {
                    path: '/calculation',
                    name: 'Calculation',
                    component: Calculation,
                    meta:{requiresAuth:true}
                },
                {
                    path: '/warehouse',
                    name: 'WareHouse',
                    component: WareHouse,
                    meta:{requiresAuth:true}
                },
                {
                    path: '/deliverywarehouse',
                    name: 'DeliveryWareHouse',
                    component: DeliveryWareHouse,
                    meta:{requiresAuth:true}
                },
                {
                    path: '/deliveryreport',
                    name: 'DeliveryReport',
                    component: DeliveryReport,
                    meta:{requiresAuth:true}
                }
                
            ]
        }
    ]
})