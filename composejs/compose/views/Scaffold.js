import { $ } from "../dom.js"
import { Scope } from "../scope.js"

function Scaffold({
    appBar=null,
    content=null,
    bottomBar=null,
    floatingActionButton=null,
    floatingActionButtonPosition=null
}={}, scope) {

    let scaffold = $(document.createElement('div')).css({
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        position: 'relative',
        overflow: 'hidden'
    })
    .attr("data-view-name", "compose-scaffold")
    
    
    if (appBar) {
        let appBarContainer = document.createElement('div')
        $(appBarContainer).css({
            display: 'flex',
            flexDirection: 'column',
            height: '56px',
            width: '100%',
            position: 'relative',
            overflow: 'hidden'
        })
        .attr("data-view-name", "compose-scaffold-appbar")

        scaffold.append(appBarContainer)
        new Scope(appBarContainer, appBar).compose()
    }


    let contentWrapper = document.createElement('div')
    $(contentWrapper).css({
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        flexGrow: 1,
        width: '100%',
    })
    scaffold.append(contentWrapper)
    

    if (content) {
        let contentContainer = document.createElement('div')
        $(contentContainer).css({
            display: 'flex',
            flexDirection: 'column',
            flexGrow: "1",
            overflow: 'hidden',
            position: 'relative',
            width: '100%'
        })
        .attr("data-view-name", "compose-scaffold-content")

        contentWrapper.append(contentContainer)
        new Scope(contentContainer, content).compose()
    }


    if (bottomBar) {
        let bottomBarContainer = document.createElement('div')
        $(bottomBarContainer).css({
            display: 'flex',
            flexDirection: 'column',
            height: '56px',
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
            marginTop: 'auto'
        })
        .attr("data-view-name", "compose-scaffold-bottombar")

        scaffold.append(bottomBarContainer)
        new Scope(bottomBarContainer, bottomBar).compose()
    }

    if (floatingActionButton) {
        let floatingActionButtonContainer = document.createElement('div')
        $(floatingActionButtonContainer).css({
            display: 'flex',
            flexDirection: 'row',
            position: 'absolute',
        })
        .css(floatingActionButtonPosition || { left: '24px', top: '24px' })
        .attr("data-view-name", "compose-scaffold-floating-action-button")
       
        contentWrapper.append(floatingActionButtonContainer)
        new Scope(floatingActionButtonContainer, floatingActionButton).compose()
    }

    scope.addChild(scaffold[0])
}

export { Scaffold }