import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/iterationMember/list',
    method: 'get',
    params: query
  })
}

export function add(iterationMember) {
  return request({
    url: '/iterationMember/add',
    method: 'post',
    params: iterationMember
  })
}

export function membersJoinIteration(iterationMembers) {
  return request({
    url: '/iterationMember/membersJoin',
    method: 'post',
    params: iterationMembers
  })
}

export function joinIteration(iterationMember) {
  return request({
    url: '/iterationMember/join',
    method: 'post',
    params: iterationMember
  })
}

export function exitIteration(iterationMember) {
  return request({
    url: '/iterationMember/exit',
    method: 'post',
    params: iterationMember
  })
}
