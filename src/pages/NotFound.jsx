import React from "react";
import {Link} from "react-router-dom";
import Footer from "./components/footer";

export default function NotFound() {
  return (
    <>
      <div
        style={{
          minHeight: "70vh",
          display: "grid",
          placeItems: "center",
          padding: "96px 24px",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div style={{textAlign: "center", maxWidth: 480}}>
          <h1
            style={{fontSize: 28, fontWeight: 700, color: "#111827", margin: 0}}
          >
            We can't find that page
          </h1>
          <p
            style={{
              fontSize: 16,
              color: "#4B5563",
              lineHeight: 1.5,
              margin: "12px 0 24px",
            }}
          >
            The address may have changed or may not exist. You can return to
            Protiba and carry on from there.
          </p>
          <Link
            to="/"
            style={{
              display: "inline-block",
              background: "#0b69ff",
              color: "#fff",
              padding: "12px 20px",
              borderRadius: 8,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Go to Protiba
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
