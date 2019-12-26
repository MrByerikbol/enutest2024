<template>
    <b-row>
       <b-col lg="12">
        <h3>
          <span class="bd-content-title">Шинэ захиалага бүртгэх</span>
        </h3>
       </b-col>
        <b-col  sm="auto" xs="auto" lg="12" md="12">
            
            <b-card  bg-variant="light">

                <b-form @submit="onSubmit">
                    <b-form-row class="mb-3">
                        <b-col sm="auto" lg="12">
                            <label class="mr-sm-2" for="delshop">Клиент</label>
                            <b-form-row>
                                <b-col md="8" sm="8" lg="8">
                                    
                                    <select
                                        
                                        v-model="deliveryObject.userId"
                                        @change="checkLoan(deliveryObject.userId,
                                            totalPriceOfOrder)"
                                        class="form-control"
                                    >
                                        <option value=0>--- Захиалага өгсөн клиент сонгох ---</option>
                                        <option v-for="(u,index) in users" :key="index" :value="u.value">
                                            {{'Овог : ' + u.text+ ' --- > ' +' Нэр : ' +u.lastName + ' --- >' +' Утас : ' + u.phoneNumber}}
                                        </option>
                                    </select>
                                </b-col>
                                <b-col v-if="deliveryObject.userId>0"  md="2" sm="12" lg="2" class="text-right pt-2">
                                    <span class="text-secondary"> ЛИСТ :  <strong>
                                       {{choosenProducts.length}}</strong></span>
                                    <span class="text-secondary pl-2"> ПВХ :  <strong>
                                       {{getTotalPvh()}}</strong></span>       
                                </b-col>
                                <b-col v-if="deliveryObject.userId>0"  md="2" sm="12" lg="2" class="text-right">
                                    <b-button type="button" @click="addProductField" variant="info">ЛИСТ +</b-button>
                                </b-col>
                            </b-form-row>
                        </b-col>
                    </b-form-row>

                    <b-form-row  v-show="choosenProducts.length>0" class="mb-3" 
                        v-for="(p,index) in choosenProducts" :key="index">
                        <b-col sm="auto" md="3" lg="3">
                            <label class="mr-sm-2" >Лист сонгох</label>
                            <select
                                    v-model="choosenProducts[index].deliveryProductId"
                                    @change="productChange(index)"
                                    class="form-control"
                                >
                                <option :value="null">--- Лист сонгох ---</option>
                                <option v-for="(option,productIndex)
                                     in products" v-bind:value="option.value" :key="productIndex">
                                    {{ option.text }}
                                </option>
                            </select>
                        </b-col>
                        <b-col sm="auto" md="2" lg="2">
                            <label class="mr-sm-2" for="productPrice">Нэгжийн үнэ</label>
                            <b-form-input
                                id="productPrice"
                                v-model="choosenProducts[index].productPrice"
                                type="number"
                                required
                                @change="totalCalculation(index)"
                            ></b-form-input>
                        </b-col>
                        <b-col sm="auto"  md="1" lg="1">
                            <label class="mr-sm-2" for="productCount">Тоо</label>
                            <b-form-input
                                id="productCount"
                                v-model="choosenProducts[index].productCount"
                                type="number"
                                min="1"
                                required
                                @change="totalCalculation(index)"
                            ></b-form-input>
                        </b-col>
                        <b-col sm="auto"  md="2" lg="2">
                            <label class="mr-sm-2" for="totalPrice">Нийт дүн</label>
                            <b-form-input
                                id="totalPrice"
                                v-model="choosenProducts[index].totalPrice"
                                type="number"
                                required
                                readonly
                            ></b-form-input>
                        </b-col>
                         <b-col sm="auto"  md="2" lg="2">
                            <label class="mr-sm-2" :for="'wareHouse'+index">Склад</label>
                            <select class="form-control"
                                :id="'wareHouse'+index"
                                v-model="choosenProducts[index].wareHouseId">

                                <option v-for="(w,index) in wareHouses" :key="index" :value="w.wareHouseId">
                                    {{w.wareHouseName}}
                                </option>
                                
                            ></select>
                        </b-col>
                        <b-col sm="auto" md="2" lg="2" >
                             <b-form-row>
                                 
                                  <b-col lg="2" class="text-right">
                                      <label class="mr-sm-2" :for="'pvh'+index">ПВХ</label>
                                      <input type="checkbox" 
                                        @change="hasRelDetail(index)"
                                        v-model="choosenProducts[index].hasRelDetail" :id="'pvh'+index" class="form-control float-right">
                                 </b-col>
                                 
                                 <b-col lg="3" class="mt-4 pt-3 text-right" 
                                    v-if="choosenProducts[index].wareHouseId 
                                         && choosenProducts[index].deliveryProductId &&
                                         choosenProducts[index].wareHouseId>0 
                                         && choosenProducts[index].deliveryProductId>0">
                                     
                                     
                                     <strong>
                                         <span :class="{'text-danger':(lastBalance(choosenProducts[index].wareHouseId, 
                                                    choosenProducts[index].deliveryProductId )
                                                    -choosenProducts[index].productCount)<=0}">

                                                     {{lastBalance(choosenProducts[index].wareHouseId , 
                                                    choosenProducts[index].deliveryProductId )
                                                    -choosenProducts[index].productCount}}

                                        </span>
                                    </strong>
                                 </b-col>
                                 <b-col lg="7" class="text-right pt-2">
                                     <b-button type="button" class="mt-4" @click="removeProduct(index)" variant="danger">лист -</b-button>    
                                 </b-col>
                             </b-form-row>
                             
                        </b-col>
                        <b-col lg="10" v-if="choosenProducts[index].hasRelDetail">
                            <b-form-row class="mt-3">
                                <b-col lg="6" class="pl-3">
                                   <span class="text-info"> ПВХ :  <strong>
                                       {{choosenProducts[index].relDetails.length}}</strong></span>
                                </b-col>
                                <b-col lg="6" class="text-right pb-3">
                                    <button type="button" @click="addPvh(index)" class="btn btn-sm btn-success">ПВХ +</button>
                                </b-col>
                            </b-form-row>
                        </b-col>
                        <b-col lg="12" v-if="choosenProducts[index].hasRelDetail">

                            <b-form-row 
                                v-for="(c,r) in choosenProducts[index].relDetails" :key="r+10000"
                                class="bg-secondary mx-2 mb-2 p-2">
                                <b-col lg="3">
                                    <label class="mr-sm-2" >ПВХ сонгох</label>
                                    <select
                                            v-model="c.productId"
                                            class="form-control input-sm"
                                            @change="pvhChange(c)"
                                        >
                                        <option value=0>--ПВХ сонгох--</option>
                                        <option v-for="(option,productIndex)
                                            in detailProducts" v-bind:value="option.value" :key="productIndex+2000">
                                            {{ option.text }}
                                        </option>
                                    </select>
                                </b-col>
                                <b-col lg="2">
                                    <label class="mr-sm-2" >Нэгжийн үнэ </label>
                                    <b-form-input
                                        type="number"
                                        required
                                        class="form-control"
                                        v-model="c.productPrice"
                                        @change="pvhTotalCalculation(c)"
                                    ></b-form-input>
                                </b-col>
                                <b-col sm="auto" md="1" lg="1">
                                    <label class="mr-sm-2" >Тоо</label>
                                    <b-form-input
                                        v-model="c.productCount"
                                        type="number"
                                        min="1"
                                        required
                                        @change="pvhTotalCalculation(c)"
                                    ></b-form-input>
                                </b-col>
                                <b-col sm="auto" md="2" lg="2">
                                    <label class="mr-sm-2" >Нийт дүн</label>
                                    <b-form-input
                                        
                                        v-model="c.totalPrice"
                                        type="number"
                                        required
                                        readonly
                                    ></b-form-input>
                                </b-col>
                                <b-col sm="auto"  md="2" lg="2">
                                    <label class="mr-sm-2" :for="'wareHouse'+r+27">Склад</label>
                                    <select class="form-control"
                                        :id="'wareHouse'+r+27"
                                        v-model="c.wareHouseId">

                                        <option v-for="(w,wx) in wareHouses" :key="wx" :value="w.wareHouseId">
                                            {{w.wareHouseName}}
                                        </option>
                                        
                                    ></select>
                                </b-col>
                                <b-col lg="1" class="mt-4 pt-3 text-right" 
                                    v-if="c.wareHouseId 
                                         && c.productId &&
                                         c.wareHouseId>0 
                                         && c.productId>0">
                                     
                                     
                                     <strong>
                                         <span :class="{'text-warning':(lastBalance(c.wareHouseId, 
                                                    c.productId )
                                                    -c.productCount)<=0}">
                                            {{lastBalance(c.wareHouseId , c.producId)-c.productCount}}
                                        </span>
                                    </strong>
                                 </b-col>
                                 <b-col lg="1" class="mt-3 pt-3 text-right">
                                     <button type="button" @click="removePvh(index,r)" class="btn btn-sm btn-warning">пвх -</button>
                                 </b-col>
                                 
                            </b-form-row>
                        </b-col>
                    </b-form-row>
                    <b-form-row class="py-3 " v-if="totalPriceOfOrder>0 && choosenProducts.length>0 && deliveryObject.userId>0">
                        <b-col lg="2">
                            <label class="label-container text-danger">Зээлээр эсэх
                                <input @change="checkLoan(deliveryObject.userId,
                                    totalPriceOfOrder)" type="checkbox" v-model="deliveryObject.isLoan">
                                <span class="checkmark"></span>
                            </label>                         
                        </b-col>
                        
                         <b-col lg="10" class="text-right text-info font-weight-bold" style="text-decoration:underline !important;">
                            Захиалгын нийлбэр дүн : {{totalPriceOfOrder}}
                        </b-col>
                        <b-col v-if="!loanResult" lg="12">
                            <b-form-row>
                                <b-col lg="3" class="pl-1 pb-2">
                                    Зээлийн хэжмээ: <strong>{{loanDbResult.loanLimit}}</strong>
                                </b-col>
                                <b-col lg="3" class="pl-2">
                                    Одоогийн зээл: <strong>{{loanDbResult.loanBalance}}</strong>
                                </b-col>
                                <b-col lg="3" class="pl-2">
                                    Боломжит зээл: <strong>{{loanDbResult.possibleLoan}}</strong>
                                </b-col>
                                <b-col lg="3" class="text-right text-danger font-italic" 
                                    style="text-decoration:underline !important;">
                                    Зээлийн хэтрэлт: <strong>{{totalPriceOfOrder-loanDbResult.possibleLoan}}</strong>
                                </b-col>
                            </b-form-row>
                        </b-col>
                        <b-col lg="12" v-if="!loanResult && loanDbResult.loanBalance>0" class="text-right">
                            <button type="button" class="btn btn-sm btn-secondary">
                                зээл төлөх
                            </button>
                        </b-col>
                    </b-form-row>
                    <b-form-row>
                        <b-col lg="12" class="text-right">
                            <b-button type="submit" 
                                v-if="totalPriceOfOrder>0 && choosenProducts.length>0
                                    && deliveryObject.userId>0 && mainOrderFormChecker && loanResult" 
                                variant="primary" class="mr-2">Листийн захиалага үүсгэх</b-button>
                            <b-button type="reset" variant="danger">Арилгах</b-button>
                        </b-col>
                    </b-form-row>

                </b-form>
                
            </b-card>
       
        </b-col>
    </b-row>    
</template>
<script>
    import axios from 'axios';
    import {apiDomain,loginUrl,getHeader} from "../config/config";
    import {mapActions,mapState ,mapGetters} from 'vuex';
    export default{
        name:'NewDelivery',

         data() {
            return {
                choosenProducts:[],
                loanResult : true,
                loanDbResult : {}
            }
        },
        methods: {
            checkLoan(userId,loan){
                try {
                    if(this.deliveryFormObject.isLoan){
                        axios.post(apiDomain+'/admin/order/checkloan',{
                        'userId':userId,
                        'userLoan':loan
                        },{headers:getHeader()})
                        .then(response=>{
                            //alert(JSON.stringify(response.data));   
                            if(!response.data.result){
                                this.loanResult=false;
                                this.loanDbResult=response.data;
                            }
                            else{
                                this.loanDbResult={};
                                this.loanResult=true;
                            }
                        })
                        .catch(error => {
                            //console.log(error.message)
                            this.$bvToast.toast(error.message, {
                                title: 'алдаа',
                                autoHideDelay: 5000
                            });
                            this.loanResult=false;
                        }) 
                    }
                    else{
                        this.loanResult=true;
                    }
                }
                catch(err){
                    alert(err.message);
                }  
            },
            getTotalPvh(){
                let totalPvh =0;
                for(let j = 0;j<this.choosenProducts.length;j++){
                    for(let m = 0;m<this.choosenProducts[j].relDetails.length;m++){
                        totalPvh++;
                    }
                }
                return totalPvh;
            },
            
            removePvh(index,r){
                let delIndex = parseInt(r);
                this.choosenProducts[index].relDetails.splice(delIndex,1);
                let leftPvh = this.choosenProducts[index].relDetails.length;
                if(leftPvh==0){
                    this.choosenProducts[index].hasRelDetail=false;

                }
                if(this.deliveryFormObject.isLoan){
                    this.checkLoan(this.deliveryFormObject.userId,this.totalPriceOfOrder);
                }
            },
            pvhTotalCalculation(c){
                c.totalPrice=c.productCount*c.productPrice;
                if(this.deliveryFormObject.isLoan){
                    this.checkLoan(this.deliveryFormObject.userId,this.totalPriceOfOrder);
                }
            },
            pvhChange(item){
               
                let productId=item.productId;
                
                let found =null;
                for(let i=0;i<this.detailProducts.length;i++){
                    if(this.detailProducts[i].value==productId){
                        found = this.detailProducts[i];
                    }
                }
                if(found!=null){
                    item.productPrice=found.productPrice;
                    item.productCount=1;
                    item.totalPrice=found.productPrice*1;
                }
                if(this.deliveryFormObject.isLoan){
                    this.checkLoan(this.deliveryFormObject.userId,this.totalPriceOfOrder);
                }
            },
            hasRelDetail(index){
                //alert("has pvh "+this.choosenProducts[index].hasRelDetail);
                let hasRelDetail = this.choosenProducts[index].hasRelDetail;
                
                if(hasRelDetail){
                   

                    this.choosenProducts[index].relDetails.push(
                        {   
                          detailId:0,
                          productId:0,
                          productPrice:0,
                          productCount:1,
                          totalPrice:0,
                          relId:0,
                          wareHouseId:0
                        });
                }
                else{
                     this.choosenProducts[index].relDetails=[];
                }
                if(this.deliveryFormObject.isLoan){
                    this.checkLoan(this.deliveryFormObject.userId,this.totalPriceOfOrder);
                }
            },
            addPvh(index){
                 this.choosenProducts[index].relDetails.push(
                        {   
                          detailId:0,
                          productId:0,
                          productPrice:0,
                          productCount:1,
                          totalPrice:0,
                          relId:0,
                          wareHouseId:0
                        });
            },
            removeProduct(index){
                this.choosenProducts.splice(index,1);
                if(this.choosenProducts.length==0){
                    this.deliveryFormObject.isLoan=false;
                    this.loanResult=true;
                    this.loanDbResult={};
                }
                if(this.deliveryFormObject.isLoan){
                    this.checkLoan(this.deliveryFormObject.userId,this.totalPriceOfOrder);
                }
            },
            productChange(item){
                let productId=this.choosenProducts[item].deliveryProductId;
                //alert(productId);
                let found =null;
                for(let i=0;i<this.products.length;i++){
                    if(this.products[i].value==productId){
                        found = this.products[i];
                    }
                }
                if(found!=null){
                    //alert("hotah" +setIndex);
                    this.choosenProducts[item].productPrice=found.productPrice;
                    this.choosenProducts[item].productCount=1;
                    this.choosenProducts[item].totalPrice=found.productPrice*1;
                }
                if(this.deliveryFormObject.isLoan){
                    this.checkLoan(this.deliveryFormObject.userId,this.totalPriceOfOrder);
                }
            },
            addProductField(){
                this.choosenProducts.push(
                    {deliveryProductId:null,wareHouseId:0,productPrice:0,productCount:1,totalPrice:0,relId:0,relDetails:[]}
                );
            },
            onSubmit(evt) {
                evt.preventDefault()
                if(this.choosenProducts.length>0){
                   
                    let looped = null;


                    for(let l=0;l<this.choosenProducts.length;l++){
                        let choosed=this.choosenProducts[l];
                        if(choosed.deliveryProductId==null 
                            || choosed.productPrice==0 || choosed.productCount==0
                            || choosed.totalPrice==0){
                            looped='error';    
                            break;
                        }
                        
                        
                    }
                    if(looped==='error'){
                        this.$bvToast.toast('Та барааны бүх талбаруудыг бөглөнө үү', {
                            title: 'Алдаа',
                            autoHideDelay: 5000
                        })
                    }
                    else{
                        this.deliveryObject.deliveryProducts=this.choosenProducts;
                        axios.post(apiDomain+'/admin/delivery/adddelivery/',this.deliveryObject,{headers:getHeader()})
                        .then(response=>{
                            //alert(response.data);
                            if(response.data=='norole'){
                                this.$bvToast.toast('Та энэ үйлдэлийг хийх эрхгүй', {
                                title: 'Алдаа',
                                autoHideDelay: 5000
                                })
                            }
                            if(response.data=='noOperatorRole'){
                                this.$bvToast.toast('Та зөвхөн өөрийн үүсгэсэн хүргэлт засах боломжтой', {
                                title: 'Алдаа',
                                autoHideDelay: 5000
                                })
                            }
                            if(response.data=='success'){
                                this.$router.push({name:'Deliveries'});
                                this.$bvToast.toast('Хүргэлт амжилттай үүслээ', {
                                title: 'Амжилт',
                                autoHideDelay: 5000
                                })
                            }
                            
                        })
                        .catch(error => {
                            //console.log(error.message)
                            this.$bvToast.toast(error.message, {
                                title: 'Амжилт',
                                autoHideDelay: 5000
                            })
                        }) 
                    }
                    
                }
                else{
                    this.$bvToast.toast('Та хамгийн багадаа 1 бараа сонгох хэрэгтэй.', {
                        title: 'Анхааруулга',
                        autoHideDelay: 5000
                    })    
                }
                
            },

            totalCalculation(index){
                this.choosenProducts[index].totalPrice=
                    this.choosenProducts[index].productPrice*this.choosenProducts[index].productCount;
                    if(this.deliveryFormObject.isLoan){
                        this.checkLoan(this.deliveryFormObject.userId,this.totalPriceOfOrder);
                    }
            },

            onReset(evt) {
                evt.preventDefault()
               
            }
            
        },
        computed: {
            ...mapState([
                'products',
                'detailProducts',
                'users',
                'deliveryFormObject',
                'wareHouses'
            ]),
            ...mapGetters(['getWareHouseProductBalance']),
            deliveryObject:{
                get:function(){
                    this.choosenProducts=[]; 
                    if(this.deliveryFormObject.deliveryProducts){
                        this.choosenProducts=this.deliveryFormObject.deliveryProducts;
                    }
                    
                    //alert(JSON.stringify(this.deliveryFormObject));
                    return this.deliveryFormObject 
                }        
            },
            totalPriceOfOrder : function(){
                let totalPrice = 0;
                for (let m =0 ;m<this.choosenProducts.length;m++){
                    totalPrice=totalPrice+this.choosenProducts[m].totalPrice;
                    let detailProducts=this.choosenProducts[m].relDetails;
                    for(let k = 0;k<detailProducts.length;k++){
                        totalPrice=totalPrice+detailProducts[k].totalPrice;
                    }
                }
                
                return totalPrice;
            },
            lastBalance:function(){
                return (wareHouseId,productId) => this.getWareHouseProductBalance(wareHouseId,productId);
            },
            mainOrderFormChecker : function(){
                let theResult = true;
                try {
                    for (let m =0 ;m<this.choosenProducts.length;m++){
                        let list = this.choosenProducts[m];
                        if(!list.deliveryProductId || parseInt(list.deliveryProductId)==0 || 
                            !list.totalPrice || parseInt(list.totalPrice)==0 
                            || !list.wareHouseId || parseInt(list.wareHouseId)==0 ){
                                return false;
                        }
                        let relDetails = list.relDetails;
                        for (let i = 0;i<relDetails.length;i++){
                            let detailList = relDetails[i];
                            if(!detailList.productId || parseInt(detailList.productId)==0 || 
                                !detailList.totalPrice || parseInt(detailList.totalPrice)==0 
                                || !detailList.wareHouseId || parseInt(detailList.wareHouseId)==0 ){
                                    return false;
                            }
                        }
                    }    
                    return theResult;
                }
                catch(err){
                    alert("form shalgaltiin aldaa ", err.message);
                    return false;
                }
                
            }
           
        }

    }
</script>
<style scoped>
    /* The container */
    .label-container {
        display: block;
        position: relative;
        padding-left: 35px;
        margin-bottom: 12px;
        cursor: pointer;
        font-size: 15px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    /* Hide the browser's default checkbox */
    .label-container input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
    }

    /* Create a custom checkbox */
    .checkmark {
        position: absolute;
        top: 0px;
        left: 0;
        height: 25px;
        width: 25px;
        background-color: #eee;
    }

    /* On mouse-over, add a grey background color */
    .label-container:hover input ~ .checkmark {
         background-color: #ccc;
    }

    /* When the checkbox is checked, add a blue background */
    .label-container input:checked ~ .checkmark {
        background-color: #dc3545;
    }

    /* Create the checkmark/indicator (hidden when not checked) */
    .checkmark:after {
        content: "";
        position: absolute;
        display: none;
    }

    /* Show the checkmark when checked */
    .label-container input:checked ~ .checkmark:after {
        display: block;
    }

    /* Style the checkmark/indicator */
    .label-container .checkmark:after {
        left: 10px;
        top: 6px;
        width: 5px;
        height: 10px;
        border: solid white;
        border-width: 0 3px 3px 0;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
    }
</style>