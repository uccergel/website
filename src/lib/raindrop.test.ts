import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { RaindropApiError, raindropFetch } from '#/lib/raindrop'

describe('raindropFetch', () => {
  beforeEach(() => {
    vi.stubEnv('RAINDROP_TOKEN', 'test-token')
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('başarılı yanıtta JSON gövdesini döner ve token başlığını gönderir', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ result: true, items: [], count: 0 }), {
        status: 200
      })
    )
    vi.stubGlobal('fetch', fetchMock)

    const data = await raindropFetch<{ count: number }>('/raindrops/1')

    expect(data.count).toBe(0)
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.raindrop.io/rest/v1/raindrops/1',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token'
        })
      })
    )
  })

  it('hata yanıtında durum kodlu RaindropApiError fırlatır, ham gövdeyi mesaja koymaz', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response('{"errorMessage":"gizli ayrinti"}', {
          status: 401,
          statusText: 'Unauthorized'
        })
      )
    )

    const error = await raindropFetch('/raindrops/1').catch((e: unknown) => e)

    expect(error).toBeInstanceOf(RaindropApiError)
    expect((error as RaindropApiError).status).toBe(401)
    expect((error as RaindropApiError).message).toBe(
      'Raindrop API error: 401 Unauthorized'
    )
    expect((error as RaindropApiError).message).not.toContain('gizli ayrinti')
  })
})
