<template>
    <div class="row">
         <b-modal 
            size="xl"
            
            id="privatePvhModal" 
            title="Кусок ПВХ бүртгэх"
            ref="privatePvhModal"
            @hide="onPrivatePvhModalHide"
            @show="onPrivatePvhShow"
            no-close-on-backdrop
            lazy
            hide-footer>

            <b-row>
                <b-col lg="12">
                    <b-form @submit="onSubmit">
                        <b-form-row class="mb-3">
                            <b-col sm="auto" lg="12">
                                <label class="mr-sm-2" for="delshop">
                                    Клиент
                                </label>
                                <b-form-row>
                                    <b-col md="6" sm="12" lg="6">
                                        
                                        <select
                                            v-model=kusokObject.userId
                                            class="form-control"
                                        >
                                            <option value=0>--- Захиалага өгсөн клиент сонгох ---</option>
                                            <option v-for="(u,index) in users" :key="index" :value=u.value>
                                                {{'Овог : ' + u.text+ ' --- > ' +' Нэр : ' +u.lastName + ' --- >' +' Утас : ' + u.phoneNumber}}
                                            </option>
                                        </select>
                                    </b-col>
                                    
                                    <b-col  md="3" sm="12" lg="3" class="text-right pt-2">
                                    
                                        <span class="text-secondary pl-2"> ПВХ :  
                                            <strong>
                                                {{getTotalPvh()}}мр
                                            </strong>
                                        </span>       
                                    </b-col>
                                    <b-col   md="3" sm="12" lg="3" class="text-right ">
                                        <b-button v-if="relDetails.length>0"  type="button" 
                                            block @click="formRefresher" variant="outline-primary">Шинэ кусок</b-button>
                                    </b-col>
                                </b-form-row>
                                <b-form-row class="pt-4">
                                    <b-col v-if="kusokObject.userId>0"  md="12" sm="12" lg="12" class="my-2 text-right">
                                        <b-button type="button" 
                                            block @click="addPvh" variant="outline-success">Кусок ПВХ +</b-button>
                                    </b-col>
                                </b-form-row>
                            </b-col>
                        </b-form-row>
                        <b-form-row 
                            v-for="(c,r) in relDetails" :key="r+10000"
                            class="bg-info mb-2 pb-2">
                            <b-col lg="12" class="text-right px-2 pt-2">
                                 
                                <b-icon v-if="c.isDone==0"
                                    @click="removePvh(r)" 
                                    style="cursor:pointer;" scale="2" 
                                    icon="x-circle" font-scale="1" variant="danger"></b-icon>
                               
                            </b-col>
                            <b-col lg="2">
                                <label class="mr-sm-2" >
                                    <small>Өнгө</small>
                                </label>
                                <select
                                    @change="findPvh(r)"
                                    v-model="c.colorId"
                                    class="d-block small-font"
                                    :disabled="c.isDone==2 ? true : false"
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
                                    @change="findPvh(r)"
                                        :disabled="c.isDone==2 ? true : c.colorId &&
                                            c.colorId>0 ? false : true"
                                        class="d-block small-font" style="width:100% !important;"
                                        v-model="c.measureId"
                                    >
                                    <option value=0>--сонгох--</option>
                                    <option v-for="(option,measureIndex)
                                        in productMeasures.filter(p=>p.catName==='PVH') " v-bind:value=option.id :key="measureIndex">
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
                                    @change="pvhWareHouseChange(r)"
                                    :disabled="c.isDone==2 ? true : c.measureId &&
                                            c.measureId>0 ? false : true"
                                    v-model=c.wareHouseId>
                                    <option value=0>--сонгох--</option>
                                    <option v-for="(w,wx) in wareHouses" :key="wx" :value="w.wareHouseId">
                                        {{w.wareHouseName}}
                                    </option>
                                    
                                ></select>
                            </b-col>
                            <b-col sm="auto"  md="1" lg="1">
                                <label class="mr-sm-2" >
                                    <small>Тоо</small>
                                </label>
                                <input
                                    class="d-block small-font" style="width:100% !important;height : 25px !important;"
                                   
                                    v-model="c.productCount"
                                    type="number"
                                    :min="c.doneCount"
                                    @change="pvhTotalCalculation(c)"
                                    required
                                    :disabled="c.isDone==2 ? true : c.wareHouseId &&
                                            c.wareHouseId>0 && c.productId>0 ? false : true"
                                />

                            </b-col>
                            <b-col sm="auto" md="3" lg="3"> 
                                <b-form-row>
                                    <b-col sm="auto" md="6" lg="6">
                                        <label class="mr-sm-2" :for="'wareHouse'+r+27">
                                            <small>Наалт</small>
                                        </label>
                                        <select
                                            class="d-block small-font" style="width:100% !important;"
                                            @change="filterWorkPrices(r)"

                                            :disabled="c.isDone==2 ? true : c.productCount==0 || c.wareHouseId==0 ? true : false"
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
                                            @change="setWorkPrice(r)"
                                            class="d-block small-font" style="width:100% !important;"
                                            :disabled="c.isDone==2 ? true : c.isDirect==-1  ? true : false"
                                            v-model="c.workPriceId">
                                            <option value=0>--сонгох--</option>        
                                            <option v-for="(w,wi) in workPrices.filter(w => parseInt(w.workTypeId)==parseInt(c.isDirect))"  :key="wi" :value=w.id>
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
                            
                            <b-col lg="1" class="mt-4 pt-2 text-right pr-2" 
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
                                
                                
                        </b-form-row>
                        <b-form-row class="py-3">
                            <b-col lg="12" class="text-right text-info font-weight-bold" style="text-decoration:underline !important;">
                                Кусок нийлбэр дүн : {{totalPriceOfKusokPvh}}
                            </b-col>
                        </b-form-row>
                        <b-form-row>
                             <b-col lg="4">
                                <b-alert show variant="warning"  v-if="prematurePvh.length>0">
                                    <h6>Татах шаардлагатай пвх</h6> 
                                    <hr>
                                    <div v-for="(p,i) in prematurePvh" :key="i" >
                                        <span v-if="lastBalance(p.wareHouseId,p.productId)<0 
                                            && productName(p.colorId,'pvh',p.measureId)!=null">

                                            {{ productName(p.colorId,'pvh',p.measureId)+':'}} 
                                            <span class="text-danger">
                                                {{lastBalance(p.wareHouseId,p.productId)}}
                                            </span>
                                        </span>
                                    </div>                          
                                </b-alert>
                            </b-col>
                            <b-col lg="8" class="text-right">
                                <b-button type="submit"  v-if="mainValidation"
                                    variant="primary" class="mr-2">Кусок ПВХ үүсгэх</b-button>
                                <b-button v-if="kusokObject.kusokId==0" type="reset" variant="danger">Арилгах</b-button>
                            </b-col>
                        </b-form-row>
                    </b-form>
                </b-col> 
                <b-col lg="12">
                    <PvhKusokList ref="kusokList" :editPvhKusokP="editPvhKusok"></PvhKusokList>
                </b-col>
            </b-row>
         </b-modal>
    </div>
</template>

<script>
    import axios from 'axios';
    import {apiDomain,getHeader} from "../config/config";
    import {mapState ,mapGetters,mapActions} from 'vuex';
    import PvhKusokList from './PvhKusokList';
    export default {
        name : "PrivatePvh",
        components:{PvhKusokList},
        data(){
            return {
                relDetails:[],
                prematurePvh:[]
            }
        },
        methods:{

            ...mapActions([
                'setDeliveryRefs',
                'setKusokFormObject',
            ]),

            formRefresher(){
                let reqData = {"pvhKusokId":0};
                this.setKusokFormObject(reqData);
                this.relDetails=[];
            },
           
            onSubmit(evt){
                
                evt.preventDefault()
                if(this.relDetails.length>0){
                    let looped = null;
                    for(let l=0;l<this.relDetails.length;l++){
                        let choosed=this.relDetails[l];
                        if(choosed.productId==null || choosed.productId==0 
                            || choosed.productCount==0
                            || choosed.totalPrice==0){
                            looped='error';    
                            break;
                        }
                    }
                    if(looped==='error'){
                        this.$bvToast.toast('Та барааны бүх талбаруудыг бөглөнө үү', {
                            title: 'Алдаа',
                            autoHideDelay: 5000,
                            variant:"danger"
                        })
                    }
                    else{
                        this.kusokFormObject.relDetails=this.relDetails;
                        axios.post(apiDomain+'/admin/order/postpvhkusok',
                            this.kusokFormObject,{headers:getHeader()})
                        .then(()=>{
                            
                            this.$bvToast.toast('Кусок ПВХ амжилттай үүслээ.', {
                                title: 'Амжилт',
                                autoHideDelay: 5000,
                                variant:"success"
                            });

                            this.formRefresher();
                            this.$refs.kusokList.tableRefresher(0);
                        })
                        .catch(error => {
                            //console.log(error.message)
                            this.$bvToast.toast(error.message, {
                                title: 'Алдааны мэдээлэл',
                                autoHideDelay: 5000,
                                danger:'danger'
                            })
                        }) 
                    }
                    
                }
                else{
                    this.$bvToast.toast('Та хамгийн багадаа 1 бараа сонгох хэрэгтэй.', {
                        title: 'Анхааруулга',
                        autoHideDelay: 5000,
                        variant:"danger"
                    });    
                }
            },
            filterWorkPrices(r){
                this.relDetails[r].workPriceId=0;
                //this.pvhTotalCalculation(this.choosenProducts[index].relDetails[r]);
                this.setWorkPrice(r);
            },
            setWorkPrice(r){
                let foundWorkPrice = 0;
                let workPriceId =this.relDetails[r].workPriceId;
                if(workPriceId==0){
                    this.relDetails[r].workPrice=0;
                    this.pvhTotalCalculation(this.relDetails[r]);
                    return ;
                }
                let filteredPrice = this.workPrices.filter(p => p.id===workPriceId);
                if(filteredPrice.length==1){
                    foundWorkPrice=filteredPrice[0].workPrice;    
                    //alert("this is very important "+foundWorkPrice);
                    if(foundWorkPrice && foundWorkPrice!=null)
                        this.relDetails[r].workPrice=foundWorkPrice;    
                }
                this.pvhTotalCalculation(this.relDetails[r]);
            },
            pvhTotalCalculation(c){
                if(Number(c.productCount)<Number(c.doneCount)){
                    this.$bvToast.toast(
                        "Та зүсэгдсэн ПВХ нуудыг хасах боломжгүй.",
                        {
                            title:"Алдааны мэдээлэл !!!",
                            variant:"danger"
                        }
                    );
                    //getpvhkusokprem
                    if(Number(c.detailId)>0){
                        axios.post(apiDomain+'/admin/order/getpvhkusokprem',{
                        'detailId':c.detailId,
                        },{headers:getHeader()})
                        .then((response)=>{
                            //alert(response.data);
                            c.productCount=response.data;
                        })
                        .catch(error => {
                            //console.log(error.message)
                            this.$bvToast.toast(error.message, {
                                title: 'Алдааны мэдээлэл',
                                autoHideDelay: 5000
                            })
                        });
                    }
                    return ;
                }
                c.totalPrice=0;
                c.totalPrice=(c.productCount*c.productPrice) + (c.workPrice*c.productCount);
            },
            pvhWareHouseChange(r){ 
                let currentRelDetail = this.relDetails[r];
                let isDirect = currentRelDetail.isDirect;
                currentRelDetail.isDirect=currentRelDetail.wareHouseId==0 ? -1 : isDirect;
            },
            findPvh(r){
                //alert("now it will search the pvh");
                let checker=this.relDetails[r];
               
                if(!checker.colorId || checker.colorId == 0 || 
                        !checker.measureId || checker.measureId==0){

                    checker.productPrice=0;
                    checker.productCount=0;
                    checker.totalPrice = 0;
                   
                    //herev ungu songoogui bol
                    checker.colorId==0 ? checker.measureId=0 : checker.measureId;
                    //herev hemjee songoogui bol
                    checker.measureId==0 ? checker.wareHouseId=0 : checker.wareHouseId;
                    //this.deleteFromPremateurePvh();
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
                        checker.workPrice = 0;
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
                });
                //this.deleteFromPremateurePvh();
            },
            addPvh(){
                 this.relDetails.push(
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
                        pvhKusokId:0,
                        wareHouseId:0,
                        isDone:0,
                        doneCount :0
                    }
                );
            },

            removePvh(r){
                if(this.relDetails[r].detailId 
                    && Number(this.relDetails[r].detailId>0)){
                    let warn = confirm("Та итгэлтэй байна уу ?");
                    let dbWarn = confirm("Та үнэхээр итгэлтэй байна уу ?");
                    if(warn && dbWarn){
                        let delIndexes = [];
                        let detailId = this.relDetails[r].detailId;
                        if(detailId && detailId!=null && Number(detailId)>0){
                            delIndexes.push({'detailId':detailId});    
                            if(delIndexes.length>0){
                                let delJSON = new Object();
                                delJSON.delIndexes = delIndexes;
                                axios.post(apiDomain+'/admin/order/deletepvh',
                                    delJSON,{headers:getHeader()})
                                .then(()=>{
                                    //alert(response.data);
                                    this.$bvToast.toast('Операция сәтті аяқталды.', {
                                        title: 'Амжилт',
                                        autoHideDelay: 5000,
                                        variant:"success"
                                    });
                                    
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
                    }
                    else{
                        return false;        
                    }
                    
                }
                
                
                
                let delIndex = parseInt(r);
                this.relDetails.splice(delIndex,1);
                
                this.deleteFromPremateurePvh();

            },
            getTotalPvh(){
                let totalPvh =0;
                if(this.relDetails){
                    for(let m = 0;m<this.relDetails.length;m++){
                        let colorId = this.relDetails[m].colorId;
                        let measureId = this.relDetails[m].measureId;
                        if(colorId && measureId && Number(colorId)>0 && Number(measureId)>0){
                            totalPvh=Number(totalPvh)+Number(this.relDetails[m].productCount);
                        }
                        
                    }
                }
                return totalPvh;
            },
            deleteFromPremateurePvh(){
                let delIndexes= [];
                for (let r = 0;r<this.prematurePvh.length;r++){
                    let productId = this.prematurePvh[r].productId;
                    let wareHouseId = this.prematurePvh[r].wareHouseId;
                    let exist=false;
                    let details = this.relDetails;
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
                let totalCount = 0;   
                let detailProducts=this.relDetails;

                if(detailProducts){
                    for(let k = 0;k<detailProducts.length;k++){
                        if(detailProducts[k].productId===productId &&
                            detailProducts[k].wareHouseId===wareHouseId){
                            totalCount=totalCount+parseInt(detailProducts[k].productCount);
                            if(this.prematurePvh.length==0){
                                this.prematurePvh.push({"colorId":detailProducts[k].colorId,"wareHouseId":detailProducts[k].wareHouseId, 
                                    "productId":productId,"measureId":detailProducts[k].measureId});
                            }
                            else{
                                let checker = 0;
                                for (let y = 0;y<this.prematurePvh.length;y++){
                                    if(this.prematurePvh[y].wareHouseId===wareHouseId && this.prematurePvh[y].productId===productId){
                                        checker++;
                                    }
                                }
                                if(checker==0){
                                    this.prematurePvh.push({"measureId":detailProducts[k].measureId,"colorId":detailProducts[k].colorId,"wareHouseId":detailProducts[k].wareHouseId, "productId":productId});    
                                }
                            }
                        }
                    }
                }
                    
                
                
                return totalCount;
            },

            onPrivatePvhShow(){
                this.relDetails=[];
                let reqData = {"pvhKusokId":0};
                this.setKusokFormObject(reqData);
                this.setDeliveryRefs(2);
                this.setDeliveryRefs(9);
                this.setDeliveryRefs(10);

                this.setDeliveryRefs(7);
                this.setDeliveryRefs(11);
                this.setDeliveryRefs(12);
                this.setDeliveryRefs(13);
                this.setDeliveryRefs(14);
            },
            editPvhKusok(kusokId){
                let reqData = {"pvhKusokId":kusokId};
                this.setKusokFormObject(reqData);
            },
            getRegProduct(colorId,type){
              
                if(type==='choosen'){
                    return element=>element.deliveryProductId===colorId;
                }
                else{
                    return element=>element.id===colorId;
                }
                
            }
        },
        computed: {
            mainValidation:function(){
                if(this.relDetails.length==0){
                    return false;
                }
                let f = this.relDetails.filter(element=>!element.totalPrice && Number(element.totalPrice)==0);
                return f.length==0 ? true : false;
            },
            totalPriceOfKusokPvh:function(){
                let totalPrice = Number(0);
                if(this.relDetails){
                    //ene hesegt aldaa garch magadgui 
                    for (let detail of this.relDetails){
                        if(detail.totalPrice && Number(detail.totalPrice)>0){
                            totalPrice=totalPrice+detail.totalPrice;
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
           
            ...mapState([
                    'users',
                    'kusokFormObject',
                    'wareHouses',
                    'productCats',
                    'productMeasures',
                    'productColors',
                    'workPrices'
                ]
            ),
            ...mapGetters(['getWareHouseProductBalance']),
            kusokObject:{
                get:function(){
                    this.relDetails=[]; 
                    if(this.kusokFormObject.relDetails){
                        this.relDetails=this.kusokFormObject.relDetails;
                    }
                    
                    
                    return this.kusokFormObject 
                }        
            },
            productName:function(){
                return (colorId,pType,measureId)=>{
                    if(pType=='pvh'){
                         if(this.productColors.filter(this.getRegProduct(colorId,pType)).length>0){
                             let ml = this.productMeasures.filter(m=> m.id ===measureId);
                             let measureName=null;
                             if(ml.length==1){
                                 measureName=ml[0].measureName;
                             }
                             return this.productColors.filter(this.getRegProduct(colorId,pType))[0].colorName + " " +measureName    
                         }
                         else{
                            
                             return null;
                         }
                    }
                    else{
                        if(this.productColors.filter(this.getRegProduct(colorId,pType,measureId)).length>0){
                            let ml = this.productMeasures.filter(m=> m.id===measureId);
                            let measureName=null;
                            if(ml.length==1){
                                measureName=ml[0].measureName;
                            }
                            return this.productColors.filter(this.getRegProduct(colorId,pType,measureId))[0].colorName + " " +measureName     
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