addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// 配置可以设置不同的目标URL
const PROXY_CONFIG = {
  '/proxy/': 'https://github.com/',
  //'/sentry/': 'https://o4508470196371456.ingest.us.sentry.io/',
}

async function handleRequest(request) {
  const url = new URL(request.url)

  // 遍历配置，寻找匹配的路径前缀
  for (const [pathPrefix, targetUrl] of Object.entries(PROXY_CONFIG)) {
    if (url.pathname.startsWith(pathPrefix)) {
      // 从请求中提取路径
      const targetPath = url.pathname.substring(pathPrefix.length)

      // 构建完整的目标 URL
      const fullTargetUrl = `${targetUrl}${targetPath}`

      // 转发请求到对应的目标
      const response = await fetch(fullTargetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.method === 'POST' ? request.body : undefined,
        redirect: 'follow'
      })

      // 返回目标的响应
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      })
    }
  }

  // 如果没有匹配的路径，返回 404
  return new Response('Not Found', { status: 404 })
}

