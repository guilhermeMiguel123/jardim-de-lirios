import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Sparkles,
  Music,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  RotateCw,
  Video,
  Flame,
  Users,
  Disc
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
    hairColor: '#D4D4D8',
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
    hairColor: '#1C1917',
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
    hairColor: '#09090B',
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
    hairColor: '#3E2723',
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
    hairColor: '#EAB308',
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
    hairColor: '#18181B',
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
    hairColor: '#141417',
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
  const [isPlayingMusic, setIsPlayingMusic] = useState(true);
  const [cameraMode, setCameraMode] = useState('director');

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

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#05020A');
    scene.fog = new THREE.FogExp2('#05020A', 0.018);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 150);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight('#F3E8FF', 1.25);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight('#FFFDF9', 2.2);
    keyLight.position.set(4, 14, 12);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const backRimLight = new THREE.DirectionalLight('#C084FC', 1.8);
    backRimLight.position.set(0, 8, -10);
    scene.add(backRimLight);

    const redStageLight = new THREE.PointLight('#EF4444', 5.0, 28);
    redStageLight.position.set(-6, 5, 3);
    scene.add(redStageLight);

    const purpleStageLight = new THREE.PointLight('#A855F7', 5.0, 28);
    purpleStageLight.position.set(6, 5, 3);
    scene.add(purpleStageLight);

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

    // --- CORREÇÃO DO CABELO (POSICIONAMENTO CORRETO NA CABEÇA) ---
    const createDetailedIdolHair = (style, colorHex) => {
      const hairGroup = new THREE.Group();
      const hairMat = new THREE.MeshPhysicalMaterial({
        color: colorHex,
        roughness: 0.32,
        metalness: 0.15,
        clearcoat: 0.65,
        clearcoatRoughness: 0.25,
      });

      const scalp = new THREE.Mesh(
        new THREE.SphereGeometry(0.235, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.58),
        hairMat
      );
      scalp.position.set(0, 0.03, -0.01);
      hairGroup.add(scalp);

      const dynamicStrands = [];
      const strandCount = 24;

      for (let i = 0; i < strandCount; i++) {
        const angle = (i / strandCount) * Math.PI * 2;
        const isFront = Math.cos(angle) > 0.2;

        const strandPivot = new THREE.Group();
        strandPivot.position.set(
          Math.sin(angle) * 0.2,
          0.14 + Math.sin(i * 1.5) * 0.015,
          Math.cos(angle) * 0.21
        );

        let length = 0.18;
        let width = 0.052;
        if (style === 'wavyLong' && !isFront) length = 0.28;
        if (style === 'wavyPerm') width = 0.06;

        const strandGeo = new THREE.CapsuleGeometry(width, length, 8, 16);
        const strandMesh = new THREE.Mesh(strandGeo, hairMat);
        strandMesh.scale.set(1, 1, 0.4);
        strandMesh.position.y = -length * 0.4;

        strandPivot.rotation.y = angle;
        if (isFront) {
          if (style === 'sweptBack') {
            strandPivot.rotation.x = -0.45;
          } else if (style === 'foreheadComma' || style === 'silkyParted') {
            const side = Math.sin(angle) >= 0 ? 1 : -1;
            strandPivot.rotation.x = 0.22;
            strandPivot.rotation.z = side * 0.35;
          } else {
            strandPivot.rotation.x = 0.25;
          }
        } else {
          strandPivot.rotation.x = 0.18;
        }

        strandPivot.add(strandMesh);
        hairGroup.add(strandPivot);

        dynamicStrands.push({
          pivot: strandPivot,
          baseRotX: strandPivot.rotation.x,
          baseRotZ: strandPivot.rotation.z,
          phase: i * 0.4,
        });
      }

      return { hairGroup, dynamicStrands };
    };

    const dancerRigs = [];
    const clickableMeshes = [];

    const skinMat = new THREE.MeshPhysicalMaterial({
      color: '#FFE3D3',
      roughness: 0.38,
      metalness: 0.02,
      clearcoat: 0.25,
      clearcoatRoughness: 0.4,
    });
    const blushMat = new THREE.MeshBasicMaterial({ color: '#F43F5E', transparent: true, opacity: 0.18 });
    const scleraMat = new THREE.MeshBasicMaterial({ color: '#FFFFFF' });
    const pupilMat = new THREE.MeshBasicMaterial({ color: '#09090B' });
    const lipMat = new THREE.MeshStandardMaterial({ color: '#E15B64', roughness: 0.35 });
    const teethMat = new THREE.MeshBasicMaterial({ color: '#FFFFFF' });
    const shoeMat = new THREE.MeshPhysicalMaterial({ color: '#09090B', roughness: 0.15, metalness: 0.4 });

    BTS_MEMBERS.forEach((m, index) => {
      const root = new THREE.Group();
      root.position.set(m.pos[0], m.pos[1], m.pos[2]);
      root.scale.setScalar(m.heightScale);

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

      const suitMat = new THREE.MeshPhysicalMaterial({ color: m.suitColor, roughness: 0.42, metalness: 0.15 });
      const lapelMat = new THREE.MeshPhysicalMaterial({ color: m.lapelColor, roughness: 0.25, metalness: 0.3 });
      const shirtMat = new THREE.MeshStandardMaterial({ color: m.shirtColor, roughness: 0.35 });
      const tieMat = new THREE.MeshStandardMaterial({ color: m.tieColor, roughness: 0.3 });

      const pelvis = new THREE.Group();
      pelvis.position.y = 0.96;
      root.add(pelvis);

      const hipsMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.14, 16, 24), suitMat);
      hipsMesh.scale.set(1.25, 0.8, 0.85);
      pelvis.add(hipsMesh);

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

      const neck = new THREE.Group();
      neck.position.y = 0.68;
      spine.add(neck);

      const neckMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.085, 0.18, 24), skinMat);
      neckMesh.position.y = 0.06;
      neck.add(neckMesh);

      const headGroup = new THREE.Group();
      headGroup.position.y = 0.24;
      neck.add(headGroup);

      const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.23, 32, 32), skinMat);
      headMesh.scale.set(0.92, 1.08, 0.95);
      headMesh.castShadow = true;
      headMesh.userData = { memberId: m.id };
      clickableMeshes.push(headMesh);
      headGroup.add(headMesh);

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

      const nose = new THREE.Mesh(new THREE.ConeGeometry(0.028, 0.09, 16), skinMat);
      nose.position.set(0, -0.01, 0.22);
      nose.rotation.x = 0.18;
      headGroup.add(nose);

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

        const catchlight = new THREE.Mesh(new THREE.CircleGeometry(0.0055, 12), scleraMat);
        catchlight.position.set(0.007, 0.007, 0.02);
        eyeSocket.add(catchlight);

        const lashLine = new THREE.Mesh(new THREE.BoxGeometry(0.068, 0.008, 0.01), pupilMat);
        lashLine.position.set(0, 0.022, 0.016);
        lashLine.rotation.z = side * -0.05;
        eyeSocket.add(lashLine);

        const eyelid = new THREE.Mesh(
          new THREE.SphereGeometry(0.036, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55),
          skinMat
        );
        eyelid.scale.set(1.26, 0.1, 0.55);
        eyelid.position.y = 0.022;
        eyeSocket.add(eyelid);
        eyelids.push(eyelid);

        const brow = new THREE.Mesh(
          new THREE.CapsuleGeometry(0.01, 0.055, 8, 12),
          new THREE.MeshBasicMaterial({ color: m.hairColor === '#EAB308' ? '#713F12' : '#18181B' })
        );
        brow.rotation.z = Math.PI / 2 + side * -0.08;
        brow.position.set(0, 0.052, 0.018);
        eyeSocket.add(brow);
        eyebrows.push({ mesh: brow, side });
      });

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

      const { hairGroup, dynamicStrands } = createDetailedIdolHair(m.hairStyle, m.hairColor);
      headGroup.add(hairGroup);

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

    let animFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const beat = t * 6.6;

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

        const blinkCycle = (t * 0.9 + index * 1.3) % 4.5;
        const isBlinking = blinkCycle > 4.32;
        const isWinking = (index === 1 || index === 5) && Math.sin(beat * 0.25) > 0.85;

        eyelids[0].scale.y = isBlinking ? 1.05 : 0.1;
        eyelids[1].scale.y = isBlinking || isWinking ? 1.05 : 0.1;

        const browLift = Math.sin(beat * 0.5 + index) * 0.008;
        eyebrows[0].mesh.position.y = 0.052 + browLift;
        eyebrows[1].mesh.position.y = 0.052 + (isWinking ? 0.012 : browLift);

        const singOpen = 0.65 + Math.abs(Math.sin(beat * 1.5 + index * 0.7)) * 0.95;
        mouthGroup.scale.set(1 + Math.sin(beat * 0.5) * 0.12, singOpen, 1);

        switch (index) {
          case 0: {
            const bounce = Math.abs(Math.sin(beat * 0.5));
            pelvis.position.y = 0.94 - bounce * 0.08;
            pelvis.position.x = Math.sin(beat * 0.25) * 0.12;
            spine.rotation.y = Math.sin(beat * 0.5) * 0.28;
            spine.rotation.x = 0.08 + bounce * 0.08;
            headGroup.rotation.x = Math.sin(beat) * 0.16;

            rightArm.shoulder.rotation.set(-1.15 + Math.sin(beat * 0.5) * 0.15, -0.25, -0.2);
            rightArm.elbow.rotation.x = -1.25 + Math.cos(beat) * 0.2;
            leftArm.shoulder.rotation.set(-0.85 + Math.sin(beat) * 0.45, 0.2, 0.35);
            leftArm.elbow.rotation.x = -0.9 + Math.sin(beat) * 0.4;
            break;
          }
          case 1: {
            const kissPhase = Math.sin(beat * 0.25);
            pelvis.position.y = 0.95 - Math.abs(Math.cos(beat * 0.5)) * 0.06;
            pelvis.rotation.y = Math.sin(beat * 0.25) * 0.45;
            headGroup.rotation.y = Math.cos(beat * 0.5) * 0.22;

            if (kissPhase > 0.3) {
              const extend = (kissPhase - 0.3) / 0.7;
              leftArm.shoulder.rotation.set(-1.35, 0.35 - extend * 0.6, 0.2 + extend * 0.5);
              leftArm.elbow.rotation.x = -1.55 + extend * 1.1;
            } else {
              leftArm.shoulder.rotation.set(-0.5, 0, 0.35);
              leftArm.elbow.rotation.x = -0.7;
            }
            rightArm.shoulder.rotation.set(-1.2, -0.3, -0.2);
            rightArm.elbow.rotation.x = -1.3;
            break;
          }
          case 2: {
            const swag = Math.abs(Math.sin(beat));
            pelvis.position.y = 0.92 - swag * 0.1;
            spine.rotation.x = 0.14 + swag * 0.08;
            rightArm.shoulder.rotation.set(-1.05 + Math.cos(beat * 0.5) * 0.3, -0.2, -0.25);
            rightArm.elbow.rotation.x = -1.1;
            leftArm.shoulder.rotation.set(-0.7 + Math.sin(beat) * 0.5, 0.15, 0.4);
            leftArm.elbow.rotation.x = -1.0;
            break;
          }
          case 3: {
            const pop = Math.pow(Math.abs(Math.sin(beat)), 3);
            pelvis.position.y = 0.94 + (pop > 0.6 ? 0.08 : -0.06);
            spine.rotation.y = Math.sin(beat * 0.75) * 0.38;
            leftArm.shoulder.rotation.z = 1.25 + Math.sin(beat) * 0.45;
            rightArm.shoulder.rotation.set(-1.3, -0.2, -0.35);
            break;
          }
          case 4: {
            const wave = beat * 0.5;
            pelvis.position.y = 0.95 - Math.abs(Math.cos(wave)) * 0.07;
            pelvis.rotation.y = Math.sin(wave * 0.5) * 0.75;
            leftArm.shoulder.rotation.set(-2.1, 0.35, 0.45);
            rightArm.shoulder.rotation.set(-1.15, -0.25, -0.25);
            break;
          }
          case 5: {
            const sm = beat * 0.5;
            pelvis.position.x = Math.sin(sm) * 0.22;
            headGroup.rotation.y = -0.25 + Math.sin(sm) * 0.2;
            rightArm.shoulder.rotation.set(-1.25, -0.28, -0.18);
            leftArm.shoulder.rotation.set(-0.45, 0.2, 0.32);
            break;
          }
          case 6: {
            const gl = beat * 0.75;
            pelvis.position.y = 0.94 + Math.abs(Math.sin(gl)) * 0.09;
            rightArm.shoulder.rotation.set(-1.35, -0.25, -0.25);
            leftArm.shoulder.rotation.set(-1.1, 0.35, 0.4);
            break;
          }
          default:
            break;
        }

        const headVel = Math.cos(beat + index) * 0.08;
        dynamicStrands.forEach((st) => {
          st.pivot.rotation.x = st.baseRotX + Math.abs(headVel) * 0.6 + Math.sin(beat + st.phase) * 0.04;
          st.pivot.rotation.z = st.baseRotZ + Math.sin(beat * 0.5 + st.phase) * 0.05;
        });
      });

      laserBeams.forEach((b) => {
        b.mesh.rotation.z = Math.sin(t * 1.7 + b.phase) * 0.45;
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
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
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
      {/* Cabeçalho */}
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

      {/* Seleção Fancam */}
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

      {/* Área 3D + Player Estilo Spotify / Apple Music */}
      <div className={`relative w-full ${isFullscreen ? 'flex-1 min-h-0' : 'h-[470px] sm:h-[540px]'}`}>
        <div
          ref={mountRef}
          className="w-full h-full touch-none select-none cursor-grab active:cursor-grabbing"
        />

        {/* Overlay de Detalhes Fancam */}
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

        {/* WIDGET DE MÚSICA ESTILO SPOTIFY (SEM VÍDEO APARECENDO) */}
        <div className="absolute bottom-3 right-3 z-20 bg-black/90 backdrop-blur-xl border border-white/15 rounded-2xl p-3 shadow-2xl w-68 sm:w-76">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#7F1D1D] to-[#9333EA] flex items-center justify-center shrink-0 shadow-md">
              <Disc className={`w-6 h-6 text-white ${isPlayingMusic ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">BTS — “FYA”</p>
              <p className="text-[11px] text-purple-300 truncate">World Tour Live Audio</p>

              {/* Barra de Progresso Animada */}
              <div className="w-full h-1 bg-white/20 rounded-full mt-2 overflow-hidden">
                <div className={`h-full bg-gradient-to-r from-[#EF4444] to-[#A855F7] rounded-full ${isPlayingMusic ? 'w-3/5 animate-pulse' : 'w-1/3'}`} />
              </div>
            </div>

            {/* Botão Play / Pause */}
            <button
              onClick={() => setIsPlayingMusic(!isPlayingMusic)}
              className="w-10 h-10 rounded-full bg-white hover:bg-purple-100 text-[#090D16] flex items-center justify-center shadow-lg transition transform hover:scale-105 shrink-0 cursor-pointer"
            >
              {isPlayingMusic ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>
          </div>

          {/* Iframe do YouTube oculto (1x1 pixel) apenas reproduzindo o áudio limpo em background */}
          <div className="absolute opacity-0 pointer-events-none w-px h-px overflow-hidden">
            <iframe
              width="1"
              height="1"
              src={`https://www.youtube.com/embed/QWDayFgPDjQ?autoplay=1&loop=1&playlist=QWDayFgPDjQ&mute=${isPlayingMusic ? '0' : '1'}`}
              title="BTS Audio"
              allow="autoplay"
            />
          </div>
        </div>
      </div>

      {/* Rodapé */}
      <div className="px-4 py-2.5 bg-[#080411] text-purple-200/90 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 text-[11px] shrink-0">
        <span>💜 Clique nos membros acima para ver a Fancam individual</span>
        <span className="inline-flex items-center gap-1">
          <RotateCw className="w-3 h-3" /> Arraste para girar a câmera
        </span>
      </div>
    </div>
  );
}
