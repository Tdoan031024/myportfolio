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
    const clickableNavObjects: THREE.Object3D[] = [];
    const navLabelPatterns: Array<{ target: NavTarget; pattern: RegExp }> = [
      { target: "about", pattern: /(plane\.038_329|object_533|text\.002_334|object_543)/i },
      { target: "skills", pattern: /(plane\.039_330|object_535|text\.001_333|object_541)/i },
      { target: "works", pattern: /(plane\.042_331|object_537|text\.003_335|object_545)/i },
      { target: "contact", pattern: /(plane\.043_332|object_539|text\.004_336|object_547)/i },
    ];

    const assignNavTarget = (node: THREE.Object3D, target: NavTarget) => {
      node.userData.navTarget = target;
      clickableNavObjects.push(node);
    };

    const getNavTargetFromObject = (object: THREE.Object3D | null): NavTarget | null => {
      let current: THREE.Object3D | null = object;
      while (current) {
        const target = current.userData.navTarget as NavTarget | undefined;
        if (target) return target;
        current = current.parent;
      }
      return null;
    };

    const getNavTargetFromLocalHit = (hitPointWorld?: THREE.Vector3): NavTarget | null => {
      if (!modelRoot || !hitPointWorld) return null;
      const localHit = modelRoot.worldToLocal(hitPointWorld.clone());

      const inSignColumn =
        localHit.x >= -1.9 &&
        localHit.x <= 0.1 &&
        localHit.z >= -1.2 &&
        localHit.z <= 1.4;
      if (!inSignColumn) return null;

      if (localHit.y >= 0.68 && localHit.y <= 1.4) return "about";
      if (localHit.y >= 0.24 && localHit.y <= 0.67) return "skills";
      if (localHit.y >= -0.18 && localHit.y <= 0.23) return "works";
      if (localHit.y >= -0.90 && localHit.y <= -0.19) return "contact";
      return null;
    };

    const resolveExternalTargetFromObject = (
      object: THREE.Object3D | null,
      hitPointWorld?: THREE.Vector3,
      pointerNdc?: THREE.Vector2,
    ): ExternalTarget | null => {
      let current: THREE.Object3D | null = object;

      while (current) {
        const name = current.name.toLowerCase();
        if (!name) {
          current = current.parent;
          continue;
        }

        // Only trust explicit names to avoid misclassification from generic parent names.
        if (
          name.includes("mail_icon") ||
          name.includes("object_402") ||
          name.includes("object_403") ||
          name.includes("object_3.002_235") ||
          name.includes("sketchfab_model.007_237")
        ) {
          return "facebook";
        }
        if (
          name.includes("curve.012_0_246") ||
          name.includes("object_4.004_245") ||
          name.includes("object_423") ||
          name.includes("object_424") ||
          name.includes("sketchfab_model.008_249")
        ) {
          return "github";
        }
        if (
          name.includes("cube_0_251") ||
          name.includes("object_4.005_250") ||
          name.includes("object_430") ||
          name.includes("object_431") ||
          name.includes("sketchfab_model.009_255")
        ) {
          return "linkedin";
        }

        current = current.parent;
      }

      // Fallback by local hit position on right icon row (mail/github/linkedin).
      if (modelRoot && hitPointWorld) {
        const localHit = modelRoot.worldToLocal(hitPointWorld.clone());
        const inIconRow =
          localHit.x >= 0.32 &&
          localHit.x <= 1.28 &&
          localHit.y >= 0.05 &&
          localHit.y <= 0.78 &&
          localHit.z >= 0.18 &&
          localHit.z <= 1.28;

        if (inIconRow) {
          if (localHit.x < 0.64) return "facebook";
          if (localHit.x < 0.98) return "github";
          return "linkedin";
        }
      }

      void hitPointWorld;
      void pointerNdc;

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
        clickableNavObjects.length = 0;

        modelRoot.traverse((child) => {
          if (!(child as THREE.Mesh).isMesh) return;
          const mesh = child as THREE.Mesh;
          mesh.castShadow = false;
          mesh.receiveShadow = false;

          const lowerName = mesh.name.toLowerCase();
          for (const { target, pattern } of navLabelPatterns) {
            if (pattern.test(lowerName)) {
              assignNavTarget(mesh, target);
              break;
            }
          }
        });

        if (clickableNavObjects.length === 0) {
          // Fallback by traversal for non-mesh wrappers or transformed text groups.
          modelRoot.traverse((child) => {
            if (!child.name) return;
            for (const { target, pattern } of navLabelPatterns) {
              if (pattern.test(child.name)) {
                assignNavTarget(child, target);
                break;
              }
            }
          });
        }

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
      const navHits = raycaster.intersectObjects(clickableNavObjects, true);
      const isHover = hits.length > 0;

      const navTarget =
        (navHits.length > 0 ? getNavTargetFromObject(navHits[0].object) : null) ??
        (hits.length > 0 ? getNavTargetFromLocalHit(hits[0].point) : null);
      const isMenuHover = Boolean(navTarget);
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
      const navHits = raycaster.intersectObjects(clickableNavObjects, true);

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

      if (navHits.length > 0) {
        const navTarget = getNavTargetFromObject(navHits[0].object);
        if (navTarget) {
          scrollToSection(navTarget);
          return;
        }
      }

      if (hits.length > 0) {
        const navTarget = getNavTargetFromLocalHit(hits[0].point);
        if (navTarget) {
          scrollToSection(navTarget);
          return;
        }
      }

      if (hits.length > 0) {
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

