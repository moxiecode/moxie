declare const _default: {
    get: (id: any) => any;
    hasClass: (obj: any, name: any) => boolean;
    addClass: (obj: any, name: any) => void;
    removeClass: (obj: any, name: any) => void;
    getStyle: (obj: any, name: any) => any;
    getPos: (node: any, root: any) => {
        x: number;
        y: number;
    };
    getSize: (node: any) => {
        w: any;
        h: any;
    };
};
export default _default;
