import fs from 'fs';

async function run() {
  const formData = new FormData();
  formData.append('jobDescription', 'react frontend developer');
  
  // create dummy txt file blob
  const fileContent = "John Doe\\nExperience: 5 years React Developer. Skills: React, Node, CSS, HTML, JavaScript";
  const blob = new Blob([fileContent], { type: 'text/plain' });
  formData.append('file', blob, 'test.txt');

  console.log("Sending to live Netlify...");
  const start = Date.now();
  const res = await fetch("https://resumescanatschecker.netlify.app/api/analyze", {
    method: "POST",
    body: formData
  });
  console.log(`Finished in ${Date.now() - start}ms`);
  console.log("Status:", res.status);
  const text = await res.text();
  console.log("Body:", text.substring(0, 500));
}

run();
