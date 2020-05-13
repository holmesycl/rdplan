import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/planMember/list',
    method: 'get',
    params: query
  })
}

export function exitPlan(planMember) {
  return request({
    url: '/planMember/exitPlan',
    method: 'post',
    params: planMember
  })
}

export function joinPlan(planMember) {
  return request({
    url: '/planMember/joinPlan',
    method: 'post',
    params: planMember
  })
}

export function addPlanMembers(planMembers) {
  return request({
    url: '/planMember/membersJoinPlan',
    method: 'post',
    params: planMembers
  })
}

export function fetchAll(planId) {
  return request({
    url: '/planMember/listAll',
    method: 'get',
    params: planId
  })
}
