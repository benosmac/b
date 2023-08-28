// Handle Page in/out transitions
const bodyEl = document.getElementById('body')
if (!document.startViewTransition) {
    console.log('no vt')
    document.addEventListener('DOMContentLoaded', (event) => {
        bodyEl?.classList.remove('transition')
    })
} else {
    console.log('vt')
    document.addEventListener('astro:load', (event) => {
        bodyEl?.classList.add('yt')
        bodyEl?.classList.remove('transition')
    })
}
