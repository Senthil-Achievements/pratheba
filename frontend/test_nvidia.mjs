const NVIDIA_API_KEY = "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";
const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

async function run() {
  const res = await fetch(NVIDIA_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${NVIDIA_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "meta/llama-3.1-8b-instruct",
      messages: [{ role: "user", content: "Test prompt" }],
      max_tokens: 1500,
      temperature: 0.3,
      top_p: 0.7
    })
  });
  console.log(res.status);
  const text = await res.text();
  console.log(text);
}
run();
