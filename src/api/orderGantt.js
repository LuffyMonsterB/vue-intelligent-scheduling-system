import request from '@/utils/request'

export function getSchedule() {
  return request({
    url: '/api/procedure/schedule',
    method: 'get'
  })
}
