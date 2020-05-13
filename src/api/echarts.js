import request from '@/utils/request'

export function userPlanChart(planId) {
  return request({
    url: '/echarts/userPlan',
    method: 'get',
    params: planId
  })
}

export function planReadingChart(planId) {
  return request({
    url: '/echarts/planReading',
    method: 'get',
    params: planId
  })
}
