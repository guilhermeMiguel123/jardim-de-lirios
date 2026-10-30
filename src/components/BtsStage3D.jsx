import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Sparkles,
  Music,
  RotateCw,
  Maximize2,
  Minimize2,
  Video,
  Flame,
  Users
} from 'lucide-react';

const BTS_MEMBERS = [
  { id: 'RM', name: 'RM', role: 'Leader & Main Rapper', choreoName: 'Intro: Persona & Dionysus Stadium Anthem', suitColor: '#09090B', shirtColor: '#F8FAFC', tieColor: '#991B1B', hairColor: '#E2E8F0', micColor: '#3B82F6', pos: [-3.8, 0, -0.3] },
  { id: 'Jin', name: 'Jin', role: 'Vocalist & Visual', choreoName: 'Moon & Epiphany Global Icon Flow', suitColor: '#0F172A', shirtColor: '#FFFFFF', tieColor: '#1E293B', hairColor: '#1C1917', micColor: '#EC4899', pos: [-2.5, 0, 0.2] },
  { id: 'SUGA', name: 'SUGA', role: 'Lead Rapper & Producer', choreoName: 'Haegeum & Mic Drop Swag Masterclass', suitColor: '#1E293B', shirtColor: '#0F172A', tieColor: '#DC2626', hairColor: '#09090B', micColor: '#52525B', pos: [-1.2, 0, -0.3] },
  { id: 'jhope', name: 'j-hope', role: 'Main Dancer & Rapper', choreoName: 'ON Dance Break & High-Voltage Popping', suitColor: '#1F0B13', shirtColor: '#FFFFFF', tieColor: '#7F1D1D', hairColor: '#451A03', micColor: '#EF4444', pos: [0, 0, -0.6] },
  { id: 'Jimin', name: 'Jimin', role: 'Main Dancer & Vocal', choreoName: 'Black Swan Contemporary Mastery', suitColor: '#334155', shirtColor: '#FFFFFF', tieColor: '#1E293B', hairColor: '#FACC15', micColor: '#F59E0B', pos: [1.2, 0, -0.3] },
  { id: 'V', name: 'V', role: 'Vocalist & Visual', choreoName: 'Singularity Jazz Groove & Charisma', suitColor: '#181022', shirtColor: '#FFFBEB', tieColor: '#881337', hairColor: '#111827', micColor: '#10B981', pos: [2.5, 0, 0.2] },
  { id: 'JungKook', name: 'Jung Kook', role: 'Main Vocal & Center', choreoName: 'Standing Next to You Center Power Stride', suitColor: '#05070E', shirtColor: '#FFFFFF', tieColor: '#111827', hairColor: '#1C1917', micColor: '#9333EA', pos: [3.8, 0, -0.3] },
];

export default function BtsStage3D() {
  const wrapperRef = useRef(null);
  const mountRef = useRef(null);

  const [focusedMember, setFocusedMember] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(true);
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
    scene.fog = new THREE.FogExp2('#010003', 0.01);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 200);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Iluminação Cinematográfica de Estádio Real
    const ambientLight = new THREE.AmbientLight('#F3E8FF', 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight('#FFFFFF', 3.2);
    keyLight.position.set(4, 15, 10);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight('#D8B4FE', 2.5);
    rimLight.position.set(0, 10, -10);
    scene.add(rimLight);

    const spotRed = new THREE.PointLight('#EF4444', 8.0, 30);
    spotRed.position.set(-6, 5, 3);
    scene.add(spotRed);

    const spotPurple = new THREE.PointLight('#A855F7', 8.0, 30);
    spotPurple.position.set(6, 5, 3);
    scene.add(spotPurple);

    // Palco Principal Espelhado de Luxo
    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    const stageFloor = new THREE.Mesh(
      new THREE.CylinderGeometry(7.5, 8.2, 0.7, 64),
      new THREE.MeshPhysicalMaterial({
        color: '#03050B',
        roughness: 0.02,
        metalness: 0.98,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
      })
    );
    stageFloor.position.y = -0.35;
    stageFloor.receiveShadow = true;
    stageGroup.add(stageFloor);

    // Anéis de LED super brilhantes
    const ledOuter = new THREE.Mesh(
      new THREE.TorusGeometry(7.2, 0.06, 16, 100),
      new THREE.MeshStandardMaterial({ color: '#EF4444', emissive: '#EF4444', emissiveIntensity: 3.0 })
    );
    ledOuter.rotation.x = Math.PI / 2;
    ledOuter.position.y = 0.01;
    stageGroup.add(ledOuter);

    const ledInner = new THREE.Mesh(
      new THREE.TorusGeometry(5.2, 0.05, 16, 100),
      new THREE.MeshStandardMaterial({ color: '#A855F7', emissive: '#9333EA', emissiveIntensity: 2.8 })
    );
    ledInner.rotation.x = Math.PI / 2;
    ledInner.position.y = 0.015;
    stageGroup.add(ledInner);

    // Telão de Fundo de Alta Definição com os Símbolos "FYA"
    const bigBackdrop = new THREE.Mesh(
      new THREE.BoxGeometry(14.0, 6.2, 0.3),
      new THREE.MeshStandardMaterial({ color: '#010205', roughness: 0.1, metalness: 0.85 })
    );
    bigBackdrop.position.set(0, 3.1, -4.5);
    stageGroup.add(bigBackdrop);

    [-2.8, 0, 2.8].forEach((cx) => {
      const redDisc = new THREE.Mesh(
        new THREE.CircleGeometry(1.0, 48),
        new THREE.MeshStandardMaterial({ color: '#DC2626', emissive: '#EF4444', emissiveIntensity: 2.2 })
      );
      redDisc.position.set(cx, 3.1, -4.3);
      stageGroup.add(redDisc);
    });

    // --- PLATEIA DE ESTÁDIO IMERSIVA (BONEQUINHOS LOW POLY PULANDO COM ARMY BOMBS) ---
    const crowdGroup = new THREE.Group();
    scene.add(crowdGroup);

    const fanMeshGroups = [];
    const fanBodyMat = new THREE.MeshStandardMaterial({ color: '#0F172A', roughness: 0.7 });
    const fanHeadMat = new THREE.MeshStandardMaterial({ color: '#FFEDE1', roughness: 0.4 });
    const fanStickMat = new THREE.MeshStandardMaterial({ color: '#FFFFFF', emissive: '#C084FC', emissiveIntensity: 1.5 });

    for (let i = 0; i < 90; i++) {
      const angle = (i / 90) * Math.PI * 2 + (Math.random() - 0.5) * 0.06;
      const radius = 9.2 + (i % 3) * 1.8;
      const tier = Math.floor(i / 30);

      const fanContainer = new THREE.Group();
      fanContainer.position.set(
        Math.cos(angle) * radius,
        -0.3 + tier * 1.3,
        Math.sin(angle) * radius - 1.5
      );

      const body = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.55, 0.18), fanBodyMat);
      body.position.y = 0.28;
      fanContainer.add(body);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), fanHeadMat);
      head.position.y = 0.68;
      fanContainer.add(head);

      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.3, 6), fanHeadMat);
      arm.position.set(0.2, 0.42, 0);
      arm.rotation.z = -Math.PI / 3;
      fanContainer.add(arm);

      const lightStick = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), fanStickMat);
      lightStick.position.set(0.32, 0.58, 0);
      fanContainer.add(lightStick);

      crowdGroup.add(fanContainer);
      fanMeshGroups.push({
        group: fanContainer,
        baseY: fanContainer.position.y,
        speed: 7.0 + Math.random() * 3.0,
      });
    }

    const stageLasers = [];
    [-6.0, -3.0, 0, 3.0, 6.0].forEach((lx, i) => {
      const lMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? '#C084FC' : '#F87171',
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const lMesh = new THREE.Mesh(new THREE.ConeGeometry(0.85, 14, 16, 1, true), lMat);
      lMesh.position.set(lx, 5.5, -3.8);
      scene.add(lMesh);
      stageLasers.push({ mesh: lMesh, phase: i * 0.5 });
    });

    const dancerRigs = [];
    const clickableMeshes = [];

    const skinMat = new THREE.MeshPhysicalMaterial({ color: '#FFEDE1', roughness: 0.28, clearcoat: 0.6 });
    const eyeMat = new THREE.MeshBasicMaterial({ color: '#18181B' });
    const lipMat = new THREE.MeshBasicMaterial({ color: '#E15B64' });
    const shoeMat = new THREE.MeshStandardMaterial({ color: '#050507', roughness: 0.15 });

    // CONSTRUÇÃO DOS 7 INTEGRANTES COM ALTA DEFINIÇÃO E PROPORÇÕES DE PALCO REAL
    BTS_MEMBERS.forEach((m) => {
      const root = new THREE.Group();
      root.position.set(m.pos[0], m.pos[1], m.pos[2]);

      const spot = new THREE.Mesh(
        new THREE.CircleGeometry(0.75, 32),
        new THREE.MeshBasicMaterial({ color: m.micColor, transparent: true, opacity: 0.45, side: THREE.DoubleSide })
      );
      spot.rotation.x = -Math.PI / 2;
      spot.position.y = 0.02;
      root.add(spot);

      const suitMat = new THREE.MeshPhysicalMaterial({ color: m.suitColor, roughness: 0.2, metalness: 0.4, clearcoat: 0.9 });
      const shirtMat = new THREE.MeshStandardMaterial({ color: m.shirtColor, roughness: 0.2 });
      const tieMat = new THREE.MeshStandardMaterial({ color: m.tieColor, roughness: 0.2 });
      const hairMat = new THREE.MeshStandardMaterial({ color: m.hairColor, roughness: 0.25 });

      const bodyGroup = new THREE.Group();
      root.add(bodyGroup);

      const pelvis = new THREE.Group();
      pelvis.position.y = 0.92;
      bodyGroup.add(pelvis);

      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.18, 0.56, 16), suitMat);
      torso.position.y = 0.28;
      torso.castShadow = true;
      torso.userData = { memberId: m.id };
      clickableMeshes.push(torso);
      pelvis.add(torso);

      const shirt = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.36), shirtMat);
      shirt.position.set(0, 0.28, 0.135);
      pelvis.add(shirt);

      const tie = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 0.28), tieMat);
      tie.position.set(0, 0.26, 0.14);
      pelvis.add(tie);

      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.072, 0.15, 12), skinMat);
      neck.position.set(0, 0.61, 0);
      pelvis.add(neck);

      const headGroup = new THREE.Group();
      headGroup.position.set(0, 0.77, 0);
      pelvis.add(headGroup);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.215, 24, 24), skinMat);
      head.castShadow = true;
      head.userData = { memberId: m.id };
      clickableMeshes.push(head);
      headGroup.add(head);

      [-0.068, 0.068].forEach((ox) => {
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.023, 12, 12), eyeMat);
        eye.position.set(ox, 0.03, 0.185);
        headGroup.add(eye);
      });

      const mouth = new THREE.Mesh(new THREE.PlaneGeometry(0.048, 0.014), lipMat);
      mouth.position.set(0, -0.065, 0.2);
      headGroup.add(mouth);

      const hair = new THREE.Mesh(new THREE.SphereGeometry(0.23, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.65), hairMat);
      hair.position.set(0, 0.04, -0.02);
      hair.scale.set(1.03, 1.12, 1.06);
      headGroup.add(hair);

      const createArm = (isRight) => {
        const side = isRight ? 1 : -1;
        const shoulder = new THREE.Group();
        shoulder.position.set(side * 0.28, 0.52, 0);
        pelvis.add(shoulder);

        const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.048, 0.5, 12), suitMat);
        upperArm.position.y = -0.25;
        upperArm.castShadow = true;
        shoulder.add(upperArm);

        if (isRight) {
          const mic = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.016, 0.14, 8, 8),
            new THREE.MeshStandardMaterial({ color: m.micColor, emissive: m.micColor, emissiveIntensity: 1.5, metalness: 0.9 })
          );
          mic.position.set(0, -0.52, 0.08);
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
        hip.position.set(side * 0.11, 0, 0);
        pelvis.add(hip);

        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.065, 0.88, 12), suitMat);
        leg.position.y = -0.44;
        leg.castShadow = true;
        hip.add(leg);

        const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.115, 0.075, 0.24), shoeMat);
        shoe.position.set(0, -0.9, 0.04);
        hip.add(shoe);

        return hip;
      };

      const leftLeg = createLeg(false);
      const rightLeg = createLeg(true);

      scene.add(root);

      dancerRigs.push({
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
    let spherical = { theta: 0, phi: 1.25, radius: 9.2 }; // Câmera mais próxima e cinematográfica

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
        spherical.phi = Math.max(0.6, Math.min(1.42, spherical.phi - dy * 0.006));
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
      spherical.radius = Math.max(3.5, Math.min(15, spherical.radius + e.deltaY * 0.01));
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    domElem.addEventListener('wheel', onWheel, { passive: false });

    // LOOP DE ANIMAÇÃO
    let animFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const beat = t * 7.5;

      const activeFocus = focusedMemberRef.current;
      if (activeFocus) {
        const tx = activeFocus.pos[0];
        const tz = activeFocus.pos[2];
        camera.position.lerp(new THREE.Vector3(tx, 1.5, tz + 2.7), 0.08);
        camera.lookAt(tx, 1.32, tz);
      } else if (cameraModeRef.current === 'director') {
        const panX = Math.sin(t * 0.3) * 2.5;
        const panZ = 8.5 + Math.cos(t * 0.4) * 1.2;
        camera.position.lerp(new THREE.Vector3(panX, 1.7, panZ), 0.05);
        camera.lookAt(0, 1.25, 0);
      } else {
        const cx = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
        const cy = spherical.radius * Math.cos(spherical.phi);
        const cz = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
        camera.position.lerp(new THREE.Vector3(cx, cy, cz), 0.1);
        camera.lookAt(0, 1.25, 0);
      }

      dancerRigs.forEach((rig, index) => {
        const { pelvis, torso, headGroup, leftArm, rightArm, leftLeg, rightLeg, spot } = rig;

        spot.scale.setScalar(1 + Math.sin(beat + index) * 0.12);

        const energy = Math.abs(Math.sin(beat * 0.5 + index * 0.4));
        pelvis.position.y = 0.9 - energy * 0.12;
        torso.rotation.y = Math.sin(beat * 0.5 + index * 0.5) * 0.45;
        torso.rotation.x = 0.08 + energy * 0.1;
        headGroup.rotation.y = -torso.rotation.y * 0.75;
        headGroup.rotation.x = Math.sin(beat + index) * 0.14;

        rightArm.rotation.x = -1.35 + Math.sin(beat + index) * 0.8;
        leftArm.rotation.x = -1.15 - Math.cos(beat + index) * 0.7;

        leftLeg.rotation.x = Math.sin(beat * 0.5 + index) * 0.48;
        rightLeg.rotation.x = -Math.sin(beat * 0.5 + index) * 0.48;
      });

      fanMeshGroups.forEach((fan, idx) => {
        fan.group.position.y = (-0.3 + Math.floor(idx / 30) * 1.3) + Math.abs(Math.sin(t * fan.speed)) * 0.35;
      });

      stageLasers.forEach((l) => {
        l.mesh.rotation.z = Math.sin(t * 1.8 + l.phase) * 0.55;
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
            Enquadramento Cinematográfico • Integrantes em Primeira Fila • Vídeo Real do YouTube ✨
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
            onClick={() => setShowVideoPlayer(!showVideoPlayer)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#EF4444] hover:bg-[#DC2626] text-white transition cursor-pointer shadow-sm"
          >
            <Music className="w-3.5 h-3.5" />
            <span>{showVideoPlayer ? 'Ocultar Vídeo' : 'Ver Vídeo YouTube'}</span>
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
            <Video className="w-3.5 h-3.5" />
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
          </div>
        )}

        {/* PLAYER DE VÍDEO REAL DO YOUTUBE (FÁCIL DE PULAR ANÚNCIOS) */}
        {showVideoPlayer && (
          <div className="absolute bottom-3 right-3 z-20 bg-black/90 backdrop-blur-xl border border-white/15 rounded-2xl p-2 shadow-2xl w-72 sm:w-80">
            <div className="flex items-center justify-between px-1 pb-1.5 text-[11px] text-purple-200">
              <span className="font-semibold text-white flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#EF4444]" /> BTS — “FYA” (YouTube Oficial)
              </span>
              <span className="text-[10px] text-purple-300">Pule anúncios direto no vídeo ⏭️</span>
            </div>
            <div className="rounded-xl overflow-hidden aspect-video bg-black shadow-inner">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/QWDayFgPDjQ?autoplay=1"
                title="BTS - FYA"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-2.5 bg-[#080411] text-purple-200/90 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 text-[11px] shrink-0">
        <span>💜 Enquadramento de primeira fila • Vídeo oficial do YouTube acoplado</span>
        <span className="inline-flex items-center gap-1">
          <RotateCw className="w-3 h-3" /> Arraste para girar a câmera
        </span>
      </div>
    </div>
  );
}
