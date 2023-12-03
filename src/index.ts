import { RayCasterBuilder, RayCasterArithmetic, Color, Light, RayCasterImager, Plane, Material, Sphere, World, WHITE, BLACK, Point, Camera, Vector} from "@rafjack/typescript-raytracer/src";

export class RaycasterCanvasComponent {

    size = 600;
    sectorSize = this.size < 100 ? Math.round((this.size / 100) * 10) : (this.size / 100) * 10;
    counterFrom_X = 0;
    counterTo_X = this.sectorSize;
    counterFrom_Y = 0;
    counterTo_Y = this.sectorSize;
    canvasId = 'raycasterCanvas';
    canvas = <HTMLCanvasElement>document.getElementById(this.canvasId);
    canvasImageData: ImageData | null;
    cancelRendering = false;

    rawImageData: Uint8ClampedArray | null;
    ctx: CanvasRenderingContext2D | null;

    constructor() {
        this.canvasImageData = null;
        this.rawImageData = null;
        this.ctx = null;
    }

    initializeCanvasAndSizes() {
        this.canvas = <HTMLCanvasElement>document.getElementById(this.canvasId);
        this.canvas.width = this.size;
        this.canvas.height = this.size;
        this.ctx = this.canvas.getContext('2d');
        if (!this.canvas || !this.ctx) {
            throw new Error(
                `There is no canvas with id ${this.canvasId} on this page.`
            );
        }
        this.canvasImageData = this.ctx.createImageData(this.size, this.size);
        this.rawImageData = this.canvasImageData.data;
        // initialize canvas with black color
        this.fillCanvasWithBlack();
        this.ctx.putImageData(this.canvasImageData, 0, 0);
        this.sectorSize =
            this.size < 100
                ? Math.round((this.size / 100) * 10)
                : (this.size / 100) * 10;


        let uid = RayCasterBuilder.uuid()
        const canvasParent = this.canvas.parentNode;
        window.history.pushState({}, uid, `?uid=${uid}`);
        const resizableContainer = canvasParent;
        var self = this;
        // bind the mouse down event to startResize function
        if (resizableContainer) {

            resizableContainer.addEventListener('mousedown', e => {
                startResizing(e);
            });

            // Function to start resizing
            function startResizing(e: Event) {
                e.preventDefault();

                // Initial mouse position
                const initialX = e.clientX;
                const initialY = e.clientY;

                // Initial dimensions of the resizable container
                // @ts-ignore
                const initialWidth = resizableContainer.offsetWidth;
                // @ts-ignore
                const initialHeight = resizableContainer.offsetHeight;

                // Aspect ratio of the resizable container
                const aspectRatio = initialWidth / initialHeight;

                // Function to handle mouse move
                function handleMouseMove(e: MouseEvent) {
                    const deltaX = e.clientX - initialX;
                    const deltaY = e.clientY - initialY;

                    // Calculate the new width and height while maintaining the aspect ratio
                    const newWidth = initialWidth + deltaX;
                    const newHeight = newWidth / aspectRatio;

                    // Apply the new dimensions to the resizable container
                    // @ts-ignore
                    resizableContainer.style.width = `${newWidth}px`;
                    // @ts-ignore
                    resizableContainer.style.height = `${newHeight}px`;
                }

                // Function to handle mouse up
                function handleMouseUp() {
                    // Remove event listeners on mouse up
                    window.removeEventListener('mousemove', handleMouseMove);
                    window.removeEventListener('mouseup', handleMouseUp);
                }

                // Add event listeners for mouse move and mouse up
                window.addEventListener('mousemove', handleMouseMove);
                window.addEventListener('mouseup', handleMouseUp);

                // Add event listener for mouse release
                window.addEventListener('mouseup', handleMouseRelease);

                // function to handle mouse release
                function handleMouseRelease(e: MouseEvent) {
                    e.preventDefault();
                    // Remove event listeners on mouse release
                    window.removeEventListener('mousemove', handleMouseMove);
                    window.removeEventListener('mouseup', handleMouseUp);
                    window.removeEventListener('mouseup', handleMouseRelease);
                    // call the resize canvas function
                    self.reset();
                }
            }
        }
    }

    reset() {

    }

    fillCanvasWithBlack() {
        if (this.ctx && this.rawImageData && this.canvasImageData) {
            RayCasterImager.fillWithBlack(this.rawImageData, this.size, this.size)
            this.ctx.putImageData(this.canvasImageData, 0, 0);
        }
    }

    draw(from_x: number, to_x: number, from_y: number, to_y: number) {


        const plane: Plane = RayCasterBuilder.createPlane();
        plane.setTransform(RayCasterBuilder.getTranslationMatrix(0, 0.01, 0));
        const floorMaterial: Material = plane.getMaterial();
        floorMaterial.setColor(new Color(1, 0.9, 0.9));
        floorMaterial.setSpecular(0);
        floorMaterial.setReflective(0.4);
        floorMaterial.pattern = RayCasterBuilder.createBlendedGradientAndRingPattern(new Color(1, 0, 0), new Color(0, 0, 1));
        plane.setMaterial(floorMaterial);

        const middleSphere: Sphere = RayCasterBuilder.createSphere();
        middleSphere.setTransform(RayCasterBuilder.getTranslationMatrix(-0.5, 1, 0.5));
        const middleSphereMaterial: Material = middleSphere.getMaterial();
        middleSphereMaterial.setDiffuse(0.0);
        middleSphereMaterial.setSpecular(1.0);
        middleSphereMaterial.setShininess(300);
        middleSphereMaterial.setReflective(4);
        middleSphereMaterial.setTransparency(0.9);
        middleSphereMaterial.setRefractiveIndex(100);
        //middleSphereMaterial.pattern = RayCasterBuilder.buildStripePattern(WHITE, BLACK);
        middleSphere.setMaterial(middleSphereMaterial);


        const rightSphere: Sphere = RayCasterBuilder.createSphere();
        rightSphere.setTransform(
            RayCasterArithmetic.multiplyMatrix(
                RayCasterBuilder.getTranslationMatrix(1.5, 0.5, -0.5),
                RayCasterBuilder.getScalingMatrix(0.5, 0.5, 0.5)
            )
        );
        const rightSphereMaterial: Material = rightSphere.getMaterial();
        const rightSpherePattern = RayCasterBuilder.createGradientPattern(new Color(1, 0, 0), new Color(1, 1, 0));
        rightSpherePattern.setTransform(RayCasterBuilder.getScalingMatrix(2, 2, 2));
        rightSphereMaterial.setDiffuse(0.7);
        rightSphereMaterial.setSpecular(0.3);
        rightSphereMaterial.setReflective(0.4);
        rightSphereMaterial.setReflective(0.4);
        rightSphereMaterial.setTransparency(0.7);
        rightSphereMaterial.pattern = rightSpherePattern;
        rightSphere.setMaterial(rightSphereMaterial);

        const leftSphere: Sphere = RayCasterBuilder.createSphere();
        leftSphere.setTransform(
            RayCasterArithmetic.multiplyMatrix(
                RayCasterBuilder.getTranslationMatrix(-1.5, 0.33, -0.75),
                RayCasterBuilder.getScalingMatrix(0.33, 0.33, 0.33)
            )
        );
        const leftSphereMaterial: Material = leftSphere.getMaterial();
        leftSphereMaterial.setDiffuse(0.7);
        leftSphereMaterial.setSpecular(0.3);
        leftSphereMaterial.setReflective(0.4);
        leftSphereMaterial.pattern = RayCasterBuilder.createNestedStripeAndGradientPattern(new Color(1, 1, 0), new Color(1, 0, 1));
        leftSphereMaterial.pattern.setTransform(RayCasterBuilder.getScalingMatrix(0.5, 0.5, 0.5));
        leftSphere.setMaterial(leftSphereMaterial);

        const group = RayCasterBuilder.createGroup();
        group.addChild(middleSphere);
        group.addChild(rightSphere);
        group.addChild(leftSphere);
        group.setTransform(RayCasterBuilder.getScalingMatrix(0.9, 0.9, 0.9));


        const world: World = RayCasterBuilder.createDefaultWorld();

        const lightSource: Light = RayCasterBuilder.createPointLight(new Point(-10, 10, -10), new Color(1, 1, 1));

        world.setLightSource(lightSource);
        world.setShapes([plane, group]);

        const camera: Camera = RayCasterBuilder.createCamera(this.size, this.size, Math.PI / 3);

        camera.setTranform(
            RayCasterArithmetic.viewTransform(
                new Point(0, 1.5, -5),
                new Point(0, 1, 0),
                new Vector(0, 1, 0)
            )
        );

        // WHEN
        if (this.rawImageData && this.ctx && this.canvasImageData) {
            RayCasterImager.renderOnRawImageDataSector(
                camera,
                world,
                this.rawImageData,
                from_x,
                to_x,
                from_y,
                to_y
            );
            this.ctx.putImageData(this.canvasImageData, 0, 0);
        }
    }

    callBack() {
        this.draw(
            this.counterFrom_X,
            this.counterTo_X,
            this.counterFrom_Y,
            this.counterTo_Y
        );
        const rowFinished = this.counterTo_X === this.size;
        const colFinished = this.counterTo_Y === this.size;
        this.counterFrom_X = this.counterTo_X;
        this.counterTo_X += this.sectorSize;
        if (!rowFinished) {
            if (!this.cancelRendering)
                window.requestAnimationFrame(this.callBack.bind(this));
            else {
                this.initializeCanvasAndSizes();
            }
        } else if (rowFinished && !colFinished) {
            this.counterFrom_X = 0;
            this.counterTo_X = this.sectorSize;
            this.counterFrom_Y = this.counterTo_Y;
            this.counterTo_Y += this.sectorSize;
            if (!this.cancelRendering) {
                window.requestAnimationFrame(this.callBack.bind(this));
            } else {
                this.initializeCanvasAndSizes();
            }
        }
    }


}

let rayCasterCanvasComponent = new RaycasterCanvasComponent();
rayCasterCanvasComponent.initializeCanvasAndSizes();
rayCasterCanvasComponent.callBack();