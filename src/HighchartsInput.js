import React from "react";
import PatchEvent, {
  setIfMissing,
  set,
  unset
} from "part:@sanity/form-builder/patch-event";

export default class HighchartsInput extends React.Component {
  state = {
    // Reference to editor instance running inside iframe.
    editor: null,
    // We store svg and html representations of the chart in local state. When
    // unmounting we save that date to Sanity. This solves an issue with distorted
    // graphs caused by doing graph exports right as the modal was closing.
    svgStr: "",
    htmlStr: ""
  };

  componentWillUnmount() {
    // when unloading we save the iframe data.
    this.saveProjectData();
  }

  componentDidMount() {
    const mountNode = document.getElementById("highed-mountpoint");
    const iframe = document.createElement("iframe");
    iframe.setAttribute("width", "100%");
    iframe.setAttribute("height", "800px");
    iframe.setAttribute("id", "highed-editor");
    iframe.setAttribute(
      "src",
      "/static/highcharts-assets/highcharts-iframe-content.html"
    );
    iframe.onload = () => this.onEditorIframeLoaded(iframe);
    mountNode.appendChild(iframe);
  }

  chartChangeHandler = () => {
    const { editor } = this.state;
    if (!editor) {
      return;
    }
    this.setState({
      svgStr: editor.getEmbeddableSVG(),
      htmlStr: editor.getEmbeddableHTML()
    });
  };

  onEditorIframeLoaded = iframe => {
    iframe.contentWindow.editorReadyCallback = editor => {
      window.highchartsEditorInstance = editor;
      editor.on("ChartChangedLately", this.chartChangeHandler);
      this.setState({ editor }, this.loadProjectData);
    };
  };

  loadProjectData = () => {
    const { editor } = this.state;
    if (!editor) {
      return;
    }
    const { value: { editorConfigWithData } = {} } = this.props;
    if (!editorConfigWithData) {
      return;
    }
    try {
      editor.chart.loadProject(JSON.parse(editorConfigWithData));
    } catch (e) {
      console.log("Failed to load higcharts editor", e);
    }
  };

  saveProjectData = () => {
    const { editor, htmlStr, svgStr } = this.state;
    if (!editor) {
      return;
    }
    const jsonStr = JSON.stringify(editor.chart.options.full);
    const editorConfigWithData = editor.chart.toProjectStr();
    const patches = PatchEvent.from([
      setIfMissing({}),
      jsonStr ? set(jsonStr, ["jsonStr"]) : unset(["jsonStr"]),
      editorConfigWithData
        ? set(editorConfigWithData, ["editorConfigWithData"])
        : unset(["editorConfigWithData"]),
      htmlStr ? set(htmlStr, ["htmlStr"]) : unset(["htmlStr"]),
      svgStr ? set(svgStr, ["svgStr"]) : unset(["svgStr"])
    ]);
    this.props.onChange(patches);
  };

  render() {
    return <div id="highed-mountpoint" />;
  }
}
