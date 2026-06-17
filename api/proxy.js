export default async function handler(req, res) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 从 Vercel 环境变量里读取 Key，不暴露给前端
  const DIFY_API_KEY = process.env.DIFY_API_KEY;
  if (!DIFY_API_KEY) {
    return res.status(500).json({ error: 'API Key未配置' });
  }

  try {
    const { device_name, category, price, purchase_date } = req.body;

    const response = await fetch('https://api.dify.ai/v1/workflows/run', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DIFY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: { device_name, category, price: Number(price), purchase_date },
        response_mode: 'blocking',
        user: 'asset-ledger-user'
      })
    });

    if (!response.ok) {
      throw new Error(`Dify返回错误: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
