import { nanoid } from 'nanoid'
import Redis from 'ioredis'
import { Boom } from '@hapi/boom'
import { data } from 'autoprefixer'

function errorResponse(res, error) {
  const { output } = data
  return res.status(output.statusCode).json(output.payload)
}

export default async function hendler(req, res) {
  //POST - CREATE
  if (req.method === 'POST') {
    const { url, userToken, text } = req.body

    if (!url || !userToken || !text) {
      return errorResponse(res, Boom.badData('Parametre eksik'))
    }
    const userResponse = await fetch(
      `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/userinfo`,
      {
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${userToken}`
        }
      }
    )
    const user = await userResponse.json()
    //user'ı doğrula
    const comment = {
      id: nanoid(),
      createdAt: Date.now(),
      text,
      user: {
        name: user.name,
        picture: user.picture
      }
    }

    //redis connection
    let client = new Redis(process.env.REDIS_URL)
    //redis write
    redis.lpush(url, JSON.stringify(comment))
    // redis quit
    redis.quit
    //response
    res.status(200).json(comment)
  }

  //GET - FETCH
  if (req.method === 'GET') {
    const { url } = req.query
    let redis = new Redis(process.env.REDIS_URL)
    const comments = await redis.lrange(url, 0, -1)
    redis.quit()
    const data = comments.map((o) => JSON.parse(o))
    res.status(200).json(data)
  }
}
