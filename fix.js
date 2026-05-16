const fs = require('fs');
let c = fs.readFileSync('frontend/src/components/HeroThree.tsx','utf8');

const navStart = c.indexOf('    const resolveNavTargetFromObject = (');
const scrollStart = c.indexOf('    const scrollToSection = (target: NavTarget) => {');

const replacement = \    const resolveNavTargetFromObject = (
      object: THREE.Object3D | null,
      hitPointWorld?: THREE.Vector3
    ): NavTarget | null => {
      let current: THREE.Object3D | null = object;

      while (current) {
        if (!current.name) {
          current = current.parent;
          continue;
        }
        const name = current.name.toLowerCase();
        if (name.includes('text.001') || name.includes('about')) return 'about';
        if (name.includes('text.002') || name.includes('skill')) return 'skills';
        if (name.includes('text.003') || name.includes('work') || name.includes('project')) return 'works';
        if (name.includes('text.004') || name.includes('contact')) return 'contact';
        current = current.parent;
      }

      if (modelRoot && hitPointWorld) {
        const localHit = modelRoot.worldToLocal(hitPointWorld.clone());
        const isRightSide = localHit.x > 5.0 && localHit.z > 1.5;

        if (isRightSide) {
          if (localHit.y > 5.9) return 'skills';
          if (localHit.y > 4.5) return 'about';
          if (localHit.y > 3.2) return 'works';
          if (localHit.y > 1.5) return 'contact';
        }
      }

      return null;
    };

    const resolveExternalTargetFromObject = (
      object: THREE.Object3D | null,
      hitPointWorld?: THREE.Vector3
    ): ExternalTarget | null => {
      let current: THREE.Object3D | null = object;

      while (current) {
        if (!current.name) {
          current = current.parent;
          continue;
        }
        const name = current.name.toLowerCase();
        if (name.includes('facebook')) return 'facebook';
        if (name.includes('github') || name.includes('git')) return 'github';
        if (name.includes('linkedin')) return 'linkedin';
        current = current.parent;
      }

      return null;
    };

\;
c = c.substring(0, navStart) + replacement + c.substring(scrollStart);

const clickStart = c.indexOf('    const handleClick = (event: MouseEvent) => {');
const clickEnd = c.indexOf('    if (enableInteraction) {');

const clickReplacement = \    const handleClick = (event: MouseEvent) => {
      if (!modelRoot) return;

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObject(modelRoot, true);

      const externalTarget = resolveExternalTargetFromObject(
        hits[0]?.object ?? null,
        hits[0]?.point
      );
      if (externalTarget) {
        window.open(
          EXTERNAL_LINKS[externalTarget],
          '_blank',
          'noopener,noreferrer',
        );
        return;
      }

      if (hits.length > 0) {
        const navTarget = resolveNavTargetFromObject(
          hits[0].object,
          hits[0].point
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
          activeActionLabel === 'idle'
            ? 'walk'
            : activeActionLabel === 'walk'
              ? 'run'
              : 'idle';
        playAction(actions.has(nextLabel) ? nextLabel : 'idle');
      }
    };

\;
c = c.substring(0, clickStart) + clickReplacement + c.substring(clickEnd);

const pointerMoveStart = c.indexOf('    const handlePointerMove = (event: PointerEvent) => {');
const pointerLeaveStart = c.indexOf('    const handlePointerLeave = () => {');

const pointerMoveReplacement = \    const handlePointerMove = (event: PointerEvent) => {
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
        Boolean(resolveNavTargetFromObject(hits[0].object, hits[0].point));
      const isExternalHover =
        isHover &&
        Boolean(
          resolveExternalTargetFromObject(hits[0].object, hits[0].point),
        );
      renderer.domElement.style.cursor =
        isMenuHover || isExternalHover
          ? 'pointer'
          : isHover
            ? 'crosshair'
            : 'default';

      if (hovered !== isHover) {
        hovered = isHover;
        setMaterialState(modelRoot, hovered);
      }
    };

\;

c = c.substring(0, pointerMoveStart) + pointerMoveReplacement + c.substring(pointerLeaveStart);


fs.writeFileSync('frontend/src/components/HeroThree.tsx', c);
console.log('Replaced via indexOf');