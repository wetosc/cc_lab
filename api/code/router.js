const Controller = require("./controller")

const Router = require('express').Router;

var router = Router()

router.post("/", [
    Controller.insert
])
router.get("/", [
    Controller.list
])
router.get("/:id", [
    Controller.getById
])
router.patch("/:id", [
    Controller.patchById
])
router.delete("/:id", [
    Controller.removeById
])

const mainRouter = Router()
mainRouter.use("/queue", router)

module.exports = mainRouter
