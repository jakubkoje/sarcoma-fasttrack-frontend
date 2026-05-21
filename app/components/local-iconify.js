import { h } from "vue";

const paths = {
  "lucide-arrow-left": [["path", { d: "M19 12H5" }], ["path", { d: "m12 19-7-7 7-7" }]],
  "lucide-arrow-right": [["path", { d: "M5 12h14" }], ["path", { d: "m12 5 7 7-7 7" }]],
  "lucide-book-open": [["path", { d: "M12 7v14" }], ["path", { d: "M3 5a7 7 0 0 1 9 2 7 7 0 0 1 9-2v14a7 7 0 0 0-9 2 7 7 0 0 0-9-2z" }]],
  "lucide-chart-column": [["path", { d: "M4 20h16" }], ["path", { d: "M7 16V9" }], ["path", { d: "M12 16V4" }], ["path", { d: "M17 16v-5" }]],
  "lucide-check": [["path", { d: "m5 12 4 4L19 6" }]],
  "lucide-chevron-down": [["path", { d: "m6 9 6 6 6-6" }]],
  "lucide-flask-conical": [["path", { d: "M10 2v6L4 19a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3L14 8V2" }], ["path", { d: "M8 2h8" }], ["path", { d: "M7 16h10" }]],
  "lucide-layout-dashboard": [["rect", { x: "3", y: "3", width: "7", height: "9", rx: "1" }], ["rect", { x: "14", y: "3", width: "7", height: "5", rx: "1" }], ["rect", { x: "14", y: "12", width: "7", height: "9", rx: "1" }], ["rect", { x: "3", y: "16", width: "7", height: "5", rx: "1" }]],
  "lucide-list": [["path", { d: "M8 6h13" }], ["path", { d: "M8 12h13" }], ["path", { d: "M8 18h13" }], ["path", { d: "M3 6h.01" }], ["path", { d: "M3 12h.01" }], ["path", { d: "M3 18h.01" }]],
  "lucide-loader-circle": [["path", { d: "M21 12a9 9 0 1 1-6.2-8.6" }]],
  "lucide-log-in": [["path", { d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" }], ["path", { d: "m10 17 5-5-5-5" }], ["path", { d: "M15 12H3" }]],
  "lucide-log-out": [["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }], ["path", { d: "m16 17 5-5-5-5" }], ["path", { d: "M21 12H9" }]],
  "lucide-plus": [["path", { d: "M12 5v14" }], ["path", { d: "M5 12h14" }]],
  "lucide-refresh-cw": [["path", { d: "M21 12a9 9 0 0 1-15 6.7L3 16" }], ["path", { d: "M3 21v-5h5" }], ["path", { d: "M3 12a9 9 0 0 1 15-6.7L21 8" }], ["path", { d: "M21 3v5h-5" }]],
  "lucide-save": [["path", { d: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" }], ["path", { d: "M17 21v-8H7v8" }], ["path", { d: "M7 3v5h8" }]],
  "lucide-send": [["path", { d: "m22 2-7 20-4-9-9-4Z" }], ["path", { d: "M22 2 11 13" }]],
  "lucide-user-plus": [["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }], ["circle", { cx: "9", cy: "7", r: "4" }], ["path", { d: "M19 8v6" }], ["path", { d: "M22 11h-6" }]],
};

const fallback = [["circle", { cx: "12", cy: "12", r: "9" }], ["path", { d: "M12 8v4l3 3" }]];

export const Icon = {
  name: "LocalIconifyIcon",
  inheritAttrs: false,
  props: {
    icon: { type: String, required: true },
  },
  setup(props, { attrs }) {
    return () => h(
      "svg",
      {
        ...attrs,
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "2",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "aria-hidden": "true",
        focusable: "false",
      },
      (paths[props.icon] || fallback).map(([tag, data]) => h(tag, data)),
    );
  },
};
