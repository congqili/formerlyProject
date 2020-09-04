class Request{
    get(url,data,formType){
      // 对get请求的封装
      return this.request('GET',url,data,formType)
    }
    put(url,data,formType){
      return this.request('PUT',url,data,formType)
    }
    delete(url,data,formType){
      return this.request('DELETE',url,data,formType)
    }
     post(url,data,formType){
       return this.request('POST',url,data,formType)
     }
     request(method,url,data,formType){
      return new Promise((resolve,reject)=>{
        var contentType = formType?'application/x-www-form-urlencoded':'application/json'
        //console.log(contentType)
        wx.request({
          url:url,
          method:method,
          data:data,
          header:{
            "Authorization":"Bearer "+ wx.getStorageSync('userToken'),
            "content-type":contentType
          },
          success(res){
            resolve(res.data)
          },
          fail(err){
            reject(err)
          }
        })
       })
     }
  }
  module.exports = new Request()
  /*
  get
  post 
  put 
  delete
  
  */ 