import { beforeEach, afterEach, describe, expect, test } from 'vitest'
import { useSrsStore } from '../srs'

beforeEach(() => {
  useSrsStore.setState({ byWordId: {}, intervalsDays: [1,2,4], getState: useSrsStore.getState().getState, recordResult: useSrsStore.getState().recordResult, resetWord: useSrsStore.getState().resetWord, resetAll: useSrsStore.getState().resetAll })
})

afterEach(() => {
  useSrsStore.getState().resetAll()
})

describe('srs store', () => {
  test('promote on correct, demote on wrong', () => {
    const id = 'w1'
    const day1 = new Date(2024, 0, 1)
    useSrsStore.getState().recordResult(id, true, day1)
    let st = useSrsStore.getState().getState(id)
    expect(st.box).toBe(1)

    const day2 = new Date(2024, 0, 2)
    useSrsStore.getState().recordResult(id, true, day2)
    st = useSrsStore.getState().getState(id)
    expect(st.box).toBe(2)

    const day3 = new Date(2024, 0, 4)
    useSrsStore.getState().recordResult(id, false, day3)
    st = useSrsStore.getState().getState(id)
    expect(st.box).toBe(0)
  })
})