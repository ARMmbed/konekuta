"use strict";
/*
* mbed Cloud JavaScript SDK
* Copyright ARM Limited 2017
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
Object.defineProperty(exports, "__esModule", { value: true });
var sdkError_1 = require("./sdkError");
// Inspired by https://github.com/sonnyp/polygoat
// If a callback is passed, use that after running the passed function, otherwise return a promise chain
function asyncStyle(asyncFn, callbackFn) {
    if (callbackFn) {
        try {
            asyncFn(callbackFn);
        }
        catch (error) {
            callbackFn(new sdkError_1.SDKError(error.message, error));
        }
    }
    else {
        return new Promise(function (resolve, reject) {
            try {
                asyncFn(function (error, response) {
                    if (error)
                        reject(error);
                    else
                        resolve(response);
                });
            }
            catch (error) {
                reject(new sdkError_1.SDKError(error.message, error));
            }
        });
    }
}
exports.asyncStyle = asyncStyle;
// Wrap our functions to allow error catching
// Wraps an api function call and optionally a data transformation function to allow a single point for trapping errors
function apiWrapper(apiFn, transformFn, callbackFn) {
    // Use async style
    return asyncStyle(function (done) {
        try {
            // Call the api function
            apiFn(function (error, data) {
                if (error)
                    return done(error);
                if (!transformFn)
                    return done(null, data);
                try {
                    // Call the transformation function
                    transformFn(data, done);
                }
                catch (error) {
                    // Catch any errors when transforming the returned data
                    done(new sdkError_1.SDKError(error.message, error));
                }
            });
        }
        catch (error) {
            // Catch any errors when running api calls
            done(new sdkError_1.SDKError(error.message, error));
        }
    }, callbackFn);
}
exports.apiWrapper = apiWrapper;
function decodeBase64(payload, contentType) {
    var result = "";
    if (typeof atob === "function") {
        result = atob(payload);
    }
    else {
        result = new Buffer(payload, "base64").toString("utf8");
    }
    if (contentType && contentType.indexOf("json") > -1) {
        result = JSON.parse(result);
    }
    return result;
}
exports.decodeBase64 = decodeBase64;
function encodeInclude(include) {
    if (!include || !include.length)
        return null;
    return include.map(camelToSnake).join(",");
}
exports.encodeInclude = encodeInclude;
function snakeToCamel(snake) {
    return snake.replace(/(\_\w)/g, function (match) {
        return match[1].toUpperCase();
    });
}
exports.snakeToCamel = snakeToCamel;
function camelToSnake(camel) {
    return camel.replace(/([A-Z]+)/g, function (match) {
        return "_" + match.toLowerCase();
    });
}
exports.camelToSnake = camelToSnake;
function mapListResponse(from, data) {
    var to = {};
    to.after = from.after;
    to.hasMore = from.has_more;
    to.limit = from.limit;
    to.order = from.order;
    to.totalCount = from.total_count;
    to.data = data;
    return to;
}
exports.mapListResponse = mapListResponse;
function encodeFilter(filter, map, nested) {
    if (nested === void 0) { nested = []; }
    if (!filter)
        return "";
    function encode(filter, name, operator, prefix) {
        if (prefix === void 0) { prefix = ""; }
        var value = filter[name][operator];
        if (value instanceof Date)
            value = value.toISOString();
        if (typeof value === "boolean")
            value = value.toString();
        if (prefix) {
            prefix = camelToSnake(prefix);
            prefix = prefix + "__";
        }
        else {
            // Don't encode nested names
            var index = map.from.indexOf(name);
            name = (index > -1) ? map.to[index] : camelToSnake(name);
        }
        var suffix = operator.replace("$", "");
        if (suffix === "ne")
            suffix = "neq";
        if (suffix === "eq")
            suffix = ""; // Needs to removed when implemented properly in APIs
        if (suffix)
            suffix = "__" + suffix;
        return "" + prefix + name + suffix + "=" + value;
    }
    return Object.keys(filter).map(function (key) {
        return Object.keys(filter[key]).map(function (operator) {
            if (nested.indexOf(key) > -1) {
                return Object.keys(filter[key][operator]).map(function (sub) {
                    return encode(filter[key], operator, sub, key);
                }).join("&");
            }
            return encode(filter, key, operator);
        }).join("&");
    }).join("&");
}
exports.encodeFilter = encodeFilter;
function decodeFilter(from, map, nested) {
    if (nested === void 0) { nested = []; }
    var filter = {};
    function decodeName(name) {
        var index = map.to.indexOf(name);
        return (index > -1) ? map.from[index] : snakeToCamel(name);
    }
    function addOperator(comparisonObject, operator, value) {
        if (!operator)
            operator = "eq"; // Needs to removed when implemented properly in APIs
        if (operator === "neq")
            operator = "ne";
        operator = "$" + operator;
        comparisonObject[operator] = value;
    }
    from = decodeURIComponent(from);
    from.split("&").forEach(function (attrib) {
        var match = attrib.match(/^(.+)=(.+)$/);
        if (match) {
            var value = match[2];
            var bits = match[1].split("__");
            var name_1 = decodeName(bits[0]);
            if (!filter[name_1])
                filter[name_1] = {};
            if (nested.indexOf(name_1) > -1) {
                var nestedName = bits[1]; // Don't decode nested names
                if (!filter[name_1][nestedName])
                    filter[name_1][nestedName] = {};
                addOperator(filter[name_1][nestedName], bits[2], value);
                return;
            }
            addOperator(filter[name_1], bits[1], value);
        }
    });
    return filter;
}
exports.decodeFilter = decodeFilter;