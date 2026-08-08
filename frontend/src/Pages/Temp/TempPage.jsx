import { useEffect, useMemo, useState } from "react";
import "./TempPage.css";
import { tempChecklistSections } from "./tempChecklistData";

const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const flattenChecklist = (sections) =>
  sections.flatMap((section, sectionIndex) =>
    section.items.map((item, itemIndex) => ({
      ...item,
      section: section.title,
      sortOrder: sectionIndex * 100 + itemIndex,
    }))
  );

const buildInitialDrafts = (items) =>
  items.reduce((drafts, item) => {
    drafts[item.itemKey] = "";
    return drafts;
  }, {});

const buildInitialChecks = (items) =>
  items.reduce((checks, item) => {
    checks[item.itemKey] = Boolean(item.isChecked);
    return checks;
  }, {});

const parseMoneyValue = (value) => {
  if (typeof value !== "string") {
    return 0;
  }

  const normalized = value.replace(/,/g, "").trim();
  const matched = normalized.match(/-?\d+(\.\d+)?/);

  if (!matched) {
    return 0;
  }

  const parsed = Number.parseFloat(matched[0]);
  return Number.isFinite(parsed) ? parsed : 0;
};

const TempPage = () => {
  const checklistItems = useMemo(() => flattenChecklist(tempChecklistSections), []);
  const [drafts, setDrafts] = useState(() => buildInitialDrafts(checklistItems));
  const [savedValues, setSavedValues] = useState(() => buildInitialDrafts(checklistItems));
  const [checkedStates, setCheckedStates] = useState(() => buildInitialChecks(checklistItems));
  const [rowStates, setRowStates] = useState({});
  const [pageStatus, setPageStatus] = useState("loading");

  useEffect(() => {
    const loadRealPrices = async () => {
      try {
        const response = await fetch(`${apiBase}/api/temp-prices`);

        if (!response.ok) {
          throw new Error("Failed to load temp prices");
        }

        const records = await response.json();
        const nextSavedValues = buildInitialDrafts(checklistItems);
        const nextCheckedStates = buildInitialChecks(checklistItems);

        for (const record of records) {
          if (typeof record?.itemKey === "string" && Object.hasOwn(nextSavedValues, record.itemKey)) {
            nextSavedValues[record.itemKey] = record.realPrice ?? "";
            nextCheckedStates[record.itemKey] = Boolean(record.isChecked);
          }
        }

        setDrafts(nextSavedValues);
        setSavedValues(nextSavedValues);
        setCheckedStates(nextCheckedStates);
        setPageStatus("ready");
      } catch (error) {
        console.error(error);
        setPageStatus("error");
      }
    };

    loadRealPrices();
  }, [checklistItems]);

  const completedCount = Object.values(checkedStates).filter(Boolean).length;
  const filledRealPriceCount = Object.values(savedValues).filter((value) => value.trim()).length;
  const moneySpent = Object.values(savedValues).reduce((total, value) => total + parseMoneyValue(value), 0);

  const groupedSections = useMemo(
    () =>
      tempChecklistSections.map((section, sectionIndex) => ({
        ...section,
        items: section.items.map((item, itemIndex) => ({
          ...item,
          section: section.title,
          sortOrder: sectionIndex * 100 + itemIndex,
          isChecked: checkedStates[item.itemKey] ?? Boolean(item.isChecked),
          realPrice: drafts[item.itemKey] ?? "",
          status: rowStates[item.itemKey] ?? "idle",
        })),
      })),
    [checkedStates, drafts, rowStates]
  );

  const handleDraftChange = (itemKey, value) => {
    setDrafts((current) => ({
      ...current,
      [itemKey]: value,
    }));

    setRowStates((current) => ({
      ...current,
      [itemKey]: "editing",
    }));
  };

  const saveItem = async (item) => {
    setRowStates((current) => ({
      ...current,
      [item.itemKey]: "saving",
    }));

    try {
      const response = await fetch(`${apiBase}/api/temp-prices`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemKey: item.itemKey,
          section: item.section,
          label: item.label,
          estimatedPrice: item.estimatedPrice,
          realPrice: drafts[item.itemKey] ?? "",
          isChecked: checkedStates[item.itemKey] ?? item.isChecked,
          sortOrder: item.sortOrder,
        }),
      });

      if (!response.ok) {
        throw new Error("Save failed");
      }

      const saved = await response.json();
      const normalizedValue = saved.realPrice ?? "";

      setDrafts((current) => ({
        ...current,
        [item.itemKey]: normalizedValue,
      }));

      setSavedValues((current) => ({
        ...current,
        [item.itemKey]: normalizedValue,
      }));

      setRowStates((current) => ({
        ...current,
        [item.itemKey]: "saved",
      }));
    } catch (error) {
      console.error(error);
      setRowStates((current) => ({
        ...current,
        [item.itemKey]: "error",
      }));
    }
  };

  const toggleCheck = async (item) => {
    const nextCheckedValue = !(checkedStates[item.itemKey] ?? item.isChecked);

    setCheckedStates((current) => ({
      ...current,
      [item.itemKey]: nextCheckedValue,
    }));

    setRowStates((current) => ({
      ...current,
      [item.itemKey]: "saving",
    }));

    try {
      const response = await fetch(`${apiBase}/api/temp-prices`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemKey: item.itemKey,
          section: item.section,
          label: item.label,
          estimatedPrice: item.estimatedPrice,
          realPrice: drafts[item.itemKey] ?? "",
          isChecked: nextCheckedValue,
          sortOrder: item.sortOrder,
        }),
      });

      if (!response.ok) {
        throw new Error("Toggle failed");
      }

      const saved = await response.json();

      setCheckedStates((current) => ({
        ...current,
        [item.itemKey]: Boolean(saved.isChecked),
      }));

      setRowStates((current) => ({
        ...current,
        [item.itemKey]: "saved",
      }));
    } catch (error) {
      console.error(error);

      setCheckedStates((current) => ({
        ...current,
        [item.itemKey]: Boolean(item.isChecked),
      }));

      setRowStates((current) => ({
        ...current,
        [item.itemKey]: "error",
      }));
    }
  };

  return (
    <main className="temp-page">
      <div className="temp-shell">
        <section className="temp-hero">
          <div className="temp-hero-card">
            <span className="temp-kicker">Public Temp Editor</span>
            <h1 className="temp-title">Airsoft checklist real-price tracker</h1>
            <p className="temp-copy">
              This page mirrors your checklist columns and lets anyone write the real paid price for each line item.
              Changes are stored in the database through a public API, so the values persist across reloads.
            </p>
          </div>

          <aside className="temp-summary-card">
            <div className="temp-summary-grid">
              <div className="temp-stat">
                <div className="temp-stat-label">Budget</div>
                <div className="temp-stat-value">C$1000</div>
              </div>
              <div className="temp-stat">
                <div className="temp-stat-label">Checked Items</div>
                <div className="temp-stat-value">{completedCount}</div>
              </div>
              <div className="temp-stat">
                <div className="temp-stat-label">Saved Real Prices</div>
                <div className="temp-stat-value">{filledRealPriceCount}</div>
              </div>
              <div className="temp-stat">
                <div className="temp-stat-label">Money Spent</div>
                <div className="temp-stat-value">C${moneySpent.toFixed(2)}</div>
              </div>
              <div className="temp-stat">
                <div className="temp-stat-label">Load Status</div>
                <div className="temp-stat-value">
                  {pageStatus === "loading" ? "Loading" : pageStatus === "error" ? "Error" : "Ready"}
                </div>
              </div>
            </div>
            <p className="temp-row-note">
              Anyone with access to this route can edit and save the `Real Price` values.
            </p>
          </aside>
        </section>

        {groupedSections.map((section) => (
          <section key={section.title} className="temp-section">
            <h2 className="temp-section-title">{section.title}</h2>
            <div className="temp-table-wrap custom-scrollbar-dark">
              <table className="temp-table">
                <thead>
                  <tr>
                    <th>Check</th>
                    <th>Item</th>
                    <th>Est. Price</th>
                    <th>Real Price</th>
                  </tr>
                </thead>
                <tbody>
                  {section.items.map((item) => {
                    const status = item.status;
                    const hasUnsavedChange = (drafts[item.itemKey] ?? "") !== (savedValues[item.itemKey] ?? "");

                    return (
                      <tr key={item.itemKey}>
                        <td>
                          <button
                            type="button"
                            className={`temp-check ${item.isChecked ? "done" : ""}`}
                            onClick={() => toggleCheck(item)}
                            aria-pressed={item.isChecked}
                            aria-label={`Toggle checked state for ${item.label}`}
                          >
                            {item.isChecked ? "[x]" : "[ ]"}
                          </button>
                        </td>
                        <td className="temp-item-label">{item.label}</td>
                        <td className="temp-estimate">{item.estimatedPrice}</td>
                        <td>
                          <div className="temp-real-price">
                            <div className="temp-real-price-controls">
                              <input
                                type="text"
                                value={item.realPrice}
                                onChange={(event) => handleDraftChange(item.itemKey, event.target.value)}
                                placeholder="Enter actual price paid"
                                aria-label={`Real price for ${item.label}`}
                              />
                              <button
                                type="button"
                                onClick={() => saveItem(item)}
                                disabled={status === "saving" || !hasUnsavedChange}
                              >
                                {status === "saving" ? "Saving..." : "Save"}
                              </button>
                            </div>
                            <span className={`temp-row-note ${status === "error" ? "error" : status === "saved" ? "success" : ""}`}>
                              {status === "error"
                                ? "Save failed."
                                : status === "saved"
                                  ? "Saved to database."
                                  : hasUnsavedChange
                                    ? "Unsaved change."
                                    : " "}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
};

export default TempPage;
