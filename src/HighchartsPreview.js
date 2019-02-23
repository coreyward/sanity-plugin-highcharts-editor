import React from "react";
import styles from "./HighchartsPreview.css";

const HighChartsPreview = ({ value: { svgStr } = {} }) => {
  if (!svgStr) {
    return <p>No chart data to load</p>;
  }
  return (
    <div
      className={styles.chartSvg}
      dangerouslySetInnerHTML={{ __html: svgStr }}
    />
  );
};

export default HighChartsPreview;
