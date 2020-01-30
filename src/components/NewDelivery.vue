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
                        <b-col sm="auto" md="2" lg="2" >
                            <label class="mr-sm-2" >
                               <small> Төрөл </small>
                            </label>
                            <select
                                    @change="findProduct(index)"
                                    v-model="choosenProducts[index].catId"
                                     class="d-block small-font" style="width:100% !important;"
                                >
                                <option value=0 >-- сонгох --</option>
                                <option  v-for="(option,catIndex)
                                     in productCats" v-bind:value=option.catId :key="catIndex">
                                    {{ option.catName}}
                                </option>
                            </select>
                        </b-col>
                        <b-col sm="auto" md="2" lg="2">
                            <label class="mr-sm-2">
                                <small>Өнгө</small>
                            </label>
                            <select
                                   @change="findProduct(index)"
                                    :disabled="choosenProducts[index].catId &&
                                        choosenProducts[index].catId>0 ? false : true"
                                    v-model="choosenProducts[index].colorId"
                                    class="d-block small-font" style="width:100% !important;"
                                >
                                <option :value=0>-- сонгох --</option>
                                <option v-for="(option,colorIndex)
                                     in productColors" v-bind:value=option.id :key="colorIndex">
                                    {{ option.colorName}}
                                </option>
                            </select>
                        </b-col>
                        <b-col sm="auto" md="1" lg="1">
                            <label class="mr-sm-2">
                               <small> Хэмжээ </small>
                            </label>
                            <select
                                   @change="findProduct(index)"
                                    :disabled="choosenProducts[index].colorId &&
                                        choosenProducts[index].colorId>0 ? false : true"
                                    class="d-block xs-font" style="width:100% !important; height:25px;"
                                    v-model="choosenProducts[index].measureId"
                                >
                                <option value=0>--сонгох--</option>
                                <option v-for="(option,measureIndex)
                                     in filteredMeasures " v-bind:value=option.id :key="measureIndex">
                                    {{ option.measureName}}
                                </option>
                            </select>
                        </b-col>
                        <b-col sm="auto"  md="2" lg="2">
                            <label class="mr-sm-2" :for="'wareHouse'+index">
                                <small>Склад</small>
                            </label>
                            <select
                                class="d-block small-font" style="width:100% !important;"
                                :id="'wareHouse'+index"
                                :disabled="choosenProducts[index].measureId &&
                                        choosenProducts[index].measureId>0 ? false : true"
                                v-model="choosenProducts[index].wareHouseId">
                                
                                <option  value=0>--сонгох--</option>        
                                <option v-for="(w,index) in wareHouses" :key="index" :value="w.wareHouseId">
                                    {{w.wareHouseName}}
                                </option>
                                
                            ></select>
                        </b-col>
                        <b-col sm="auto" md="1" lg="1">
                            <label class="mr-sm-2" for="productPrice">
                                <small>Үнэ</small>
                            </label>
                            <input
                                class="d-block small-font" style="width:100% !important;height : 25px !important;"
                                id="productPrice"
                                v-model="choosenProducts[index].productPrice"
                                type="number"
                                disabled
                                required
                                
                            >
                        </b-col>
                        <b-col sm="auto"  md="1" lg="1">
                            <label class="mr-sm-2" for="productCount">
                                <small>Тоо</small>
                            </label>
                            <input
                                class="d-block small-font" style="width:100% !important;height : 25px !important;"
                                id="productCount"
                                v-model="choosenProducts[index].productCount"
                                type="number"
                                min="0"
                                @change="totalCalculation(index)"
                                required
                                :disabled="choosenProducts[index].wareHouseId &&
                                           choosenProducts[index].wareHouseId>0 ? false : true"
                            />

                        </b-col>
                        <b-col sm="auto"  md="1" lg="1">
                            <label class="mr-sm-2" for="totalPrice">
                                <small>Нийт дүн</small>
                            </label>
                            <input
                                class="d-block small-font" style="width:100% !important;
                                                                  height : 25px !important;"
                                id="totalPrice"
                                v-model="choosenProducts[index].totalPrice"
                                type="number"
                                required
                                disabled
                            />
                        </b-col>
                        
                        <b-col sm="auto" md="2" lg="2" >
                             <b-form-row>
                                 
                                <b-col lg="2" class="text-right">
                                      <label class="mr-sm-2" :for="'pvh'+index" style="margin-bottom:0 !important;">
                                          <small>ПВХ</small>
                                      </label>
                                      <input 
                                       

                                        type="checkbox" 
                                        @change="hasRelDetail(index)"
                                        v-model="choosenProducts[index].hasRelDetail" :id="'pvh'+index"  class="form-control float-right">
                                 </b-col>
                                 
                                 <b-col lg="3" class="mt-4 pt-2 text-right">
                                     
                                     
                                     <strong  v-if="choosenProducts[index].wareHouseId 
                                         && choosenProducts[index].deliveryProductId &&
                                         choosenProducts[index].wareHouseId>0 
                                         && choosenProducts[index].deliveryProductId>0">
                                        
                                         <span :class="{'text-danger':(lastBalance(
                                                    
                                                    choosenProducts[index].wareHouseId, 
                                                    choosenProducts[index].deliveryProductId
                                                    ))<=0}">
                                                     {{lastBalance(
                                                        
                                                         choosenProducts[index].wareHouseId ,
                                                         choosenProducts[index].deliveryProductId
                                                    )}}
                                        </span>
                                    </strong>
                                 </b-col>
                                 <b-col lg="7" class="text-right pt-2">
                                     <b-button type="button" size="sm" class="mt-4" @click="removeProduct(index)" variant="danger">лист -</b-button>    
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
                                class="bg-info mx-2 mb-2 p-2">

                                <b-col lg="2">
                                    <label class="mr-sm-2" >
                                        <small>Өнгө</small>
                                    </label>
                                    <select
                                        @change="findPvh(index,r)"
                                        v-model="c.colorId"
                                        class="d-block small-font"

                                        style="width:100% !important;"
                                    >
                                        <option value=0>-- сонгох --</option>
                                        <option  v-for="(option,catIndex)
                                            in productColors" v-bind:value=option.id :key="catIndex">
                                            {{ option.colorName}}
                                        </option>
                                    </select>
                                </b-col>
                               
                                <b-col sm="auto" md="2" lg="2">
                                    <label class="mr-sm-2">
                                    <small> Хэмжээ </small>
                                    </label>
                                    <select
                                        @change="findPvh(index,r)"
                                            :disabled="c.colorId &&
                                                c.colorId>0 ? false : true"
                                            class="d-block small-font" style="width:100% !important;"
                                            v-model="c.measureId"
                                        >
                                        <option value=0>--сонгох--</option>
                                        <option v-for="(option,measureIndex)
                                            in filteredPvhMeasures " v-bind:value=option.id :key="measureIndex">
                                            {{ option.measureName}}
                                        </option>
                                    </select>
                                </b-col>
                                
                                <b-col sm="auto"  md="2" lg="2">
                                    <label class="mr-sm-2" :for="'wareHouse'+r+27">
                                        <small>Склад</small>
                                    </label>
                                    <select 
                                        class="d-block small-font" style="width:100% !important;"
                                        :id="'wareHouse'+r+27"
                                        :disabled="c.measureId &&
                                                c.measureId>0 ? false : true"
                                        v-model="c.wareHouseId">
                                        <option value=0>--сонгох--</option>
                                        <option v-for="(w,wx) in wareHouses" :key="wx" :value="w.wareHouseId">
                                            {{w.wareHouseName}}
                                        </option>
                                        
                                    ></select>
                                </b-col>
                                <!-- <b-col sm="auto" md="1" lg="1">
                                    <label class="mr-sm-2" for="productPrice">
                                        <small>Үнэ</small>
                                    </label>
                                    <input
                                        class="d-block small-font" style="width:100% !important;height : 25px !important;"
                                        id="productPrice"
                                        v-model="c.productPrice"
                                        type="number"
                                        disabled
                                        required
                                        
                                        >
                                </b-col> -->
                                <b-col sm="auto"  md="1" lg="1">
                                    <label class="mr-sm-2" for="productCount">
                                        <small>Тоо</small>
                                    </label>
                                    <input
                                        class="d-block small-font" style="width:100% !important;height : 25px !important;"
                                        id="productCount"
                                        v-model="c.productCount"
                                        type="number"
                                        min="0"
                                        @change="pvhTotalCalculation(index)"
                                        required
                                        :disabled="c.wareHouseId &&
                                                c.wareHouseId>0 ? false : true"
                                    />

                                </b-col>
                                <b-col sm="auto" md="2" lg="2"> 
                                    <b-form-row>
                                        <b-col sm="auto" md="6" lg="6">
                                            <label class="mr-sm-2" :for="'wareHouse'+r+27">
                                                <small>Наалт</small>
                                            </label>
                                            <select
                                                class="d-block small-font" style="width:100% !important;"
                                                @change="filterWorkPrices(index,r)"

                                                :disabled="c.productCount>0 &&
                                                        c.productPrice>0 ? false : true"
                                                v-model="c.isDirect">
                                                <option value=-1>--сонгох--</option>        
                                                <option value=1>
                                                    Прямой
                                                </option>
                                                <option value=0>
                                                    Обалный
                                                </option>
                                            ></select>
                                        </b-col>
                                        <b-col sm="auto" md="6" lg="6">
                                            <label class="mr-sm-2" :for="'wareHouse'+r+27">
                                                <small>Ажил</small>
                                            </label>
                                            <select
                                                @change="setWorkPrice(index,r)"
                                                class="d-block small-font" style="width:100% !important;"
                                                :disabled="c.isDirect==-1  ? true : false"
                                                v-model="c.workPriceId">
                                                <option value=0>--сонгох--</option>        
                                                <option v-for="(w,wi) in workFilteredPrices"  :key="wi" :value=w.id>
                                                    {{w.workName}}
                                                </option>
                                            </select>



                                        </b-col>
                                    </b-form-row>
                                </b-col>
                                <b-col sm="auto"  md="1" lg="1">
                                    <label class="mr-sm-2" for="totalPrice">
                                        <small>Нийт</small>
                                    </label>
                                    <input
                                        class="d-block small-font" style="width:100% !important;
                                                                        height : 25px !important;"
                                        id="totalPrice"
                                        v-model="c.totalPrice"
                                        type="number"
                                        required
                                        disabled
                                    />
                                </b-col>
                                
                                <b-col lg="1" class="mt-4 pt-3 text-right" 
                                    v-if="c.wareHouseId 
                                         && c.productId &&
                                         c.wareHouseId>0 
                                         && c.productId>0">
                                     
                                     
                                     <strong>
                                       
                                     
                                        <span :class="{'text-warning':lastBalance(c.wareHouseId, 
                                                    c.productId ) <=0}">
                                            {{lastBalance(c.wareHouseId , c.productId)}}
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
                            <!-- <label class="label-container text-danger">Зээлээр эсэх
                                <input @change="checkLoan(deliveryObject.userId,
                                    totalPriceOfOrder)" type="checkbox" v-model="deliveryObject.isLoan">
                                <span class="checkmark"></span>
                            </label>                          -->
                        </b-col>
                        
                         <b-col lg="10" class="text-right text-info font-weight-bold" style="text-decoration:underline !important;">
                            Захиалгын нийлбэр дүн : {{totalPriceOfOrder}}
                        </b-col>
                        
                        
                    </b-form-row>
                    <b-form-row>
                        <!-- <b-col lg="4">
                            <b-alert show variant="danger"  v-if="prematureList.length>0">
                                <h6>Татах шаардлагатай листүүд</h6> 
                                <hr>
                                <div v-for="(p,i) in prematureList" :key="i"    >
                                    <span v-if="lastBalance(p.wareHouseId,p.productId)<0 

                                        && productName(p.productId,'dbList')!=null">


                                       {{ productName(p.productId,'dbList')+':'}} 
                                       <span class="text-danger">{{lastBalance(p.wareHouseId,p.productId)}}</span>
                                    </span>
                                    

                                </div>
                            
                            </b-alert>
                        </b-col> -->
                        <b-col lg="4">
                            <!-- <b-alert show variant="warning"  v-if="prematurePvh.length>0">
                                <h6>Татах шаардлагатай пвх</h6> 
                                <hr>
                                <div v-for="(p,i) in prematurePvh" :key="i" >
                                    <span v-if="lastBalance(p.wareHouseId,p.productId)<0 
                                        && productName(p.productId,'pvh')!=null">
                                       {{ productName(p.productId,'pvh')+':'}} <span class="text-danger">{{lastBalance(p.wareHouseId,p.productId)}}</span>
                                    </span>
                                </div>                          
                            </b-alert> -->
                        </b-col>
                        <b-col lg="8" class="text-right">
                            <b-button type="submit" 
                                v-if="totalPriceOfOrder>0 && choosenProducts.length>0
                                    && deliveryObject.userId>0
                                    && mainOrderFormChecker && loanResult" 
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
    import {apiDomain,getHeader} from "../config/config";
    import {mapState ,mapGetters} from 'vuex';
    export default{
        name:'NewDelivery',

         data() {
            return {
                choosenProducts:[],
                loanResult : true,
                loanDbResult : {},
                userLoanForm:{
                    userId:0,
                    userLoan:1,
                    loanDescription:""
                },

                prematureList : [],
                prematurePvh:[],
                productColors : [],
                productMeasures : [],
                workPrices:[],
                productCats:[],
                filteredMeasures : [],
                filteredPvhMeasures:[],
                workFilteredPrices:[]
            }
        },
        methods: {
            getRefs(type){
                axios.get(apiDomain+'/admin/delivery/refs/'+type,{headers:getHeader()})
                    .then(response=>{
                        if(type==7){
                            this.productCats=response.data;
                        }
                        if(type==11){
                            this.productColors=response.data;
                        }
                        if(type==12){
                            this.productMeasures=response.data;
                        }
                        if(type==13){
                            this.workPrices=response.data;
                        }
                    })
                    .catch(error => {
                        alert(error.message);
                    }
                ) 
            },
            findProduct(index){
                let checker=this.choosenProducts[index];
                this.filteredMeasures=checker.catId>0 ? 
                    this.productMeasures.filter(p=>p.catId===checker.catId) : [];

                if(checker.catId==0 || checker.colorId == 0 || checker.measureId==0){
                    checker.productPrice=0;
                    checker.productCount=0;
                    checker.totalPrice = 0;
                    //herev turul songoogui bol
                    checker.catId==0 ? checker.colorId=0 : checker.colorId;
                    //herev ungu songoogui bol
                    checker.colorId==0 ? checker.measureId=0 : checker.measureId;
                    //herev hemjee songoogui bol
                    checker.measureId==0 ? checker.wareHouseId=0 : checker.wareHouseId;

                    return ;
                }
                //yag tuhain turuliin measure uudiig avah
                
                axios.post(apiDomain+'/admin/order/findproduct',{
                    'catId':checker.catId,
                    'colorId':checker.colorId,
                    'measureId':checker.measureId
                },{headers:getHeader()})
                .then((response)=>{
                    if(!response.data || response.data==null){
                        checker.productPrice=0;
                        checker.productCount=0;
                        checker.totalPrice = 0;

                        this.choosenProducts[index].deliveryProductId=0;
                        return ;
                    }
                    let rData = response.data;

                    this.choosenProducts[index].deliveryProductId=rData.id;
                    this.choosenProducts[index].productPrice=rData.productOutPrice;
                })
                .catch(error => {
                    //console.log(error.message)
                    this.$bvToast.toast(error.message, {
                        title: 'Алдааны мэдээлэл',
                        autoHideDelay: 5000
                    })
                }) 
            },
            findPvh(index,r){
                //alert("now it will search the pvh");
                let checker=this.choosenProducts[index].relDetails[r];
                this.filteredPvhMeasures=checker.colorId>0 ? 
                    this.productMeasures.filter(p=>p.catName==='PVH') : [];
                if(checker.colorId == 0 || checker.measureId==0){
                    checker.productPrice=0;
                    checker.productCount=0;
                    checker.totalPrice = 0;
                   
                    //herev ungu songoogui bol
                    checker.colorId==0 ? checker.measureId=0 : checker.measureId;
                    //herev hemjee songoogui bol
                    checker.measureId==0 ? checker.wareHouseId=0 : checker.wareHouseId;

                    return ;
                }
                axios.post(apiDomain+'/admin/order/findpvh',{
                    'colorId':checker.colorId,
                    'measureId':checker.measureId
                },{headers:getHeader()})
                .then((response)=>{
                    if(!response.data || response.data==null){
                        checker.productPrice=0;
                        checker.productCount=0;
                        checker.totalPrice = 0;
                        checker.productId=0;
                        return ;
                    }
                    let rData = response.data;
                    checker.productId=rData.id;
                    checker.productPrice=rData.productOutPrice;
                })
                .catch(error => {
                    //console.log(error.message)
                    this.$bvToast.toast(error.message, {
                        title: 'Алдааны мэдээлэл',
                        autoHideDelay: 5000
                    })
                }) 
            },
            filterWorkPrices(index,r){
                let pvh = this.choosenProducts[index].relDetails[r];
                
                if(parseInt(pvh.isDirect)==-1){
                    pvh.workPriceId=0;
                }
                //garaar shuud bichsen option value zaaval int ruu hurvuuleh 
                this.workFilteredPrices=this.workPrices.filter(w => parseInt(w.workTypeId)==parseInt(pvh.isDirect));
            },
            setWorkPrice(choosenIndex){
                
                let foundWorkPrice = this.workFilteredPrices[choosenIndex].workPrice;
                alert(foundWorkPrice);
            },
            getTotalPvh(){
                let totalPvh =0;
                for(let j = 0;j<this.choosenProducts.length;j++){
                    if(this.choosenProducts[j].relDetails){
                        for(let m = 0;m<this.choosenProducts[j].relDetails.length;m++){
                            totalPvh++;
                        }
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
                

                this.deleteFromPremateurePvh();

            },
             
            pvhTotalCalculation(c){
                c.totalPrice=c.productCount*c.productPrice;
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
               
               

                this.deleteFromPremateurePvh();
            },
            hasRelDetail(index){
                //alert("has pvh "+this.choosenProducts[index].hasRelDetail);
                let hasRelDetail = this.choosenProducts[index].hasRelDetail;
                
                if(hasRelDetail){
                   

                    this.choosenProducts[index].relDetails.push(
                        {  
                          catId:0,   
                          colorId:0,
                          measureId:0,
                          isDirect:-1,
                          workPriceId :0,
                          workPrice:0,
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
                

                 this.deleteFromPremateurePvh();

                 this.deleteFromPremateureList();
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
               
               
                this.deleteFromPremateureList();
            },
            addProductField(){
                 if(this.productCats.length==0){
                    this.getRefs(7);
                }
                if(this.productColors.length==0){
                    this.getRefs(11);
                }
                if(this.productMeasures.length==0){
                    this.getRefs(12);
                }
                if(this.workPrices.length==0){
                    this.getRefs(13);
                }

                this.choosenProducts.push(
                    {
                        catId:0,
                        colorId : 0,
                        measureId : 0,

                        deliveryProductId:null,
                        wareHouseId:0,
                        productPrice:0,
                        productCount:0,
                        totalPrice:0,
                        relId:0,
                        relDetails:[]
                    }
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

                        if(this.deliveryObject.isLoan===false){
                            this.deliveryObject.isLoan=0;
                        }
                        if(this.deliveryObject.isLoan===true){
                            this.deliveryObject.isLoan=1;
                        }
                        //this.deliveryObject.totalProductPrice=this.totalPriceOfOrder;
                        //this.deliveryObject.totalCash=this.totalPriceOfOrder;

                        axios.post(apiDomain+'/admin/order/postorder',this.deliveryObject,{headers:getHeader()})
                        .then(()=>{
                            //alert(response.data);
                            this.$bvToast.toast('Захиалага амжилттай үүслээ.', {
                                title: 'Амжилт',
                                autoHideDelay: 5000
                            });
                            this.prematureList=[];
                            this.prematurePvh=[];
                            this.$router.push({name:'Deliveries'});
                        })
                        .catch(error => {
                            //console.log(error.message)
                            this.$bvToast.toast(error.message, {
                                title: 'Алдааны мэдээлэл',
                                autoHideDelay: 5000
                            })
                        }) 
                    }
                    
                }
                else{
                    this.$bvToast.toast('Та хамгийн багадаа 1 бараа сонгох хэрэгтэй.', {
                        title: 'Анхааруулга',
                        autoHideDelay: 5000
                    });    
                }
                
            },

            totalCalculation(index){
                this.choosenProducts[index].totalPrice=
                    this.choosenProducts[index].productPrice*this.choosenProducts[index].productCount;
                    
            },

            onReset(evt) {
                evt.preventDefault()
               
            },
            deleteFromPremateureList(){
                if(this.choosenProducts.length==0){
                    for (let q = 0;q<this.prematureList.length;q++){
                        this.prematureList.splice(q,1);
                    }
                }

                let delIndexes;
                for (let r = 0;r<this.prematureList.length;r++){
                    let productId = this.prematureList[r].productId;
                    let wareHouseId = this.prematureList[r].wareHouseId;

                    let exist=false;
                    for (let t = 0;t<this.choosenProducts.length;t++){
                        if(this.choosenProducts[t].wareHouseId===wareHouseId
                            && this.choosenProducts[t].productId===productId){
                                exist=true;
                                break;
                        }
                    }
                    if(!exist){
                        delIndexes.push(r);
                    }
                }
                if(delIndexes.length>0){
                    for (let d = 0;d<delIndexes.length;d++){
                        this.prematureList.splice(parseInt(delIndexes[d]),1);
                    }
                    
                }
            },
            deleteFromPremateurePvh(){
                let delIndexes= [];
                for (let r = 0;r<this.prematurePvh.length;r++){
                    let productId = this.prematurePvh[r].productId;
                    let wareHouseId = this.prematurePvh[r].wareHouseId;

                    let exist=false;
                    for (let t = 0;t<this.choosenProducts.length;t++){
                        let details = this.choosenProducts[t].relDetails;
                        if(details){
                            for (let k = 0;k<details.length;k++){
                                if(details[k].wareHouseId===wareHouseId && 
                                    details[k].productId===productId){
                                        exist=true;
                                        break;
                                }
                            }
                        }
                        if(exist){
                            break;
                        }
                    }
                    if(!exist){
                        delIndexes.push(r);
                    }
                }
                if(delIndexes.length>0){
                    for (let d = 0;d<delIndexes.length;d++){
                        this.prematurePvh.splice(parseInt(delIndexes[d]),1);
                    }
                    
                }
            },
            getGivenProductCount(wareHouseId, productId) {
                let totalPrice = 0;
                for (let m =0 ;m<this.choosenProducts.length;m++){
                    if(this.choosenProducts[m].deliveryProductId===productId
                     && this.choosenProducts[m].wareHouseId===wareHouseId){
                        totalPrice=totalPrice+parseInt(this.choosenProducts[m].productCount);
                       
                        if(this.prematureList.length==0){
                            this.prematureList.push({"wareHouseId":wareHouseId, "productId":productId});
                        }
                        else{
                             let checker = 0;
                             for (let y = 0;y<this.prematureList.length;y++){
                                 if(this.prematureList[y].productId===productId){
                                     checker++;
                                 }
                             }
                             if(checker==0){
                                this.prematureList.push({"wareHouseId":wareHouseId, "productId":productId});    
                             }
                        }

                    }
                    
                    let detailProducts=this.choosenProducts[m].relDetails;
                    if(detailProducts){
                        for(let k = 0;k<detailProducts.length;k++){
                            if(detailProducts[k].productId===productId &&
                               detailProducts[k].wareHouseId===wareHouseId){
                                totalPrice=totalPrice+parseInt(detailProducts[k].productCount);
                                if(this.prematurePvh.length==0){
                                    this.prematurePvh.push({"wareHouseId":detailProducts[k].wareHouseId, "productId":productId});
                                }
                                else{
                                    let checker = 0;
                                    for (let y = 0;y<this.prematurePvh.length;y++){
                                        if(this.prematurePvh[y].wareHouseId===wareHouseId && this.prematurePvh[y].productId===productId){
                                            checker++;
                                        }
                                    }
                                    if(checker==0){
                                        this.prematurePvh.push({"wareHouseId":detailProducts[k].wareHouseId, "productId":productId});    
                                    }
                                }
                            }


                            
                        }
                    }
                    
                }
                
                return totalPrice;
            },
            getRegProduct(productId,type){
              
                if(type==='choosen'){
                    return element=>element.deliveryProductId===productId;
                }
                if(type==='dbList'){
                    return element=>element.value===productId;
                }
                if(type==='pvh'){
                    return element=>element.value===productId;
                }
                
            }
        },
        
        computed: {
            ...mapState([
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
                    if(detailProducts){
                        for(let k = 0;k<detailProducts.length;k++){
                            totalPrice=totalPrice+detailProducts[k].totalPrice;
                        }
                    }
                    
                }
                
                return totalPrice;
            },
           
            lastBalance:function(){
                
                return (wareHouseId,productId) => {
                    return this.getWareHouseProductBalance(wareHouseId,productId)-this.getGivenProductCount(wareHouseId,productId);  
                }
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
                
            },
            productName:function(){
                return (productId,pType)=>{
                    if(pType=='pvh'){
                         if(this.detailProducts.filter(this.getRegProduct(productId,pType)).length>0){
                             return this.detailProducts.filter(this.getRegProduct(productId,pType))[0].text    
                         }
                         else{
                            
                             return null;
                         }
                    }
                    else{
                        if(this.products.filter(this.getRegProduct(productId,pType)).length>0){
                            return this.products.filter(this.getRegProduct(productId,pType))[0].text    
                        }
                        else{
                            //alert("danda");
                            return null;
                        }
                    }
                }
            }
           
        }

    }
</script>
<style scoped>
  .small-font{
        font-size:90%;
        font-weight: 400 
   }
   .xs-font{
        font-size:80%;
        font-weight: 400 
   }
</style>