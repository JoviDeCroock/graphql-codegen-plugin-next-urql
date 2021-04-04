import glob from "tiny-glob";
import path from "path";
import { extractOperations } from "../src/operations/extract";

describe("fixtures", () => {
  it("should extract from a simple dir", async () => {
    const p = path.resolve(__dirname, "simple");
    const files = await glob(`${p}/pages/*.{js,jsx,tsx}`);
    const result = await extractOperations(p, files, false);

    expect(result).toMatchInlineSnapshot(`
      Object {
        "test\\\\simple\\\\pages\\\\index.tsx_queries.ts": "export const test\\\\simple\\\\pages\\\\index.tsx_query_0 = gql\`
        query todos {
          todos {
            id
            title
          }
        }
      \`",
      }
    `);
  });

  it("should extract from a simple dir", async () => {
    const p = path.resolve(__dirname, "imports");
    const files = await glob(`${p}/pages/*.{js,jsx,tsx}`);
    const result = await extractOperations(p, files, false);

    expect(result).toMatchInlineSnapshot(`
      Object {
        "test\\\\imports\\\\pages\\\\index.tsx_queries.ts": "export const test\\\\imports\\\\pages\\\\index.tsx_query_0 = gql\`
        query config {
          config {
            site_name
          }
        }
      \`
      export const C:\\\\Users\\\\jovid\\\\Desktop\\\\graphql-codegen-plugin-next-urql\\\\test\\\\imports\\\\components\\\\Todos.tsx_query_0 = gql\`
        query todos {
          todos {
            id
            title
          }
        }
      \`",
      }
    `);
  });
});
