import { Faker, pt_BR } from '@faker-js/faker'
import { IRecordComment, IRecordPost, IRecordUser } from 'types/api'
// const handleMakeComment = () => {
//   window.FakerApi.post('/comments/create', {
//     post_id: availablePostIds[Math.floor(Math.random() * availablePostIds.length)],
//     comment: {
//       content: faker.lorem.sentence({ min: 8, max: 30 }),
//     },
//   }).then((data) => {
//     setAmountComments((c) => c - 1)
//   })
// }

const faker = new Faker({
  locale: [pt_BR],
})

interface IDestroyQueueItem {
  post_id?: number
  comment_id?: number
}
interface ISeedComment {
  post_id: number
  comment: IRecordComment
}

const recursiveSeed = (posts: number, comments: number, postIds: Array<number>) => {
  if (posts <= 0 && postIds.length <= 0) {
    window.FakerApi.get('/posts', {}).then((response: any) => {
      const currentPosts = response.data
      const postIds: number[] = currentPosts.map((p: any) => {
        return p.id
      })
      recursiveSeed(posts, comments, postIds)
    })
    return
  }
  if (posts <= 0 && postIds.length > 0) {
    shift = 'comments'
    path = '/comments/create'
    item = {
      post_id: postIds[Math.floor(Math.random() * postIds.length)],
      comment: {
        content: faker.lorem.sentence({ min: 8, max: 30 }),
      },
    }
  }
  if (posts <= 0 && comments <= 0) window.location = window.location
  window.FakerApi.post(path, item)
    .catch((e) => {
      console.log(e)
    })
    .then((data: any) => {
      console.log('Seeding, ', posts, ' posts, ', comments, ' comments left')
      if (shift === 'posts') posts--
      if (shift === 'comments') comments--
      recursiveSeed(posts, comments, postIds)
    })
}

export const Seed = () => {
  if (!window.FakerApi) return

  //create definitions
  console.log('init seed')
  const amountUsers = Math.floor(Math.random() * 4) + 1
  const amountPosts = Math.floor(Math.random() * 10) + 3
  const amountComments = Math.floor(Math.random() * 15) + 5

  // Create Users
  let nextUserId: number = Number(localStorage.getItem('nextUserId'))
  if (typeof nextUserId !== 'number') nextUserId = 0
  let rawUsers = localStorage.getItem('users')
  if (!rawUsers) rawUsers = '[]'
  const users: IRecordUser[] = JSON.parse(rawUsers)
  if (!rawUsers.includes('Andrey Koens')) {
    users.push({
      name: 'Andrey Koens',
      username: 'admin',
      password: 'admin',
      id: nextUserId,
    })
  }
  for (let i = 0; i <= amountUsers - 1; i++) {
    nextUserId++
    const name: string = faker.person.fullName()
    const username = name.split(' ').slice(0, 2).join()
    users.push({
      name,
      username,
      password: '12345678',
      id: nextUserId,
    })
  }

  // Create Posts
  let nextPostId: number = Number(localStorage.getItem('nextPostId'))
  if (typeof nextPostId !== 'number') nextPostId = 0
  let rawPosts = localStorage.getItem('posts')
  if (!rawPosts) rawPosts = '[]'
  const posts: IRecordPost[] = JSON.parse(rawPosts)
  for (let i = 0; i <= amountPosts; i++) {
    posts.push({
      id: Number(nextPostId),
      user_id: users[Math.floor(Math.random() * users.length)].id,
      title: faker.lorem.words({ min: 2, max: 5 }),
      content: faker.lorem.text(),
      comments: [],
    })
    nextPostId++
  }

  // Create Comments
  let nextCommentId: number = Number(localStorage.getItem('nextCommentId'))
  if (typeof nextCommentId !== 'number') nextCommentId = 0
  for (let i = 0; i <= amountComments; i++) {
    const postId = Math.floor(Math.random() * posts.length)
    if ('comments' in posts[postId]) {
      posts[postId].comments.push({
        id: Number(nextCommentId),
        user_id: users[Math.floor(Math.random() * users.length)].id,
        content: faker.lorem.sentence({ min: 8, max: 30 }),
      })
    }
    nextCommentId++
  }

  localStorage.setItem('users', JSON.stringify(users))
  localStorage.setItem('posts', JSON.stringify(posts))
  localStorage.setItem('nextUserId', String(nextUserId + 1))
  localStorage.setItem('nextPostId', String(nextPostId))
  localStorage.setItem('nextCommentId', String(nextCommentId))

  window.location = window.location
}

export const Nuke = () => {
  if (!window.FakerApi) return

  //create definitions
  console.log('init nuke')
  localStorage.setItem('posts', '[]')
  localStorage.setItem('users', '[]')
  localStorage.setItem('nextUserId', '0')
  localStorage.setItem('nextPostId', '0')
  localStorage.setItem('nextCommentId', '0')
  localStorage.setItem('auth', '')
  window.location = window.location
  /* let tComments: IDestroyQueueItem[] = []
  let tPosts: IDestroyQueueItem[] = []
  window.FakerApi.get('/posts', {}).then((response: any) => {
    const currentPosts = response.data
    currentPosts.forEach((p: any) => {
      if (p.comments && p.comments.length > 0) {
        Object.values(p.comments).forEach((c: any) => {
          tComments.push({ post_id: p.id, comment_id: c.id })
        })
      }
      tPosts.push({ post_id: p.id })
    })
    recursiveDelete(tComments, tPosts)
  }) */
}
