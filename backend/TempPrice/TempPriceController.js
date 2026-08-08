import TempPrice from "../DatabaseModel/TempPrice.js";

export const getTempPrices = async (req, res) => {
  try {
    const prices = await TempPrice.find().sort({ section: 1, sortOrder: 1, updatedAt: -1 });
    return res.status(200).json(prices);
  } catch (error) {
    console.error("getTempPrices error", error);
    return res.status(500).json({ error: "Unable to load temp prices" });
  }
};

export const upsertTempPrice = async (req, res) => {
  try {
    const { itemKey, section, label, estimatedPrice, realPrice, isChecked, sortOrder } = req.body;

    if (!itemKey || !section || !label || !estimatedPrice || typeof sortOrder !== "number") {
      return res.status(400).json({ error: "Missing required temp price fields" });
    }

    const saved = await TempPrice.findOneAndUpdate(
      { itemKey },
      {
        itemKey,
        section,
        label,
        estimatedPrice,
        realPrice: typeof realPrice === "string" ? realPrice : "",
        isChecked: Boolean(isChecked),
        sortOrder,
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      }
    );

    return res.status(200).json(saved);
  } catch (error) {
    console.error("upsertTempPrice error", error);
    return res.status(500).json({ error: "Unable to save temp price" });
  }
};
