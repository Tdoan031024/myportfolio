"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type HeroThreeProps = {
  modelUrl?: string;
  walkUrl?: string;
  runUrl?: string;
  className?: string;
  introZoom?: boolean;
  enableControls?: boolean;
  enableInteraction?: boolean;
  enableFloat?: boolean;
  initialCameraPosition?: { x: number; y: number; z: number };
  initialTarget?: { x: number; y: number; z: number };
  initialModelRotationY?: number;
  modelOffset?: { x?: number; y?: number; z?: number };
};

const DEFAULT_MODEL_URL = "/assets/models/room_IT_3d.glb";
type NavTarget = "about" | "skills" | "works" | "contact";
type ExternalTarget = "facebook" | "github" | "linkedin";

const NAV_SECTION_IDS: Record<NavTarget, string[]> = {
  about: ["about"],
  skills: ["skills"],
  works: ["projects", "works"],
  contact: ["contact"],
};

const EXTERNAL_LINKS: Record<ExternalTarget, string> = {
  facebook: "https://www.facebook.com/doans.310",
  github: "https://github.com/Tdoan031024",
  linkedin: "https://www.linkedin.com/in/dvtd/",
};

type Rig = {
  head?: THREE.Object3D | null;
  torso?: THREE.Object3D | null;
  leftArm?: THREE.Object3D | null;
  rightArm?: THREE.Object3D | null;
};

const createFallbackCharacter = (
  baseColor: THREE.Color,
  highlightColor: THREE.Color,
) => {
  const group = new THREE.Group();

  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: baseColor,
    roughness: 0.35,
    metalness: 0.5,
    emissive: baseColor,
    emissiveIntensity: 0.2,
  });
  const accentMaterial = new THREE.MeshStandardMaterial({
    color: highlightColor,
    roughness: 0.2,
    metalness: 0.8,
    emissive: highlightColor,
    emissiveIntensity: 0.25,
  });

  const torso = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.35, 0.7, 6, 12),
    bodyMaterial,
  );
  torso.position.set(0, 0.25, 0);

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.32, 24, 18),
    bodyMaterial,
  );
  head.position.set(0, 0.95, 0.05);

  const visor = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 24, 12),
    accentMaterial,
  );
  visor.position.set(0, 0.92, 0.28);

  const leftArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.1, 0.55, 16),
    bodyMaterial,
  );
  leftArm.position.set(-0.48, 0.35, 0);
  leftArm.rotation.z = 0.35;

  const rightArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.1, 0.55, 16),
    bodyMaterial,
  );
  rightArm.position.set(0.48, 0.35, 0);
  rightArm.rotation.z = -0.35;

  const base = new THREE.Mesh(
    new THREE.TorusGeometry(0.5, 0.12, 10, 28),
    accentMaterial,
  );
  base.position.set(0, -0.3, 0);
  base.rotation.x = Math.PI / 2;

  group.add(torso, head, visor, leftArm, rightArm, base);

  return {
    group,
    rig: {
      head,
      torso,
      leftArm,
      rightArm,
    } satisfies Rig,
  };
};

export default function HeroThree({
  modelUrl = DEFAULT_MODEL_URL,
  walkUrl,
  runUrl,
  className,
  introZoom = false,
  enableControls = true,
  enableInteraction = true,
  enableFloat = true,
  initialCameraPosition,
  initialTarget,
  initialModelRotationY,
  modelOffset,
}: HeroThreeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, isCoarsePointer ? 1 : 1.35),
    );
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = false;
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    );
    const baseCameraPosition = initialCameraPosition ?? { x: 0, y: 1.1, z: 3.2 };
    const baseCameraZ = baseCameraPosition.z;
    const introStartZ = introZoom ? baseCameraZ + 1.2 : baseCameraZ;
    camera.position.set(
      baseCameraPosition.x,
      baseCameraPosition.y,
      introStartZ,
    );

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minDistance = 1.6;
    controls.maxDistance = 6;
    controls.enabled = enableControls && !isCoarsePointer;
    if (initialTarget) {
      controls.target.set(initialTarget.x, initialTarget.y, initialTarget.z);
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.05);
    directionalLight.position.set(2.2, 4.2, 2.1);
    const rimLight = new THREE.PointLight(0x7dd3fc, 0.6, 10);
    rimLight.position.set(-2, -0.6, 2.2);

    scene.add(ambientLight, directionalLight, rimLight);

    const group = new THREE.Group();
    scene.add(group);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let hovered = false;
    let clicked = false;
    let mixer: THREE.AnimationMixer | null = null;
    let modelRoot: THREE.Object3D | null = null;
    let rig: Rig = {};
    const actions = new Map<string, THREE.AnimationAction>();
    let activeAction: THREE.AnimationAction | null = null;
    let activeActionLabel = "idle";
    let rafId = 0;
    let waveUntil = 0;
    let lastClickAt = 0;
    const introStartAt = performance.now();

    const lookTarget = new THREE.Vector2(0, 0);
    const lookCurrent = new THREE.Vector2(0, 0);
    const lookIntensity = isCoarsePointer ? 0.18 : 0.28;
    const torsoIntensity = isCoarsePointer ? 0.08 : 0.16;

    const highlightColor = new THREE.Color("#f472b6");
    const baseColor = new THREE.Color("#52f5ff");

    const playAction = (label: string) => {
      const nextAction = actions.get(label);
      if (!nextAction || nextAction === activeAction) return;

      if (activeAction) {
        activeAction.fadeOut(0.25);
      }

      nextAction.reset().fadeIn(0.25).play();
      activeAction = nextAction;
      activeActionLabel = label;
    };

    const registerAction = (label: string, clip?: THREE.AnimationClip) => {
      if (!mixer || !clip) return;
      const action = mixer.clipAction(clip);
      actions.set(label, action);
    };

    const loadExtraAnimation = (label: string, url: string) => {
      loader.load(
        url,
        (animGltf) => {
          registerAction(label, animGltf.animations[0]);
        },
        undefined,
        () => {
          // Ignore missing animation assets.
        },
      );
    };

    const setMaterialState = (_object: THREE.Object3D, _isHover: boolean) => {
      // Keep original materials intact.
    };

    const setClickState = (_object: THREE.Object3D, _isClicked: boolean) => {
      // Keep original materials intact.
    };

    const fitModelToView = (object: THREE.Object3D) => {
      const box = new THREE.Box3().setFromObject(object);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);

      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim === 0) return;

      const targetSize = 1.3;
      const scale = targetSize / maxDim;
      object.scale.setScalar(scale);

      object.position.sub(center.multiplyScalar(scale));
      object.position.y += 0.15;
      if (modelOffset) {
        object.position.x += modelOffset.x ?? 0;
        object.position.y += modelOffset.y ?? 0;
        object.position.z += modelOffset.z ?? 0;
      }
    };

    const loader = new GLTFLoader();
    const resolveNavTargetFromObject = (
      object: THREE.Object3D | null,
      hitPointWorld?: THREE.Vector3,
      pointerNdc?: THREE.Vector2,
    ): NavTarget | null => {
      let current: THREE.Object3D | null = object;

      while (current) {
        const name = current.name.toLowerCase();
        if (!name) {
          current = current.parent;
          continue;
        }

        if (name.includes("text.001") || name.includes("about")) return "about";
        if (name.includes("text.002") || name.includes("skill")) return "skills";
        if (
          name.includes("text.003") ||
          name.includes("work") ||
          name.includes("project")
        ) {
          return "works";
        }
        if (name.includes("text.004") || name.includes("contact")) return "contact";

        current = current.parent;
      }

      // Fallback when GLB node names are generic/missing:
      // detect the left signboard column by hit position in model local space.
      if (modelRoot && hitPointWorld) {
        const localHit = modelRoot.worldToLocal(hitPointWorld.clone());
        const inSignColumn =
          localHit.x >= -1.35 &&
          localHit.x <= -0.35 &&
          localHit.z >= -0.4 &&
          localHit.z <= 0.75;

        if (inSignColumn) {
          if (localHit.y > 0.78) return "about";
          if (localHit.y > 0.38) return "skills";
          if (localHit.y > -0.02) return "works";
          if (localHit.y > -0.5) return "contact";
        }
      }

      // Final fallback by screen-space bands for the left signboard column.
      if (pointerNdc) {
        const px = pointerNdc.x;
        const py = pointerNdc.y;
        const inLeftColumn = px >= -0.95 && px <= -0.35;
        if (inLeftColumn) {
          if (py >= 0.22) return "about";
          if (py >= -0.03) return "skills";
          if (py >= -0.3) return "works";
          if (py >= -0.62) return "contact";
        }
      }

      return null;
    };

    const resolveExternalTargetFromObject = (
      object: THREE.Object3D | null,
      hitPointWorld?: THREE.Vector3,
      pointerNdc?: THREE.Vector2,
    ): ExternalTarget | null => {
      const byThird = (value: number, min: number, max: number): ExternalTarget | null => {
        if (value < min || value > max) return null;
        const t = (value - min) / (max - min);
        if (t < 1 / 3) return "facebook";
        if (t < 2 / 3) return "github";
        return "linkedin";
      };

      let current: THREE.Object3D | null = object;

      while (current) {
        const name = current.name.toLowerCase();
        if (!name) {
          current = current.parent;
          continue;
        }

        // Only trust explicit names to avoid misclassification from generic parent names.
        if (name.includes("facebook")) return "facebook";
        if (name.includes("github") || name.includes("git")) return "github";
        if (name.includes("linkedin")) return "linkedin";

        current = current.parent;
      }

      // Stable fallback based on screen-space row where the 3 icons are visible.
      // Left -> Right: Facebook, GitHub, LinkedIn
      if (pointerNdc) {
        const iconAnchors: Array<{
          target: ExternalTarget;
          x: number;
          y: number;
        }> = [
          { target: "facebook", x: 0.22, y: 0.58 },
          { target: "github", x: 0.30, y: 0.58 },
          { target: "linkedin", x: 0.38, y: 0.58 },
        ];
        const hitRadius = 0.05;

        let nearest: ExternalTarget | null = null;
        let nearestDist = Number.POSITIVE_INFINITY;

        for (const anchor of iconAnchors) {
          const dx = pointerNdc.x - anchor.x;
          const dy = pointerNdc.y - anchor.y;
          const dist = Math.hypot(dx, dy);
          if (dist <= hitRadius && dist < nearestDist) {
            nearest = anchor.target;
            nearestDist = dist;
          }
        }

        if (nearest) {
          return nearest;
        }
      }

      return null;
    };

    const scrollToSection = (target: NavTarget) => {
      const sectionId = NAV_SECTION_IDS[target].find((id) => document.getElementById(id));
      if (!sectionId) return;
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };

    loader.load(
      modelUrl,
      (gltf) => {
        modelRoot = gltf.scene;
        modelRoot.traverse((child) => {
          if (!(child as THREE.Mesh).isMesh) return;
          const mesh = child as THREE.Mesh;
          mesh.castShadow = false;
          mesh.receiveShadow = false;
        });
        group.add(modelRoot);
        fitModelToView(modelRoot);
        modelRoot.rotation.y = initialModelRotationY ?? Math.PI * -0.35;

        const findByName = (patterns: RegExp[]) => {
          let found: THREE.Object3D | null = null;
          modelRoot?.traverse((child) => {
            if (found) return;
            if (!child.name) return;
            if (patterns.some((pattern) => pattern.test(child.name))) {
              found = child;
            }
          });
          return found;
        };

        rig = {
          head: findByName([/head/i, /neck/i]),
          torso: findByName([/spine/i, /chest/i, /torso/i]),
          leftArm: findByName([/leftarm/i, /upperarm_l/i, /arm_l/i]),
          rightArm: findByName([/rightarm/i, /upperarm_r/i, /arm_r/i]),
        };

        if (gltf.animations.length) {
          mixer = new THREE.AnimationMixer(modelRoot);
          registerAction("idle", gltf.animations[0]);
          playAction("idle");

          if (walkUrl) loadExtraAnimation("walk", walkUrl);
          if (runUrl) loadExtraAnimation("run", runUrl);
        }
      },
      undefined,
      () => {
        // Fallback if model fails to load.
        const fallback = createFallbackCharacter(baseColor, highlightColor);
        modelRoot = fallback.group;
        rig = fallback.rig;
        group.add(modelRoot);
        fitModelToView(modelRoot);
        modelRoot.rotation.y = initialModelRotationY ?? Math.PI * -0.35;
      },
    );

    const handlePointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      lookTarget.set(pointer.x, pointer.y);

      if (!modelRoot) return;

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObject(modelRoot, true);
      const isHover = hits.length > 0;

      const isMenuHover =
        isHover &&
        Boolean(resolveNavTargetFromObject(hits[0].object, hits[0].point, pointer));
      const isExternalHover =
        isHover &&
        Boolean(
          resolveExternalTargetFromObject(hits[0].object, hits[0].point, pointer),
        );
      renderer.domElement.style.cursor =
        isMenuHover || isExternalHover
          ? "pointer"
          : isHover
            ? "crosshair"
            : "default";

      if (hovered !== isHover) {
        hovered = isHover;
        setMaterialState(modelRoot, hovered);
      }
    };

    const handlePointerLeave = () => {
      if (!modelRoot) return;
      hovered = false;
      lookTarget.set(0, 0);
      setMaterialState(modelRoot, hovered);
    };

    const handleClick = (event: MouseEvent) => {
      if (!modelRoot) return;

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObject(modelRoot, true);

      const externalTargetByPointer = resolveExternalTargetFromObject(
        hits[0]?.object ?? null,
        hits[0]?.point,
        pointer,
      );
      if (externalTargetByPointer) {
        window.open(
          EXTERNAL_LINKS[externalTargetByPointer],
          "_blank",
          "noopener,noreferrer",
        );
        return;
      }

      if (hits.length > 0) {
        const navTarget = resolveNavTargetFromObject(
          hits[0].object,
          hits[0].point,
          pointer,
        );
        if (navTarget) {
          scrollToSection(navTarget);
          return;
        }

        clicked = !clicked;
        setClickState(modelRoot, clicked);
        lastClickAt = performance.now();
        waveUntil = lastClickAt + 1200;

        const nextLabel =
          activeActionLabel === "idle"
            ? "walk"
            : activeActionLabel === "walk"
              ? "run"
              : "idle";
        playAction(actions.has(nextLabel) ? nextLabel : "idle");
        return;
      }

      const navTargetByPointer = resolveNavTargetFromObject(null, undefined, pointer);
      if (navTargetByPointer) {
        scrollToSection(navTargetByPointer);
      }
    };

    if (enableInteraction) {
      renderer.domElement.addEventListener("pointermove", handlePointerMove);
      renderer.domElement.addEventListener("pointerleave", handlePointerLeave);
      renderer.domElement.addEventListener("pointerdown", handleClick);
    }

    const clock = new THREE.Clock();

    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 },
    );
    observer.observe(container);

    const animate = () => {
      rafId = window.requestAnimationFrame(animate);
      if (!isVisible) return;
      const delta = clock.getDelta();

      if (mixer) mixer.update(delta);

      lookCurrent.x += (lookTarget.x - lookCurrent.x) * 0.08;
      lookCurrent.y += (lookTarget.y - lookCurrent.y) * 0.08;

      const now = performance.now();
      if (introZoom) {
        const elapsed = (now - introStartAt) / 1000;
        const duration = 2.8;
        if (elapsed <= duration) {
          const phase = elapsed / duration;
          const ease = (value: number) => value * value * (3 - 2 * value);
          const lerp = (from: number, to: number, value: number) =>
            from + (to - from) * value;
          if (phase <= 0.45) {
            const t = ease(phase / 0.45);
            camera.position.z = lerp(introStartZ, 1.9, t);
          } else {
            const t = ease((phase - 0.45) / 0.55);
            camera.position.z = lerp(1.9, baseCameraZ, t);
          }
        }
      }
      const waveActive = now < waveUntil;
      const wavePhase = waveActive ? (now - lastClickAt) / 180 : 0;

      if (rig.head || rig.torso) {
        if (rig.head) {
          rig.head.rotation.y = lookCurrent.x * lookIntensity;
          rig.head.rotation.x = lookCurrent.y * lookIntensity;
        }
        if (rig.torso) {
          rig.torso.rotation.y = lookCurrent.x * torsoIntensity;
          rig.torso.rotation.x = lookCurrent.y * torsoIntensity * 0.6;
        }
      } else if (modelRoot) {
        modelRoot.rotation.y = lookCurrent.x * 0.2;
        modelRoot.rotation.x = lookCurrent.y * 0.12;
      }

      if (rig.rightArm && waveActive) {
        rig.rightArm.rotation.z = -0.4 + Math.sin(wavePhase) * 0.6;
        rig.rightArm.rotation.x = Math.sin(wavePhase * 1.2) * 0.35;
      }

      if (enableFloat) {
        group.rotation.y = Math.sin(performance.now() * 0.0004) * 0.08;
        group.rotation.x = Math.sin(performance.now() * 0.0003) * 0.04;
      }
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (!width || !height) return;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      observer.disconnect();
      if (enableInteraction) {
        renderer.domElement.removeEventListener("pointermove", handlePointerMove);
        renderer.domElement.removeEventListener("pointerleave", handlePointerLeave);
        renderer.domElement.removeEventListener("pointerdown", handleClick);
      }
      window.cancelAnimationFrame(rafId);
      controls.dispose();

      scene.traverse((child) => {
        if (!(child as THREE.Mesh).isMesh) return;
        const mesh = child as THREE.Mesh;
        mesh.geometry?.dispose();

        const material = mesh.material as THREE.Material | THREE.Material[];
        if (Array.isArray(material)) {
          material.forEach((mat) => mat.dispose());
        } else {
          material.dispose();
        }
      });

      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [modelUrl]);

  return <div ref={containerRef} className={className ?? "h-full w-full"} />;
}
