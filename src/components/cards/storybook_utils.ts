import type { Decorator } from '@storybook/vue3'

export const cardWidthDecorator: Decorator = () => ({
  template: '<div style="max-width: 320px; margin: 20px;"><story /></div>'
})

export const wrapDecorator = (style: string): Decorator => () => ({
  template: `<div style="${style}"><story /></div>`,
})

export function mockDateSetup(activeDate: Date) {
  return {
    beforeEach() {
      const OriginalDate = globalThis.Date
      const fixedMs = activeDate.getTime()

      const MockDate = class extends OriginalDate {
        constructor(...args: any[]) {
          if (args.length === 0) {
            super(fixedMs)
          } else {
            super(...args as [])
          }
        }
        static now() { return fixedMs }
      }

      globalThis.Date = MockDate as unknown as typeof Date

      return () => { globalThis.Date = OriginalDate }
    }
  }
}
