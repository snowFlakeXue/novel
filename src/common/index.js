let     toDouble = (item)=>{
    return item<10?'0'+item:item
}
export default{

    formateDate:(time)=>{
      if(!time) return '';
      let date = new Date(time);
      return date.getFullYear()+'-'+toDouble(date.getMonth()+1)+'-'+toDouble(date.getDate())+' '+toDouble(date.getHours())+':'+toDouble(date.getMinutes())+':'+toDouble(date.getSeconds());
     },
    pagination(data,callback){
        return{
            current:data.data.currentPage,
            pageSize:data.data.size,
            total:data.data.totalCount,
            onChange:(current)=>{
                callback(current)
            },
            showQuickJumper:true
        } 
    },
   resetPhone(phone) {
       console.log(1)
    var str = String(phone)
    var len = str.length;
    if (len >= 7) {
        var reg = str.slice(-7, -4)
        return str.replace(reg, "****")
    } 
}
}