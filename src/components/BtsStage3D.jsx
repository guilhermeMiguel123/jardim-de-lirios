import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Sparkles,
  Music,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Maximize2,
  Minimize2,
  Video,
  Flame,
  Users,
  Disc,
  SkipBack,
  SkipForward
} from 'lucide-react';

const BTS_MEMBERS = [
  { id: 'RM', name: 'RM', role: 'Leader & Main Rapper', choreoName: 'Intro: Persona & Dionysus Power Groove', suitColor: '#09090B', shirtColor: '#F8FAFC', tieColor: '#991B1B', hairColor: '#E2E8F0', micColor: '#3B82F6', pos: [-5.0, 0, -0.4] },
  { id: 'Jin', name: 'Jin', role: 'Vocalist & Visual', choreoName: 'Moon & Epiphany Smooth Glide', suitColor: '#0F172A', shirtColor: '#FFFFFF', tieColor: '#1E293B', hairColor: '#1C1917', micColor: '#EC4899', pos: [-3.3, 0, 0.4] },
  { id: 'SUGA', name: 'SUGA', role: 'Lead Rapper', choreoName: 'Haegeum & Mic Drop Swag Stride', suitColor: '#1E293B', shirtColor: '#0F172A', tieColor: '#DC2626', hairColor: '#09090B', micColor: '#52525B', pos: [-1.6, 0, -0.4] },
  { id: 'jhope', name: 'j-hope', role: 'Main Dancer', choreoName: 'ON Dance Break & High-Energy Pop', suitColor: '#1F0B13', shirtColor: '#FFFFFF', tieColor: '#7F1D1D', hairColor: '#451A03', micColor: '#EF4444', pos: [0, 0, -0.8] },
  { id: 'Jimin', name: 'Jimin', role: 'Main Dancer & Vocal', choreoName: 'Black Swan Contemporary Flow', suitColor: '#334155', shirtColor: '#FFFFFF', tieColor: '#1E293B', hairColor: '#FACC15', micColor: '#F59E0B', pos: [1.6, 0, -0.4] },
  { id: 'V', name: 'V', role: 'Vocalist & Visual', choreoName: 'Singularity Jazz Vibe & Gaze', suitColor: '#181022', shirtColor: '#FFFBEB', tieColor: '#881337', hairColor: '#111827', micColor: '#10B981', pos: [3.3, 0, 0.4] },
  { id: 'JungKook', name: 'Jung Kook', role: 'Main Vocal & Center', choreoName: 'Standing Next to You Power Footwork', suitColor: '#05070E', shirtColor: '#FFFFFF', tieColor: '#111827', hairColor: '#1C1917', micColor: '#9333EA', pos: [5.0, 0, 0.4] },
];

export default function BtsStage3D() {
  const wrapperRef = useRef(null);
  const mountRef = useRef(null);

  const [focusedMember, setFocusedMember] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(true);
  const [cameraMode, setCameraMode] = useState('director');
  const [audioTime, setAudioTime] = useState(0);

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
        try { await wrapperRef.current.requestFullscreen(); } catch {}
      }
    } else {
      setIsFullscreen(false);
      if (document.fullscreenElement && document.exitFullscreen) {
        try { await document.exitFullscreen(); } catch {}
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
    scene.background = new THREE.Color('#010003');
    scene.fog = new THREE.FogExp2('#010003', 0.012);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 200);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Iluminação Profissional de Show de Estádio (Múltiplas cores dinâmicas)
    const ambientLight = new THREE.AmbientLight('#E9D5FF', 1.1);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight('#FFFFFF', 2.5);
    keyLight.position.set(5, 16, 12);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight('#C084FC', 2.0);
    rimLight.position.set(0, 10, -12);
    scene.add(rimLight);

    // Refletores coloridos dinâmicos (Vermelho FYA, Roxo Borahae, Azul Ciano, Dourado)
    const spotRed = new THREE.PointLight('#EF4444', 6.0, 35);
    spotRed.position.set(-8, 5, 4);
    scene.add(spotRed);

    const spotPurple = new THREE.PointLight('#A855F7', 6.0, 35);
    spotPurple.position.set(8, 5, 4);
    scene.add(spotPurple);

    const spotCyan = new THREE.PointLight('#38BDF8', 5.0, 35);
    spotCyan.position.set(0, 6, -3);
    scene.add(spotCyan);

    // Palco Principal de Vidro Espelhado
    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    const stageFloor = new THREE.Mesh(
      new THREE.CylinderGeometry(9.5, 10.2, 0.75, 64),
      new THREE.MeshPhysicalMaterial({
        color: '#05070E',
        roughness: 0.05,
        metalness: 0.9,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
      })
    );
    stageFloor.position.y = -0.375;
    stageFloor.receiveShadow = true;
    stageGroup.add(stageFloor);

    // Anéis de LED RGB no Palco
    const ledOuter = new THREE.Mesh(
      new THREE.TorusGeometry(9.1, 0.065, 16, 100),
      new THREE.MeshStandardMaterial({ color: '#EF4444', emissive: '#EF4444', emissiveIntensity: 2.5 })
    );
    ledOuter.rotation.x = Math.PI / 2;
    ledOuter.position.y = 0.01;
    stageGroup.add(ledOuter);

    const ledInner = new THREE.Mesh(
      new THREE.TorusGeometry(7.0, 0.055, 16, 100),
      new THREE.MeshStandardMaterial({ color: '#A855F7', emissive: '#9333EA', emissiveIntensity: 2.2 })
    );
    ledInner.rotation.x = Math.PI / 2;
    ledInner.position.y = 0.015;
    stageGroup.add(ledInner);

    // Telão de Fundo com o Símbolo Oficial do Álbum "FYA"
    const bigBackdrop = new THREE.Mesh(
      new THREE.BoxGeometry(17.0, 7.2, 0.3),
      new THREE.MeshStandardMaterial({ color: '#020408', roughness: 0.2, metalness: 0.7 })
    );
    bigBackdrop.position.set(0, 3.6, -5.2);
    stageGroup.add(bigBackdrop);

    // Círculos e Símbolos em relevo 3D do Álbum "FYA"
    const fyaSymbols = [];
    [-3.2, 0, 3.2].forEach((cx, idx) => {
      const groupSym = new THREE.Group();
      groupSym.position.set(cx, 3.6, -4.95);

      const redRing = new THREE.Mesh(
        new THREE.RingGeometry(0.75, 1.1, 32),
        new THREE.MeshStandardMaterial({ color: '#DC2626', emissive: '#EF4444', emissiveIntensity: 1.8, side: THREE.DoubleSide })
      );
      groupSym.add(redRing);

      const coreDisc = new THREE.Mesh(
        new THREE.CircleGeometry(0.72, 32),
        new THREE.MeshStandardMaterial({ color: '#7F1D1D', emissive: '#DC2626', emissiveIntensity: 1.2 })
      );
      groupSym.add(coreDisc);

      if (idx === 0) {
        const innerHole = new THREE.Mesh(
          new THREE.CircleGeometry(0.28, 24),
          new THREE.MeshBasicMaterial({ color: '#020408' })
        );
        innerHole.position.z = 0.02;
        groupSym.add(innerHole);
      } else {
        [-0.28, 0, 0.28].forEach((by) => {
          const bar = new THREE.Mesh(
            new THREE.PlaneGeometry(1.3, 0.14),
            new THREE.MeshBasicMaterial({ color: '#020408' })
          );
          bar.position.set(0, by, 0.02);
          groupSym.add(bar);
        });
      }

      stageGroup.add(groupSym);
      fyaSymbols.push(groupSym);
    });

    // --- PLATEIA DE ESTÁDIO COM PERSONAGENS LOW POLY PULANDO E ARMY BOMBS BRILHANDO ---
    const crowdGroup = new THREE.Group();
    scene.add(crowdGroup);

    const fanCount = 1800;
    const fanPositions = new Float32Array(fanCount * 3);
    const fanColors = new Float32Array(fanCount * 3);
    const fanPhases = new Float32Array(fanCount);

    for (let i = 0; i < fanCount; i++) {
      const angle = (i / fanCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.08;
      const radius = 12.0 + Math.random() * 10.0;
      const tier = Math.floor(i / 450); // 4 andares de arquibancada

      fanPositions[i * 3] = Math.cos(angle) * radius;
      fanPositions[i * 3 + 1] = -0.4 + tier * 1.7 + Math.random() * 0.3;
      fanPositions[i * 3 + 2] = Math.sin(angle) * radius - 2.5;

      fanPhases[i] = Math.random() * Math.PI * 2;

      // Cores das ARMY Bombs (Roxo Borahae, Azul Ciano, Rosa Magenta)
      const rnd = Math.random();
      if (rnd > 0.4) {
        fanColors[i * 3] = 0.7; fanColors[i * 3 + 1] = 0.2; fanColors[i * 3 + 2] = 0.95;
      } else if (rnd > 0.2) {
        fanColors[i * 3] = 0.2; fanColors[i * 3 + 1] = 0.8; fanColors[i * 3 + 2] = 0.95;
      } else {
        fanColors[i * 3] = 0.95; fanColors[i * 3 + 1] = 0.2; fanColors[i * 3 + 2] = 0.6;
      }
    }

    const fanGeo = new THREE.BufferGeometry();
    fanGeo.setAttribute('position', new THREE.BufferAttribute(fanPositions, 3));
    fanGeo.setAttribute('color', new THREE.BufferAttribute(fanColors, 3));

    const fanMat = new THREE.PointsMaterial({
      size: 0.32,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
    });
    const stadiumFans = new THREE.Points(fanGeo, fanMat);
    crowdGroup.add(stadiumFans);

    // Canhões de Laser Volumétricos
    const stageLasers = [];
    [-7.5, -3.8, 0, 3.8, 7.5].forEach((lx, i) => {
      const lMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? '#C084FC' : '#F87171',
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const lMesh = new THREE.Mesh(new THREE.ConeGeometry(0.9, 16, 16, 1, true), lMat);
      lMesh.position.set(lx, 6.2, -4.2);
      scene.add(lMesh);
      stageLasers.push({ mesh: lMesh, phase: i * 0.6 });
    });

    const dancerRigs = [];
    const clickableMeshes = [];

    const skinMat = new THREE.MeshPhysicalMaterial({ color: '#FFEDE1', roughness: 0.38, clearcoat: 0.4 });
    const eyeMat = new THREE.MeshBasicMaterial({ color: '#18181B' });
    const lipMat = new THREE.MeshBasicMaterial({ color: '#E15B64' });
    const shoeMat = new THREE.MeshStandardMaterial({ color: '#09090B', roughness: 0.2 });

    // CONSTRUÇÃO DOS 7 INTEGRANTES DETALHADOS EM 3D
    BTS_MEMBERS.forEach((m, index) => {
      const root = new THREE.Group();
      root.position.set(m.pos[0], m.pos[1], m.pos[2]);

      const spot = new THREE.Mesh(
        new THREE.CircleGeometry(0.82, 32),
        new THREE.MeshBasicMaterial({ color: m.micColor, transparent: true, opacity: 0.38, side: THREE.DoubleSide })
      );
      spot.rotation.x = -Math.PI / 2;
      spot.position.y = 0.02;
      root.add(spot);

      const suitMat = new THREE.MeshPhysicalMaterial({ color: m.suitColor, roughness: 0.35, metalness: 0.25, clearcoat: 0.6 });
      const shirtMat = new THREE.MeshStandardMaterial({ color: m.shirtColor, roughness: 0.3 });
      const tieMat = new THREE.MeshStandardMaterial({ color: m.tieColor, roughness: 0.3 });
      const hairMat = new THREE.MeshStandardMaterial({ color: m.hairColor, roughness: 0.35 });

      const bodyGroup = new THREE.Group();
      root.add(bodyGroup);

      const pelvis = new THREE.Group();
      pelvis.position.y = 0.94;
      bodyGroup.add(pelvis);

      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.19, 0.58, 16), suitMat);
      torso.position.y = 0.29;
      torso.castShadow = true;
      torso.userData = { memberId: m.id };
      clickableMeshes.push(torso);
      pelvis.add(torso);

      const shirt = new THREE.Mesh(new THREE.PlaneGeometry(0.19, 0.38), shirtMat);
      shirt.position.set(0, 0.29, 0.14);
      pelvis.add(shirt);

      const tie = new THREE.Mesh(new THREE.PlaneGeometry(0.065, 0.3), tieMat);
      tie.position.set(0, 0.27, 0.145);
      pelvis.add(tie);

      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.075, 0.16, 12), skinMat);
      neck.position.set(0, 0.63, 0);
      pelvis.add(neck);

      const headGroup = new THREE.Group();
      headGroup.position.set(0, 0.8, 0);
      pelvis.add(headGroup);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.225, 24, 24), skinMat);
      head.castShadow = true;
      head.userData = { memberId: m.id };
      clickableMeshes.push(head);
      headGroup.add(head);

      [-0.072, 0.072].forEach((ox) => {
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.025, 12, 12), eyeMat);
        eye.position.set(ox, 0.03, 0.195);
        headGroup.add(eye);
      });

      const mouth = new THREE.Mesh(new THREE.PlaneGeometry(0.052, 0.015), lipMat);
      mouth.position.set(0, -0.07, 0.21);
      headGroup.add(mouth);

      const hair = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.65), hairMat);
      hair.position.set(0, 0.04, -0.02);
      hair.scale.set(1.03, 1.12, 1.06);
      headGroup.add(hair);

      const createArm = (isRight) => {
        const side = isRight ? 1 : -1;
        const shoulder = new THREE.Group();
        shoulder.position.set(side * 0.29, 0.54, 0);
        pelvis.add(shoulder);

        const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.052, 0.52, 12), suitMat);
        upperArm.position.y = -0.26;
        upperArm.castShadow = true;
        shoulder.add(upperArm);

        if (isRight) {
          const mic = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.018, 0.15, 8, 8),
            new THREE.MeshStandardMaterial({ color: m.micColor, emissive: m.micColor, emissiveIntensity: 0.9, metalness: 0.7 })
          );
          mic.position.set(0, -0.54, 0.08);
          mic.rotation.x = Math.PI / 2;
          shoulder.add(mic);
        }
        return shoulder;
      };

      const leftArm = createArm(false);
      const rightArm = createArm(true);

      const createLeg = (isRight) => {
        const side = isRight ? 1 : -1;
        const hip = new THREE.Group();
        hip.position.set(side * 0.12, 0, 0);
        pelvis.add(hip);

        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.07, 0.92, 12), suitMat);
        leg.position.y = -0.46;
        leg.castShadow = true;
        hip.add(leg);

        const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.125, 0.08, 0.25), shoeMat);
        shoe.position.set(0, -0.94, 0.04);
        hip.add(shoe);

        return hip;
      };

      const leftLeg = createLeg(false);
      const rightLeg = createLeg(true);

      scene.add(root);

      dancerRigs.push({
        index,
        pelvis,
        torso,
        headGroup,
        leftArm,
        rightArm,
        leftLeg,
        rightLeg,
        spot,
      });
    });

    let isDragging = false;
    let prevPos = { x: 0, y: 0 };
    let pointerDownPos = { x: 0, y: 0 };
    let spherical = { theta: 0, phi: 1.28, radius: 11.5 };

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
        spherical.phi = Math.max(0.6, Math.min(1.45, spherical.phi - dy * 0.006));
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
      spherical.radius = Math.max(4.0, Math.min(18, spherical.radius + e.deltaY * 0.01));
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    domElem.addEventListener('wheel', onWheel, { passive: false });

    // LOOP DE ANIMAÇÃO COM COREOGRAFIA AVANÇADA E PLATEIA PULANDO
    let animFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const beat = t * 7.0;

      // Atualiza o tempo estimado para a barra de progresso do player
      setAudioTime(t);

      const activeFocus = focusedMemberRef.current;
      if (activeFocus) {
        const tx = activeFocus.pos[0];
        const tz = activeFocus.pos[2];
        camera.position.lerp(new THREE.Vector3(tx, 1.6, tz + 3.1), 0.08);
        camera.lookAt(tx, 1.38, tz);
      } else if (cameraModeRef.current === 'director') {
        const panX = Math.sin(t * 0.3) * 3.5;
        const panZ = 10.2 + Math.cos(t * 0.45) * 1.5;
        camera.position.lerp(new THREE.Vector3(panX, 1.9, panZ), 0.05);
        camera.lookAt(0, 1.35, 0);
      } else {
        const cx = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
        const cy = spherical.radius * Math.cos(spherical.phi);
        const cz = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
        camera.position.lerp(new THREE.Vector3(cx, cy, cz), 0.1);
        camera.lookAt(0, 1.35, 0);
      }

      dancerRigs.forEach((rig) => {
        const { index, pelvis, torso, headGroup, leftArm, rightArm, leftLeg, rightLeg, spot } = rig;

        spot.scale.setScalar(1 + Math.sin(beat + index) * 0.12);

        const energy = Math.abs(Math.sin(beat * 0.5 + index * 0.4));
        pelvis.position.y = 0.92 - energy * 0.1;
        torso.rotation.y = Math.sin(beat * 0.5 + index * 0.5) * 0.4;
        torso.rotation.x = 0.08 + energy * 0.1;
        headGroup.rotation.y = -torso.rotation.y * 0.75;
        headGroup.rotation.x = Math.sin(beat + index) * 0.14;

        rightArm.rotation.x = -1.3 + Math.sin(beat + index) * 0.7;
        leftArm.rotation.x = -1.1 - Math.cos(beat + index) * 0.6;

        leftLeg.rotation.x = Math.sin(beat * 0.5 + index) * 0.45;
        rightLeg.rotation.x = -Math.sin(beat * 0.5 + index) * 0.45;
      });

      // Animação da Plateia Low Poly Pulando e ARMY Bombs piscando
      const posArr = fanGeo.attributes.position.array;
      const colArr = fanGeo.attributes.color.array;

      for (let i = 0; i < fanCount; i++) {
        const phase = fanPhases[i];
        // Cada fã pula em alturas levemente desalinhadas na batida da música
        posArr[i * 3 + 1] = (-0.4 + Math.floor(i / 450) * 1.7) + Math.abs(Math.sin(t * 6 + phase)) * 0.35;

        // Pisca as luzes das ARMY Bombs na plateia
        const flash = 0.5 + Math.sin(t * 8 + phase) * 0.5;
        colArr[i * 3] = flash * 0.8;
        colArr[i * 3 + 1] = flash * 0.3;
        colArr[i * 3 + 2] = flash * 0.95;
      }
      fanGeo.attributes.position.needsUpdate = true;
      fanGeo.attributes.color.needsUpdate = true;

      stageLasers.forEach((l) => {
        l.mesh.rotation.z = Math.sin(t * 1.8 + l.phase) * 0.45;
      });

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

  // Funções de Controle do Player de Música
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSkipBack = () => {
    setAudioTime((prev) => Math.max(0, prev - 10));
  };

  const handleSkipForward = () => {
    setAudioTime((prev) => prev + 10);
  };

  return (
    <div
      ref={wrapperRef}
      className={`bg-[#06030C] text-white border border-[#6B21A8]/60 shadow-2xl overflow-hidden transition-all ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none flex flex-col h-screen w-screen'
          : 'relative rounded-[32px]'
      }`}
    >
      <div className="p-3.5 sm:px-6 bg-gradient-to-r from-[#2E1065] via-[#7F1D1D] to-[#1E1B4B] border-b border-white/15 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div>
          <h2 className="font-serif-romantic text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#EF4444] animate-pulse" />
            <span>BTS — “FYA” Stadium Tour Stage 💜</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-purple-200">
            Gráficos Ultra HD • Plateia Low Poly Pulando • Iluminação Dinâmica ✨
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

      <div className={`relative w-full ${isFullscreen ? 'flex-1 min-h-0' : 'h-[470px] sm:h-[540px]'}`}>
        <div
          ref={mountRef}
          className="w-full h-full touch-none select-none cursor-grab active:cursor-grabbing"
        />

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

        {/* WIDGET DE MÚSICA PROFISSIONAL COM CONTROLES COMPLETOS (VOLTAR, REPETIR, AVANÇAR) */}
        <div className="absolute bottom-3 right-3 z-20 bg-black/90 backdrop-blur-xl border border-white/15 rounded-2xl p-3.5 shadow-2xl w-76 sm:w-84">
          <div className="flex items-center gap-3 mb-2.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#7F1D1D] to-[#9333EA] flex items-center justify-center shrink-0 shadow-md">
              <Disc className={`w-7 h-7 text-white ${isPlayingMusic ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">BTS — “FYA”</p>
              <p className="text-[11px] text-purple-300 truncate">World Tour Live Audio</p>
            </div>
          </div>

          {/* Barra de Tempo e Progresso */}
          <div className="space-y-1 mb-2.5">
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer">
              <div
                className="h-full bg-gradient-to-r from-[#EF4444] to-[#A855F7] rounded-full transition-all duration-300"
                style={{ width: `${(audioTime % 181) / 1.81}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-purple-300">
              <span>{formatTime(audioTime % 181)}</span>
              <span>3:01</span>
            </div>
          </div>

          {/* Botões de Controle do Player */}
          <div className="flex items-center justify-center gap-3 pt-1 border-t border-white/10">
            <button
              onClick={handleSkipBack}
              title="Voltar 10s"
              className="p-1.5 rounded-full hover:bg-white/10 text-purple-200 transition cursor-pointer"
            >
              <SkipBack className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={() => setIsPlayingMusic(!isPlayingMusic)}
              className="w-9 h-9 rounded-full bg-white hover:bg-purple-100 text-[#090D16] flex items-center justify-center shadow-lg transition transform hover:scale-105 cursor-pointer"
            >
              {isPlayingMusic ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            <button
              onClick={handleSkipForward}
              title="Avançar 10s"
              className="p-1.5 rounded-full hover:bg-white/10 text-purple-200 transition cursor-pointer"
            >
              <SkipForward className="w-4 h-4 fill-current" />
            </button>
          </div>

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

      <div className="px-4 py-2.5 bg-[#080411] text-purple-200/90 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 text-[11px] shrink-0">
        <span>💜 1.800 fãs na plateia low poly pulando com ARMY Bombs • Símbolo FYA no telão</span>
        <span className="inline-flex items-center gap-1">
          <RotateCw className="w-3 h-3" /> Arraste para girar a câmera
        </span>
      </div>
    </div>
  );
}
