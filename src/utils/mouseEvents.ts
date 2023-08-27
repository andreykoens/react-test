export const eventClipboardCopy = (posX: number, posY: number) => {
  let el = document.createElement('div')
  el.id = 'AnimCopy'
  setTimeout(() => {
    el.remove()
  }, 900)
  setTimeout(() => {
    el.style.opacity = '1'
    el.style.transform = 'translateY(-90px) scale(1.1) rotate(5deg)'
  }, 50)
  setTimeout(() => {
    el.style.opacity = '0'
  }, 700)

  Object.assign(el.style, {
    display: 'block',
    position: 'absolute',
    pointerEvents: 'none',
    fontSize: '120px',
    opacity: 0,
    top: String(`${posY - 80}px`),
    left: String(`${posX - 80}px`),
    zIndex: String(999999),
    transform: 'scale(0.6) rotate(-30deg)',
    transition: 'all 100ms ease-in-out',
  })
  el.textContent = '📋'
  document.getElementById('LayoutWrap').append(el)
}
