import { Router } from "express";
import mongoose from "mongoose";
import BuildingProject, { buildingStatuses, isProjectUrl } from "../DatabaseModel/BuildingProject.js";
import { requireAuth, requireAdmin } from "../Middleware/auth.js";

export function createBuildingRouter({ model = BuildingProject, authenticate = requireAuth } = {}) {
    const router = Router();
    router.get("/", async (req, res) => {
        res.json(await model.find().sort({ createdAt: -1 }).lean());
    });
    router.use(authenticate, requireAdmin);
    // JSON-only writes also prevent cross-origin HTML forms from submitting changes.
    router.use((req, res, next) => req.is("application/json") ? next() : res.sendStatus(415));
    router.param("id", (req, res, next, id) => {
        if (!mongoose.isObjectIdOrHexString(id)) return res.status(400).json({ message: "Invalid project ID." });
        next();
    });
    const validate = (req, res, next) => {
        const { title, description, status = "In progress", url = "" } = req.body ?? {};
        if (typeof title !== "string" || !title.trim() || title.trim().length > 120 ||
            typeof description !== "string" || !description.trim() || description.trim().length > 3000 ||
            !buildingStatuses.includes(status) || typeof url !== "string" || url.trim().length > 2048 || !isProjectUrl(url.trim())) {
            return res.status(400).json({ message: "Enter a title, description, valid status, and an optional HTTP or HTTPS link." });
        }
        req.projectData = { title: title.trim(), description: description.trim(), status, url: url.trim() };
        next();
    };
    router.post("/", validate, async (req, res) => {
        res.status(201).json(await model.create(req.projectData));
    });
    router.put("/:id", validate, async (req, res) => {
        const project = await model.findByIdAndUpdate(req.params.id, req.projectData, { new: true, runValidators: true });
        if (!project) return res.status(404).json({ message: "Project no longer exists." });
        res.json(project);
    });
    router.delete("/:id", async (req, res) => {
        const project = await model.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ message: "Project no longer exists." });
        res.sendStatus(204);
    });
    router.use((error, req, res, next) => {
        if (res.headersSent) return next(error);
        console.error("Currently Building request failed", error);
        res.status(500).json({ message: "Unable to load or save projects. Please try again." });
    });
    return router;
}
export default createBuildingRouter();
