import request from '@/utils/request'

export function getProcessByItemId(id) {
  return request({
    url: `/api/procedure`,
    method: 'get',
    params:{ids:id}
  })
}

export function updateProcessByItemId(data) {
  return request({
    url: `/api/procedure`,
    method: 'post',
    data:{procedure_list:[{...data}]}
  })
}
