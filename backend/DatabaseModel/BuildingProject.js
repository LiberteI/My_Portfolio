import mongoose from "mongoose";

export const buildingStatuses = ["Planning", "In progress", "On hold", "Launched"];
export function isProjectUrl(value) {
    if (value === "") return true;
    try { return ["https:", "http:"].includes(new URL(value).protocol); }
    catch { return false; }
}

const schema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 3000 },
    status: { type: String, enum: buildingStatuses, default: "In progress" },
    url: { type: String, trim: true, maxlength: 2048, default: "", validate: isProjectUrl },
}, { timestamps: true });

export default mongoose.model("BuildingProject", schema);
