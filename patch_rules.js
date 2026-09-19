import fs from 'fs';
let data = fs.readFileSync('firestore.rules', 'utf8');
data = data.replace(
  /allow update, delete: if staff\(resource\.data\.churchId\);/,
  "allow update: if staff(resource.data.churchId) || (sameChurch(resource.data.churchId) && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['registeredCount', 'updatedAt']));\n      allow delete: if staff(resource.data.churchId);"
);
fs.writeFileSync('firestore.rules', data);

