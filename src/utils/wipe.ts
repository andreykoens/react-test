import { IRecordPost } from 'types/api'

export const Wipe = () => {
  //create definitions
  console.log('init nuke')
  localStorage.setItem('posts', '[]')
  localStorage.setItem('users', '[]')
  localStorage.setItem('nextUserId', '1')
  localStorage.setItem('nextPostId', '1')
  localStorage.setItem('nextCommentId', '1')
  localStorage.removeItem('auth')

  //reload page
  window.location = window.location
}

export const WipeByUserPosts = (id: number) => {
  let rawPosts: string = localStorage.getItem('posts')
  if (!rawPosts) rawPosts = '[]'
  const posts: IRecordPost[] = JSON.parse(rawPosts)

  if (posts.length > 0) {
    const filteredPosts = posts.filter((post) => post.user_id !== id)
    localStorage.setItem('posts', JSON.stringify(filteredPosts))
    window.location = window.location
  }
}
export const WipeByUserComments = (id: number) => {
  let rawPosts: string = localStorage.getItem('posts')
  if (!rawPosts) rawPosts = '[]'
  const posts: IRecordPost[] = JSON.parse(rawPosts)

  if (posts.length > 0) {
    posts.forEach((post) => {
      if ('comments' in post) {
        post.comments = post.comments.filter((comment) => comment.user_id !== id)
      }
    })
    localStorage.setItem('posts', JSON.stringify(posts))
    window.location = window.location
  }
}
