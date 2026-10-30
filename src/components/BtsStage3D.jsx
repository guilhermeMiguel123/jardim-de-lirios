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
    role: 'Leader & Rap',
    choreoName: '1. Power Rap Groove & Arm Wave',
    suitColor: '#1E293B',
    shirtColor: '#F8FAFC',
    tieColor: '#991B1B',
    hairColor: '#CBD5E1', // Platinado/Cinza conforme a capa de FYA
    micColor: '#3B82F6',
    pos: [-4.8, 0, -0.6],
  },
  {
    id: 'Jin',
    name: 'Jin',
    role: 'Vocal & Visual',
    choreoName: '2. Worldwide Handsome Spin & Kiss',
    suitColor: '#0F172A',
    shirtColor: '#FFFFFF',
    tieColor: '#1E293B',
    hairColor: '#18181B',
    micColor: '#EC4899',
    pos: [-3.2, 0, 0.5],
  },
  {
    id: 'SUGA',
    name: 'SUGA',
    role: 'Lead Rapper',
    choreoName: '3. Swag Hip-Hop Bounce & Flow',
    suitColor: '#334155',
    shirtColor: '#F1F5F9',
    tieColor: '#0F172A',
    hairColor: '#1E1B18',
    micColor: '#1E293B',
    pos: [-1.6, 0, -0.6],
  },
  {
    id: 'jhope',
    name: 'j-hope',
    role: 'Main Dancer & Rap',
    choreoName: '4. Street Popping & High Energy Jump',
    suitColor: '#27272A',
    shirtColor: '#FFFFFF',
    tieColor: '#7F1D1D',
    hairColor: '#3F2E21',
    micColor: '#EF4444',
    pos: [0, 0, -1.1],
  },
  {
    id: 'Jimin',
    name: 'Jimin',
    role: 'Main Dancer & Vocal',
    choreoName: '5. Contemporary Grace & Body Roll',
    suitColor: '#475569',
    shirtColor: '#FFFFFF',
    tieColor: '#334155',
    hairColor: '#D97706', // Loiro dourado conforme a capa
    micColor: '#F59E0B',
    pos: [1.6, 0, -0.6],
  },
  {
    id: 'V',
    name: 'V',
    role: 'Vocal & Visual',
    choreoName: '6. Charisma Smooth Step & Vibe',
    suitColor: '#1E293B',
    shirtColor: '#F8FAFC',
    tieColor: '#881337',
    hairColor: '#18181B',
    micColor: '#16A34A',
    pos: [3.2, 0, 0.5],
  },
  {
    id: 'JungKook',
    name: 'Jung Kook',
    role: 'Main Vocal & Center',
    choreoName: '7. Golden Maknae Footwork & Fire Kick',
    suitColor: '#090D16',
    shirtColor: '#FFFFFF',
    tieColor: '#111827',
    hairColor: '#171717',
    micColor: '#9333EA',
    pos: [4.8, 0, 0.5],
  },
];

export default function BtsStage3D() {
  const wrapperRef = useRef(null);
  const mountRef = useRef(null);

  const [focusedMember, setFocusedMember] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPlayer, setShowPlayer] = useState(true);

  const focusedMemberRef = useRef(null);
  useEffect(() => {
    focusedMemberRef.current = focusedMember;
  }, [focusedMember]);

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

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#07040E');
    scene.fog = new THREE.FogExp2('#07040E', 0.022);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      150
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 1. Iluminação de Show / Arena (Roxo BTS + Vermelho FYA)
    const ambientLight = new THREE.AmbientLight('#E9D5FF', 1.15);
    scene.add(ambientLight);

    const mainStageLight = new THREE.DirectionalLight('#FFFFFF', 1.8);
    mainStageLight.position.set(0, 16, 12);
    mainStageLight.castShadow = true;
    scene.add(mainStageLight);

    const redFyaLight = new THREE.PointLight('#EF4444', 4.5, 25);
    redFyaLight.position.set(-6, 5, 2);
    scene.add(redFyaLight);

    const purpleBtsLight = new THREE.PointLight('#A855F7', 4.5, 25);
    purpleBtsLight.position.set(6, 5, 2);
    scene.add(purpleBtsLight);

    // 2. Palco Performático (Piso LED Espelhado + Anéis Neon + Telão FYA)
    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    const floorGeo = new THREE.CylinderGeometry(8.5, 9.2, 0.8, 32);
    const floorMat = new THREE.MeshStandardMaterial({
      color: '#0F172A',
      roughness: 0.15,
      metalness: 0.65,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.y = -0.4;
    floorMesh.receiveShadow = true;
    stageGroup.add(floorMesh);

    // Borda de LED Vermelho & Roxo no Palco
    const neonRingGeo = new THREE.TorusGeometry(8.3, 0.08, 12, 64);
    const neonRingMat = new THREE.MeshStandardMaterial({
      color: '#EF4444',
      emissive: '#EF4444',
      emissiveIntensity: 1.5,
    });
    const neonRing = new THREE.Mesh(neonRingGeo, neonRingMat);
    neonRing.rotation.x = Math.PI / 2;
    neonRing.position.y = 0.02;
    stageGroup.add(neonRing);

    const innerPurpleRing = new THREE.Mesh(
      new THREE.TorusGeometry(6.2, 0.06, 12, 64),
      new THREE.MeshStandardMaterial({
        color: '#A855F7',
        emissive: '#9333EA',
        emissiveIntensity: 1.4,
      })
    );
    innerPurpleRing.rotation.x = Math.PI / 2;
    innerPurpleRing.position.y = 0.03;
    stageGroup.add(innerPurpleRing);

    // Telão Gigante de Fundo com os 3 Círculos Vermelhos Neon de "FYA"
    const screenWall = new THREE.Mesh(
      new THREE.BoxGeometry(14, 5.5, 0.3),
      new THREE.MeshStandardMaterial({ color: '#090D16', roughness: 0.4 })
    );
    screenWall.position.set(0, 2.8, -4.5);
    stageGroup.add(screenWall);

    const fyaLogoCircles = [];
    [-2.4, 0, 2.4].forEach((cx, idx) => {
      const circleGroup = new THREE.Group();
      circleGroup.position.set(cx, 2.8, -4.25);

      const disc = new THREE.Mesh(
        new THREE.CircleGeometry(0.95, 32),
        new THREE.MeshStandardMaterial({
          color: '#DC2626',
          emissive: '#EF4444',
          emissiveIntensity: 1.1,
        })
      );
      circleGroup.add(disc);

      // Detalhes geométricos internos inspirados no logo da capa de FYA
      if (idx === 0) {
        const innerHole = new THREE.Mesh(
          new THREE.CircleGeometry(0.32, 24),
          new THREE.MeshBasicMaterial({ color: '#450A0A' })
        );
        innerHole.position.z = 0.02;
        circleGroup.add(innerHole);
      } else {
        [-0.32, 0, 0.32].forEach((barY) => {
          const bar = new THREE.Mesh(
            new THREE.PlaneGeometry(1.5, 0.16),
            new THREE.MeshBasicMaterial({ color: '#450A0A' })
          );
          bar.position.set(0, barY, 0.02);
          circleGroup.add(bar);
        });
      }

      stageGroup.add(circleGroup);
      fyaLogoCircles.push(circleGroup);
    });

    // Feixes de Luz Laser de Concerto no Fundo
    const laserBeams = [];
    const laserGeo = new THREE.ConeGeometry(0.65, 11, 12, 1, true);
    [-5.5, -2.8, 0, 2.8, 5.5].forEach((lx, i) => {
      const laserMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? '#A855F7' : '#EF4444',
        transparent: true,
        opacity: 0.16,
        side: THREE.DoubleSide,
      });
      const beam = new THREE.Mesh(laserGeo, laserMat);
      beam.position.set(lx, 5.2, -3.5);
      scene.add(beam);
      laserBeams.push({ mesh: beam, phase: i * 0.9 });
    });

    // 3. Construção dos 7 Integrantes do BTS Articulados (Ternos Elegantes + Rosto + Cabelo + Microfone)
    const dancerRigs = [];
    const clickableMeshes = [];
    const skinMat = new THREE.MeshStandardMaterial({ color: '#FFE4D6', roughness: 0.45 });

    BTS_MEMBERS.forEach((m, index) => {
      const root = new THREE.Group();
      root.position.set(m.pos[0], m.pos[1], m.pos[2]);

      // Tapete de Luz Individual sob os pés de cada membro
      const spotPad = new THREE.Mesh(
        new THREE.CircleGeometry(0.75, 24),
        new THREE.MeshBasicMaterial({
          color: m.micColor,
          transparent: true,
          opacity: 0.32,
          side: THREE.DoubleSide,
        })
      );
      spotPad.rotation.x = -Math.PI / 2;
      spotPad.position.y = 0.04;
      root.add(spotPad);

      const figure = new THREE.Group();
      root.add(figure);

      const suitMat = new THREE.MeshStandardMaterial({ color: m.suitColor, roughness: 0.5 });
      const shirtMat = new THREE.MeshStandardMaterial({ color: m.shirtColor, roughness: 0.4 });
      const tieMat = new THREE.MeshStandardMaterial({ color: m.tieColor, roughness: 0.4 });
      const hairMat = new THREE.MeshStandardMaterial({ color: m.hairColor, roughness: 0.35 });
      const shoeMat = new THREE.MeshStandardMaterial({ color: '#09090B', roughness: 0.2, metalness: 0.5 });

      // Tronco (Paletó de Alfaiataria)
      const torso = new THREE.Group();
      torso.position.y = 1.05;
      figure.add(torso);

      const jacket = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.76, 0.3), suitMat);
      jacket.castShadow = true;
      jacket.userData = { memberId: m.id };
      clickableMeshes.push(jacket);
      torso.add(jacket);

      // Camisa Branca em V e Gravata
      const shirtV = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.42), shirtMat);
      shirtV.position.set(0, 0.14, 0.155);
      torso.add(shirtV);

      const tie = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.36), tieMat);
      tie.position.set(0, 0.1, 0.16);
      torso.add(tie);

      // Cabeça + Olhos + Sorriso + Cabelo Estilizado K-Pop
      const headGroup = new THREE.Group();
      headGroup.position.y = 0.62;
      torso.add(headGroup);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), skinMat);
      head.scale.set(0.95, 1.06, 0.95);
      head.userData = { memberId: m.id };
      clickableMeshes.push(head);
      headGroup.add(head);

      // Olhos expressivos
      const eyeMat = new THREE.MeshBasicMaterial({ color: '#18181B' });
      const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.026, 8, 8), eyeMat);
      eyeL.position.set(-0.08, 0.02, 0.215);
      const eyeR = eyeL.clone();
      eyeR.position.x = 0.08;
      headGroup.add(eyeL, eyeR);

      // Cabelo repartido estiloso
      const hairTop = new THREE.Mesh(
        new THREE.SphereGeometry(0.255, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.58),
        hairMat
      );
      hairTop.position.y = 0.03;
      hairTop.rotation.x = -0.12;
      headGroup.add(hairTop);

      const bangL = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.24, 6), hairMat);
      bangL.position.set(-0.1, 0.12, 0.19);
      bangL.rotation.set(0.4, 0, 0.35);
      const bangR = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.24, 6), hairMat);
      bangR.position.set(0.1, 0.12, 0.19);
      bangR.rotation.set(0.4, 0, -0.35);
      headGroup.add(bangL, bangR);

      // Braço Esquerdo
      const leftArmPivot = new THREE.Group();
      leftArmPivot.position.set(-0.36, 0.3, 0);
      torso.add(leftArmPivot);

      const leftSleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.62, 8), suitMat);
      leftSleeve.position.y = -0.26;
      leftArmPivot.add(leftSleeve);

      const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), skinMat);
      leftHand.position.y = -0.6;
      leftArmPivot.add(leftHand);

      // Braço Direito + Microfone Personalizado
      const rightArmPivot = new THREE.Group();
      rightArmPivot.position.set(0.36, 0.3, 0);
      torso.add(rightArmPivot);

      const rightSleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.62, 8), suitMat);
      rightSleeve.position.y = -0.26;
      rightArmPivot.add(rightSleeve);

      const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), skinMat);
      rightHand.position.y = -0.6;
      rightArmPivot.add(rightHand);

      const micStick = new THREE.Mesh(
        new THREE.CylinderGeometry(0.022, 0.018, 0.24, 8),
        new THREE.MeshStandardMaterial({
          color: m.micColor,
          emissive: m.micColor,
          emissiveIntensity: 0.7,
        })
      );
      micStick.position.set(0, -0.62, 0.12);
      micStick.rotation.x = Math.PI / 2;
      rightArmPivot.add(micStick);

      // Perna Esquerda
      const leftLegPivot = new THREE.Group();
      leftLegPivot.position.set(-0.15, 0.68, 0);
      figure.add(leftLegPivot);

      const leftPants = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.085, 0.68, 8), suitMat);
      leftPants.position.y = -0.34;
      leftLegPivot.add(leftPants);

      const leftShoe = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.26), shoeMat);
      leftShoe.position.set(0, -0.68, 0.05);
      leftLegPivot.add(leftShoe);

      // Perna Direita
      const rightLegPivot = new THREE.Group();
      rightLegPivot.position.set(0.15, 0.68, 0);
      figure.add(rightLegPivot);

      const rightPants = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.085, 0.68, 8), suitMat);
      rightPants.position.y = -0.34;
      rightLegPivot.add(rightPants);

      const rightShoe = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.26), shoeMat);
      rightShoe.position.set(0, -0.68, 0.05);
      rightLegPivot.add(rightShoe);

      scene.add(root);

      dancerRigs.push({
        id: m.id,
        index,
        root,
        figure,
        torso,
        headGroup,
        leftArmPivot,
        rightArmPivot,
        leftLegPivot,
        rightLegPivot,
        spotPad,
      });
    });

    // 4. Mar de ARMY Bombs (Luzes Roxas e Vermelhas Flutuando na Arena)
    const particlesCount = 200;
    const pPositions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 28;
      pPositions[i * 3 + 1] = 0.3 + Math.random() * 10;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 24;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: '#D8B4FE',
      size: 0.22,
      transparent: true,
      opacity: 0.85,
    });
    const armyBombs = new THREE.Points(pGeo, pMat);
    scene.add(armyBombs);

    // 5. Controles de Câmera e Clique para Fancam
    let isDragging = false;
    let prevPos = { x: 0, y: 0 };
    let pointerDownPos = { x: 0, y: 0 };
    let spherical = { theta: 0, phi: 1.25, radius: 13.0 };

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const onPointerDown = (e) => {
      isDragging = true;
      prevPos = { x: e.clientX, y: e.clientY };
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e) => {
      if (isDragging) {
        const dx = e.clientX - prevPos.x;
        const dy = e.clientY - prevPos.y;
        spherical.theta -= dx * 0.008;
        spherical.phi = Math.max(0.6, Math.min(1.48, spherical.phi - dy * 0.006));
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
      spherical.radius = Math.max(5.5, Math.min(20, spherical.radius + e.deltaY * 0.012));
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    domElem.addEventListener('wheel', onWheel, { passive: false });

    // 6. LOOP DAS 7 COREOGRAFIAS DIFERENTES SINCRONIZADAS COM O BEAT DE "FYA"
    let animFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const beat = t * 6.8; // BPM energético de "FYA"

      // Atualiza a Câmera (Modo Palco Geral ou Modo Fancam Individual)
      const activeFocus = focusedMemberRef.current;
      if (activeFocus) {
        const targetX = activeFocus.pos[0];
        const targetZ = activeFocus.pos[2];
        camera.position.lerp(new THREE.Vector3(targetX, 2.1, targetZ + 4.2), 0.08);
        camera.lookAt(targetX, 1.35, targetZ);
      } else {
        const camX = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
        const camY = spherical.radius * Math.cos(spherical.phi);
        const camZ = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
        camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.1);
        camera.lookAt(0, 1.4, 0);
      }

      // Cada um dos 7 integrantes executa uma coreografia distinta!
      dancerRigs.forEach((rig) => {
        const {
          index,
          figure,
          torso,
          headGroup,
          leftArmPivot,
          rightArmPivot,
          leftLegPivot,
          rightLegPivot,
          spotPad,
        } = rig;

        spotPad.scale.setScalar(1 + Math.sin(beat + index) * 0.12);

        switch (index) {
          case 0: // 1. RM: Power Rap Groove & Arm Wave
            figure.position.y = Math.abs(Math.sin(beat * 0.5)) * 0.1;
            torso.rotation.y = Math.sin(beat * 0.5) * 0.35;
            torso.rotation.x = 0.08 + Math.sin(beat) * 0.06;
            headGroup.rotation.x = Math.sin(beat) * 0.18;
            rightArmPivot.rotation.x = -1.2 + Math.sin(beat) * 0.5;
            leftArmPivot.rotation.z = 0.4 + Math.cos(beat * 0.5) * 0.4;
            leftArmPivot.rotation.x = -0.6 + Math.sin(beat * 0.5) * 0.5;
            leftLegPivot.rotation.x = Math.sin(beat * 0.5) * 0.25;
            rightLegPivot.rotation.x = -Math.sin(beat * 0.5) * 0.25;
            break;

          case 1: // 2. Jin: Worldwide Handsome Spin & Flying Kiss
            figure.position.y = Math.abs(Math.cos(beat * 0.5)) * 0.12;
            figure.rotation.y = Math.sin(beat * 0.25) * 0.65;
            torso.rotation.z = Math.sin(beat * 0.5) * 0.12;
            headGroup.rotation.y = Math.cos(beat * 0.5) * 0.25;
            rightArmPivot.rotation.x = -1.45 + Math.sin(beat * 0.5) * 0.35;
            rightArmPivot.rotation.z = -0.25 + Math.cos(beat * 0.5) * 0.3;
            leftArmPivot.rotation.z = 0.6 + Math.sin(beat) * 0.35;
            leftLegPivot.rotation.z = Math.max(0, Math.sin(beat * 0.5) * 0.25);
            rightLegPivot.rotation.z = Math.min(0, Math.sin(beat * 0.5) * 0.25);
            break;

          case 2: // 3. SUGA: Swag Hip-Hop Bounce & Shoulder Flow
            figure.position.y = Math.abs(Math.sin(beat)) * 0.14;
            figure.position.x = Math.sin(beat * 0.5) * 0.18;
            torso.rotation.x = 0.14 + Math.abs(Math.sin(beat)) * 0.1;
            torso.rotation.z = Math.cos(beat * 0.5) * 0.15;
            headGroup.rotation.x = Math.abs(Math.sin(beat)) * 0.22;
            rightArmPivot.rotation.x = -1.0 + Math.cos(beat) * 0.45;
            leftArmPivot.rotation.x = -0.8 - Math.cos(beat) * 0.45;
            leftLegPivot.rotation.x = Math.cos(beat) * 0.35;
            rightLegPivot.rotation.x = -Math.cos(beat) * 0.35;
            break;

          case 3: // 4. j-hope: Street Popping & High Energy Jump
            figure.position.y = Math.pow(Math.abs(Math.sin(beat * 0.75)), 2) * 0.28;
            torso.rotation.y = Math.cos(beat * 0.75) * 0.45;
            torso.rotation.z = Math.sin(beat * 0.75) * 0.22;
            headGroup.rotation.z = -Math.sin(beat * 0.75) * 0.18;
            leftArmPivot.rotation.x = -2.2 + Math.sin(beat) * 0.65;
            rightArmPivot.rotation.x = -1.6 + Math.cos(beat) * 0.65;
            leftLegPivot.rotation.x = Math.sin(beat) * 0.55;
            rightLegPivot.rotation.x = -Math.sin(beat) * 0.55;
            break;

          case 4: // 5. Jimin: Contemporary Grace & Smooth Turn
            figure.position.y = Math.abs(Math.sin(beat * 0.5)) * 0.16;
            figure.rotation.y = (t * 2.2) % (Math.PI * 2);
            torso.rotation.x = Math.sin(beat * 0.5) * 0.18;
            headGroup.rotation.y = Math.sin(beat * 0.5) * 0.3;
            leftArmPivot.rotation.z = 1.1 + Math.sin(beat * 0.5) * 0.5;
            rightArmPivot.rotation.x = -1.3 + Math.cos(beat * 0.5) * 0.4;
            leftLegPivot.rotation.x = Math.sin(beat * 0.5) * 0.35;
            rightLegPivot.rotation.z = -0.25 - Math.abs(Math.cos(beat * 0.5)) * 0.25;
            break;

          case 5: // 6. V: Charisma Smooth Step & Groove
            figure.position.x = Math.cos(beat * 0.5) * 0.22;
            figure.position.y = Math.abs(Math.sin(beat * 0.5)) * 0.1;
            torso.rotation.y = -Math.cos(beat * 0.5) * 0.35;
            headGroup.rotation.z = Math.sin(beat * 0.5) * 0.15;
            rightArmPivot.rotation.x = -1.35 + Math.sin(beat * 0.5) * 0.3;
            leftArmPivot.rotation.x = -0.5 + Math.cos(beat * 0.5) * 0.45;
            leftLegPivot.rotation.z = Math.max(0, Math.cos(beat * 0.5) * 0.32);
            rightLegPivot.rotation.z = Math.min(0, Math.cos(beat * 0.5) * 0.32);
            break;

          case 6: // 7. Jung Kook: Center Power Footwork & High Kick
            figure.position.y = Math.abs(Math.sin(beat)) * 0.22;
            torso.rotation.y = Math.sin(beat * 0.5) * 0.4;
            torso.rotation.x = Math.cos(beat) * 0.12;
            headGroup.rotation.x = Math.sin(beat) * 0.2;
            rightArmPivot.rotation.x = -1.5 + Math.sin(beat) * 0.55;
            leftArmPivot.rotation.x = -1.5 - Math.sin(beat) * 0.55;
            leftLegPivot.rotation.x = Math.sin(beat) * 0.65;
            rightLegPivot.rotation.x = -Math.sin(beat) * 0.65;
            break;
          default:
            break;
        }
      });

      // Animação dos Lasers e dos Círculos Vermelhos FYA no Telão
      laserBeams.forEach((b) => {
        b.mesh.rotation.z = Math.sin(t * 1.8 + b.phase) * 0.42;
        b.mesh.rotation.x = Math.cos(t * 1.3 + b.phase) * 0.25;
      });

      fyaLogoCircles.forEach((c, idx) => {
        const pulse = 1 + Math.sin(beat + idx) * 0.08;
        c.scale.set(pulse, pulse, 1);
      });

      armyBombs.rotation.y = t * 0.08;

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
      className={`bg-[#090612] text-white border border-[#581C87]/60 shadow-2xl overflow-hidden transition-all ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none flex flex-col h-screen w-screen'
          : 'relative rounded-[32px]'
      }`}
    >
      {/* Cabeçalho do Palco Performático BTS */}
      <div className="p-3.5 sm:px-6 bg-gradient-to-r from-[#3B0764] via-[#7F1D1D] to-[#1E1B4B] border-b border-white/15 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div>
          <h2 className="font-serif-romantic text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#EF4444] animate-pulse" />
            <span>Palco BTS — “FYA” Live Stage 💜</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-purple-200">
            7 Integrantes em 7 Coreografias Simultâneas • Toque em um membro para modo Fancam ✨
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setShowPlayer(!showPlayer)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#EF4444] hover:bg-[#DC2626] text-white transition cursor-pointer shadow-sm"
          >
            <Music className="w-3.5 h-3.5" />
            <span>{showPlayer ? 'Ocultar Player' : 'Abrir Música FYA'}</span>
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

      {/* Seletor de Fancam dos 7 Integrantes */}
      <div className="px-3 py-2 bg-[#130B24] border-b border-white/10 flex items-center gap-1.5 overflow-x-auto shrink-0">
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

      {/* Palco 3D + Player Oficial da Música FYA (YouTube) */}
      <div className={`relative w-full ${isFullscreen ? 'flex-1 min-h-0' : 'h-[450px] sm:h-[520px]'}`}>
        <div
          ref={mountRef}
          className="w-full h-full touch-none select-none cursor-grab active:cursor-grabbing"
        />

        {/* Card de Informação da Coreografia quando focado em um integrante */}
        {focusedMember && (
          <div className="absolute top-3 left-3 z-20 bg-black/75 backdrop-blur-md border border-[#A855F7]/50 rounded-2xl p-3 max-w-xs">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F43F5E]">
                FANCAM • {focusedMember.role}
              </span>
              <button
                onClick={() => setFocusedMember(null)}
                className="text-[11px] text-purple-300 hover:text-white underline cursor-pointer"
              >
                Ver Todos
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

      {/* Rodapé de Instruções do Show */}
      <div className="px-4 py-2.5 bg-[#090514] text-purple-200/90 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 text-[11px] shrink-0">
        <span>💜 RM • Jin • SUGA • j-hope • Jimin • V • Jung Kook</span>
        <span>🔥 Música: BTS — “FYA”</span>
        <span className="inline-flex items-center gap-1">
          <RotateCw className="w-3 h-3" /> Arraste para girar a câmera do palco
        </span>
      </div>
    </div>
  );
}
