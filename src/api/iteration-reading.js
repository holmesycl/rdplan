import request from '@/utils/request'

export function listAll(query) {
  return request({
    url: '/iterationReading/listAll',
    method: 'get',
    params: query
  })
}

export function addMemberIterationReading(memberIteraionReading) {
  return request({
    url: '/iterationReading/addBooks',
    method: 'post',
    params: memberIteraionReading
  })
}

export function reading(id) {
  return request({
    url: '/iterationReading/reading',
    method: 'post',
    params: id
  })
}

export function finish(id) {
  return request({
    url: '/iterationReading/finish',
    method: 'post',
    params: id
  })
}

export function unread(id) {
  return request({
    url: '/iterationReading/unread',
    method: 'post',
    params: id
  })
}

export function del(id) {
  return request({
    url: '/iterationReading/del',
    method: 'post',
    params: id
  })
}
