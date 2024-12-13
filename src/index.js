addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)

  // 检查请求的路径
  if (url.pathname.startsWith('/proxy/')) {
    // 从请求中提取 GitHub 链接部分
    const githubPath = url.pathname.substring('/proxy/'.length)

    // 构建完整的 GitHub URL
    const githubUrl = `https://github.com/${githubPath}`

    // 转发请求到 GitHub
    const response = await fetch(githubUrl, {
      method: request.method,
      headers: request.headers,
      body: request.method === 'POST' ? request.body : undefined,
      redirect: 'follow'
    })

    // 返回 GitHub 的响应
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    })
  } else {
    return new Response('Not Found', { status: 404 })
  }
}

