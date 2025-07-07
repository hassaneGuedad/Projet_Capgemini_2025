import { deployToNetlify } from "@/services/netlify";
import JSZip from "jszip";
import { GeneratedFile } from "@/types/agents";

export async function DeployAgent(files: GeneratedFile[], siteName: string): Promise<string> {
  const zip = new JSZip();
  files.forEach(file => {
    zip.file(file.path, file.content);
  });
  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
  return await deployToNetlify(zipBuffer, siteName);
}