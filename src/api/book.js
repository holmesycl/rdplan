import request from '@/utils/request'

export function fetchAll(query) {
  return request({
    url: '/book/listAll',
    method: 'get',
    params: query
  })
}

export function fetchList(query) {
  return request({
    url: '/book/list',
    method: 'get',
    params: query
  })
}

export function add(book) {
  return request({
    url: '/book/add',
    method: 'post',
    params: book
  })
}

export function crawBook(bookId) {
  return request({
    url: '/book/crawBook',
    method: 'post',
    params: bookId
  })
}
