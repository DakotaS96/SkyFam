/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = // eslint-disable-next-line no-unused-vars
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) {
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if (parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var script = document.createElement("script");
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		if (null) script.crossOrigin = null;
/******/ 		document.head.appendChild(script);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest(requestTimeout) {
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if (typeof XMLHttpRequest === "undefined") {
/******/ 				return reject(new Error("No browser support"));
/******/ 			}
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch (err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if (request.readyState !== 4) return;
/******/ 				if (request.status === 0) {
/******/ 					// timeout
/******/ 					reject(
/******/ 						new Error("Manifest request to " + requestPath + " timed out.")
/******/ 					);
/******/ 				} else if (request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if (request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch (e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "6be872d8aa9e6ffa48ba";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_selfInvalidated: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 			invalidate: function() {
/******/ 				this._selfInvalidated = true;
/******/ 				switch (hotStatus) {
/******/ 					case "idle":
/******/ 						hotUpdate = {};
/******/ 						hotUpdate[moduleId] = modules[moduleId];
/******/ 						hotSetStatus("ready");
/******/ 						break;
/******/ 					case "ready":
/******/ 						hotApplyInvalidatedModule(moduleId);
/******/ 						break;
/******/ 					case "prepare":
/******/ 					case "check":
/******/ 					case "dispose":
/******/ 					case "apply":
/******/ 						(hotQueuedInvalidatedModules =
/******/ 							hotQueuedInvalidatedModules || []).push(moduleId);
/******/ 						break;
/******/ 					default:
/******/ 						// ignore requests in error states
/******/ 						break;
/******/ 				}
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash, hotQueuedInvalidatedModules;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus(hotApplyInvalidatedModules() ? "ready" : "idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			for(var chunkId in installedChunks)
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 		return hotApplyInternal(options);
/******/ 	}
/******/
/******/ 	function hotApplyInternal(options) {
/******/ 		hotApplyInvalidatedModules();
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (
/******/ 					!module ||
/******/ 					(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 				)
/******/ 					continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted &&
/******/ 				// removed self-accepted modules should not be required
/******/ 				appliedUpdate[moduleId] !== warnUnexpectedRequire &&
/******/ 				// when called invalidate self-accepting is not possible
/******/ 				!installedModules[moduleId].hot._selfInvalidated
/******/ 			) {
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					parents: installedModules[moduleId].parents.slice(),
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		if (hotUpdateNewHash !== undefined) {
/******/ 			hotCurrentHash = hotUpdateNewHash;
/******/ 			hotUpdateNewHash = undefined;
/******/ 		}
/******/ 		hotUpdate = undefined;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = item.parents;
/******/ 			hotCurrentChildModule = moduleId;
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		if (hotQueuedInvalidatedModules) {
/******/ 			return hotApplyInternal(options).then(function(list) {
/******/ 				outdatedModules.forEach(function(moduleId) {
/******/ 					if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 				});
/******/ 				return list;
/******/ 			});
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	function hotApplyInvalidatedModules() {
/******/ 		if (hotQueuedInvalidatedModules) {
/******/ 			if (!hotUpdate) hotUpdate = {};
/******/ 			hotQueuedInvalidatedModules.forEach(hotApplyInvalidatedModule);
/******/ 			hotQueuedInvalidatedModules = undefined;
/******/ 			return true;
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApplyInvalidatedModule(moduleId) {
/******/ 		if (!Object.prototype.hasOwnProperty.call(hotUpdate, moduleId))
/******/ 			hotUpdate[moduleId] = modules[moduleId];
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"app": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push([0,"vendor"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Game.js":
/*!*********************!*\
  !*** ./src/Game.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

__webpack_require__(/*! pixi */ "./node_modules/phaser-ce/build/custom/pixi.js-exposed");

__webpack_require__(/*! p2 */ "./node_modules/phaser-ce/build/custom/p2.js-exposed");

var _phaser = __webpack_require__(/*! phaser */ "./node_modules/phaser-ce/build/custom/phaser-split.js-exposed");

var _phaser2 = _interopRequireDefault(_phaser);

var _Load = __webpack_require__(/*! ./states/Load */ "./src/states/Load.js");

var _Load2 = _interopRequireDefault(_Load);

var _Menu = __webpack_require__(/*! ./states/Menu */ "./src/states/Menu.js");

var _Menu2 = _interopRequireDefault(_Menu);

var _Play = __webpack_require__(/*! ./states/Play */ "./src/states/Play.js");

var _Play2 = _interopRequireDefault(_Play);

var _Tutorial = __webpack_require__(/*! ./states/Tutorial */ "./src/states/Tutorial.js");

var _Tutorial2 = _interopRequireDefault(_Tutorial);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Game = function (_Phaser$Game) {
    _inherits(Game, _Phaser$Game);

    function Game(width, height) {
        var _this;

        _classCallCheck(this, Game);

        return _this = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this, {
            width: width,
            height: height,
            renderer: _phaser2.default.AUTO,
            // TODO: scale accordlingly to device resolution
            // resolution: window.devicePixelRatio,
            state: {
                create: function create() {
                    _this.state.add('load', _Load2.default);
                    _this.state.add('menu', _Menu2.default);
                    _this.state.add('play', _Play2.default);
                    _this.state.add('tutorial', _Tutorial2.default);
                    _this.state.start('load');
                }
            }
        }));
    }

    return Game;
}(_phaser2.default.Game);

exports.default = Game;

/***/ }),

/***/ "./src/entities/Boundary.js":
/*!**********************************!*\
  !*** ./src/entities/Boundary.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* 
    For setting boundaries between the bubble launcher and scoreboard
 */
var Boundary = function (_Phaser$Sprite) {
    _inherits(Boundary, _Phaser$Sprite);

    function Boundary(game, _ref, _ref2, _ref3) {
        var x1 = _ref.x1,
            y1 = _ref.y1;
        var x2 = _ref2.x2,
            y2 = _ref2.y2;
        var fill = _ref3.fill,
            alpha = _ref3.alpha,
            stroke = _ref3.stroke,
            strokeWidth = _ref3.strokeWidth;

        _classCallCheck(this, Boundary);

        var _this = _possibleConstructorReturn(this, (Boundary.__proto__ || Object.getPrototypeOf(Boundary)).call(this, game, 0, 0));

        _this.data.graphic = new Phaser.Graphics(game);
        _this.data.fill = fill;
        _this.data.alpha = alpha;
        _this.data.stroke = stroke;
        _this.data.strokeWidth = strokeWidth;
        _this.data.p1 = { x1: x1, y1: y1 };
        _this.data.p2 = { x2: x2, y2: y2 };

        _this.data.graphic.lineStyle(strokeWidth, stroke, alpha);
        _this.data.graphic.beginFill(fill);
        _this.data.graphic.moveTo(x1, y1);
        _this.data.graphic.lineTo(x2, y2);
        _this.data.graphic.endFill();

        _this.addChild(_this.data.graphic);
        _this.game.add.existing(_this);
        return _this;
    }

    return Boundary;
}(Phaser.Sprite);

exports.default = Boundary;

/***/ }),

/***/ "./src/entities/Bubble.js":
/*!********************************!*\
  !*** ./src/entities/Bubble.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _Colors = __webpack_require__(/*! ../utils/Colors */ "./src/utils/Colors.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* 
    Sprite class for bubbles.
    If sprite key does not exist, it will draw a Phaser Graphics
    and append it to an empty sprite to enable physics
*/
var Bubble = function (_Phaser$Sprite) {
    _inherits(Bubble, _Phaser$Sprite);

    function Bubble(game, diameter, x, y, colorCode, group, key) {
        _classCallCheck(this, Bubble);

        var _this = _possibleConstructorReturn(this, (Bubble.__proto__ || Object.getPrototypeOf(Bubble)).call(this, game, x, y, key));

        var color = _EntityMap.EntityMap.colors[colorCode];
        var _Colors$color = _Colors.Colors[color],
            fill = _Colors$color.fill,
            alpha = _Colors$color.alpha,
            stroke = _Colors$color.stroke,
            strokeWidth = _Colors$color.strokeWidth;


        _this.data.graphic = new Phaser.Graphics(game);
        _this.data.diameter = diameter;
        _this.data.fill = fill;
        _this.data.alpha = alpha;
        _this.data.stroke = stroke;
        _this.data.strokeWidth = strokeWidth;
        _this.data.colorCode = colorCode;
        _this.anchor.set(0.5, 0.5);
        _this.scale.set(0.9, 0.9);

        if (!key) {
            _this.draw();
            _this.addChild(_this.data.graphic);
        }

        if (group) {
            group.add(_this);
        } else {
            _this.game.add.existing(_this);
        }
        return _this;
    }

    _createClass(Bubble, [{
        key: 'draw',
        value: function draw() {
            var _this2 = this;

            this.data.graphic.lineStyle(this.data.strokeWidth, this.data.stroke);
            this.data.graphic.beginFill(this.data.fill, this.data.alpha);
            // position will be determined by sprite
            this.data.graphic.drawCircle(null, null, this.data.diameter);
            this.data.graphic.endFill();
            this.addDot(function () {
                return _this2.data.colorCode === _EntityMap.EntityMap.gold;
            });
        }
    }, {
        key: 'addDot',
        value: function addDot(cb) {
            if (cb()) {
                this.data.graphic.lineStyle(1, this.data.stroke);
                this.data.graphic.beginFill(this.data.stroke, 1);
                this.data.graphic.drawCircle(null, null, this.data.diameter / 4);
                this.data.graphic.endFill();
            }
        }
    }]);

    return Bubble;
}(Phaser.Sprite);

exports.default = Bubble;

/***/ }),

/***/ "./src/entities/Navigation.js":
/*!************************************!*\
  !*** ./src/entities/Navigation.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* 
    Reusable navigation component to be rendered in any Phaser state
*/
var Navigation = function (_Phaser$Group) {
    _inherits(Navigation, _Phaser$Group);

    function Navigation(game, items, x, y, increment) {
        _classCallCheck(this, Navigation);

        var _this = _possibleConstructorReturn(this, (Navigation.__proto__ || Object.getPrototypeOf(Navigation)).call(this, game));

        _this.items = _this.createItems(items, x, y, increment);
        _this.currentIndex = 0;
        _this.setAll('anchor.x', 0.5);
        _this.setAll('anchor.y', 0.5);
        return _this;
    }

    _createClass(Navigation, [{
        key: 'createItems',
        value: function createItems(items, x, y, increment) {
            var _this2 = this;

            return items.map(function (cur, idx) {
                var name = cur.name,
                    stateName = cur.stateName,
                    font = cur.font,
                    fontSize = cur.fontSize;

                var item = new Phaser.BitmapText(_this2.game, x, y + increment * idx, font, name, fontSize);
                item.stateName = stateName;
                return _this2.add(item);
            });
        }
    }, {
        key: 'createPolnareff',
        value: function createPolnareff(x, y, incrementY) {
            this.polnareffPosition = this.items.map(function (cur, idx) {
                return idx === 0 ? y : y + incrementY * idx;
            });

            this.polnareff = this.game.add.sprite(x, y, 'polnareff-1', 0);
            this.polnareff.anchor.set(0.5, 0.5);
            this.polnareff.animations.add('bounce', [0, 1], 2, true);
            this.polnareff.animations.play('bounce');
        }
    }, {
        key: 'changeCurrentNavigation',
        value: function changeCurrentNavigation(increment) {
            if (increment > 0) {
                if (this.currentIndex < this.polnareffPosition.length - 1) {
                    this.polnareff.y = this.polnareffPosition[++this.currentIndex];
                }
            } else if (increment < 0) {
                if (this.currentIndex > 0) {
                    this.polnareff.y = this.polnareffPosition[--this.currentIndex];
                }
            }
        }

        // TODO: add params for tween args

    }, {
        key: 'tweenNavigation',
        value: function tweenNavigation(index, cb) {
            this.children[index].alpha = 0;

            var navigationTween = this.game.add.tween(this.children[index]).to({ alpha: 1 }, 100, "Linear", true, 0, 3);

            navigationTween.onComplete.add(cb, this.game);
        }
    }]);

    return Navigation;
}(Phaser.Group);

exports.default = Navigation;

/***/ }),

/***/ "./src/entities/Player.js":
/*!********************************!*\
  !*** ./src/entities/Player.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* 
    Class for adding, deleting, and updating player stats
    Stored in the game.data object to be access throughout all phaser states
*/
var Player = function () {
    function Player() {
        var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'GUEST';
        var credits = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 6;
        var totalScore = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var highScore = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var currentRound = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
        var gameCompleted = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

        _classCallCheck(this, Player);

        this.name = name;
        this.credits = credits;
        this.totalScore = totalScore;
        this.highScore = highScore;
        this.currentRound = currentRound;
        this.gameCompleted = gameCompleted;

        // if (completedRound) {
        //     this.completedRound = completedRound;
        // }else {
        //     this.completedRound = {
        //         round: currentRound,
        //         time: null,
        //         bonus: null,
        //         score: null,
        //         totalScore: null
        //     };
        // }
    }

    _createClass(Player, [{
        key: 'save',
        value: function save() {
            localStorage.setItem('bubble-shooter', JSON.stringify(this));
        }
    }], [{
        key: 'getExistingPlayer',
        value: function getExistingPlayer() {
            return JSON.parse(localStorage.getItem('bubble-shooter'));
        }
    }, {
        key: 'clear',
        value: function clear() {
            localStorage.removeItem('bubble-shooter');
        }
    }]);

    return Player;
}();

exports.default = Player;

/***/ }),

/***/ "./src/entities/Round.js":
/*!*******************************!*\
  !*** ./src/entities/Round.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _Constants = __webpack_require__(/*! ../utils/Constants */ "./src/utils/Constants.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* 
    Processes rounds from the ../rounds directory
    Keeps track of the remaining bubbles in the matrix 
*/
var Round = function () {
    function Round(roundNumber) {
        _classCallCheck(this, Round);

        var round = __webpack_require__("./src/rounds sync recursive ^\\.\\/.*$")("./" + roundNumber).default;
        this.matrix = round.map(function (row) {
            return row.slice();
        });
        this.selection = new Set();
        this.topRow = 0;

        if (this.matrix.length && this.matrix[0].length) {
            this.rows = this.matrix.length;
            this.cols = this.matrix[0].length;

            if (this.cols === _Constants.ROUND_MODE_1) {
                this.startX = _Constants.TILE_SIZE;
                this.endX = _Constants.CANVAS_WIDTH - _Constants.TILE_SIZE;
                this.startY = _Constants.TILE_SIZE;
                this.endY = _Constants.CANVAS_HEIGHT - _Constants.LAUNCHER_HEIGHT;
            }

            if (this.cols === _Constants.ROUND_MODE_2) {
                this.startX = 5 * _Constants.TILE_SIZE + _Constants.ANCHOR_OFFSET;
                this.endX = _Constants.CANVAS_WIDTH - 5 * _Constants.TILE_SIZE - _Constants.ANCHOR_OFFSET;
                this.startY = _Constants.TILE_SIZE;
                this.endY = _Constants.CANVAS_HEIGHT - _Constants.LAUNCHER_HEIGHT;
            }
        }
    }

    _createClass(Round, [{
        key: 'getCoordinates',
        value: function getCoordinates(i, j) {
            if (i < 0 || j < 0) return;

            // add extra offset to shift the row that has one less space
            var xOffset = this.matrix[i][this.cols - 1] === null ? _Constants.ANCHOR_OFFSET : 0;

            // get the x,y coord of the bubble with respect to its center
            var x = this.startX + _Constants.ANCHOR_OFFSET + j * _Constants.TILE_SIZE + xOffset;
            var y = this.startY + _Constants.ANCHOR_OFFSET + i * _Constants.TILE_SIZE;
            // console.log('i: ' + i + ' j: ' + j + ' x: ' + x + ' y: ' + y);
            return { x: x, y: y };
        }
    }, {
        key: 'getIndices',
        value: function getIndices(x, y) {
            if (x < 0 || y < 0) return;

            var i = Math.round((y - this.startY - _Constants.ANCHOR_OFFSET) / _Constants.TILE_SIZE);
            var xOffset = this.matrix[i][this.cols - 1] === null ? _Constants.ANCHOR_OFFSET : 0;
            var j = Math.round((x - this.startX - _Constants.ANCHOR_OFFSET - xOffset) / _Constants.TILE_SIZE);
            // console.log('x: ' + x + ' y: ' + y + ' i: ' + i + ' j: ' + j);
            return { i: i, j: j };
        }
    }, {
        key: 'shiftTopBoundary',
        value: function shiftTopBoundary() {
            // add blocks on top
            var topRow = [];
            for (var i = 0; i < this.cols; i++) {
                topRow.push(_EntityMap.EntityMap.zero);
            }

            // remove last row
            this.matrix.unshift(topRow);

            // push out of bounds on bottom
            var outOfBounds = this.matrix.pop();
            var validMatrix = this.matrix[this.rows - 1].every(function (el) {
                return el === _EntityMap.EntityMap.zero || el === _EntityMap.EntityMap.empty || el === _EntityMap.EntityMap.gold;
            });

            if (validMatrix) {
                this.matrix.pop();
                this.matrix.push(outOfBounds);
                this.topRow++;
            }

            return validMatrix;
        }
    }, {
        key: 'getBubbleHash',
        value: function getBubbleHash(i, j) {
            return i + '_' + j;
        }
    }, {
        key: 'fromBubbleHash',
        value: function fromBubbleHash(hash) {
            var bubble = {};

            var _hash$split = hash.split('_'),
                _hash$split2 = _slicedToArray(_hash$split, 2),
                i = _hash$split2[0],
                j = _hash$split2[1];

            i = parseInt(i);
            j = parseInt(j);
            bubble.indices = { i: i, j: j };
            bubble.colorCode = this.matrix[i][j];
            return bubble;
        }
    }, {
        key: 'isBubble',
        value: function isBubble(i, j) {
            if (i >= 0 && i < this.rows && j >= 0 && j < this.cols) {
                return this.matrix[i][j] >= _EntityMap.EntityMap.BUBBLE_START && this.matrix[i][j] <= _EntityMap.EntityMap.BUBBLE_END;
            } else {
                return false;
            }
        }
    }, {
        key: 'isSmallRow',
        value: function isSmallRow(i) {
            return this.matrix[i][this.cols - 1] === null;
        }
    }, {
        key: 'addSelection',
        value: function addSelection(colorCode) {
            this.selection.add(colorCode);
        }
    }, {
        key: 'clearSelection',
        value: function clearSelection() {
            if (this.selection.size > 2) {
                this.selection.clear();
            }
        }
    }]);

    return Round;
}();

exports.default = Round;

/***/ }),

/***/ "./src/entities/Status.js":
/*!********************************!*\
  !*** ./src/entities/Status.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Constants = __webpack_require__(/*! ../utils/Constants */ "./src/utils/Constants.js");

var _Navigation = __webpack_require__(/*! ./Navigation */ "./src/entities/Navigation.js");

var _Navigation2 = _interopRequireDefault(_Navigation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* 
    Pseudo state that displays user stats
 */
var Status = function (_Phaser$Group) {
    _inherits(Status, _Phaser$Group);

    function Status(game, overlayConfig, headerConfig, statsConfig) {
        _classCallCheck(this, Status);

        var _this = _possibleConstructorReturn(this, (Status.__proto__ || Object.getPrototypeOf(Status)).call(this, game));

        _this.overlay = null;
        _this.header = null;
        _this.stats = [];
        _this.createStatus(overlayConfig, headerConfig, statsConfig);
        return _this;
    }

    _createClass(Status, [{
        key: 'createStatus',
        value: function createStatus(overlayConfig, headerConfig, statsConfig) {
            if (overlayConfig) this.overlay = this.createOverlay(overlayConfig);
            if (headerConfig) this.header = this.createHeader(headerConfig);
            if (statsConfig) this.stats = this.createStats(statsConfig);
        }
    }, {
        key: 'createOverlay',
        value: function createOverlay(overlay) {
            if (this.overlay) this.remove(this.overlay);

            var fill = overlay.fill;

            var graphic = new Phaser.Graphics(this.game, 0, 0);
            graphic.beginFill(fill);
            graphic.drawRect(0, 0, _Constants.CANVAS_WIDTH, _Constants.CANVAS_HEIGHT);
            graphic.alpha = 0.3;
            return this.add(graphic);
        }
    }, {
        key: 'createHeader',
        value: function createHeader(header) {
            if (this.header) this.remove(this.header);

            var x = header.x,
                y = header.y,
                font = header.font,
                message = header.message,
                fontSize = header.fontSize;

            var text = new Phaser.BitmapText(this.game, x, y, font, message, fontSize);
            // text.alpha = 0;
            text.anchor.set(0.5, 0.5);
            return this.add(text);
        }
    }, {
        key: 'createStats',
        value: function createStats(stats) {
            var _this2 = this;

            if (this.stats.length) {
                this.stats.forEach(function (stat) {
                    _this2.remove(stat);
                });
            }

            var x = stats.x,
                y = stats.y,
                font = stats.font,
                message = stats.message,
                fontSize = stats.fontSize,
                distance = stats.distance;
            var time = message.time,
                score = message.score,
                bonus = message.bonus;


            var propText = 'TIME\nSCORE\nBONUS';
            var valueText = time + '\n' + score + '\n' + bonus;
            var props = new Phaser.BitmapText(this.game, x, y, font, propText, fontSize);
            var values = new Phaser.BitmapText(this.game, x + distance, y, font, valueText, fontSize);

            props.anchor.set(0, 0.5);
            values.anchor.set(0, 0.5);
            return this.addMultiple([props, values]);
        }
    }]);

    return Status;
}(Phaser.Group);

exports.default = Status;

/***/ }),

/***/ "./src/index.html":
/*!************************!*\
  !*** ./src/index.html ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!DOCTYPE html>\n<html lang=\"en\">\n\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\">\n    <title>Bubble Shooter</title>\n    <style>\n        html,\n        body {\n            margin: 0;\n            padding: 0;\n            background: #c8f1dd;\n        }\n\n        canvas {\n            border: 2px solid #eee;\n            border-radius: 2px;\n            box-shadow: 0 1px 0 0 #f9fcfc inset, 0 2px 4px 1px rgba(0, 0, 0, 0.24);\n            position: absolute;\n            margin: auto;\n            top: 0;\n            right: 0;\n            bottom: 0;\n            left: 0;\n            opacity: 0;\n            display: block;\n        }\n\n        #github {\n            opacity: 0;\n            display: block;\n        }\n\n        #github img {\n            position: absolute;\n            top: 0;\n            right: 0;\n            border: 0;\n            width: 15vw;\n            height: 15vw;\n        }\n\n        #sound {\n            opacity: 0;\n            width: 5vw;\n            height: 5vw;\n            background-position: center;\n            background-repeat: no-repeat;\n            background-size: 100%;\n            position: absolute;\n            top: 10px;\n            left: 10px;\n        }\n\n        #sound:hover {\n            cursor: pointer;\n        }\n\n        .warning-message {\n            display: none;\n        }\n\n        @media only screen and (max-width: 500px) {\n            .warning-message {\n                font-family: \"HelveticaNeue-Light\", \"Helvetica Neue Light\", \"Helvetica Neue\", Helvetica, Arial, \"Lucida Grande\", sans-serif;\n                font-weight: 300;\n                font-size: 1rem;\n                color: #000;\n                position: absolute;\n                top: 50%;\n                transform: translateY(-50%);\n                text-align: center;\n                right: 0;\n                left: 0;\n                margin: 0 auto;\n                width: 50%;\n                line-height: 2;\n                display: block;\n            }\n            canvas,\n            #github,\n            #sound {\n                display: none !important;\n            }\n        }\n    </style>\n</head>\n\n<body>\n    <div class=\"warning-message\">\n        Bubble Shooter is not supported on mobile devices at this time. Please switch to a laptop or desktop to play the game.\n    </div>\n    <div id=\"sound\"></div>\n</body>\n\n</html>\n"

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! ./index.html */ "./src/index.html");

var _Game = __webpack_require__(/*! ./Game */ "./src/Game.js");

var _Game2 = _interopRequireDefault(_Game);

var _Constants = __webpack_require__(/*! ./utils/Constants */ "./src/utils/Constants.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// gameboy aspect ratio ~ (340 x 280) (1.214285714)
// will scale by 1.5 (510, 420)
new _Game2.default(_Constants.CANVAS_WIDTH, _Constants.CANVAS_HEIGHT);

/***/ }),

/***/ "./src/rounds sync recursive ^\\.\\/.*$":
/*!**********************************!*\
  !*** ./src/rounds sync ^\.\/.*$ ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./0": "./src/rounds/0.js",
	"./0.js": "./src/rounds/0.js",
	"./1": "./src/rounds/1.js",
	"./1.js": "./src/rounds/1.js",
	"./10": "./src/rounds/10.js",
	"./10.js": "./src/rounds/10.js",
	"./11": "./src/rounds/11.js",
	"./11.js": "./src/rounds/11.js",
	"./12": "./src/rounds/12.js",
	"./12.js": "./src/rounds/12.js",
	"./13": "./src/rounds/13.js",
	"./13.js": "./src/rounds/13.js",
	"./14": "./src/rounds/14.js",
	"./14.js": "./src/rounds/14.js",
	"./15": "./src/rounds/15.js",
	"./15.js": "./src/rounds/15.js",
	"./16": "./src/rounds/16.js",
	"./16.js": "./src/rounds/16.js",
	"./17": "./src/rounds/17.js",
	"./17.js": "./src/rounds/17.js",
	"./18": "./src/rounds/18.js",
	"./18.js": "./src/rounds/18.js",
	"./19": "./src/rounds/19.js",
	"./19.js": "./src/rounds/19.js",
	"./2": "./src/rounds/2.js",
	"./2.js": "./src/rounds/2.js",
	"./20": "./src/rounds/20.js",
	"./20.js": "./src/rounds/20.js",
	"./21": "./src/rounds/21.js",
	"./21.js": "./src/rounds/21.js",
	"./22": "./src/rounds/22.js",
	"./22.js": "./src/rounds/22.js",
	"./23": "./src/rounds/23.js",
	"./23.js": "./src/rounds/23.js",
	"./24": "./src/rounds/24.js",
	"./24.js": "./src/rounds/24.js",
	"./25": "./src/rounds/25.js",
	"./25.js": "./src/rounds/25.js",
	"./26": "./src/rounds/26.js",
	"./26.js": "./src/rounds/26.js",
	"./27": "./src/rounds/27.js",
	"./27.js": "./src/rounds/27.js",
	"./28": "./src/rounds/28.js",
	"./28.js": "./src/rounds/28.js",
	"./29": "./src/rounds/29.js",
	"./29.js": "./src/rounds/29.js",
	"./3": "./src/rounds/3.js",
	"./3.js": "./src/rounds/3.js",
	"./30": "./src/rounds/30.js",
	"./30.js": "./src/rounds/30.js",
	"./31": "./src/rounds/31.js",
	"./31.js": "./src/rounds/31.js",
	"./32": "./src/rounds/32.js",
	"./32.js": "./src/rounds/32.js",
	"./33": "./src/rounds/33.js",
	"./33.js": "./src/rounds/33.js",
	"./34": "./src/rounds/34.js",
	"./34.js": "./src/rounds/34.js",
	"./35": "./src/rounds/35.js",
	"./35.js": "./src/rounds/35.js",
	"./36": "./src/rounds/36.js",
	"./36.js": "./src/rounds/36.js",
	"./37": "./src/rounds/37.js",
	"./37.js": "./src/rounds/37.js",
	"./38": "./src/rounds/38.js",
	"./38.js": "./src/rounds/38.js",
	"./39": "./src/rounds/39.js",
	"./39.js": "./src/rounds/39.js",
	"./4": "./src/rounds/4.js",
	"./4.js": "./src/rounds/4.js",
	"./40": "./src/rounds/40.js",
	"./40.js": "./src/rounds/40.js",
	"./41": "./src/rounds/41.js",
	"./41.js": "./src/rounds/41.js",
	"./42": "./src/rounds/42.js",
	"./42.js": "./src/rounds/42.js",
	"./43": "./src/rounds/43.js",
	"./43.js": "./src/rounds/43.js",
	"./44": "./src/rounds/44.js",
	"./44.js": "./src/rounds/44.js",
	"./45": "./src/rounds/45.js",
	"./45.js": "./src/rounds/45.js",
	"./46": "./src/rounds/46.js",
	"./46.js": "./src/rounds/46.js",
	"./47": "./src/rounds/47.js",
	"./47.js": "./src/rounds/47.js",
	"./48": "./src/rounds/48.js",
	"./48.js": "./src/rounds/48.js",
	"./49": "./src/rounds/49.js",
	"./49.js": "./src/rounds/49.js",
	"./5": "./src/rounds/5.js",
	"./5.js": "./src/rounds/5.js",
	"./50": "./src/rounds/50.js",
	"./50.js": "./src/rounds/50.js",
	"./6": "./src/rounds/6.js",
	"./6.js": "./src/rounds/6.js",
	"./7": "./src/rounds/7.js",
	"./7.js": "./src/rounds/7.js",
	"./8": "./src/rounds/8.js",
	"./8.js": "./src/rounds/8.js",
	"./9": "./src/rounds/9.js",
	"./9.js": "./src/rounds/9.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/rounds sync recursive ^\\.\\/.*$";

/***/ }),

/***/ "./src/rounds/0.js":
/*!*************************!*\
  !*** ./src/rounds/0.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[0, 0, 0, g, g, 0, 0, 0], [0, 0, 0, f, g, 0, 0, _], [0, 0, 0, f, 0, 0, 0, 0], [0, 0, 0, h, 0, 0, 0, _], [0, 0, 0, 0, h, 0, 0, 0], [0, 0, 0, k, 0, 0, 0, _], [0, 0, 0, k, 0, 0, 0, 0], [0, 0, 0, e, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/1.js":
/*!*************************!*\
  !*** ./src/rounds/1.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[m, 0, m, m, m, m, m, m, b, m, m, m, m, m, m, 0, m], [m, m, 0, 0, 0, 0, 0, b, b, 0, 0, 0, 0, 0, m, m, _], [0, m, 0, f, f, f, b, b, k, b, b, e, e, e, 0, m, 0], [m, 0, f, k, 0, e, e, k, k, f, f, 0, k, e, 0, m, _], [m, 0, 0, f, k, 0, e, 0, b, 0, f, 0, k, e, 0, 0, m], [0, 0, 0, b, k, k, 0, b, b, 0, k, k, b, 0, 0, 0, _], [0, 0, 0, b, b, 0, f, f, 0, e, e, 0, b, b, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/10.js":
/*!**************************!*\
  !*** ./src/rounds/10.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[k, k, e, e, b, b, f, f], [j, 0, j, 0, j, 0, j, _], [k, k, e, e, b, b, f, f], [j, 0, j, 0, j, 0, j, _], [k, k, e, e, b, b, f, f], [j, 0, j, 0, j, 0, j, _], [k, k, e, e, b, b, f, f], [j, 0, j, 0, j, 0, j, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/11.js":
/*!**************************!*\
  !*** ./src/rounds/11.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[0, 0, 0, h, k, e, 0, 0], [0, 0, 0, f, h, k, e, _], [0, 0, 0, b, i, f, h, 0], [0, 0, 0, e, b, i, f, _], [0, 0, 0, h, k, e, b, 0], [0, 0, 0, f, h, k, e, _], [0, 0, 0, 0, 0, f, h, 0], [0, 0, 0, 0, 0, 0, f, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/12.js":
/*!**************************!*\
  !*** ./src/rounds/12.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[k, k, 0, f, f, 0, b, b], [h, 0, 0, e, 0, 0, i, _], [0, k, e, b, i, f, h, 0], [i, 0, 0, e, 0, 0, k, _], [0, k, e, b, i, f, h, 0], [f, 0, h, 0, b, h, i, _], [k, e, b, i, f, h, 0, l], [0, 0, 0, 0, 0, 0, f, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/13.js":
/*!**************************!*\
  !*** ./src/rounds/13.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[i, i, i, i, i, i, i, i], [b, e, k, h, f, c, i, _], [h, f, c, b, e, 0, 0, k], [b, e, h, 0, 0, 0, c, _], [h, f, c, 0, 0, 0, e, k], [b, 0, 0, 0, 0, f, c, _], [h, 0, 0, 0, c, b, e, k], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/14.js":
/*!**************************!*\
  !*** ./src/rounds/14.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[k, e, b, 0, 0, 0, 0, 0], [h, k, e, b, 0, 0, 0, _], [0, f, h, k, e, 0, 0, 0], [b, i, f, h, 0, 0, 0, _], [k, e, b, i, f, 0, 0, 0], [h, k, e, b, 0, 0, 0, _], [i, f, h, k, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/15.js":
/*!**************************!*\
  !*** ./src/rounds/15.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[m, m, m, 0, 0, 0, 0, 0, b, 0, 0, 0, 0, 0, m, m, m], [m, m, 0, 0, k, e, b, i, f, h, c, g, 0, 0, m, m, _], [m, m, m, k, e, 0, 0, 0, f, h, 0, 0, c, g, m, m, m], [m, m, 0, 0, k, e, b, i, f, h, c, g, 0, 0, m, m, _], [m, m, m, k, e, 0, 0, 0, f, h, 0, 0, c, g, m, m, m], [m, m, 0, 0, k, e, b, i, f, h, c, g, 0, 0, m, m, _], [m, m, m, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, m, m, m], [m, m, l, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, l, m, m, _], [m, m, m, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, m, m, m], [m, m, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, m, m, _], [m, m, m, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, m, m, m], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/16.js":
/*!**************************!*\
  !*** ./src/rounds/16.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[g, g, h, h, i, i, e, e], [k, 0, g, e, h, 0, f, _], [0, e, h, k, f, g, i, h], [b, 0, e, 0, k, 0, g, _], [0, i, k, b, 0, e, 0, k], [f, c, i, k, b, h, e, _], [0, h, b, e, c, i, k, b], [g, k, h, 0, f, b, i, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/17.js":
/*!**************************!*\
  !*** ./src/rounds/17.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[g, g, g, g, g, g, g, g], [b, c, i, 0, k, b, c, _], [e, c, f, 0, 0, b, c, k], [f, b, h, 0, c, h, c, _], [f, k, h, 0, 0, c, c, c], [e, b, b, 0, k, i, b, _], [k, c, k, 0, 0, h, e, f], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/18.js":
/*!**************************!*\
  !*** ./src/rounds/18.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[0, 0, c, k, c, k, 0, 0], [0, c, k, h, c, k, 0, _], [0, c, k, e, h, c, k, 0], [e, c, e, j, e, k, h, _], [0, e, c, h, e, k, h, 0], [0, e, c, h, k, h, 0, _], [0, 0, e, c, k, h, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/19.js":
/*!**************************!*\
  !*** ./src/rounds/19.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[0, g, h, 0, 0, i, e, 0], [k, 0, g, k, h, 0, f, _], [0, e, k, 0, 0, g, h, 0], [b, 0, e, b, k, 0, g, _], [0, i, b, h, g, e, k, 0], [f, 0, i, f, b, 0, e, _], [0, h, f, 0, 0, i, b, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/2.js":
/*!*************************!*\
  !*** ./src/rounds/2.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[0, 0, 0, g, g, 0, 0, 0], [0, 0, 0, f, g, 0, 0, _], [0, 0, 0, f, 0, 0, 0, 0], [0, 0, 0, h, 0, 0, 0, _], [0, 0, 0, 0, h, 0, 0, 0], [0, 0, 0, k, 0, 0, 0, _], [0, 0, 0, k, 0, 0, 0, 0], [0, 0, 0, e, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/20.js":
/*!**************************!*\
  !*** ./src/rounds/20.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[m, m, m, 0, i, g, 0, m, m, m, 0, c, f, 0, m, m, m], [m, m, 0, b, 0, c, 0, m, m, 0, g, 0, h, 0, m, m, _], [m, m, m, 0, e, 0, f, h, m, b, i, 0, k, 0, m, m, m], [m, m, 0, k, 0, 0, 0, k, e, 0, 0, 0, e, 0, m, m, _], [m, m, m, h, 0, 0, 0, 0, 0, 0, 0, 0, 0, b, m, m, m], [m, m, f, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, i, m, m, _], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/21.js":
/*!**************************!*\
  !*** ./src/rounds/21.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[i, 0, 0, 0, 0, 0, 0, i], [f, f, 0, 0, 0, f, f, _], [e, h, k, e, e, k, h, e], [b, k, b, 0, b, k, b, _], [f, g, e, g, g, e, g, f], [h, i, 0, 0, 0, i, h, _], [g, k, b, h, h, b, k, g], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/22.js":
/*!**************************!*\
  !*** ./src/rounds/22.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[f, 0, 0, 0, 0, 0, 0, g], [f, e, k, 0, 0, g, i, _], [f, b, 0, 0, g, i, 0, g], [0, 0, g, i, 0, g, i, _], [0, g, i, 0, g, i, 0, g], [i, 0, g, i, 0, g, i, _], [0, g, i, 0, g, i, 0, g], [0, 0, g, i, 0, g, i, _], [0, g, i, 0, g, i, 0, g], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/23.js":
/*!**************************!*\
  !*** ./src/rounds/23.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[f, f, 0, f, f, 0, f, f], [f, h, k, b, i, c, f, _], [0, i, c, f, h, k, b, 0], [0, k, b, i, c, f, 0, _], [0, c, f, h, k, b, i, 0], [0, b, i, c, f, h, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/24.js":
/*!**************************!*\
  !*** ./src/rounds/24.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[f, f, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, k, k], [j, i, i, j, j, j, j, j, j, j, j, j, j, e, e, j, _], [0, 0, c, b, b, c, c, c, c, c, c, c, b, b, c, 0, 0], [0, 0, 0, j, e, e, j, j, j, j, i, i, j, 0, 0, 0, _], [0, 0, 0, 0, 0, c, k, k, c, f, f, c, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, j, h, h, j, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0, c, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/25.js":
/*!**************************!*\
  !*** ./src/rounds/25.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[f, l, h, l, k, l, e, 0], [i, j, c, 0, h, j, k, _], [b, 0, g, l, c, 0, h, 0], [e, j, f, 0, g, j, c, _], [k, 0, i, l, f, 0, g, 0], [h, j, b, 0, i, j, f, _], [c, 0, e, l, b, 0, i, 0], [g, 0, k, 0, e, 0, b, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/26.js":
/*!**************************!*\
  !*** ./src/rounds/26.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[g, c, 0, l, 0, 0, c, g], [h, k, 0, j, 0, k, h, _], [c, g, 0, j, 0, 0, g, c], [k, h, 0, j, 0, h, k, _], [g, c, 0, j, 0, 0, c, g], [0, 0, 0, j, 0, 0, 0, _], [0, 0, 0, j, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/27.js":
/*!**************************!*\
  !*** ./src/rounds/27.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[f, 0, 0, f, 0, 0, f, 0], [i, 0, 0, i, 0, 0, i, _], [0, k, f, 0, k, i, 0, k], [h, 0, 0, h, 0, 0, h, _], [b, 0, k, b, 0, h, b, 0], [c, 0, 0, c, 0, 0, c, _], [f, g, i, f, g, i, f, g], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/28.js":
/*!**************************!*\
  !*** ./src/rounds/28.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[l, l, l, l, l, l, l, l], [e, k, b, i, f, e, k, _], [k, b, i, f, e, k, b, i], [f, e, k, b, i, f, e, _], [e, k, b, i, f, e, k, b], [i, f, e, k, b, i, f, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/29.js":
/*!**************************!*\
  !*** ./src/rounds/29.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[0, 0, f, f, 0, h, h, 0, k, k, 0, e, e, 0, b, b, 0], [0, f, i, f, h, f, h, k, h, k, e, k, e, b, e, b, _], [0, 0, 0, f, j, 0, h, j, 0, k, j, 0, e, j, 0, b, 0], [h, h, j, c, c, j, g, g, j, f, f, j, i, i, 0, 0, _], [h, c, h, c, g, c, g, k, g, f, i, f, i, b, i, 0, 0], [h, 0, 0, c, 0, 0, g, 0, 0, f, 0, 0, i, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/3.js":
/*!*************************!*\
  !*** ./src/rounds/3.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[0, 0, 0, f, f, f, f, 0], [0, i, i, i, 0, f, 0, _], [0, i, 0, b, b, b, b, 0], [0, e, e, e, e, 0, b, _], [0, e, 0, k, k, k, k, 0], [0, h, h, h, h, 0, k, _], [0, f, i, b, e, k, h, 0], [0, 0, 0, e, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/30.js":
/*!**************************!*\
  !*** ./src/rounds/30.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[g, g, 0, 0, 0, 0, 0, 0], [c, b, 0, 0, 0, 0, 0, _], [h, g, c, g, 0, 0, 0, 0], [c, g, b, g, c, 0, 0, _], [0, h, k, c, b, g, h, g], [0, 0, g, g, b, g, c, _], [0, 0, 0, 0, 0, c, h, k], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/31.js":
/*!**************************!*\
  !*** ./src/rounds/31.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[f, 0, 0, 0, 0, 0, 0, l], [f, k, e, b, h, i, 0, _], [f, e, b, h, i, 0, 0, 0], [b, h, i, k, e, b, h, _], [h, i, k, e, b, 0, 0, k], [k, e, b, 0, 0, 0, 0, _], [e, b, h, i, k, e, b, k], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/32.js":
/*!**************************!*\
  !*** ./src/rounds/32.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[c, c, c, c, c, c, c, c], [f, k, e, b, h, i, 0, _], [c, c, c, c, c, c, c, c], [f, k, e, b, h, 0, i, _], [c, c, c, c, c, c, c, c], [f, k, e, b, 0, h, i, _], [c, c, c, c, c, c, c, c], [f, k, e, 0, b, h, i, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/33.js":
/*!**************************!*\
  !*** ./src/rounds/33.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[0, c, 0, c, k, 0, k, 0], [h, i, f, 0, h, i, f, _], [0, k, 0, k, c, 0, c, 0], [h, i, f, 0, h, i, f, _], [0, c, 0, c, k, 0, k, 0], [h, i, f, 0, h, i, f, _], [0, k, 0, k, c, 0, c, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/34.js":
/*!**************************!*\
  !*** ./src/rounds/34.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[0, 0, h, 0, 0, e, 0, 0], [0, i, k, i, k, k, 0, _], [0, e, 0, f, b, 0, b, 0], [0, 0, 0, j, 0, 0, 0, _], [0, e, 0, f, k, 0, h, 0], [0, f, b, b, f, f, 0, _], [0, 0, k, 0, 0, k, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/35.js":
/*!**************************!*\
  !*** ./src/rounds/35.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[k, 0, 0, 0, 0, 0, 0, c], [b, 0, 0, b, 0, 0, k, _], [0, c, 0, k, c, 0, b, 0], [0, k, c, b, k, c, 0, _], [k, c, b, k, c, b, k, c], [0, k, c, b, k, c, 0, _], [0, k, c, b, k, c, b, 0], [b, k, c, b, k, c, b, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/36.js":
/*!**************************!*\
  !*** ./src/rounds/36.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[0, 0, 0, h, f, 0, 0, 0], [0, 0, b, i, h, 0, 0, _], [0, 0, f, h, b, i, 0, 0], [0, b, i, f, h, b, 0, _], [0, f, h, b, i, f, h, 0], [b, i, f, l, b, i, f, _], [f, h, b, i, f, h, b, i], [i, f, h, b, i, f, h, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/37.js":
/*!**************************!*\
  !*** ./src/rounds/37.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[0, 0, b, 0, 0, i, 0, 0], [0, h, c, e, e, i, 0, _], [0, i, 0, f, g, 0, g, 0], [c, k, g, 0, c, i, c, _], [e, 0, k, c, g, e, 0, f], [e, i, g, e, h, h, g, _], [i, b, e, k, h, f, g, c], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/38.js":
/*!**************************!*\
  !*** ./src/rounds/38.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[m, f, f, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, g, g, m], [m, f, k, b, e, h, i, c, c, g, f, k, b, e, g, m, _], [m, m, f, k, b, e, h, i, c, g, f, k, b, e, g, m, m], [m, m, 0, 0, f, k, b, e, h, i, c, g, 0, 0, m, m, _], [m, m, m, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, m, m, m], [m, m, m, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, m, m, m, _], [m, m, m, m, 0, 0, 0, 0, 0, 0, 0, 0, 0, m, m, m, m], [m, m, m, m, 0, 0, 0, 0, 0, 0, 0, 0, m, m, m, m, _], [m, m, m, m, m, 0, 0, 0, 0, 0, 0, 0, m, m, m, m, m], [m, m, m, m, m, 0, 0, 0, 0, 0, 0, m, m, m, m, m, _], [m, m, m, m, m, m, 0, 0, 0, 0, 0, m, m, m, m, m, m], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/39.js":
/*!**************************!*\
  !*** ./src/rounds/39.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[i, 0, 0, 0, 0, 0, 0, i], [f, f, 0, 0, 0, f, f, _], [e, h, k, e, e, k, h, e], [b, k, b, 0, b, k, b, _], [f, g, e, g, g, e, g, f], [h, i, 0, 0, 0, i, h, _], [g, k, b, h, h, b, k, g], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/4.js":
/*!*************************!*\
  !*** ./src/rounds/4.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[0, g, g, g, c, c, c, 0], [0, f, 0, 0, 0, b, 0, _], [0, 0, b, 0, 0, e, 0, 0], [0, e, 0, 0, 0, k, 0, _], [0, 0, f, 0, 0, f, 0, 0], [0, f, 0, 0, 0, k, 0, _], [0, 0, f, 0, 0, f, 0, 0], [0, 0, c, 0, g, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/40.js":
/*!**************************!*\
  !*** ./src/rounds/40.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[m, k, k, k, k, k, k, k, m, k, k, k, k, k, k, k, m], [k, f, f, e, e, b, b, k, k, b, b, e, e, f, f, k, _], [k, f, f, e, e, b, b, 0, k, 0, b, b, e, e, f, f, k], [k, b, b, f, f, e, e, 0, 0, e, e, f, f, b, b, k, _], [k, b, b, f, f, e, e, e, 0, e, e, e, f, f, b, b, k], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/41.js":
/*!**************************!*\
  !*** ./src/rounds/41.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[i, 0, 0, l, l, 0, 0, i], [f, f, 0, l, 0, f, f, _], [e, h, k, i, i, k, h, e], [b, k, b, g, b, k, b, _], [f, g, e, f, f, e, g, f], [h, i, k, g, k, i, h, _], [g, 0, b, 0, 0, b, 0, g], [i, 0, k, 0, k, 0, i, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/42.js":
/*!**************************!*\
  !*** ./src/rounds/42.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[b, c, g, b, c, g, b, c], [g, b, c, g, b, c, g, _], [b, c, g, b, c, g, b, c], [g, b, c, g, b, c, g, _], [b, c, g, b, c, g, b, c], [g, b, c, g, b, c, g, _], [b, c, g, b, c, g, b, c], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/43.js":
/*!**************************!*\
  !*** ./src/rounds/43.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[f, 0, 0, e, 0, 0, k, 0], [b, 0, 0, i, 0, 0, f, _], [k, 0, 0, h, 0, 0, b, 0], [c, 0, l, g, 0, 0, g, _], [e, 0, 0, c, 0, 0, h, 0], [i, 0, 0, k, 0, 0, i, _], [h, 0, 0, f, 0, 0, e, 0], [g, 0, 0, b, 0, 0, k, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/44.js":
/*!**************************!*\
  !*** ./src/rounds/44.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[0, 0, 0, 0, 0, 0, e, e], [0, 0, 0, 0, 0, k, k, _], [0, 0, 0, 0, 0, g, c, h], [0, 0, 0, 0, h, e, k, _], [0, 0, 0, e, k, g, c, h], [0, 0, g, c, h, e, k, _], [g, c, h, e, k, g, c, h], [k, g, c, g, c, h, e, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/45.js":
/*!**************************!*\
  !*** ./src/rounds/45.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[0, 0, 0, 0, 0, 0, 0, 0, g, c, 0, 0, 0, 0, 0, 0, 0], [j, j, j, j, j, j, j, j, 0, j, j, j, j, j, j, j, _], [c, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, g], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/46.js":
/*!**************************!*\
  !*** ./src/rounds/46.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[m, m, m, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, m, m, m], [m, m, k, e, b, i, f, h, c, g, 0, 0, 0, 0, m, m, _], [m, m, m, 0, 0, 0, k, e, b, i, f, h, c, g, m, m, m], [m, m, k, e, b, i, f, h, c, g, 0, 0, 0, 0, m, m, _], [m, m, m, 0, 0, 0, k, e, b, i, f, h, c, g, m, m, m], [m, m, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, m, m, _], [m, m, m, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, m, m, m], [m, m, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, m, m, _], [m, m, m, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, m, m, m], [m, m, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, m, m, _], [m, m, m, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, m, m, m], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/47.js":
/*!**************************!*\
  !*** ./src/rounds/47.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[h, 0, 0, 0, 0, m, m, h, h, h, m, m, 0, 0, 0, 0, h], [f, i, b, e, 0, m, h, h, h, h, m, 0, e, b, i, f, _], [0, 0, 0, 0, k, 0, h, 0, 0, 0, h, 0, k, 0, 0, 0, 0], [0, i, f, h, 0, f, i, b, e, k, h, 0, h, f, i, 0, _], [0, b, 0, 0, 0, i, 0, 0, 0, 0, 0, f, 0, 0, 0, b, 0], [0, e, k, h, f, 0, 0, 0, 0, 0, 0, k, h, k, e, 0, _], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/48.js":
/*!**************************!*\
  !*** ./src/rounds/48.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[f, k, k, k, k, k, k, f], [f, h, h, h, h, h, f, _], [k, f, h, h, h, h, f, k], [h, f, h, h, h, f, b, _], [k, h, f, h, h, f, i, h], [e, b, f, h, f, h, k, _], [e, k, i, f, f, i, k, e], [h, i, k, b, e, b, e, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/49.js":
/*!**************************!*\
  !*** ./src/rounds/49.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[0, 0, e, e, e, e, e, 0, f, 0, e, e, e, e, e, 0, 0], [0, i, 0, 0, 0, 0, 0, b, b, 0, 0, 0, 0, 0, i, 0, _], [0, f, 0, 0, k, 0, 0, i, i, i, 0, 0, 0, 0, 0, f, 0], [b, 0, 0, 0, 0, 0, e, e, e, e, 0, 0, 0, 0, 0, b, _], [h, 0, 0, 0, 0, 0, h, h, h, h, h, 0, 0, 0, 0, 0, h], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/5.js":
/*!*************************!*\
  !*** ./src/rounds/5.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[f, f, b, b, e, e, k, k], [k, 0, k, 0, k, 0, k, _], [h, 0, e, 0, e, 0, b, 0], [h, e, b, k, b, f, 0, _], [0, h, 0, b, 0, e, 0, 0], [f, e, k, k, e, f, 0, _], [b, 0, j, 0, j, 0, k, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/50.js":
/*!**************************!*\
  !*** ./src/rounds/50.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[0, 0, h, 0, 0, b, 0, 0, h, 0, 0, b, 0, 0, h, 0, 0], [0, h, k, 0, b, i, 0, h, k, 0, b, i, 0, h, k, 0, _], [0, h, k, e, b, i, f, h, k, e, b, i, f, h, k, e, 0], [0, 0, 0, b, 0, 0, h, 0, 0, b, 0, 0, h, 0, 0, 0, _], [0, 0, 0, b, i, 0, h, k, l, b, i, 0, h, k, 0, 0, 0], [0, 0, b, i, f, h, k, e, b, i, f, h, k, e, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/6.js":
/*!*************************!*\
  !*** ./src/rounds/6.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[0, 0, 0, c, 0, 0, 0, c, c, c, 0, 0, 0, c, 0, 0, 0], [0, 0, c, c, 0, 0, c, b, b, c, 0, 0, c, c, 0, 0, _], [0, c, c, b, c, c, c, b, f, b, c, c, c, b, c, c, 0], [c, b, b, b, b, j, b, f, f, b, j, b, b, b, b, c, _], [0, f, b, j, b, b, j, b, f, b, j, b, b, j, b, f, 0], [0, i, b, j, j, j, j, b, b, j, j, j, j, b, i, 0, _], [0, 0, b, b, b, j, b, b, j, b, b, j, b, b, b, 0, 0], [0, 0, h, f, i, b, h, f, f, h, b, i, f, h, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/7.js":
/*!*************************!*\
  !*** ./src/rounds/7.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[h, h, h, h, h, h, h, h], [0, i, b, h, h, k, i, _], [0, 0, f, f, k, e, i, e], [0, 0, i, h, f, i, i, _], [0, 0, 0, h, i, b, k, k], [0, 0, 0, f, b, k, f, _], [0, 0, 0, 0, i, f, i, b], [0, 0, 0, f, k, i, k, _], [0, 0, 0, 0, i, i, f, e], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/8.js":
/*!*************************!*\
  !*** ./src/rounds/8.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[0, 0, 0, k, f, 0, 0, 0], [0, b, e, j, i, f, 0, _], [j, e, k, 0, 0, b, i, j], [b, j, h, 0, e, j, b, _], [j, 0, 0, f, k, 0, 0, j], [0, 0, i, j, h, 0, 0, _], [j, i, b, 0, 0, k, h, j], [f, j, e, 0, e, j, f, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/rounds/9.js":
/*!*************************!*\
  !*** ./src/rounds/9.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _ = _EntityMap.AlphabetizedMap._,
    x = _EntityMap.AlphabetizedMap.x,
    b = _EntityMap.AlphabetizedMap.b,
    c = _EntityMap.AlphabetizedMap.c,
    d = _EntityMap.AlphabetizedMap.d,
    e = _EntityMap.AlphabetizedMap.e,
    f = _EntityMap.AlphabetizedMap.f,
    g = _EntityMap.AlphabetizedMap.g,
    h = _EntityMap.AlphabetizedMap.h,
    i = _EntityMap.AlphabetizedMap.i,
    j = _EntityMap.AlphabetizedMap.j,
    k = _EntityMap.AlphabetizedMap.k,
    l = _EntityMap.AlphabetizedMap.l,
    m = _EntityMap.AlphabetizedMap.m;
/* 
    b=flame=red
    c=N=blue
    d=coin=green
    e=star=yellow
    f=solidBlack=purple
    g=moon=skyBlue
    h=heart=orange
    i=triangle=pink
    j=blank=white
    k=grey=grey
    l=special=rainbow
    m=block=gold
*/

exports.default = [[b, b, b, 0, 0, 0, k, k], [i, i, 0, k, 0, k, k, _], [f, f, 0, k, 0, c, k, k], [b, 0, k, k, c, 0, b, _], [i, 0, k, k, c, k, 0, i], [0, k, c, c, k, k, 0, _], [0, k, c, c, k, k, k, 0], [0, b, 0, i, 0, f, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, _], [x, x, x, x, x, x, x, x]];

/***/ }),

/***/ "./src/states/Load.js":
/*!****************************!*\
  !*** ./src/states/Load.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Player = __webpack_require__(/*! ../entities/Player */ "./src/entities/Player.js");

var _Player2 = _interopRequireDefault(_Player);

var _Constants = __webpack_require__(/*! ../utils/Constants */ "./src/utils/Constants.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// images and fonts will be served from express static since there are no
// webpack loaders available for the fnt extension
var image =  true ? './static/assets/images/' : undefined;
var font =  true ? './static/assets/fonts/' : undefined;
// const wav = './static/assets/audio/wav/';
var mp3 =  true ? './static/assets/audio/mp3/' : undefined;
var ogg =  true ? './static/assets/audio/ogg/' : undefined;

/*
    Loads all sprite, audio, and fonts. Enable arcade physics
 */

var Load = function (_Phaser$State) {
  _inherits(Load, _Phaser$State);

  function Load() {
    _classCallCheck(this, Load);

    return _possibleConstructorReturn(this, (Load.__proto__ || Object.getPrototypeOf(Load)).apply(this, arguments));
  }

  _createClass(Load, [{
    key: 'preload',
    value: function preload() {
      var _this2 = this;

      // Preload text - show this if it takes a while for assets to load
      var loadTimer = this.time.create(true);
      loadTimer.add(Phaser.Timer.SECOND * 1.5, function () {
        document.getElementsByTagName('canvas')[0].style.opacity = 1;

        var sound = document.getElementById('sound');
        if (sound) sound.style.opacity = 1;

        var loadingText = _this2.add.text(_Constants.CENTER_X, _Constants.CENTER_Y, 'LOADING...', {
          font: '40px monospace',
          fill: 'yellow',
          align: 'center',
          strokeThickness: 5
        });

        loadingText.anchor.set(0.5);
        loadingText.alpha = 0;

        var loadingTween = _this2.add.tween(loadingText).to({ alpha: 1 }, 500, 'Linear', true, 0, -1);

        loadingTween.yoyo(true, 300);
      }, this);
      loadTimer.start();

      // load image sprites
      this.load.image('tile-1', image + 'tile-sm-1.png');
      this.load.image('tile-2', image + 'tile-sm-2.png');
      this.load.image('tile-3', image + 'tile-sm-3.png');
      this.load.image('cloud-1', image + 'cloud-md-1.png');
      this.load.image('arrow-1', image + 'arrow-sm-1.png');
      this.load.image('block-1', image + 'block-sm-1.png');
      this.load.image('launcher-platform-1', image + 'launcher-platform-md-1.png');
      this.load.image('launcher-wheel-1', image + 'launcher-wheel-sm-1.png');
      this.load.image('speech-bubble-1', image + 'speech-bubble-sm-1.png');
      this.load.image('rainbow-1', image + 'rainbow-sm-1.png');

      // polnareff spritesheet
      // key, url, frameWidth, frameHeight, frameMax, margin, spacing
      this.load.spritesheet('polnareff-1', image + 'polnareff-sp-1.png', 60, 60, 2, 0, 0);

      // load fonts
      this.load.bitmapFont('happy-hell', font + 'happy-hell/medium/font.png', font + 'happy-hell/medium/font.fnt');
      this.load.bitmapFont('upheaval', font + 'upheaval/font.png', font + 'upheaval/font.fnt');

      // load audio (wav, mp3, ogg)
      this.load.audio('theme-0', [mp3 + 'theme-0.mp3', ogg + 'theme-0.ogg']);
      this.load.audio('theme-1', [mp3 + 'theme-1.mp3', ogg + 'theme-1.ogg']);
      this.load.audio('theme-2', [mp3 + 'theme-2.mp3', ogg + 'theme-2.ogg']);
      this.load.audio('game-win', [mp3 + 'game-win.mp3', ogg + 'game-win.ogg']);
      this.load.audio('game-lose', [mp3 + 'game-lose.mp3', ogg + 'game-lose.ogg']);
      this.load.audio('launch-bubble', [mp3 + 'launch-bubble.mp3', ogg + 'launch-bubble.ogg']);
      this.load.audio('target-bubble', [mp3 + 'target-bubble.mp3', ogg + 'target-bubble.ogg']);
      this.load.audio('non-target-bubble', [mp3 + 'non-target-bubble.mp3', ogg + 'non-target-bubble.ogg']);
      this.load.audio('select-navigation', [mp3 + 'select-navigation.mp3', ogg + 'select-navigation.ogg']);
      this.load.audio('switch-navigation', [ogg + 'switch-navigation.ogg',
      // fails to decode for firefox - (Error: The buffer passed to decodeAudioData contains invalid content which cannot be decoded successfully.)
      mp3 + 'switch-navigation.mp3']);

      // register keys. registering through the game object so each state can have access
      this.game.keyLeft = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
      this.game.keyRight = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
      this.game.keyUp = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
      this.game.keyDown = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
      this.game.keySpace = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      this.game.keyEnter = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

      // prevent key event propagating up to the browser
      this.input.keyboard.addKeyCapture([Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.ENTER]);
    }
  }, {
    key: 'create',
    value: function create() {
      document.getElementsByTagName('canvas')[0].style.opacity = 1;

      var sound = document.getElementById('sound');
      if (sound) sound.style.opacity = 1;

      // adding data object to prevent overwriting phaser props
      this.game.data = {};

      // namespace audio
      this.game.data.audio = {};
      this.game.data.audio.theme0 = this.game.add.audio('theme-0');
      this.game.data.audio.theme1 = this.game.add.audio('theme-1');
      this.game.data.audio.theme2 = this.game.add.audio('theme-2');
      this.game.data.audio.gameWin = this.game.add.audio('game-win');
      this.game.data.audio.gameLose = this.game.add.audio('game-lose');
      this.game.data.audio.launchBubble = this.game.add.audio('launch-bubble');
      this.game.data.audio.targetBubble = this.game.add.audio('target-bubble');
      this.game.data.audio.nonTargetBubble = this.game.add.audio('non-target-bubble');
      this.game.data.audio.selectNavigation = this.game.add.audio('select-navigation');
      this.game.data.audio.switchNavigation = this.game.add.audio('switch-navigation');

      // load continuing user if they exist
      var player = _Player2.default.getExistingPlayer();
      if (player) {
        var name = player.name,
            credits = player.credits,
            totalScore = player.totalScore,
            highScore = player.highScore,
            currentRound = player.currentRound,
            gameCompleted = player.gameCompleted;

        this.game.data.player = new _Player2.default(name, credits, totalScore, highScore, currentRound, gameCompleted);
      } else {
        this.game.data.player = null;
      }

      // enable physics
      this.physics.startSystem(Phaser.Physics.ARCADE);
      // change start
      this.state.start('menu');
      // initialize sounds
      this.game.data.audio.theme0.play(null, 0, 1, true);
      this.toggleSound();

      console.log('LAUNCHING GAME ', this.game);
    }

    // https://github.com/photonstorm/phaser/issues/2913

  }, {
    key: 'toggleSound',
    value: function toggleSound() {
      var _this3 = this;

      var soundElement = document.getElementById('sound');

      this.game.data.audio.theme0.onPlay.addOnce(function () {
        console.log('STARTING THEME 0');
        if (_this3.game.sound.context.state === 'suspended') {
          _this3.game.sound.context.suspend().then(function () {
            _this3.game.sound.mute = true;
            soundElement.style.backgroundImage = "url('" + image + "volume-mute.svg')";
          });
        } else {
          _this3.game.sound.context.resume().then(function () {
            _this3.game.sound.mute = false;
            soundElement.style.backgroundImage = "url('" + image + "volume-medium.svg')";
          });
        }
      });

      soundElement.addEventListener('click', function () {
        console.log('toggle sound');
        _this3.game.sound.context.resume().then(function () {
          if (_this3.game.sound.mute) {
            _this3.game.sound.mute = false;
            soundElement.style.backgroundImage = "url('" + image + "volume-medium.svg')";
          } else {
            _this3.game.sound.mute = true;
            soundElement.style.backgroundImage = "url('" + image + "volume-mute.svg')";
          }
        });
      });
    }
  }]);

  return Load;
}(Phaser.State);

exports.default = Load;

/***/ }),

/***/ "./src/states/Menu.js":
/*!****************************!*\
  !*** ./src/states/Menu.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Player = __webpack_require__(/*! ../entities/Player */ "./src/entities/Player.js");

var _Player2 = _interopRequireDefault(_Player);

var _Navigation = __webpack_require__(/*! ../entities/Navigation */ "./src/entities/Navigation.js");

var _Navigation2 = _interopRequireDefault(_Navigation);

var _Constants = __webpack_require__(/*! ../utils/Constants */ "./src/utils/Constants.js");

var _Helpers = __webpack_require__(/*! ../utils/Helpers */ "./src/utils/Helpers.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var adjustSize = (0, _Helpers.setSize)(_Constants.MIN_HEIGHT, _Constants.CANVAS_HEIGHT);

var Menu = function (_Phaser$State) {
    _inherits(Menu, _Phaser$State);

    function Menu() {
        _classCallCheck(this, Menu);

        return _possibleConstructorReturn(this, (Menu.__proto__ || Object.getPrototypeOf(Menu)).apply(this, arguments));
    }

    _createClass(Menu, [{
        key: 'init',
        value: function init(prevState) {
            if (prevState === 'play') {
                this.game.data.audio.theme0.play(null, 0, 1, true);
            }
        }
    }, {
        key: 'create',
        value: function create() {
            // TODO: https://stackoverflow.com/questions/39152877/consider-marking-event-handler-as-passive-to-make-the-page-more-responsive
            this.createTiles();
            this.createLogo();
            this.createNavigation();

            // event listeners
            this.game.keyEnter.onDown.add(this.changeState, this);
            this.game.input.onDown.add(this.changeState, this);

            this.game.keyDown.onDown.add(this.changeCurrentNavigation, this);
            this.game.keyUp.onDown.add(this.changeCurrentNavigation, this);
        }
    }, {
        key: 'createTiles',
        value: function createTiles() {
            var tiles = this.add.group();
            tiles.createMultiple(_Constants.ROWS * _Constants.COLUMNS, 'tile-1', null, true);
            tiles.setAll('width', _Constants.TILE_SIZE);
            tiles.setAll('height', _Constants.TILE_SIZE);
            // rows and columns are opposites for this method
            tiles.align(_Constants.COLUMNS, _Constants.ROWS, _Constants.TILE_SIZE, _Constants.TILE_SIZE);
        }
    }, {
        key: 'createLogo',
        value: function createLogo() {
            var logo = this.add.group();
            var cloud = logo.create(_Constants.CENTER_X, _Constants.CENTER_Y - adjustSize(10), 'cloud-1');
            cloud.width = adjustSize(510);
            cloud.height = adjustSize(450);
            // x, y, font, text, size, group
            // large: 130, medium: 100, small: 72
            this.add.bitmapText(_Constants.CENTER_X - adjustSize(50), _Constants.CENTER_Y - adjustSize(45), 'happy-hell', 'BUBBLE', _Constants.TITLE_FONT_SIZE, logo);
            this.add.bitmapText(_Constants.CENTER_X + adjustSize(30), _Constants.CENTER_Y + adjustSize(40), 'happy-hell', 'SHOOTER', _Constants.TITLE_FONT_SIZE, logo);
            logo.setAll('anchor.x', 0.5);
            logo.setAll('anchor.y', 0.5);
        }

        // adding logo text

    }, {
        key: 'createNavigation',
        value: function createNavigation() {

            this.navigation = new _Navigation2.default(this.game, [{
                name: 'NEW GAME',
                stateName: 'newGame',
                font: 'upheaval',
                fontSize: _Constants.NAV_FONT_SIZE
            }], _Constants.CENTER_X, _Constants.CENTER_Y + adjustSize(110), adjustSize(40));

            this.navigation.createPolnareff(_Constants.CENTER_X - adjustSize(105), _Constants.CENTER_Y + adjustSize(113), adjustSize(38));

            this.navigation.polnareff.width = adjustSize(36);
            this.navigation.polnareff.height = adjustSize(36);
        }
    }, {
        key: 'changeCurrentNavigation',
        value: function changeCurrentNavigation(e) {
            if (e.keyCode === this.game.keyDown.keyCode) {
                this.navigation.changeCurrentNavigation(1);
            }

            if (e.keyCode === this.game.keyUp.keyCode) {
                this.navigation.changeCurrentNavigation(-1);
            }

            this.game.data.audio.switchNavigation.play();
        }
    }, {
        key: 'changeState',
        value: function changeState(e) {
            var _this2 = this;

            var state = this.navigation.children[this.navigation.currentIndex].stateName;

            if (state === 'newGame') {
                _Player2.default.clear();
                this.game.data.player = new _Player2.default();
                state = 'play';
            } else if (state === 'continue') {
                state = 'play';
            }

            this.navigation.tweenNavigation(this.navigation.currentIndex, function () {
                _this2.state.start(state);

                if (state !== 'tutorial') {
                    _this2.game.data.audio.theme0.stop();
                }
            });

            this.game.data.audio.selectNavigation.play();
        }
    }, {
        key: 'shutdown',
        value: function shutdown() {
            this.game.keyEnter.onDown.remove(this.changeState, this);
            this.game.input.onDown.remove(this.changeState, this);

            this.game.keyDown.onDown.remove(this.changeCurrentNavigation, this);
            this.game.keyUp.onDown.remove(this.changeCurrentNavigation, this);
        }
    }]);

    return Menu;
}(Phaser.State);

exports.default = Menu;

/***/ }),

/***/ "./src/states/Play.js":
/*!****************************!*\
  !*** ./src/states/Play.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Constants = __webpack_require__(/*! ../utils/Constants */ "./src/utils/Constants.js");

var _Player = __webpack_require__(/*! ../entities/Player */ "./src/entities/Player.js");

var _Player2 = _interopRequireDefault(_Player);

var _Bubble = __webpack_require__(/*! ../entities/Bubble */ "./src/entities/Bubble.js");

var _Bubble2 = _interopRequireDefault(_Bubble);

var _Boundary = __webpack_require__(/*! ../entities/Boundary */ "./src/entities/Boundary.js");

var _Boundary2 = _interopRequireDefault(_Boundary);

var _Round = __webpack_require__(/*! ../entities/Round */ "./src/entities/Round.js");

var _Round2 = _interopRequireDefault(_Round);

var _Status = __webpack_require__(/*! ../entities/Status */ "./src/entities/Status.js");

var _Status2 = _interopRequireDefault(_Status);

var _Navigation = __webpack_require__(/*! ../entities/Navigation */ "./src/entities/Navigation.js");

var _Navigation2 = _interopRequireDefault(_Navigation);

var _ScoreKeeper = __webpack_require__(/*! ../utils/ScoreKeeper */ "./src/utils/ScoreKeeper.js");

var _ScoreKeeper2 = _interopRequireDefault(_ScoreKeeper);

var _Colors = __webpack_require__(/*! ../utils/Colors */ "./src/utils/Colors.js");

var _EntityMap = __webpack_require__(/*! ../utils/EntityMap */ "./src/utils/EntityMap.js");

var _Helpers = __webpack_require__(/*! ../utils/Helpers */ "./src/utils/Helpers.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var adjustSize = (0, _Helpers.setSize)(_Constants.MIN_HEIGHT, _Constants.CANVAS_HEIGHT);

/* 
    Manage game play. Track score, update matrix, update player stats, collision
*/

var Play = function (_Phaser$State) {
    _inherits(Play, _Phaser$State);

    function Play() {
        _classCallCheck(this, Play);

        return _possibleConstructorReturn(this, (Play.__proto__ || Object.getPrototypeOf(Play)).apply(this, arguments));
    }

    _createClass(Play, [{
        key: 'preload',
        value: function preload() {
            // stats
            this.nowPlaying = false;
            this.scoreKeeper = new _ScoreKeeper2.default();
            this.launchCountdown = _Constants.LAUNCH_COUNTDOWN;
            this.topBoundaryLaunchLimit = _Constants.TOP_BOUNDARY_LAUNCH_LIMIT;
            this.round = new _Round2.default(this.game.data.player.currentRound, _Constants.TILE_SIZE, _Constants.ANCHOR_OFFSET);
            this.bubbleLaunched = false;

            if (this.game.data.player.currentRound % 2 === 0) {
                this.theme = this.game.data.audio.theme1;
            } else {
                this.theme = this.game.data.audio.theme2;
            }

            this.theme.restart(null, 0, 1, true);
        }

        // initialize round

    }, {
        key: 'create',
        value: function create() {
            this.game.canvas.style.cursor = "none";
            this.createTiles();
            this.createBlocks();
            this.createBoundaries();
            this.createLauncher();
            this.createStage();
            this.createScoreboard();

            var specialCollision = _EntityMap.EntityMap.collision.rainbow.stages.includes(this.game.data.player.currentRound);
            if (specialCollision) {
                this.currentBubble = this.createBubble(_Constants.CURRENT_BUBBLE_X, _Constants.CURRENT_BUBBLE_Y, _EntityMap.EntityMap.rainbow);
            } else {
                this.currentBubble = this.createRandomBubble(_Constants.CURRENT_BUBBLE_X, _Constants.CURRENT_BUBBLE_Y);
            }
            this.nextBubble = this.createRandomBubble(_Constants.NEXT_BUBBLE_X, _Constants.NEXT_BUBBLE_Y);

            // game logic
            this.status = new _Status2.default(this.game, { fill: 0x00000 }, { x: _Constants.CENTER_X, y: _Constants.CENTER_Y, font: 'upheaval', message: 'READY', fontSize: _Constants.NAV_FONT_SIZE });
            this.pregame(this.startGame);

            // events
            this.game.keySpace.onDown.add(this.launchBubble, this);
            this.game.input.onDown.add(this.launchBubble, this);

            this.game.keyEnter.onDown.add(this.changeState, this);
            this.game.input.onDown.add(this.changeState, this);

            this.game.keyDown.onDown.add(this.changeCurrentNavigation, this);
            this.game.keyUp.onDown.add(this.changeCurrentNavigation, this);
        }
    }, {
        key: 'createTiles',
        value: function createTiles() {
            this.tiles = this.add.group();
            this.tiles.createMultiple(_Constants.ROWS * _Constants.COLUMNS, 'tile-2', null, true);
            this.tiles.setAll('width', _Constants.TILE_SIZE);
            this.tiles.setAll('height', _Constants.TILE_SIZE);
            // rows and columns are opposites for this method
            this.tiles.align(_Constants.COLUMNS, _Constants.ROWS, _Constants.TILE_SIZE, _Constants.TILE_SIZE);
        }
    }, {
        key: 'createBlocks',
        value: function createBlocks() {
            this.blocks = this.add.physicsGroup();

            // top / bottom blocks
            for (var i = 0; i < _Constants.COLUMNS; i++) {
                this.blocks.create(i * _Constants.TILE_SIZE + _Constants.ANCHOR_OFFSET, _Constants.ANCHOR_OFFSET, 'block-1');
                this.blocks.create(i * _Constants.TILE_SIZE + _Constants.ANCHOR_OFFSET, _Constants.CANVAS_HEIGHT - _Constants.ANCHOR_OFFSET, 'block-1');
            }

            var colLength = Math.floor((_Constants.COLUMNS - this.round.cols) / 2);
            for (var _i = 1; _i < _Constants.ROWS - 1; _i++) {
                for (var j = 0; j < colLength; j++) {
                    var left = this.blocks.create(j * _Constants.TILE_SIZE + _Constants.ANCHOR_OFFSET, _i * _Constants.TILE_SIZE + _Constants.ANCHOR_OFFSET, 'block-1');
                    var right = this.blocks.create(_Constants.CANVAS_WIDTH - _Constants.ANCHOR_OFFSET - j * _Constants.TILE_SIZE, _i * _Constants.TILE_SIZE + _Constants.ANCHOR_OFFSET, 'block-1');

                    left.body.checkCollision.up = false;
                    left.body.checkCollision.down = false;
                    left.body.checkCollision.left = false;
                    right.body.checkCollision.up = false;
                    right.body.checkCollision.down = false;
                    right.body.checkCollision.right = false;
                }
            }

            this.blocks.setAll('width', _Constants.TILE_SIZE);
            this.blocks.setAll('height', _Constants.TILE_SIZE);

            // half blocks
            if (this.round.cols === _Constants.ROUND_MODE_2) {
                this.createHalfBlocks(colLength);
            }

            this.blocks.setAll('anchor', { x: 0.5, y: 0.5 });
            this.blocks.setAll('body.immovable', true);
            this.blocks.setAll('body.allowGravity', false);
        }
    }, {
        key: 'createHalfBlocks',
        value: function createHalfBlocks() {
            for (var i = 2; i < (_Constants.ROWS - 1) * 2; i++) {
                // left
                var left = this.blocks.create(this.round.startX - _Constants.ANCHOR_OFFSET / 2, i * (_Constants.TILE_SIZE / 2) + _Constants.ANCHOR_OFFSET / 2, 'block-1');
                left.width = _Constants.TILE_SIZE / 2;
                left.height = _Constants.TILE_SIZE / 2;
                left.body.checkCollision.up = false;
                left.body.checkCollision.down = false;
                left.body.checkCollision.left = false;

                // right
                var right = this.blocks.create(this.round.endX + _Constants.ANCHOR_OFFSET / 2, i * (_Constants.TILE_SIZE / 2) + _Constants.ANCHOR_OFFSET / 2, 'block-1');
                right.width = _Constants.TILE_SIZE / 2;
                right.height = _Constants.TILE_SIZE / 2;
                right.body.checkCollision.up = false;
                right.body.checkCollision.down = false;
                right.body.checkCollision.right = false;
            }
        }
    }, {
        key: 'createBoundaries',
        value: function createBoundaries() {
            this.topBoundary = new _Boundary2.default(this.game, { x1: this.round.startX, y1: this.round.startY }, { x2: this.round.endX, y2: this.round.startY }, _Colors.Colors.skyBlue);

            this.bottomBoundary = new _Boundary2.default(this.game, { x1: this.round.startX, y1: this.round.endY }, { x2: this.round.endX, y2: this.round.endY }, _Colors.Colors.skyBlue);

            this.physics.enable(this.topBoundary, Phaser.Physics.ARCADE);
            this.topBoundary.body.immovable = true;
            this.topBoundary.body.allowGravity = false;
            this.topBoundary.body.setSize(_Constants.CANVAS_WIDTH, _Constants.TILE_SIZE + 1);
        }
    }, {
        key: 'createScoreboard',
        value: function createScoreboard() {
            this.totalScoreText = this.add.bitmapText(_Constants.ANCHOR_OFFSET - adjustSize(3), _Constants.ANCHOR_OFFSET - adjustSize(3), 'upheaval', (0, _Helpers.appendDigits)(14, this.game.data.player.totalScore, 'TOTAL'), _Constants.MID_FONT_SIZE);
            this.totalScoreText.anchor.set(0, 0.5);

            this.roundText = this.add.bitmapText(_Constants.CANVAS_WIDTH - _Constants.ANCHOR_OFFSET + adjustSize(3), _Constants.ANCHOR_OFFSET - adjustSize(3), 'upheaval', (0, _Helpers.appendDigits)(3, this.game.data.player.currentRound, 'ROUND'), _Constants.MID_FONT_SIZE);
            this.roundText.anchor.set(1, 0.5);

            this.creditText = this.add.text(_Constants.CANVAS_WIDTH - _Constants.ANCHOR_OFFSET + adjustSize(3), _Constants.CANVAS_HEIGHT - _Constants.ANCHOR_OFFSET, 'CREDITS ' + this.game.data.player.credits, { font: _Constants.DESC_FONT_SIZE + 'px monospace', fill: "white", align: "left", stroke: 'black', strokeThickness: 3 });

            this.creditText.anchor.set(1, 0.35);
        }
    }, {
        key: 'createLauncher',
        value: function createLauncher() {
            // polnareff
            this.polnareff = this.add.sprite(_Constants.CENTER_X - adjustSize(72), _Constants.CANVAS_HEIGHT + adjustSize(6) - 2 * _Constants.TILE_SIZE, 'polnareff-1', 0);
            this.polnareff.width = adjustSize(48);
            this.polnareff.height = adjustSize(48);
            this.polnareff.anchor.set(0.5, 0.5);
            this.polnareff.animations.add('bounce', [0, 1], 2, true);
            this.polnareff.animations.play('bounce');

            // launcher pieces
            this.arrow = this.add.sprite(_Constants.CENTER_X, _Constants.CANVAS_HEIGHT - _Constants.LAUNCHER_HEIGHT + _Constants.ANCHOR_OFFSET, 'arrow-1');
            this.arrow.anchor.set(0.5, 0.95);
            this.arrow.width = adjustSize(14);
            this.arrow.height = adjustSize(60);

            // wheel
            this.launcherWheel = this.add.sprite(_Constants.CENTER_X - adjustSize(14), _Constants.CANVAS_HEIGHT - 2 * _Constants.TILE_SIZE, 'launcher-wheel-1');
            this.launcherWheel.anchor.set(0.5, 0.5);
            this.launcherWheel.width = adjustSize(57);
            this.launcherWheel.height = adjustSize(57);

            // platform
            this.launcherPlatform = this.add.sprite(_Constants.CENTER_X - adjustSize(1), _Constants.CANVAS_HEIGHT - 2 * _Constants.TILE_SIZE, 'launcher-platform-1');
            this.launcherPlatform.anchor.set(0.26, 0.5);
            this.launcherPlatform.width = adjustSize(90);
            this.launcherPlatform.height = adjustSize(62);

            // next text
            this.nextText = this.add.bitmapText(_Constants.CENTER_X + adjustSize(91), _Constants.CANVAS_HEIGHT - _Constants.LAUNCHER_HEIGHT + _Constants.TILE_SIZE + adjustSize(13), 'upheaval', 'NEXT', _Constants.MID_FONT_SIZE);
            this.nextText.anchor.set(0.5, 0.5);

            // speech bubble 
            this.speechBubble = this.add.sprite(_Constants.CENTER_X - adjustSize(118), _Constants.CANVAS_HEIGHT - _Constants.LAUNCHER_HEIGHT + adjustSize(8), 'speech-bubble-1');
            this.speechBubble.width = adjustSize(42);
            this.speechBubble.height = adjustSize(42);
            this.speechBubble.alpha = 0;
            this.speechBubbleText = this.add.bitmapText(_Constants.CENTER_X - adjustSize(97), _Constants.CANVAS_HEIGHT - _Constants.LAUNCHER_HEIGHT + adjustSize(23), 'upheaval', this.launchCountdown, _Constants.MID_FONT_SIZE);
            this.speechBubbleText.alpha = 0;
            this.speechBubbleText.anchor.set(0.5, 0.5);
        }
    }, {
        key: 'createStage',
        value: function createStage() {
            this.bubbles = this.add.physicsGroup(Phaser.Physics.ARCADE, this.world, "bubbles");
            this.round.clearSelection();

            for (var i = 0; i < this.round.matrix.length; i++) {
                for (var j = 0; j < this.round.matrix[i].length; j++) {
                    var colorCode = this.round.matrix[i][j];
                    if (colorCode === _EntityMap.EntityMap.zero || colorCode === _EntityMap.EntityMap.empty || colorCode === _EntityMap.EntityMap.outOfBounds) continue;

                    var _round$getCoordinates = this.round.getCoordinates(i, j),
                        x = _round$getCoordinates.x,
                        y = _round$getCoordinates.y;

                    this.createBubble(x, y, colorCode, this.bubbles);
                    if (colorCode !== _EntityMap.EntityMap.gold && colorCode !== _EntityMap.EntityMap.white && colorCode !== _EntityMap.EntityMap.rainbow) {
                        this.round.addSelection(colorCode);
                    }
                }
            }

            this.bubbles.setAll('body.immovable', true);
            this.bubbles.setAll('body.allowGravity', false);
        }
    }, {
        key: 'createBubble',
        value: function createBubble(x, y, colorCode, group) {
            var bubble = null;

            if (colorCode === _EntityMap.EntityMap.rainbow) {
                bubble = new _Bubble2.default(this.game, _Constants.TILE_SIZE, x, y, colorCode, group, _EntityMap.EntityMap.collision.rainbow.name, 0);
                bubble.width = _Constants.TILE_SIZE;
                bubble.height = _Constants.TILE_SIZE;
            } else {
                bubble = new _Bubble2.default(this.game, _Constants.TILE_SIZE, x, y, colorCode, group);
            }

            // physics
            this.physics.enable(bubble, Phaser.Physics.ARCADE);
            bubble.body.setSize(_Constants.BUBBLE_PHYSICS_SIZE, _Constants.BUBBLE_PHYSICS_SIZE);
            bubble.body.bounce.set(1);

            return bubble;
        }
    }, {
        key: 'createRandomBubble',
        value: function createRandomBubble(x, y, group) {
            var randomColorCode = (0, _Helpers.getRandomInteger)(this.round.selection);
            var rainbowChance = Math.floor(Math.random() * 100);
            if (rainbowChance === 10) {
                randomColorCode = _EntityMap.EntityMap.rainbow;
            }
            return this.createBubble(x, y, randomColorCode, group);
        }

        // add 'ready go' text before starting the game.
        // calls the startGame function after 'ready go' text disappears

    }, {
        key: 'pregame',
        value: function pregame(cb) {
            var _this2 = this;

            // create a one-off timers that autodestroys itself
            var pregameTimer1 = this.time.create(true);
            pregameTimer1.add(Phaser.Timer.SECOND * 1.5, function () {
                var pregameTimer2 = _this2.time.create(true);
                pregameTimer2.add(Phaser.Timer.SECOND * 1.5, cb, _this2);
                pregameTimer2.start();
                _this2.status.header.setText('GO');
            }, this);

            pregameTimer1.start();
        }

        // remove overlay, starts timer, setups stats, enable input

    }, {
        key: 'startGame',
        value: function startGame() {
            var _this3 = this;

            console.log('NOW PLAYING...');
            this.nowPlaying = true;
            this.status.removeAll(true);
            this.launchTimer = this.time.create(false);
            this.launchTimer.loop(Phaser.Timer.SECOND * 1, this.updateLaunchCountdown, this);
            this.launchTimer.start();

            this.gameTimer = this.time.create(false);
            this.gameTimer.loop(Phaser.Timer.SECOND * 1, function () {
                _this3.scoreKeeper.time++;
            }, this);
            this.gameTimer.start();
        }
    }, {
        key: 'stopGame',
        value: function stopGame(result) {
            var win = result === 'WIN' || result === 'WINALL';
            this.nowPlaying = false;
            this.launchTimer.destroy();
            this.gameTimer.destroy();
            this.scoreKeeper.calculateFinalResult(win);
            var _scoreKeeper = this.scoreKeeper,
                score = _scoreKeeper.score,
                time = _scoreKeeper.time,
                bonus = _scoreKeeper.bonus;


            switch (result) {
                case 'WIN':
                    this.win(score, time, bonus);
                    break;
                case 'WINALL':
                    this.winAll(score, time, bonus);
                    break;
                case 'LOSE':
                    this.lose(score, time, bonus);
                    break;
                case 'GAMEOVER':
                    this.gameover(score, time, bonus);
                    this.game.data.player = null;
                    break;
                default:
                    this.win(score, time, bonus);
                    break;
            }

            if (this.game.data.player) {
                this.updatePlayerStatus(score, time, bonus);
            }

            this.theme.stop();
        }
    }, {
        key: 'win',
        value: function win(score, time, bonus) {
            console.log('GAME OVER PLAYER WINS...');
            this.status = new _Status2.default(this.game, { fill: 0x00000 }, { x: _Constants.CENTER_X, y: _Constants.CENTER_Y - adjustSize(100), font: 'upheaval', message: 'YOU WIN', fontSize: _Constants.HEADER_FONT_SIZE }, {
                x: _Constants.CENTER_X - adjustSize(92), y: _Constants.CENTER_Y + adjustSize(5), font: 'upheaval', fontSize: _Constants.NAV_FONT_SIZE, distance: adjustSize(110),
                message: { score: score, time: time, bonus: bonus }
            });

            this.navigation = new _Navigation2.default(this.game, [{ name: 'CONTINUE', stateName: 'play', font: 'upheaval', fontSize: _Constants.NAV_FONT_SIZE }], _Constants.CENTER_X, _Constants.CENTER_Y + adjustSize(110), adjustSize(40));

            this.navigation.createPolnareff(_Constants.CENTER_X - adjustSize(105), _Constants.CENTER_Y + adjustSize(113), adjustSize(38));
            this.navigation.polnareff.width = adjustSize(36);
            this.navigation.polnareff.height = adjustSize(36);

            this.game.data.audio.gameWin.play();
        }
    }, {
        key: 'winAll',
        value: function winAll(score, time, bonus) {
            console.log('GAME OVER PLAYER COMPLETED GAME...');
            this.status = new _Status2.default(this.game, { fill: 0x00000 }, { x: _Constants.CENTER_X, y: _Constants.CENTER_Y - adjustSize(100), font: 'upheaval', message: 'CONGRATULATIONS!', fontSize: _Constants.HEADER_FONT_SIZE }, {
                x: _Constants.CENTER_X - adjustSize(92), y: _Constants.CENTER_Y + adjustSize(5), font: 'upheaval', fontSize: _Constants.NAV_FONT_SIZE, distance: adjustSize(110),
                message: { score: score, time: time, bonus: bonus }
            });

            this.navigation = new _Navigation2.default(this.game, [{ name: 'CONTINUE', stateName: 'menu', font: 'upheaval', fontSize: _Constants.NAV_FONT_SIZE }], _Constants.CENTER_X, _Constants.CENTER_Y + adjustSize(110), adjustSize(40));

            this.navigation.createPolnareff(_Constants.CENTER_X - adjustSize(105), _Constants.CENTER_Y + adjustSize(113), adjustSize(38));
            this.navigation.polnareff.width = adjustSize(36);
            this.navigation.polnareff.height = adjustSize(36);

            this.game.data.audio.gameWin.play();
        }
    }, {
        key: 'lose',
        value: function lose(score, time, bonus) {
            console.log('GAME OVER PLAYER LOSES...');
            this.status = new _Status2.default(this.game, { fill: 0x00000 }, { x: _Constants.CENTER_X, y: _Constants.CENTER_Y - adjustSize(100), font: 'upheaval', message: 'YOU LOSE', fontSize: _Constants.HEADER_FONT_SIZE }, {
                x: _Constants.CENTER_X - adjustSize(92), y: _Constants.CENTER_Y + adjustSize(5), font: 'upheaval', fontSize: _Constants.NAV_FONT_SIZE, distance: adjustSize(110),
                message: { score: score, time: time, bonus: bonus } });

            this.navigation = new _Navigation2.default(this.game, [{ name: 'CONTINUE', stateName: 'play', font: 'upheaval', fontSize: _Constants.NAV_FONT_SIZE }], _Constants.CENTER_X, _Constants.CENTER_Y + adjustSize(110), adjustSize(40));

            this.navigation.createPolnareff(_Constants.CENTER_X - adjustSize(105), _Constants.CENTER_Y + adjustSize(113), adjustSize(38));
            this.navigation.polnareff.width = adjustSize(36);
            this.navigation.polnareff.height = adjustSize(36);

            this.game.data.audio.gameLose.play();
        }

        // no more credits

    }, {
        key: 'gameover',
        value: function gameover(score, time, bonus) {
            console.log('GAME OVER PLAYER LOSES NO MORE CREDITS...');
            this.status = new _Status2.default(this.game, { fill: 0x00000 }, { x: _Constants.CENTER_X, y: _Constants.CENTER_Y - adjustSize(100), font: 'upheaval', message: 'GAME OVER', fontSize: _Constants.HEADER_FONT_SIZE }, {
                x: _Constants.CENTER_X - adjustSize(92), y: _Constants.CENTER_Y + adjustSize(5), font: 'upheaval', fontSize: _Constants.NAV_FONT_SIZE, distance: adjustSize(110),
                message: { score: score, time: time, bonus: bonus }
            });

            this.navigation = new _Navigation2.default(this.game, [{ name: 'MAIN MENU', stateName: 'menu', font: 'upheaval', fontSize: _Constants.NAV_FONT_SIZE }], _Constants.CENTER_X, _Constants.CENTER_Y + adjustSize(110), adjustSize(40));

            this.navigation.createPolnareff(_Constants.CENTER_X - adjustSize(105), _Constants.CENTER_Y + adjustSize(113), adjustSize(38));
            this.navigation.polnareff.width = adjustSize(36);
            this.navigation.polnareff.height = adjustSize(36);

            this.game.data.audio.gameLose.play();
        }
    }, {
        key: 'updatePlayerStatus',
        value: function updatePlayerStatus(score, time, bonus) {
            if (score > 0) {
                this.game.data.player.totalScore += bonus;

                if (this.game.data.player.totalScore >= _Constants.MAX_SCORE) {
                    this.game.data.player.totalScore = _Constants.MAX_SCORE;
                }

                // TODO: only applicable if we are going to store results to db
                if (this.game.data.player.highScore < this.game.data.player.totalScore) {
                    this.game.data.player.highScore = this.game.data.player.totalScore;
                }

                if (this.game.data.player.currentRound === _Constants.TOTAL_ROUNDS) {
                    if (!this.game.data.player.gameCompleted) {
                        this.game.data.player.gameCompleted = true;
                    }

                    this.game.data.player.currentRound = 1;
                } else {
                    this.game.data.player.currentRound++;
                }
            } else {
                // this.game.data.player.totalScore = 0;
                this.game.data.player.credits--;
            }

            this.totalScoreText.setText((0, _Helpers.appendDigits)(14, this.game.data.player.totalScore, 'TOTAL'));
            this.game.data.player.save();
            console.log('PLAYER STATUS UPDATE ', _Player2.default.getExistingPlayer());
        }
    }, {
        key: 'changeCurrentNavigation',
        value: function changeCurrentNavigation(e) {
            if (!this.nowPlaying && this.navigation) {
                if (e.keyCode === this.game.keyDown.keyCode) {
                    this.navigation.changeCurrentNavigation(1);
                }

                if (e.keyCode === this.game.keyUp.keyCode) {
                    this.navigation.changeCurrentNavigation(-1);
                }
                this.game.data.audio.switchNavigation.play();
            }
        }
    }, {
        key: 'changeState',
        value: function changeState(e) {
            var _this4 = this;

            if (!this.nowPlaying && this.navigation) {
                var currentIndex = this.navigation.currentIndex;
                var state = this.navigation.children[currentIndex].stateName;
                this.navigation.tweenNavigation(currentIndex, function () {
                    return _this4.state.start(state, true, false, 'play');
                });
                this.game.data.audio.selectNavigation.play();
            }
        }
    }, {
        key: 'launchBubble',
        value: function launchBubble() {
            if (this.nowPlaying && !this.bubbleLaunched) {
                console.log('LAUNCH BUBBLE... RESETTING COUNTDOWN ', this.launchCountdown);
                this.launchCountdown = _Constants.LAUNCH_COUNTDOWN;
                this.physics.arcade.velocityFromAngle(
                // https://phaser.io/docs/2.4.4/Phaser.Physics.Arcade.html#velocityFromRotation
                // need to subtract 90 to get the coordinates adjusted
                this.arrow.angle - 90, adjustSize(400), this.currentBubble.body.velocity);

                this.game.data.audio.launchBubble.play();
                this.bubbleLaunched = true;
            }
        }

        // game loop

    }, {
        key: 'update',
        value: function update() {
            if (this.nowPlaying) {
                this.updateCursorInput();
                this.updateCollision();
            }
        }
    }, {
        key: 'updateLaunchCountdown',
        value: function updateLaunchCountdown() {
            if (this.launchCountdown <= Math.floor(_Constants.LAUNCH_COUNTDOWN / 4)) {
                this.speechBubble.alpha = 1;
                this.speechBubbleText.alpha = 1;
                this.speechBubbleText.setText(this.launchCountdown);

                // TODO: use another soundfx
                this.game.data.audio.switchNavigation.play();

                if (this.launchCountdown === 0) {
                    this.launchBubble();
                }
            } else {
                this.speechBubble.alpha = 0;
                this.speechBubbleText.alpha = 0;
            }

            this.launchCountdown--;
        }

        // handles angle of arrow

    }, {
        key: 'updateCursorInput',
        value: function updateCursorInput() {

            var pointerX = this.game.input.activePointer.x;

            var angle = (pointerX - _Constants.CENTER_X) / _Constants.CENTER_X * _Constants.MAX_ARROW_RANGE;

            angle = Math.max(-_Constants.MAX_ARROW_RANGE, Math.min(_Constants.MAX_ARROW_RANGE, angle));

            this.arrow.angle = angle;
            this.launcherWheel.angle = angle;
        }

        // handles three types of collision against launched bubble

    }, {
        key: 'updateCollision',
        value: function updateCollision() {
            var blockCollision = this.physics.arcade.collide(this.currentBubble, this.blocks, function () {
                console.log('BLOCK COLLISION');
            }, null, this);

            var topBoundaryCollsion = this.physics.arcade.collide(this.currentBubble, this.topBoundary, function () {
                console.log('TOP BOUNDARY COLLISION');
            }, null, this);

            // NOTE: will need to research further.
            // ideally want the snapToGrid and updateTopBoundary methods within
            // the collision callback since it is unsure whether the cb is async
            var bubbles = {};
            var bubbleCollision = this.physics.arcade.collide(this.currentBubble, this.bubbles, function (currentBubble, collidingBubble) {
                console.log('BUBBLE COLLISION');
                bubbles.currentBubble = currentBubble;
                bubbles.collidingBubble = collidingBubble;
            }, null, this);

            if (topBoundaryCollsion || bubbleCollision) {
                this.snapToGrid(bubbles.currentBubble, bubbles.collidingBubble);
                this.updateTopBoundary();
                this.bubbleLaunched = false;
            }
        }

        // TODO: refactor
        // Finds indices of collision area
        // Snaps current bubble to collision area and reinitializes current and next bubbles
        // Removes any matches or floaters
        // Updates matrix, redraws stage
        // Check win lose status

    }, {
        key: 'snapToGrid',
        value: function snapToGrid(currentBubble, collidingBubble) {
            var curx = this.currentBubble.x;
            var cury = this.currentBubble.y;

            var _round$getIndices = this.round.getIndices(curx, cury),
                i = _round$getIndices.i,
                j = _round$getIndices.j;

            console.log('INDICES FOUND i: ' + i + ' j: ' + j);

            if (i < 0) {
                console.log('NEGATIVE INDEX: adjusting i sign');
                i = 0;
            }

            if (j < 0) {
                console.log('NEGATIVE INDEX: adjusting j sign');
                j = 0;
            }

            if (this.round.matrix[i][j] === _EntityMap.EntityMap.outOfBounds) {
                this.checkLose();
            } else {
                // adjustments for empty spaces
                if (this.round.matrix[i][j] === _EntityMap.EntityMap.empty) {
                    console.log('MATRIX EMPTY: adjusting j position');
                    j -= 1;

                    if (this.round.matrix[i][j] !== _EntityMap.EntityMap.zero) {
                        console.log('MATRIX FILLED: adjusting i and j position');
                        i += 1;
                        j += 1;
                    }
                }

                if (this.round.matrix[i][j] === _EntityMap.EntityMap.zero) {
                    var _round$getCoordinates2 = this.round.getCoordinates(i, j),
                        x = _round$getCoordinates2.x,
                        y = _round$getCoordinates2.y;

                    console.log('SNAPING TO x: ' + x + ' y: ' + y + ' i: ' + i + ' j: ' + j);

                    var currentColor = this.currentBubble.data.colorCode;
                    var newBubble = this.createBubble(x, y, currentColor, this.bubbles);
                    this.round.matrix[i][j] = currentColor;
                    newBubble.body.immovable = true;
                    newBubble.body.allowGravity = false;

                    this.currentBubble.body.velocity.x = 0;
                    this.currentBubble.body.velocity.y = 0;
                    this.currentBubble.destroy();

                    this.currentBubble = this.nextBubble;
                    this.currentBubble.x = _Constants.CURRENT_BUBBLE_X;
                    this.currentBubble.y = _Constants.CURRENT_BUBBLE_Y;
                    this.nextBubble = this.createRandomBubble(_Constants.NEXT_BUBBLE_X, _Constants.NEXT_BUBBLE_Y);

                    if (this.removeMatchingBubbles(i, j, currentBubble, collidingBubble)) {
                        this.bubbles.destroy();
                        this.createStage();
                        this.updateScore(currentColor);

                        console.log('REMAINING BUBBLES...', this.bubbles);
                        this.checkWin();
                    }
                }
            }
        }

        // remove bubbles connected to target
        // identify floating bubbles
        // partition by colorCode

    }, {
        key: 'removeMatchingBubbles',
        value: function removeMatchingBubbles(i, j, currentBubble, collidingBubble) {
            if ((currentBubble || collidingBubble) && (currentBubble.key || collidingBubble.key)) {
                return this.handleSpecialCollision(i, j, currentBubble, collidingBubble);
            } else {
                return this.handleDefaultCollision(i, j);
            }
        }
    }, {
        key: 'handleSpecialCollision',
        value: function handleSpecialCollision(curI, curJ, currentBubble, collidingBubble) {
            // TODO: refactor if other special collision are to be included
            // will only add the rainbow collision for now
            if (currentBubble.key === _EntityMap.EntityMap.collision.rainbow.name || collidingBubble.key === _EntityMap.EntityMap.collision.rainbow.name) {
                // set the targetColor and rainbow at x,y to 0
                // remove floaters
                var targetColor = null;
                var collidingBubbleIndices = this.round.getIndices(collidingBubble.x, collidingBubble.y);
                var collidingBubbleI = collidingBubbleIndices.i;
                var collidingBubbleJ = collidingBubbleIndices.j;

                if (currentBubble.key) {
                    targetColor = this.round.matrix[collidingBubbleI][collidingBubbleJ];
                    this.scoreKeeper.add(this.round.matrix[curI][curJ], curI, curJ);
                    this.round.matrix[curI][curJ] = _EntityMap.EntityMap.zero;
                } else {
                    targetColor = this.round.matrix[curI][curJ];
                    this.scoreKeeper.add(this.round.matrix[collidingBubbleI][collidingBubbleJ], collidingBubbleI, collidingBubbleJ);
                    this.round.matrix[collidingBubbleI][collidingBubbleJ] = _EntityMap.EntityMap.zero;
                }

                for (var i = 0; i < this.round.matrix.length; i++) {
                    for (var j = 0; j < this.round.matrix[i].length; j++) {
                        if (this.round.matrix[i][j] === targetColor) {
                            this.scoreKeeper.add(this.round.matrix[i][j], i, j);
                            this.round.matrix[i][j] = _EntityMap.EntityMap.zero;
                        }
                    }
                }

                this.removeFloatingBubbles();
                return true;
            } else {
                return false;
            }
        }
    }, {
        key: 'handleDefaultCollision',
        value: function handleDefaultCollision(i, j) {
            var _this5 = this;

            // start from the currentBubble indices
            var targetColor = this.round.matrix[i][j];
            var target = this.round.getBubbleHash(i, j);
            var matches = new Set();
            var queue = [target];

            while (queue.length) {
                var current = queue.shift();
                matches.add(current);

                var _round$fromBubbleHash = this.round.fromBubbleHash(current),
                    indices = _round$fromBubbleHash.indices;

                var neighbors = this.getNeighbors(indices.i, indices.j);

                neighbors.forEach(function (hash) {
                    var _round$fromBubbleHash2 = _this5.round.fromBubbleHash(hash),
                        colorCode = _round$fromBubbleHash2.colorCode;

                    if (colorCode === targetColor && !matches.has(hash)) {
                        queue.push(hash);
                    }
                });
            }

            if (matches.size > 2) {
                console.log('MATCH DETECTED REMOVING BUBBLES...');

                matches.forEach(function (hash) {
                    var _round$fromBubbleHash3 = _this5.round.fromBubbleHash(hash),
                        indices = _round$fromBubbleHash3.indices,
                        colorCode = _round$fromBubbleHash3.colorCode;

                    var i = indices.i,
                        j = indices.j;

                    _this5.scoreKeeper.add(colorCode, i, j);
                    _this5.round.matrix[i][j] = _EntityMap.EntityMap.zero;
                });

                this.removeFloatingBubbles();
                return true;
            } else {
                return false;
            }
        }

        // Identifies all clusters attached to the top row of matrix
        // Otherwise they are removed from the matrix

    }, {
        key: 'removeFloatingBubbles',
        value: function removeFloatingBubbles() {
            var _this6 = this;

            var topRow = this.round.matrix[this.round.topRow];
            var memo = new Set();
            var hasFloats = false;

            topRow.forEach(function (el, j) {
                if (_this6.round.isBubble(_this6.round.topRow, j)) {
                    _this6.floodFill(_this6.round.topRow, j, memo);
                }
            });

            console.log('REMOVING POTENTIAL FLOATING BUBBLES... ', memo);

            for (var i = 0; i < this.round.matrix.length; i++) {
                for (var j = 0; j < this.round.matrix[i].length; j++) {
                    var hash = this.round.getBubbleHash(i, j);
                    if (this.round.isBubble(i, j) && !memo.has(hash)) {
                        this.scoreKeeper.add(this.round.matrix[i][j], i, j);
                        this.round.matrix[i][j] = _EntityMap.EntityMap.zero;
                        hasFloats = true;
                    }
                }
            }

            if (hasFloats) {
                this.game.data.audio.nonTargetBubble.play();
            } else {
                this.game.data.audio.targetBubble.play();
            }
        }

        // recursively checks each neighbor
        // if neighbors exists they are added to the cluster
        // using a memoization to prevent long runtime

    }, {
        key: 'floodFill',
        value: function floodFill(i, j, memo) {
            var _this7 = this;

            memo.add(this.round.getBubbleHash(i, j));

            var neighbors = this.getNeighbors(i, j).filter(function (hash) {
                return !memo.has(hash);
            });

            if (neighbors.length) {
                neighbors.forEach(function (hash) {
                    var _round$fromBubbleHash4 = _this7.round.fromBubbleHash(hash),
                        indices = _round$fromBubbleHash4.indices;

                    _this7.floodFill(indices.i, indices.j, memo);
                });
            }
        }

        // return array of adjacent bubbles

    }, {
        key: 'getNeighbors',
        value: function getNeighbors(i, j) {
            // bubble {i, j, points, type, visited}
            var neighbors = [];

            // left
            if (this.round.isBubble(i, j - 1)) {
                neighbors.push(this.round.getBubbleHash(i, j - 1));
            }

            // right
            if (this.round.isBubble(i, j + 1)) {
                neighbors.push(this.round.getBubbleHash(i, j + 1));
            }

            if (this.round.isSmallRow(i)) {
                // top left
                if (this.round.isBubble(i - 1, j)) {
                    neighbors.push(this.round.getBubbleHash(i - 1, j));
                }
                // top right
                if (this.round.isBubble(i - 1, j + 1)) {
                    neighbors.push(this.round.getBubbleHash(i - 1, j + 1));
                }
                // bottom left
                if (this.round.isBubble(i + 1, j)) {
                    neighbors.push(this.round.getBubbleHash(i + 1, j));
                }
                // bottom right
                if (this.round.isBubble(i + 1, j + 1)) {
                    neighbors.push(this.round.getBubbleHash(i + 1, j + 1));
                }
            } else {
                // top left
                if (this.round.isBubble(i - 1, j - 1)) {
                    neighbors.push(this.round.getBubbleHash(i - 1, j - 1));
                }
                // top right
                if (this.round.isBubble(i - 1, j)) {
                    neighbors.push(this.round.getBubbleHash(i - 1, j));
                }
                // bottom left
                if (this.round.isBubble(i + 1, j - 1)) {
                    neighbors.push(this.round.getBubbleHash(i + 1, j - 1));
                }
                // bottom right
                if (this.round.isBubble(i + 1, j)) {
                    neighbors.push(this.round.getBubbleHash(i + 1, j));
                }
            }
            return neighbors;
        }
    }, {
        key: 'updateTopBoundary',
        value: function updateTopBoundary() {
            if (this.nowPlaying) {
                if (this.topBoundaryLaunchLimit === 0) {
                    var isValid = this.round.shiftTopBoundary();

                    console.log('SHIFTING TOP BOUNDARY... RESETTING LIMIT');
                    this.bubbles.destroy();
                    this.createStage();
                    this.topBoundary.y += _Constants.TILE_SIZE;
                    this.topBoundaryLaunchLimit = _Constants.TOP_BOUNDARY_LAUNCH_LIMIT;

                    if (!isValid) this.checkLose();
                } else {
                    console.log('LAUNCH LIMIT ', this.topBoundaryLaunchLimit);
                    this.topBoundaryLaunchLimit--;
                }
            }
        }
    }, {
        key: 'updateScore',
        value: function updateScore(currentColor) {
            var _this8 = this;

            console.log('UPDATING SCORE');

            this.scoreKeeper.calculate(currentColor);

            // animate scores
            this.scoreKeeper.mergeMap.forEach(function (bubble, idx) {
                var i = bubble.i,
                    j = bubble.j,
                    score = bubble.score;

                var _round$getCoordinates3 = _this8.round.getCoordinates(i, j),
                    x = _round$getCoordinates3.x,
                    y = _round$getCoordinates3.y;

                var scoreText = _this8.add.bitmapText(x, y, 'upheaval', score, _Constants.MID_FONT_SIZE);
                scoreText.anchor.set(0.5, 0.5);

                var scoreTween = _this8.add.tween(scoreText).to({ alpha: 0, y: y - 10 }, 600, Phaser.Easing.Linear.None, true, 0);

                scoreTween.onComplete.add(function () {
                    return scoreText.destroy();
                }, _this8);
            });

            this.game.data.player.totalScore += this.scoreKeeper.currentScore;
            this.totalScoreText.setText((0, _Helpers.appendDigits)(14, this.game.data.player.totalScore, 'TOTAL'));
            this.scoreKeeper.refreshMaps();
        }
    }, {
        key: 'checkLose',
        value: function checkLose() {
            if (this.game.data.player.credits === 0) {
                this.stopGame('GAMEOVER');
            } else {
                this.stopGame('LOSE');
            }
        }
    }, {
        key: 'checkWin',
        value: function checkWin() {
            if (!this.bubbles.length || this.bubbles.children.every(function (bubble) {
                return bubble.data.colorCode === _EntityMap.EntityMap.gold;
            })) {
                if (this.game.data.player.currentRound === _Constants.TOTAL_ROUNDS) {
                    this.stopGame('WINALL');
                } else {
                    this.stopGame('WIN');
                }
            }
        }
    }, {
        key: 'shutdown',
        value: function shutdown() {
            this.game.keySpace.onDown.remove(this.launchBubble, this);
            this.game.input.onDown.remove(this.launchBubble, this);

            this.game.keyEnter.onDown.remove(this.changeState, this);
            this.game.input.onDown.remove(this.changeState, this);

            this.game.keyDown.onDown.remove(this.changeCurrentNavigation, this);
            this.game.keyUp.onDown.remove(this.changeCurrentNavigation, this);
        }
    }]);

    return Play;
}(Phaser.State);

exports.default = Play;

/***/ }),

/***/ "./src/states/Tutorial.js":
/*!********************************!*\
  !*** ./src/states/Tutorial.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Constants = __webpack_require__(/*! ../utils/Constants */ "./src/utils/Constants.js");

var _Helpers = __webpack_require__(/*! ../utils/Helpers */ "./src/utils/Helpers.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var adjustSize = (0, _Helpers.setSize)(_Constants.MIN_HEIGHT, _Constants.CANVAS_HEIGHT);

var Tutorial = function (_Phaser$State) {
    _inherits(Tutorial, _Phaser$State);

    function Tutorial() {
        _classCallCheck(this, Tutorial);

        return _possibleConstructorReturn(this, (Tutorial.__proto__ || Object.getPrototypeOf(Tutorial)).apply(this, arguments));
    }

    _createClass(Tutorial, [{
        key: 'create',
        value: function create() {
            // builder
            this.createTiles();
            this.createInstructions();
            this.theme = this.game.data.audio.theme0;

            // events
            this.game.keyEnter.onDown.add(this.changeState, this);
        }
    }, {
        key: 'createTiles',
        value: function createTiles() {
            this.tiles = this.add.group();
            this.tiles.createMultiple(_Constants.ROWS * _Constants.COLUMNS, 'tile-3', null, true);
            this.tiles.setAll('width', _Constants.TILE_SIZE);
            this.tiles.setAll('height', _Constants.TILE_SIZE);
            // rows and columns are opposites for this method
            this.tiles.align(_Constants.COLUMNS, _Constants.ROWS, _Constants.TILE_SIZE, _Constants.TILE_SIZE);
        }
    }, {
        key: 'createInstructions',
        value: function createInstructions() {
            this.instructions = this.add.group();

            var rules = "• Clear all bubbles using the launcher to continue to the\n  next round.\n" + "• Remove the bubbles by attaching to clusters of 3 or more with\n  the same color.\n" + "• Bubbles with different colors can also be removed if they are\n  hanging from the cluster.\n" + "• Each bubble removed is worth 10 points.\n" + "• Each hanging bubble that is removed is worth\n  10^(total hanging bubbles) points per color.\n" + "• There are a total of 50 rounds and 6 credits per game. Good Luck!";

            var rulesHeader = this.add.bitmapText(_Constants.TILE_SIZE, _Constants.ANCHOR_OFFSET, 'upheaval', 'RULES', _Constants.HEADER_FONT_SIZE, this.instructions);
            var rulesDesc = this.add.text(_Constants.TILE_SIZE, _Constants.TILE_SIZE * 2, rules, { font: _Constants.DESC_FONT_SIZE + "px monospace", fill: "white", align: "left", stroke: 'black', strokeThickness: 3 }, this.instructions);

            var controls = "• SPACE = Launch bubble\n" + "• ARROW LEFT/RIGHT = Rotate launcher\n" + "• ENTER = Select navigation\n" + "• ARROW UP/DOWN = Switch navigation";

            var controlHeader = this.add.bitmapText(_Constants.TILE_SIZE, _Constants.CENTER_Y + _Constants.TILE_SIZE, 'upheaval', 'CONTROLS', _Constants.HEADER_FONT_SIZE, this.instructions);
            var controlDesc = this.add.text(_Constants.TILE_SIZE, _Constants.CENTER_Y + _Constants.TILE_SIZE * 2 + _Constants.ANCHOR_OFFSET, controls, { font: _Constants.DESC_FONT_SIZE + "px monospace", fill: "white", align: "left", stroke: 'black', strokeThickness: 3 }, this.instructions);

            // adding instruction text
            var instructions = this.add.text(_Constants.ANCHOR_OFFSET - adjustSize(3), _Constants.CANVAS_HEIGHT - _Constants.ANCHOR_OFFSET, "Press ENTER to go back", { font: _Constants.DESC_FONT_SIZE + "px monospace", fill: "white", align: "left", stroke: 'black', strokeThickness: 3 });

            instructions.anchor.set(0, 0.35);
            instructions.alpha = 0;

            // Yoyo the text
            var instructionsTween = this.add.tween(instructions).to({ alpha: 1 }, 500, "Linear", true, 0, -1);

            instructionsTween.yoyo(true, 300);
        }
    }, {
        key: 'changeState',
        value: function changeState(e) {
            this.state.start('menu');
        }
    }, {
        key: 'shutdown',
        value: function shutdown() {
            this.game.keyEnter.onDown.remove(this.changeState, this);
        }
    }]);

    return Tutorial;
}(Phaser.State);

exports.default = Tutorial;

/***/ }),

/***/ "./src/utils/Colors.js":
/*!*****************************!*\
  !*** ./src/utils/Colors.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/* 
    Map of colors used for bubbles
 */
var Colors = exports.Colors = {
    red: {
        fill: 0xFD8384,
        alpha: 1,
        stroke: 0xFF0000,
        strokeWidth: 2
    },
    blue: {
        fill: 0x8386FC,
        alpha: 1,
        stroke: 0x0000FF,
        strokeWidth: 2
    },
    green: {
        fill: 0xCAF6CB,
        alpha: 1,
        stroke: 0x90EE90,
        strokeWidth: 2
    },
    yellow: {
        fill: 0xFFFE00,
        alpha: 1,
        stroke: 0xd7df01,
        strokeWidth: 2
    },
    purple: {
        fill: 0xCF95F6,
        alpha: 1,
        stroke: 0xA020F0,
        strokeWidth: 2
    },
    skyBlue: {
        fill: 0xD8F5FE,
        alpha: 1,
        stroke: 0xaeebff,
        strokeWidth: 2
    },
    orange: {
        fill: 0xFED287,
        alpha: 1,
        stroke: 0xFFA500,
        strokeWidth: 2
    },
    pink: {
        fill: 0xff91c8,
        alpha: 1,
        stroke: 0xFF69B4,
        strokeWidth: 2
    },
    white: {
        fill: 0xFFFFFF,
        alpha: 1,
        stroke: 0xDDDDDD,
        strokeWidth: 2
    },
    grey: {
        fill: 0xEEEEEE,
        alpha: 1,
        stroke: 0xCCCCCC,
        strokeWidth: 2
    },
    // TODO
    rainbow: {
        fill: null,
        alpha: null,
        stroke: null,
        strokeWidth: null
    },
    gold: {
        fill: 0xFEEA89,
        alpha: 1,
        stroke: 0xDAA520,
        strokeWidth: 2
    }
};

/***/ }),

/***/ "./src/utils/Constants.js":
/*!********************************!*\
  !*** ./src/utils/Constants.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MID_FONT_SIZE = exports.NAV_FONT_SIZE = exports.DESC_FONT_SIZE = exports.HEADER_FONT_SIZE = exports.TITLE_FONT_SIZE = exports.MAX_SCORE = exports.TOTAL_ROUNDS = exports.ROUND_MODE_2 = exports.ROUND_MODE_1 = exports.BUBBLE_PHYSICS_SIZE = exports.NEXT_BUBBLE_Y = exports.NEXT_BUBBLE_X = exports.CURRENT_BUBBLE_Y = exports.CURRENT_BUBBLE_X = exports.TOP_BOUNDARY_LAUNCH_LIMIT = exports.LAUNCH_COUNTDOWN = exports.MAX_ARROW_RANGE = exports.LAUNCHER_HEIGHT = exports.SCOREBOARD_HEIGHT = exports.ANCHOR_OFFSET = exports.TILE_SIZE = exports.CENTER_Y = exports.CENTER_X = exports.CANVAS_WIDTH = exports.CANVAS_HEIGHT = exports.COLUMNS = exports.ROWS = exports.RATIO = exports.VIEWPORT_HEIGHT = exports.MAX_HEIGHT = exports.MIN_HEIGHT = undefined;

var _Helpers = __webpack_require__(/*! ./Helpers */ "./src/utils/Helpers.js");

var MIN_HEIGHT = exports.MIN_HEIGHT = 510;
var MAX_HEIGHT = exports.MAX_HEIGHT = 1190;
var VIEWPORT_HEIGHT = exports.VIEWPORT_HEIGHT = window.innerHeight;
var RATIO = exports.RATIO = 1.1176470588235294117647058823529411764705882352941176470588235294117647058823529411764705882352941176470588235294117647058823529411764705882352941176470588235294117647058823529411764705882352941176471;
var ROWS = exports.ROWS = 17;
var COLUMNS = exports.COLUMNS = 19;
var CANVAS_HEIGHT = exports.CANVAS_HEIGHT = (0, _Helpers.setCanvasHeight)(MIN_HEIGHT, MAX_HEIGHT, VIEWPORT_HEIGHT, ROWS);
var CANVAS_WIDTH = exports.CANVAS_WIDTH = CANVAS_HEIGHT * RATIO;
var CENTER_X = exports.CENTER_X = CANVAS_WIDTH / 2;
var CENTER_Y = exports.CENTER_Y = CANVAS_HEIGHT / 2;
var TILE_SIZE = exports.TILE_SIZE = CANVAS_WIDTH / COLUMNS;
var ANCHOR_OFFSET = exports.ANCHOR_OFFSET = TILE_SIZE / 2;
var SCOREBOARD_HEIGHT = exports.SCOREBOARD_HEIGHT = TILE_SIZE;
var LAUNCHER_HEIGHT = exports.LAUNCHER_HEIGHT = TILE_SIZE * 4;
var MAX_ARROW_RANGE = exports.MAX_ARROW_RANGE = 74;
var LAUNCH_COUNTDOWN = exports.LAUNCH_COUNTDOWN = 20;
var TOP_BOUNDARY_LAUNCH_LIMIT = exports.TOP_BOUNDARY_LAUNCH_LIMIT = 9;
var CURRENT_BUBBLE_X = exports.CURRENT_BUBBLE_X = CENTER_X;
var CURRENT_BUBBLE_Y = exports.CURRENT_BUBBLE_Y = CANVAS_HEIGHT - LAUNCHER_HEIGHT + ANCHOR_OFFSET;
var NEXT_BUBBLE_X = exports.NEXT_BUBBLE_X = CENTER_X + TILE_SIZE * 3;
var NEXT_BUBBLE_Y = exports.NEXT_BUBBLE_Y = CANVAS_HEIGHT - TILE_SIZE - ANCHOR_OFFSET;
var BUBBLE_PHYSICS_SIZE = exports.BUBBLE_PHYSICS_SIZE = TILE_SIZE - 10;
var ROUND_MODE_1 = exports.ROUND_MODE_1 = 17;
var ROUND_MODE_2 = exports.ROUND_MODE_2 = 8;
var TOTAL_ROUNDS = exports.TOTAL_ROUNDS = 50;
// https://stackoverflow.com/questions/307179/what-is-javascripts-highest-integer-value-that-a-number-can-go-to-without-losin
var MAX_SCORE = exports.MAX_SCORE = 99999999999999;
var TITLE_FONT_SIZE = exports.TITLE_FONT_SIZE = (0, _Helpers.setSize)(MIN_HEIGHT, CANVAS_HEIGHT)(80);
var HEADER_FONT_SIZE = exports.HEADER_FONT_SIZE = (0, _Helpers.setSize)(MIN_HEIGHT, CANVAS_HEIGHT)(40);
var DESC_FONT_SIZE = exports.DESC_FONT_SIZE = (0, _Helpers.setSize)(MIN_HEIGHT, CANVAS_HEIGHT)(12);
var NAV_FONT_SIZE = exports.NAV_FONT_SIZE = (0, _Helpers.setSize)(MIN_HEIGHT, CANVAS_HEIGHT)(30);
var MID_FONT_SIZE = exports.MID_FONT_SIZE = (0, _Helpers.setSize)(MIN_HEIGHT, CANVAS_HEIGHT)(20);

/***/ }),

/***/ "./src/utils/EntityMap.js":
/*!********************************!*\
  !*** ./src/utils/EntityMap.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/* 
    Map of entities (bubbles, blocks etc.. ) for quick access
    AlphabetizedMap is used for creating readable rounds
 */
var EntityMap = {
    empty: null,
    outOfBounds: -1,
    zero: 0,
    // Colors
    BUBBLE_START: 1,
    BUBBLE_END: 12,
    red: 1,
    blue: 2,
    grey: 3,
    yellow: 4,
    purple: 5,
    skyBlue: 6,
    orange: 7,
    pink: 8,
    white: 9,
    green: 10,
    rainbow: 11,
    gold: 12,
    // TODO: stripe (knocks all bubbles that it touches), creature (???)
    colors: {
        1: 'red',
        2: 'blue',
        3: 'grey',
        4: 'yellow',
        5: 'purple',
        6: 'skyBlue',
        7: 'orange',
        8: 'pink',
        9: 'white',
        10: 'green',
        11: 'rainbow',
        12: 'gold'
    },

    // Game Objects
    GAME_OBJECT_START: 50,
    GAME_OBJECT_END: 55,
    tile: 50,
    polnareff: 51,
    launcher: 52,
    bubble: 53,
    block: 54,
    gameObjects: {
        50: 'tile',
        51: 'polnareff',
        52: 'launcher',
        53: 'bubble',
        54: 'block'
    },

    // special collisions
    collision: {
        rainbow: {
            name: 'rainbow-1',
            stages: [3, 16, 20, 24, 38, 45, 49, 50]
        }

    }
};

// to make the map easier to read
var AlphabetizedMap = {
    _: null,
    x: -1,
    a: 0,
    // Colors
    b: 1,
    c: 2,
    d: 3,
    e: 4,
    f: 5,
    g: 6,
    h: 7,
    i: 8,
    j: 9,
    k: 10,
    l: 11,
    m: 12,

    // Game Objects
    A: 50,
    B: 51,
    C: 52,
    D: 53,
    E: 54
};

exports.EntityMap = EntityMap;
exports.AlphabetizedMap = AlphabetizedMap;

/***/ }),

/***/ "./src/utils/Helpers.js":
/*!******************************!*\
  !*** ./src/utils/Helpers.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getRandomInteger = getRandomInteger;
exports.appendDigits = appendDigits;
exports.setCanvasHeight = setCanvasHeight;
exports.setSize = setSize;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function getRandomInteger(selection) {
    var len = selection.size;
    var idx = Math.floor(Math.random() * len);
    var arr = [].concat(_toConsumableArray(selection));
    return arr[idx];
}

// adds leading zeros digitNumbers times to number
function appendDigits(digits, n, additionalText) {
    var value = additionalText ? additionalText + " " : "";
    var nstr = n.toString();
    var len = Math.abs(digits - nstr.length);

    for (var i = 0; i < len; i++) {
        value += "0";
    }

    value += nstr;
    return value;
}

function setCanvasHeight(min, max, viewportHeight, rows) {
    if (viewportHeight <= min) {
        return min;
    } else if (viewportHeight >= max) {
        return max;
    } else {
        return Math.floor((viewportHeight - 20) / rows) * rows;
    }
}

// adjust size of game object relative to canvas height
function setSize(minHeight, canvasHeight) {
    return function (defaultValue) {
        return Math.floor(defaultValue / minHeight * canvasHeight);
    };
}

/***/ }),

/***/ "./src/utils/ScoreKeeper.js":
/*!**********************************!*\
  !*** ./src/utils/ScoreKeeper.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var bubblePoints = 10;
var maxBonusPoints = 50000;
var bonusInterval = 840;

/* 
    Keeps tally of the score for the current round
*/

var ScoreKeeper = function () {
    function ScoreKeeper() {
        _classCallCheck(this, ScoreKeeper);

        this.currentScore = 0;
        this.score = 0;
        this.time = 0;
        this.bonus = 0;
        // stores the colorCode as key and value
        // will be an array of indices
        this.colorMap = new Map();
        this.mergeMap = [];
    }

    // used when a bubble match occurs or floaters are detected


    _createClass(ScoreKeeper, [{
        key: "add",
        value: function add(colorCode, i, j) {
            var current = this.colorMap.get(colorCode);
            if (current) {
                current.push({ i: i, j: j });
                this.colorMap.set(colorCode, current);
            } else {
                this.colorMap.set(colorCode, [{ i: i, j: j }]);
            }
        }

        // 10 points per matching color
        // 10^(non matching color count) per non matching color

    }, {
        key: "calculate",
        value: function calculate(currentColorCode) {
            var _this = this;

            this.colorMap.forEach(function (arr, key) {
                var pointsArr = void 0;
                if (key === currentColorCode) {
                    _this.score += arr.length * bubblePoints;
                    _this.currentScore += arr.length * bubblePoints;
                    arr.forEach(function (el) {
                        el.score = bubblePoints;
                        _this.mergeMap.push(el);
                    });
                } else {
                    _this.score += bubblePoints * Math.pow(2, arr.length) * arr.length;
                    _this.currentScore += bubblePoints * Math.pow(2, arr.length) * arr.length;
                    arr.forEach(function (el) {
                        el.score = bubblePoints * Math.pow(2, arr.length);
                        _this.mergeMap.push(el);
                    });
                }
                // this.colorMap.set(key, pointsArr);
            });
        }
    }, {
        key: "calculateFinalResult",
        value: function calculateFinalResult(win) {
            if (win) {
                this.calculateBonus();
            } else {
                this.bonus = 0;
                this.score = 0;
            }
        }
    }, {
        key: "calculateBonus",
        value: function calculateBonus() {
            if (this.time < 6) {
                this.bonus = maxBonusPoints;
            } else if (this.time >= 6 && this.time <= 64) {
                // 50000 - (840 * (64 - 5))
                this.bonus = maxBonusPoints - bonusInterval * (this.time - 5);
            } else {
                this.bonus = 0;
            }
        }
    }, {
        key: "refreshMaps",
        value: function refreshMaps() {
            this.colorMap.clear();
            this.mergeMap = [];
            this.currentScore = 0;
        }
    }]);

    return ScoreKeeper;
}();

exports.default = ScoreKeeper;

/***/ }),

/***/ 0:
/*!*******************************************************************************************************************!*\
  !*** multi webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true&quiet=true ./src/index.js ***!
  \*******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true&quiet=true */"./node_modules/webpack-hot-middleware/client.js?path=/__webpack_hmr&timeout=20000&reload=true&quiet=true");
module.exports = __webpack_require__(/*! ./src/index.js */"./src/index.js");


/***/ })

/******/ });
//# sourceMappingURL=app.js.map