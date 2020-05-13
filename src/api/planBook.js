import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/planBook/list',
    method: 'get',
    params: query
  })
}

export function fetchAll(query) {
  return request({
    url: '/planBook/listAll',
    method: 'get',
    params: query
  })
}

export function addPlanBook(planBook) {
  return request({
    url: '/planBook/add',
    method: 'post',
    params: planBook
  })
}

