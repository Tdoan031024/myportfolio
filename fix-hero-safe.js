const fs = require('fs');

const path = 'frontend/src/components/HeroThree.tsx';
let c = fs.readFileSync(path, 'utf8');

c = c.replace(/if \(localHit\.y > -0\.5\) return "contact";/, 'if (localHit.y > -0.7) return "contact";');

// Remove pointerNdc parameter completely from resolveNavTargetFromObject
c = c.replace(
  /pointerNdc\?: THREE\.Vector2,?\s*\): NavTarget/g,
  '): NavTarget'
);

c = c.replace(
  /pointerNdc\?: THREE\.Vector2,?\s*\): ExternalTarget/g,
  '): ExternalTarget'
);

// Delete the screen space fallbacks in resolveNavTargetFromObject
c = c.replace(
  /\/\/ Final fallback by screen-space bands[\s\S]*?if \(pointerNdc\) \{[\s\S]*?return "contact";\n\s*\}\n\s*\}/,
  ''
);

// Delete the screen space fallbacks in resolveExternalTargetFromObject
c = c.replace(
  /\/\/ Stable fallback based on screen-space row[\s\S]*?return nearest;/g,
  'return null;' // Just clear it all out and return null
);

c = c.replace(
  /const navTargetByPointer = resolveNavTargetFromObject\(null, undefined, pointer\);\s*if \(navTargetByPointer\) \{\s*scrollToSection\(navTargetByPointer\);\s*\}/,
  ''
);

c = c.replace(/resolveNavTargetFromObject\(hits\[0\]\.object, hits\[0\]\.point, pointer\)/g, 'resolveNavTargetFromObject(hits[0].object, hits[0].point)');
c = c.replace(/resolveExternalTargetFromObject\(hits\[0\]\?\.object \?\? null,\s*hits\[0\]\?\.point,\s*pointer,?\s*\)/g, 'resolveExternalTargetFromObject(hits[0]?.object ?? null, hits[0]?.point)');
c = c.replace(/resolveExternalTargetFromObject\(hits\[0\]\.object, hits\[0\]\.point, pointer\)/g, 'resolveExternalTargetFromObject(hits[0].object, hits[0].point)');


fs.writeFileSync(path, c);
console.log('Fixed safe!');