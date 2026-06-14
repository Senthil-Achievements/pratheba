import analyzeHandler from './netlify/functions/analyze.js';

class MockRequest {
  constructor() {
    this.method = 'POST';
  }
  async formData() {
    return {
      get: (key) => {
        if (key === 'jobDescription') return 'react frontend developer';
        if (key === 'file') return {
          name: 'test.txt',
          arrayBuffer: async () => new TextEncoder().encode('John Doe\nExperience: 5 years React Developer. Skills: React, Node, CSS, HTML, JavaScript').buffer
        };
        return '';
      }
    };
  }
}

async function run() {
  try {
    const req = new MockRequest();
    console.log("Starting analysis...");
    const start = Date.now();
    const res = await analyzeHandler(req, {});
    console.log(`Finished in ${Date.now() - start}ms`);
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Body length:", text.length);
    if (res.status !== 200) console.log("Body:", text);
    else console.log(text.slice(0, 100));
  } catch (e) {
    console.error("Function threw an uncaught error:");
    console.error(e);
  }
}

run();
