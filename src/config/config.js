export const  apiDomain = "https://localhost:443";
//export const apiDomain="";

export const loginUrl = apiDomain+"/oauth/token";
export const getHeader = function(){
  const tokenData = JSON.parse(window.localStorage.getItem("authUser"));
  if(tokenData){
    const headers= {
        'Accept':'application/json',
        'Authorization':'Bearer ' + tokenData.access_token
    }
    return headers;
  }
  else {
      return null;
  }
}
export const getXlsHeader = function(){
  const tokenData = JSON.parse(window.localStorage.getItem("authUser"));
  const headers= {
    'Accept': 'application/vnd.openxmlformats-officedocument'
           + '.spreadsheetml.sheet',

    'Authorization':'Bearer ' + tokenData.access_token
  }
  return headers;
}
export const getMultipartHeader = function (){
  const tokenData = JSON.parse(window.localStorage.getItem("authUser"));
  
  const headers= {
    'Accpet': 'application/json',
    'Content-Type': 'multipart/form-data',
    'Authorization':'Bearer ' + tokenData.access_token
  }
  return headers;

}

export const testFunction= function(){
  //alert("");
  // let u go main test 
  //console.log("ene bol busgui chini");  
}
