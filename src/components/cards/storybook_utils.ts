import { vi } from 'storybook/test'
import type { Decorator } from '@storybook/vue3'

export const cardWidthDecorator: Decorator = () => ({
  template: '<div style="max-width: 320px; margin: 20px;"><story /></div>'
})

export function mockDateSetup(activeDate: Date) {
  return {
    beforeEach() {
      vi.useFakeTimers({ toFake: ['Date'] })
      vi.setSystemTime(activeDate)
      return () => vi.useRealTimers()
    }
  }
}
