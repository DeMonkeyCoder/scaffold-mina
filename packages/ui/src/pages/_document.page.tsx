import { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Mina Scaffold</title>
        <link rel="icon" href="/assets/favicon.ico" />
      </Head>
      <body>
        <Main />
        <Script
          src="/coi-serviceworker.min.js"
          strategy="afterInteractive"
        ></Script>
        <NextScript />
      </body>
    </Html>
  );
}
