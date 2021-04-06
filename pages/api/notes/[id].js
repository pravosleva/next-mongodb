import dbConnect from '~/utils/dbConnect'
import Note from '~/models/Note'
import { actionTypes as eTypes } from '~/socket-logic'
import { authTokenValidator } from '~/utils/express/authTokenValidator'

dbConnect()

const idApi = async (req, res) => {
  const {
    query: { id },
    method,
  } = req
  const isLogged = authTokenValidator(req)

  switch (method) {
    case 'GET':
      try {
        const note = await Note.findById(id)

        if (!note) {
          return res.status(400).json({ success: false })
        }
        if (!isLogged && note.isPrivate) {
          return res.status(403).json({ success: false, message: 'Forbidden' })
        }

        return res.status(200).json({ success: true, data: note })
      } catch (error) {
        return res.status(400).json({ success: false })
      }
    case 'PUT':
      try {
        const note = await Note.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
          // useFindAndModify: false,
        })

        if (!note) {
          return res.status(400).json({ success: false })
        }

        req.io.emit(eTypes.NOTE_UPDATED, { data: note })
        // console.log(req.io.stateMap.size)
        // req.socketBroadcast.emit(eTypes.NOTE_UPDATED, { data: note })
        return res.status(200).json({ success: true, data: note })
      } catch (error) {
        return res.status(400).json({ success: false })
      }
    case 'DELETE':
      try {
        const deletedNote = await Note.deleteOne({ _id: id })

        if (!deletedNote) {
          return res.status(400).json({ success: false })
        }

        req.io.emit(eTypes.NOTE_DELETED, { data: { ...deletedNote, id } })
        return res.status(200).json({ success: true, data: {} })
      } catch (error) {
        return res.status(400).json({ success: false })
      }
    default:
      return res.status(400).json({ success: false })
  }
}

export default idApi
