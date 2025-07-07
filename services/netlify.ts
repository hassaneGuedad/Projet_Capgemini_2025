import axios from "axios";

type NetlifySiteResponse = { site_id: string };

const NETLIFY_TOKEN = process.env.NETLIFY_TOKEN!;

export async function deployToNetlify(zipBuffer: Buffer, siteName: string): Promise<string> {
  const res = await axios.post(
    "https://api.netlify.com/api/v1/sites",
    { name: siteName },
    { headers: { Authorization: `Bearer ${NETLIFY_TOKEN}` } }
  );
  const data = res.data as NetlifySiteResponse;
  const siteId = data.site_id;

  await axios.post(
    `https://api.netlify.com/api/v1/sites/${siteId}/deploys`,
    zipBuffer,
    {
      headers: {
        Authorization: `Bearer ${NETLIFY_TOKEN}`,
        "Content-Type": "application/zip"
      }
    }
  );
  return `https://${siteName}.netlify.app`;
}