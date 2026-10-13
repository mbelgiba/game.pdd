// РЕАЛИСТИЧНЫЕ 3D-МОДЕЛИ. Игра пробует файлы по порядку; если ни один не найден — рисует простую модель.
// Свои файлы кладите в assets/models/ под этими именами. Если машина смотрит назад — поменяйте rot (0 или Math.PI).
const T='https://threejs.org/examples/models/gltf/';
const MODELS={
 car_mol:{files:['assets/models/mol.glb',T+'ferrari.glb'],rot:Math.PI},
 car_gold:{files:['assets/models/gold.glb',T+'ferrari.glb'],rot:Math.PI},
 car_granta:{files:['assets/models/granta.glb'],rot:Math.PI},
 car_kroha:{files:['assets/models/kroha.glb'],rot:Math.PI},
 car_brod:{files:['assets/models/brod.glb'],rot:Math.PI},
 car_patrol:{files:['assets/models/patrol.glb'],rot:Math.PI},
 human:{files:['assets/models/human.glb',T+'Soldier.glb'],rot:0}};
