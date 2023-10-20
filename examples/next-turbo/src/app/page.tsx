"use client";

import styles from "./page.module.css";

import dynamic from "next/dynamic";

const Editor = dynamic(async () => (await import("./editor")).Editor, {
  ssr: false,
});

/**
 * json4!
 */

/**
 * json5!
 */

// Hot Module Replacement
// if (module.hot) {
//   module.hot.accept();
// }

export default function Home() {
  return (
    <main className={styles.main}>
      <Editor />
    </main>
  );
}
