import dbConnect from '~/utils/dbConnect';
import Note from '~/models/Note';

const isNumeric = n => !Number.isNaN(parseFloat(n));

dbConnect();

export default async (req, res) => {
    const {
        query: { q_title, q_description, limit, page },
        method
    } = req;

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

    switch (method) {
        case 'GET':
            const options = {}

            if (!!q_title) {
                options.title = { "$regex": q_title, "$options": "i" }
            }
            if (!!q_description) {
                options.description = { "$regex": q_description, "$options": "i" }
            }
            if (!!normalizedLimit && isNumeric(normalizedLimit)) {
                if (!!normalizedPage && isNumeric(normalizedPage)) {
                    try {
                        const notes = await Note.find(options).sort({ priority: 'desc' }).limit(normalizedLimit).skip((normalizedPage - 1) * normalizedLimit).exec();
                        // Get total documents in the Posts collection:
                        const count = await Note.find(options).countDocuments();
        
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
                        console.log(error)
                        // res.status(400).json({ success: false });
                        status = 400
                    }
                } else {
                    try {
                        const notes = await Note.find(options).sort({ priority: 'desc' }).limit(normalizedLimit);
                        const count = await Note.find(options).countDocuments();
        
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
                        // res.status(400).json({ success: false });
                        status = 400
                    }
                }
                
            } else {
                status = 400
            }
            break;
        case 'POST':
            try {
                const note = await Note.create(req.body);
                const count = await Note.countDocuments();

                // res.status(201).json({ success: true, data: note })
                response.data = note
                response.success = true
                response.pagination = {
                    // totalPages: Math.ceil(count / normalizedLimit),
                    // currentPage: 1,
                    totalNotes: count,
                }
                status = 201
            } catch (error) {
                // res.status(400).json({ success: false });
                status = 400
            }
            break;
        default:
            // res.status(400).json({ success: false });
            status = 400
            break;
    }

    res.status(status).json(response);
}