const DECORATIVE_VIEWPORT = {
    mobile: "mobile",
    tablet: "tablet",
    desktop: "desktop"
}

const EXPERIENCE_DECORATIVE_VIEWPORT_BREAKPOINTS = {
    mobileMaxWidth: 799,
    tabletMaxWidth: 1279
}

const EXPERIENCE_DECORATIVE_RULES = {
    [DECORATIVE_VIEWPORT.mobile]: {
        tableFigureNames: [],
        roomWallFigureNames: ["shelf"],
        notes: "Minimum decorative payload only."
    },
    [DECORATIVE_VIEWPORT.tablet]: {
        tableFigureNames: ["winnieThePooh", "flowerPot"],
        roomWallFigureNames: ["shelf"],
        notes: "Reduced decorative payload."
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

    if (viewportWidth <= EXPERIENCE_DECORATIVE_VIEWPORT_BREAKPOINTS.tabletMaxWidth) {
        return DECORATIVE_VIEWPORT.tablet
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
