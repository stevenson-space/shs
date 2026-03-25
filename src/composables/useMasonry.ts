import { onMounted, onUnmounted, type Ref } from 'vue'

export function useMasonry(containerRef: Ref<HTMLElement | null>) {
  const ROW_HEIGHT = 5

  let resizeObserver: ResizeObserver
  let childObserver: MutationObserver

  function recalculate() {
    const el = containerRef.value
    if (!el) return

    for (const child of el.children) {
      const item = child as HTMLElement
      item.style.gridRow = ''
    }
    el.style.gridAutoRows = 'auto'
    void el.offsetHeight

    for (const child of el.children) {
      const item = child as HTMLElement
      const span = Math.ceil(item.offsetHeight / ROW_HEIGHT) + 2
      item.style.gridRow = `span ${span}`
    }

    el.style.gridAutoRows = `${ROW_HEIGHT}px`
  }

  function observe() {
    const el = containerRef.value
    if (!el) return
    resizeObserver.disconnect()
    for (const child of el.children) {
      resizeObserver.observe(child)
    }
  }

  onMounted(() => {
    if (!containerRef.value) return

    resizeObserver = new ResizeObserver(() => recalculate())
    childObserver = new MutationObserver(() => {
      observe()
      recalculate()
    })

    observe()
    childObserver.observe(containerRef.value, { childList: true })
    recalculate()
  })

  onUnmounted(() => {
    resizeObserver?.disconnect()
    childObserver?.disconnect()
  })

  return { recalculate }
}
