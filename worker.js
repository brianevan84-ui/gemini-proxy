export default {
  async fetch(request) {
    try {
      const url = new URL(request.url);
      if (url.pathname === "/" || url.pathname === "") {
        return new Response("Gemini proxy is running.", {
          status: 200,
          headers: { "content-type": "text/plain; charset=utf-8" },
        });
      }
      url.hostname = "generativelanguage.googleapis.com";
      url.protocol = "https:";
      url.port = "";
      const proxied = new Request(url.toString(), request);
      proxied.headers.set("Host", "generativelanguage.googleapis.com");
      const resp = await fetch(proxied);
      const out = new Response(resp.body, resp);
      out.headers.set("Access-Control-Allow-Origin", "*");
      return out;
    } catch (err) {
      return new Response(
        JSON.stringify({ error: "proxy_error", message: String(err) }),
        { status: 502, headers: { "content-type": "application/json" } }
      );
    }
  },
};
