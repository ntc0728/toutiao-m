/* 评论请求模块 */
import request from '@/utils/request'

/* 获取文章评论列表 */
export const getComments = params => {
  return request({
    method: 'GET',
    url: '/app/v1_0/comments',
    // axios 会把 params 对象转为 key=value?key=value 的格式放到url 中
    params
  })
}

/**
 * 对评论或评论回复点赞
 */
export const addCommentLike = target => {
  return request({
    method: 'POST',
    url: '/app/v1_0/comment/likings',
    data: {
      target
    }
  })
}

/**
 * 取消对评论或评论回复点赞
 */
export const deleteCommentLike = target => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/comment/likings/${target}`
  })
}

/**
 * 发布文章评论或评论回复
 */
export function addComment(data) {
  return request({
    method: 'POST',
    url: '/app/v1_0/comments',
    data
  })
}
