<template>
  <div>
    <b-card title="Хүргэлтийн жагсаалт" bg-variant="light">
      <b-tabs pills card  v-model="tabIndex"  @input="dateFilter">
        <b-row class="mt-2">
          <b-col lg="3">
            <datepicker format="yyyy-MM-dd"
              :clear-button="true" @cleared="clearBegin" v-model="beginDate" placeholder="Эхлэх огноо"></datepicker>
          </b-col>
          <b-col lg="3">
            <datepicker format="yyyy-MM-dd" 
             :clear-button="true" @cleared="clearEnd" v-model="endDate" placeholder="Дуусах огноо"></datepicker>

          </b-col>
          <b-col lg="3" v-if="beginDate!=''">
            <b-button size="sm"  @click="doFilterByDate">Шүүх</b-button>

          </b-col>
        </b-row>
        <b-tab title="Шинэ"
           active>
          <b-card-text>
            <b-row>
              <b-col lg="8">
                <b-form-group
                  label="Хайлт"
                  label-cols-sm="1"
                  label-align-sm="left"
                  label-size="sm"
                  label-for="filterInput"
                  class="mb-2 mt-3"
                >
                  <b-input-group size="sm">
                    <b-form-input
                      v-model="filter"
                      type="search"
                      id="filterInput"
                      placeholder="Хайлт хийх утгаа оруулна уу"
                    ></b-form-input>
                    
                  </b-input-group>
                </b-form-group>
              </b-col>
              
              
              <b-col lg="4" class="pt-3 text-right">
                <strong>тоо:</strong> {{totalRows}}  
              </b-col>
              <b-table 
                responsive
                small 
                ref="newDeliveryTable"
                striped hover 
                :items="newDeliveryProvider" 
                :fields="fieldsNew"
                :busy.sync="isBusy"
                :current-page="currentPage"
                :per-page="perPage"
                :table-variant="tableVariant"
                :filter="filter"
                selected-variant="active"
                >
                <template slot="takeDelivery" slot-scope="row">
                  <center>
                    <b-button
                      size="sm"
                      v-b-tooltip.hover title="Энэ хүргэлтийг өөртөө авах" 
                      @click="takeDelivery(row.item.deliveryId)" 
                      class="text-left mt-1" variant="success">
                        +
                    </b-button>
                  </center>
                </template>
                <template slot="productInfo" slot-scope="row">
                  <!-- {{row.item}} -->
                  <b-button v-for="(product,index) in row.item.deliveryProducts" 
                    :key="index" size="sm" class="text-left mr-1 mt-1" variant="primary">
                      {{product.productName}} = <b-badge variant="light">{{product.productPrice}}₮ x {{product.productCount}} = {{product.totalPrice}}₮</b-badge>
                  </b-button>
                  <br>
                  <b-button size="sm" class="text-left mt-1" variant="danger">
                      Үүсгэсэн:<b-badge variant="light">{{row.item.createdUserName}}</b-badge><b-badge variant="light">{{row.item.createdDate}}</b-badge>
                      Хүргэлт:{{row.item.deliveryCost}}₮ Нийт:{{row.item.totalProductPrice + row.item.deliveryCost}}₮ 
                  </b-button>
                  
                </template>
                <template v-slot:table-busy>
                  <div class="text-center text-info my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Ачаалж байна...</strong>
                  </div>
                </template>
                <template slot="deliveryActions" slot-scope="row">
                  <center>
                    <b-button @click="editDelivery(row.item.deliveryId)" variant="outline-info" class="mr-1" size="sm" v-b-tooltip.hover title="Хувиарлах">
                      <font-awesome-icon icon="user-secret" />
                    </b-button>
                    <b-button @click="ignoreDelivery(row.item.deliveryId)" v-b-modal.descriptionModal variant="outline-danger" size="sm" v-b-tooltip.hover title="Цуцлах">
                      <font-awesome-icon icon="window-close" />
                    </b-button>
                  </center>
                </template>
              </b-table>
              <b-pagination
                  v-model="currentPage"
                  :total-rows="totalRows"
                  :per-page="perPage"
                  align="fill"
                  size="sm"
                  class="my-0"
                  
              ></b-pagination>
             </b-row>              
          </b-card-text>
        </b-tab>
        <b-tab title="Миний хүргэлт">
          <b-card-text>
            <b-row>
              <b-col lg="8">
                <b-form-group
                  label="Хайлт"
                  label-cols-sm="1"
                  label-align-sm="left"
                  label-size="sm"
                  label-for="filterInput"
                  class="mb-2 mt-3"
                >
                  <b-input-group size="sm">
                    <b-form-input
                      v-model="filterMine"
                      type="search"
                      id="filterInput"
                      placeholder="Хайлт хийх утгаа оруулна уу"
                    ></b-form-input>
                    
                  </b-input-group>
                </b-form-group>
              </b-col>
              <b-col lg="4" class="pt-3 text-right">
                <strong>тоо:</strong> {{totalRowsMine}}  
              </b-col>
                <b-table 
                  responsive
                  small 
                  ref="mineDeliveryTable"
                  striped hover 
                  :items="mineDeliveryProvider" 
                  :fields="fieldsNew"
                  :busy.sync="isBusy"
                  :current-page="currentPage"
                  :per-page="perPage"
                  :table-variant="tableVariant"
                  :filter="filterMine"
                  selected-variant="active"
                >
                  <template slot="takeDelivery" slot-scope="row">
                    <center>
                      <b-button
                        size="sm"
                        v-b-tooltip.hover title="Хүргэлт баталгаажуулах" 
                        @click="doneDelivery(row.item.deliveryId)" 
                        class="text-left mt-1" variant="success">
                          <font-awesome-icon icon="check" />
                      </b-button>
                    </center>  
                  </template>
                  <template slot="productInfo" slot-scope="row">
                    <!-- {{row.item}} -->
                    <b-button v-for="(product,index) in row.item.deliveryProducts" 
                      :key="index" size="sm" class="text-left mr-1 mt-1" variant="primary">
                        {{product.productName}} = <b-badge variant="light">{{product.productPrice}}₮ x {{product.productCount}} = {{product.totalPrice}}₮</b-badge>
                    </b-button>
                    <br>
                    <b-button size="sm" class="text-left mt-1" variant="danger">
                        Үүсгэсэн:  <b-badge variant="light">{{row.item.createdUserName}}</b-badge><b-badge variant="light">{{row.item.createdDate}}</b-badge>
                        Хүргэлт:{{row.item.deliveryCost}}₮ Нийт:{{row.item.totalProductPrice + row.item.deliveryCost}}₮ 
                    </b-button>
                    <br>
                    <b-badge variant="light">Хүргэгч: {{row.item.userName}}</b-badge>
                  </template>
                  <template v-slot:table-busy>
                    <div class="text-center text-info my-2">
                      <b-spinner class="align-middle"></b-spinner>
                      <strong>Ачаалж байна...</strong>
                    </div>
                  </template>
                  <template slot="deliveryActions" slot-scope="row">
                    <center>
                      <b-button @click="editDelivery(row.item.deliveryId)" variant="outline-info" class="mr-1" size="sm" v-b-tooltip.hover title="Хувиарлах">
                          <font-awesome-icon icon="user-secret" />
                        </b-button>
                      <b-button @click="ignoreDelivery(row.item.deliveryId)" variant="outline-danger" size="sm" v-b-tooltip.hover title="Цуцлах">
                        <font-awesome-icon icon="window-close" />
                      </b-button>
                    </center>
                  </template>
              </b-table>
              <b-pagination
                  v-model="currentPage"
                  :total-rows="totalRowsMine"
                  :per-page="perPage"
                  align="fill"
                  size="sm"
                  class="my-0"
                  
              ></b-pagination>
             </b-row>    
          </b-card-text>
        </b-tab>
        <b-tab title="Хүргэгдэсэн">
          <b-card-text>
            <b-row>
              <b-col lg="8">
                <b-form-group
                  label="Хайлт"
                  label-cols-sm="1"
                  label-align-sm="left"
                  label-size="sm"
                  label-for="filterInput"
                  class="mb-2 mt-3"
                >
                  <b-input-group size="sm">
                    <b-form-input
                      v-model="filterDone"
                      type="search"
                      id="filterInput"
                      placeholder="Хайлт хийх утгаа оруулна уу"
                    ></b-form-input>
                    
                  </b-input-group>
                </b-form-group>
              </b-col>
              <b-col lg="4" class="pt-3 text-right">
                <strong>тоо:</strong> {{totalRowsDone}}  
              </b-col>
                <b-table 
                  responsive
                  small 
                  ref="doneDeliveryTable"
                  striped hover 
                  :items="doneDeliveryProvider" 
                  :fields="fieldsOther"
                  :busy.sync="isBusy"
                  :current-page="currentPage"
                  :per-page="perPage"
                  :table-variant="tableVariant"
                  :filter="filterDone"
                  selected-variant="active"
                >
                  <template slot="productInfo" slot-scope="row">
                    <!-- {{row.item}} -->
                    <b-button v-for="(product,index) in row.item.deliveryProducts" 
                      :key="index" size="sm" class="text-left mr-1 mt-1" variant="primary">
                        {{product.productName}} = <b-badge variant="light">{{product.productPrice}}₮ x {{product.productCount}} = {{product.totalPrice}}₮</b-badge>
                    </b-button>
                    <br>
                    <b-button size="sm" class="text-left mt-1" variant="danger">
                        Үүсгэсэн:  <b-badge variant="light">{{row.item.createdUserName}}</b-badge><b-badge variant="light">{{row.item.createdDate}}</b-badge>
                        Хүргэлт:{{row.item.deliveryCost}}₮ Нийт:{{row.item.totalProductPrice + row.item.deliveryCost}}₮ 
                    </b-button>
                    <br>
                    <b-badge variant="light">Хүргэгч: {{row.item.userName}}</b-badge>
                  </template>
                  <template v-slot:table-busy>
                    <div class="text-center text-info my-2">
                      <b-spinner class="align-middle"></b-spinner>
                      <strong>Ачаалж байна...</strong>
                    </div>
                  </template>
              </b-table>
              <b-pagination
                  v-model="currentPage"
                  :total-rows="totalRowsDone"
                  :per-page="perPage"
                  align="fill"
                  size="sm"
                  class="my-0"
                  
              ></b-pagination>
             </b-row>   
          </b-card-text>
        </b-tab>
        <b-tab title="Цуцлагдсан">
          <b-card-text>
            <b-row>
              <b-col lg="8">
                <b-form-group
                  label="Хайлт"
                  label-cols-sm="1"
                  label-align-sm="left"
                  label-size="sm"
                  label-for="filterInput"
                  class="mb-2 mt-3"
                >
                  <b-input-group size="sm">
                    <b-form-input
                      v-model="filterIgnore"
                      type="search"
                      id="filterInput"
                      placeholder="Хайлт хийх утгаа оруулна уу"
                    ></b-form-input>
                    
                  </b-input-group>
                </b-form-group>
              </b-col>
              <b-col lg="4" class="pt-3 text-right">
                <strong>тоо:</strong> {{totalRowsIgnore}}  
              </b-col>
                <b-table 
                  responsive
                  small 
                  ref="ignoreDeliveryTable"
                  striped hover 
                  :items="ignoreDeliveryProvider" 
                  :fields="fieldsOther"
                  :busy.sync="isBusy"
                  :current-page="currentPage"
                  :per-page="perPage"
                  :table-variant="tableVariant"
                  :filter="filterIgnore"
                  selected-variant="active"
                >
                  <template slot="productInfo" slot-scope="row">
                    <!-- {{row.item}} -->
                    <b-button v-for="(product,index) in row.item.deliveryProducts" 
                      :key="index" size="sm" class="text-left mr-1 mt-1" variant="primary">
                        {{product.productName}} = <b-badge variant="light">{{product.productPrice}}₮ x {{product.productCount}} = {{product.totalPrice}}₮</b-badge>
                    </b-button>
                    <br>
                    <b-button size="sm" class="text-left mt-1" variant="danger">
                        Үүсгэсэн:  <b-badge variant="light">{{row.item.createdUserName}}</b-badge><b-badge variant="light">{{row.item.createdDate}}</b-badge>
                        Хүргэлт:{{row.item.deliveryCost}}₮ Нийт:{{row.item.totalProductPrice + row.item.deliveryCost}}₮ 
                    </b-button>
                    <br>
                    <p> <strong>Тайлбар :</strong> {{row.item.description}} </p>
                    
                    <b-badge variant="light">Хүргэгч: {{row.item.userName}}</b-badge>
                  </template>
                  <template v-slot:table-busy>
                    <div class="text-center text-info my-2">
                      <b-spinner class="align-middle"></b-spinner>
                      <strong>Ачаалж байна...</strong>
                    </div>
                  </template>
              </b-table>
              <b-pagination
                  v-model="currentPage"
                  :total-rows="totalRowsIgnore"
                  :per-page="perPage"
                  align="fill"
                  size="sm"
                  class="my-0"
                  
              ></b-pagination>
             </b-row>      
          </b-card-text>
        </b-tab>
      </b-tabs>
    </b-card>

     <b-modal id="descriptionModal" title="Цуцалсан тайлбар" hide-footer>
        <b-form v-on:submit.prevent="ignoreDeliveryFunction">
              <b-form-row class="mb-3">
                  <b-col sm="auto" md="12">
                      <label for="deliveryDescription">Тайлбар</label>
                      <b-form-textarea
                          id="deliveryDescription"
                          v-model="deliveryDescription"
                          required
                          placeholder="Та яагаад цуцалж байгаа тайлбар оруулна уу."
                      ></b-form-textarea>
                  </b-col>
              </b-form-row>
              <b-button type="submit" variant="primary" class="mr-2">Тайлбар оруулах</b-button>
              <b-button type="reset" variant="danger">Арилгах</b-button>
          </b-form>    
      </b-modal>


  </div>
</template>

<script>
import axios from 'axios';
import {apiDomain,getHeader} from "../config/config";
import {mapState,mapActions} from 'vuex';
import Datepicker from 'vuejs-datepicker';
const moment = require('moment')
require('moment/locale/es')
export default {
  name: 'Deliveries',
  components: {
    Datepicker
  },
  data(){
    return {
      fieldsNew: [
          { 
            key: 'takeDelivery',
            label: '',
            //thStyle: {vertical-align: 'middle'}
            
          },
          {
            key: 'productInfo',
            label: 'Барааны мэдээлэл',
            variant: 'warning'
           
          },
          {
            key: 'shopName',
            label: 'Гарах',
            variant: 'success'
          },
          {
            key: 'destinationOrg',
            label: 'Утас',
            variant: 'info'
          },
          {
            key: 'destinationOrgAddress',
            label: 'Хаяг',
            variant: 'info'
          },
          {
            key: 'deliveryActions',
            label: 'Үйлдэлүүд'
          }
      ],
    
      fieldsOther: [
         
          {
            key: 'productInfo',
            label: 'Барааны мэдээлэл',
            variant: 'warning'
           
          },
          {
            key: 'shopName',
            label: 'Гарах',
            variant: 'success'
          },
          {
            key: 'destinationOrg',
            label: 'Утас',
            variant: 'info'
          },
          {
            key: 'destinationOrgAddress',
            label: 'Хаяг',
            variant: 'info'
          }
      ],
      isBusy:false,
      totalRows:0,
      totalRowsMine:0,
      totalRowsIgnore:0,
      totalRowsDone:0,
      currentPage: 1,
      perPage: 20,
      tableVariant:'light',
      filter:"",
      filterMine:"",
      filterIgnore:"",
      filterDone:"",
      takeDisable:false,

      tabIndex:0,
      beginDate :"",
      endDate: "",

      deliveryDescription:""

    }
  },
  methods:{
    clearBegin(){
      this.beginDate="";
      this.doFilterByDate();
    },
    clearEnd(){
      this.endDate="";
      this.doFilterByDate();
    },

    dateFilter(index){
      this.tabIndex=index;
      this.beginDate="";
      this.endDate="";

    },
    doFilterByDate(){
      
      if(this.tabIndex==0){
        this.$refs.newDeliveryTable.refresh();
      }
      if(this.tabIndex==1){
         this.$refs.mineDeliveryTable.refresh();
      }
      if(this.tabIndex==2){
         this.$refs.doneDeliveryTable.refresh();
      }
      if(this.tabIndex==3){
         this.$refs.ignoreDeliveryTable.refresh();  
      }
    },
    takeDelivery(deliveryId){
      let warn = confirm("Та энэ хүргэлийг авхад итгэлтэй байна уу ?");
      if(warn){
        let result = this.hasRole("DELIVERY");
        if(result){
          axios.post(apiDomain+'/admin/delivery/takedelivery/',{delId:deliveryId},{headers:getHeader()})
          .then(response=>{
              //alert(response.data);
              let alertMsg = "Үйлдэл амжилттай хийгдлээ.";
              this.$bvToast.toast(alertMsg, {
                title: 'Алдаа',
                autoHideDelay: 5000
              })
              this.refreshTables();
          
          })
          .catch(error => {
              //console.log(error.message)
              this.$bvToast.toast(error.message, {
                  title: 'Алдаа',
                  autoHideDelay: 5000
              })
          })   
        }
        else{
          this.$bvToast.toast("Зөвхөн хүргэгчид энэ үйлдэлийг хийх боломжтой", {
              title: 'Алдааны мэдээлэл',
              autoHideDelay: 5000
          })  
        }
     
      }
      
    },
    ignoreDelivery(delId){
      this.deliveryId = delId;
      this.$bvModal.show('descriptionModal');
    },
    ignoreDeliveryFunction(){
      
      
      if(this.deliveryId>0 && this.deliveryDescription.trim().length>0){
         let warn = confirm("Та итгэлтэй байна уу ?");
         if(warn){
          let result = this.hasRole("ADMIN");
          let result1 = this.hasRole("MANAGER");
          let result2 = this.hasRole("OPERATOR");
          if(result || result1 || result2){

            if(this.deliveryDescription!="")
              this.changeStatus('ignore',this.deliveryId);
          }
          else{
            this.$bvToast.toast("Та энэ үйлдлийг хийх эрхгүй байна.", {
                title: 'Алдааны мэдээлэл',
                autoHideDelay: 5000
            })    
          }
        }
        this.$bvModal.hide('descriptionModal')
      }
      else{
        this.$bvToast.toast("Та тайлбар заавал оруулна уу.", {
            title: 'Алдааны мэдээлэл',
            autoHideDelay: 5000
        })    
      }
     
      
    },
    doneDelivery(delId){
      //alert(delId);
      let warn = confirm("Та итгэлтэй байна уу ?");
      if(warn){
        let result = this.hasRole("DELIVERY");
        let result1 = this.hasRole("MANAGER");
        let result2 = this.hasRole("ADMIN");

        if(result || result1 || result2){

          this.changeStatus('done',delId);
        }
        else{
          this.$bvToast.toast("Зөвхөн хүргэгчид энэ үйлдэлийг хийх боломжтой", {
              title: 'Алдааны мэдээлэл',
              autoHideDelay: 5000
          })  
        }
      }
    },
    ...mapActions([
        'setDeliveryFormObject',
    ]),

    editDelivery(pdeliveryId){
      //daraan margalgui hgeerei

      //  this.setDeliveryRefs(1);
      // this.setDeliveryRefs(2);
      // this.setDeliveryRefs(4);

      let reqData = {deliveryId:pdeliveryId};
      this.setDeliveryFormObject(reqData);
      this.$router.push({name:'NewDelivery'});
    },

    newDeliveryProvider(ctx){
        ctx.delType="new";
        if(this.beginDate!=""){
           ctx.beginDate=moment(this.beginDate).format('YYYY-MM-DD')
        }
        else{
          ctx.beginDate="";
        }
        if(this.endDate!=""){
           ctx.endDate=moment(this.endDate).format('YYYY-MM-DD')
        }
        else{
          ctx.endDate="";
        }
      
        this.isBusy = false
        let promise = axios.post(apiDomain+'/admin/delivery/newdeliverylist',ctx,{headers:getHeader()});
        return promise.then((response) => {
          const result = response.data;
          this.isBusy = false
          this.totalRows=result.totalRows;
          //alert(JSON.stringify(result));
          //console.log(result);

          return(result.deliveryies)
        }).catch(error => {
          this.isBusy = false
          return []
        })
    },
    mineDeliveryProvider(ctx){
        ctx.delType="mine"
        if(this.beginDate!=""){
           ctx.beginDate=moment(this.beginDate).format('YYYY-MM-DD')
        }
        else{
          ctx.beginDate="";
        }
        if(this.endDate!=""){
           ctx.endDate=moment(this.endDate).format('YYYY-MM-DD')
        }
        else{
          ctx.endDate="";
        }
        //alert("yes");
        this.isBusy = false
        let promise = axios.post(apiDomain+'/admin/delivery/newdeliverylist',ctx,{headers:getHeader()});
        return promise.then((response) => {
          const result = response.data;
          this.isBusy = false
          this.totalRowsMine=result.totalRows;
          //alert(JSON.stringify(result));
          //console.log(result);

          return(result.deliveryies)
        }).catch(error => {
          this.isBusy = false
          return []
        })
    },
    doneDeliveryProvider(ctx){
        ctx.delType="done"
        if(this.beginDate!=""){
           ctx.beginDate=moment(this.beginDate).format('YYYY-MM-DD')
        }
        else{
          ctx.beginDate="";
        }
        if(this.endDate!=""){
           ctx.endDate=moment(this.endDate).format('YYYY-MM-DD')
        }
        else{
          ctx.endDate="";
        }
        //alert("yes");
        this.isBusy = false
        let promise = axios.post(apiDomain+'/admin/delivery/newdeliverylist',ctx,{headers:getHeader()});
        return promise.then((response) => {
          const result = response.data;
          this.isBusy = false
          this.totalRowsDone=result.totalRows;
          //alert(JSON.stringify(result));
          //console.log(result);

          return(result.deliveryies)
        }).catch(error => {
          this.isBusy = false
          return []
        })
    },
    ignoreDeliveryProvider(ctx){
        ctx.delType="ignore"
        if(this.beginDate!=""){
           ctx.beginDate=moment(this.beginDate).format('YYYY-MM-DD')
        }
        else{
          ctx.beginDate="";
        }
        if(this.endDate!=""){
           ctx.endDate=moment(this.endDate).format('YYYY-MM-DD')
        }
        else{
          ctx.endDate="";
        }
        //alert("yes");
        this.isBusy = false
        let promise = axios.post(apiDomain+'/admin/delivery/newdeliverylist',ctx,{headers:getHeader()});
        return promise.then((response) => {
          const result = response.data;
          this.isBusy = false
          this.totalRowsIgnore=result.totalRows;
          //alert(JSON.stringify(result));
          //console.log(result);

          return(result.deliveryies)
        }).catch(error => {
          this.isBusy = false
          return []
        })
    },
    hasRole(roleName){
      let roleNames = this.loginedUser.roles;
     
      if(roleNames.length>0){
        //alert(JSON.stringify(roleNames));
        for(let r=0;r<roleNames.length;r++){
          
          if(roleNames[r].roleName===roleName){
            
            return true;
            
          }
        }
      }
      else{
        return false;
      }
      
    },
    changeStatus(type,delId){
       let jsonParam = null;
       if("ignore"===type){
         jsonParam = new Object();
         jsonParam.statusId=2;
         jsonParam.delId=delId;
       }
       if("done"===type){
         jsonParam = new Object();
         jsonParam.statusId=1;
         jsonParam.delId=delId;
       }
       if(jsonParam!=null){
         jsonParam.description=this.deliveryDescription;

         axios.post(apiDomain+'/admin/delivery/changestatus/',jsonParam,{headers:getHeader()})
        .then(response=>{
            let responseMsg=response.data;
            if(responseMsg=='norole'){
              this.$bvToast.toast("Та зөвхөн өөрийн оруулсан хүргэлт цуцлах боломжтой", {
                  title: 'Алдааны мэдээлэл',
                  autoHideDelay: 5000
              });
              this.deliveryDescription="";
              return ;

            }
            this.deliveryDescription="";
            let alertMsg = null;
            if("ignore"===type){
              alertMsg="Амжилттай цуцлагдлаа"
            }
            if("done"===type){
              alertMsg="Амжилттай хүргэлт хийгдлээ"
            }
            this.$bvToast.toast(alertMsg, {
              title: 'Алдаа',
              autoHideDelay: 5000
            });
            this.refreshTables();
        })
        .catch(error => {
            //console.log(error.message)
            this.$bvToast.toast(error.message, {
                title: 'Алдаа',
                autoHideDelay: 5000
            })
        }) 
       }
       
    },
    refreshTables(){
      this.$refs.ignoreDeliveryTable.refresh();
      this.$refs.doneDeliveryTable.refresh();
      this.$refs.mineDeliveryTable.refresh();
      this.$refs.newDeliveryTable.refresh();
      
    },
    
    
  },
  computed:{
    ...mapState([
        'loginedUser'
    ]),
  }
}
</script>

