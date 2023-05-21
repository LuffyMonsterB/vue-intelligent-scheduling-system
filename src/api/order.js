import request from '@/utils/request'

export function getOrderList() {
  return request({
    url: '/api/order/list',
    method: 'get',
  })
}

export function addOrder(data) {
  return request({
    url: '/api/order',
    method: 'post',
    data:{add_orders:[{...data}]}
  })
}

export function updateOrderById(data) {
  return request({
    url: '/api/order',
    method: 'patch',
    data:{update_orders:[{...data}]}
  })
}

export function deleteOrderById(id) {
  return request({
    url: '/api/order',
    method: 'delete',
    params:{ids:id}
  })
}

