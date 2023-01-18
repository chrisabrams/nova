import type { NovaViewConfig } from "nova/core/views/types.ts";

const PostPage = () => {
  return <div>A post</div>;
};

export default PostPage;

export const config: NovaViewConfig = {
  id: "post",
};
