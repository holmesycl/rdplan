import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/iteration/list',
    method: 'get',
    params: query
  })
}

export function add(iteration) {
  return request({
    url: '/iteration/add',
    method: 'post',
    params: iteration
  })
}

export function fetchPlan(iterationId) {
  return request({
    url: '/iterationMember/findPlan',
    method: 'get',
    params: iterationId
  })
}

export function current(planId) {
  return request({
    url: '/iteration/current',
    method: 'get',
    params: planId
  })
}

export function finishIteration(iterationId) {
  return request({
    url: '/iteration/finish',
    method: 'post',
    params: iterationId
  })
}

export function startIteration(iterationId) {
  return request({
    url: '/iteration/start',
    method: 'post',
    params: iterationId
  })
}