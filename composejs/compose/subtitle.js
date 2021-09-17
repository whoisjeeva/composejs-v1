function Subtitle({ label, language, path, isDefault=false }) {
    let track = document.createElement('track')
    track.setAttribute('kind', 'subtitles')
    track.setAttribute('label', label)
    track.setAttribute('srclang', language)
    track.setAttribute('src', path)
    if (isDefault) {
        track.setAttribute('default', '')
    }
    return track
}

export { Subtitle }