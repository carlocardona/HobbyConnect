const path = require("path");
const db = require("../models");

// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
    app.get("/", (req, res) => {
        res.render('login');
    });

    app.get("/signup", (req, res) => {
        res.render('signup');
    });

    app.get("/index", (req, res) => {
        if (!req.isAuthenticated()) {
            res.redirect("/")
        }
        res.render('index', { user: req.user });
    })
    app.get("/eventInfo", async(req, res) => {
        if (!req.isAuthenticated()) {
            res.redirect("/");
        }
        const name = req.query.name

        const event = await db.Event.findOne({ where: { name: name }, include: db.User });
        const eventUsers = await db.UserEvent.findAll({ where: { eventId: event.id } })
        console.log(eventUsers);


        // const part = await db.UserEvent.findAll({ where: { eventId: event.id }, include: db.User });
        // console.log(part);
        res.render('eventInfo', { user: req.user, event: event.toJSON() });
    })
};