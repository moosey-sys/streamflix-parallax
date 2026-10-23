import React, { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
const Studio = lazy(() => import("./experience/Studio"));
const Account = lazy(() => import("./experience/Account"));
const Watch = lazy(() => import("./experience/Watch"));
const studioPaths = [
  "/dashboard",
  "/admin",
  "/user",
  "/order",
  "/movies",
  "/tvshow",
  "/trending",
  "/movieform",
  "/trendingform",
  "/tvshowform",
  "/editMovie/:movieId",
  "/editTvshow/:movieId",
  "/editTrending/:movieId",
  "/userTable",
];
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="route-loading" role="status">
            Loading Streamflix…
          </div>
        }
      >
        <Routes>
          {studioPaths.map((path) => (
            <Route key={path} path={path} element={<Studio />} />
          ))}
          {["/sign-in", "/sign-up", "/sign-out"].map((path) => (
            <Route key={path} path={path} element={<Account />} />
          ))}
          {[
            "/play/:id",
            "/details/:id",
            "/trendingDetails/:id",
            "/tvshowDetails/:id",
          ].map((path) => (
            <Route key={path} path={path} element={<Watch />} />
          ))}
          <Route path="*" element={<App />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>,
);
