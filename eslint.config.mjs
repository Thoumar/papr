import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import perfectionist from "eslint-plugin-perfectionist";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      perfectionist,
    },
    rules: {
      "perfectionist/sort-union-types": [
        "error",
        {
          type: "line-length",
          order: "asc",
          ignoreCase: true,
        },
      ],
      "perfectionist/sort-object-types": [
        "error",
        {
          type: "line-length",
          order: "asc",
          ignoreCase: true,
        },
      ],
      "perfectionist/sort-enums": [
        "error",
        {
          type: "line-length",
          ignoreCase: true,
        },
      ],
      "perfectionist/sort-classes": [
        "error",
        {
          type: "line-length",
          ignoreCase: true,
        },
      ],
      "perfectionist/sort-maps": [
        "error",
        {
          type: "line-length",
          order: "asc",
          ignoreCase: true,
        },
      ],
      "perfectionist/sort-exports": [
        "error",
        {
          type: "line-length",
          order: "asc",
          ignoreCase: true,
        },
      ],
      "perfectionist/sort-jsx-props": [
        "error",
        {
          type: "line-length",
          order: "asc",
          ignoreCase: true,
        },
      ],
      "perfectionist/sort-interfaces": [
        "error",
        {
          type: "line-length",
          order: "asc",
          ignoreCase: true,
        },
      ],
      "perfectionist/sort-named-exports": [
        "error",
        {
          type: "line-length",
          order: "asc",
          ignoreCase: true,
        },
      ],
      "perfectionist/sort-named-imports": [
        "error",
        {
          type: "line-length",
          order: "asc",
          ignoreCase: true,
        },
      ],
      "perfectionist/sort-array-includes": [
        "error",
        {
          type: "line-length",
          order: "asc",
          ignoreCase: true,
        },
      ],
      "perfectionist/sort-objects": [
        "error",
        {
          type: "line-length",
          order: "asc",
          ignoreCase: true,
          groups: ["id", "unknown"],
          customGroups: {
            id: ["id", "uuid", "type"],
          },
        },
      ],
      "perfectionist/sort-imports": [
        "error",
        {
          type: "line-length",
          order: "asc",
          newlinesBetween: "always",
          groups: [
            "react",
            "papr",
            "at",
            "external",
            "next",
            "internals",
            "siblings",
            "style",
          ],
          customGroups: {
            value: {
              papr: ["@papr/*"],
              react: ["react", "react-*"],
              next: ["next", "next", "next/*"],
              at: ["@mui/*", "@fullcalendar/*", "@fullcalendar/react"],
              style: ["/*.css", "/*.scss", "/*.sass", "/*.module.sass"],
              siblings: [
                "./*",
                "../*",
                "../../*",
                "../../../*",
                "../../../../*",
                "..",
              ],
              internals: [
                "services",
                "assets",
                "types",
                "services",
                "hooks",
                "helpers",
                "components",
                "config",
              ],
            },
          },
        },
      ],
    },
  },
];

export default eslintConfig;
