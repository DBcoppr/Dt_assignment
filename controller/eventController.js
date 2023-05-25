import { Event, Image } from '../models/eventModel.js';

const getSliceval = (limit, page, data) => {
    const totalpg = Math.ceil(data.length / limit)
    if (totalpg >= page) {
        let upperval = limit * page
        let lowerval = upperval - limit
        const result = data.slice(lowerval, upperval + 1)
        return result
    }
    else {
        let upperval = limit * totalpg
        let lowerval = upperval - limit
        const result = data.slice(lowerval, upperval + 1)
        return result
    }
}

const imagehandle = async (image) => {
    if (!image) {
        return { status: false, err: "no image found" };
    }
    if (!/^image/.test(image.mimetype)) {
        return { status: false, err: "data type not matched" };
    }
    else {
        return { status: true }
    }
}


export const getEvent = async (req, res) => {
    try {
        if (req.query.id) {                                       //get by id
            let data  = await Event.findById(req.query.id)
            res.status(200).send(data)
        }
        else if (req.query.type) {                                  //get by type
            let data = await Event.find({ type: req.query.type })
            if (data.length === 0) {
                res.sendStatus(404)
            }
            else {
                if (!req.query.limit || !req.query.page) {
                    const result = getSliceval(10, 1, data)  //assumption default limit = 10 and page = 1
                    res.status(200).send(result)
                }
                else {
                    const result = getSliceval(req.query.limit, req.query.page, data)
                    res.status(200).send(result)
                }
            }
        }
        else {
            res.status(400).send("missing value")
        }
    } catch (error) {
        console.log(error)
    }

}

//create operation
export const enterEvent = async (req, res) => {
    const { image } = req.files;
    const { name, tagline, schedule, description, moderator, category, sub_category, rigor_rank } = req.body
    const resp = await imagehandle(image)
    if (!resp.status) {
        res.status(400).send(resp.err)
    }
    if (!name || !tagline || !schedule || !description || !moderator || !category || !rigor_rank) {
        res.status(400).send("data missing")
    }
    else {
        try {
            const imgcontent = await Image.create({
                name: image.name,
                data: image.data,
                contentType: image.mimetype
            })

            const eventcontent = await Event.create({
                name: name,
                tagline: tagline,
                schedule: schedule,
                description: description,
                moderator: moderator,
                category: category,
                sub_category: sub_category,
                rigor_rank: rigor_rank,
                imagefile: imgcontent._id
            })
            res.status(200).send({ id: eventcontent._id })
        } catch (error) {
            res.status(500).send(error)
        }
    }
}

//update operation
export const modifyEvent = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const jsondata = await Event.findByIdAndUpdate(id, updatedData)
        const data=await Event.findById(id)
        if (req.files) {
            const imgdata=await Image.findById(data.imagefile)
            const result=await Image.updateOne({
                data:req.files.image.data,
                name:req.files.image.name
            })
        }
        res.status(200).send({ message: "success" })
    } catch (error) {
        res.status(404).send("cant find data")
    }
}

export const deleteEvent = async (req, res) => {
    const { id } = req.params;
    try {
        const data=await Event.findByIdAndDelete(id)
        await Image.findByIdAndDelete(data.imagefile)
        res.status(200).send("deleted successfully")
    } catch (error) {
        res.status(404).send("cant find data")
    }
}