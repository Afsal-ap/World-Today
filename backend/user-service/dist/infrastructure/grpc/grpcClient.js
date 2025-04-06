"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostsByIds = void 0;
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
const path_1 = __importDefault(require("path"));
const PROTO_PATH = path_1.default.resolve(__dirname, '../../../proto/post.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const PostService = protoDescriptor.post.PostService;
const client = new PostService('localhost:50051', grpc.credentials.createInsecure());
//grpc  
const getPostsByIds = (postIds) => {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(postIds) || postIds.length === 0) {
            console.log('Invalid postIds:', postIds);
            reject(new Error('No post IDs provided'));
            return;
        }
        console.log('Sending gRPC request with postIds:', postIds);
        // Ensure the request matches the proto definition
        const request = { post_ids: postIds }; // Use snake_case as defined in proto
        console.log("request.postiddd", request.post_ids);
        console.log("request", request);
        client.getPostsByIds(request, (error, response) => {
            if (error) {
                console.error('gRPC client error:', error);
                reject(error);
            }
            else {
                console.log('gRPC response:', response);
                if (!response || !response.posts) {
                    console.warn('Empty or invalid response received');
                    resolve([]);
                    return;
                }
                resolve(response.posts);
            }
        });
    });
};
exports.getPostsByIds = getPostsByIds;
