import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Sparkles,
  Music,
  Maximize2,
  Minimize2,
  RotateCw,
  Video,
  Flame,
  Users
} from 'lucide-react';

const BTS_MEMBERS = [
  {
    id: 'RM',
    name: 'RM',
    role: 'Leader & Main Rapper',
    choreoName: 'Intro: Persona & Dionysus Command Groove',
    suitColor: '#18181B',
    lapelColor: '#09090B',
    shirtColor: '#F8FAFC',
    tieColor: '#991B1B',
    hairColor: '#D4D4D8', // Platinado Silver
    hairStyle: 'sweptBack',
    eyeColor: '#271C19',
    micColor: '#3B82F6',
    heightScale: 1.06,
    hasDimples: true,
    pos: [-5.1, 0, -0.5],
  },
  {
    id: 'Jin',
    name: 'Jin',
    role: 'Vocalist & Worldwide Visual',
    choreoName: 'Moon & Epiphany Flying Kiss Performance',
    suitColor: '#0F172A',
    lapelColor: '#1E293B',
    shirtColor: '#FFFFFF',
    tieColor: '#1E293B',
    hairColor: '#1C1917', // Preto natural elegante
    hairStyle: 'foreheadComma',
    eyeColor: '#1F1614',
    micColor: '#EC4899',
    heightScale: 1.04,
    hasDimples: false,
    pos: [-3.4, 0, 0.45],
  },
  {
    id: 'SUGA',
    name: 'SUGA',
    role: 'Lead Rapper & Producer',
    choreoName: 'Haegeum & Mic Drop Swag Flow',
    suitColor: '#1E293B',
    lapelColor: '#090D16',
    shirtColor: '#0F172A',
    tieColor: '#DC2626',
    hairColor: '#09090B', // Wavy Black longo
    hairStyle: 'wavyLong',
    eyeColor: '#1C1614',
    micColor: '#27272A',
    heightScale: 0.98,
    hasDimples: false,
    pos: [-1.7, 0, -0.5],
  },
  {
    id: 'jhope',
    name: 'j-hope',
    role: 'Main Dancer & Rapper',
    choreoName: 'ON Dance Break & Popping Isolation',
    suitColor: '#27121B',
    lapelColor: '#09090B',
    shirtColor: '#FFFFFF',
    tieColor: '#7F1D1D',
    hairColor: '#3E2723', // Castanho escuro estilizado
    hairStyle: 'twoBlock',
    eyeColor: '#261815',
    micColor: '#EF4444',
    heightScale: 1.01,
    hasDimples: false,
    pos: [0, 0, -0.9],
  },
  {
    id: 'Jimin',
    name: 'Jimin',
    role: 'Main Dancer & Lead Vocalist',
    choreoName: 'Black Swan Contemporary Spin & Body Roll',
    suitColor: '#334155',
    lapelColor: '#0F172A',
    shirtColor: '#FFFFFF',
    tieColor: '#1E293B',
    hairColor: '#EAB308', // Loiro Dourado Sedoso
    hairStyle: 'silkyParted',
    eyeColor: '#291D18',
    micColor: '#F59E0B',
    heightScale: 0.98,
    hasDimples: false,
    pos: [1.7, 0, -0.5],
  },
  {
    id: 'V',
    name: 'V',
    role: 'Vocalist, Dancer & Visual',
    choreoName: 'Singularity Charisma Gaze & Jazz Groove',
    suitColor: '#1F1624',
    lapelColor: '#09090B',
    shirtColor: '#FFFBEB',
    tieColor: '#881337',
    hairColor: '#18181B', // Mullet / Perm ondulado
    hairStyle: 'wavyPerm',
    eyeColor: '#1B1412',
    micColor: '#10B981',
    heightScale: 1.03,
    hasDimples: false,
    pos: [3.4, 0, 0.45],
  },
  {
    id: 'JungKook',
    name: 'Jung Kook',
    role: 'Main Vocalist, Center & Golden Maknae',
    choreoName: 'Standing Next to You Center Footwork & Glide',
    suitColor: '#090D16',
    lapelColor: '#000000',
    shirtColor: '#FFFFFF',
    tieColor: '#111827',
    hairColor: '#141417', // Undercut ondulado moderno
    hairStyle: 'modernWave',
    eyeColor: '#1A1311',
    micColor: '#9333EA',
    heightScale: 1.03,
    hasDimples: false,
    pos: [5.1, 0, 0.45],
  },
];

export default function BtsStage3D() {
  const wrapperRef = useRef(null);
  const mountRef = useRef(null);

  const [focusedMember, setFocusedMember] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPlayer, setShowPlayer] = useState(true);
  const [cameraMode, setCameraMode] = useState('director'); // 'director' | 'free'

  const focusedMemberRef = useRef(null);
  const cameraModeRef = useRef('director');

  useEffect(() => {
    focusedMemberRef.current = focusedMember;
  }, [focusedMember]);

  useEffect(() => {
    cameraModeRef.current = cameraMode;
  }, [cameraMode]);

  const toggleFullscreen = async () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      if (wrapperRef.current && wrapperRef.current.requestFullscreen) {
        try {
          await wrapperRef.current.requestFullscreen();
        } catch {}
      }
    } else {
      setIsFullscreen(false);
      if (document.fullscreenElement && document.exitFullscreen) {
        try {
          await document.exitFullscreen();
        } catch {}
      }
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) setIsFullscreen(false);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. CENA E RENDERIZADOR HIGH-DEFINITION
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#05020A');
    scene.fog = new THREE.FogExp2('#05020A', 0.018);

    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      0.1,
      150
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. ILUMINAÇÃO CINEMATOGRÁFICA DE SHOW (Key, Fill, Rim Light + Spotlights)
    const ambientLight = new THREE.AmbientLight('#F3E8FF', 1.25);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight('#FFFDF9', 2.2);
    keyLight.position.set(4, 14, 12);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    scene.add(keyLight);

    // Rim Light traseira para destacar a silhueta e o brilho dos cabelos
    const backRimLight = new THREE.DirectionalLight('#C084FC', 1.8);
    backRimLight.position.set(0, 8, -10);
    scene.add(backRimLight);

    const redStageLight = new THREE.PointLight('#EF4444', 5.0, 28);
    redStageLight.position.set(-6, 5, 3);
    scene.add(redStageLight);

    const purpleStageLight = new THREE.PointLight('#A855F7', 5.0, 28);
    purpleStageLight.position.set(6, 5, 3);
    scene.add(purpleStageLight);

    // 3. PALCO DE ARENA ESPELHADO + TELÃO CURVO "FYA"
    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    const stageFloor = new THREE.Mesh(
      new THREE.CylinderGeometry(9.2, 9.8, 0.8, 64),
      new THREE.MeshPhysicalMaterial({
        color: '#090D16',
        roughness: 0.12,
        metalness: 0.75,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
      })
    );
    stageFloor.position.y = -0.4;
    stageFloor.receiveShadow = true;
    stageGroup.add(stageFloor);

    // Anéis de LED embutidos no piso
    const outerLedRing = new THREE.Mesh(
      new THREE.TorusGeometry(8.9, 0.07, 16, 100),
      new THREE.MeshStandardMaterial({
        color: '#EF4444',
        emissive: '#EF4444',
        emissiveIntensity: 1.8,
      })
    );
    outerLedRing.rotation.x = Math.PI / 2;
    outerLedRing.position.y = 0.01;
    stageGroup.add(outerLedRing);

    const innerLedRing = new THREE.Mesh(
      new THREE.TorusGeometry(6.8, 0.05, 16, 100),
      new THREE.MeshStandardMaterial({
        color: '#A855F7',
        emissive: '#9333EA',
        emissiveIntensity: 1.6,
      })
    );
    innerLedRing.rotation.x = Math.PI / 2;
    innerLedRing.position.y = 0.015;
    stageGroup.add(innerLedRing);

    // Telão Traseiro de Alta Definição com os 3 Símbolos Vermelhos de "FYA"
    const backdropMesh = new THREE.Mesh(
      new THREE.BoxGeometry(15.5, 6.2, 0.35),
      new THREE.MeshStandardMaterial({ color: '#05070E', roughness: 0.3, metalness: 0.5 })
    );
    backdropMesh.position.set(0, 3.1, -4.6);
    stageGroup.add(backdropMesh);

    const fyaCircles = [];
    [-2.7, 0, 2.7].forEach((cx, idx) => {
      const symbolGroup = new THREE.Group();
      symbolGroup.position.set(cx, 3.2, -4.38);

      const redDisc = new THREE.Mesh(
        new THREE.CircleGeometry(1.05, 64),
        new THREE.MeshStandardMaterial({
          color: '#DC2626',
          emissive: '#EF4444',
          emissiveIntensity: 1.3,
        })
      );
      symbolGroup.add(redDisc);

      if (idx === 0) {
        const centerCut = new THREE.Mesh(
          new THREE.CircleGeometry(0.36, 48),
          new THREE.MeshBasicMaterial({ color: '#3B0707' })
        );
        centerCut.position.z = 0.02;
        symbolGroup.add(centerCut);
      } else {
        [-0.36, 0, 0.36].forEach((by) => {
          const stripe = new THREE.Mesh(
            new THREE.PlaneGeometry(1.65, 0.17),
            new THREE.MeshBasicMaterial({ color: '#3B0707' })
          );
          stripe.position.set(0, by, 0.02);
          symbolGroup.add(stripe);
        });
      }
      stageGroup.add(symbolGroup);
      fyaCircles.push(symbolGroup);
    });

    // Canhões de Laser Dinâmicos
    const laserBeams = [];
    const beamGeo = new THREE.ConeGeometry(0.7, 13, 24, 1, true);
    [-6.0, -3.0, 0, 3.0, 6.0].forEach((lx, i) => {
      const beamMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? '#A855F7' : '#EF4444',
        transparent: true,
        opacity: 0.14,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set(lx, 5.8, -3.8);
      scene.add(beam);
      laserBeams.push({ mesh: beam, phase: i * 0.8 });
    });

    // 4. GERADOR DE CABELOS DETALHADOS EM MECHAS (HIGH-POLY STRAND SYSTEM)
    const createDetailedIdolHair = (style, colorHex) => {
      const hairGroup = new THREE.Group();
      const hairMat = new THREE.MeshPhysicalMaterial({
        color: colorHex,
        roughness: 0.32,
        metalness: 0.15,
        clearcoat: 0.65,
        clearcoatRoughness: 0.25,
      });

      // Base craniana densa e suave
      const scalp = new THREE.Mesh(
        new THREE.SphereGeometry(0.242, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.62),
        hairMat
      );
      scalp.position.y = 0.02;
      scalp.scale.set(1.02, 1.05, 1.04);
      hairGroup.add(scalp);

      const dynamicStrands = [];

      // Camada de 26 mechas esculpidas ao redor da cabeça + franja coreana estilizada
      const strandCount = 26;
      for (let i = 0; i < strandCount; i++) {
        const angle = (i / strandCount) * Math.PI * 2;
        const isFront = Math.cos(angle) > 0.25;
        const isBack = Math.cos(angle) < -0.3;

        const strandPivot = new THREE.Group();
        const radiusX = 0.215;
        const radiusZ = 0.225;
        strandPivot.position.set(
          Math.sin(angle) * radiusX,
          0.11 + Math.sin(i * 1.7) * 0.02,
          Math.cos(angle) * radiusZ
        );

        let length = 0.22;
        let width = 0.058;
        if (style === 'wavyLong' && isBack) length = 0.34; // SUGA cabelo longo na nuca
        if (style === 'wavyPerm') width = 0.068; // V volume ondulado
        if (style === 'sweptBack' && isFront) length = 0.18; // RM testa aparente

        const strandGeo = new THREE.CapsuleGeometry(width, length, 8, 16);
        const strandMesh = new THREE.Mesh(strandGeo, hairMat);
        strandMesh.scale.set(1, 1, 0.42);
        strandMesh.position.y = -length * 0.42;

        // Curvatura natural das mechas dependendo do penteado do membro
        strandPivot.rotation.y = angle;
        if (isFront) {
          if (style === 'sweptBack') {
            strandPivot.rotation.x = -0.55;
            strandPivot.rotation.z = (Math.sin(angle) > 0 ? 1 : -1) * 0.35;
          } else if (style === 'foreheadComma' || style === 'silkyParted') {
            // Franja repartida em C ("Comma Hair" típico de Jin e Jimin)
            const side = Math.sin(angle) >= 0 ? 1 : -1;
            strandPivot.rotation.x = 0.28;
            strandPivot.rotation.z = side * 0.42;
          } else {
            strandPivot.rotation.x = 0.32;
            strandPivot.rotation.z = Math.sin(i) * 0.22;
          }
        } else {
          strandPivot.rotation.x = 0.22;
        }

        strandPivot.add(strandMesh);
        hairGroup.add(strandPivot);

        dynamicStrands.push({
          pivot: strandPivot,
          baseRotX: strandPivot.rotation.x,
          baseRotZ: strandPivot.rotation.z,
          phase: i * 0.45,
        });
      }

      return { hairGroup, dynamicStrands };
    };

    // 5. CONSTRUÇÃO DOS 7 INTEGRANTES HIGH-POLY COM EXPRESSÕES FACIAIS E 16 ARTICULAÇÕES
    const dancerRigs = [];
    const clickableMeshes = [];

    const skinMat = new THREE.MeshPhysicalMaterial({
      color: '#FFE3D3',
      roughness: 0.38,
      metalness: 0.02,
      clearcoat: 0.25,
      clearcoatRoughness: 0.4,
    });
    const blushMat = new THREE.MeshBasicMaterial({
      color: '#F43F5E',
      transparent: true,
      opacity: 0.18,
    });
    const scleraMat = new THREE.MeshBasicMaterial({ color: '#FFFFFF' });
    const pupilMat = new THREE.MeshBasicMaterial({ color: '#09090B' });
    const lipMat = new THREE.MeshStandardMaterial({ color: '#E15B64', roughness: 0.35 });
    const teethMat = new THREE.MeshBasicMaterial({ color: '#FFFFFF' });
    const shoeMat = new THREE.MeshPhysicalMaterial({
      color: '#09090B',
      roughness: 0.15,
      metalness: 0.4,
      clearcoat: 0.9,
    });

    BTS_MEMBERS.forEach((m, index) => {
      const root = new THREE.Group();
      root.position.set(m.pos[0], m.pos[1], m.pos[2]);
      root.scale.setScalar(m.heightScale);

      // Spotlight no chão com a cor do microfone do membro
      const floorSpot = new THREE.Mesh(
        new THREE.CircleGeometry(0.82, 32),
        new THREE.MeshBasicMaterial({
          color: m.micColor,
          transparent: true,
          opacity: 0.28,
          side: THREE.DoubleSide,
        })
      );
      floorSpot.rotation.x = -Math.PI / 2;
      floorSpot.position.y = 0.02;
      root.add(floorSpot);

      const suitMat = new THREE.MeshPhysicalMaterial({
        color: m.suitColor,
        roughness: 0.42,
        metalness: 0.15,
        clearcoat: 0.2,
      });
      const lapelMat = new THREE.MeshPhysicalMaterial({
        color: m.lapelColor,
        roughness: 0.25,
        metalness: 0.3,
        clearcoat: 0.5,
      });
      const shirtMat = new THREE.MeshStandardMaterial({ color: m.shirtColor, roughness: 0.35 });
      const tieMat = new THREE.MeshStandardMaterial({ color: m.tieColor, roughness: 0.3 });

      // Pélvis / Centro de Gravidade
      const pelvis = new THREE.Group();
      pelvis.position.y = 0.96;
      root.add(pelvis);

      const hipsMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.14, 16, 24), suitMat);
      hipsMesh.scale.set(1.25, 0.8, 0.85);
      pelvis.add(hipsMesh);

      // Coluna & Tórax Articulado
      const spine = new THREE.Group();
      spine.position.y = 0.1;
      pelvis.add(spine);

      const chestMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.42, 16, 32), suitMat);
      chestMesh.position.y = 0.32;
      chestMesh.scale.set(1.28, 1.0, 0.78);
      chestMesh.castShadow = true;
      chestMesh.userData = { memberId: m.id };
      clickableMeshes.push(chestMesh);
      spine.add(chestMesh);

      // Camisa Social, Lapelas de Cetim e Gravata
      const shirtFront = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.08, 0.42, 16), shirtMat);
      shirtFront.position.set(0, 0.38, 0.11);
      shirtFront.scale.set(1, 1, 0.6);
      spine.add(shirtFront);

      const tieMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.028, 0.32, 8, 16), tieMat);
      tieMesh.position.set(0, 0.34, 0.165);
      tieMesh.scale.set(1, 1, 0.3);
      spine.add(tieMesh);

      [-1, 1].forEach((side) => {
        const lapel = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.42, 0.02), lapelMat);
        lapel.position.set(side * 0.08, 0.36, 0.165);
        lapel.rotation.z = side * -0.18;
        spine.add(lapel);
      });

      // Pescoço e Cabeça Expressiva High-Poly
      const neck = new THREE.Group();
      neck.position.y = 0.68;
      spine.add(neck);

      const neckMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.085, 0.18, 24), skinMat);
      neckMesh.position.y = 0.06;
      neck.add(neckMesh);

      const headGroup = new THREE.Group();
      headGroup.position.y = 0.24;
      neck.add(headGroup);

      // Rosto esculpido com mandíbula suave em V (V-line idol jaw)
      const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.23, 32, 32), skinMat);
      headMesh.scale.set(0.92, 1.08, 0.95);
      headMesh.castShadow = true;
      headMesh.userData = { memberId: m.id };
      clickableMeshes.push(headMesh);
      headGroup.add(headMesh);

      // Orelhas + Brincos Prateados de Idol
      const earringMat = new THREE.MeshStandardMaterial({ color: '#E2E8F0', metalness: 0.9, roughness: 0.1 });
      [-1, 1].forEach((side) => {
        const ear = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 16), skinMat);
        ear.scale.set(0.45, 1.15, 0.7);
        ear.position.set(side * 0.21, -0.01, 0);
        headGroup.add(ear);

        const earring = new THREE.Mesh(new THREE.TorusGeometry(0.022, 0.004, 8, 16), earringMat);
        earring.position.set(side * 0.215, -0.065, 0.01);
        headGroup.add(earring);
      });

      // Nariz Delicado 3D
      const nose = new THREE.Mesh(new THREE.ConeGeometry(0.028, 0.09, 16), skinMat);
      nose.position.set(0, -0.01, 0.22);
      nose.rotation.x = 0.18;
      headGroup.add(nose);

      // Bochechas Coradas Suaves + Covinhas (RM)
      [-1, 1].forEach((side) => {
        const blush = new THREE.Mesh(new THREE.CircleGeometry(0.038, 16), blushMat);
        blush.position.set(side * 0.115, -0.04, 0.195);
        blush.rotation.y = side * 0.4;
        headGroup.add(blush);

        if (m.hasDimples) {
          const dimple = new THREE.Mesh(
            new THREE.SphereGeometry(0.01, 8, 8),
            new THREE.MeshBasicMaterial({ color: '#D99B82' })
          );
          dimple.position.set(side * 0.085, -0.085, 0.205);
          headGroup.add(dimple);
        }
      });

      // Olhos Expressivos Completos (Esclera, Íris, Pupila, Brilho Catchlight, Pálpebras e Sobrancelhas)
      const irisMat = new THREE.MeshBasicMaterial({ color: m.eyeColor });
      const eyelids = [];
      const eyebrows = [];

      [-1, 1].forEach((side) => {
        const eyeSocket = new THREE.Group();
        eyeSocket.position.set(side * 0.082, 0.025, 0.198);
        eyeSocket.rotation.y = side * 0.18;
        headGroup.add(eyeSocket);

        const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.034, 16, 16), scleraMat);
        sclera.scale.set(1.25, 0.82, 0.5);
        eyeSocket.add(sclera);

        const iris = new THREE.Mesh(new THREE.CircleGeometry(0.021, 24), irisMat);
        iris.position.z = 0.018;
        eyeSocket.add(iris);

        const pupil = new THREE.Mesh(new THREE.CircleGeometry(0.011, 16), pupilMat);
        pupil.position.z = 0.019;
        eyeSocket.add(pupil);

        // Brilho Vivo no Olhar (Anime/Idol Catchlight)
        const catchlight = new THREE.Mesh(new THREE.CircleGeometry(0.0055, 12), scleraMat);
        catchlight.position.set(0.007, 0.007, 0.02);
        eyeSocket.add(catchlight);

        // Delineado superior (Eyeliner)
        const lashLine = new THREE.Mesh(
          new THREE.BoxGeometry(0.068, 0.008, 0.01),
          pupilMat
        );
        lashLine.position.set(0, 0.022, 0.016);
        lashLine.rotation.z = side * -0.05;
        eyeSocket.add(lashLine);

        // Pálpebra Móvel para Piscar e Piscadinha (Wink)
        const eyelid = new THREE.Mesh(
          new THREE.SphereGeometry(0.036, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55),
          skinMat
        );
        eyelid.scale.set(1.26, 0.1, 0.55);
        eyelid.position.y = 0.022;
        eyeSocket.add(eyelid);
        eyelids.push(eyelid);

        // Sobrancelha Articulada
        const brow = new THREE.Mesh(
          new THREE.CapsuleGeometry(0.01, 0.055, 8, 12),
          new THREE.MeshBasicMaterial({ color: m.hairColor === '#EAB308' ? '#713F12' : '#18181B' })
        );
        brow.rotation.z = Math.PI / 2 + side * -0.08;
        brow.position.set(0, 0.052, 0.018);
        eyeSocket.add(brow);
        eyebrows.push({ mesh: brow, side });
      });

      // Boca Articulada (Sorriso + Canto sincronizado)
      const mouthGroup = new THREE.Group();
      mouthGroup.position.set(0, -0.092, 0.206);
      headGroup.add(mouthGroup);

      const lipsMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.016, 0.042, 12, 16), lipMat);
      lipsMesh.rotation.z = Math.PI / 2;
      lipsMesh.scale.set(1, 1, 0.5);
      mouthGroup.add(lipsMesh);

      const teethMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.038, 0.012), teethMat);
      teethMesh.position.z = 0.009;
      mouthGroup.add(teethMesh);

      // Cabelo High-Poly com Mechas Físicas
      const { hairGroup, dynamicStrands } = createDetailedIdolHair(m.hairStyle, m.hairColor);
      headGroup.add(hairGroup);

      // BRAÇOS COM OMBRO, COTOVELO E MÃO ARTICULADOS
      const createArticulatedArm = (isRight) => {
        const side = isRight ? 1 : -1;
        const shoulder = new THREE.Group();
        shoulder.position.set(side * 0.34, 0.54, 0);
        spine.add(shoulder);

        const upperArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.068, 0.26, 12, 24), suitMat);
        upperArm.position.y = -0.15;
        upperArm.castShadow = true;
        shoulder.add(upperArm);

        const elbow = new THREE.Group();
        elbow.position.y = -0.31;
        shoulder.add(elbow);

        const forearm = new THREE.Mesh(new THREE.CapsuleGeometry(0.058, 0.25, 12, 24), suitMat);
        forearm.position.y = -0.14;
        forearm.castShadow = true;
        elbow.add(forearm);

        const wrist = new THREE.Group();
        wrist.position.y = -0.3;
        elbow.add(wrist);

        const hand = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 16), skinMat);
        hand.scale.set(0.85, 1.2, 0.65);
        wrist.add(hand);

        if (isRight) {
          // Microfone Customizado Brilhante na mão direita
          const micBody = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.02, 0.18, 12, 16),
            new THREE.MeshStandardMaterial({
              color: m.micColor,
              emissive: m.micColor,
              emissiveIntensity: 0.75,
              metalness: 0.6,
              roughness: 0.2,
            })
          );
          micBody.position.set(0, -0.02, 0.09);
          micBody.rotation.x = Math.PI / 2.2;
          wrist.add(micBody);
        }

        return { shoulder, elbow, wrist };
      };

      const leftArm = createArticulatedArm(false);
      const rightArm = createArticulatedArm(true);

      // PERNAS COM QUADRIL, JOELHO E TORNOZELO ARTICULADOS
      const createArticulatedLeg = (isRight) => {
        const side = isRight ? 1 : -1;
        const hip = new THREE.Group();
        hip.position.set(side * 0.14, -0.04, 0);
        pelvis.add(hip);

        const thigh = new THREE.Mesh(new THREE.CapsuleGeometry(0.092, 0.34, 16, 24), suitMat);
        thigh.position.y = -0.21;
        thigh.castShadow = true;
        hip.add(thigh);

        const knee = new THREE.Group();
        knee.position.y = -0.42;
        hip.add(knee);

        const shin = new THREE.Mesh(new THREE.CapsuleGeometry(0.076, 0.34, 16, 24), suitMat);
        shin.position.y = -0.21;
        shin.castShadow = true;
        knee.add(shin);

        const ankle = new THREE.Group();
        ankle.position.y = -0.44;
        knee.add(ankle);

        const shoe = new THREE.Mesh(new THREE.CapsuleGeometry(0.068, 0.16, 12, 20), shoeMat);
        shoe.rotation.x = Math.PI / 2;
        shoe.position.set(0, -0.03, 0.06);
        shoe.scale.set(1.05, 1.0, 0.75);
        ankle.add(shoe);

        return { hip, knee, ankle };
      };

      const leftLeg = createArticulatedLeg(false);
      const rightLeg = createArticulatedLeg(true);

      scene.add(root);

      dancerRigs.push({
        id: m.id,
        member: m,
        index,
        root,
        pelvis,
        spine,
        neck,
        headGroup,
        eyelids,
        eyebrows,
        mouthGroup,
        dynamicStrands,
        leftArm,
        rightArm,
        leftLeg,
        rightLeg,
        floorSpot,
      });
    });

    // 6. MAR DE ARMY BOMBS NA ARENA
    const armyBombCount = 240;
    const bombPos = new Float32Array(armyBombCount * 3);
    for (let i = 0; i < armyBombCount; i++) {
      bombPos[i * 3] = (Math.random() - 0.5) * 32;
      bombPos[i * 3 + 1] = 0.3 + Math.random() * 11;
      bombPos[i * 3 + 2] = (Math.random() - 0.5) * 26;
    }
    const bombGeo = new THREE.BufferGeometry();
    bombGeo.setAttribute('position', new THREE.BufferAttribute(bombPos, 3));
    const bombMat = new THREE.PointsMaterial({
      color: '#E9D5FF',
      size: 0.22,
      transparent: true,
      opacity: 0.85,
    });
    const armyBombs = new THREE.Points(bombGeo, bombMat);
    scene.add(armyBombs);

    // 7. CONTROLES DE CÂMERA E CLIQUE FANCAM
    let isDragging = false;
    let prevPos = { x: 0, y: 0 };
    let pointerDownPos = { x: 0, y: 0 };
    let spherical = { theta: 0, phi: 1.32, radius: 12.2 };

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const onPointerDown = (e) => {
      isDragging = true;
      prevPos = { x: e.clientX, y: e.clientY };
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e) => {
      if (isDragging) {
        setCameraMode('free');
        const dx = e.clientX - prevPos.x;
        const dy = e.clientY - prevPos.y;
        spherical.theta -= dx * 0.008;
        spherical.phi = Math.max(0.7, Math.min(1.5, spherical.phi - dy * 0.006));
        prevPos = { x: e.clientX, y: e.clientY };
      }
    };

    const onPointerUp = (e) => {
      isDragging = false;
      const moveDist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (moveDist < 8) {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(clickableMeshes);
        if (intersects.length > 0) {
          const mId = intersects[0].object.userData.memberId;
          if (mId) {
            const found = BTS_MEMBERS.find((item) => item.id === mId);
            setFocusedMember(found || null);
          }
        }
      }
    };

    const onWheel = (e) => {
      e.preventDefault();
      spherical.radius = Math.max(4.0, Math.min(20, spherical.radius + e.deltaY * 0.01));
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    domElem.addEventListener('wheel', onWheel, { passive: false });

    // 8. MOTOR BIOMECÂNICO DE DANÇA, FÍSICA DE CABELO E EXPRESSÕES FACIAIS
    let animFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const beat = t * 6.6; // Batida principal de FYA

      // Controle de Câmera (Fancam Close-up no Rosto/Corpo ou Câmera Diretor Dinâmica)
      const activeFocus = focusedMemberRef.current;
      if (activeFocus) {
        const tx = activeFocus.pos[0];
        const tz = activeFocus.pos[2];
        const swayX = Math.sin(t * 0.8) * 0.35;
        camera.position.lerp(new THREE.Vector3(tx + swayX, 1.75, tz + 3.15), 0.08);
        camera.lookAt(tx, 1.52, tz);
      } else if (cameraModeRef.current === 'director') {
        const panX = Math.sin(t * 0.35) * 3.8;
        const panZ = 11.2 + Math.cos(t * 0.5) * 1.8;
        const panY = 2.0 + Math.sin(t * 0.4) * 0.45;
        camera.position.lerp(new THREE.Vector3(panX, panY, panZ), 0.05);
        camera.lookAt(panX * 0.25, 1.45, 0);
      } else {
        const cx = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
        const cy = spherical.radius * Math.cos(spherical.phi);
        const cz = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
        camera.position.lerp(new THREE.Vector3(cx, cy, cz), 0.1);
        camera.lookAt(0, 1.4, 0);
      }

      dancerRigs.forEach((rig) => {
        const {
          index,
          pelvis,
          spine,
          neck,
          headGroup,
          eyelids,
          eyebrows,
          mouthGroup,
          dynamicStrands,
          leftArm,
          rightArm,
          leftLeg,
          rightLeg,
          floorSpot,
        } = rig;

        floorSpot.scale.setScalar(1 + Math.sin(beat + index) * 0.12);

        // --- EXPRESSÕES FACIAIS VIVAS ---
        // Piscar natural a cada poucos segundos + Piscadinha (Wink) no Jin e V
        const blinkCycle = (t * 0.9 + index * 1.3) % 4.5;
        const isBlinking = blinkCycle > 4.32;
        const isWinking = (index === 1 || index === 5) && Math.sin(beat * 0.25) > 0.85;

        eyelids[0].scale.y = isBlinking ? 1.05 : 0.1;
        eyelids[1].scale.y = isBlinking || isWinking ? 1.05 : 0.1;

        // Sobrancelhas dinâmicas (Carisma / Intensidade)
        const browLift = Math.sin(beat * 0.5 + index) * 0.008;
        eyebrows[0].mesh.position.y = 0.052 + browLift;
        eyebrows[1].mesh.position.y = 0.052 + (isWinking ? 0.012 : browLift);
        eyebrows[0].mesh.rotation.z = Math.PI / 2 - 0.08 + Math.cos(beat * 0.5) * 0.06;
        eyebrows[1].mesh.rotation.z = Math.PI / 2 + 0.08 - Math.cos(beat * 0.5) * 0.06;

        // Canto e Sorriso Sincronizado com o Beat
        const singOpen = 0.65 + Math.abs(Math.sin(beat * 1.5 + index * 0.7)) * 0.95;
        mouthGroup.scale.set(1 + Math.sin(beat * 0.5) * 0.12, singOpen, 1);

        // --- AS 7 COREOGRAFIAS ICÔNICAS DO BTS COM 16 ARTICULAÇÕES ---
        switch (index) {
          case 0: {
            // 1. RM — "Intro: Persona / Dionysus" (Groove de Rap Pesado, Mão no Peito e Comando)
            const bounce = Math.abs(Math.sin(beat * 0.5));
            pelvis.position.y = 0.94 - bounce * 0.08;
            pelvis.position.x = Math.sin(beat * 0.25) * 0.12;
            spine.rotation.y = Math.sin(beat * 0.5) * 0.28;
            spine.rotation.x = 0.08 + bounce * 0.08;
            headGroup.rotation.x = Math.sin(beat) * 0.16;
            headGroup.rotation.y = -spine.rotation.y * 0.5;

            // Braço direito com microfone próximo à boca
            rightArm.shoulder.rotation.set(-1.15 + Math.sin(beat * 0.5) * 0.15, -0.25, -0.2);
            rightArm.elbow.rotation.x = -1.25 + Math.cos(beat) * 0.2;

            // Braço esquerdo gesticulando no flow do rap
            leftArm.shoulder.rotation.set(-0.85 + Math.sin(beat) * 0.45, 0.2, 0.35 + Math.cos(beat * 0.5) * 0.25);
            leftArm.elbow.rotation.x = -0.9 + Math.sin(beat) * 0.4;

            // Joelhos flexionando no groove
            leftLeg.hip.rotation.x = -0.22 - bounce * 0.2;
            leftLeg.knee.rotation.x = 0.42 + bounce * 0.35;
            rightLeg.hip.rotation.x = -0.15 + Math.cos(beat * 0.5) * 0.2;
            rightLeg.knee.rotation.x = 0.3 + Math.abs(Math.cos(beat * 0.5)) * 0.3;
            break;
          }

          case 1: {
            // 2. Jin — "Moon / The Astronaut" (Giro Elegante & Worldwide Handsome Flying Kiss)
            const kissPhase = Math.sin(beat * 0.25);
            pelvis.position.y = 0.95 - Math.abs(Math.cos(beat * 0.5)) * 0.06;
            pelvis.rotation.y = Math.sin(beat * 0.25) * 0.45;
            spine.rotation.z = Math.sin(beat * 0.5) * 0.1;
            headGroup.rotation.y = Math.cos(beat * 0.5) * 0.22;
            headGroup.rotation.z = kissPhase > 0.5 ? 0.14 : 0;

            // Mão esquerda faz o gesto de mandar beijo (Flying Kiss) e depois abre
            if (kissPhase > 0.3) {
              const extend = (kissPhase - 0.3) / 0.7;
              leftArm.shoulder.rotation.set(-1.35, 0.35 - extend * 0.6, 0.2 + extend * 0.5);
              leftArm.elbow.rotation.x = -1.55 + extend * 1.1;
            } else {
              leftArm.shoulder.rotation.set(-0.5 + Math.sin(beat * 0.5) * 0.3, 0, 0.35);
              leftArm.elbow.rotation.x = -0.7;
            }

            rightArm.shoulder.rotation.set(-1.2, -0.3, -0.2);
            rightArm.elbow.rotation.x = -1.3 + Math.sin(beat * 0.5) * 0.15;

            leftLeg.hip.rotation.z = 0.08 + Math.max(0, Math.sin(beat * 0.5) * 0.18);
            leftLeg.knee.rotation.x = 0.25 + Math.abs(Math.sin(beat * 0.5)) * 0.2;
            rightLeg.hip.rotation.z = -0.08 + Math.min(0, Math.sin(beat * 0.5) * 0.18);
            rightLeg.knee.rotation.x = 0.25 + Math.abs(Math.cos(beat * 0.5)) * 0.2;
            break;
          }

          case 2: {
            // 3. SUGA — "Haegeum / Daechwita" (Hip-Hop Bounce, Ombros Soltos & Mic Drop Gesture)
            const swagBounce = Math.abs(Math.sin(beat));
            pelvis.position.y = 0.92 - swagBounce * 0.1;
            pelvis.position.x = Math.sin(beat * 0.5) * 0.18;
            spine.rotation.x = 0.14 + swagBounce * 0.08;
            spine.rotation.z = Math.cos(beat * 0.5) * 0.16;
            headGroup.rotation.x = 0.08 + Math.sin(beat) * 0.18;
            headGroup.rotation.z = -spine.rotation.z * 0.8;

            // Jogo de ombros alternado (Shoulder Shrug)
            leftArm.shoulder.position.y = 0.54 + Math.sin(beat) * 0.035;
            rightArm.shoulder.position.y = 0.54 - Math.sin(beat) * 0.035;

            rightArm.shoulder.rotation.set(-1.05 + Math.cos(beat * 0.5) * 0.3, -0.2, -0.25);
            rightArm.elbow.rotation.x = -1.1 + Math.sin(beat) * 0.25;

            leftArm.shoulder.rotation.set(-0.7 + Math.sin(beat) * 0.5, 0.15, 0.4);
            leftArm.elbow.rotation.x = -1.0 + Math.cos(beat) * 0.4;

            leftLeg.hip.rotation.x = -0.28 + Math.sin(beat * 0.5) * 0.25;
            leftLeg.knee.rotation.x = 0.5 + swagBounce * 0.3;
            rightLeg.hip.rotation.x = -0.28 - Math.sin(beat * 0.5) * 0.25;
            rightLeg.knee.rotation.x = 0.5 + swagBounce * 0.3;
            break;
          }

          case 3: {
            // 4. j-hope — "ON Dance Break / MORE" (Street Popping, Chest Pop & Arm Wave)
            const popSnap = Math.pow(Math.abs(Math.sin(beat)), 3);
            pelvis.position.y = 0.94 + (popSnap > 0.6 ? 0.08 : -0.06);
            pelvis.position.x = Math.cos(beat * 0.5) * 0.22;

            // Isolamento de Tórax (Chest Pop)
            spine.rotation.x = -0.12 * popSnap + 0.06;
            spine.rotation.y = Math.sin(beat * 0.75) * 0.38;
            spine.rotation.z = Math.cos(beat * 0.5) * 0.2;
            headGroup.rotation.z = Math.sin(beat) * 0.2;

            // Onda fluida no braço esquerdo (Arm Wave)
            leftArm.shoulder.rotation.z = 1.25 + Math.sin(beat) * 0.45;
            leftArm.shoulder.rotation.x = -0.4 + Math.cos(beat) * 0.4;
            leftArm.elbow.rotation.z = Math.cos(beat - 0.8) * 0.65;
            leftArm.elbow.rotation.x = -0.6 + Math.sin(beat) * 0.4;

            rightArm.shoulder.rotation.set(-1.3 + Math.sin(beat) * 0.35, -0.2, -0.35);
            rightArm.elbow.rotation.x = -1.15;

            // Passos dinâmicos de Street Dance
            leftLeg.hip.rotation.x = -0.35 + Math.sin(beat) * 0.45;
            leftLeg.knee.rotation.x = 0.65 + Math.cos(beat) * 0.35;
            rightLeg.hip.rotation.x = -0.35 - Math.sin(beat) * 0.45;
            rightLeg.knee.rotation.x = 0.65 - Math.cos(beat) * 0.35;
            break;
          }

          case 4: {
            // 5. Jimin — "Black Swan / Filter" (Body Roll Contemporâneo, Giro & Mão no Cabelo)
            const wavePhase = beat * 0.5;
            // Onda corporal (Body Roll) subindo da pélvis para a cabeça
            pelvis.position.z = m.pos[2] + Math.sin(wavePhase) * 0.12;
            pelvis.position.y = 0.95 - Math.abs(Math.cos(wavePhase)) * 0.07;
            pelvis.rotation.y = Math.sin(wavePhase * 0.5) * 0.75;
            spine.rotation.x = Math.sin(wavePhase - 0.6) * 0.22;
            spine.rotation.z = Math.cos(wavePhase) * 0.16;
            headGroup.rotation.x = Math.sin(wavePhase - 1.2) * 0.24;
            headGroup.rotation.y = Math.cos(wavePhase) * 0.28;

            // Mão esquerda passando graciosamente perto do cabelo loiro
            leftArm.shoulder.rotation.set(-2.1 + Math.sin(wavePhase) * 0.35, 0.35, 0.45);
            leftArm.elbow.rotation.x = -1.65 + Math.cos(wavePhase) * 0.3;

            rightArm.shoulder.rotation.set(-1.15, -0.25, -0.25);
            rightArm.elbow.rotation.x = -1.25;

            leftLeg.hip.rotation.x = -0.18 + Math.sin(wavePhase) * 0.28;
            leftLeg.knee.rotation.x = 0.35 + Math.abs(Math.sin(wavePhase)) * 0.25;
            rightLeg.hip.rotation.z = -0.15 - Math.abs(Math.cos(wavePhase)) * 0.22;
            rightLeg.knee.rotation.x = 0.25;
            break;
          }

          case 5: {
            // 6. V — "Singularity / Slow Dancing" (Groove R&B Suave, Charisma Gaze & Pose)
            const smoothBeat = beat * 0.5;
            pelvis.position.x = Math.sin(smoothBeat) * 0.22;
            pelvis.position.y = 0.95 - Math.abs(Math.sin(smoothBeat)) * 0.06;
            pelvis.rotation.y = -Math.sin(smoothBeat) * 0.32;
            spine.rotation.y = Math.cos(smoothBeat) * 0.25;
            spine.rotation.z = Math.sin(smoothBeat) * 0.12;

            // Olhar carismático inclinado para a câmera
            headGroup.rotation.y = -0.25 + Math.sin(smoothBeat) * 0.2;
            headGroup.rotation.z = 0.12 * Math.cos(smoothBeat);

            rightArm.shoulder.rotation.set(-1.25 + Math.sin(smoothBeat) * 0.2, -0.28, -0.18);
            rightArm.elbow.rotation.x = -1.3;

            leftArm.shoulder.rotation.set(-0.45 + Math.cos(smoothBeat) * 0.35, 0.2, 0.32);
            leftArm.elbow.rotation.x = -0.85 + Math.sin(smoothBeat) * 0.35;

            leftLeg.hip.rotation.z = Math.max(0, Math.sin(smoothBeat) * 0.22);
            leftLeg.knee.rotation.x = 0.3 + Math.max(0, -Math.sin(smoothBeat) * 0.3);
            rightLeg.hip.rotation.z = Math.min(0, Math.sin(smoothBeat) * 0.22);
            rightLeg.knee.rotation.x = 0.3 + Math.max(0, Math.sin(smoothBeat) * 0.3);
            break;
          }

          case 6: {
            // 7. Jung Kook — "Standing Next to You / ON Center" (Moonwalk Glide & Center Power)
            const glide = beat * 0.75;
            pelvis.position.y = 0.94 + Math.abs(Math.sin(glide)) * 0.09;
            pelvis.position.z = m.pos[2] + Math.sin(glide * 0.5) * 0.24;
            spine.rotation.y = Math.sin(glide * 0.5) * 0.36;
            spine.rotation.x = 0.08 * Math.cos(glide);
            headGroup.rotation.x = Math.sin(glide) * 0.16;

            rightArm.shoulder.rotation.set(-1.35 + Math.sin(glide) * 0.25, -0.25, -0.25);
            rightArm.elbow.rotation.x = -1.25;

            // Movimento de segurar a lapela do paletó (Jacket Flick) e abrir o braço
            leftArm.shoulder.rotation.set(-1.1 + Math.cos(glide) * 0.55, 0.35, 0.4 + Math.sin(glide) * 0.4);
            leftArm.elbow.rotation.x = -1.2 + Math.sin(glide) * 0.45;

            // Moonwalk / Michael Jackson Footwork nos joelhos e tornozelos
            leftLeg.hip.rotation.x = Math.sin(glide) * 0.48;
            leftLeg.knee.rotation.x = 0.45 + Math.max(0, -Math.sin(glide) * 0.55);
            leftLeg.ankle.rotation.x = Math.cos(glide) * 0.35;

            rightLeg.hip.rotation.x = -Math.sin(glide) * 0.48;
            rightLeg.knee.rotation.x = 0.45 + Math.max(0, Math.sin(glide) * 0.55);
            rightLeg.ankle.rotation.x = -Math.cos(glide) * 0.35;
            break;
          }

          default:
            break;
        }

        // --- FÍSICA SECUNDÁRIA DAS MECHAS DE CABELO ---
        const headVel = Math.cos(beat + index) * 0.08;
        dynamicStrands.forEach((st) => {
          st.pivot.rotation.x = st.baseRotX + Math.abs(headVel) * 0.6 + Math.sin(beat + st.phase) * 0.04;
          st.pivot.rotation.z = st.baseRotZ + Math.sin(beat * 0.5 + st.phase) * 0.05;
        });
      });

      // Animação dos Lasers e do Telão FYA
      laserBeams.forEach((b) => {
        b.mesh.rotation.z = Math.sin(t * 1.7 + b.phase) * 0.45;
        b.mesh.rotation.x = Math.cos(t * 1.2 + b.phase) * 0.25;
      });

      fyaCircles.forEach((c, idx) => {
        const s = 1 + Math.sin(beat + idx) * 0.07;
        c.scale.set(s, s, 1);
      });

      armyBombs.rotation.y = t * 0.06;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);
    setTimeout(handleResize, 60);

    return () => {
      cancelAnimationFrame(animFrameId);
      domElem.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      domElem.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [isFullscreen]);

  return (
    <div
      ref={wrapperRef}
      className={`bg-[#06030C] text-white border border-[#6B21A8]/60 shadow-2xl overflow-hidden transition-all ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none flex flex-col h-screen w-screen'
          : 'relative rounded-[32px]'
      }`}
    >
      {/* Cabeçalho do Show */}
      <div className="p-3.5 sm:px-6 bg-gradient-to-r from-[#2E1065] via-[#7F1D1D] to-[#1E1B4B] border-b border-white/15 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div>
          <h2 className="font-serif-romantic text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#EF4444] animate-pulse" />
            <span>BTS — “FYA” World Tour Stage 💜</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-purple-200">
            Modelos High-Poly Articulados • Cabelos com Física & Expressões Vivas ✨
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => {
              setFocusedMember(null);
              setCameraMode((prev) => (prev === 'director' ? 'free' : 'director'));
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
              cameraMode === 'director' && !focusedMember
                ? 'bg-[#A855F7] text-white border-[#C084FC]'
                : 'bg-white/10 text-purple-100 border-white/20 hover:bg-white/20'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>{cameraMode === 'director' && !focusedMember ? 'Câmera TV Ativa' : 'Ativar Câmera TV'}</span>
          </button>

          <button
            onClick={() => setShowPlayer(!showPlayer)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#EF4444] hover:bg-[#DC2626] text-white transition cursor-pointer shadow-sm"
          >
            <Music className="w-3.5 h-3.5" />
            <span>{showPlayer ? 'Ocultar Áudio' : 'Abrir Música FYA'}</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/15 hover:bg-white/25 text-white border border-white/25 transition cursor-pointer"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Sair</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Tela Cheia</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Barra de Seleção Fancam Close-up nos 7 Integrantes */}
      <div className="px-3 py-2 bg-[#110921] border-b border-white/10 flex items-center gap-1.5 overflow-x-auto shrink-0">
        <button
          onClick={() => setFocusedMember(null)}
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
            !focusedMember
              ? 'bg-[#A855F7] text-white shadow-xs'
              : 'bg-white/10 text-purple-200 hover:bg-white/20'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Palco Completo (OT7)</span>
        </button>

        {BTS_MEMBERS.map((m) => (
          <button
            key={m.id}
            onClick={() => setFocusedMember(m)}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              focusedMember?.id === m.id
                ? 'bg-[#EF4444] text-white shadow-xs'
                : 'bg-white/10 text-purple-100 hover:bg-white/20'
            }`}
          >
            <Video className="w-3 h-3" />
            <span>{m.name}</span>
          </button>
        ))}
      </div>

      {/* Área do Palco 3D */}
      <div className={`relative w-full ${isFullscreen ? 'flex-1 min-h-0' : 'h-[470px] sm:h-[540px]'}`}>
        <div
          ref={mountRef}
          className="w-full h-full touch-none select-none cursor-grab active:cursor-grabbing"
        />

        {/* Overlay de Detalhes do Membro em Modo Fancam Close-Up */}
        {focusedMember && (
          <div className="absolute top-3 left-3 z-20 bg-black/80 backdrop-blur-md border border-[#A855F7]/60 rounded-2xl p-3.5 max-w-xs shadow-xl">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#F43F5E]">
                FANCAM CLOSE-UP • {focusedMember.role}
              </span>
              <button
                onClick={() => setFocusedMember(null)}
                className="text-[11px] text-purple-300 hover:text-white underline cursor-pointer"
              >
                Voltar OT7
              </button>
            </div>
            <p className="font-serif-romantic text-2xl font-bold text-white mt-0.5">
              {focusedMember.name}
            </p>
            <p className="text-xs text-purple-200 mt-0.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#FDE047] shrink-0" />
              <span>{focusedMember.choreoName}</span>
            </p>
          </div>
        )}

        {/* Player Oficial do YouTube: BTS - FYA (https://www.youtube.com/watch?v=QWDayFgPDjQ) */}
        {showPlayer && (
          <div className="absolute bottom-3 right-3 z-20 bg-black/85 backdrop-blur-md border border-[#EF4444]/60 rounded-2xl p-2 shadow-2xl w-64 sm:w-72">
            <div className="flex items-center justify-between px-1 pb-1.5 text-[11px] text-purple-200">
              <span className="font-semibold text-white flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#EF4444]" /> BTS — “FYA” (Áudio Oficial)
              </span>
              <a
                href="https://www.youtube.com/watch?v=QWDayFgPDjQ"
                target="_blank"
                rel="noreferrer"
                className="text-[#F87171] hover:underline"
              >
                YouTube ↗
              </a>
            </div>
            <div className="rounded-xl overflow-hidden aspect-video bg-black">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/QWDayFgPDjQ?autoplay=1&loop=1&playlist=QWDayFgPDjQ"
                title="BTS - FYA"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>

      {/* Rodapé de Instruções */}
      <div className="px-4 py-2.5 bg-[#080411] text-purple-200/90 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 text-[11px] shrink-0">
        <span>💜 Clique no nome de um membro acima para ver o rosto, cabelo e coreografia de perto (Fancam)</span>
        <span className="inline-flex items-center gap-1">
          <RotateCw className="w-3 h-3" /> Arraste para controlar o ângulo ou use a Câmera TV
        </span>
      </div>
    </div>
  );
}
