import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import ThreeJSInputFields, { POSITIONS } from "../src"

var camera, scene, renderer;
var cameraOrtho, sceneOrtho;
var light;
var controls;

var inputManager;

var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;

function init()
{
    
    cameraOrtho = new THREE.OrthographicCamera( 0, canvasWidth, canvasHeight, 0, - 10, 10 );
    sceneOrtho = new THREE.Scene();

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 45, canvasWidth / canvasHeight, 0.1, 20000 );
    camera.name = 'camera';

    camera.position.set( 0, 150, 400 );
    camera.lookAt( scene.position );

    scene.add( camera );

    renderer = new THREE.WebGLRenderer({
        antialias		: true,	                // to get smoother output
        preserveDrawingBuffer	: true	        // to allow screenshot
    });

    renderer.setClearColor( 0x000000, 1 );

    renderer.autoClear = false; // To allow render overlay on top of 3D scene

    light = new THREE.AmbientLight( 0x404040 ); // soft white light
    light.name = "light";
    scene.add( light );

    renderer.setSize( canvasWidth, canvasHeight );

    controls = new OrbitControls( camera, renderer.domElement );

    document.body.appendChild( renderer.domElement );


    window.addEventListener( 'resize', onWindowResize, false );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'click', onDocumentMouseClick, false );



    //
    //
    //  CUSTOM
    //
    //

    var group = new THREE.Object3D();

    // FLOOR
    var textureLoader = new THREE.TextureLoader();
    var floorTexture = textureLoader.load( './img/checkerboard.jpg' );
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set( 10, 10 );
    var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
    var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -0.5;
    floor.rotation.x = Math.PI / 2;
    floor.name = "Checkerboard Floor";
    group.add(floor);

    // SKYBOX/FOG
    var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
    var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
    var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
    group.add(skyBox);

    // CUBE
    var cubeGeometry = new THREE.CubeGeometry( 100, 100, 100 );
    var cubeMaterial = new THREE.MeshNormalMaterial();
    var cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
    cube.position.set(0,50,0);
    cube.name = "Cube";
    group.add(cube);

    scene.add( group );

    inputManager = new ThreeJSInputFields( { camera: camera, canvasWidth: canvasWidth, canvasHeight: canvasHeight } );
    var orthographicElement = true;

    var firstTextInput = inputManager
            .create( 'text', 'first-text', orthographicElement )
            .setValue( 'First text' )
            .setFontSize( 40 )
            .setBorderSize( 2 )
            .setInputPosition( 0, 0, 0, POSITIONS.POSITION_TOP_LEFT );
    sceneOrtho.add( firstTextInput.getElement() );

    var thirdTextInput = inputManager
            .create( 'text', 'third-text' )
            .setValue( 'Third text' )
            .setFontSize( 20 )
            .setBorderSize( 2 )
            .setInputPosition( 50, 100, 0 );
    scene.add( thirdTextInput.getElement() );
}

function onWindowResize() {

    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;

    camera.aspect = canvasWidth / canvasHeight;
    camera.updateProjectionMatrix();

    cameraOrtho.right = canvasWidth;
    cameraOrtho.top = canvasHeight;
    cameraOrtho.updateProjectionMatrix();

    renderer.setSize( canvasWidth, canvasHeight );

}

function onDocumentMouseMove( event ) {
    inputManager.onDocumentMouseMove( event );
}

function onDocumentMouseClick( event ) {
    inputManager.onDocumentMouseClick( event );
}

function render() {
    requestAnimationFrame(render);

    inputManager.requestAnimationFrame();
    controls.update();
    renderer.clear();
    renderer.render(scene, camera);
    renderer.render( sceneOrtho, cameraOrtho );
}

init();
render();
