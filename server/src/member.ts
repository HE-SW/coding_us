const member = new Map<string, Set<string>>();

const service = {
    addMember: (name: string) => {
        member.set(name, new Set());
    },
    getMemberCode: (name: string) => {
        const set = member.get(name);
        return set?.values();
    },
};

export default service;
