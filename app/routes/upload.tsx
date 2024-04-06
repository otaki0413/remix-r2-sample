import {
  type ActionFunctionArgs,
  json,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/cloudflare";

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const { R2 } = context.cloudflare.env;
  const uploadHandler = unstable_createMemoryUploadHandler({
    maxPartSize: 1024 * 1024 * 10,
  });
  const form = await unstable_parseMultipartFormData(request, uploadHandler);
  const file = form.get("file") as Blob;
  const response = await R2.put("file", await file.arrayBuffer(), {
    httpMetadata: {
      contentType: file.type,
    },
  });
  return json({ object: response });
};

export default function Index() {
  return (
    <div>
      <div>
        <form method="POST" encType="multipart/form-data">
          <input type="file" name={"file"} />
          <button type={"submit"}>送信</button>
        </form>
      </div>
      <div>
        <img src="/images/file" alt="" />
      </div>
    </div>
  );
}
