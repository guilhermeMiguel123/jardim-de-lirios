import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Heart, BookOpen, X, RotateCw, Flower2 } from 'lucide-react';
import { QUOTES } from '../data/quotes';

export default function Garden3D({ seenIds = [], favorites = [], onToggleFavorite, onOpenInMainCard }) {
  const mountRef = useRef(null);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [hoveredLilyId, setHoveredLilyId] = useState(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Cena, Câmera e Renderizador
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#EEF5F0');
    scene.fog = new THREE.FogExp2('#EEF5F0', 0.028);

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
    const ambientLight = new THREE.AmbientLight('#FFFDF9', 1.35);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight('#FFF5E4', 1.8);
    sunLight.position.set(10, 18, 12);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    const pinkPointLight = new THREE.PointLight('#FBCFE8', 1.2, 20);
    pinkPointLight.position.set(0, 4, 0);
    scene.add(pinkPointLight);

    // 3. Ilha Flutuante Low Poly
    const islandGroup = new THREE.Group();
    scene.add(islandGroup);

    // Topo de grama verde sálvia
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

    // Base de rocha/terra Low Poly da ilha
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

    // Pequeno espelho d'água / fonte no centro da ilha
    const pondGeo = new THREE.CylinderGeometry(2.1, 1.9, 0.15, 10);
    const pondMat = new THREE.MeshStandardMaterial({
      color: '#A8DADC',
      roughness: 0.2,
      metalness: 0.1,
      flatShading: true,
    });
    const pondMesh = new THREE.Mesh(pondGeo, pondMat);
    pondMesh.position.y = 0.02;
    islandGroup.add(pondMesh);

    // Pedrinhas decorativas em volta do lago
    const stoneGeo = new THREE.DodecahedronGeometry(0.28, 0);
    const stoneMat = new THREE.MeshStandardMaterial({ color: '#CBD5E1', flatShading: true });
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const stone = new THREE.Mesh(stoneGeo, stoneMat);
      stone.position.set(Math.cos(angle) * 2.15, 0.08, Math.sin(angle) * 2.15);
      stone.scale.set(1, 0.6, 1);
      stone.rotation.y = i;
      islandGroup.add(stone);
    }

    // 4. Criar os 100 lugares de Lírios em Espiral de Ouro (Filotaxia)
    const clickableMeshes = [];
    const animatedLilies = [];

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
      const isUnlocked = seenIds.includes(quote.id);
      const isFav = favorites.includes(quote.id);

      const radius = 2.7 + Math.sqrt((index + 1) / QUOTES.length) * 6.5;
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

    // 5. Vaga-lumes / Pólen Dourado Flutuante
    const particlesCount = 45;
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = 0.5 + Math.random() * 4.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMat = new THREE.PointsMaterial({
      color: '#FDE047',
      size: 0.18,
      transparent: true,
      opacity: 0.8,
    });
    const fireflies = new THREE.Points(particlesGeo, particlesMat);
    scene.add(fireflies);

    // 6. Controles Orbitais (Mouse e Touch no Celular)
    let isDragging = false;
    let prevPos = { x: 0, y: 0 };
    let pointerDownPos = { x: 0, y: 0 };
    let spherical = { theta: 0.6, phi: 1.05, radius: 15.5 };

    const updateCamera = () => {
      camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.y = spherical.radius * Math.cos(spherical.phi);
      camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.lookAt(0, 0.3, 0);
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
          setHoveredLilyId(intersects[0].object.userData.quoteId);
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
          const clickedId = intersects[0].object.userData.quoteId;
          const found = QUOTES.find((q) => q.id === clickedId);
          if (found) {
            setSelectedQuote(found);
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
        spherical.theta += 0.0012;
        updateCamera();
      }

      animatedLilies.forEach((item) => {
        item.group.rotation.z = Math.sin(elapsed * 1.8 + item.phase) * 0.06;
        item.group.rotation.x = Math.cos(elapsed * 1.4 + item.phase) * 0.04;
      });

      fireflies.rotation.y = elapsed * 0.05;
      fireflies.position.y = Math.sin(elapsed * 0.8) * 0.25;

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
  }, [seenIds, favorites]);

  const isSelectedFav = selectedQuote ? favorites.includes(selectedQuote.id) : false;

  return (
    <div className="relative bg-white/85 backdrop-blur-md rounded-[32px] border border-[#DCE6DF] shadow-lg overflow-hidden">
      <div className="p-4 sm:px-6 bg-white/90 border-b border-[#E8EFEA] flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-serif-romantic text-2xl font-semibold text-[#232B24] flex items-center gap-2">
            <span>Ilha dos Lírios 3D</span>
            <span className="text-xs font-sans-clean font-semibold px-2.5 py-0.5 rounded-full bg-[#EAF2EC] text-[#3F5E4D]">
              {seenIds.length} flores vivas
            </span>
          </h2>
          <p className="text-xs text-[#5E7163]">
            Arraste para girar a ilha e <strong>toque em um lírio branco</strong> para ler o poema dele ✨
          </p>
        </div>

        {hoveredLilyId && (
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F8] border border-[#FBCFE8] text-xs font-medium text-[#9D174D]">
            <Flower2 className="w-3.5 h-3.5" />
            <span>Lírio Nº {hoveredLilyId} — Clique para abrir</span>
          </div>
        )}
      </div>

      <div
        ref={mountRef}
        className="w-full h-[430px] sm:h-[500px] touch-none select-none cursor-grab active:cursor-grabbing"
      />

      <div className="px-4 py-2.5 bg-[#F8FAF8] border-t border-[#E8EFEA] flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#5C6B5E]">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-white border border-[#94A3B8] inline-block" />
          Lírio Branco (Poema Lido)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F472B6] inline-block" />
          Brilho Rosa (Favorito)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#B7C9BC] inline-block" />
          Semente (Próximos Dias)
        </span>
        <span className="inline-flex items-center gap-1">
          <RotateCw className="w-3 h-3" /> Gire com o dedo ou mouse
        </span>
      </div>

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
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition cursor-pointer ${
                  isSelectedFav
                    ? 'bg-[#FDF2F8] text-[#BE185D] border border-[#F9A8D4]'
                    : 'bg-white text-[#3F4E42] border border-[#DDE6DF]'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isSelectedFav ? 'fill-[#EC4899] text-[#EC4899]' : ''}`} />
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
