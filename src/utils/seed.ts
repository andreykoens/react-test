import { Faker, pt_BR } from '@faker-js/faker'
import { IRecordPost, IRecordUser } from 'types/api'
import { emojifyBetweenWords, emojifySentence } from './emojiBank'
import { getRandomFloat } from './math'

const faker = new Faker({
  locale: [pt_BR],
})

export const SeedGeneric = () => {
  //create definitions
  console.log('init seed')
  const amountUsers = Math.floor(Math.random() * 4) + 1
  const amountPosts = Math.floor(Math.random() * 10) + 3
  const amountComments = Math.floor(Math.random() * 15) + 5

  // Create Users
  let nextUserId: number = Number(localStorage.getItem('nextUserId'))
  if (typeof nextUserId !== 'number') nextUserId = 1
  let rawUsers: string = localStorage.getItem('users')
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
  if (typeof nextPostId !== 'number') nextPostId = 1
  let rawPosts: string = localStorage.getItem('posts')
  if (!rawPosts) rawPosts = '[]'
  const posts: IRecordPost[] = JSON.parse(rawPosts)
  for (let i = 0; i <= amountPosts; i++) {
    let contentBase = faker.lorem.paragraphs({ min: 10, max: 30 })
    const contentSplits = contentBase.split('\n')
    contentBase = contentSplits[0]
    for (let i = 0; i < contentSplits.length; i++) {
      contentSplits.shift()
      const separator = getRandomFloat(0, 1) > 0.7 ? '\n' : ' '
      contentBase += separator + contentSplits[0]
    }
    const content = emojifyBetweenWords(contentBase)
    posts.push({
      id: Number(nextPostId),
      user_id: users[Math.floor(Math.random() * users.length)].id,
      title: faker.lorem.words({ min: 2, max: 5 }),
      content,
      comments: [],
    })
    nextPostId++
  }

  // Create Comments
  let nextCommentId: number = Number(localStorage.getItem('nextCommentId'))
  if (typeof nextCommentId !== 'number') nextCommentId = 1
  for (let i = 0; i <= amountComments; i++) {
    const postId = Math.floor(Math.random() * posts.length)
    if (posts && 'comments' in posts[postId]) {
      posts[postId].comments.push({
        id: Number(nextCommentId),
        user_id: users[Math.floor(Math.random() * users.length)].id,
        content: emojifySentence(faker.lorem.sentence({ min: 8, max: 20 })),
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

export const SeedByUserPosts = (id: number) => {
  const amountPosts = Math.floor(Math.random() * 10) + 3
  let nextPostId: number = Number(localStorage.getItem('nextPostId'))
  if (typeof nextPostId !== 'number') nextPostId = 1
  let rawPosts: string = localStorage.getItem('posts')
  if (!rawPosts) rawPosts = '[]'
  const posts: IRecordPost[] = JSON.parse(rawPosts)
  for (let i = 0; i <= amountPosts; i++) {
    let contentBase = faker.lorem.paragraphs({ min: 10, max: 30 })
    const contentSplits = contentBase.split('\n')
    contentBase = contentSplits[0]
    for (let i = 0; i < contentSplits.length; i++) {
      contentSplits.shift()
      const separator = getRandomFloat(0, 1) > 0.7 ? '\n' : ' '
      contentBase += separator + contentSplits[0]
    }
    const content = emojifyBetweenWords(contentBase)
    posts.push({
      id: Number(nextPostId),
      user_id: id,
      title: faker.lorem.words({ min: 2, max: 5 }),
      content,
      comments: [],
    })
    nextPostId++
  }
  localStorage.setItem('nextPostId', String(nextPostId))
  localStorage.setItem('posts', JSON.stringify(posts))

  window.location = window.location
}

export const SeedByUserComments = (id: number) => {
  const amountComments = Math.floor(Math.random() * 15) + 5

  let rawPosts: string = localStorage.getItem('posts')
  if (!rawPosts) rawPosts = '[]'
  const posts: IRecordPost[] = JSON.parse(rawPosts)

  let nextCommentId: number = Number(localStorage.getItem('nextCommentId'))
  if (typeof nextCommentId !== 'number') nextCommentId = 1
  for (let i = 0; i <= amountComments; i++) {
    const postId = Math.floor(Math.random() * posts.length)
    if (posts && 'comments' in posts[postId]) {
      posts[postId].comments.push({
        id: Number(nextCommentId),
        user_id: id,
        content: emojifySentence(faker.lorem.sentence({ min: 8, max: 20 })),
      })
    }
    nextCommentId++
  }

  localStorage.setItem('posts', JSON.stringify(posts))
  localStorage.setItem('nextCommentId', String(nextCommentId))

  window.location = window.location
}
