const WebComponent = {
    wasRegistered: function(s) {
        return window.customElements.get(s) !== undefined
    }
}

export { WebComponent }