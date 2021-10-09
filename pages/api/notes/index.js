/* eslint-disable no-console */
import dbConnect from '~/utils/dbConnect'
import Note from '~/models/Note'
import { isNumeric } from '~/utils/isNumeric'
import { EActions } from '~/socket-logic'
import { authTokenValidator } from '~/utils/express/authTokenValidator'

dbConnect()

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) throw new Error('Check envs: JWT_SECRET was not provided')

const mainApi = async (req, res) => {
  const {
    query: { q_title, q_titles, q_description, limit, page },
    method,
  } = req

  let normalizedPage
  let normalizedLimit = 100

  if (!!page) {
    normalizedPage = Math.max(0, page)
  }
  if (!!limit) {
    normalizedLimit = Number(limit)
  }

  const response = {
    success: false,
  }
  let status = 500
  const options = {}
  const isLogged = authTokenValidator(req)

  switch (method) {
    case 'GET':
      if (!!q_titles) {
        // options.title = { $regex: q_title, $options: 'i' }
        // OR:
        // options.title = {
        //   $search: q_titles
        //     .split(',')
        //     .map((str) => '"' + str + '"')
        //     .join(' '),
        // }
        // options.title = { $in: q_titles.split(',') }
        // options.title = { $all: q_titles.split(',') }
        // options.title = { $or: q_titles.split(',').map((t) => ({ $regex: new RegExp(t), $options: 'i' })) }
        options.title = {
          $regex: new RegExp(q_titles.split(',').join('|')),
          $options: 'i',
        }
      }
      if (!!q_title) {
        options.title = { $regex: q_title, $options: 'i' }
      }
      if (!!q_description) {
        options.description = { $regex: q_description, $options: 'i' }
      }
      if (!isLogged) options.isPrivate = { $ne: true }

      if (!!normalizedLimit && isNumeric(normalizedLimit)) {
        if (!!normalizedPage && isNumeric(normalizedPage)) {
          try {
            const notes = await Note.find(options)
              .sort({ priority: 'desc', updatedAt: 'desc' })
              .limit(normalizedLimit)
              .skip((normalizedPage - 1) * normalizedLimit)
              .exec()
            // Get total documents in the Posts collection:
            const count = await Note.find(options).countDocuments()

            // res.status(200).json({ success: true, data: notes })
            response.data = notes
            response.success = true
            response.pagination = {
              totalPages: Math.ceil(count / normalizedLimit),
              currentPage: normalizedPage,
              totalNotes: count,
            }
            status = 200
          } catch (error) {
            console.log('-- ERR --')
            console.log(error)
            if (!!error || !!error?._message) {
              response.msg = typeof error._message === 'string' ? error._message : JSON.stringify(error._message)
            }
            // res.status(400).json({ success: false });
            status = 400
          }
        } else {
          try {
            const notes = await Note.find(options).sort({ priority: 'desc', updatedAt: 'desc' }).limit(normalizedLimit)
            const count = await Note.find(options).countDocuments()

            // res.status(200).json({ success: true, data: notes })
            status = 200
            response.data = notes
            response.pagination = {
              totalPages: Math.ceil(count / normalizedLimit),
              currentPage: 1,
              totalNotes: count,
            }
            response.success = true
          } catch (error) {
            console.log(error)
            if (!!error || !!error?._message) {
              response.msg = typeof error._message === 'string' ? error._message : JSON.stringify(error._message)
            }
            // res.status(400).json({ success: false });
            status = 400
          }
        }
      } else {
        status = 400
        response.msg = 'no page'
      }
      break
    case 'POST':
      if (!isLogged) options.isPrivate = { $ne: true }

      try {
        const note = await Note.create(req.body)
        const count = await Note.find(options).countDocuments()

        // res.status(201).json({ success: true, data: note })
        response.data = note
        response.success = true
        response.pagination = {
          // totalPages: Math.ceil(count / normalizedLimit),
          // currentPage: 1,
          totalNotes: count,
        }
        status = 201

        req.io.emit(EActions.NOTE_CREATED, { data: note })
      } catch (error) {
        if (!!error?.message) {
          response.msg = error.message
        }
        if (!!error?._message) {
          response.msg = error._message
        }
        // res.status(400).json({ success: false });
        status = 400
      }
      break
    default:
      // res.status(400).json({ success: false });
      status = 400
      break
  }

  res.status(status).json(response)
}

export default mainApi
