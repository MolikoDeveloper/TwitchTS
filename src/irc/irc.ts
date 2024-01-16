import type { Options } from "../session";
import { IrcBase } from "./IrcBase";

export class IRC extends IrcBase{
    constructor(opts: Options){
        super(opts);
    }
}