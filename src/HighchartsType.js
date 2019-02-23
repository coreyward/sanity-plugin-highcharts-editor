import HighchartsInput from "./HighchartsInput";
import HighchartsPreview from "./HighchartsPreview";

export default {
  name: "highcharts",
  title: "Highcharts",
  type: "object",
  inputComponent: HighchartsInput,
  preview: {
    select: { svgStr: "svgStr" },
    component: HighchartsPreview
  },
  options: {
    editModal: "fullscreen"
  },
  fields: [
    { name: "htmlStr", readOnly: true, type: "string" },
    { name: "jsonStr", readOnly: true, type: "string" },
    { name: "svgStr", readOnly: true, type: "string" },
    { name: "editorConfigWithData", readOnly: true, type: "string" }
  ]
};
