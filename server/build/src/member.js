"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const member = new Map();
const service = {
    addMember: (name) => {
        member.set(name, new Set());
    },
    getMemberCode: (name) => {
        const set = member.get(name);
        return set === null || set === void 0 ? void 0 : set.values();
    },
};
exports.default = service;
