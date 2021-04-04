import glob from "tiny-glob";
import path from "path";
import { extractOperations } from "../src/operations/extract";

describe("fixtures", () => {
  it("should extract from a simple dir", async () => {
    const p = path.resolve(__dirname, "simple");
    const files = await glob(`${p}/*.{js,jsx,tsx}`);
    const result = await extractOperations(p, files, false);

    expect(result).toMatchInlineSnapshot(`
      Object {
        "test\\\\simple\\\\index.tsx_queries.ts": "[
        {
          \\"id\\": \\"test\\\\\\\\simple\\\\\\\\index.tsx_query_TODOS_QUERY\\",
          \\"query\\": \\"export const test\\\\\\\\simple\\\\\\\\index.tsx_query_TODOS_QUERY = gql\`\\\\n  query todos {\\\\n    todos {\\\\n      id\\\\n      title\\\\n    }\\\\n  }\\\\n\`\\",
          \\"variables\\": []
        }
      ]",
      }
    `);
  });

  it("should extract from a simple dir", async () => {
    const p = path.resolve(__dirname, "imports");
    const files = await glob(`${p}/pages/*.{js,jsx,tsx}`);
    const result = await extractOperations(p, files, false);

    expect(result).toMatchInlineSnapshot(`
      Object {
        "test\\\\imports\\\\pages\\\\index.tsx_queries.ts": "[
        {
          \\"id\\": \\"test\\\\\\\\imports\\\\\\\\pages\\\\\\\\index.tsx_query_CONFIG_QUERY\\",
          \\"query\\": \\"export const test\\\\\\\\imports\\\\\\\\pages\\\\\\\\index.tsx_query_CONFIG_QUERY = gql\`\\\\n  query config {\\\\n    config {\\\\n      site_name\\\\n    }\\\\n  }\\\\n\`\\",
          \\"variables\\": []
        },
        {
          \\"id\\": \\"C:\\\\\\\\Users\\\\\\\\jovid\\\\\\\\Desktop\\\\\\\\graphql-codegen-plugin-next-urql\\\\\\\\test\\\\\\\\imports\\\\\\\\components\\\\\\\\Todos.tsx_query_TODOS_QUERY\\",
          \\"query\\": \\"export const C:\\\\\\\\Users\\\\\\\\jovid\\\\\\\\Desktop\\\\\\\\graphql-codegen-plugin-next-urql\\\\\\\\test\\\\\\\\imports\\\\\\\\components\\\\\\\\Todos.tsx_query_TODOS_QUERY = gql\`\\\\n  query todos ($from: Int) {\\\\n    todos (from: $from, limit: 10) {\\\\n      id\\\\n      title\\\\n    }\\\\n  }\\\\n\`\\",
          \\"variables\\": [
            \\"from\\"
          ]
        }
      ]",
      }
    `);
  });
});
