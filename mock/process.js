const Mock = require("mockjs");

const mockData = {
  orderCode: ["a1", "b2", "c3", "d4", "e5"],
  item: ["产品A", "产品B", "产品A", "产品B", "产品C"],
  processList: [
    [
      { preProcess: "工序4", postProcess: "" },
      { preProcess: "工序3", postProcess: "工序4" },
      { preProcess: "工序2", postProcess: "工序3" },
      { preProcess: "工序1", postProcess: "工序2" },
    ],
    [
      { preProcess: "工序5", postProcess: "" },
      { preProcess: "工序3", postProcess: "工序5" },
      { preProcess: "工序2", postProcess: "工序3" },
      { preProcess: "工序1", postProcess: "工序2" },
      { preProcess: "工序0", postProcess: "工序1" },
    ],
    [
      { preProcess: "工序4", postProcess: "" },
      { preProcess: "工序3", postProcess: "工序4" },
      { preProcess: "工序2", postProcess: "工序3" },
      { preProcess: "工序1", postProcess: "工序2" },
    ],
    [
      { preProcess: "工序4", postProcess: "" },
      { preProcess: "工序3", postProcess: "工序4" },
      { preProcess: "工序2", postProcess: "工序3" },
      { preProcess: "工序1", postProcess: "工序2" },
    ],
    [
      { preProcess: "工序4", postProcess: "" },
      { preProcess: "工序3", postProcess: "工序4" },
      { preProcess: "工序2", postProcess: "工序3" },
      { preProcess: "工序1", postProcess: "工序2" },
      { preProcess: "工序0", postProcess: "工序1" },
    ],
  ],
};

const orderList = Mock.mock({
  "items|5": [
    {
      "orderCode|+1": mockData.orderCode,
      "item|+1": mockData.item,
      color: "@hex",
    },
  ],
});

getProcessByOrder = (orderCode) => {
  let index = mockData.orderCode.indexOf(orderCode);
  const processData = Mock.mock({
    itemName: mockData.item[index],
    processList:mockData.processList[index]
  });
  return processData;
};

module.exports = [
  {
    url: "/process/get-order-list",
    type: "get",
    response: (config) => {
      const items = orderList.items;
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items,
        },
      };
    },
  },
  {
    url: "/process/get-process-by-order",
    type: "get",
    response: (config) => {
      let { orderCode } = config.query;
      const items = getProcessByOrder(orderCode);
      return {
        code: 20000,
        data: {
          itemName: items.itemName,
          processList: items.processList,
        },
      };
    },
  },
];
