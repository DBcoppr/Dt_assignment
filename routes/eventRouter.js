import express from "express"
import { deleteEvent, enterEvent, getEvent, modifyEvent } from "../controller/eventController.js"

export const eventRoutes=express.Router()
eventRoutes.post("/events",enterEvent)
eventRoutes.get("/events",getEvent)
eventRoutes.put("/events/:id",modifyEvent)
eventRoutes.delete("/events/:id",deleteEvent)