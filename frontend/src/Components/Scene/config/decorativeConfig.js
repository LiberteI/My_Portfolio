const DECORATIVE_VIEWPORT = {
    mobile: "mobile",
    tablet: "tablet",
    desktop: "desktop"
}

const EXPERIENCE_DECORATIVE_VIEWPORT_BREAKPOINTS = {
    mobileMaxWidth: 399
}

const EXPERIENCE_DECORATIVE_RULES = {
    [DECORATIVE_VIEWPORT.mobile]: {
        tableFigureNames: [],
        roomWallFigureNames: ["shelf"],
        notes: "Minimum decorative payload only."
    },
    [DECORATIVE_VIEWPORT.desktop]: {
        tableFigureNames: ["winnieThePooh", "presidentXiJingPing", "beethoven", "flowerPot"],
        roomWallFigureNames: ["piano", "shelf", "titanicLamp"],
        notes: "Full decorative payload."
    }
}

export const getDecorativeViewportCategory = (viewportWidth) => {
    if (viewportWidth <= EXPERIENCE_DECORATIVE_VIEWPORT_BREAKPOINTS.mobileMaxWidth) {
        return DECORATIVE_VIEWPORT.mobile
    }

    return DECORATIVE_VIEWPORT.desktop
}

export const getExperienceDecorativeRuleSet = (viewportWidth) => {
    const category = getDecorativeViewportCategory(viewportWidth)

    return {
        category,
        ...EXPERIENCE_DECORATIVE_RULES[category]
    }
}

export {
    DECORATIVE_VIEWPORT,
    EXPERIENCE_DECORATIVE_VIEWPORT_BREAKPOINTS
}
