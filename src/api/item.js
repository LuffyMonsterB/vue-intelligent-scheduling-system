import request from '@/utils/request'

export function getItemList() {
  return request({
    url: `/api/item/list`,
    method: 'get'
  })
}

export function addItem(data) {
  return request({
    url: `/api/item`,
    method: 'post',
    data:{add_items:[{...data}]}
  })
}
export function updateItemById(data) {
  return request({
    url: `/api/item`,
    method: 'patch',
    data:{update_items:[{...data}]}
  })
}

export function deleteItemById(id) {
  return request({
    url: `/api/item`,
    method: 'delete',
    params:{ids:id}
  })
}