export const LAYER_LOAD_STATE = {
    notLoaded: "not_loaded",
    loading: "loading",
    loaded: "loaded"
}

export const LAYER_VISIBILITY_STATE = {
    hidden: "hidden",
    visible: "visible"
}

export const createLayerState = () => ({
    group: null,
    loadState: LAYER_LOAD_STATE.notLoaded,
    visibilityState: LAYER_VISIBILITY_STATE.hidden,
    loadingPromise: null,
    handles: {}
})

export const setLayerVisibility = (layerRef, isVisible) => {
    const layerState = layerRef.current
    layerState.visibilityState = isVisible
        ? LAYER_VISIBILITY_STATE.visible
        : LAYER_VISIBILITY_STATE.hidden

    if (!layerState.group) {
        return
    }

    layerState.group.visible = isVisible
}

export const hideLayer = (layerRef) => {
    setLayerVisibility(layerRef, false)
}

export const showLayer = (layerRef) => {
    setLayerVisibility(layerRef, true)
}

export const deactivateLayer = (layerRef) => {
    hideLayer(layerRef)
}

export const beginLayerLoad = (layerRef) => {
    layerRef.current.loadState = LAYER_LOAD_STATE.loading
}

export const completeLayerLoad = (layerRef) => {
    layerRef.current.loadState = LAYER_LOAD_STATE.loaded
}

export const isLayerLoaded = (layerRef) => layerRef.current.loadState === LAYER_LOAD_STATE.loaded

export const isLayerLoading = (layerRef) => layerRef.current.loadState === LAYER_LOAD_STATE.loading

export const createResolvedLayerPromise = (layerRef) => {
    completeLayerLoad(layerRef)
    layerRef.current.loadingPromise = Promise.resolve()
    return layerRef.current.loadingPromise
}

export const disposeLayerHandles = (layerRef, options = {}) => {
    const { onDisposeHandle } = options
    const handles = layerRef.current.handles

    Object.entries(handles).forEach(([handleName, handle]) => {
        handle?.dispose?.()
        onDisposeHandle?.(handleName, handle)
    })

    layerRef.current.handles = {}
}

export const disposeLayerRuntime = (layerRef, options = {}) => {
    const { reset = true, onDisposeHandle } = options
    const layerState = layerRef.current

    disposeLayerHandles(layerRef, { onDisposeHandle })

    if (layerState.group?.parent) {
        layerState.group.parent.remove(layerState.group)
    }

    if (!reset) {
        return
    }

    layerRef.current = createLayerState()
}
