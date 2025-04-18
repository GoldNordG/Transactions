/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "(pages-dir-node)/./components/SessionManager.js":
/*!**************************************!*\
  !*** ./components/SessionManager.js ***!
  \**************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ SessionManager)\n/* harmony export */ });\n/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth/react */ \"next-auth/react\");\n/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth_react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/router */ \"(pages-dir-node)/./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! axios */ \"axios\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([axios__WEBPACK_IMPORTED_MODULE_3__]);\naxios__WEBPACK_IMPORTED_MODULE_3__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n// components/SessionManager.js\n\n\n\n // Assurez-vous d'importer axios\nfunction SessionManager() {\n    const { data: session, status } = (0,next_auth_react__WEBPACK_IMPORTED_MODULE_0__.useSession)();\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_1__.useRouter)();\n    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)({\n        \"SessionManager.useEffect\": ()=>{\n            // Gestion de la session expirée\n            if (status === \"unauthenticated\" && !router.pathname.startsWith(\"/login\")) {\n                console.log(\"Session expirée, redirection vers login\");\n                router.push(\"/login?session=expired\");\n            }\n        }\n    }[\"SessionManager.useEffect\"], [\n        status,\n        router\n    ]);\n    // Configurer l'intercepteur Axios pour gérer les erreurs 401\n    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)({\n        \"SessionManager.useEffect\": ()=>{\n            // Ajout d'un intercepteur global pour les réponses Axios\n            const responseInterceptor = axios__WEBPACK_IMPORTED_MODULE_3__[\"default\"].interceptors.response.use({\n                \"SessionManager.useEffect.use[responseInterceptor]\": (response)=>response\n            }[\"SessionManager.useEffect.use[responseInterceptor]\"], {\n                \"SessionManager.useEffect.use[responseInterceptor]\": (error)=>{\n                    // Si on reçoit une erreur 401 (non authentifié)\n                    if (error.response?.status === 401) {\n                        console.log(\"Erreur 401 détectée, redirection vers login\");\n                        // Éviter les boucles infinies si déjà sur la page de login\n                        if (!window.location.pathname.startsWith(\"/login\")) {\n                            router.push(\"/login?session=expired\");\n                        }\n                    }\n                    return Promise.reject(error);\n                }\n            }[\"SessionManager.useEffect.use[responseInterceptor]\"]);\n            // Nettoyage de l'intercepteur lors du démontage du composant\n            return ({\n                \"SessionManager.useEffect\": ()=>{\n                    axios__WEBPACK_IMPORTED_MODULE_3__[\"default\"].interceptors.response.eject(responseInterceptor);\n                }\n            })[\"SessionManager.useEffect\"];\n        }\n    }[\"SessionManager.useEffect\"], [\n        router\n    ]);\n    return null;\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL2NvbXBvbmVudHMvU2Vzc2lvbk1hbmFnZXIuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSwrQkFBK0I7QUFDYztBQUNMO0FBQ047QUFDUixDQUFDLGdDQUFnQztBQUU1QyxTQUFTSTtJQUN0QixNQUFNLEVBQUVDLE1BQU1DLE9BQU8sRUFBRUMsTUFBTSxFQUFFLEdBQUdQLDJEQUFVQTtJQUM1QyxNQUFNUSxTQUFTUCxzREFBU0E7SUFFeEJDLGdEQUFTQTtvQ0FBQztZQUNSLGdDQUFnQztZQUNoQyxJQUFJSyxXQUFXLHFCQUFxQixDQUFDQyxPQUFPQyxRQUFRLENBQUNDLFVBQVUsQ0FBQyxXQUFXO2dCQUN6RUMsUUFBUUMsR0FBRyxDQUFDO2dCQUNaSixPQUFPSyxJQUFJLENBQUM7WUFDZDtRQUNGO21DQUFHO1FBQUNOO1FBQVFDO0tBQU87SUFFbkIsNkRBQTZEO0lBQzdETixnREFBU0E7b0NBQUM7WUFDUix5REFBeUQ7WUFDekQsTUFBTVksc0JBQXNCWCwwREFBa0IsQ0FBQ2EsUUFBUSxDQUFDQyxHQUFHO3FFQUN6RCxDQUFDRCxXQUFhQTs7cUVBQ2QsQ0FBQ0U7b0JBQ0MsZ0RBQWdEO29CQUNoRCxJQUFJQSxNQUFNRixRQUFRLEVBQUVULFdBQVcsS0FBSzt3QkFDbENJLFFBQVFDLEdBQUcsQ0FBQzt3QkFFWiwyREFBMkQ7d0JBQzNELElBQUksQ0FBQ08sT0FBT0MsUUFBUSxDQUFDWCxRQUFRLENBQUNDLFVBQVUsQ0FBQyxXQUFXOzRCQUNsREYsT0FBT0ssSUFBSSxDQUFDO3dCQUNkO29CQUNGO29CQUNBLE9BQU9RLFFBQVFDLE1BQU0sQ0FBQ0o7Z0JBQ3hCOztZQUdGLDZEQUE2RDtZQUM3RDs0Q0FBTztvQkFDTGYsMERBQWtCLENBQUNhLFFBQVEsQ0FBQ08sS0FBSyxDQUFDVDtnQkFDcEM7O1FBQ0Y7bUNBQUc7UUFBQ047S0FBTztJQUVYLE9BQU87QUFDVCIsInNvdXJjZXMiOlsiQzpcXFVzZXJzXFxnb2xkblxcZ29sZG5vcmQtdHJhbnNhY3Rpb25zXFxjb21wb25lbnRzXFxTZXNzaW9uTWFuYWdlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBjb21wb25lbnRzL1Nlc3Npb25NYW5hZ2VyLmpzXHJcbmltcG9ydCB7IHVzZVNlc3Npb24gfSBmcm9tIFwibmV4dC1hdXRoL3JlYWN0XCI7XHJcbmltcG9ydCB7IHVzZVJvdXRlciB9IGZyb20gXCJuZXh0L3JvdXRlclwiO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IGF4aW9zIGZyb20gXCJheGlvc1wiOyAvLyBBc3N1cmV6LXZvdXMgZCdpbXBvcnRlciBheGlvc1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU2Vzc2lvbk1hbmFnZXIoKSB7XHJcbiAgY29uc3QgeyBkYXRhOiBzZXNzaW9uLCBzdGF0dXMgfSA9IHVzZVNlc3Npb24oKTtcclxuICBjb25zdCByb3V0ZXIgPSB1c2VSb3V0ZXIoKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIC8vIEdlc3Rpb24gZGUgbGEgc2Vzc2lvbiBleHBpcsOpZVxyXG4gICAgaWYgKHN0YXR1cyA9PT0gXCJ1bmF1dGhlbnRpY2F0ZWRcIiAmJiAhcm91dGVyLnBhdGhuYW1lLnN0YXJ0c1dpdGgoXCIvbG9naW5cIikpIHtcclxuICAgICAgY29uc29sZS5sb2coXCJTZXNzaW9uIGV4cGlyw6llLCByZWRpcmVjdGlvbiB2ZXJzIGxvZ2luXCIpO1xyXG4gICAgICByb3V0ZXIucHVzaChcIi9sb2dpbj9zZXNzaW9uPWV4cGlyZWRcIik7XHJcbiAgICB9XHJcbiAgfSwgW3N0YXR1cywgcm91dGVyXSk7XHJcblxyXG4gIC8vIENvbmZpZ3VyZXIgbCdpbnRlcmNlcHRldXIgQXhpb3MgcG91ciBnw6lyZXIgbGVzIGVycmV1cnMgNDAxXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIC8vIEFqb3V0IGQndW4gaW50ZXJjZXB0ZXVyIGdsb2JhbCBwb3VyIGxlcyByw6lwb25zZXMgQXhpb3NcclxuICAgIGNvbnN0IHJlc3BvbnNlSW50ZXJjZXB0b3IgPSBheGlvcy5pbnRlcmNlcHRvcnMucmVzcG9uc2UudXNlKFxyXG4gICAgICAocmVzcG9uc2UpID0+IHJlc3BvbnNlLFxyXG4gICAgICAoZXJyb3IpID0+IHtcclxuICAgICAgICAvLyBTaSBvbiByZcOnb2l0IHVuZSBlcnJldXIgNDAxIChub24gYXV0aGVudGlmacOpKVxyXG4gICAgICAgIGlmIChlcnJvci5yZXNwb25zZT8uc3RhdHVzID09PSA0MDEpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyZXVyIDQwMSBkw6l0ZWN0w6llLCByZWRpcmVjdGlvbiB2ZXJzIGxvZ2luXCIpO1xyXG5cclxuICAgICAgICAgIC8vIMOJdml0ZXIgbGVzIGJvdWNsZXMgaW5maW5pZXMgc2kgZMOpasOgIHN1ciBsYSBwYWdlIGRlIGxvZ2luXHJcbiAgICAgICAgICBpZiAoIXdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zdGFydHNXaXRoKFwiL2xvZ2luXCIpKSB7XHJcbiAgICAgICAgICAgIHJvdXRlci5wdXNoKFwiL2xvZ2luP3Nlc3Npb249ZXhwaXJlZFwiKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcclxuICAgICAgfVxyXG4gICAgKTtcclxuXHJcbiAgICAvLyBOZXR0b3lhZ2UgZGUgbCdpbnRlcmNlcHRldXIgbG9ycyBkdSBkw6ltb250YWdlIGR1IGNvbXBvc2FudFxyXG4gICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgYXhpb3MuaW50ZXJjZXB0b3JzLnJlc3BvbnNlLmVqZWN0KHJlc3BvbnNlSW50ZXJjZXB0b3IpO1xyXG4gICAgfTtcclxuICB9LCBbcm91dGVyXSk7XHJcblxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJ1c2VTZXNzaW9uIiwidXNlUm91dGVyIiwidXNlRWZmZWN0IiwiYXhpb3MiLCJTZXNzaW9uTWFuYWdlciIsImRhdGEiLCJzZXNzaW9uIiwic3RhdHVzIiwicm91dGVyIiwicGF0aG5hbWUiLCJzdGFydHNXaXRoIiwiY29uc29sZSIsImxvZyIsInB1c2giLCJyZXNwb25zZUludGVyY2VwdG9yIiwiaW50ZXJjZXB0b3JzIiwicmVzcG9uc2UiLCJ1c2UiLCJlcnJvciIsIndpbmRvdyIsImxvY2F0aW9uIiwiUHJvbWlzZSIsInJlamVjdCIsImVqZWN0Il0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(pages-dir-node)/./components/SessionManager.js\n");

/***/ }),

/***/ "(pages-dir-node)/./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"(pages-dir-node)/./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next-auth/react */ \"next-auth/react\");\n/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_auth_react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _components_SessionManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/SessionManager */ \"(pages-dir-node)/./components/SessionManager.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_components_SessionManager__WEBPACK_IMPORTED_MODULE_3__]);\n_components_SessionManager__WEBPACK_IMPORTED_MODULE_3__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n\nfunction MyApp({ Component, pageProps: { session, ...pageProps } }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_auth_react__WEBPACK_IMPORTED_MODULE_2__.SessionProvider, {\n        session: session,\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_SessionManager__WEBPACK_IMPORTED_MODULE_3__[\"default\"], {}, void 0, false, {\n                fileName: \"C:\\\\Users\\\\goldn\\\\goldnord-transactions\\\\pages\\\\_app.js\",\n                lineNumber: 8,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                ...pageProps\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\goldn\\\\goldnord-transactions\\\\pages\\\\_app.js\",\n                lineNumber: 9,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"C:\\\\Users\\\\goldn\\\\goldnord-transactions\\\\pages\\\\_app.js\",\n        lineNumber: 7,\n        columnNumber: 5\n    }, this);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3BhZ2VzL19hcHAuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQStCO0FBQ21CO0FBQ1E7QUFFMUQsU0FBU0UsTUFBTSxFQUFFQyxTQUFTLEVBQUVDLFdBQVcsRUFBRUMsT0FBTyxFQUFFLEdBQUdELFdBQVcsRUFBRTtJQUNoRSxxQkFDRSw4REFBQ0osNERBQWVBO1FBQUNLLFNBQVNBOzswQkFDeEIsOERBQUNKLGtFQUFjQTs7Ozs7MEJBQ2YsOERBQUNFO2dCQUFXLEdBQUdDLFNBQVM7Ozs7Ozs7Ozs7OztBQUc5QjtBQUVBLGlFQUFlRixLQUFLQSxFQUFDIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXGdvbGRuXFxnb2xkbm9yZC10cmFuc2FjdGlvbnNcXHBhZ2VzXFxfYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBcIi4uL3N0eWxlcy9nbG9iYWxzLmNzc1wiO1xyXG5pbXBvcnQgeyBTZXNzaW9uUHJvdmlkZXIgfSBmcm9tIFwibmV4dC1hdXRoL3JlYWN0XCI7XHJcbmltcG9ydCBTZXNzaW9uTWFuYWdlciBmcm9tIFwiLi4vY29tcG9uZW50cy9TZXNzaW9uTWFuYWdlclwiO1xyXG5cclxuZnVuY3Rpb24gTXlBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wczogeyBzZXNzaW9uLCAuLi5wYWdlUHJvcHMgfSB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxTZXNzaW9uUHJvdmlkZXIgc2Vzc2lvbj17c2Vzc2lvbn0+XHJcbiAgICAgIDxTZXNzaW9uTWFuYWdlciAvPlxyXG4gICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XHJcbiAgICA8L1Nlc3Npb25Qcm92aWRlcj5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBNeUFwcDtcclxuIl0sIm5hbWVzIjpbIlNlc3Npb25Qcm92aWRlciIsIlNlc3Npb25NYW5hZ2VyIiwiTXlBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiLCJzZXNzaW9uIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(pages-dir-node)/./pages/_app.js\n");

/***/ }),

/***/ "(pages-dir-node)/./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = import("axios");;

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "next-auth/react":
/*!**********************************!*\
  !*** external "next-auth/react" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = require("next-auth/react");

/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-dom");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("(pages-dir-node)/./pages/_app.js")));
module.exports = __webpack_exports__;

})();