import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/plan/list',
    method: 'get',
    params: query
  })
}

export function add(plan) {
  return request({
    url: '/plan/add',
    method: 'post',
    params: plan
  })
}