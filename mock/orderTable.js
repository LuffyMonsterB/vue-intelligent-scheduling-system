const Mock = require('mockjs')

const orderList=Mock.mock({
  'items|5':[{
    orderCode:'@word(1)@integer(0,9)',
    'item|1':['产品A','产品B','产品C'],
    quantity:'@integer(1,10)',
    deliveryDate:'@datetime(yyyy-MM-dd HH:mm:ss)',
    priority:'@integer(0,3)',
    'dispatchMethod|1':['F','B'],
    color:'@hex'
  }]
})

module.exports = [
  {
    url:'/order/get-order-list',
    type:'get',
    response: config =>{
      const items=orderList.items
      return {
        code:20000,
        data:{
          total:items.length,
          items:items
        }
      }
    }
  }
]