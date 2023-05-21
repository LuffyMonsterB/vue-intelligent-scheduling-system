import request from '@/utils/request'

export function getResourceList() {
  return request({
    url: `/api/resources/list`,
    method: 'get'
  })
}

export function addResource(data) {
  return request({
    url: `/api/resources`,
    method: 'post',
    data:{add_resources:[{...data}]}
  })
}

export function updateResourceById(data) {
  return request({
    url: `/api/resources`,
    method: 'patch',
    data:{update_resources:[{...data}]}
  })
}
export function deleteResourceById(id) {
  return request({
    url: `/api/resources`,
    method: 'delete',
    params:{ids:id}
  })
}