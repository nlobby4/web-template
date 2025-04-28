import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from "url";
import ngrok, { authtoken } from 'ngrok';
import qrcode from 'qrcode-terminal';

export default class IngressManager {
  static __filename = fileURLToPath(import.meta.url);
  static __dirname = path.dirname(__filename);

  static INIT() {
    try {
      const PORT = 8080;
      const token = process.env.NGROK_AUTH_TOKEN;
      dotenv.config({ path: path.resolve(__dirname, '.env') });

      await ngrok.authtoken(token);
      const url = await ngrok.connect(PORT);
      console.log(`Ingress established at: ${url}`);
      console.log(`Ngrok public URL: ${url}`);
      qrcode.generate(url, { small: true });
    } catch (err) {
      console.error("Ngrok error:", err.message);
    }
  }
}
