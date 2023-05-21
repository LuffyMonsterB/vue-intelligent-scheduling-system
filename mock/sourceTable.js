const Mock = require('mockjs')

const sourceList=Mock.mock({
  'items|5':[{
    sourceCode:'@word(1)@integer(0,9)',
    'name|1':['资源A','资源B','资源C'],
    'type|1':['S','M','V','I'],
    isGroup:'No',
    group:'',
    groupMembers:[],
    color:'@hex'
  }]
})

module.exports = [
  {
    url:'/source/get-source-list',
    type:'get',
    response: config =>{
      const items=sourceList.items
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