const Mock = require('mockjs')

const orderGantt=Mock.mock({
  'items|5':[{
    id:'@increment',
    'item|1':['产品A','产品B','产品C'],
    duration:'@integer(1,10)',
    start_date:'@now()',
    open:true,
    toolTipsTxt:'xxxx'
  }]
})

module.exports = [
  {
    url:'/order/get-order-gantt',
    type:'get',
    response: config =>{
      const items=orderGantt.items
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