import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
  const key = params.key;
  if (key == null) {
    return json({ message: "Object not found" }, { status: 404 });
  }

  const { R2 } = context.cloudflare.env;
  const object = await R2.get(key);
  if (object == null) {
    return json({ message: "Object not found" }, { status: 404 });
  }
  const headers: HeadersInit = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.etag);
  return new Response(object.body, { headers });
};
