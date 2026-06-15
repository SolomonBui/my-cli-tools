import http from "node:http";
import https from "node:https";
import { URL } from "node:url";

const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;

if (proxyUrl) {
  const proxy = new URL(proxyUrl);

  globalThis.fetch = async function(url, options = {}) {
    const target = new URL(url);

    return new Promise((resolve, reject) => {
      const connectOpts = {
        host: proxy.hostname,
        port: proxy.port,
        method: "CONNECT",
        path: target.hostname + ":" + (target.port || 443),
        headers: { Host: target.hostname + ":" + (target.port || 443) },
      };

      if (proxy.username) {
        const auth = Buffer.from(decodeURIComponent(proxy.username) + ":" + decodeURIComponent(proxy.password)).toString("base64");
        connectOpts.headers["Proxy-Authorization"] = "Basic " + auth;
      }

      const req = http.request(connectOpts);

      req.on("connect", (res, socket) => {
        if (res.statusCode !== 200) {
          socket.destroy();
          reject(new Error("Proxy CONNECT failed: " + res.statusCode));
          return;
        }

        const agent = new https.Agent({ socket, rejectUnauthorized: false });

        const reqOpts = {
          hostname: target.hostname,
          port: target.port || 443,
          path: target.pathname + target.search,
          method: options.method || "GET",
          headers: Object.assign({}, options.headers || {}),
          agent,
        };

        const httpsReq = https.request(reqOpts, (httpsRes) => {
          const chunks = [];
          httpsRes.on("data", (chunk) => { chunks.push(chunk); });
          httpsRes.on("end", () => {
            const body = Buffer.concat(chunks);
            const headers = {};
            for (const [k, v] of Object.entries(httpsRes.headers)) { headers[k] = Array.isArray(v) ? v.join(", ") : v; }
            resolve(new Response(body, {
              status: httpsRes.statusCode,
              statusText: httpsRes.statusMessage || "",
              headers: headers,
            }));
          });
        });

        httpsReq.on("error", reject);
        if (options.body) httpsReq.write(options.body);
        httpsReq.end();
      });

      req.on("error", reject);
      req.end();
    });
  };
}

const entry = new URL("index.js", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");
await import("file:///" + entry);
