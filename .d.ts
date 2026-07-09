export {};

declare global {
    interface Array<T> {
        each(f: (item: T, index: number, array: T[]) => void): void;
        any(): boolean;
        none(): boolean;
    }

    interface Document {
        al<T extends Element = Element>(selectors: string): T[];
        one<T extends Element = Element>(selectors: string): T | null;
    }

    interface DocumentFragment {
        one<T extends Element = Element>(selectors: string): T | null;
        allfd<T extends Element = Element>(selectors: string): T[];
    }

    interface HTMLElement {
        all<T extends Element = Element>(selectors: string): T[];
        allfd<T extends Element = Element>(selectors: string): T[];
        attr(name: string): string | null;
        attr(name: string, value: string | null | boolean): HTMLElement;
        attrt(name: string, v1: string, v2: string): HTMLElement;
        clear(): HTMLElement;
        cls(): DOMTokenList;
        flag(name: string, value?: boolean | null): boolean | HTMLElement;
        hide(value?: boolean): HTMLElement;
        one<T extends Element = Element>(selectors: string): T | null;
        tpl(): HTMLElement;
        show(value?: boolean): HTMLElement;
        up<T extends Element = Element>(selectors?: string): T | HTMLElement | null;
        vget(): any;
        vset(data: any): HTMLElement;
        vpatch(data: any): HTMLElement;
        vappend(data: any, tpl?: any): HTMLElement;
        vprepend(data: any, tpl?: any): HTMLElement;
        vmodify(f: (data: any) => any): HTMLElement;
        vobj(data?: any): any;
        varr(tpl?: any, data?: any): any;
        vrender(data: any, tpl?: any): HTMLElement;
        vval(): any;
        vval(data: any): HTMLElement;
    }

    interface KeyboardEvent {
        combo(combo: string): boolean;
    }

    interface String {
        cut(length: number): string;
    }
}
