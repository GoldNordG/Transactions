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
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ SessionManager)\n/* harmony export */ });\n/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth/react */ \"next-auth/react\");\n/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth_react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/router */ \"(pages-dir-node)/./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! axios */ \"axios\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([axios__WEBPACK_IMPORTED_MODULE_3__]);\naxios__WEBPACK_IMPORTED_MODULE_3__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n// components/SessionManager.js\n\n\n\n // Assurez-vous d'importer axios\nfunction SessionManager() {\n    const { status } = (0,next_auth_react__WEBPACK_IMPORTED_MODULE_0__.useSession)();\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_1__.useRouter)();\n    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)({\n        \"SessionManager.useEffect\": ()=>{\n            // Gestion de la session expirée\n            if (status === \"unauthenticated\" && !router.pathname.startsWith(\"/login\")) {\n                console.log(\"Session expirée, redirection vers login\");\n                router.push(\"/login?session=expired\");\n            }\n        }\n    }[\"SessionManager.useEffect\"], [\n        status,\n        router\n    ]);\n    // Configurer l'intercepteur Axios pour gérer les erreurs 401\n    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)({\n        \"SessionManager.useEffect\": ()=>{\n            // Ajout d'un intercepteur global pour les réponses Axios\n            const responseInterceptor = axios__WEBPACK_IMPORTED_MODULE_3__[\"default\"].interceptors.response.use({\n                \"SessionManager.useEffect.use[responseInterceptor]\": (response)=>response\n            }[\"SessionManager.useEffect.use[responseInterceptor]\"], {\n                \"SessionManager.useEffect.use[responseInterceptor]\": (error)=>{\n                    // Si on reçoit une erreur 401 (non authentifié)\n                    if (error.response?.status === 401) {\n                        console.log(\"Erreur 401 détectée, redirection vers login\");\n                        // Éviter les boucles infinies si déjà sur la page de login\n                        if (!window.location.pathname.startsWith(\"/login\")) {\n                            router.push(\"/login?session=expired\");\n                        }\n                    }\n                    return Promise.reject(error);\n                }\n            }[\"SessionManager.useEffect.use[responseInterceptor]\"]);\n            // Nettoyage de l'intercepteur lors du démontage du composant\n            return ({\n                \"SessionManager.useEffect\": ()=>{\n                    axios__WEBPACK_IMPORTED_MODULE_3__[\"default\"].interceptors.response.eject(responseInterceptor);\n                }\n            })[\"SessionManager.useEffect\"];\n        }\n    }[\"SessionManager.useEffect\"], [\n        router\n    ]);\n    return null;\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL2NvbXBvbmVudHMvU2Vzc2lvbk1hbmFnZXIuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSwrQkFBK0I7QUFDYztBQUNMO0FBQ047QUFDUixDQUFDLGdDQUFnQztBQUU1QyxTQUFTSTtJQUN0QixNQUFNLEVBQUVDLE1BQU0sRUFBRSxHQUFHTCwyREFBVUE7SUFDN0IsTUFBTU0sU0FBU0wsc0RBQVNBO0lBRXhCQyxnREFBU0E7b0NBQUM7WUFDUixnQ0FBZ0M7WUFDaEMsSUFBSUcsV0FBVyxxQkFBcUIsQ0FBQ0MsT0FBT0MsUUFBUSxDQUFDQyxVQUFVLENBQUMsV0FBVztnQkFDekVDLFFBQVFDLEdBQUcsQ0FBQztnQkFDWkosT0FBT0ssSUFBSSxDQUFDO1lBQ2Q7UUFDRjttQ0FBRztRQUFDTjtRQUFRQztLQUFPO0lBRW5CLDZEQUE2RDtJQUM3REosZ0RBQVNBO29DQUFDO1lBQ1IseURBQXlEO1lBQ3pELE1BQU1VLHNCQUFzQlQsMERBQWtCLENBQUNXLFFBQVEsQ0FBQ0MsR0FBRztxRUFDekQsQ0FBQ0QsV0FBYUE7O3FFQUNkLENBQUNFO29CQUNDLGdEQUFnRDtvQkFDaEQsSUFBSUEsTUFBTUYsUUFBUSxFQUFFVCxXQUFXLEtBQUs7d0JBQ2xDSSxRQUFRQyxHQUFHLENBQUM7d0JBRVosMkRBQTJEO3dCQUMzRCxJQUFJLENBQUNPLE9BQU9DLFFBQVEsQ0FBQ1gsUUFBUSxDQUFDQyxVQUFVLENBQUMsV0FBVzs0QkFDbERGLE9BQU9LLElBQUksQ0FBQzt3QkFDZDtvQkFDRjtvQkFDQSxPQUFPUSxRQUFRQyxNQUFNLENBQUNKO2dCQUN4Qjs7WUFHRiw2REFBNkQ7WUFDN0Q7NENBQU87b0JBQ0xiLDBEQUFrQixDQUFDVyxRQUFRLENBQUNPLEtBQUssQ0FBQ1Q7Z0JBQ3BDOztRQUNGO21DQUFHO1FBQUNOO0tBQU87SUFFWCxPQUFPO0FBQ1QiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcZ29sZG5cXGdvbGRub3JkLXRyYW5zYWN0aW9uc1xcY29tcG9uZW50c1xcU2Vzc2lvbk1hbmFnZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gY29tcG9uZW50cy9TZXNzaW9uTWFuYWdlci5qc1xyXG5pbXBvcnQgeyB1c2VTZXNzaW9uIH0gZnJvbSBcIm5leHQtYXV0aC9yZWFjdFwiO1xyXG5pbXBvcnQgeyB1c2VSb3V0ZXIgfSBmcm9tIFwibmV4dC9yb3V0ZXJcIjtcclxuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCBheGlvcyBmcm9tIFwiYXhpb3NcIjsgLy8gQXNzdXJlei12b3VzIGQnaW1wb3J0ZXIgYXhpb3NcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNlc3Npb25NYW5hZ2VyKCkge1xyXG4gIGNvbnN0IHsgc3RhdHVzIH0gPSB1c2VTZXNzaW9uKCk7XHJcbiAgY29uc3Qgcm91dGVyID0gdXNlUm91dGVyKCk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICAvLyBHZXN0aW9uIGRlIGxhIHNlc3Npb24gZXhwaXLDqWVcclxuICAgIGlmIChzdGF0dXMgPT09IFwidW5hdXRoZW50aWNhdGVkXCIgJiYgIXJvdXRlci5wYXRobmFtZS5zdGFydHNXaXRoKFwiL2xvZ2luXCIpKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiU2Vzc2lvbiBleHBpcsOpZSwgcmVkaXJlY3Rpb24gdmVycyBsb2dpblwiKTtcclxuICAgICAgcm91dGVyLnB1c2goXCIvbG9naW4/c2Vzc2lvbj1leHBpcmVkXCIpO1xyXG4gICAgfVxyXG4gIH0sIFtzdGF0dXMsIHJvdXRlcl0pO1xyXG5cclxuICAvLyBDb25maWd1cmVyIGwnaW50ZXJjZXB0ZXVyIEF4aW9zIHBvdXIgZ8OpcmVyIGxlcyBlcnJldXJzIDQwMVxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICAvLyBBam91dCBkJ3VuIGludGVyY2VwdGV1ciBnbG9iYWwgcG91ciBsZXMgcsOpcG9uc2VzIEF4aW9zXHJcbiAgICBjb25zdCByZXNwb25zZUludGVyY2VwdG9yID0gYXhpb3MuaW50ZXJjZXB0b3JzLnJlc3BvbnNlLnVzZShcclxuICAgICAgKHJlc3BvbnNlKSA9PiByZXNwb25zZSxcclxuICAgICAgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgLy8gU2kgb24gcmXDp29pdCB1bmUgZXJyZXVyIDQwMSAobm9uIGF1dGhlbnRpZmnDqSlcclxuICAgICAgICBpZiAoZXJyb3IucmVzcG9uc2U/LnN0YXR1cyA9PT0gNDAxKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycmV1ciA0MDEgZMOpdGVjdMOpZSwgcmVkaXJlY3Rpb24gdmVycyBsb2dpblwiKTtcclxuXHJcbiAgICAgICAgICAvLyDDiXZpdGVyIGxlcyBib3VjbGVzIGluZmluaWVzIHNpIGTDqWrDoCBzdXIgbGEgcGFnZSBkZSBsb2dpblxyXG4gICAgICAgICAgaWYgKCF3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuc3RhcnRzV2l0aChcIi9sb2dpblwiKSkge1xyXG4gICAgICAgICAgICByb3V0ZXIucHVzaChcIi9sb2dpbj9zZXNzaW9uPWV4cGlyZWRcIik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XHJcbiAgICAgIH1cclxuICAgICk7XHJcblxyXG4gICAgLy8gTmV0dG95YWdlIGRlIGwnaW50ZXJjZXB0ZXVyIGxvcnMgZHUgZMOpbW9udGFnZSBkdSBjb21wb3NhbnRcclxuICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgIGF4aW9zLmludGVyY2VwdG9ycy5yZXNwb25zZS5lamVjdChyZXNwb25zZUludGVyY2VwdG9yKTtcclxuICAgIH07XHJcbiAgfSwgW3JvdXRlcl0pO1xyXG5cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG4iXSwibmFtZXMiOlsidXNlU2Vzc2lvbiIsInVzZVJvdXRlciIsInVzZUVmZmVjdCIsImF4aW9zIiwiU2Vzc2lvbk1hbmFnZXIiLCJzdGF0dXMiLCJyb3V0ZXIiLCJwYXRobmFtZSIsInN0YXJ0c1dpdGgiLCJjb25zb2xlIiwibG9nIiwicHVzaCIsInJlc3BvbnNlSW50ZXJjZXB0b3IiLCJpbnRlcmNlcHRvcnMiLCJyZXNwb25zZSIsInVzZSIsImVycm9yIiwid2luZG93IiwibG9jYXRpb24iLCJQcm9taXNlIiwicmVqZWN0IiwiZWplY3QiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(pages-dir-node)/./components/SessionManager.js\n");

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