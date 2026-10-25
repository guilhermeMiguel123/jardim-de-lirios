import fs from 'fs';
import path from 'path';

const garden3DWithProposal = `import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Heart, BookOpen, X, RotateCw, Flower2, Crown } from 'lucide-react';
import { QUOTES } from '../data/quotes';

export default function Garden3D({ seenIds = [], favorites = [], onToggleFavorite, onOpenInMainCard }) {
  const mountRef = useRef(null);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [hoveredLilyId, setHoveredLilyId] = useState(null);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [proposalAccepted, setProposalAccepted] = useState(() => {
    return localStorage.getItem('jardim_lirios_accepted') === 'true';
  });
  // Estado para você testar e visualizar a flor gigante quando quiser
  const [forceTest100, setForceTest100] = useState(false);

  const isAllCompleted = seenIds.length >= QUOTES.length || forceTest100;

  const handleAcceptProposal = () => {
    setProposalAccepted(true);
    localStorage.setItem('jardim_lirios_accepted', 'true');
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Cena, Câmera e Renderizador
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isAllCompleted ? '#FDF4F7' : '#EEF5F0');
    scene.fog = new THREE.FogExp2(isAllCompleted ? '#FDF4F7' : '#EEF5F0', 0.025);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Iluminação Romântica Suave
    const ambientLight = new THREE.AmbientLight('#FFFDF9', 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight('#FFF5E4', 1.9);
    sunLight.position.set(10, 18, 12);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    const centerGlowLight = new THREE.PointLight(
      isAllCompleted ? '#F59E0B' : '#FBCFE8',
      isAllCompleted ? 2.8 : 1.2,
      25
    );
    centerGlowLight.position.set(0, 3.5, 0);
    scene.add(centerGlowLight);

    // 3. Ilha Flutuante Low Poly
    const islandGroup = new THREE.Group();
    scene.add(islandGroup);

    const grassGeo = new THREE.CylinderGeometry(10.5, 9.5, 1.2, 12);
    const grassMat = new THREE.MeshStandardMaterial({
      color: '#84A98C',
      roughness: 0.85,
      flatShading: true,
    });
    const grassMesh = new THREE.Mesh(grassGeo, grassMat);
    grassMesh.position.y = -0.6;
    grassMesh.receiveShadow = true;
    islandGroup.add(grassMesh);

    const rockBaseGeo = new THREE.ConeGeometry(9.5, 5.5, 10);
    const rockBaseMat = new THREE.MeshStandardMaterial({
      color: '#A99985',
      roughness: 0.9,
      flatShading: true,
    });
    const rockBaseMesh = new THREE.Mesh(rockBaseGeo, rockBaseMat);
    rockBaseMesh.rotation.x = Math.PI;
    rockBaseMesh.position.y = -3.9;
    islandGroup.add(rockBaseMesh);

    // Lago Central
    const pondGeo = new THREE.CylinderGeometry(2.2, 2.0, 0.16, 12);
    const pondMat = new THREE.MeshStandardMaterial({
      color: isAllCompleted ? '#BAE6FD' : '#A8DADC',
      roughness: 0.15,
      metalness: 0.15,
      flatShading: true,
    });
    const pondMesh = new THREE.Mesh(pondGeo, pondMat);
    pondMesh.position.y = 0.02;
    islandGroup.add(pondMesh);

    // Pedrinhas em volta do lago
    const stoneGeo = new THREE.DodecahedronGeometry(0.28, 0);
    const stoneMat = new THREE.MeshStandardMaterial({ color: '#CBD5E1', flatShading: true });
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const stone = new THREE.Mesh(stoneGeo, stoneMat);
      stone.position.set(Math.cos(angle) * 2.25, 0.08, Math.sin(angle) * 2.25);
      stone.scale.set(1, 0.6, 1);
      stone.rotation.y = i;
      islandGroup.add(stone);
    }

    const clickableMeshes = [];
    const animatedLilies = [];

    // 4. LÍRIO GIGANTE REAL NO CENTRO (QUANDO COMPLETA OS 100 POEMAS)
    let giantLilyGroup = null;
    let goldenRingMesh = null;

    if (isAllCompleted) {
      giantLilyGroup = new THREE.Group();
      giantLilyGroup.position.set(0, 0.05, 0);

      // Vitória-régia / Folha Sagrada de base no lago
      const padGeo = new THREE.CylinderGeometry(1.35, 1.45, 0.12, 12);
      const padMat = new THREE.MeshStandardMaterial({
        color: '#3F6E54',
        roughness: 0.6,
        flatShading: true,
      });
      const padMesh = new THREE.Mesh(padGeo, padMat);
      giantLilyGroup.add(padMesh);

      // Anel dourado luminoso flutuando ao redor da flor gigante
      const ringGeo = new THREE.TorusGeometry(1.6, 0.045, 8, 32);
      const ringMat = new THREE.MeshStandardMaterial({
        color: '#F59E0B',
        emissive: '#FDE047',
        emissiveIntensity: 0.8,
      });
      goldenRingMesh = new THREE.Mesh(ringGeo, ringMat);
      goldenRingMesh.rotation.x = Math.PI / 2;
      goldenRingMesh.position.y = 0.35;
      giantLilyGroup.add(goldenRingMesh);

      // Caule Majestoso
      const giantStemHeight = 2.6;
      const giantStemMat = new THREE.MeshStandardMaterial({ color: '#3B5E49', flatShading: true });
      const giantStem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.22, giantStemHeight, 8),
        giantStemMat
      );
      giantStem.position.y = giantStemHeight / 2;
      giantStem.castShadow = true;
      giantLilyGroup.add(giantStem);

      // 4 Folhas Grandes na base do Lírio Gigante
      const giantLeafMat = new THREE.MeshStandardMaterial({ color: '#4E7D60', flatShading: true });
      for (let gl = 0; gl < 4; gl++) {
        const leafAngle = (gl / 4) * Math.PI * 2;
        const gLeaf = new THREE.Mesh(new THREE.ConeGeometry(0.45, 1.5, 4), giantLeafMat);
        gLeaf.position.set(Math.cos(leafAngle) * 0.45, 0.7, Math.sin(leafAngle) * 0.45);
        gLeaf.rotation.z = Math.cos(leafAngle) * -0.65;
        gLeaf.rotation.x = Math.sin(leafAngle) * 0.65;
        giantLilyGroup.add(gLeaf);
      }

      // Coroa do Lírio Gigante (12 Pétalas em 2 camadas)
      const giantHead = new THREE.Group();
      giantHead.position.y = giantStemHeight;

      const royalPetalMat = new THREE.MeshStandardMaterial({
        color: '#FFFFFF',
        emissive: '#FCE7F3',
        emissiveIntensity: 0.45,
        roughness: 0.2,
        flatShading: true,
      });

      // Camada interna (6 pétalas) + Camada externa (6 pétalas)
      for (let layer = 0; layer < 2; layer++) {
        for (let p = 0; p < 6; p++) {
          const pAngle = (p / 6) * Math.PI * 2 + (layer * Math.PI) / 6;
          const pivot = new THREE.Group();
          pivot.rotation.y = pAngle;

          const petalGeo = new THREE.ConeGeometry(0.48, 1.65, 4);
          const petal = new THREE.Mesh(petalGeo, royalPetalMat);
          petal.position.set(0, 0.55, 0.45 + layer * 0.15);
          petal.rotation.x = 0.78 + layer * 0.22;
          petal.scale.set(1, 1, 0.4);
          petal.castShadow = true;

          petal.userData = { isProposalLily: true };
          clickableMeshes.push(petal);

          pivot.add(petal);
          giantHead.add(pivot);
        }
      }

      // Coração / Estame Dourado Brilhante no Centro da Flor Gigante
      const coreMat = new THREE.MeshStandardMaterial({
        color: '#F59E0B',
        emissive: '#FEF08A',
        emissiveIntensity: 0.9,
        flatShading: true,
      });
      const giantCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 0), coreMat);
      giantCore.position.y = 0.55;
      giantCore.userData = { isProposalLily: true };
      clickableMeshes.push(giantCore);
      giantHead.add(giantCore);

      // Hitbox generosa para o toque no celular pegar fácil
      const giantHitbox = new THREE.Mesh(
        new THREE.SphereGeometry(1.7, 8, 8),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      giantHitbox.position.y = 0.6;
      giantHitbox.userData = { isProposalLily: true };
      clickableMeshes.push(giantHitbox);
      giantHead.add(giantHitbox);

      giantLilyGroup.add(giantHead);
      islandGroup.add(giantLilyGroup);
    }

    // 5. Os 100 Lírios ao redor do lago
    const stemMat = new THREE.MeshStandardMaterial({ color: '#4A6B57', flatShading: true });
    const leafMat = new THREE.MeshStandardMaterial({ color: '#5E8C6A', flatShading: true });
    const whitePetalMat = new THREE.MeshStandardMaterial({
      color: '#FFFFFF',
      emissive: '#FDF2F8',
      emissiveIntensity: 0.22,
      roughness: 0.3,
      flatShading: true,
    });
    const favPetalMat = new THREE.MeshStandardMaterial({
      color: '#FFF5F8',
      emissive: '#F472B6',
      emissiveIntensity: 0.38,
      roughness: 0.25,
      flatShading: true,
    });
    const stamenMat = new THREE.MeshStandardMaterial({
      color: '#F59E0B',
      emissive: '#F59E0B',
      emissiveIntensity: 0.4,
      flatShading: true,
    });
    const lockedBudMat = new THREE.MeshStandardMaterial({
      color: '#B7C9BC',
      roughness: 0.8,
      flatShading: true,
    });

    const goldenAngle = 137.508 * (Math.PI / 180);

    QUOTES.forEach((quote, index) => {
      const isUnlocked = seenIds.includes(quote.id) || forceTest100;
      const isFav = favorites.includes(quote.id);

      const radius = 2.85 + Math.sqrt((index + 1) / QUOTES.length) * 6.4;
      const theta = index * goldenAngle;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;

      const flowerGroup = new THREE.Group();
      flowerGroup.position.set(x, 0, z);

      if (isUnlocked) {
        const stemHeight = 0.75 + (index % 3) * 0.12;
        const stem = new THREE.Mesh(
          new THREE.CylinderGeometry(0.035, 0.05, stemHeight, 5),
          stemMat
        );
        stem.position.y = stemHeight / 2;
        stem.castShadow = true;
        flowerGroup.add(stem);

        for (let l = 0; l < 2; l++) {
          const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.45, 4), leafMat);
          leaf.position.set(l === 0 ? 0.12 : -0.12, 0.22, 0);
          leaf.rotation.z = l === 0 ? -0.6 : 0.6;
          flowerGroup.add(leaf);
        }

        const headGroup = new THREE.Group();
        headGroup.position.y = stemHeight;

        const chosenPetalMat = isFav ? favPetalMat : whitePetalMat;

        for (let p = 0; p < 6; p++) {
          const pAngle = (p / 6) * Math.PI * 2;
          const petalPivot = new THREE.Group();
          petalPivot.rotation.y = pAngle;

          const petalGeo = new THREE.ConeGeometry(0.16, 0.48, 4);
          const petal = new THREE.Mesh(petalGeo, chosenPetalMat);
          petal.position.set(0, 0.18, 0.14);
          petal.rotation.x = 0.85;
          petal.scale.set(1, 1, 0.45);
          petal.castShadow = true;

          petal.userData = { quoteId: quote.id };
          clickableMeshes.push(petal);

          petalPivot.add(petal);
          headGroup.add(petalPivot);
        }

        const stamen = new THREE.Mesh(new THREE.OctahedronGeometry(0.11, 0), stamenMat);
        stamen.position.y = 0.12;
        stamen.userData = { quoteId: quote.id };
        clickableMeshes.push(stamen);
        headGroup.add(stamen);

        const hitbox = new THREE.Mesh(
          new THREE.SphereGeometry(0.45, 6, 6),
          new THREE.MeshBasicMaterial({ visible: false })
        );
        hitbox.position.y = 0.15;
        hitbox.userData = { quoteId: quote.id };
        clickableMeshes.push(hitbox);
        headGroup.add(hitbox);

        flowerGroup.add(headGroup);
        animatedLilies.push({ group: flowerGroup, phase: index * 0.5 });
      } else {
        const bud = new THREE.Mesh(new THREE.OctahedronGeometry(0.11, 0), lockedBudMat);
        bud.position.y = 0.1;
        flowerGroup.add(bud);
      }

      islandGroup.add(flowerGroup);
    });

    // 6. Vaga-lumes Dourados
    const particlesCount = isAllCompleted ? 90 : 45;
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = 0.5 + Math.random() * 5.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMat = new THREE.PointsMaterial({
      color: '#FDE047',
      size: 0.2,
      transparent: true,
      opacity: 0.85,
    });
    const fireflies = new THREE.Points(particlesGeo, particlesMat);
    scene.add(fireflies);

    // 7. Controles de Câmera
    let isDragging = false;
    let prevPos = { x: 0, y: 0 };
    let pointerDownPos = { x: 0, y: 0 };
    let spherical = { theta: 0.6, phi: 1.05, radius: 15.5 };

    const updateCamera = () => {
      camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.y = spherical.radius * Math.cos(spherical.phi);
      camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.lookAt(0, 0.6, 0);
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
        spherical.phi = Math.max(0.45, Math.min(1.38, spherical.phi - dy * 0.006));
        updateCamera();
        prevPos = { x: e.clientX, y: e.clientY };
      } else {
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(clickableMeshes);
        if (intersects.length > 0) {
          renderer.domElement.style.cursor = 'pointer';
          const data = intersects[0].object.userData;
          if (data.isProposalLily) {
            setHoveredLilyId('PROPOSAL');
          } else {
            setHoveredLilyId(data.quoteId);
          }
        } else {
          renderer.domElement.style.cursor = 'grab';
          setHoveredLilyId(null);
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
          if (data.isProposalLily) {
            setShowProposalModal(true);
          } else if (data.quoteId) {
            const found = QUOTES.find((q) => q.id === data.quoteId);
            if (found) setSelectedQuote(found);
          }
        }
      }
    };

    const onWheel = (e) => {
      e.preventDefault();
      spherical.radius = Math.max(8, Math.min(22, spherical.radius + e.deltaY * 0.01));
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
        spherical.theta += 0.0014;
        updateCamera();
      }

      if (giantLilyGroup) {
        giantLilyGroup.rotation.y = elapsed * 0.35;
        giantLilyGroup.position.y = 0.05 + Math.sin(elapsed * 2) * 0.08;
      }

      if (goldenRingMesh) {
        goldenRingMesh.scale.setScalar(1 + Math.sin(elapsed * 3) * 0.06);
      }

      animatedLilies.forEach((item) => {
        item.group.rotation.z = Math.sin(elapsed * 1.8 + item.phase) * 0.06;
        item.group.rotation.x = Math.cos(elapsed * 1.4 + item.phase) * 0.04;
      });

      fireflies.rotation.y = elapsed * 0.06;
      fireflies.position.y = Math.sin(elapsed * 0.9) * 0.25;

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

    return () => {
      cancelAnimationFrame(animFrameId);
      domElem.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      domElem.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [seenIds, favorites, isAllCompleted, forceTest100]);

  const isSelectedFav = selectedQuote ? favorites.includes(selectedQuote.id) : false;

  return (
    <div className="relative bg-white/85 backdrop-blur-md rounded-[32px] border border-[#DCE6DF] shadow-lg overflow-hidden">
      {/* Banner Dourado Especial quando os 100 Lírios estão completos */}
      {isAllCompleted && (
        <div
          onClick={() => setShowProposalModal(true)}
          className="bg-gradient-to-r from-[#9D174D] via-[#BE185D] to-[#D97706] text-white px-4 py-2.5 text-center text-xs sm:text-sm font-medium flex items-center justify-center gap-2 cursor-pointer hover:opacity-95 transition"
        >
          <Sparkles className="w-4 h-4 text-[#FDE047] shrink-0 animate-spin" />
          <span>
            O <strong>Lírio Real Gigante</strong> floresceu no centro do lago! Toque nele (ou aqui) para abrir sua surpresa 💍
          </span>
        </div>
      )}

      {/* Cabeçalho da Ilha 3D */}
      <div className="p-4 sm:px-6 bg-white/90 border-b border-[#E8EFEA] flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-serif-romantic text-2xl font-semibold text-[#232B24] flex items-center gap-2">
            <span>Ilha dos Lírios 3D</span>
            <span className="text-xs font-sans-clean font-semibold px-2.5 py-0.5 rounded-full bg-[#EAF2EC] text-[#3F5E4D]">
              {isAllCompleted ? '100 / 100 Completos!' : \`\${seenIds.length} flores vivas\`}
            </span>
          </h2>
          <p className="text-xs text-[#5E7163]">
            {isAllCompleted
              ? 'Toque no Lírio Gigante no centro do lago para revelar a mensagem secreta ✨'
              : 'Arraste para girar a ilha e toque em um lírio branco para ler o poema dele ✨'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hoveredLilyId && (
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F8] border border-[#FBCFE8] text-xs font-medium text-[#9D174D]">
              <Flower2 className="w-3.5 h-3.5" />
              <span>
                {hoveredLilyId === 'PROPOSAL'
                  ? '💍 Lírio Real — Clique para abrir!'
                  : \`Lírio Nº \${hoveredLilyId} — Clique para abrir\`}
              </span>
            </div>
          )}

          {/* Botão discreto para simular os 100 poemas completos e testar o pedido */}
          {seenIds.length < QUOTES.length && (
            <button
              onClick={() => setForceTest100(!forceTest100)}
              title="Simular 100/100 flores para ver o Lírio Gigante"
              className={\`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition cursor-pointer \${
                forceTest100
                  ? 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]'
                  : 'bg-[#F8FAF8] text-[#7A8B7E] border-[#E2EAE4] hover:bg-[#EEF3EF]'
              }\`}
            >
              <Crown className="w-3 h-3 text-[#D97706]" />
              <span>{forceTest100 ? 'Sair do Teste 100/100' : 'Testar 100/100'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Canvas 3D */}
      <div
        ref={mountRef}
        className="w-full h-[430px] sm:h-[500px] touch-none select-none cursor-grab active:cursor-grabbing"
      />

      {/* Legenda na base do mapa 3D */}
      <div className="px-4 py-2.5 bg-[#F8FAF8] border-t border-[#E8EFEA] flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#5C6B5E]">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-white border border-[#94A3B8] inline-block" />
          Lírio Branco (Poema Lido)
        </span>
        {isAllCompleted && (
          <span className="inline-flex items-center gap-1.5 font-semibold text-[#9D174D]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] inline-block animate-ping" />
            Lírio Gigante Central (Surpresa Final)
          </span>
        )}
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F472B6] inline-block" />
          Brilho Rosa (Favorito)
        </span>
        <span className="inline-flex items-center gap-1">
          <RotateCw className="w-3 h-3" /> Gire com o dedo ou mouse
        </span>
      </div>

      {/* MODAL DO PEDIDO DE NAMORO (LÍRIO GIGANTE CENTRAL) */}
      {showProposalModal && (
        <div className="absolute inset-0 z-30 bg-[#1F2921]/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-[#FFFDF9] via-[#FFF5F8] to-[#FDFBF7] border-2 border-[#F59E0B]/50 rounded-[32px] max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-center">
            <button
              onClick={() => setShowProposalModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/80 hover:bg-white text-[#4A5D4E] border border-[#E2EAE4] cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 rounded-full bg-[#FEF3C7] border-2 border-[#F59E0B] flex items-center justify-center mx-auto mb-3 shadow-md">
              <Crown className="w-8 h-8 text-[#D97706]" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FDF2F8] border border-[#FBCFE8] text-[#9D174D] text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>O 100º Lírio Floresceu no Nosso Jardim</span>
            </div>

            {!proposalAccepted ? (
              <>
                <p className="text-xs sm:text-sm text-[#5C6B5E] leading-relaxed mb-4">
                  Cem lírios brancos nasceram para exaltar a sua beleza e a luz do seu olhar. Mas nenhuma poesia do mundo se compara à sorte de caminhar ao seu lado.
                </p>

                <div className="my-5 py-5 px-4 rounded-2xl bg-white/90 border border-[#FBCFE8] shadow-inner">
                  <h3 className="font-serif-romantic italic font-bold text-3xl sm:text-4xl text-[#831843] leading-tight">
                    “Aceita namorar comigo?”
                  </h3>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
                  <button
                    onClick={handleAcceptProposal}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-[#9D174D] hover:bg-[#831843] text-white shadow-md transition transform hover:scale-105 cursor-pointer"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span>Sim, mil vezes SIM! 🤍</span>
                  </button>

                  <button
                    onClick={handleAcceptProposal}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-[#3F5E4D] hover:bg-[#2F483A] text-white shadow-md transition transform hover:scale-105 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#FDE047]" />
                    <span>Claro que aceito! 💍</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="py-4 space-y-4">
                <div className="flex items-center justify-center gap-2 text-[#EC4899]">
                  <Heart className="w-7 h-7 fill-[#EC4899] animate-bounce" />
                  <Heart className="w-9 h-9 fill-[#BE185D] animate-pulse" />
                  <Heart className="w-7 h-7 fill-[#EC4899] animate-bounce" />
                </div>

                <h3 className="font-serif-romantic font-bold text-3xl text-[#831843]">
                  Você disse SIM! 💍🤍
                </h3>

                <p className="text-sm text-[#4A5D4E] leading-relaxed">
                  Este jardim de 100 lírios brancos agora guarda o início oficial do nosso capítulo mais lindo. Eu te amo!
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => setShowProposalModal(false)}
                    className="px-6 py-2.5 rounded-full text-xs font-semibold bg-[#3F5E4D] text-white hover:bg-[#324C3E] transition cursor-pointer"
                  >
                    Voltar para o Nosso Jardim 🌸
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Poético normal das 100 flores */}
      {selectedQuote && (
        <div className="absolute inset-0 z-20 bg-[#1F2921]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FDFBF7] border-2 border-[#E2ECE5] rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-center">
            <button
              onClick={() => setSelectedQuote(null)}
              className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-[#F1F5F2] hover:bg-[#E2EAE4] text-[#4A5D4E] cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F8] border border-[#FBCFE8] text-[#9D174D] text-xs font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Lírio Colhido no Jardim — Nº {selectedQuote.id}</span>
            </div>

            <blockquote className="font-serif-romantic italic text-2xl text-[#1F2921] leading-relaxed mb-4">
              “{selectedQuote.text}”
            </blockquote>

            <p className="font-serif-romantic font-semibold text-base text-[#2C352D]">
              {selectedQuote.author}
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-[#5E7163] mt-1 mb-5">
              <BookOpen className="w-3.5 h-3.5 text-[#52735E]" />
              <span>{selectedQuote.source}</span>
            </div>

            <div className="flex items-center justify-center gap-2.5 pt-3 border-t border-[#E8EFEA]">
              <button
                onClick={() => onToggleFavorite(selectedQuote.id)}
                className={\`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition cursor-pointer \${
                  isSelectedFav
                    ? 'bg-[#FDF2F8] text-[#BE185D] border border-[#F9A8D4]'
                    : 'bg-white text-[#3F4E42] border border-[#DDE6DF]'
                }\`}
              >
                <Heart className={\`w-3.5 h-3.5 \${isSelectedFav ? 'fill-[#EC4899] text-[#EC4899]' : ''}\`} />
                <span>{isSelectedFav ? 'Favoritada' : 'Favoritar Flor'}</span>
              </button>

              <button
                onClick={() => {
                  onOpenInMainCard(selectedQuote.id);
                  setSelectedQuote(null);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium bg-[#3F5E4D] text-white hover:bg-[#324C3E] transition cursor-pointer"
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
`;

fs.writeFileSync(path.resolve('src/components/Garden3D.jsx'), garden3DWithProposal, 'utf8');
console.log('✅ Lírio Gigante com o Pedido de Namoro adicionado com sucesso em src/components/Garden3D.jsx!');