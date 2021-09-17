import { onStateValueChange } from "../ext.js"
import { View } from "./reusable/View.js"
import { WebComponent } from "../WebComponent.js"
import { stateOf$1 } from "../state.js"
import { Modifier } from "../modifier.js"

class ComposeVideo extends View {
    constructor({ 
        source, 
        controls=true, 
        onCanPlay=null,
        onAbort=null,
        onCanPlayThrough=null,
        onDurationChange=null,
        onEnded=null,
        onError=null,
        onLoadedData=null,
        onLoadedMetadata=null,
        onLoadStart=null,
        onPause=null,
        onPlay=null,
        onPlaying=null,
        onProgress=null,
        onRateChange=null,
        onSeeked=null,
        onSeeking=null,
        onStalled=null,
        onSuspend=null,
        onTimeUpdate=null,
        onVolumeChange=null,
        onWaiting=null,
        onFullscreenChange=null,

        volume=1,
        currentTime=0,
        muted=false,
        loop=false,
        preload=false,
        poster=null,
        playbackRate=1,
        defaultPlaybackRate=1,
        crossOrigin=null,
        autoplay=false,
        isPlaying=false,
        isFullscreen=false,
        subtitles=[]
    }) {
        super()

        this.source = stateOf$1(source)
        this.autoplay = stateOf$1(autoplay)
        this.controls = stateOf$1(controls)
        this.volume = stateOf$1(volume)
        this.currentTime = stateOf$1(currentTime)
        this.muted = stateOf$1(muted)
        this.loop = stateOf$1(loop)
        this.preload = stateOf$1(preload)
        this.poster = stateOf$1(poster)
        this.playbackRate = stateOf$1(playbackRate)
        this.defaultPlaybackRate = stateOf$1(defaultPlaybackRate)
        this.crossOrigin = stateOf$1(crossOrigin)
        this.isPlaying = stateOf$1(isPlaying)
        this.isFullscreen = stateOf$1(isFullscreen)

        this.onCanPlay = e => {
            onCanPlay && onCanPlay()
            this.video[this.isPlaying.value ? 'play' : 'pause']()
        }
        this.onSeeking = onSeeking
        this.onAbort = onAbort
        this.onCanPlayThrough = onCanPlayThrough
        this.onDurationChange = onDurationChange
        this.onEnded = onEnded
        this.onError = onError
        this.onLoadedData = onLoadedData
        this.onLoadedMetadata = onLoadedMetadata
        this.onLoadStart = onLoadStart
        this.onPause = e => {
            onPause && onPause(e)
            this.isPlaying.value = false
        }
        this.onPlay = e => {
            onPlay && onPlay(e)
            this.isPlaying.value = true
        }
        this.onPlaying = onPlaying
        this.onProgress = onProgress
        this.onRateChange = onRateChange
        this.onSeeked = onSeeked
        this.onStalled = onStalled
        this.onSuspend = onSuspend
        this.onTimeUpdate = e => {
            this.currentTime.value = e.target.currentTime
            onTimeUpdate && onTimeUpdate(e)
        }
        this.onVolumeChange = e => {
            this.volume.value = e.target.volume
            onVolumeChange && onVolumeChange(e)
        }
        this.onWaiting = onWaiting
        this.onFullscreenChange = e => {
            onFullscreenChange && onFullscreenChange(e)
            this.isFullscreen.value = this.isInFullscreen
        }


        this.apply({
            style: `
            video {
                width: inherit;
                height: inherit;
            }
            `,
            html: `
            <video></video>
            `
        })

        this.video = this.shadowRoot.querySelector('video')

        if (subtitles.length > 0) {
            subtitles.forEach(subtitle => this.video.appendChild(subtitle))
        }

        this.video.volume = this.volume.appliedValue
        this.video.currentTime = this.currentTime.appliedValue
        this.video.muted = this.muted.appliedValue
        this.video.loop = this.loop.appliedValue
        this.video.preload = this.preload.appliedValue
        if (this.poster.appliedValue) this.video.poster = this.poster.appliedValue
        this.video.playbackRate = this.playbackRate.appliedValue
        this.video.defaultPlaybackRate = this.defaultPlaybackRate.appliedValue
        if (this.crossOrigin.appliedValue) this.video.crossOrigin = this.crossOrigin.appliedValue
        this.video.controls = this.controls.appliedValue
        this.video.src = this.source.appliedValue
        this.video.autoplay = this.autoplay.appliedValue
        this.video[this.isPlaying.appliedValue ? 'play' : 'pause']()
        if (!this.isInFullscreen && this.isFullscreen.appliedValue) this.switchToFullscreen()

        onStateValueChange(this, this.isPlaying, v => {
            if (this.video.paused && v) {
                this.video.play()
            } else if (!this.video.paused && !v) {
                this.video.pause()
            }
        })
        onStateValueChange(this, this.volume, v => {
            if (v !== this.video.volume) this.video.volume = v
        })
        onStateValueChange(this, this.currentTime, v => {
            if (v !== this.video.currentTime) this.video.currentTime = v
        })
        onStateValueChange(this, this.source, v => this.video.src = v)
        onStateValueChange(this, this.muted, v => this.video.muted = v)
        onStateValueChange(this, this.loop, v => this.video.loop = v)
        onStateValueChange(this, this.preload, v => this.video.preload = v)
        onStateValueChange(this, this.poster, v => this.video.poster = v)
        onStateValueChange(this, this.controls, v => this.video.controls = v)
        onStateValueChange(this, this.playbackRate, v => {
            this.video.playbackRate = v
        })
        onStateValueChange(this, this.defaultPlaybackRate, v => this.video.defaultPlaybackRate = v)
        onStateValueChange(this, this.crossOrigin, v => this.video.crossOrigin = v)

        onStateValueChange(this, this.autoplay, v => {
            this.video.autoplay = v
            this.video.load()
        })

        onStateValueChange(this, this.isFullscreen, v => {
            if (v !== this.isInFullscreen) {
                if (v) {
                    this.switchToFullscreen()
                } else {
                    this.exitFromFullscreen()
                }
            }
        })
    }


    get isInFullscreen() {
        return !!(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement)
    }


    switchToFullscreen() {
        if (this.video.requestFullscreen) {
            this.video.requestFullscreen();
        } else if (this.video.mozRequestFullScreen) {
            this.video.mozRequestFullScreen();
        } else if (this.video.webkitRequestFullscreen) {
            this.video.webkitRequestFullscreen();
        } else if (this.video.msRequestFullscreen) { 
            this.video.msRequestFullscreen();
        }
    }

    exitFromFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }

    connectedCallback() {
        this.video.addEventListener('canplay', this.onCanPlay)
        this.video.addEventListener('seeking', this.onSeeking)
        this.video.addEventListener('abort', this.onAbort)
        this.video.addEventListener('canplaythrough', this.onCanPlayThrough)
        this.video.addEventListener('durationchange', this.onDurationChange)
        this.video.addEventListener('ended', this.onEnded)
        this.video.addEventListener('error', this.onError)
        this.video.addEventListener('loadeddata', this.onLoadedData)
        this.video.addEventListener('loadedmetadata', this.onLoadedMetadata)
        this.video.addEventListener('loadstart', this.onLoadStart)
        this.video.addEventListener('pause', this.onPause)
        this.video.addEventListener('play', this.onPlay)
        this.video.addEventListener('playing', this.onPlaying)
        this.video.addEventListener('progress', this.onProgress)
        this.video.addEventListener('ratechange', this.onRateChange)
        this.video.addEventListener('seeked', this.onSeeked)
        this.video.addEventListener("stalled", this.onStalled)
        this.video.addEventListener("suspend", this.onSuspend)
        this.video.addEventListener("timeupdate", this.onTimeUpdate)
        this.video.addEventListener("volumechange", this.onVolumeChange)
        this.video.addEventListener("waiting", this.onWaiting)
        this.video.addEventListener('fullscreenchange', this.onFullscreenChange)
    }

    disconnectedCallback() {
        this.video.removeEventListener('canplay', this.onCanPlay)
        this.video.removeEventListener('seeking', this.onSeeking)
        this.video.removeEventListener('abort', this.onAbort)
        this.video.removeEventListener('canplaythrough', this.onCanPlayThrough)
        this.video.removeEventListener('durationchange', this.onDurationChange)
        this.video.removeEventListener('ended', this.onEnded)
        this.video.removeEventListener('error', this.onError)
        this.video.removeEventListener('loadeddata', this.onLoadedData)
        this.video.removeEventListener('loadedmetadata', this.onLoadedMetadata)
        this.video.removeEventListener('loadstart', this.onLoadStart)
        this.video.removeEventListener('pause', this.onPause)
        this.video.removeEventListener('play', this.onPlay)
        this.video.removeEventListener('playing', this.onPlaying)
        this.video.removeEventListener('progress', this.onProgress)
        this.video.removeEventListener('ratechange', this.onRateChange)
        this.video.removeEventListener('seeked', this.onSeeked)
        this.video.removeEventListener("stalled", this.onStalled)
        this.video.removeEventListener("suspend", this.onSuspend)
        this.video.removeEventListener("timeupdate", this.onTimeUpdate)
        this.video.removeEventListener("volumechange", this.onVolumeChange)
        this.video.removeEventListener("waiting", this.onWaiting)
        this.video.removeEventListener('fullscreenchange', this.onFullscreenChange)
    }
}



function Video({ 
    source, 
    autoplay=false,
    isPlaying=false,
    controls=true, 
    onCanPlay=null,
    onAbort=null,
    onCanPlayThrough=null,
    onDurationChange=null,
    onEnded=null,
    onError=null,
    onLoadedData=null,
    onLoadedMetadata=null,
    onLoadStart=null,
    onPause=null,
    onPlay=null,
    onPlaying=null,
    onProgress=null,
    onRateChange=null,
    onSeeked=null,
    onSeeking=null,
    onStalled=null,
    onSuspend=null,
    onTimeUpdate=null,
    onVolumeChange=null,
    onWaiting=null,
    onFullscreenChange=null,

    volume=1,
    currentTime=0,
    muted=false,
    loop=false,
    preload=false,
    poster=null,
    playbackRate=1,
    defaultPlaybackRate=1,
    crossOrigin=null,
    isFullscreen=false,
    subtitles=[],
    modifier=Modifier() 
}, scope) {
    if (!WebComponent.wasRegistered("compose-video")) {
        window.customElements.define('compose-video', ComposeVideo)
    }
    const doc = new ComposeVideo({ 
        source, 
        autoplay,
        isPlaying,
        controls,
        onCanPlay, 
        onAbort,
        onCanPlayThrough,
        onDurationChange,
        onEnded,
        onError,
        onLoadedData,
        onLoadedMetadata,
        onLoadStart,
        onPause,
        onPlay,
        onPlaying,
        onProgress,
        onRateChange,
        onSeeked,
        onSeeking,
        onStalled,
        onSuspend,
        onTimeUpdate,
        onVolumeChange,
        onWaiting,
        volume,
        currentTime,
        muted,
        loop,
        preload,
        poster,
        playbackRate,
        defaultPlaybackRate,
        crossOrigin,
        isFullscreen,
        onFullscreenChange,
        subtitles
    })
    modifier.$apply(doc)

    if (scope === undefined) {
        console.error("Video must be used with a parent scope");
        return
    }
    scope.addChild(doc)
}

export { Video }
