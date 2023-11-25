import "./app.ts";
import {Tuple} from "./lib/model/template.model";

export class TemplateCanvasComponent {

    private canvasId: string = "testCanvas";

    constructor() {
        console.log('Hello World!');
        const canvas = <HTMLCanvasElement>document.getElementById(this.canvasId);
        const ctx = canvas.getContext('2d');
        console.log(ctx);
    }

    initialize() {
        const tuple = new Tuple(1, 2, 3, 4);
        const tuple2 = new Tuple(1, 2, 3, 4);
        console.log(tuple.equals(tuple2));
    }

}

let templateCanvasComponent = new TemplateCanvasComponent();
templateCanvasComponent.initialize();
