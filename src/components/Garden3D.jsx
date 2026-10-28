import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Sparkles,
  Heart,
  BookOpen,
  X,
  RotateCw,
  Flower2,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Gift
} from 'lucide-react';
import { QUOTES } from '../data/quotes';

export default function Garden3D({ seenIds = [], favorites = [], onToggleFavorite, onOpenInMainCard }) {
  const wrapperRef = useRef(null);
  const mountRef = useRef(null);

  const [selectedQuote, setSelectedQuote] = useState(null);
  const [hoveredInfo, setHoveredInfo] = useState(null);
  const [showChristmasTreeModal, setShowChristmasTreeModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  const audioCtxRef = useRef(null);
  const musicTimeoutRef = useRef(null);

  // --- CAIXINHA DE MÚSICA DE NATAL (Noite Feliz + Jingle Bells em Web Audio API) ---
  const stopMusic = () => {
    if (musicTimeoutRef.current) clearTimeout(musicTimeoutRef.current);
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {}
      audioCtxRef.current = null;
    }
    setIsPlayingMusic(false);
  };

  const toggleMusic = () => {
    if (isPlayingMusic) {
      stopMusic();
    } else {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      setIsPlayingMusic(true);

      // Medley Natalino: Jingle Bells + Noite Feliz (Frequências em Hz e duração em ms)
      const christmasMelody = [
        // Jingle Bells: Mi Mi Mi | Mi Mi Mi | Mi Sol Do Re Mi
        { f: 659.25, d: 320 }, { f: 659.25, d: 320 }, { f: 659.25, d: 640 },
        { f: 659.25, d: 320 }, { f: 659.25, d: 320 }, { f: 659.25, d: 640 },
        { f: 659.25, d: 320 }, { f: 783.99, d: 320 }, { f: 523.25, d: 480 }, { f: 587.33, d: 180 }, { f: 659.25, d: 900 },
        // Fa Fa Fa Fa | Fa Mi Mi Mi | Mi Re Re Mi Re | Sol
        { f: 698.46, d: 320 }, { f: 698.46, d: 320 }, { f: 698.46, d: 480 }, { f: 698.46, d: 180 },
        { f: 698.46, d: 320 }, { f: 659.25, d: 320 }, { f: 659.25, d: 320 }, { f: 659.25, d: 320 },
        { f: 659.25, d: 320 }, { f: 587.33, d: 320 }, { f: 587.33, d: 320 }, { f: 659.25, d: 320 }, { f: 587.33, d: 550 }, { f: 783.99, d: 650 },
        // Noite Feliz: Sol La Sol Mi | Sol La Sol Mi | Re2 Re2 Si | Do2 Do2 Sol
        { f: 783.99, d: 500 }, { f: 880.00, d: 240 }, { f: 783.99, d: 450 }, { f: 659.25, d: 900 },
        { f: 783.99, d: 500 }, { f: 880.00, d: 240 }, { f: 783.99, d: 450 }, { f: 659.25, d: 900 },
        { f: 1174.66, d: 600 }, { f: 1174.66, d: 350 }, { f: 987.77, d: 850 },
        { f: 1046.50, d: 600 }, { f: 1046.50, d: 350 }, { f: 783.99, d: 950 }
      ];

      let noteIndex = 0;

      const playStep = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
        const note = christmasMelody[noteIndex % christmasMelody.length];
        const now = ctx.currentTime;

        // Sininho de Natal / Celesta
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.f, now);

        const oscHarmonic = ctx.createOscillator();
        const gainHarmonic = ctx.createGain();
        oscHarmonic.type = 'triangle';
        oscHarmonic.frequency.setValueAtTime(note.f * 2, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.12, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);

        gainHarmonic.gain.setValueAtTime(0.001, now);
        gainHarmonic.gain.exponentialRampToValueAtTime(0.03, now + 0.02);
        gainHarmonic.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        oscHarmonic.connect(gainHarmonic);
        gainHarmonic.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.15);
        oscHarmonic.start(now);
        oscHarmonic.stop(now + 0.65);

        noteIndex++;
        musicTimeoutRef.current = setTimeout(playStep, note.d);
      };

      playStep();
    }
  };

  useEffect(() => {
    return () => stopMusic();
  }, []);

  // --- TELA CHEIA ---
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

  // --- CENA 3D DE NATAL ---
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    // Céu noturno azul-inverno mágico de Natal
    scene.background = new THREE.Color('#0B192C');
    scene.fog = new THREE.FogExp2('#0B192C', 0.012);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      200
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 1. Iluminação Natalina Aconchegante
    const ambientLight = new THREE.AmbientLight('#DCE8F5', 1.1);
    scene.add(ambientLight);

    const moonLight = new THREE.DirectionalLight('#E2F1FF', 1.5);
    moonLight.position.set(18, 32, 20);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 2048;
    moonLight.shadow.mapSize.height = 2048;
    scene.add(moonLight);

    // Luz quente dourada emanando da Árvore de Natal no centro
    const treeWarmLight = new THREE.PointLight('#F59E0B', 3.5, 32);
    treeWarmLight.position.set(0, 4.5, 0);
    scene.add(treeWarmLight);

    // 2. ILHA GIGANTE NEVADA (Raio 24 para caber as 500 flores!)
    const islandGroup = new THREE.Group();
    scene.add(islandGroup);

    // Topo da ilha coberto de neve branca brilhante e grama invernal
    const snowGroundGeo = new THREE.CylinderGeometry(24.5, 23.0, 1.5, 24);
    const snowGroundMat = new THREE.MeshStandardMaterial({
      color: '#F1F5F9',
      roughness: 0.65,
      metalness: 0.05,
      flatShading: true,
    });
    const snowGround = new THREE.Mesh(snowGroundGeo, snowGroundMat);
    snowGround.position.y = -0.75;
    snowGround.receiveShadow = true;
    islandGroup.add(snowGround);

    // Base rochosa congelada da ilha flutuante
    const rockGeo = new THREE.ConeGeometry(23.0, 11.0, 16);
    const rockMat = new THREE.MeshStandardMaterial({
      color: '#475569',
      roughness: 0.85,
      flatShading: true,
    });
    const rockMesh = new THREE.Mesh(rockGeo, rockMat);
    rockMesh.rotation.x = Math.PI;
    rockMesh.position.y = -6.9;
    islandGroup.add(rockMesh);

    // Lago Central Congelado (Espelho de Gelo)
    const icePondGeo = new THREE.CylinderGeometry(4.2, 4.0, 0.18, 20);
    const icePondMat = new THREE.MeshStandardMaterial({
      color: '#BAE6FD',
      emissive: '#38BDF8',
      emissiveIntensity: 0.15,
      roughness: 0.1,
      metalness: 0.35,
      flatShading: true,
    });
    const icePond = new THREE.Mesh(icePondGeo, icePondMat);
    icePond.position.y = 0.02;
    islandGroup.add(icePond);

    const clickableMeshes = [];

    // 3. GRANDE ÁRVORE DE NATAL ENFEITADA NO CENTRO DA ILHA
    const treeGroup = new THREE.Group();
    treeGroup.position.set(0, 0.05, 0);

    // Tronco do Pinheiro
    const trunkMat = new THREE.MeshStandardMaterial({ color: '#5C4033', flatShading: true });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.65, 1.6, 8), trunkMat);
    trunk.position.y = 0.8;
    trunk.castShadow = true;
    treeGroup.add(trunk);

    // 4 Camadas de Pinheiro Verde + Bordas de Neve
    const pineMat = new THREE.MeshStandardMaterial({
      color: '#14532D',
      roughness: 0.7,
      flatShading: true,
    });
    const snowCapMat = new THREE.MeshStandardMaterial({
      color: '#FFFFFF',
      roughness: 0.5,
      flatShading: true,
    });

    const treeLayers = [
      { r: 2.8, h: 2.6, y: 2.2 },
      { r: 2.3, h: 2.3, y: 3.6 },
      { r: 1.75, h: 2.0, y: 4.8 },
      { r: 1.15, h: 1.7, y: 5.9 },
    ];

    const ornamentColors = ['#EF4444', '#F59E0B', '#3B82F6', '#EC4899', '#FEF08A'];
    const treeLights = [];

    treeLayers.forEach((layer, lIdx) => {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(layer.r, layer.h, 10), pineMat);
      cone.position.y = layer.y;
      cone.castShadow = true;
      cone.userData = { isChristmasTree: true };
      clickableMeshes.push(cone);
      treeGroup.add(cone);

      // Camada fina de neve nas pontas do pinheiro
      const snowCone = new THREE.Mesh(
        new THREE.ConeGeometry(layer.r * 1.01, layer.h * 0.28, 10),
        snowCapMat
      );
      snowCone.position.y = layer.y - layer.h * 0.34;
      treeGroup.add(snowCone);

      // Bolinhas de Natal e Pisca-Piscas ao redor de cada camada
      const ballsCount = 10 - lIdx * 2;
      for (let b = 0; b < ballsCount; b++) {
        const angle = (b / ballsCount) * Math.PI * 2 + lIdx * 0.5;
        const ballColor = ornamentColors[(b + lIdx) % ornamentColors.length];
        const ballMat = new THREE.MeshStandardMaterial({
          color: ballColor,
          emissive: ballColor,
          emissiveIntensity: 0.65,
          roughness: 0.2,
          metalness: 0.5,
        });
        const ball = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), ballMat);
        const radiusAtBottom = layer.r * 0.86;
        ball.position.set(
          Math.cos(angle) * radiusAtBottom,
          layer.y - layer.h * 0.35,
          Math.sin(angle) * radiusAtBottom
        );
        ball.userData = { isChristmasTree: true };
        clickableMeshes.push(ball);
        treeGroup.add(ball);
        treeLights.push({ mat: ballMat, phase: b + lIdx });
      }
    });

    // Estrela de Belém Dourada no Topo da Árvore (y = 7.0)
    const starMat = new THREE.MeshStandardMaterial({
      color: '#FDE047',
      emissive: '#F59E0B',
      emissiveIntensity: 1.2,
      flatShading: true,
    });
    const starMesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.55, 0), starMat);
    starMesh.position.y = 7.0;
    starMesh.scale.set(1, 1.25, 0.45);
    starMesh.userData = { isChristmasTree: true };
    clickableMeshes.push(starMesh);
    treeGroup.add(starMesh);

    // Caixas de Presente Coloridas embaixo da Árvore
    const giftColors = [
      { box: '#DC2626', ribbon: '#FDE047' },
      { box: '#2563EB', ribbon: '#FFFFFF' },
      { box: '#16A34A', ribbon: '#EF4444' },
      { box: '#9333EA', ribbon: '#FDE047' },
      { box: '#E11D48', ribbon: '#FFFFFF' },
    ];
    for (let g = 0; g < 6; g++) {
      const gAngle = (g / 6) * Math.PI * 2;
      const palette = giftColors[g % giftColors.length];
      const giftGroup = new THREE.Group();
      const boxMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 0.48, 0.55),
        new THREE.MeshStandardMaterial({ color: palette.box, flatShading: true })
      );
      const ribbonMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.58, 0.5, 0.14),
        new THREE.MeshStandardMaterial({ color: palette.ribbon, flatShading: true })
      );
      giftGroup.add(boxMesh, ribbonMesh);
      giftGroup.position.set(Math.cos(gAngle) * 1.65, 0.25, Math.sin(gAngle) * 1.65);
      giftGroup.rotation.y = g * 0.7;
      boxMesh.userData = { isChristmasTree: true };
      clickableMeshes.push(boxMesh);
      treeGroup.add(giftGroup);
    }

    islandGroup.add(treeGroup);

    // 4. PAPAI NOEL VOANDO NO TRENÓ COM RENAS LÁ EM CIMA AO REDOR DA ILHA
    const santaOrbitGroup = new THREE.Group();
    scene.add(santaOrbitGroup);

    const sleighContainer = new THREE.Group();
    // Posicionado no céu a raio 16 e altura 9.5
    sleighContainer.position.set(16, 9.5, 0);
    santaOrbitGroup.add(sleighContainer);

    const redSleighMat = new THREE.MeshStandardMaterial({ color: '#DC2626', flatShading: true });
    const goldMat = new THREE.MeshStandardMaterial({ color: '#F59E0B', metalness: 0.4, flatShading: true });
    const whiteMat = new THREE.MeshStandardMaterial({ color: '#FFFFFF', flatShading: true });
    const skinMat = new THREE.MeshStandardMaterial({ color: '#FDBA74', flatShading: true });
    const brownDeerMat = new THREE.MeshStandardMaterial({ color: '#78350F', flatShading: true });

    // Corpo do Trenó
    const sleighBase = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.55, 1.8), redSleighMat);
    sleighBase.position.y = 0.3;
    sleighContainer.add(sleighBase);

    // Esquis dourados do trenó
    const skiLeft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 2.3), goldMat);
    skiLeft.position.set(0.45, 0, 0.1);
    const skiRight = skiLeft.clone();
    skiRight.position.x = -0.45;
    sleighContainer.add(skiLeft, skiRight);

    // Saco de Presentes branco atrás do Papai Noel
    const giftBag = new THREE.Mesh(new THREE.DodecahedronGeometry(0.52, 0), whiteMat);
    giftBag.position.set(0, 0.75, -0.45);
    sleighContainer.add(giftBag);

    // Papai Noel (Corpo vermelho, cabeça, barba branca e gorro)
    const santaBody = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.36, 0.65, 8), redSleighMat);
    santaBody.position.set(0, 0.75, 0.25);
    const santaHead = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), skinMat);
    santaHead.position.set(0, 1.2, 0.25);
    const santaBeard = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.35, 6), whiteMat);
    santaBeard.rotation.x = Math.PI;
    santaBeard.position.set(0, 1.08, 0.42);
    const santaHat = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.45, 8), redSleighMat);
    santaHat.position.set(0, 1.48, 0.22);
    santaHat.rotation.x = -0.2;
    const hatPompom = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), whiteMat);
    hatPompom.position.set(0, 1.68, 0.15);
    sleighContainer.add(santaBody, santaHead, santaBeard, santaHat, hatPompom);

    // 2 Renas puxando o trenó na frente (+ Nariz vermelho brilhante do Rudolph!)
    const reindeerLegs = [];
    [-0.45, 0.45].forEach((offsetX, rIdx) => {
      const deerGroup = new THREE.Group();
      deerGroup.position.set(offsetX, 0.2, 2.3);

      const dBody = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.38, 0.85), brownDeerMat);
      dBody.position.y = 0.35;
      deerGroup.add(dBody);

      const dNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.45, 6), brownDeerMat);
      dNeck.position.set(0, 0.65, 0.32);
      dNeck.rotation.x = 0.35;
      deerGroup.add(dNeck);

      const dHead = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.24, 0.38), brownDeerMat);
      dHead.position.set(0, 0.82, 0.48);
      deerGroup.add(dHead);

      // Nariz brilhante vermelho no Rudolph
      if (rIdx === 0) {
        const rudolphNose = new THREE.Mesh(
          new THREE.SphereGeometry(0.07, 6, 6),
          new THREE.MeshStandardMaterial({ color: '#EF4444', emissive: '#EF4444', emissiveIntensity: 1.5 })
        );
        rudolphNose.position.set(0, 0.84, 0.69);
        deerGroup.add(rudolphNose);
      }

      // Chifres dourados
      const antlerL = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.35, 4), goldMat);
      antlerL.position.set(0.1, 1.05, 0.42);
      antlerL.rotation.z = -0.35;
      const antlerR = antlerL.clone();
      antlerR.position.x = -0.1;
      antlerR.rotation.z = 0.35;
      deerGroup.add(antlerL, antlerR);

      // 4 Patinhas animadas
      for (let leg = 0; leg < 4; leg++) {
        const legMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.38, 5), brownDeerMat);
        legMesh.position.set(leg % 2 === 0 ? 0.12 : -0.12, 0.1, leg < 2 ? 0.28 : -0.28);
        deerGroup.add(legMesh);
        reindeerLegs.push({ mesh: legMesh, phase: leg * 1.5 + rIdx });
      }

      sleighContainer.add(deerGroup);
    });

    // Rédeas Douradas ligando as renas ao trenó
    const reinLine = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 2.0, 4), goldMat);
    reinLine.rotation.x = Math.PI / 2;
    reinLine.position.set(0, 0.55, 1.25);
    sleighContainer.add(reinLine);

    // 5. OS 500 LÍRIOS DISTRIBUÍDOS NA ILHA GIGANTE (Filotaxia / Espiral de Ouro)
    const animatedLilies = [];
    const stemMat = new THREE.MeshStandardMaterial({ color: '#15803D', flatShading: true });
    const whitePetalMat = new THREE.MeshStandardMaterial({
      color: '#FFFFFF',
      emissive: '#E0F2FE',
      emissiveIntensity: 0.35,
      roughness: 0.25,
      flatShading: true,
    });
    const favPetalMat = new THREE.MeshStandardMaterial({
      color: '#FFF1F2',
      emissive: '#F43F5E',
      emissiveIntensity: 0.55,
      roughness: 0.2,
      flatShading: true,
    });
    const stamenMat = new THREE.MeshStandardMaterial({
      color: '#F59E0B',
      emissive: '#FDE047',
      emissiveIntensity: 0.6,
      flatShading: true,
    });
    const lockedBudMat = new THREE.MeshStandardMaterial({
      color: '#94A3B8',
      roughness: 0.7,
      flatShading: true,
    });

    const goldenAngle = 137.508 * (Math.PI / 180);

    QUOTES.forEach((quote, index) => {
      const isUnlocked = seenIds.includes(quote.id);
      const isFav = favorites.includes(quote.id);

      // Raio vai de 4.7 (fora do lago congelado) até 23.0 (borda da ilha grande)
      const radius = 4.7 + Math.sqrt((index + 1) / QUOTES.length) * 18.2;
      const theta = index * goldenAngle;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;

      const flowerGroup = new THREE.Group();
      flowerGroup.position.set(x, 0, z);

      if (isUnlocked) {
        const stemHeight = 0.7 + (index % 3) * 0.12;
        const stem = new THREE.Mesh(
          new THREE.CylinderGeometry(0.035, 0.05, stemHeight, 5),
          stemMat
        );
        stem.position.y = stemHeight / 2;
        flowerGroup.add(stem);

        const headGroup = new THREE.Group();
        headGroup.position.y = stemHeight;
        const chosenPetalMat = isFav ? favPetalMat : whitePetalMat;

        for (let p = 0; p < 6; p++) {
          const pAngle = (p / 6) * Math.PI * 2;
          const petalPivot = new THREE.Group();
          petalPivot.rotation.y = pAngle;

          const petal = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.44, 4), chosenPetalMat);
          petal.position.set(0, 0.16, 0.13);
          petal.rotation.x = 0.85;
          petal.scale.set(1, 1, 0.45);
          petal.userData = { quoteId: quote.id };
          clickableMeshes.push(petal);

          petalPivot.add(petal);
          headGroup.add(petalPivot);
        }

        const stamen = new THREE.Mesh(new THREE.OctahedronGeometry(0.1, 0), stamenMat);
        stamen.position.y = 0.12;
        stamen.userData = { quoteId: quote.id };
        clickableMeshes.push(stamen);
        headGroup.add(stamen);

        const hitbox = new THREE.Mesh(
          new THREE.SphereGeometry(0.42, 6, 6),
          new THREE.MeshBasicMaterial({ visible: false })
        );
        hitbox.position.y = 0.15;
        hitbox.userData = { quoteId: quote.id };
        clickableMeshes.push(hitbox);
        headGroup.add(hitbox);

        flowerGroup.add(headGroup);
        animatedLilies.push({ group: flowerGroup, phase: index * 0.3 });
      } else {
        // Botãozinho congelado na neve (flores dos próximos dias)
        const bud = new THREE.Mesh(new THREE.OctahedronGeometry(0.1, 0), lockedBudMat);
        bud.position.y = 0.09;
        flowerGroup.add(bud);
      }

      islandGroup.add(flowerGroup);
    });

    // 6. NEVE 3D CAINDO SOBRE TODA A ILHA
    const snowCount = 260;
    const snowPositions = new Float32Array(snowCount * 3);
    for (let i = 0; i < snowCount; i++) {
      snowPositions[i * 3] = (Math.random() - 0.5) * 52;
      snowPositions[i * 3 + 1] = Math.random() * 24;
      snowPositions[i * 3 + 2] = (Math.random() - 0.5) * 52;
    }
    const snowGeo = new THREE.BufferGeometry();
    snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPositions, 3));
    const snowMat = new THREE.PointsMaterial({
      color: '#FFFFFF',
      size: 0.24,
      transparent: true,
      opacity: 0.9,
    });
    const snowSystem = new THREE.Points(snowGeo, snowMat);
    scene.add(snowSystem);

    // 7. Controles de Câmera (Zoom ampliado para explorar a ilha de 500 flores)
    let isDragging = false;
    let prevPos = { x: 0, y: 0 };
    let pointerDownPos = { x: 0, y: 0 };
    let spherical = { theta: 0.5, phi: 1.08, radius: 26.0 };

    const updateCamera = () => {
      camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.y = spherical.radius * Math.cos(spherical.phi);
      camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.lookAt(0, 1.8, 0);
    };
    updateCamera();

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const onPointerDown = (e) => {
      isDragging = true;
      prevPos = { x: e.clientX, y: e.clientY };
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const dx = e.clientX - prevPos.x;
        const dy = e.clientY - prevPos.y;
        spherical.theta -= dx * 0.008;
        spherical.phi = Math.max(0.4, Math.min(1.42, spherical.phi - dy * 0.006));
        updateCamera();
        prevPos = { x: e.clientX, y: e.clientY };
      } else {
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(clickableMeshes);
        if (intersects.length > 0) {
          renderer.domElement.style.cursor = 'pointer';
          const data = intersects[0].object.userData;
          if (data.isChristmasTree) {
            setHoveredInfo('🎄 Árvore de Natal — Toque para abrir!');
          } else {
            setHoveredInfo(`🌸 Lírio Nº ${data.quoteId} de 500`);
          }
        } else {
          renderer.domElement.style.cursor = 'grab';
          setHoveredInfo(null);
        }
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
          const data = intersects[0].object.userData;
          if (data.isChristmasTree) {
            setShowChristmasTreeModal(true);
          } else if (data.quoteId) {
            const found = QUOTES.find((q) => q.id === data.quoteId);
            if (found) setSelectedQuote(found);
          }
        }
      }
    };

    const onWheel = (e) => {
      e.preventDefault();
      spherical.radius = Math.max(10, Math.min(44, spherical.radius + e.deltaY * 0.018));
      updateCamera();
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
      const elapsed = clock.getElapsedTime();

      if (!isDragging) {
        spherical.theta += 0.001;
        updateCamera();
      }

      // Gira a Estrela no topo da Árvore e pisca as luzes natalinas
      starMesh.rotation.y = elapsed * 1.2;
      treeLights.forEach((light) => {
        light.mat.emissiveIntensity = 0.45 + Math.sin(elapsed * 4 + light.phase) * 0.35;
      });

      // Voo circular do Papai Noel no Trenó ao redor da ilha lá no alto
      const santaAngle = -elapsed * 0.38;
      const orbitR = 16.5;
      const sx = Math.cos(santaAngle) * orbitR;
      const sz = Math.sin(santaAngle) * orbitR;
      const sy = 9.2 + Math.sin(elapsed * 2.2) * 0.85;

      // Faz o trenó apontar para a frente da trajetória circular
      const nextAngle = santaAngle - 0.05;
      sleighContainer.position.set(sx, sy, sz);
      sleighContainer.lookAt(
        Math.cos(nextAngle) * orbitR,
        9.2 + Math.sin((elapsed + 0.1) * 2.2) * 0.85,
        Math.sin(nextAngle) * orbitR
      );

      // Galope das patinhas das renas
      reindeerLegs.forEach((leg) => {
        leg.mesh.rotation.x = Math.sin(elapsed * 12 + leg.phase) * 0.5;
      });

      // Balanço suave dos lírios
      animatedLilies.forEach((item) => {
        item.group.rotation.z = Math.sin(elapsed * 1.6 + item.phase) * 0.05;
      });

      // Queda suave da Neve 3D
      const posArr = snowGeo.attributes.position.array;
      for (let i = 0; i < snowCount; i++) {
        posArr[i * 3 + 1] -= 0.035;
        posArr[i * 3] += Math.sin(elapsed + i) * 0.008;
        if (posArr[i * 3 + 1] < -1) {
          posArr[i * 3 + 1] = 23;
        }
      }
      snowGeo.attributes.position.needsUpdate = true;

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
  }, [seenIds, favorites, isFullscreen]);

  const isSelectedFav = selectedQuote ? favorites.includes(selectedQuote.id) : false;

  return (
    <div
      ref={wrapperRef}
      className={`bg-white/95 backdrop-blur-md border border-[#DCE6DF] shadow-xl overflow-hidden transition-all ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none flex flex-col h-screen w-screen'
          : 'relative rounded-[32px]'
      }`}
    >
      {/* Cabeçalho Natalino da Ilha 3D */}
      <div className="p-3.5 sm:px-6 bg-gradient-to-r from-[#14532D] via-[#166534] to-[#991B1B] text-white flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div>
          <h2 className="font-serif-romantic text-xl sm:text-2xl font-semibold flex items-center gap-2">
            <span>🎄 Ilha Natalina dos 500 Lírios</span>
            <span className="text-xs font-sans-clean font-semibold px-2.5 py-0.5 rounded-full bg-white/20 text-[#FEF08A]">
              {seenIds.length} / 500 flores
            </span>
          </h2>
          <p className="text-[11px] sm:text-xs text-white/85">
            Olhe para o céu para ver o Papai Noel • Toque na Árvore ou nos Lírios Brancos ❄️
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {hoveredInfo && (
            <span className="hidden md:inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium">
              {hoveredInfo}
            </span>
          )}

          <button
            onClick={toggleMusic}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
              isPlayingMusic
                ? 'bg-[#FEF08A] text-[#991B1B] border-[#F59E0B]'
                : 'bg-white/15 text-white border-white/30 hover:bg-white/25'
            }`}
          >
            {isPlayingMusic ? (
              <>
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                <span>Música de Natal</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Tocar Natal 🎵</span>
              </>
            )}
          </button>

          <button
            onClick={toggleFullscreen}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/15 hover:bg-white/25 text-white border border-white/30 transition cursor-pointer"
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

      {/* Canvas 3D */}
      <div
        ref={mountRef}
        className={`w-full touch-none select-none cursor-grab active:cursor-grabbing ${
          isFullscreen ? 'flex-1 min-h-0' : 'h-[450px] sm:h-[520px]'
        }`}
      />

      {/* Legenda na base */}
      <div className="px-4 py-2.5 bg-[#0F172A] text-white/90 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 text-[11px] shrink-0">
        <span className="inline-flex items-center gap-1.5">
          🎅 Papai Noel voando no céu
        </span>
        <span className="inline-flex items-center gap-1.5">
          🎄 Árvore Central Interativa
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-white inline-block" />
          Lírios Abertos ({seenIds.length})
        </span>
        <span className="inline-flex items-center gap-1">
          <RotateCw className="w-3 h-3" /> Arraste para girar e use zoom
        </span>
      </div>

      {/* Modal Especial ao Clicar na Árvore de Natal Central */}
      {showChristmasTreeModal && (
        <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] border-2 border-[#D97706] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-center">
            <button
              onClick={() => setShowChristmasTreeModal(false)}
              className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-[#F1F5F2] hover:bg-[#E2EAE4] text-[#4A5D4E] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 rounded-full bg-[#FEF3C7] border border-[#F59E0B] flex items-center justify-center mx-auto mb-3">
              <Gift className="w-7 h-7 text-[#B91C1C]" />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-xs font-semibold mb-3">
              🎄 Magia de Natal no Jardim de Lírios
            </span>

            <h3 className="font-serif-romantic font-bold text-3xl text-[#14532D] mb-2">
              Luz para o Seu Olhar ✨
            </h3>

            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed mb-5">
              Esta Árvore de Natal brilha no centro de 500 lírios brancos para lembrar todos os dias que a luz mais encantadora do mundo mora na doçura do seu sorriso e na beleza do seu olhar.
            </p>

            <button
              onClick={() => setShowChristmasTreeModal(false)}
              className="px-6 py-2.5 rounded-full text-xs font-semibold bg-[#14532D] text-white hover:bg-[#166534] transition cursor-pointer"
            >
              Continuar Explorando a Ilha ❄️
            </button>
          </div>
        </div>
      )}

      {/* Modal Poético ao Clicar num Lírio 3D */}
      {selectedQuote && (
        <div className="absolute inset-0 z-20 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FDFBF7] border-2 border-[#E2ECE5] rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-center">
            <button
              onClick={() => setSelectedQuote(null)}
              className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-[#F1F5F2] hover:bg-[#E2EAE4] text-[#4A5D4E] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-xs font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Lírio de Natal Nº {selectedQuote.id} de 500</span>
            </div>

            <blockquote className="font-serif-romantic italic text-2xl text-[#1F2921] leading-relaxed mb-4">
              “{selectedQuote.text}”
            </blockquote>

            <p className="font-serif-romantic font-semibold text-base text-[#2C352D]">
              {selectedQuote.author}
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-[#5E7163] mt-1 mb-5">
              <BookOpen className="w-3.5 h-3.5 text-[#15803D]" />
              <span>{selectedQuote.source}</span>
            </div>

            <div className="flex items-center justify-center gap-2.5 pt-3 border-t border-[#E8EFEA]">
              <button
                onClick={() => onToggleFavorite(selectedQuote.id)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition cursor-pointer ${
                  isSelectedFav
                    ? 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]'
                    : 'bg-white text-[#3F4E42] border border-[#DDE6DF]'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isSelectedFav ? 'fill-[#EF4444] text-[#EF4444]' : ''}`} />
                <span>{isSelectedFav ? 'Favoritada' : 'Favoritar Flor'}</span>
              </button>

              <button
                onClick={() => {
                  if (isFullscreen) setIsFullscreen(false);
                  onOpenInMainCard(selectedQuote.id);
                  setSelectedQuote(null);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium bg-[#14532D] text-white hover:bg-[#166534] transition cursor-pointer"
              >
                <span>Ver no Cartão-Postal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
